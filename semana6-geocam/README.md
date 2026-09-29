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
* **Con túnel si estás en otra red Wi-Fi:** `npx expo start --tunnel`.

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
│   ├── useCamera.ts              # Hook nativo para CameraView y permisos (tipado estricto)
│   ├── useGeoLocation.ts         # Hook nativo para GPS y seguimiento continuo (tipado estricto)
│   └── useShake.ts               # Hook nativo para acelerómetro y detección de agitado (tipado estricto)
├── context/
│   └── GeoPhotosContext.tsx      # Estado global inmutable de fotos
├── types/
│   └── geo.ts                    # Interfaces TypeScript (Coords, GeoPhoto, PermissionState)
├── assets/
│   └── screenshots/              # Capturas y GIFs de los 3 estados de permisos
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

---

## 📱 Los Tres Estados de Permiso en la Interfaz

### 1. Estado Concedido (`granted`)
* **Comportamiento:** La cámara se inicializa en pantalla completa. El GPS en vivo muestra latitud, longitud y precisión (`±X m`). Cada foto capturada o importada se etiqueta automáticamente con coordenadas GPS y aparece como pin en el mapa.
* **Captura:**  
  ![Permiso Concedido](./assets/screenshots/permiso-concedido.png)

```text
┌───────────────────────────────────────┐
│ [● GPS EN VIVO]                       │
│ 11.54444, -72.90722  (±8 m)           │
│                                       │
│                                       │
│          [ VISOR CÁMARA ]             │
│                                       │
│                                       │
│ [Galería]        ( O )       [Voltear]│
└───────────────────────────────────────┘
```

---

### 2. Estado Rechazado (`denied`) — Degradación Elegante
* **Comportamiento:** Si el usuario rechaza el permiso de ubicación, la cámara **no se cierra ni se rompe**. Aparece un banner superior color ámbar indicando *"Activa la ubicación para etiquetar tus fotos"*. La foto se captura normalmente con `coords: null` y se guarda en la sección *"Fotos sin ubicación"*.
* **Captura:**  
  ![Permiso Rechazado](./assets/screenshots/permiso-rechazado.png)

```text
┌───────────────────────────────────────┐
│ ⚠️ Activa la ubicación para fotos      │
│                                       │
│                                       │
│          [ VISOR CÁMARA ]             │
│                                       │
│                                       │
│ [Galería]        ( O )       [Voltear]│
└───────────────────────────────────────┘
```

---

### 3. Estado Bloqueado (`blocked` / `canAskAgain: false`)
* **Comportamiento:** Cuando el usuario rechaza permanentemente el permiso (o tras el primer rechazo en iOS), el diálogo del sistema no vuelve a salir. El componente `PermissionPrimer` detecta automáticamente este estado y ofrece el botón **"Abrir Ajustes"**, llamando a `Linking.openSettings()` para llevar al usuario directamente a la configuración del sistema.
* **Captura:**  
  ![Permiso Bloqueado](./assets/screenshots/permiso-bloqueado.png)

```text
┌───────────────────────────────────────┐
│                 ( ⚠️ )                │
│       GeoCam necesita tu cámara       │
│                                       │
│  Desactivaste este permiso de forma   │
│  permanente. Puedes habilitarlo       │
│  desde los Ajustes del sistema.       │
│                                       │
│          [ ⚙️ Abrir Ajustes ]         │
└───────────────────────────────────────┘
```

---

## ✅ Lista de Verificación de Entrega

| Criterio | Estado | Evidencia en el Código |
| :--- | :---: | :--- |
| **Custom Hooks Nativos** | ✅ Cumplido | [`hooks/useGeoLocation.ts`](./hooks/useGeoLocation.ts), [`hooks/useCamera.ts`](./hooks/useCamera.ts) y [`hooks/useShake.ts`](./hooks/useShake.ts). |
| **Permisos en contexto** | ✅ Cumplido | Nunca se piden al abrir la app. Solo se consulta con `getForegroundPermissionsAsync()` al montar y se solicita al pulsar *"Permitir acceso"* en [`components/PermissionPrimer.tsx`](./components/PermissionPrimer.tsx). |
| **Degradación elegante** | ✅ Cumplido | Si niegas el GPS, la cámara sigue tomando fotos con `coords: null` y lo comunica mediante banner y toast. |
| **Botón "Abrir Ajustes"** | ✅ Cumplido | Presente en `PermissionPrimer` y en el banner de GPS cuando `permissionState === 'blocked'`. |
| **Limpieza de suscripciones** | ✅ Cumplido | `useEffect` en `useGeoLocation` y `useShake` retornan función de cleanup que invoca `sub.remove()` y activa la bandera `cancelled = true`. |
| **Tipado estricto sin `any`** | ✅ Cumplido | Todas las interfaces (`Coords`, `GeoPhoto`, `PermissionState`) tipadas en [`types/geo.ts`](./types/geo.ts). Cero tipos `any`. |
| **Errores a la UI como estado** | ✅ Cumplido | Errores expuestos como `error: string | null` en el hook `useGeoLocation`, banners en pantalla y toasts flotantes. |
| **AI-LOG.md en la raíz** | ✅ Cumplido | Registro completo de auditoría, prompts y tabla de detección de APIs obsoletas en [`AI-LOG.md`](./AI-LOG.md). |
