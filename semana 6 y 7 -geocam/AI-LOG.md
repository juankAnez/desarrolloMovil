# Registro de Auditoría de IA (AI-LOG)

**Estudiante(s):** Juan Carlos Áñez, Andres García  
**Semana:** 7 — Base de Datos Local Offline-First con Drizzle ORM y SQLite  
**Proyecto:** GeoCam persistente — Taller Integrador 2  
**Tecnologías:** React Native 0.86, Expo SDK 57, TypeScript, Drizzle ORM, Drizzle Kit, Expo SQLite, Expo FileSystem (New API), Expo Camera, Expo Location, Expo Sensors, React Native Maps.

---

## 1. Prompts Utilizados

### Prompt 1: Configuración de Drizzle ORM en Expo con SQLite
> *"Configura Drizzle ORM con expo-sqlite en un proyecto Expo SDK 57 con Expo Router. Genera drizzle.config.ts, babel.config.js con babel-plugin-inline-import, metro.config.js para soportar archivos .sql y protege el layout raíz con useMigrations para que ninguna pantalla se monte antes de aplicar las migraciones."*

### Prompt 2: Esquema Relacional de Álbumes y Fotos con Llave Foránea Segura
> *"Crea con Drizzle ORM y expo-sqlite una tabla `albums` (id, name único, createdAt) relacionada con `photos` (albumId como llave foránea opcional). Configura la regla para que al borrar un álbum las fotos NO se eliminen, sino que su albumId quede en null (onDelete: 'set null'). Además añade las columnas note (texto opcional) y favorite (booleano con valor por defecto false)."*

### Prompt 3: Capa de Repositorios y Consultas Reactivas
> *"Escribe una capa de repositorios para photos y albums desacoplada de la UI. Incluye listQuery con filtros reactivos por búsqueda en notas con like, filtro por álbum y solo favoritos; withLocationQuery filtrando fotos con GPS mediante isNotNull; y métodos create, update, toggleFavorite, remove y clearAll. Implementa el custom hook usePhotos utilizando useLiveQuery."*

### Prompt 4: Persistencia Permanente de Archivos con la Nueva API de `expo-file-system`
> *"Crea un servicio en TypeScript para copiar las fotos desde la carpeta de caché a la carpeta permanente de documentos de la aplicación (Paths.document) usando las nuevas clases File, Directory y Paths de expo-file-system, y una función para eliminar el archivo físico cuando el registro se borre de SQLite."*

### Prompt 5: Pantalla de Detalle y CRUD Completo
> *"Crea la pantalla app/foto/[id].tsx con Expo Router que cargue la foto por id, permita editar la nota, alternar favorito, cambiar de álbum mediante chips seleccionables y eliminar con diálogo de confirmación que remueva tanto el registro en SQLite como el archivo físico."*

---

## 2. Código Generado vs. Código Modificado y Auditado

### 2.1. Conexión SQLite y Cumplimiento de Llaves Foráneas (Foreign Keys)
* **¿Qué generó inicialmente la IA?**
  * La IA propuso crear el cliente con `openDatabaseSync('geocam.db')` sin habilitar el listener de cambios (`enableChangeListener`) y sin configurar los pragmas de SQLite.
  * En el esquema definió `references(() => albums.id, { onDelete: 'cascade' })`, lo que provocaría que al eliminar un álbum se borraran todas las fotos asociadas.
* **¿Qué se corrigió y optimizó?**
  * Se configuró `openDatabaseSync('geocam.db', { enableChangeListener: true })`, imprescindible para que `useLiveQuery` de Drizzle reciba notificaciones del driver nativo ante cualquier `INSERT`, `UPDATE` o `DELETE`.
  * Se ejecutó explícitamente `expoDb.execSync('PRAGMA foreign_keys = ON;')`, ya que por compatibilidad histórica SQLite viene con llaves foráneas desactivadas por defecto. Sin este pragma, cualquier regla `ON DELETE` es ignorada en tiempo de ejecución.
  * Se cambió la regla de eliminación a `{ onDelete: 'set null' }` conforme a la especificación C1: las fotos pertenecen al usuario y no deben perderse al reorganizar o eliminar un álbum.

### 2.2. Manejo de Archivos Permanentes: Nueva API vs. API Legada
* **¿Qué generó inicialmente la IA?**
  * La IA mezcló `FileSystem.copyAsync({ from: ..., to: ... })` con `FileSystem.documentDirectory`, las cuales pertenecen a la API legada (`expo-file-system/legacy`).
  * En algunas respuestas intentó instanciar clases `new File()` usando rutas síncronas no compatibles.
* **¿Qué se corrigió y optimizó?**
  * Se adoptó estrictamente la arquitectura canónica orientada a objetos de Expo SDK 57:
    ```typescript
    import { Directory, File, Paths } from 'expo-file-system';
    const photosDir = new Directory(Paths.document, 'photos');
    ```
  * En `persistPhoto`, se verifica `photosDir.exists` y se crea con `photosDir.create()`.
  * La copia se ejecuta con `source.copy(destination)` y en `deletePhotoFile` se comprueba `file.exists` antes de `file.delete()`, evitando excepciones silenciosas.

### 2.3. Migraciones Versionadas y Pipeline de Bundling Metro
* **¿Qué generó inicialmente la IA?**
  * Intentó sugerir comandos de servidor como `npx drizzle-kit push`, los cuales no son aplicables a bases de datos embebidas móviles en SQLite.
  * Al proponer `babel-plugin-inline-import`, sobreescribió por completo `babel.config.js`, perdiendo los presets y la compatibilidad con el entorno de Expo.
