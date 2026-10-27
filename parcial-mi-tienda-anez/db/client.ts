// db/client.ts
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { Platform } from 'react-native';
import * as schema from './schema';

export const isWebWithoutSAB =
  Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  typeof window.SharedArrayBuffer === 'undefined';

function initDatabase() {
  if (isWebWithoutSAB) {
    return null;
  }

  try {
    return openDatabaseSync('mitienda.db', {
      enableChangeListener: true,
    });
  } catch (err) {
    console.warn('[SQLite] Base de datos nativa no disponible en este entorno:', err);
    return null;
  }
}

export const expoDb = initDatabase() as any;

export const db: ExpoSQLiteDatabase<typeof schema> | null =
  expoDb && typeof expoDb.execSync === 'function'
    ? drizzle(expoDb, { schema })
    : null;
