// hooks/useAlbums.ts
import { useCallback } from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { albumsRepo } from '@/db/repositories/albums';
import type { Album } from '@/db/schema';

export function useAlbums() {
  const { data: rawAlbums, error } = useLiveQuery(albumsRepo.listQuery());
  const albums: Album[] = rawAlbums ?? [];

  const createAlbum = useCallback(async (name: string) => {
    return albumsRepo.create(name);
  }, []);

  const removeAlbum = useCallback(async (id: number) => {
    return albumsRepo.remove(id);
  }, []);

  return {
    albums,
    createAlbum,
    removeAlbum,
    error,
  };
}
