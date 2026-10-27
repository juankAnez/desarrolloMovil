# 🤖 Registro de Auditoría de IA (AI-LOG)

**Estudiante(s):** Juan Carlos Áñez  
**Semana:** 8 — Backend as a Service con Supabase  
**Proyecto:** Muro de Clase  

## 1. Prompts Utilizados

- "Configurar la conexión segura a Supabase en Expo SDK 57 utilizando expo-secure-store, autenticación con correo/contraseña y suscripción a Realtime."
- "Crear esquema SQL con Row Level Security (RLS) para publicaciones y almacenamiento de fotos en Storage con bucket público y carpetas por usuario."

## 2. Código Generado vs. Código Modificado

- **¿Qué generó la IA?:** Uso de `AsyncStorage` para guardar tokens de sesión de Supabase y llamada a `supabase.from('posts').select()` sin ordenamiento ni suscripción de limpieza en Realtime.
- **¿Qué modifiqué/corregí?:** 
  - Se sustituyó `AsyncStorage` por un adaptador segmentado con `expo-secure-store` (`LargeSecureStoreAdapter`), garantizando almacenamiento cifrado en Keychain/Keystore.
  - Se añadió la limpieza de canal Realtime (`supabase.removeChannel(channel)`) en la función de cleanup de `useEffect`.
  - Se configuró la política de subida a Storage forzando que la ruta inicie con `(storage.foldername(name))[1] = auth.uid()::text`.

## 3. Alucinaciones o Errores Detectados

- La IA intentó usar la API heredada de Supabase con `anon key` en formato JWT antiguo en lugar de la nueva clave `publishable key` (`sb_publishable_...`). Se configuró la clave de publicación oficial recomendada por Supabase.
- Se corrigió la URL base eliminando `/rest/v1/` del final para que el SDK de Supabase gestione adecuadamente tanto las llamadas REST como el canal WebSocket de Realtime y Storage.
