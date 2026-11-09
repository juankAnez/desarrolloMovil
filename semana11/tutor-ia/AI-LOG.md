# 🤖 Registro de Auditoría de IA (AI-LOG)

**Estudiante:** Juan Carlos Áñez Ahumada  
**Semana:** 11 (Tutor IA - Inteligencia Artificial Generativa)  
**Proyecto:** Tutor IA — Chatbot Multimodal en Streaming con Vercel AI SDK v7, Gemini y Supabase Edge Functions  
**Fecha:** 9 de noviembre de 2026  

---

## 1. Prompts Utilizados

- *"Analiza el proyecto tutor-ia en semana11, identifica posibles fallos o bugs en el transporte, los polyfills de Hermes y la Edge Function de Supabase, y déjalo 100% funcional y listo para probar."*
- *"Rediseña la interfaz de usuario para que sea moderna, fresca, intuitiva y profesional, incorporando @expo/vector-icons, burbujas de chat con formato de bloques de código (```), chips de sugerencias rápidas, selector multimodal (cámara/galería) con previsualización y vista de autenticación elegante con la identidad de Uniguajira."*
- *"Verifica la compatibilidad de modelos de Google Gemini en la Edge Function para evitar errores 404 por modelos inexistentes y añade soporte CORS y mensajes de error amigables para cuotas (429)."*

---

## 2. Código Generado vs. Código Modificado

### ¿Qué generó la IA?
- **Rediseño Completo de la Pantalla de Chat ([`app/index.tsx`](file:///C:/Proyectos/desarrolloMovil/semana11/tutor-ia/app/index.tsx)):**
  - Cabecera moderna con indicador de estado en tiempo real.
  - Estado vacío dinámico con tarjeta de bienvenida e interactivos *chips* de preguntas frecuentes.
  - Indicador de estado de pensamiento ("El tutor está analizando tu consulta…").
  - Barra de entrada flotante con botones nativos para cámara, galería, entrada multilínea y botón dinámico enviar/detener (■).
- **Componente de Mensajes ([`components/Burbuja.tsx`](file:///C:/Proyectos/desarrolloMovil/semana11/tutor-ia/components/Burbuja.tsx)):**
  - Avatares diferenciados para el Tutor y el Estudiante.
  - Parser integrado para renderizar bloques de código markdown (```` ``` ````) con estilo oscuro, cabecera de lenguaje y tipografía monoespaciada seleccionable.
  - Renderizado mejorado de imágenes adjuntas con badge informativo.
- **Pantalla de Autenticación ([`app/login.tsx`](file:///C:/Proyectos/desarrolloMovil/semana11/tutor-ia/app/login.tsx)):**
  - Diseño con tarjeta elevada y acentos verde esmeralda institucional.
  - Toggle de visibilidad de contraseña (ojo abrir/cerrar).
  - Pestañas fluidas para alternar entre "Iniciar Sesión" y "Crear Cuenta".

### ¿Qué modifiqué / corregí?
- **Polyfills de Hermes ([`polyfills.ts`](file:///C:/Proyectos/desarrolloMovil/semana11/tutor-ia/polyfills.ts)):** Se añadió la asignación síncrona inmediata en `globalThis.structuredClone` para evitar la condición de carrera (*race-condition*) que ocurría cuando módulos del AI SDK intentaban clonar estado antes de que se completara el `import()` asíncrono.
- **Transporte Seguro ([`lib/chatTransport.ts`](file:///C:/Proyectos/desarrolloMovil/semana11/tutor-ia/lib/chatTransport.ts)):** Se normalizó la URL de Supabase mediante `.replace(/\/+$/, '')` para evitar dobles barras diagonales (`//functions/v1/tutor`) si la variable de entorno contiene una barra al final.
- **Modelo en la Edge Function ([`supabase/functions/tutor/index.ts`](file:///C:/Proyectos/desarrolloMovil/semana11/tutor-ia/supabase/functions/tutor/index.ts)):** Se corrigió el modelo por defecto a `gemini-2.0-flash` (el código base tenía una referencia a `gemini-3.8-flash` que produce error 404 al no existir en la API de Google). Se agregaron cabeceras CORS para peticiones preflight OPTIONS y detección de ausencia de API key.

---

## 3. Alucinaciones o Errores Detectados y Solucionados

1. **Error de modelo inexistente (`gemini-3.8-flash`):**
   - *Problema:* El archivo original utilizaba por defecto `gemini-3.8-flash`. Al llamar a la API de Google AI Studio con este string, la API responde con `404 Not Found (models/gemini-3.8-flash is not found)`.
   - *Solución:* Se ajustó el valor por defecto a `gemini-2.0-flash` o `gemini-1.5-flash`, ambos 100% operativos en el plan gratuito de Google AI Studio.

2. **Riesgo de seguridad con la API Key en el cliente:**
   - *Problema:* En arquitecturas tradicionales con IA en frontend se suele sugerir `EXPO_PUBLIC_GEMINI_API_KEY`.
   - *Solución:* Se mantuvo y blindó la regla del curso: la API Key de Gemini reside **únicamente** en la Edge Function de Supabase (`tutor`), requiriendo autorización de sesión `withSupabase({ auth: 'user' })`.

3. **Incompatibilidad de streaming con `fetch` estándar:**
   - *Problema:* El `fetch` global estándar de React Native / Hermes bufferiza la respuesta completa y la entrega de golpe al finalizar.
   - *Solución:* Se garantizó el uso exclusivo de `expo/fetch` dentro de `crearTransporte()`, permitiendo que el stream HTTP viaje token a token hacia la UI.
