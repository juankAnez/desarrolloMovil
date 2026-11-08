// db/repositories/photos.ts
// Única capa que conoce Drizzle para la tabla photos.
import { and, asc, desc, eq, gt, isNotNull, isNull, like, or, type SQL } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';
import { db } from '@/db/client';
import { photos, type NewPhoto } from '@/db/schema';

type PhotoInput = Omit<NewPhoto, 'id' | 'createdAt'>;
export type PhotoChanges = Partial<Pick<NewPhoto, 'note' | 'favorite' | 'albumId'>>;

/** Filtro de álbum: null = todos, 'none' = sin álbum, número = ese álbum. */
export type AlbumFilter = number | 'none' | null;

export interface PhotoFilters {
  search: string;
  albumId: AlbumFilter;
  onlyFavorites: boolean;
}

export const photosRepo = {
  listQuery() {
    return db.select().from(photos).where(isNull(photos.deletedAt)).orderBy(desc(photos.createdAt));
  },

  withLocationQuery() {
    return db
      .select()
      .from(photos)
      .where(and(isNull(photos.deletedAt), isNotNull(photos.latitude), isNotNull(photos.longitude)))
      .orderBy(desc(photos.createdAt));
  },

  withoutLocationQuery() {
    return db
      .select()
      .from(photos)
      .where(and(isNull(photos.deletedAt), isNull(photos.latitude)))
      .orderBy(desc(photos.createdAt));
  },

  /** C4: búsqueda por nota (LIKE) + filtros por álbum y favoritas (excluye borradas). */
  searchQuery({ search, albumId, onlyFavorites }: PhotoFilters) {
    const conditions: SQL[] = [isNull(photos.deletedAt)];
    const term = search.trim();
    if (term) conditions.push(like(photos.note, `%${term}%`));
    if (albumId === 'none') conditions.push(isNull(photos.albumId));
    else if (albumId !== null) conditions.push(eq(photos.albumId, albumId));
    if (onlyFavorites) conditions.push(eq(photos.favorite, true));

    return db
      .select()
      .from(photos)
      .where(and(...conditions))
      .orderBy(desc(photos.createdAt));
  },

  /** Una sola foto, reactiva (para la pantalla de detalle). */
  byIdQuery(id: number) {
    return db.select().from(photos).where(and(eq(photos.id, id), isNull(photos.deletedAt))).limit(1);
  },

  async findById(id: number) {
    return await db.select().from(photos).where(and(eq(photos.id, id), isNull(photos.deletedAt))).get();
  },

  async allUris() {
    const rows = await db.select({ uri: photos.uri }).from(photos).where(isNull(photos.deletedAt));
    return rows.map((r) => r.uri);
  },

  async create(data: PhotoInput) {
    await db.insert(photos).values(data);
  },

  /** Edición hecha por el usuario: siempre actualiza updatedAt (la foto queda pendiente de subir). */
  async update(id: number, changes: PhotoChanges) {
    await db.update(photos).set({ ...changes, updatedAt: new Date() }).where(eq(photos.id, id));
  },

  // ---------- Semana 9: soporte para la sincronización ----------

  /** Fotos pendientes de subir: nunca sincronizadas, o editadas/borradas después de la última subida. */
  pendingQuery() {
    return db
      .select()
      .from(photos)
      .where(or(isNull(photos.syncedAt), gt(photos.updatedAt, photos.syncedAt)))
      .orderBy(asc(photos.createdAt));
  },

  async listPending() {
    return await photosRepo.pendingQuery();
  },

  async findByClientId(clientId: string) {
    return await db.select().from(photos).where(eq(photos.clientId, clientId)).get();
  },

  /** Foto que llegó de la nube: se inserta ya sincronizada. */
  async insertFromRemote(data: NewPhoto) {
    await db.insert(photos).values(data);
  },

  /** Aplica en local una versión más nueva de la nube. Nunca usa la hora actual. */
  async applyRemote(
    id: number,
    changes: {
      note: string | null;
      favorite: boolean;
      updatedAt: Date;
      syncedAt: Date;
      deletedAt?: Date | null;
    }
  ) {
    await db.update(photos).set(changes).where(eq(photos.id, id));
  },

  /** Aplica en local el borrado que llegó de la nube. */
  async applyRemoteDelete(id: number, remoteUpdatedAt: Date) {
    await db
      .update(photos)
      .set({
        deletedAt: remoteUpdatedAt,
        updatedAt: remoteUpdatedAt,
        syncedAt: remoteUpdatedAt,
      })
      .where(eq(photos.id, id));
  },

  /** Marca la foto como subida. syncedAt es la versión (updatedAt) que se subió, no "ahora". */
  async markSynced(id: number, remotePath: string, syncedAt: Date) {
    await db.update(photos).set({ remotePath, syncedAt }).where(eq(photos.id, id));
  },

  /** Semana 8: rellena clientId y updatedAt en las fotos anteriores a la migración. */
  async ensureSyncFields() {
    const rows = await db.select().from(photos).where(isNull(photos.clientId));
    for (const row of rows) {
      await db
        .update(photos)
        .set({ clientId: Crypto.randomUUID(), updatedAt: row.updatedAt ?? row.createdAt })
        .where(eq(photos.id, row.id));
    }
  },

  /** Borrado lógico individual: actualiza deletedAt y updatedAt para que push() lo sincronice. */
  async softDelete(id: number) {
    const now = new Date();
    await db
      .update(photos)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(photos.id, id));
  },

  /** Borrado lógico masivo: marca todas las fotos activas como borradas para sincronización. */
  async softDeleteAll() {
    const now = new Date();
    await db
      .update(photos)
      .set({ deletedAt: now, updatedAt: now })
      .where(isNull(photos.deletedAt));
  },

  async remove(id: number) {
    await db.delete(photos).where(eq(photos.id, id));
  },

  async clearAll() {
    await db.delete(photos);
  },
};
