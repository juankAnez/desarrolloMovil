// app/(tabs)/mapa.tsx
import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGeoPhotos } from '@/context/GeoPhotosContext';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import type { GeoPhoto } from '@/types/geo';

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const { photos, removePhoto, clearAll } = useGeoPhotos();
  const geo = useGeoLocation({ watch: true });

  const [selectedPhoto, setSelectedPhoto] = useState<GeoPhoto | null>(null);

  // Separar fotos con y sin coordenadas (Requisito R3)
  const photosWithCoords = useMemo(
    () => photos.filter((p) => p.coords !== null),
    [photos]
  );

  const photosWithoutCoords = useMemo(
    () => photos.filter((p) => p.coords === null),
    [photos]
  );

  // Centro inicial del mapa: ubicación actual -> última foto con GPS -> fallback
  const initialRegion = useMemo(() => {
    if (geo.coords) {
      return {
        latitude: geo.coords.latitude,
        longitude: geo.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    if (photosWithCoords.length > 0 && photosWithCoords[0].coords) {
      return {
        latitude: photosWithCoords[0].coords.latitude,
        longitude: photosWithCoords[0].coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    // Fallback: Riohacha / Colombia
    return {
      latitude: 11.54444,
      longitude: -72.90722,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    };
  }, [geo.coords, photosWithCoords]);

  const handleCenterOnUser = () => {
    if (geo.coords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: geo.coords.latitude,
          longitude: geo.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        600
      );
    } else {
      Alert.alert(
        'Ubicación no disponible',
        'Concede permiso de ubicación en GeoCam para centrar el mapa en tu posición actual.'
      );
    }
  };

  const handleFocusPhoto = (photo: GeoPhoto) => {
    setSelectedPhoto(photo);
    if (photo.coords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: photo.coords.latitude,
          longitude: photo.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        500
      );
    }
  };

  const confirmDeletePhoto = (photo: GeoPhoto) => {
    Alert.alert(
      '¿Eliminar foto?',
      'Esta imagen será removida del mapa y de GeoCam.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removePhoto(photo.id);
            if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Mapa interactivo */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        showsUserLocation={geo.permission === 'granted'}
        showsMyLocationButton={false}
      >
        {photosWithCoords.map((photo) => {
          if (!photo.coords) return null;
          return (
            <Marker
              key={photo.id}
              coordinate={{
                latitude: photo.coords.latitude,
                longitude: photo.coords.longitude,
              }}
              onPress={() => setSelectedPhoto(photo)}
            >
              {/* Pin personalizado con miniatura */}
              <View style={styles.customPin}>
                <Image source={{ uri: photo.uri }} style={styles.pinImage} />
                <View
                  style={[
                    styles.pinBadge,
                    {
                      backgroundColor:
                        photo.source === 'camera' ? '#10B981' : '#3B82F6',
                    },
                  ]}
                >
                  <Ionicons
                    name={photo.source === 'camera' ? 'camera' : 'image'}
                    size={10}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.pinTriangle} />
              </View>

              {/* Callout al tocar el marker */}
              <Callout tooltip onPress={() => setSelectedPhoto(photo)}>
                <View style={styles.calloutBox}>
                  <Text style={styles.calloutTitle}>
                    {photo.source === 'camera' ? 'Foto de Cámara' : 'Importada'}
                  </Text>
                  <Text style={styles.calloutCoords}>
                    {photo.coords.latitude.toFixed(4)}, {photo.coords.longitude.toFixed(4)}
                  </Text>
                  <Text style={styles.calloutDate}>
                    {new Date(photo.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Header superior translúcido */}
      <View style={[styles.headerOverlay, { top: insets.top + 10 }]}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Mapa GeoCam</Text>
          <Text style={styles.headerSubtitle}>
            {photosWithCoords.length} en el mapa • {photosWithoutCoords.length} sin GPS
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCenterOnUser}
          style={styles.gpsButton}
          activeOpacity={0.8}
          accessibilityLabel="Mi ubicación"
        >
          <Ionicons
            name={geo.coords ? 'locate' : 'locate-outline'}
            size={22}
            color={geo.coords ? '#10B981' : '#E4E4E7'}
          />
        </TouchableOpacity>
      </View>

      {/* Tarjeta de foto seleccionada */}
      {selectedPhoto && (
        <View style={[styles.selectedCard, { bottom: 155 }]}>
          <Image source={{ uri: selectedPhoto.uri }} style={styles.selectedImg} />
          <View style={styles.selectedMeta}>
            <View style={styles.selectedRow}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      selectedPhoto.source === 'camera' ? '#064E3B' : '#1E3A8A',
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {selectedPhoto.source === 'camera' ? 'CÁMARA' : 'GALERÍA'}
                </Text>
              </View>
              <Text style={styles.selectedDate}>
                {new Date(selectedPhoto.createdAt).toLocaleDateString()}
              </Text>
            </View>

            {selectedPhoto.coords ? (
              <Text style={styles.selectedCoords}>
                📍 {selectedPhoto.coords.latitude.toFixed(5)},{' '}
                {selectedPhoto.coords.longitude.toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.selectedNoCoords}>⚠️ Sin coordenadas</Text>
            )}

            <View style={styles.selectedActions}>
              <TouchableOpacity
                onPress={() => confirmDeletePhoto(selectedPhoto)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedPhoto(null)}
                style={styles.closeCardBtn}
              >
                <Text style={styles.closeCardText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Sección inferior: Fotos sin ubicación (Requisito R3) */}
      <View style={[styles.bottomDrawer, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.drawerHeader}>
          <Ionicons name="location-outline" size={16} color="#F59E0B" />
          <Text style={styles.drawerTitle}>
            Fotos sin ubicación ({photosWithoutCoords.length})
          </Text>
        </View>

        {photosWithoutCoords.length === 0 ? (
          <Text style={styles.drawerEmptyText}>
            Todas tus fotos tienen coordenadas GPS asignadas 🎉
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.drawerScroll}
          >
            {photosWithoutCoords.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleFocusPhoto(item)}
                style={styles.drawerThumbCard}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.uri }} style={styles.drawerThumb} />
                <View style={styles.drawerThumbBadge}>
                  <Text style={styles.drawerThumbBadgeText}>
                    {item.source === 'camera' ? 'CAM' : 'GAL'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  headerOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(9, 9, 11, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#A1A1AA',
    marginTop: 1,
  },
  gpsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  customPin: {
    alignItems: 'center',
  },
  pinImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#000',
  },
  pinBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  pinTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
    marginTop: -2,
  },
  calloutBox: {
    backgroundColor: '#09090B',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 140,
  },
  calloutTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  calloutCoords: {
    color: '#10B981',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  calloutDate: {
    color: '#A1A1AA',
    fontSize: 10,
    marginTop: 2,
  },
  selectedCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  selectedImg: {
    width: 76,
    height: 76,
    borderRadius: 12,
    marginRight: 12,
  },
  selectedMeta: {
    flex: 1,
    justifyContent: 'space-between',
  },
  selectedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  selectedDate: {
    color: '#A1A1AA',
    fontSize: 11,
  },
  selectedCoords: {
    color: '#10B981',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  selectedNoCoords: {
    color: '#F59E0B',
    fontSize: 11,
    marginTop: 4,
  },
  selectedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  closeCardBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  closeCardText: {
    color: '#D4D4D8',
    fontSize: 12,
  },
  bottomDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121215',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  drawerTitle: {
    color: '#E4E4E7',
    fontSize: 12,
    fontWeight: '700',
  },
  drawerEmptyText: {
    color: '#71717A',
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  drawerScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  drawerThumbCard: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  drawerThumb: {
    width: 60,
    height: 60,
  },
  drawerThumbBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  drawerThumbBadgeText: {
    color: '#F59E0B',
    fontSize: 8,
    fontWeight: '800',
  },
});
