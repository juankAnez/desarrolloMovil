import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { AppState, Platform } from 'react-native';

const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
export const SUPABASE_URL = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
export const SUPABASE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Faltan EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env');
}

// SecureStore guarda máximo ~2 KB por clave; la sesión de Supabase es más grande.
// Por eso se parte en trozos de 1000 caracteres (igual que en la Semana 8).
const CHUNK = 1000;

const SecureStoreAdapter = {
  async getItem(key: string) {
    try {
      const count = await SecureStore.getItemAsync(`${key}_n`);
      if (!count) return null;
      let value = '';
      for (let i = 0; i < Number(count); i++) {
        value += (await SecureStore.getItemAsync(`${key}_${i}`)) ?? '';
      }
      return value || null;
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string) {
    try {
      await this.removeItem(key);
      const n = Math.ceil(value.length / CHUNK);
      for (let i = 0; i < n; i++) {
        await SecureStore.setItemAsync(`${key}_${i}`, value.slice(i * CHUNK, (i + 1) * CHUNK));
      }
      await SecureStore.setItemAsync(`${key}_n`, String(n));
    } catch (e) {
      console.warn('[SecureStoreAdapter] Error guardando sesión:', e);
    }
  },
  async removeItem(key: string) {
    try {
      const count = await SecureStore.getItemAsync(`${key}_n`);
      for (let i = 0; i < Number(count ?? 0); i++) {
        await SecureStore.deleteItemAsync(`${key}_${i}`);
      }
      await SecureStore.deleteItemAsync(`${key}_n`);
    } catch {
      // ignore
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Refresca el token solo mientras la app está en primer plano.
AppState.addEventListener('change', (state) => {
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});
