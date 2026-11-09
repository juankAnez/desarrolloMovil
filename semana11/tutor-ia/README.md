# Tutor IA — Semana 11 🤖🎓⚡

Aplicación móvil con Asistente/Tutor de Inteligencia Artificial que responde en **streaming en tiempo real** y cuenta con capacidad **multimodal (entiende imágenes y capturas de código)**.

Desarrollado para la asignatura **Programación Móvil Avanzada · Universidad de La Guajira**.  
**Estudiante:** Juan Carlos Áñez Ahumada  
**Tecnologías:** Expo SDK 57 · React Native 0.86 · React 19 · Vercel AI SDK v7 · Google Gemini · Supabase Auth · Supabase Edge Functions (Deno).

---

## 🔒 Arquitectura de Seguridad

**La API Key de Google Gemini NUNCA está expuesta en la app cliente.**  
Reside exclusivamente como secreto protegido dentro de la Supabase Edge Function `tutor`. Esta función valida el token JWT del estudiante mediante `@supabase/server` (`auth: 'user'`); sin una sesión activa, la petición es rechazada de inmediato con `401 Unauthorized`.

```text
[ App (useChat + expo/fetch) ]  ──Token de Sesión──>  [ Edge Function "tutor" ]  ──GEMINI_API_KEY──>  [ Google Gemini ]
                                <──Tokens en Stream──                             <──Tokens en Stream──
```

---

## 🚀 Paso a Paso para Desplegar y Probar

### 1. Despliegue de la Edge Function en Supabase

Tu proyecto de Supabase es: **`hiadaadhgkjyjmtfexxh`**.

#### Despliegue directo desde el Dashboard Web (2 minutos):
1. Entra a las Edge Functions de tu proyecto:  
   👉 [https://supabase.com/dashboard/project/hiadaadhgkjyjmtfexxh/functions](https://supabase.com/dashboard/project/hiadaadhgkjyjmtfexxh/functions)
2. Haz clic en **Create Function** (o *Deploy via Editor*).
3. Nombre de la función: **`tutor`**.
4. Pega el código completo de:  
   [`supabase/functions/tutor/index.ts`](supabase/functions/tutor/index.ts)
5. En la sección **Secrets** (o en la barra lateral de la función en *Function Secrets*), agrega:
   * **Nombre:** `GEMINI_API_KEY`
   * **Valor:** Tu API Key de Gemini.
6. Haz clic en **Deploy**.

---

### 2. Iniciar la Aplicación Móvil

1. El archivo `.env` ya está listo y configurado en la raíz de `tutor-ia`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://hiadaadhgkjyjmtfexxh.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_jKAVqy86_bic_WfeLBqjXg_ACUKArt9
   ```

2. Arranca el servidor de desarrollo:
   ```bash
   cd "semana11/tutor-ia"
   npx expo start -c
   ```

3. Abre con **Expo Go** (SDK 57) escaneando el código QR (o presiona `a` para Android).
4. Crea una cuenta o inicia sesión con tu usuario de Supabase.
5. ¡Empieza a consultar con texto, fotos de código o errores de pantalla!
