// lib/secureStorage.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHUNK_SIZE = 1800; // SecureStore tiene un límite seguro de ~2048 bytes por entrada

/**
 * Adaptador de almacenamiento por fragmentos (chunking) para Expo SecureStore.
 * Cumple con la interfaz SupportedStorage de Supabase Auth para persistencia segura de sesión.
 * No utiliza AsyncStorage, cumpliendo las reglas del parcial.
 */
export const LargeSecureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(key);
        }
        return null;
      }

      // Verificamos si existe un indicador de fragmentos
      const countStr = await SecureStore.getItemAsync(`${key}__chunks`);
      if (countStr) {
        const count = parseInt(countStr, 10);
        const parts: string[] = [];
        for (let i = 0; i < count; i++) {
          const part = await SecureStore.getItemAsync(`${key}__chunk_${i}`);
          if (part !== null) {
            parts.push(part);
          }
        }
        return parts.join('');
      }

      // Si no fue fragmentado, lo obtenemos directamente
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`[SecureStore] Error leyendo llave "${key}":`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value);
        }
        return;
      }

      // Limpiamos fragmentos previos si existían
      const prevCountStr = await SecureStore.getItemAsync(`${key}__chunks`);
      if (prevCountStr) {
        const prevCount = parseInt(prevCountStr, 10);
        for (let i = 0; i < prevCount; i++) {
          await SecureStore.deleteItemAsync(`${key}__chunk_${i}`);
        }
        await SecureStore.deleteItemAsync(`${key}__chunks`);
      }

      // Si el tamaño supera CHUNK_SIZE, fragmentamos
      if (value.length > CHUNK_SIZE) {
        const chunksCount = Math.ceil(value.length / CHUNK_SIZE);
        await SecureStore.setItemAsync(`${key}__chunks`, String(chunksCount));
        for (let i = 0; i < chunksCount; i++) {
          const chunk = value.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
          await SecureStore.setItemAsync(`${key}__chunk_${i}`, chunk);
        }
        // Eliminamos la llave directa si existía
        await SecureStore.deleteItemAsync(key).catch(() => {});
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`[SecureStore] Error guardando llave "${key}":`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
        return;
      }

      const countStr = await SecureStore.getItemAsync(`${key}__chunks`);
      if (countStr) {
        const count = parseInt(countStr, 10);
        for (let i = 0; i < count; i++) {
          await SecureStore.deleteItemAsync(`${key}__chunk_${i}`);
        }
        await SecureStore.deleteItemAsync(`${key}__chunks`);
      }
      await SecureStore.deleteItemAsync(key).catch(() => {});
    } catch (error) {
      console.warn(`[SecureStore] Error eliminando llave "${key}":`, error);
    }
  },
};
