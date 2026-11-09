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

## 🚀 Paso a Paso para Ejecutarlo

### 1. Despliegue de la Edge Function en Supabase

Tu ID de proyecto de Supabase es: `rmrimviqmefcisfrkgjz`.

#### Opción A (Vía Supabase Dashboard en la Web — ¡La más rápida!):
1. Ve al Dashboard de tu proyecto en Supabase: [https://supabase.com/dashboard/project/rmrimviqmefcisfrkgjz](https://supabase.com/dashboard/project/rmrimviqmefcisfrkgjz)
2. En el menú lateral izquierdo entra a **Edge Functions**.
3. Haz clic en **Create Function** (o *Deploy via Editor*).
4. Nombre de la función: `tutor`.
5. Pega el código completo que se encuentra en:  
   [`supabase/functions/tutor/index.ts`](supabase/functions/tutor/index.ts)
6. En la pestaña lateral de la función o en **Edge Functions > Secrets**, añade el secreto:
   * **Nombre:** `GEMINI_API_KEY`
   * **Valor:** Tu clave obtenida en [Google AI Studio](https://aistudio.google.com/).
7. Haz clic en **Deploy**.

#### Opción B (Vía Supabase CLI en Terminal):
```bash
cd "semana11/tutor-ia"

# Iniciar sesión y vincular tu proyecto
npx supabase login
npx supabase link --project-ref rmrimviqmefcisfrkgjz

# Configurar la API key de Gemini como secreto
npx supabase secrets set GEMINI_API_KEY=AIzaSy...

# Desplegar la función
npx supabase functions deploy tutor
```

---

### 2. Iniciar la Aplicación Móvil

1. El archivo `.env` ya se encuentra configurado en la raíz de `tutor-ia`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://rmrimviqmefcisfrkgjz.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_5_CP_id8WOwR98ecJi3bUg_XHhjQ0_4
   ```

2. Iniciar el servidor de desarrollo de Expo:
   ```bash
   cd "semana11/tutor-ia"
   npx expo start -c
   ```

3. Abre la app en tu teléfono escaneando el código QR con **Expo Go** (SDK 57) o presiona `a` para emulador Android / `w` para Web.
4. Regístrate o inicia sesión con tu cuenta de Supabase.
5. ¡Listo! Puedes conversar con el tutor, enviar capturas de código con la cámara 📷 o la galería 🖼️, o detener la respuesta en cualquier momento con el botón ■.

---

## 🎨 Mejoras de Diseño y Robustez Implementadas

- **Diseño Moderno & Dinámico:** Paleta institucional de Uniguajira (verde esmeralda `#059669` y pizarra oscura `#0f172a`), con tipografía legible, sombras suaves y avatares diferenciados.
- **Soporte para Código Markdown:** Los bloques de código devueltos por Gemini se formatean en contenedores oscuros monospaced con etiqueta de lenguaje (JS, TSX, SQL, etc.) y opción de copiar texto.
- **Chips de Sugerencias:** Estado vacío interactivo con accesos directos para consultas frecuentes.
- **Previsualización de Foto:** Vista previa flotante con botón para quitar o reemplazar la imagen antes de enviar.
- **Polyfill Anti-Crasheos:** Inyección síncrona de `structuredClone` en Hermes para evitar race conditions al cargar el AI SDK.
- **Protección de URL:** Limpieza automática de barras diagonales redundantes en las llamadas al gateway de funciones.
