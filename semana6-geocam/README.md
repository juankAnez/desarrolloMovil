# GeoCam 📷📍 — Módulos Nativos y Sensores del Dispositivo

**Taller Integrador 2 — Semana 6**  
**Estudiante:** Juan Carlos Áñez  
**Tecnologías:** React Native 0.86, Expo SDK 57, TypeScript, Expo Camera, Expo Location, Expo Sensors, Expo ImagePicker, React Native Maps.

GeoCam es una aplicación móvil nativa desarrollada con React Native y Expo que captura fotos geolocalizadas, visualiza capturas en un mapa interactivo con miniaturas, importa imágenes de la galería y responde al movimiento físico del teléfono mediante el acelerómetro (gesto de agitación o *shake*).

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
# 1. Ingresar a la carpeta del proyecto
cd semana6-geocam

# 2. Iniciar el servidor de desarrollo Expo
npx expo start
```

### Opciones de prueba:
* **En teléfono físico (Recomendado):** Abre la aplicación **Expo Go** en tu dispositivo Android o iOS y escanea el código QR de la terminal. (La cámara y los sensores físicos funcionan de manera nativa en el dispositivo real).
* **Con túnel si estás en otra red:** `npx expo start --tunnel`.

---

## 📂 Estructura del Proyecto

```
semana6-geocam/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Pestañas inferiores con integración de useShake
│   │   ├── geocam.tsx            # Pantalla de cámara con controles y coordenadas GPS
│   │   └── mapa.tsx              # Mapa interactivo con fotos agrupadas y sin GPS
│   ├── _layout.tsx               # Provider global de fotos y Stack
│   └── +not-found.tsx            # Pantalla de ruta no encontrada
├── components/
│   └── PermissionPrimer.tsx      # Pantalla explicativa previa de permisos (UX)
├── hooks/
│   ├── useCamera.ts              # Hook nativo para CameraView y permisos
│   ├── useGeoLocation.ts         # Hook nativo para GPS y seguimiento continuo
│   └── useShake.ts               # Hook nativo para acelerómetro y detección de agitado
├── context/
│   └── GeoPhotosContext.tsx      # Estado global inmutable de fotos
├── types/
│   └── geo.ts                    # Interfaces TypeScript (Coords, GeoPhoto, PermissionState)
├── AI-LOG.md                     # Registro de auditoría y análisis de APIs de IA
├── app.json                      # Config plugins para cámara, ubicación y galería
└── package.json                  # Dependencias Expo SDK 57
```

---

## 🛡️ Máquina de Estados y Ciclo de Permisos

La aplicación gestiona los permisos de hardware bajo un ciclo riguroso de 5 estados:

```
checking ───► undetermined ───► (usuario acepta) ───► granted
                  │
                  └───► (usuario rechaza) ───► denied ───► (rechaza de nuevo) ───► blocked
                                                                                     │
                                                                         Linking.openSettings()
```

### 1. Estado Concedido (`granted`)
* **Cámara:** Se inicializa `CameraView` en pantalla completa con visor activo.
* **Ubicación:** Las coordenadas en tiempo real se muestran en una tarjeta flotante (`lat, lng ±precisión m`) y se estampan automáticamente en los metadatos de la foto (`GeoPhoto`).

### 2. Estado Rechazado (`denied`)
* **Degradación elegante:** Si el usuario niega el permiso de ubicación, la cámara **no se bloquea ni se cierra**. Se muestra un banner informativo en la parte superior advirtiendo que la foto se guardará sin coordenadas (`coords: null`), garantizando una experiencia de usuario ininterrumpida.

### 3. Estado Bloqueado (`blocked` / `canAskAgain: false`)
* Cuando el usuario rechaza permanentemente el permiso (o en iOS tras el primer rechazo), el diálogo nativo del sistema no vuelve a aparecer.
* El componente `PermissionPrimer` detecta automáticamente este estado y transforma el botón en **"Abrir Ajustes"**, invocando `Linking.openSettings()` para que el usuario pueda activar el permiso en la configuración de su dispositivo sin frustración.

---

## 🧪 Pruebas y Verificación en el Teléfono

1. **Permiso en contexto:** Al abrir la aplicación, no se disparan diálogos invasivos. Al ingresar a la cámara, se solicita el acceso con explicación previa.
2. **Cámara funcional sin GPS:** Al negar la ubicación, pulsa el botón de captura y verifica que la foto se guarda con la etiqueta `coords: null`.
3. **Importar desde galería (R2):** Pulsa el botón "Galería" en la barra inferior para seleccionar una foto existente. Se almacena con `source: 'gallery'`.
4. **Pestaña Mapa (R3):** Cambia a la pestaña "Mapa" para ver las fotos con GPS marcadas con pines personalizados con miniatura. En la parte inferior, un carrusel lista las fotos "Sin ubicación".
5. **Detección de Agitado (R4 - `useShake`):** Agita enérgicamente el teléfono físico. Aparecerá una alerta nativa preguntando si deseas eliminar todas las fotos de la sesión.
6. **Limpieza de sensores (Cleanup):** Al cambiar de pestaña o salir de la pantalla, la función de retorno de `useEffect` cancela `subscription?.remove()` y activa la bandera `cancelled = true`, apagando el GPS y el acelerómetro para ahorrar batería.
