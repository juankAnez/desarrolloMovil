// hooks/usePhotos.ts
import { useState, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { photosRepo, type PhotoWithAlbum } from '@/db/repositories/photos';
import { persistPhoto } from '@/services/photoFiles';
import type { Coords } from '@/types/geo';

export interface AddPhotoInput {
  uri: string;
  coords: Coords | null;
  source: 'camera' | 'gallery';
  note?: string;
  albumId?: number | null;
  favorite?: boolean;
}

export function usePhotos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Filtros reactivos para useLiveQuery
  const filterOptions = useMemo(
    () => ({
      searchQuery,
      albumId: selectedAlbumId,
      onlyFavorites,
    }),
    [searchQuery, selectedAlbumId, onlyFavorites]
  );

  // Consultas reactivas: se recalculan automáticamente al cambiar los filtros o los datos
  const { data: rawPhotos, error: photosError } = useLiveQuery(
    photosRepo.listQuery(filterOptions),
    [searchQuery, selectedAlbumId, onlyFavorites]
  );

  const { data: rawWithLocation, error: locationError } = useLiveQuery(
    photosRepo.withLocationQuery(filterOptions),
    [searchQuery, selectedAlbumId, onlyFavorites]
  );

  const photos: PhotoWithAlbum[] = rawPhotos ?? [];
  const photosWithLocation: PhotoWithAlbum[] = rawWithLocation ?? [];
  const lastPhoto = photos.length > 0 ? photos[0] : null;

  // Agregar foto: persiste en el sistema de archivos permanente y aplana las coordenadas GPS
  const addPhoto = useCallback(async (input: AddPhotoInput) => {
    // 1. Guardar copia permanente en la carpeta de documentos (C5)
    const permanentUri = persistPhoto(input.uri);

    // 2. Aplanar coordenadas para la base de datos (T4)
    await photosRepo.create({
      uri: permanentUri,
      latitude: input.coords?.latitude ?? null,
      longitude: input.coords?.longitude ?? null,
      accuracy: input.coords?.accuracy ?? null,
      source: input.source,
      note: input.note?.trim() || null,
      albumId: input.albumId ?? null,
      favorite: input.favorite ?? false,
    });
  }, []);

  const updatePhoto = useCallback(
    async (
      id: number,
      data: Partial<{ note: string | null; albumId: number | null; favorite: boolean }>
    ) => {
      await photosRepo.update(id, data);
    },
    []
  );

  const toggleFavorite = useCallback(async (id: number, currentStatus: boolean) => {
    await photosRepo.toggleFavorite(id, currentStatus);
  }, []);

  const removePhoto = useCallback(async (id: number) => {
    await photosRepo.remove(id);
  }, []);

  const clearAll = useCallback(async () => {
    await photosRepo.clearAll();
  }, []);

  return {
    photos,
    photosWithLocation,
    lastPhoto,
    addPhoto,
    updatePhoto,
    toggleFavorite,
    removePhoto,
    clearAll,
    // Estados y controles de filtros reactivos (C4)
    searchQuery,
    setSearchQuery,
    selectedAlbumId,
    setSelectedAlbumId,
    onlyFavorites,
    setOnlyFavorites,
    error: photosError || locationError,
  };
}
