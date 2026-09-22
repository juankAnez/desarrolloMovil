# ServiGo Riohacha - Plataforma Móvil de Prestación y Solicitud de Servicios

**Módulo:** Desarrollo Móvil - Grupo B1  
**Estudiante:** Juan Carlos Añez Ahumada  
**Tecnologías:** React Native, Expo SDK 57, Expo Router (File-based Routing), TypeScript, React Native SVG  

---

## 🎯 1. Objetivo del Proyecto

Aplicación móvil unificada que conecta clientes con personas que ofrecen servicios en **Riohacha, La Guajira, Colombia**, mediante un único sistema de autenticación que soporta dos roles operativos:

* **CLIENT**: Explora, busca, filtra servicios por categoría/precio/calificación/distancia, solicita servicios y realiza seguimiento en mapa con GPS en vivo.
* **PROVIDER**: Consulta solicitudes pendientes, acepta o rechaza trabajos, gestiona el ciclo de vida del servicio (`ACCEPTED` → `ON_THE_WAY` → `IN_PROGRESS` → `COMPLETED`) y visualiza la ruta hacia el cliente.

---

## 🔐 2. Autenticación y Credenciales de Evaluación

Pantalla de Login unificada en [`app/login.tsx`](file:///C:/Proyectos/desarrolloMovil/parcial-app/app/login.tsx) con acceso rápido de 1 toque:

* **CLIENTE:**
  * **Email:** `cliente@test.com`
  * **Contraseña:** `123456`
* **PRESTADOR:**
  * **Email:** `prestador@test.com`
  * **Contraseña:** `123456`

> **Nota para el evaluador:** En cualquier pantalla, puedes pulsar la píldora superior del rol (**CLIENTE** / **PRESTADOR**) para alternar inmediatamente entre ambos roles y comprobar la sincronización del estado en tiempo real sin cerrar sesión.

---

## 📱 3. Vistas Principales Implementadas

### 🔹 Vista 1: Home / Explorar ([`app/(tabs)/index.tsx`](file:///C:/Proyectos/desarrolloMovil/parcial-app/app/%28tabs%29/index.tsx))
* **Para CLIENT:**
  * Barra de búsqueda reactiva por título, descripción o prestador.
  * Píldoras de categorías: *Todos, Tecnología, Hogar, Electricidad, Plomería, Educación, Diseño*.
  * Filtros de precio (hasta $90.000 COP) y calificación (4.9+ estrellas).
  * Lista de tarjetas con foto, prestador, precio en COP, calificación y distancia.
* **Para PROVIDER:**
  * Métricas clave (Solicitudes pendientes, servicios en curso, calificación).
  * Bandeja de solicitudes pendientes con botones de **Aceptar** y **Rechazar**.
  * Servicios activos en curso con acceso directo al mapa.
  * Catálogo de servicios ofrecidos.

### 🔹 Vista 2: Detalle del Servicio ([`app/service/[id].tsx`](file:///C:/Proyectos/desarrolloMovil/parcial-app/app/service/%5Bid%5D.tsx))
* Título del servicio, categoría y tarifa base en COP.
* Tarjeta completa del prestador (nombre, profesión, calificación, trabajos realizados, barrio de Riohacha).
* Descripción detallada y lista de tareas incluidas.
* **Mapa de cobertura de Riohacha** con ubicación del prestador y distancia.
* Campo para instrucciones o notas del cliente.
* Botón **"Solicitar Servicio Ahora"** que crea la orden en estado `PENDING` y navega automáticamente a la Vista 3.

### 🔹 Vista 3: Seguimiento del Servicio en Vivo ([`app/tracking/[id].tsx`](file:///C:/Proyectos/desarrolloMovil/parcial-app/app/tracking/%5Bid%5D.tsx))
* **Línea de Progreso (Stepper)** con los 5 estados del ciclo:
  1. `PENDING` (Solicitado)
  2. `ACCEPTED` (Aceptado por el prestador)
  3. `ON_THE_WAY` (En camino con GPS)
  4. `IN_PROGRESS` (En servicio)
  5. `COMPLETED` (Finalizado)
* **Mapa Funcional de Riohacha ([`src/components/map/RiohachaMap.tsx`](file:///C:/Proyectos/desarrolloMovil/parcial-app/src/components/map/RiohachaMap.tsx))**:
  * Representación geográfica de Riohacha (Costa del Mar Caribe, Malecón, Calle Ancha, Av. Circunvalar, Coquivacoa, Los Olivos).
  * Marcador interactivo del Cliente.
  * Marcador interactivo del Prestador.
  * Ruta visual entre ambos con indicador de distancia en km y tiempo estimado de llegada (ETA).
  * **Simulación de Movimiento GPS:** Durante el estado `ON_THE_WAY`, el prestador se desplaza periódicamente hacia el cliente, o puedes pulsar el botón *"Simular Avance GPS hacia Cliente"*.
* **Controles Operativos del Prestador**:
  * Botones de acción real que cambian el estado y actualizan inmediatamente la vista del cliente.

---

## 🗂️ 4. Arquitectura del Proyecto (Feature-First)

```text
parcial-app/
├── app/                          # RUTAS Y PANTALLAS (Expo Router)
│   ├── (tabs)/                   # Navegación por pestañas inferiores
│   │   ├── _layout.tsx           # Layout con badge reactivo de pedidos activos
│   │   ├── index.tsx             # Vista 1: Home / Explorar (Cliente y Prestador)
│   │   ├── requests.tsx          # Bandeja unificada de pedidos y órdenes
│   │   └── profile.tsx           # Perfil de usuario, rol y datos del parcial
│   ├── service/
│   │   └── [id].tsx              # Vista 2: Detalle del Servicio
│   ├── tracking/
│   │   └── [id].tsx              # Vista 3: Seguimiento del Servicio en Vivo
│   ├── modal.tsx                 # Modal nativo con credenciales y guía
│   ├── _layout.tsx               # Root Stack con AuthProvider y ServiceProvider
│   └── +not-found.tsx            # Manejador 404
│
├── src/                          # LÓGICA DE NEGOCIO Y COMPONENTES
│   ├── components/               # Componentes UI atomizados
│   │   ├── layout/AppHeader.tsx  # Barra superior con alternador de rol en vivo
│   │   ├── map/RiohachaMap.tsx   # Mapa vectorial funcional de Riohacha (SVG)
│   │   ├── service/              # ServiceCard, CategoryPills
│   │   ├── tracking/             # StatusStepper
│   │   └── ui/                   # Badge, CustomButton, Card, SearchInput
│   ├── context/
│   │   ├── AuthContext.tsx       # Estado de autenticación y cambio de rol
│   │   └── ServiceContext.tsx    # Gestión reactiva de órdenes y simulación GPS
│   ├── data/
│   │   ├── mockUsers.ts          # Cuentas de prueba (cliente y prestador)
│   │   ├── mockServices.ts       # 10 servicios completos y 7 prestadores
│   │   └── mockRequests.ts       # Órdenes de prueba iniciales
│   ├── types/                    # Tipos estrictos TypeScript (auth, service, request)
│   └── constants/
│       └── colors.ts             # Paleta de diseño y tokens visuales
│
├── app.json                      # Configuración de Expo
├── package.json                  # Dependencias
└── tsconfig.json                 # Configuración TypeScript estricta (@/*)
```

---

## 🚀 5. Cómo Ejecutar la Aplicación

1. Abrir la terminal en la carpeta del proyecto:
   ```bash
   cd C:\Proyectos\desarrolloMovil\parcial-app
   ```

2. Iniciar el servidor Expo:
   ```bash
   npm start
   ```

3. Para probar directamente en el navegador web:
   ```bash
   npm run web
   ```
