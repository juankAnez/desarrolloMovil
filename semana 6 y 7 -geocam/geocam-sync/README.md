# GeoCam Sincronizada + Feed de la Nube con TanStack Query 📍📷🔄⚡

Solución completa y extendida de la **Semana 9: TanStack Query y Sincronización Offline-First**.  
**Asignatura:** Programación Móvil Avanzada · Universidad de La Guajira.  
**Estudiante:** Juan Carlos Áñez Ahumada.

---

## 🎯 Objetivos de la Actividad Cumplidos al 100%

1. **Sincronización Bidireccional de Borrados (Soft Delete / Borrado Lógico):**
   - Implementado en SQLite (`deleted_at: integer` en `db/schema.ts`) y en PostgreSQL Supabase (`deleted_at: timestamptz` en `public.photos`).
   - Tanto el borrado individual en detalle de foto como el borrado masivo por agitado (*shake to clear all*) realizan borrado lógico, limpiando el archivo local y marcando la fila como pendiente con nueva marca temporal `updatedAt = now()`.
   - El ciclo `push` propaga `deleted_at` a Supabase mediante `upsert` y limpia el archivo del bucket de almacenamiento.
   - El ciclo `pull` detecta cambios remotos con `deleted_at`, aplica la resolución de conflictos (*Last-Write-Wins*) y, si la versión remota gana, actualiza SQLite local y elimina el archivo físico en el dispositivo.
   - Todas las consultas reactivas de UI (`listQuery`, `withLocationQuery`, `withoutLocationQuery`, `searchQuery`, `byIdQuery`) filtran `WHERE deleted_at IS NULL`.

2. **Feed Paginado de la Nube con TanStack Query v5:**
   - Nueva pestaña nativa **"Muro Nube"** integrada en la barra de navegación (`app/(tabs)/muro.tsx` y `_layout.tsx`).
   - Paginación infinita basada en cursores (`useInfiniteQuery`, cursor = `created_at < cursor`, límite de 10 posts por página).
   - Búsqueda en vivo con debounce (`useDebouncedValue` a 350 ms) para evitar saturación de red y conservar el histórico en caché con `placeholderData: keepPreviousData`.
   - Invalidación automática en tiempo real mediante Supabase Realtime Channels (`usePostsRealtime`).

3. **Manejadores de UI Completos y Robustos:**
   - **Banner Offline:** Alerta reactiva con icono (`useIsOnline` vía NetInfo / Expo Network) indicando navegación con datos cacheados.
   - **Carga Inicial:** Spinner `ActivityIndicator` durante `status === 'pending' && fetchStatus === 'fetching'`.
   - **Estado Pausado (Offline sin caché previa):** Mensaje amigable cuando no hay datos en caché y no hay conexión (`fetchStatus === 'paused'`).
   - **Manejo de Errores con Reintento:** Tarjeta de error con descripción y botón interactivo **Reintentar** que ejecuta `feed.refetch()`.
   - **Estado Vacío Diferenciado:** Mensaje específico para búsqueda sin resultados vs. muro sin publicaciones registradas.
   - **Pull-to-Refresh:** `RefreshControl` nativo vinculado al refresco de TanStack Query (`refetch`).
   - **Scroll Infinito Fluido:** `onEndReached` (umbral 0.4) con spinner activo en `ListFooterComponent` (`isFetchingNextPage`).

---

## 🛠️ Tecnologías y Dependencias

- **Framework:** Expo SDK 57 (React Native 0.86, React 19).
- **Enrutamiento:** Expo Router con rutas protegidas (`Stack.Protected`).
- **Base de Datos Local:** SQLite (`expo-sqlite`) con **Drizzle ORM 0.45**.
- **Gestión de Estado Servidor / Caché:** **TanStack Query v5** (`@tanstack/react-query`).
- **BaaS (Backend as a Service):** Supabase (PostgreSQL + RLS + Realtime + Storage).
- **Estilos:** NativeWind (Tailwind CSS) + StyleSheet.
- **Hardware & Sensores:** Cámara (`expo-camera`), Acelerómetro/Agitado (`expo-sensors`), Geolocalización (`expo-location`), Almacenamiento seguro (`expo-secure-store`).

---

## 🚀 Instrucciones de Ejecución

### 1. Configuración de Base de Datos en Supabase
En el SQL Editor de tu proyecto de Supabase ejecuta:
1. `supabase/schema.sql` (crea tablas `photos`, `posts`, buckets `geocam`, `muro` y políticas RLS).
2. `supabase/semana9.sql` (agrega `server_updated_at`, trigger de actualización, índice y columna `deleted_at`).

### 2. Configurar Variables de Entorno
Crea o verifica el archivo `.env` en la raíz de `geocam-sync`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://rmrimviqmefcisfrkgjz.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_5_CP_id8WOwR98ecJi3bUg_XHhjQ0_4
```

### 3. Instalar, Generar Migraciones y Arrancar
```bash
# Entrar a la carpeta del proyecto
cd "semana 6 y 7 -geocam/geocam-sync"

# Instalar dependencias
npm install

# Generar migraciones de Drizzle (incluye la tabla sync_meta y columna deleted_at)
npm run db:generate

