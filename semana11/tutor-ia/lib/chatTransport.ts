import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { supabase, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './supabase';

/**
 * Transporte de useChat hacia la Edge Function "tutor".
 * - api: URL pública de la función en Supabase.
 * - headers: se calculan EN CADA mensaje, garantizando el envío del token de sesión vigente.
 * - fetch: expo/fetch con soporte nativo de streaming en Expo SDK 57.
 */
export function crearTransporte(funcion = process.env.EXPO_PUBLIC_FUNCTION_NAME || 'tutor-') {
  const baseUrl = (SUPABASE_URL || '').replace(/\/+$/, '');
  return new DefaultChatTransport({
    api: `${baseUrl}/functions/v1/${funcion}`,
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    headers: async (): Promise<Record<string, string>> => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
      return {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_PUBLISHABLE_KEY,
      };
    },
  });
}
