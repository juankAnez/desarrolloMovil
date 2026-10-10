// app/(tabs)/mapa.tsx
import React, { useState, useRef, useMemo, Component, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  UIManager,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePhotos } from '@/hooks/usePhotos';
import { useAlbums } from '@/hooks/useAlbums';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import type { PhotoWithAlbum } from '@/db/repositories/photos';

// Error Boundary para capturar si AIRMap no está disponible en la versión de Expo Go del usuario
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn(
      'MapView nativo no disponible en Expo Go (AIRMap missing). Activando lienzo interactivo GeoMap:',
      error
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MapaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  // Hook reactivo a SQLite con soporte de filtros en vivo (C4)
  const {
    photos,
    photosWithLocation,
    removePhoto,
    searchQuery,
    setSearchQuery,
    selectedAlbumId,
    setSelectedAlbumId,
    onlyFavorites,
    setOnlyFavorites,
  } = usePhotos();

  const { albums } = useAlbums();
  const geo = useGeoLocation({ watch: true });

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithAlbum | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  // Fotos con coordenadas obtenidas directamente de la query reactiva de Drizzle
  const photosWithCoords = photosWithLocation;

  // Fotos sin coordenadas (filtradas en memoria para el cajón inferior)
  const photosWithoutCoords = useMemo(
    () => photos.filter((p) => p.latitude === null || p.longitude === null),
    [photos]
  );

  // Determinar si el componente nativo AIRMap está registrado en el UIManager
  const isAIRMapRegistered = useMemo(() => {
    try {
      if (Platform.OS === 'web') return false;
      const getVMC = (UIManager as { getViewManagerConfig?: (name: string) => unknown })
        ?.getViewManagerConfig;
      if (typeof getVMC === 'function') {
        const config = getVMC('AIRMap') || getVMC('RNMMapView');
        return Boolean(config);
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Centro inicial del mapa
  const initialRegion = useMemo(() => {
    if (geo.coords) {
      return {
        latitude: geo.coords.latitude,
        longitude: geo.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    if (photosWithCoords.length > 0 && photosWithCoords[0].latitude && photosWithCoords[0].longitude) {
      return {
        latitude: photosWithCoords[0].latitude,
        longitude: photosWithCoords[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    // Fallback: Riohacha
    return {
      latitude: 11.54444,
      longitude: -72.90722,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    };
  }, [geo.coords, photosWithCoords]);

  const handleCenterOnUser = () => {
    if (geo.coords) {
      if (isAIRMapRegistered && mapRef.current) {
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
        setCanvasOffset({ x: 0, y: 0 });
      }
    } else {
      Alert.alert(
        'Ubicación no disponible',
        'Concede permiso de ubicación en la pestaña GeoCam para centrar el mapa en tu posición actual.'
      );
    }
  };

  const handleFocusPhoto = (photo: PhotoWithAlbum) => {
    setSelectedPhoto(photo);
    if (photo.latitude && photo.longitude && isAIRMapRegistered && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: photo.latitude,
          longitude: photo.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        500
      );
    }
  };

  const confirmDeletePhoto = (photo: PhotoWithAlbum) => {
    Alert.alert(
      '¿Eliminar foto?',
      'Esta imagen y su archivo permanente se eliminarán por completo de la base de datos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await removePhoto(photo.id);
            if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
          },
        },
      ]
    );
  };

  // Proyección de coordenadas para el Lienzo Interactivo GeoMap (Fallback para Expo Go)
  const baseLat = geo.coords?.latitude ?? (photosWithCoords[0]?.latitude || 11.5444);
  const baseLng = geo.coords?.longitude ?? (photosWithCoords[0]?.longitude || -72.9072);

  const projectToScreen = (lat: number, lng: number) => {
    const scale = 4000 * zoomLevel;
    const centerX = SCREEN_WIDTH / 2 + canvasOffset.x;
    const centerY = (SCREEN_HEIGHT - 220) / 2 + canvasOffset.y;

    const x = centerX + (lng - baseLng) * scale;
    const y = centerY - (lat - baseLat) * scale;

    return { x, y };
  };

  // Render del lienzo interactivo cuando AIRMap no está en el binario de Expo Go
  const renderInteractiveCanvas = () => {
    const userPos = geo.coords ? projectToScreen(geo.coords.latitude, geo.coords.longitude) : null;

    return (
      <View style={styles.canvasContainer}>
        {/* Fondo de Cuadrícula GPS */}
        <View style={styles.gridOverlay}>
          {[-120, -60, 0, 60, 120].map((step) => (
            <View
              key={`h-${step}`}
              style={[
                styles.gridLineH,
                { top: (SCREEN_HEIGHT - 220) / 2 + step * zoomLevel },
              ]}
            />
          ))}
          {[-120, -60, 0, 60, 120].map((step) => (
            <View
              key={`v-${step}`}
              style={[
                styles.gridLineV,
                { left: SCREEN_WIDTH / 2 + step * zoomLevel },
              ]}
            />
          ))}
        </View>

        {/* Anillos de Radar GPS */}
        <View style={styles.radarRing1} />
        <View style={styles.radarRing2} />

        {/* Marcador de Posición del Usuario (GPS en vivo) */}
        {userPos && (
          <View
            style={[
              styles.userCanvasMarker,
              { left: userPos.x - 14, top: userPos.y - 14 },
            ]}
          >
            <View style={styles.userPulseRing} />
            <View style={styles.userCenterDot}>
              <Ionicons name="navigate" size={12} color="#FFFFFF" />
            </View>
            <View style={styles.userLabelPill}>
              <Text style={styles.userLabelText}>Tú (GPS en vivo)</Text>
            </View>
          </View>
        )}

        {/* Pins Interactivos con Miniatura para cada foto con GPS */}
        {photosWithCoords.map((photo, index) => {
          if (photo.latitude === null || photo.longitude === null) return null;
          const pos = projectToScreen(photo.latitude, photo.longitude);
          const isSelected = selectedPhoto?.id === photo.id;

          const staggerX = (index % 2 === 0 ? 1 : -1) * (index * 6);
          const staggerY = (index % 3 === 0 ? 1 : -1) * (index * 4);

          return (
            <TouchableOpacity
              key={photo.id}
              activeOpacity={0.8}
              onPress={() => setSelectedPhoto(photo)}
              style={[
                styles.canvasPinWrap,
                {
                  left: pos.x - 22 + staggerX,
                  top: pos.y - 48 + staggerY,
                  zIndex: isSelected ? 50 : 20,
                  transform: [{ scale: isSelected ? 1.15 : 1 }],
                },
              ]}
            >
              <View style={[styles.canvasPinCard, isSelected && styles.canvasPinSelected]}>
                <Image source={{ uri: photo.uri }} style={styles.canvasPinThumb} />
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
                    size={9}
                    color="#FFFFFF"
                  />
                </View>
                {photo.favorite && (
                  <View style={styles.pinFavBadge}>
                    <Ionicons name="star" size={8} color="#FBBF24" />
                  </View>
                )}
              </View>
              <View style={styles.pinTriangle} />
            </TouchableOpacity>
          );
        })}

        {/* Controles de Zoom del Lienzo */}
        <View style={styles.canvasZoomControls}>
          <TouchableOpacity
            style={styles.canvasControlBtn}
            onPress={() => setZoomLevel((z) => Math.min(2.5, z + 0.3))}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.canvasControlBtn}
            onPress={() => setZoomLevel((z) => Math.max(0.6, z - 0.3))}
          >
            <Ionicons name="remove" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Chip informativo de Expo Go */}
        <View style={styles.expoGoNotice}>
          <Ionicons name="shield-checkmark" size={12} color="#10B981" />
          <Text style={styles.expoGoNoticeText}>
            Modo GeoMap Activo • {photosWithCoords.length} fotos con GPS
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Si AIRMap no está en el binario nativo, se usa directamente el lienzo interactivo */}
      {!isAIRMapRegistered ? (
        renderInteractiveCanvas()
      ) : (
        <MapErrorBoundary fallback={renderInteractiveCanvas()}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={initialRegion}
            showsUserLocation={geo.permission === 'granted'}
            showsMyLocationButton={false}
          >
            {photosWithCoords.map((photo) => {
              if (photo.latitude === null || photo.longitude === null) return null;
              return (
                <Marker
                  key={photo.id}
                  coordinate={{
                    latitude: photo.latitude,
                    longitude: photo.longitude,
                  }}
                  onPress={() => setSelectedPhoto(photo)}
                >
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
                    {photo.favorite && (
                      <View style={styles.pinFavBadge}>
                        <Ionicons name="star" size={9} color="#FBBF24" />
                      </View>
                    )}
                    <View style={styles.pinTriangle} />
                  </View>

                  <Callout tooltip onPress={() => router.push(`/foto/${photo.id}` as any)}>
                    <View style={styles.calloutBox}>
                      <Text style={styles.calloutTitle}>
                        {photo.source === 'camera' ? 'Foto de Cámara' : 'Importada'}
                      </Text>
                      {photo.note ? (
                        <Text style={styles.calloutNote} numberOfLines={1}>
                          "{photo.note}"
                        </Text>
                      ) : null}
                      <Text style={styles.calloutCoords}>
                        {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}
                      </Text>
                      <Text style={styles.calloutAction}>Toca para editar ✏️</Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        </MapErrorBoundary>
      )}

      {/* Header superior translúcido con barra de búsqueda y filtros reactivos (C4) */}
      <View style={[styles.headerOverlay, { top: insets.top + 8 }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Mapa GeoCam</Text>
            <Text style={styles.headerSubtitle}>
              {photosWithCoords.length} con GPS • {photosWithoutCoords.length} sin GPS
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
              size={20}
              color={geo.coords ? '#10B981' : '#E4E4E7'}
            />
          </TouchableOpacity>
        </View>

        {/* Campo de búsqueda reactiva por texto libre en note (C4) */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#A1A1AA" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar notas en vivo..."
            placeholderTextColor="#71717A"
            style={styles.searchInput}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color="#A1A1AA" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros reactivos por álbum y favoritos (C4) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {/* Toggle Solo Favoritos */}
          <TouchableOpacity
            style={[styles.filterChip, onlyFavorites && styles.filterChipActiveGold]}
            onPress={() => setOnlyFavorites(!onlyFavorites)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={onlyFavorites ? 'star' : 'star-outline'}
              size={13}
              color={onlyFavorites ? '#F59E0B' : '#A1A1AA'}
            />
            <Text style={[styles.filterChipText, onlyFavorites && styles.filterChipTextActiveGold]}>
              Favoritos
            </Text>
          </TouchableOpacity>

          {/* Chip Todos los álbumes */}
          <TouchableOpacity
            style={[styles.filterChip, selectedAlbumId === null && styles.filterChipActive]}
            onPress={() => setSelectedAlbumId(null)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedAlbumId === null && styles.filterChipTextActive,
              ]}
            >
              Todos ({photos.length})
            </Text>
          </TouchableOpacity>

          {/* Chips dinámicos por Álbum */}
          {albums.map((album) => {
            const isSelected = selectedAlbumId === album.id;
            return (
              <TouchableOpacity
                key={album.id}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedAlbumId(isSelected ? null : album.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="folder-outline"
                  size={12}
                  color={isSelected ? '#10B981' : '#A1A1AA'}
                />
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {album.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tarjeta flotante de foto seleccionada con acceso directo a CRUD (C3) */}
      {selectedPhoto && (
        <View style={[styles.selectedCard, { bottom: 155 }]}>
          <Image source={{ uri: selectedPhoto.uri }} style={styles.selectedImg} />
          <View style={styles.selectedMeta}>
            <View style={styles.selectedRow}>
              <View style={styles.badgeRow}>
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
                {selectedPhoto.albumName && (
                  <View style={styles.albumBadge}>
                    <Text style={styles.albumBadgeText} numberOfLines={1}>
                      📁 {selectedPhoto.albumName}
                    </Text>
                  </View>
                )}
                {selectedPhoto.favorite && (
                  <Ionicons name="star" size={14} color="#F59E0B" style={{ marginLeft: 4 }} />
                )}
              </View>

              <TouchableOpacity
                onPress={() => setSelectedPhoto(null)}
                style={styles.closeCardIcon}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={18} color="#A1A1AA" />
              </TouchableOpacity>
            </View>

            {selectedPhoto.note ? (
              <Text style={styles.selectedNote} numberOfLines={2}>
                "{selectedPhoto.note}"
              </Text>
            ) : null}

            {selectedPhoto.latitude !== null && selectedPhoto.longitude !== null ? (
              <Text style={styles.selectedCoords}>
                📍 {selectedPhoto.latitude.toFixed(4)}, {selectedPhoto.longitude.toFixed(4)}
              </Text>
            ) : (
              <Text style={styles.selectedNoCoords}>⚠️ Sin coordenadas GPS</Text>
            )}

            <View style={styles.selectedActions}>
              <TouchableOpacity
                onPress={() => router.push(`/foto/${selectedPhoto.id}` as any)}
                style={styles.editBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={14} color="#10B981" />
                <Text style={styles.editText}>Ver / Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => confirmDeletePhoto(selectedPhoto)}
                style={styles.deleteBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Sección inferior: Fotos sin ubicación (Requisito R3 de la guía) */}
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
                {item.favorite && (
                  <View style={styles.drawerFavBadge}>
                    <Ionicons name="star" size={8} color="#FBBF24" />
                  </View>
                )}
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
  canvasContainer: {
    flex: 1,
    backgroundColor: '#0A0E17',
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  radarRing1: {
    position: 'absolute',
    top: (SCREEN_HEIGHT - 220) / 2 - 90,
    left: SCREEN_WIDTH / 2 - 90,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.12)',
  },
  radarRing2: {
    position: 'absolute',
    top: (SCREEN_HEIGHT - 220) / 2 - 160,
    left: SCREEN_WIDTH / 2 - 160,
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.06)',
  },
  userCanvasMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPulseRing: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
  },
  userCenterDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLabelPill: {
    position: 'absolute',
    top: 26,
    backgroundColor: 'rgba(9, 9, 11, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  userLabelText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '700',
  },
  canvasPinWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  canvasPinCard: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  canvasPinSelected: {
    borderColor: '#10B981',
    borderWidth: 3.5,
  },
  canvasPinThumb: {
    width: '100%',
    height: '100%',
  },
  pinFavBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    backgroundColor: '#09090B',
    borderRadius: 6,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },
  canvasZoomControls: {
    position: 'absolute',
    right: 16,
    top: 170,
    gap: 8,
    zIndex: 30,
  },
  canvasControlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(24, 24, 27, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  expoGoNotice: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(9, 9, 11, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  expoGoNoticeText: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '600',
  },
  headerOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: 'rgba(15, 15, 20, 0.92)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 10,
    gap: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    padding: 0,
  },
  filtersScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  filterChipActiveGold: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#F59E0B',
  },
  filterChipText: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#10B981',
    fontWeight: '700',
  },
  filterChipTextActiveGold: {
    color: '#F59E0B',
    fontWeight: '700',
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
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
    marginTop: -1,
  },
  calloutBox: {
    backgroundColor: '#09090B',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 150,
  },
  calloutTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  calloutNote: {
    color: '#D4D4D8',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  calloutCoords: {
    color: '#10B981',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  calloutAction: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
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
  albumBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    maxWidth: 90,
  },
  albumBadgeText: {
    color: '#D4D4D8',
    fontSize: 9,
    fontWeight: '600',
  },
  closeCardIcon: {
    padding: 2,
  },
  selectedNote: {
    color: '#E4E4E7',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
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
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
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
  drawerFavBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 2,
    borderRadius: 4,
  },
});
