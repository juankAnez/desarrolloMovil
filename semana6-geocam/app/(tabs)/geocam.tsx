// app/(tabs)/geocam.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCamera } from '@/hooks/useCamera';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { useGeoPhotos } from '@/context/GeoPhotosContext';
import { PermissionPrimer } from '@/components/PermissionPrimer';
import type { Coords, GeoPhoto } from '@/types/geo';

export default function GeoCamScreen() {
  const insets = useSafeAreaInsets();
  const cam = useCamera();
  const geo = useGeoLocation({ watch: true });
  const { addPhoto, lastPhoto } = useGeoPhotos();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-cerrar mensaje toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 1. Estado de verificación de permiso de cámara
  if (cam.permissionState === 'checking') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Iniciando cámara...</Text>
      </View>
    );
  }

  // 2. Permiso no concedido: mostrar PermissionPrimer con explicación
  if (cam.permissionState !== 'granted') {
    return (
      <PermissionPrimer
        title="GeoCam necesita tu cámara"
        description="La usamos solo para capturar fotos geolocalizadas que tú decidas guardar."
        state={cam.permissionState}
        onRequest={cam.requestPermission}
        onOpenSettings={cam.openSettings}
      />
    );
  }

  // 3. Captura con cámara
  const handleCapture = async () => {
    const photo = await cam.takePhoto();
    if (!photo) return;

    // Degradación elegante: si no hay permiso de ubicación, coords queda en null
    const coords: Coords | null =
      geo.permission === 'granted'
        ? geo.coords ?? (await geo.getCurrent())
        : null;

    const newPhoto: GeoPhoto = {
      id: String(Date.now()),
      uri: photo.uri,
      coords,
      source: 'camera',
      createdAt: Date.now(),
    };

    addPhoto(newPhoto);
    setToastMessage(
      coords
        ? '📸 Foto guardada con coordenadas GPS'
        : '📸 Foto guardada (sin ubicación GPS)'
    );
  };

  // 4. Importar desde Galería (Requisito R2 + Reto EXIF)
  const handleImportGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        exif: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        let coords: Coords | null = null;

        // Reto opcional: intentar extraer EXIF si la foto ya tenía coordenadas
        if (asset.exif) {
          const lat = asset.exif.GPSLatitude;
          const lng = asset.exif.GPSLongitude;
          if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
            coords = {
              latitude: lat,
              longitude: lng,
              accuracy: null,
              timestamp: Date.now(),
            };
          }
        }

        // Si no tenía EXIF, asociar ubicación actual si hay permiso concedido
        if (!coords && geo.permission === 'granted') {
          coords = geo.coords ?? (await geo.getCurrent());
        }

        const newPhoto: GeoPhoto = {
          id: String(Date.now()),
          uri: asset.uri,
          coords,
          source: 'gallery',
          createdAt: Date.now(),
        };

        addPhoto(newPhoto);
        setToastMessage(
          coords
            ? '🖼️ Foto importada con ubicación'
            : '🖼️ Foto importada (sin coordenadas)'
        );
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la galería');
    }
  };

  const isApproximate =
    geo.coords?.accuracy != null && geo.coords.accuracy > 1000;

  return (
    <View style={styles.container}>
      {/* CameraView sin hijos: los controles van como hermanos absolutos */}
      <CameraView
        ref={cam.cameraRef}
        style={StyleSheet.absoluteFill}
        facing={cam.facing}
        onCameraReady={cam.onCameraReady}
      />

      {/* Banner de ubicación: pedir en contexto sin bloquear la cámara */}
      {geo.permission !== 'granted' && geo.permission !== 'checking' && (
        <Pressable
          onPress={
            geo.permission === 'blocked'
              ? geo.openSettings
              : geo.requestPermission
          }
          style={[styles.locationBanner, { top: insets.top + 10 }]}
        >
          <Ionicons
            name={geo.permission === 'blocked' ? 'settings-outline' : 'location-outline'}
            size={18}
            color="#09090B"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.locationBannerText}>
            {geo.permission === 'blocked'
              ? 'GPS bloqueado. Toca para abrir Ajustes'
              : 'Activa la ubicación para etiquetar tus fotos'}
          </Text>
        </Pressable>
      )}

      {/* Coordenadas en vivo en tiempo real */}
      {geo.coords && (
        <View style={[styles.coordsCard, { top: insets.top + 10 }]}>
          <View style={styles.coordsHeader}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabel}>GPS EN VIVO</Text>
          </View>
          <Text style={styles.coordsText}>
            {geo.coords.latitude.toFixed(5)}, {geo.coords.longitude.toFixed(5)}
          </Text>
          <Text style={styles.accuracyText}>
            Precisión: ±{Math.round(geo.coords.accuracy ?? 0)} m
          </Text>
          {isApproximate && (
            <Text style={styles.approxWarning}>⚠️ Ubicación aproximada</Text>
          )}
        </View>
      )}

      {/* Toast de confirmación flotante */}
      {toastMessage && (
        <View style={[styles.toast, { top: insets.top + 80 }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Controles inferiores de la cámara */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {/* Botón de galería (R2) con miniatura o icono */}
        <Pressable
          onPress={handleImportGallery}
          style={styles.galleryButton}
          accessibilityLabel="Importar de galería"
        >
          {lastPhoto ? (
            <View style={styles.previewWrap}>
              <Image source={{ uri: lastPhoto.uri }} style={styles.previewThumb} />
              <View
                style={[
                  styles.sourceTag,
                  { backgroundColor: lastPhoto.source === 'camera' ? '#10B981' : '#3B82F6' },
                ]}
              >
                <Ionicons
                  name={lastPhoto.source === 'camera' ? 'camera' : 'image'}
                  size={10}
                  color="#FFFFFF"
                />
              </View>
            </View>
          ) : (
            <View style={styles.galleryPlaceholder}>
              <Ionicons name="images-outline" size={24} color="#FFFFFF" />
            </View>
          )}
          <Text style={styles.controlLabel}>Galería</Text>
        </Pressable>

        {/* Botón central de Captura */}
        <Pressable
          onPress={handleCapture}
          disabled={cam.isCapturing}
          style={({ pressed }) => [
            styles.shutterOuter,
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
          accessibilityLabel="Tomar foto"
        >
          <View
            style={[
              styles.shutterInner,
              { backgroundColor: cam.isCapturing ? '#71717A' : '#FFFFFF' },
            ]}
          />
        </Pressable>

        {/* Botón cambiar cámara (frontal / trasera) */}
        <Pressable
          onPress={cam.toggleFacing}
          style={styles.flipButton}
          accessibilityLabel="Cambiar cámara"
        >
          <View style={styles.flipCircle}>
            <Ionicons name="camera-reverse-outline" size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.controlLabel}>Voltear</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#09090B',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#D4D4D8',
    fontSize: 15,
    fontWeight: '600',
  },
  locationBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  locationBannerText: {
    color: '#09090B',
    fontSize: 13,
    fontWeight: '700',
  },
  coordsCard: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'rgba(9, 9, 11, 0.75)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 10,
  },
  coordsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveLabel: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  coordsText: {
    color: '#E4E4E7',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  accuracyText: {
    color: '#A1A1AA',
    fontSize: 10,
    marginTop: 1,
  },
  approxWarning: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  toastText: {
    color: '#09090B',
    fontSize: 13,
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  galleryButton: {
    alignItems: 'center',
    width: 70,
  },
  previewWrap: {
    position: 'relative',
    width: 54,
    height: 54,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  previewThumb: {
    width: '100%',
    height: '100%',
  },
  sourceTag: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderRadius: 4,
    padding: 2,
  },
  galleryPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shutterInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  flipButton: {
    alignItems: 'center',
    width: 70,
  },
  flipCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlLabel: {
    color: '#E4E4E7',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
