# 🤖 Registro de Auditoría de IA (AI-LOG)

**Estudiante:** Juan Carlos Áñez Ahumada  
**Semana:** 9  
**Proyecto:** GeoCam sincronizada con borrados + Feed TanStack Query – Taller Integrador 2  
**Fecha:** 8 de noviembre de 2026  

---

## 1. Prompts Utilizados

- *"Analiza los archivos s9-muro-tanstack.zip y s9-geocam-sync.zip, identifica los lineamientos de la actividad y la brecha técnica para cumplir la consigna de sincronización de borrados y feed paginado."*
- *"Implementa la sincronización bidireccional de borrados (soft delete) en SQLite y Supabase con resolución de conflictos Last-Write-Wins tanto para borrado individual como masivo por sensor de agitado."*
- *"Integra el feed de la nube con TanStack Query v5 en la app principal, incluyendo paginación por cursor, búsqueda con debounce, invalidación en tiempo real y todos los manejadores de estado de UI (offline banner, carga inicial, pausado, error con reintento, vacío diferenciado, pull-to-refresh y scroll infinito)."*
- *"Audita la compatibilidad de drizzle-kit con Expo SDK 57 y genera las migraciones de base de datos sin errores de empaquetado."*

---

## 2. Código Generado vs. Código Modificado

### ¿Qué generó la IA?
- **Esquema de Base de Datos Local (`db/schema.ts`):** Adición de la columna `deletedAt: integer('deleted_at', { mode: 'timestamp_ms' })` a la tabla `photos`.
- **Script SQL de Migración Remota (`supabase/semana9.sql`):** Adición de la columna `deleted_at timestamptz default null` en `public.photos`, activando el disparador `touch_server_updated_at`.
- **Repositorio de Fotos (`db/repositories/photos.ts`):** 
  - Métodos `softDelete(id)` y `softDeleteAll()`.
  - Método `applyRemoteDelete(id, remoteUpdatedAt)`.
  - Modificación de consultas (`listQuery`, `withLocationQuery`, `withoutLocationQuery`, `searchQuery`, `byIdQuery`, `findById`, `allUris`) para filtrar exclusivamente registros activos (`WHERE deleted_at IS NULL`).
- **Servicio de Sincronización (`services/sync.ts`):**
  - Actualización de interfaz `RemotePhoto` con `deleted_at`.
  - En `pull`: detección de borrados remotos, comprobación de `remoteWins` y aplicación de borrado lógico local junto con eliminación del archivo físico de la memoria caché.
  - En `push`: detección de `photo.deletedAt`, subida de `deleted_at` a Supabase mediante `upsert` sin requerir transferencia de archivo binario, y posterior marcado de sincronización.
- **Pestaña Muro Nube (`app/(tabs)/muro.tsx`):**
  - Integración completa de `@tanstack/react-query` v5.
  - Paginación basada en cursores (`useInfiniteQuery`).
  - Búsqueda en vivo con debounce (`useDebouncedValue`).
  - Todos los manejadores de UI: banner de sin conexión, spinner de carga, estado pausado, error con reintento, estado vacío condicional, pull-to-refresh y footer de scroll infinito.

### ¿Qué modifiqué / corregí?
- Se corrigió el import de `expo-crypto` en `db/schema.ts` que provocaba un fallo al ejecutar `drizzle-kit generate` en el entorno Node.js, implementando una función generadora de UUID compatible tanto con Node como con React Native (`globalThis.crypto.randomUUID()`).
- Se aseguró que la función `clearAll()` (activada por el sensor de agitado `useShake`) ejecute `softDeleteAll()` y notifique a `requestSync()` para propagar el borrado de todas las fotos a Supabase.
- Se añadió la pestaña `Muro Nube` en `app/(tabs)/_layout.tsx` para permitir evaluar toda la experiencia integrada en una sola aplicación nativa.

---

## 3. Alucinaciones o Errores Detectados y Solucionados

1. **Error de empaquetado en Drizzle Kit (`Unexpected "typeof"`):**
   - *Problema:* Al importar `expo-crypto` en `db/schema.ts`, el compilador de `drizzle-kit` (esbuild bajo Node) intentó empaquetar dependencias de React Native runtime y falló.
   - *Solución:* Reemplazo del import por una función universal que aprovecha `globalThis.crypto?.randomUUID()` nativo en Node 18+ y en el motor Hermes de React Native SDK 57.

2. **Falta de sincronización en borrados locales:**
   - *Problema:* El código original realizaba `DELETE FROM photos WHERE id = ?` en SQLite, perdiendo el rastro de la foto en local sin notificar jamás a Supabase.
   - *Solución:* Implementación de Borrado Lógico (*Soft Delete*). El registro permanece con `deletedAt` y nueva `updatedAt`, permitiendo que `push` lo reconozca como pendiente y lo actualice en la nube.

3. **Paginación vulnerable por desplazamiento (Offset vs Cursor):**
   - *Problema:* Usar paginación tradicional con `limit` y `offset` en feeds en tiempo real genera duplicados o saltos cuando otros usuarios publican fotos nuevas.
   - *Solución:* Implementación de paginación estricta por cursor temporal (`created_at < cursor`) consumida a través de `useInfiniteQuery`.