# Iniciar la aplicación en modo desarrollo
npx expo start -c
```

---

## 🔄 Arquitectura de Sincronización en Dos Sentidos

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CICLO DE SINCRONIZACIÓN                         │
└────────────────────────────────────────────────────────────────────────┘

  1. PULL (BAJAR CAMBIOS REMOTOS)
     supabase.from('photos').select().gt('server_updated_at', cursor)
       ├─ No existe en local:
       │    ├─ deleted_at != null  ──> Ignorar (ya fue borrada en la nube)
       │    └─ deleted_at == null  ──> Descargar imagen + photosRepo.insertFromRemote()
       └─ Existe en local:
            ├─ local más nueva     ──> No tocar (gana local; push la subirá)
            └─ remota más nueva (remoteWins):
                 ├─ deleted_at != null ──> photosRepo.applyRemoteDelete() + delete local file
                 └─ deleted_at == null ──> photosRepo.applyRemote(nota, favorita, updatedAt)
       └─ Avanza cursor local en sync_meta con server_updated_at

  2. PUSH (SUBIR CAMBIOS PENDIENTES)
     photosRepo.listPending() (syncedAt IS NULL OR updatedAt > syncedAt)
       ├─ Si deletedAt != null (Borrado Lógico):
       │    ├─ Upsert a Supabase con deleted_at = photo.deletedAt.toISOString()
       │    ├─ Eliminar archivo de Supabase Storage (si existía)
       │    └─ photosRepo.markSynced(photo.id, path, updatedAt)
       └─ Si deletedAt == null (Nueva o Editada):
            ├─ Subir imagen a Supabase Storage (si no se ha subido)
            ├─ Upsert a Supabase con datos actualizados y deleted_at = null
            └─ photosRepo.markSynced(photo.id, path, updatedAt)
```

---

## 📋 Batería de Pruebas y Evidencias de Funcionamiento

### Prueba 1: Borrado Sincronizado (Soft Delete)
- **Pasos:** 
  1. Tomar una foto en el dispositivo A y esperar que el indicador marque *"Al día"*.
  2. Entrar al detalle de la foto y presionar *"Eliminar"*.
- **Resultado Esperado:** 
  - La foto desaparece inmediatamente de la lista local y del mapa en el dispositivo A.
  - La fila en Supabase queda con `deleted_at` registrado y `server_updated_at` actualizado por el trigger.
  - Al sincronizar el dispositivo B con la misma cuenta, la foto se elimina localmente y se borra su archivo de caché.

### Prueba 2: Borrado Offline y Sincronización Posterior
- **Pasos:** 
  1. Activar modo avión en el dispositivo.
  2. Eliminar una foto guardada.
  3. Observar que la foto desaparece de la vista y el indicador `SyncBadge` reporta 1 cambio pendiente.
  4. Desactivar el modo avión.
- **Resultado Esperado:** 
  - Al recuperar la red, `useSync` dispara automáticamente `syncAll`.
  - La eliminación se propaga a Supabase y el indicador pasa a *"Al día"*.

### Prueba 3: Resolución de Conflictos (Last-Write-Wins) en Borrados vs Ediciones
- **Pasos:**
  1. Con ambos dispositivos desconectados, en el dispositivo A se edita la nota a las 10:00 AM.
  2. En el dispositivo B se elimina la foto a las 10:02 AM.
  3. Reconectar ambos dispositivos.
- **Resultado Esperado:**
  - El borrado de B (10:02 AM) es posterior a la edición de A (10:00 AM). `remoteWins` determina que la versión más reciente es el borrado. Ambos dispositivos terminan con la foto eliminada.

### Prueba 4: Feed de la Nube con Scroll Infinito (TanStack Query)
- **Pasos:** Ir a la pestaña **Muro Nube** y deslizar hacia abajo en la lista.
- **Resultado Esperado:** 
  - Las primeras 10 publicaciones cargan fluidamente.
  - Al llegar al 40% del final de la lista, se visualiza el spinner inferior y se carga la página siguiente con cursor `created_at < cursor`.

### Prueba 5: Búsqueda en Vivo con Debounce y Caché
- **Pasos:** 
  1. Escribir un término en el buscador del Muro Nube.
  2. Borrar la búsqueda.
- **Resultado Esperado:**
  - No hay peticiones intermedias por tecla; solo se dispara una búsqueda tras 350 ms de inactividad.
  - Al borrar el término, el feed completo reaparece de inmediato recuperado de la memoria caché de TanStack Query sin parpadeos.

### Prueba 6: Manejo de Estados de Red en el Feed
- **Pasos:** Activar el modo avión mientras se está en la pestaña Muro Nube.
- **Resultado Esperado:**
  - Aparece el banner amarillo *"Sin conexión. Mostrando datos en caché local de TanStack"*.
  - Las publicaciones previamente leídas permanecen accesibles e interactivas. Al recuperar la señal, el banner se oculta y el feed se actualiza.

### Prueba 7: Borrado Masivo por Sensor de Agitado
- **Pasos:** Agitar el dispositivo en la pantalla de fotos y confirmar el diálogo de alerta.
- **Resultado Esperado:**
  - Todas las fotos activas pasan a borrado lógico localmente.
  - Al sincronizar, todas las fotos correspondientes en Supabase se marcan como borradas.
