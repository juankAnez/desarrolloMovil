// db/seed.ts
import { db } from './client';
import { albums } from './schema';

const DEFAULT_ALBUMS = [
  { name: 'General' },
  { name: 'Viajes' },
  { name: 'Trabajo' },
  { name: 'Naturaleza' },
];

export async function seedAlbums() {
  await db.insert(albums).values(DEFAULT_ALBUMS).onConflictDoNothing();
}
