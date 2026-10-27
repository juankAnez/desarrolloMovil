// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { LargeSecureStoreAdapter } from './secureStorage';

let supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://yhqwvsyljosgqviyrdwf.supabase.co').trim();
const supabasePublishableKey = (
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ptuUhn2FyUe7-RwApzeX9w_5zKVzBiM'
).trim();

// Normalización automática de URL por si incluye /rest/v1
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: LargeSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
