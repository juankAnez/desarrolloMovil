# 🚐 RouteGo App - Sistema de Transporte Universitario Inteligente

Aplicación móvil desarrollada en **React Native** con **Expo Router (File-based Routing)** y **TypeScript**, construida como entregable para el **Taller Práctico Semanal: Arquitectura de Navegación con Expo Router**.

**Estudiante:** Juan Carlos Añez Ahumada  
**Asignatura:** Desarrollo Móvil - Grupo B1  
**Documentación de Arquitectura:** [Ver ARCHITECTURE.md](./ARCHITECTURE.md)  

---

## 🎯 Objetivos de la Aplicación

- **File-based Routing:** Organización declarativa de pantallas dentro del directorio `app/`.
- **Combinación de Patrones de Navegación:**
  - **Tabs Navigator:** Barra inferior de 2 pestañas (`Inicio` y `Rutas`).
  - **Stack Navigator:** Navegación jerárquica con cabecera nativa y botón de regreso (`student/[id]`).
  - **Modal Screen:** Pantalla flotante con `presentation: 'modal'` para el Centro de Alertas y Monitoreo.
- **Rutas Dinámicas (`[id].tsx`):** Captura y renderizado de parámetros URL con el hook `useLocalSearchParams`.
- **Navegación Mixta:**
  - **Declarativa:** Mediante componentes `<Link href="/modal">`.
  - **Programática:** Mediante el hook `useRouter()` y `router.push('/student/ST-202688')`.
- **Arquitectura Modular Feature-First:** Desacoplamiento de la lógica de negocio y componentes en la carpeta `src/`.

---

## 📁 Estructura del Proyecto

```text
routego-app/
├── app/                      # ENRUTAMIENTO DECLARATIVO (Expo Router)
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom Tabs Navigator (Inicio y Rutas)
│   │   ├── index.tsx         # Pestaña 1: Inicio / Dashboard principal
│   │   └── routes.tsx        # Pestaña 2: Catálogo y filtros de Rutas
│   ├── student/
│   │   └── [id].tsx          # Ruta Dinámica: Carnet Digital del Estudiante
│   ├── modal.tsx             # Pantalla Modal independiente: Alertas y Estado
│   ├── _layout.tsx           # Root Stack Navigator principal
│   └── +not-found.tsx        # Pantalla de respaldo Error 404
│
├── src/                      # LÓGICA DE NEGOCIO Y COMPONENTES (Feature-First)
│   ├── components/           # Componentes UI reutilizables (StatCard, Badge, SearchInput)
│   ├── constants/            # Paleta de colores institucionales y tokens
│   ├── features/             # Módulos por dominio de negocio
│   │   ├── routes/           # Lógica, tarjetas y modales del módulo de Rutas
│   │   ├── status/           # Monitoreo de flota, KPIs y formulario de reportes
│   │   └── student/          # Carnet digital, historial de viajes y selector
│   └── hooks/                # Hooks utilitarios
│
├── ARCHITECTURE.md           # Informe de Arquitectura y Análisis Comparativo IA
└── package.json
```

---

## 🚀 Instalación y Ejecución

### 1. Clonar o acceder al proyecto
```bash
cd routego-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo Expo
```bash
npx expo start
```

### 4. Visualizar la aplicación:
- **Dispositivo Físico:** Escanea el código QR con la app **Expo Go** (Android / iOS).
- **Emulador Android:** Presiona la tecla `a`.
- **Simulador iOS:** Presiona la tecla `i`.
- **Navegador Web:** Presiona la tecla `w`.

---

## 🧪 Verificación de Requisitos Técnicos en la App

1. **Navegación por Pestañas (Tabs):**
   - Usa la barra inferior para alternar entre **Inicio** y **Rutas**.
2. **Navegación Declarativa a Modal:**
   - En **Inicio**, pulsa el botón **"Alertas"** en la tarjeta superior o la tarjeta **"Estado del Servicio"**. Notarás que se abre con animación modal superpuesta sobre la pantalla.
3. **Navegación Programática con Parámetro Dinámico:**
   - En **Inicio**, pulsa en el botón **"Mi Carnet Digital"** o en el avatar superior. Se ejecutará `router.push('/student/ST-202688')`.
4. **Lectura de Parámetro (`useLocalSearchParams`):**
   - La pantalla del carnet digital mostrará claramente el banner:
     > `Parámetro Dinámico Detectado: [id] = "ST-202688"`
   - Puedes usar el selector interactivo para probar con otros IDs (`ST-409112`, `ST-103345`).
5. **Retorno Jerárquico:**
   - Pulsa el botón nativo **"Atrás"** en la barra superior de la pantalla del carnet para regresar fluidamente al Dashboard.

---

## 📄 Documentación de Arquitectura

El análisis completo que incluye:
- **Fase 1:** Wireframe de navegación y respuestas a las 4 preguntas de diseño.
- **Fase 2:** Detalle del flujo de navegación (Tabs + Stack + Modal + Dynamic Route).
- **Fase 3:** Comparativa Técnica con Inteligencia Artificial (Prompt, Árbol de carpetas, Ventajas/Desventajas y Conclusión Personal).

Se encuentra documentado en [**ARCHITECTURE.md**](./ARCHITECTURE.md).
