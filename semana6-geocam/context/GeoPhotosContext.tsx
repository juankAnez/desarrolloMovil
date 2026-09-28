// context/GeoPhotosContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { GeoPhoto } from '@/types/geo';

interface GeoPhotosContextType {
  photos: GeoPhoto[];
  addPhoto: (photo: GeoPhoto) => void;
  removePhoto: (id: string) => void;
  clearAll: () => void;
  lastPhoto: GeoPhoto | null;
}

const GeoPhotosContext = createContext<GeoPhotosContextType | undefined>(undefined);

// Fotos iniciales de muestra para pruebas inmediatas si se desea
const INITIAL_PHOTOS: GeoPhoto[] = [
  {
    id: 'sample-1',
    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    coords: {
      latitude: 11.54444,
      longitude: -72.90722,
      accuracy: 8,
      timestamp: Date.now() - 3600000,
    },
    source: 'camera',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'sample-2',
    uri: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
    coords: {
      latitude: 11.54800,
      longitude: -72.91200,
      accuracy: 12,
      timestamp: Date.now() - 7200000,
    },
    source: 'gallery',
    createdAt: Date.now() - 7200000,
  },
];

export const GeoPhotosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [photos, setPhotos] = useState<GeoPhoto[]>(INITIAL_PHOTOS);

  // R1: Actualizaciones inmutables
  const addPhoto = useCallback((photo: GeoPhoto) => {
    setPhotos((prev) => [photo, ...prev]);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setPhotos([]);
  }, []);

  const lastPhoto = photos.length > 0 ? photos[0] : null;

  return (
    <GeoPhotosContext.Provider
      value={{
        photos,
        addPhoto,
        removePhoto,
        clearAll,
        lastPhoto,
      }}
    >
      {children}
    </GeoPhotosContext.Provider>
  );
};

export const useGeoPhotos = (): GeoPhotosContextType => {
  const context = useContext(GeoPhotosContext);
  if (!context) {
    throw new Error('useGeoPhotos debe ser usado dentro de GeoPhotosProvider');
  }
  return context;
};
