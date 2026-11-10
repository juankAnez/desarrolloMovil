import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { supabase, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './supabase';

/**
 * Wrapper de fetch que maneja reintentos inteligentes en caso de 404:
 * Si la función en Supabase se llama "tutor-" o "tutor", reintenta
 * automáticamente con el nombre alternativo para garantizar 100% de disponibilidad.
 */
async function fetchConFallback(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const fetchFn = (expoFetch as unknown as typeof globalThis.fetch);
  const res = await fetchFn(input, init);

  if (res.status === 404 && typeof input === 'string') {
    let fallbackUrl: string | null = null;
    if (input.endsWith('/tutor')) {
      fallbackUrl = input + '-';
    } else if (input.endsWith('/tutor-')) {
      fallbackUrl = input.slice(0, -1);
    }

    if (fallbackUrl) {
      console.log(`[chatTransport] 404 detectado en ${input}, reintentando con ${fallbackUrl}...`);
      return fetchFn(fallbackUrl, init);
    }
  }

  return res;
}

/**
 * Transporte de useChat hacia la Edge Function de Supabase.
 * - api: URL pública de la función en Supabase.
 * - headers: se calculan EN CADA mensaje, garantizando el envío del token de sesión vigente.
 * - fetch: expo/fetch con fallback automático y soporte nativo de streaming.
 */
export function crearTransporte(funcion = process.env.EXPO_PUBLIC_FUNCTION_NAME || 'tutor-') {
  const baseUrl = (SUPABASE_URL || '').replace(/\/+$/, '');
  return new DefaultChatTransport({
    api: `${baseUrl}/functions/v1/${funcion}`,
    fetch: fetchConFallback,
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
