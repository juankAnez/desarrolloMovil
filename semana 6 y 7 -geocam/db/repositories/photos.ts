// db/repositories/photos.ts
import { and, desc, eq, isNotNull, like } from 'drizzle-orm';
import { db } from '@/db/client';
import { albums, photos, type NewPhoto } from '@/db/schema';
import { deletePhotoFile } from '@/services/photoFiles';

export interface PhotoFilterOptions {
  searchQuery?: string;
  albumId?: number | null;
  onlyFavorites?: boolean;
}

export type PhotoWithAlbum = {
  id: number;
  uri: string;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  source: 'camera' | 'gallery';
  albumId: number | null;
  albumName: string | null;
  note: string | null;
  favorite: boolean;
  createdAt: Date;
};

export const photosRepo = {
  listQuery(options?: PhotoFilterOptions) {
    const conditions = [];

    if (options?.searchQuery && options.searchQuery.trim().length > 0) {
      conditions.push(like(photos.note, `%${options.searchQuery.trim()}%`));
    }

    if (options?.albumId !== undefined && options?.albumId !== null) {
      conditions.push(eq(photos.albumId, options.albumId));
    }

    if (options?.onlyFavorites) {
      conditions.push(eq(photos.favorite, true));
    }

    const query = db
      .select({
        id: photos.id,
        uri: photos.uri,
        latitude: photos.latitude,
        longitude: photos.longitude,
        accuracy: photos.accuracy,
        source: photos.source,
        albumId: photos.albumId,
        albumName: albums.name,
        note: photos.note,
        favorite: photos.favorite,
        createdAt: photos.createdAt,
      })
      .from(photos)
      .leftJoin(albums, eq(photos.albumId, albums.id))
      .orderBy(desc(photos.createdAt));

    if (conditions.length > 0) {
      return query.where(and(...conditions));
    }

    return query;
  },

  withLocationQuery(options?: PhotoFilterOptions) {
    const conditions = [
      isNotNull(photos.latitude),
      isNotNull(photos.longitude),
    ];

    if (options?.searchQuery && options.searchQuery.trim().length > 0) {
      conditions.push(like(photos.note, `%${options.searchQuery.trim()}%`));
    }

    if (options?.albumId !== undefined && options?.albumId !== null) {
      conditions.push(eq(photos.albumId, options.albumId));
    }

    if (options?.onlyFavorites) {
      conditions.push(eq(photos.favorite, true));
    }

    return db
      .select({
        id: photos.id,
        uri: photos.uri,
        latitude: photos.latitude,
        longitude: photos.longitude,
        accuracy: photos.accuracy,
        source: photos.source,
        albumId: photos.albumId,
        albumName: albums.name,
        note: photos.note,
        favorite: photos.favorite,
        createdAt: photos.createdAt,
      })
      .from(photos)
      .leftJoin(albums, eq(photos.albumId, albums.id))
      .where(and(...conditions))
      .orderBy(desc(photos.createdAt));
  },

  async findById(id: number): Promise<PhotoWithAlbum | null> {
    const row = await db
      .select({
        id: photos.id,
        uri: photos.uri,
        latitude: photos.latitude,
        longitude: photos.longitude,
        accuracy: photos.accuracy,
        source: photos.source,
        albumId: photos.albumId,
        albumName: albums.name,
        note: photos.note,
        favorite: photos.favorite,
        createdAt: photos.createdAt,
      })
      .from(photos)
      .leftJoin(albums, eq(photos.albumId, albums.id))
      .where(eq(photos.id, id))
      .get();

    return row ?? null;
  },

  async create(data: Omit<NewPhoto, 'id'>) {
    return db.insert(photos).values(data);
  },

  async update(id: number, data: Partial<Omit<NewPhoto, 'id'>>) {
    return db.update(photos).set(data).where(eq(photos.id, id));
  },

  async toggleFavorite(id: number, currentStatus: boolean) {
    return db.update(photos).set({ favorite: !currentStatus }).where(eq(photos.id, id));
  },

  async remove(id: number) {
    const photo = await db.select().from(photos).where(eq(photos.id, id)).get();
    if (photo) {
      deletePhotoFile(photo.uri);
      await db.delete(photos).where(eq(photos.id, id));
    }
  },

  async clearAll() {
    const all = await db.select().from(photos);
    for (const p of all) {
      deletePhotoFile(p.uri);
    }
    return db.delete(photos);
  },
};
