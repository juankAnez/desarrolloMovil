# Registro de Auditoría de IA (AI-LOG)

**Estudiante(s):** Juan Carlos Áñez  
**Semana:** 6 — Módulos Nativos y Sensores del Dispositivo  
**Proyecto:** GeoCam — Taller Integrador 2  
**Tecnologías:** React Native 0.86, Expo SDK 57, TypeScript, Expo Camera, Expo Location, Expo Sensors, Expo ImagePicker, React Native Maps.

---

## 1. Prompts Utilizados

### Prompt 1: Creación del Custom Hook `useGeoLocation`
> *"Escribe un Custom Hook en React Native con TypeScript para obtener y seguir la ubicación del usuario usando expo-location, manejando permisos (checking, undetermined, granted, denied, blocked), cleanup seguro de watchPositionAsync y degradación elegante si no hay permiso."*

### Prompt 2: Creación del Custom Hook `useShake` con `expo-sensors`
> *"Escribe un Custom Hook en React Native con TypeScript que detecte cuando el usuario agita el teléfono usando expo-sensors (Accelerometer), con verificación de disponibilidad isAvailableAsync, setUpdateInterval(100), umbral de vector configurable √(x² + y² + z²), cooldown para no disparar múltiples veces y cleanup con bandera cancelled."*

### Prompt 3: Creación de la pantalla `GeoCam` y `Mapa`
> *"Crea una pantalla de cámara en Expo Router con expo-camera (CameraView), botones como hermanos absolutos, captura con degradación elegante si falta GPS, importación de galería con expo-image-picker y una pantalla de mapa con react-native-maps que muestre pins con miniatura de cada foto y una sección para fotos sin ubicación."*

---

## 2. Código Generado vs. Código Modificado

### 2.1. Custom Hook `useShake`
* **¿Qué generó inicialmente la IA?**
  * La IA propuso suscribirse a `Accelerometer.addListener` dentro de un `useEffect` sin invocar `Accelerometer.isAvailableAsync()`.
  * No incluyó `Accelerometer.setUpdateInterval(100)`, por lo que el acelerómetro leía con la frecuencia por defecto del sistema consumiendo batería excesiva.
  * No aplicó tiempo de enfriamiento (`cooldownMs`), causando que un solo movimiento disparara 10 a 20 alertas consecutivas.
  * Colocó el callback `onShake` en el arreglo de dependencias de `useEffect`, lo cual recreaba la suscripción nativa en cada render del componente padre.
* **¿Qué se corrigió y optimizó?**
  * Se implementó `isAvailableAsync()` antes de suscribirse.
  * Se fijó `Accelerometer.setUpdateInterval(100)` (10 lecturas/segundo, suficiente para gestos de agitación sin agotar batería).
  * Se utilizó `useRef(onShake)` para desacoplar el ciclo de vida de la suscripción de los re-renders del componente padre.
  * Se agregó cálculo de magnitud vectorial: $\sqrt{x^2 + y^2 + z^2} \ge 2.0\text{g}$ y un cooldown de 1500 ms con `lastShakeTimeRef`.
  * Se añadió la bandera `cancelled = true` en la función de limpieza para evitar condiciones de carrera si la promesa asíncrona resuelve tras desmontar.

### 2.2. Custom Hook `useGeoLocation`
* **¿Qué generó inicialmente la IA?**
  * Solicitaba el permiso de ubicación directamente en el montaje (`useEffect`), violando la regla de UX: *"pedir en contexto, nunca al abrir la app"*.
  * Ejecutaba `Location.watchPositionAsync` sin guardar la referencia de suscripción o intentaba llamar a `.remove()` de forma síncrona sobre una promesa.
* **¿Qué se corrigió y optimizó?**
  * Al montar solo se consulta el estado existente con `getForegroundPermissionsAsync()`, sin disparar el diálogo del sistema.
  * La solicitud se realiza únicamente ante acción explícita del usuario (`requestForegroundPermissionsAsync`).
  * Se manejó la condición de carrera asíncrona de `watchPositionAsync` guardando `subscription` y cancelando con `sub.remove()` si `cancelled === true`.

### 2.3. Controles en `CameraView`
* **¿Qué generó inicialmente la IA?**
  * Anidaba los botones de captura, banner de GPS y alternancia de cámara como componentes hijos dentro de `<CameraView>...</CameraView>`.
