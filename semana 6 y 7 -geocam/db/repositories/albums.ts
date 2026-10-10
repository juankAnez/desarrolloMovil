// db/repositories/albums.ts
import { asc, eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { albums, type NewAlbum } from '@/db/schema';

export const albumsRepo = {
  listQuery() {
    return db.select().from(albums).orderBy(asc(albums.name));
  },

  async findById(id: number) {
    return db.select().from(albums).where(eq(albums.id, id)).get();
  },

  async create(name: string) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('El nombre del álbum no puede estar vacío');
    return db.insert(albums).values({ name: trimmed });
  },

  async remove(id: number) {
    // Gracias a onDelete: 'set null' en la llave foránea de photos,
    // las fotos no se eliminan, sino que su albumId pasa a null automáticamente.
    return db.delete(albums).where(eq(albums.id, id));
  },
};
