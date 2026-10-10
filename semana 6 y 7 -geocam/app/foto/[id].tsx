// app/foto/[id].tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { photosRepo, type PhotoWithAlbum } from '@/db/repositories/photos';
import { useAlbums } from '@/hooks/useAlbums';

export default function FotoDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const photoId = id ? Number(id) : null;

  const [photo, setPhoto] = useState<PhotoWithAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { albums } = useAlbums();

  useEffect(() => {
    if (!photoId) return;
    setLoading(true);
    photosRepo
      .findById(photoId)
      .then((data) => {
        if (data) {
          setPhoto(data);
          setNote(data.note ?? '');
          setIsFavorite(data.favorite);
          setSelectedAlbumId(data.albumId);
        }
      })
      .catch((err) => {
        console.error('Error cargando foto:', err);
        Alert.alert('Error', 'No se pudo cargar la información de la fotografía.');
      })
      .finally(() => setLoading(false));
  }, [photoId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Cargando fotografía...</Text>
      </View>
    );
  }

  if (!photo) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="image-outline" size={64} color="#71717A" />
        <Text style={styles.notFoundText}>Fotografía no encontrada</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  // Alternar favorito de inmediato
  const handleToggleFavorite = async () => {
    try {
      const nextFav = !isFavorite;
      setIsFavorite(nextFav);
      await photosRepo.update(photo.id, { favorite: nextFav });
    } catch (err) {
      console.error('Error al cambiar favorito:', err);
      setIsFavorite(!isFavorite);
    }
  };

  // Mover de álbum
  const handleSelectAlbum = async (newAlbumId: number | null) => {
    try {
      setSelectedAlbumId(newAlbumId);
      await photosRepo.update(photo.id, { albumId: newAlbumId });
    } catch (err) {
      console.error('Error al cambiar álbum:', err);
    }
  };

  // Guardar cambios en la nota
  const handleSaveNote = async () => {
    try {
      setSaving(true);
      await photosRepo.update(photo.id, { note: note.trim() || null });
      Alert.alert('Guardado', 'La nota de la fotografía fue actualizada correctamente.');
    } catch (err) {
      console.error('Error al guardar nota:', err);
      Alert.alert('Error', 'No se pudo guardar la nota.');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar con confirmación (C3 y C5: borra de SQLite y del sistema de archivos)
  const handleDeletePhoto = () => {
    Alert.alert(
      'Eliminar Fotografía',
      '¿Estás seguro de que deseas eliminar permanentemente esta foto y su archivo local?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await photosRepo.remove(photo.id);
              router.back();
            } catch (err) {
              console.error('Error al eliminar foto:', err);
              Alert.alert('Error', 'No se pudo eliminar la fotografía.');
            }
          },
        },
      ]
    );
  };

  const hasCoords = photo.latitude !== null && photo.longitude !== null;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen principal */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="cover" />

          {/* Botón flotante de Favorito */}
          <Pressable style={styles.favoriteBadge} onPress={handleToggleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#EF4444' : '#FFFFFF'}
            />
          </Pressable>

          {/* Badge de origen (cámara o galería) */}
          <View style={styles.sourceBadge}>
            <Ionicons
              name={photo.source === 'camera' ? 'camera' : 'images'}
              size={14}
              color="#FFFFFF"
            />
            <Text style={styles.sourceBadgeText}>
              {photo.source === 'camera' ? 'Cámara' : 'Galería'}
            </Text>
          </View>
        </View>

        {/* Metadatos y GPS */}
        <View style={styles.metadataCard}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color="#10B981" />
            <Text style={styles.metaText}>
              {new Date(photo.createdAt).toLocaleString('es-CO', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </Text>
          </View>

          {hasCoords ? (
            <View style={styles.metaRow}>
              <Ionicons name="location-sharp" size={16} color="#3B82F6" />
              <Text style={styles.metaText}>
                {photo.latitude?.toFixed(5)}, {photo.longitude?.toFixed(5)}
                {photo.accuracy ? ` (±${Math.round(photo.accuracy)}m)` : ''}
              </Text>
            </View>
          ) : (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={16} color="#71717A" />
              <Text style={styles.metaTextMuted}>Sin coordenadas GPS registradas</Text>
            </View>
          )}
        </View>

        {/* Selector de Álbum (C1 y C3) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Álbum asignado</Text>
          <View style={styles.chipsContainer}>
            {/* Opción Sin Álbum */}
            <Pressable
              style={[
                styles.chip,
                selectedAlbumId === null && styles.chipActive,
              ]}
              onPress={() => handleSelectAlbum(null)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedAlbumId === null && styles.chipTextActive,
                ]}
              >
                Sin álbum
              </Text>
            </Pressable>

            {/* Álbumes existentes */}
            {albums.map((alb) => {
              const active = selectedAlbumId === alb.id;
              return (
                <Pressable
                  key={alb.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => handleSelectAlbum(alb.id)}
                >
                  <Ionicons
                    name="folder-outline"
                    size={14}
                    color={active ? '#FFFFFF' : '#A1A1AA'}
                  />
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {alb.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Edición de Nota (C2 y C3) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Nota descriptiva</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Añade una nota o descripción para buscar esta foto..."
            placeholderTextColor="#71717A"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Pressable
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSaveNote}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Guardar Nota</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Botón de Eliminación Destructiva (C3 y C5) */}
        <Pressable style={styles.deleteButton} onPress={handleDeletePhoto}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Eliminar esta fotografía</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#09090B',
    padding: 24,
  },
  loadingText: {
    color: '#A1A1AA',
    fontSize: 14,
    marginTop: 12,
  },
  notFoundText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  backButton: {
    marginTop: 16,
    backgroundColor: '#27272A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#18181B',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  metadataCard: {
    backgroundColor: '#18181B',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaText: {
    color: '#E4E4E7',
    fontSize: 14,
    fontWeight: '500',
  },
  metaTextMuted: {
    color: '#71717A',
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: '#18181B',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  sectionTitle: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  chipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  chipText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  noteInput: {
    backgroundColor: '#09090B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
    minHeight: 80,
  },
  saveButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#271214',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7F1D1D',
    gap: 8,
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});