* **¿Qué se corrigió y optimizó?**
  * Se generó el flujo estricto de dos migraciones secuenciales no editadas:
    1. `0000_icy_blink.sql`: Creación inicial de la tabla `photos` con coordenadas y origen.
    2. `0001_lonely_earthquake.sql`: Creación de la tabla `albums` (nombre único), adición de `album_id`, `note` y `favorite`.
  * Se preservó la configuración de Babel fusionando `babel-plugin-inline-import` con extensiones `['.sql']`, y se añadió `sourceExts.push('sql')` en `metro.config.js` para que el empaquetador cargue el archivo `drizzle/migrations.js` en tiempo de ejecución móvil.

### 2.4. Separación Arquitectónica en 5 Capas
* **¿Qué generó inicialmente la IA?**
  * En las pantallas de la interfaz (`mapa.tsx`, `foto/[id].tsx`), la IA intentaba importar directamente el cliente `db` de Drizzle y hacer consultas SQL o `db.select()` adentro de los componentes de React.
* **¿Qué se corrigió y optimizó?**
  * Se estableció una estricta arquitectura en 5 capas:
    1. **UI (`app/`):** No conoce Drizzle ni SQLite; interactúa únicamente con hooks.
    2. **Hooks (`hooks/`):** Encapsulan estado, filtros y reactividad (`usePhotos`, `useAlbums`).
    3. **Repositorios (`db/repositories/`):** Construyen consultas SQL tipadas con Drizzle (`photosRepo`, `albumsRepo`).
    4. **Cliente y Esquema (`db/client.ts`, `db/schema.ts`):** Definen tablas, tipos e inicialización.
    5. **Drivers Nativos:** `expo-sqlite` y `expo-file-system`.

---

## 3. Alucinaciones o Errores de APIs Obsoletas Detectados

| Código Obsoleto / Alucinación de la IA | Problema Detectado | Corrección Implementada |
| :--- | :--- | :--- |
| `SQLite.openDatabase('geocam.db')` o `db.transaction(tx => tx.executeSql(...))` | API antigua y asíncrona por callbacks de `expo-sqlite`, completamente retirada en SDKs modernos. | `openDatabaseSync('geocam.db', { enableChangeListener: true })` con soporte síncrono y listeners reactivos. |
| `import { drizzle } from 'drizzle-orm/better-sqlite3'` | Driver nativo para entornos Node.js en servidor; genera error de resolución de dependencias nativas en iOS/Android. | `import { drizzle } from 'drizzle-orm/expo-sqlite'`. |
| `drizzle.config.ts` sin `driver: 'expo'` | Drizzle Kit no reconoce la plataforma móvil y no genera el archivo bundled `migrations.js`. | Configuración con `dialect: 'sqlite'` y `driver: 'expo'`. |
| `npx drizzle-kit push` en entorno Expo | `drizzle-kit push` está diseñado para bases de datos de servidor con conexión directa TCP/HTTP, no para SQLite local en el teléfono. | Flujo de migraciones: `npx drizzle-kit generate` + `useMigrations` en `app/_layout.tsx`. |
| Falta de `enableChangeListener: true` al abrir la base de datos | `useLiveQuery` de Drizzle no se entera de inserciones, actualizaciones o borrados, dejando la interfaz estática. | `openDatabaseSync('geocam.db', { enableChangeListener: true })`. |
| Llaves foráneas sin `PRAGMA foreign_keys = ON;` | SQLite desactiva la validación de integridad referencial por defecto; las cláusulas `onDelete: 'set null'` no se ejecutan. | Invocación preventiva `expoDb.execSync('PRAGMA foreign_keys = ON;')` inmediatamente tras abrir la base de datos. |
| `FileSystem.copyAsync` mezclado con `new File()` | Mezcla inconsistente entre la API anterior (`legacy`) y la nueva API basada en clases de Expo SDK 57. | Estandarización en las clases modernas `Directory`, `File` y `Paths` de `expo-file-system`. |
| Guardar valores booleanos como `boolean('favorite')` en SQLite sin modo numérico | SQLite no tiene tipo de dato primitivo booleano; puede almacenar cadenas o enteros no tipados. | `integer('favorite', { mode: 'boolean' }).notNull().default(false)`. |
| Consultas de Drizzle ejecutadas directamente dentro de vistas JSX | Acoplamiento fuerte de la interfaz gráfica a la tecnología de base de datos; rompe el principio de responsabilidad única. | Capa de repositorio intermedia con interfaces tipadas `PhotoWithAlbum`. |

---

## 4. Conclusiones del Aprendizaje

1. **Paradigma Offline-First:** Los datos locales en SQLite constituyen la fuente primaria de verdad de la aplicación móvil. La interfaz responde de manera instantánea, sin depender de la conectividad de red ni arriesgar la pérdida de capturas en memoria RAM.
2. **Ciclo de Vida de Migraciones:** Las migraciones versionadas (`0000`, `0001`) permiten evolucionar el esquema de base de datos en los dispositivos de los usuarios sin destruir los registros preexistentes ni provocar inconsistencias de datos.
3. **Persistencia Física vs. Lógica:** Las URIs de la cámara temporalmente apuntan al directorio de caché (`cacheDirectory`), el cual el sistema operativo puede purgar bajo presión de memoria. La sincronización entre la copia física en el directorio de documentos (`Paths.document`) y el registro en la base de datos es indispensable para garantizar la durabilidad de los archivos.