* **¿Qué se corrigió y optimizó?**
  * En las versiones modernas de Expo (`CameraView`), la cámara es un componente sin hijos.
  * Se extrajeron todos los controles y banners como elementos hermanos con posición absoluta (`StyleSheet.absoluteFill` para la cámara y capas de UI superpuestas con `zIndex`).

### 2.4. React Native Maps e Invariant Violation AIRMap en Expo Go
* **¿Qué generó inicialmente la IA?**
  * Asumió que `<MapView>` de `react-native-maps` funcionaría sin contingencia en cualquier versión de Expo Go.
  * En Expo SDK 57 con New Architecture, versiones desactualizadas (`1.20.1`) o clientes de Expo Go sin el componente `AIRMap` compilado lanzan el error fatal: `[Invariant Violation: View config not found for component 'AIRMap']`.
* **¿Qué se corrigió y optimizó?**
  * Se actualizó a `react-native-maps@1.27.2` (versión canónica para Expo SDK 57).
  * Se implementó detección preventiva mediante `UIManager.getViewManagerConfig('AIRMap')` y un componente de clase `MapErrorBoundary`.
  * Si `AIRMap` no está disponible en el cliente Expo Go del dispositivo, conmuta automáticamente y sin cuelgues a un lienzo interactivo GeoMap con cuadrícula GPS, anillos de radar, posición del usuario en vivo, zoom y pines táctiles con miniaturas.

---

## 3. Alucinaciones o Errores de APIs Obsoletas Detectados

| Código Obsoleto / Alucinación | Problema Detectado | Corrección Implementada |
| :--- | :--- | :--- |
| `<MapView>` sin Error Boundary ni verificación en Expo Go | `Invariant Violation: View config not found for component 'AIRMap'` si el cliente Expo Go no tiene el ViewManager enlazado. | Verificación de `UIManager.getViewManagerConfig('AIRMap')` + `MapErrorBoundary` con fallback a lienzo interactivo GeoMap. |
| `react-native-maps@1.20.1` | Desactualizado respecto al SDK 57. | `react-native-maps@1.27.2` resuelto por `npx expo install --fix`. |
| `import { Camera } from 'expo-camera'` con `Camera.requestCameraPermissionsAsync()` | API antigua retirada de Expo. | Uso de `CameraView` y el hook oficial `useCameraPermissions()`. |
| `import * as Permissions from 'expo-permissions'` | Paquete global de permisos completamente deprecado y retirado en SDKs recientes. | Permisos solicitados desde cada módulo específico (`Location.requestForegroundPermissionsAsync()`, `useCameraPermissions()`). |
| `ImagePicker.MediaTypeOptions.Images` | Opción deprecada en Expo SDK 51+. | Sintaxis canónica moderna: `mediaTypes: ['images']`. |
| Controles UI como hijos dentro de `<CameraView>` | No soportado en `CameraView`, provoca renderizado inconsistente o pantallas negras. | Controles ubicados como hermanos absolutos superpuestos. |
| `Location.watchPositionAsync` o `Accelerometer.addListener` sin cleanup | Provoca fugas de memoria (*memory leaks*) y consumo permanente de batería en segundo plano. | Función de retorno en `useEffect` con bandera `cancelled` y llamada a `.remove()`. |
| Solicitar todos los permisos al montar la aplicación | Mala experiencia de usuario (UX); en iOS solo hay una oportunidad y suele ser rechazada. | Pedir en contexto mediante pantalla previa explicativa (`PermissionPrimer`) o banners no bloqueantes. |
| `npm install expo-camera` | Posible resolución de versiones incompatibles con el SDK del proyecto. | Instalación mediante `npx expo install`. |
| `requestBackgroundPermissionsAsync` para fotos | Permiso intrusivo innecesario que provoca rechazo en tiendas de aplicaciones (App Store / Google Play). | Solicitud exclusiva de ubicación en primer plano (`Foreground`). |

---

## 4. Conclusiones del Aprendizaje

1. **JSI y Módulos Nativos:** JavaScript y TypeScript no interactúan directamente con el hardware; llaman a través de JSI a código nativo en Kotlin (Android) y Swift (iOS).
2. **Ciclo de vida de permisos:** La máquina de estados `checking -> undetermined -> granted / denied / blocked` permite ofrecer al usuario una transición fluida hacia los Ajustes del sistema (`Linking.openSettings()`) cuando el permiso ya no puede ser solicitado por diálogo.
3. **Degradación elegante:** Una aplicación profesional no debe bloquearse si el usuario niega un sensor no crítico (como el GPS); debe continuar tomando fotos y reflejar `coords: null` en el sistema de tipos.
