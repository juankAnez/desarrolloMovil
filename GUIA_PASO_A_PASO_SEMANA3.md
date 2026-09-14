# 🚀 Guía Paso a Paso: Semana 3 - Navegación con Expo Router

Esta guía contiene las instrucciones exactas, comandos de terminal y códigos fuente estructurados para que puedas realizar la actividad de la **Semana 3** paso a paso de forma manual o asistida.

---

## 📌 Tabla de Contenidos
1. [Paso 1: Inicialización del Proyecto](#paso-1-inicialización-del-proyecto)
2. [Paso 2: Estructura de Archivos y Carpetas](#paso-2-estructura-de-archivos-y-carpetas)
3. [Paso 3: Código de Enrutamiento y Pantallas (`app/`)](#paso-3-código-de-enrutamiento-y-pantallas-app)
4. [Paso 4: Modularización Feature-First (`src/`)](#paso-4-modularización-feature-first-src)
5. [Paso 5: Entregable - Documento `ARCHITECTURE.md`](#paso-5-entregable---documento-architecturemd)
6. [Paso 6: Ejecución y Pruebas](#paso-6-ejecución-y-pruebas)

---

## 🛠️ Paso 1: Inicialización del Proyecto

Abre tu terminal en la carpeta de trabajo `c:\Proyectos\desarrolloMovil\` y ejecuta los siguientes comandos uno por uno:

### 1.1 Crear la aplicación Expo
```bash
npx create-expo-app@latest routego-app --template default
```

### 1.2 Entrar a la carpeta del proyecto
```bash
cd routego-app
```

### 1.3 Instalar las dependencias de enrutamiento y UI nativa
```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

---

## 📁 Paso 2: Estructura de Archivos y Carpetas

Asegúrate de tener la siguiente jerarquía dentro de `routego-app/`. Si existen archivos por defecto generados en `app/`, elimínalos o reemplázalos para que coincidan exactamente con esta estructura:

```text
routego-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Layout de Pestañas inferiores
│   │   ├── index.tsx         # Pestaña 1: Inicio / Dashboard
│   │   └── routes.tsx        # Pestaña 2: Rutas de Shuttles
│   ├── student/
│   │   └── [id].tsx          # Ruta Dinámica: /student/ST-202688
│   ├── _layout.tsx           # Stack Principal (Root Layout)
│   ├── modal.tsx             # Pantalla con presentación Modal
│   └── +not-found.tsx        # Pantalla de Error 404
├── src/
│   ├── components/
│   │   └── CustomButton.tsx  # Botón reutilizable
│   └── features/
│       └── routes/
│           └── routesData.ts # Datos mock de las rutas
├── ARCHITECTURE.md           # Entregable de Análisis de Arquitectura
└── package.json
```

---

## 💻 Paso 3: Código de Enrutamiento y Pantallas (`app/`)

Copia y pega el contenido exacto en cada uno de los archivos correspondientes:

### 3.1 `app/_layout.tsx` (Layout Raíz - Root Stack)
> **Ubicación:** `routego-app/app/_layout.tsx`  
> **Propósito:** Define el navegador Stack principal de la app y registra los grupos de rutas, pantallas modales y dinámicas.

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. Grupo de Pestañas Inferiores */}
      <Stack.Screen name="(tabs)" />
      
      {/* 2. Ruta Dinámica con cabecera nativa activa */}
      <Stack.Screen 
        name="student/[id]" 
        options={{ 
          headerShown: true, 
          title: "Detalle de Estudiante",
          headerTintColor: "#000666" 
        }} 
      />

      {/* 3. Pantalla lanzada como Ventana Modal */}
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Información de Servicio' 
        }} 
      />
    </Stack>
  );
}
```

---

### 3.2 `app/(tabs)/_layout.tsx` (Layout de Pestañas)
> **Ubicación:** `routego-app/app/(tabs)/_layout.tsx`  
> **Propósito:** Configura la barra de navegación inferior (Bottom Tabs).

```tsx
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#000666', headerShown: false }}>
      {/* Pestaña 1: Inicio */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />
      {/* Pestaña 2: Rutas de Shuttles */}
      <Tabs.Screen
        name="routes"
        options={{
          title: 'Rutas',
          tabBarIcon: () => <Text>🚌</Text>,
        }}
      />
    </Tabs>
  );
}
```

---

### 3.3 `app/(tabs)/index.tsx` (Pantalla de Inicio)
> **Ubicación:** `routego-app/app/(tabs)/index.tsx`  
> **Propósito:** Vista principal con botones para probar la navegación declarativa (`Link`) y programática (`useRouter`).

```tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RouteGo - Dashboard</Text>
      <Text style={styles.subtitle}>Bienvenido al sistema de transporte</Text>
      
      {/* Navegación a Modal usando el componente Link */}
      <Link href="/modal" asChild>
        <Pressable style={styles.btnWarning}>
          <Text style={styles.btnText}>Ver Estado de Shuttles (Modal)</Text>
        </Pressable>
      </Link>

      {/* Navegación programática pasando un parámetro ID */}
      <Pressable 
        style={styles.btnPrimary}
        onPress={() => router.push('/student/ST-202688')}
      >
        <Text style={styles.btnText}>Ver Perfil Estudiante ST-202688</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000666', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 24 },
  btnWarning: { backgroundColor: '#F59E0B', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginBottom: 12 },
  btnPrimary: { backgroundColor: '#000666', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }
});
```

---

### 3.4 `app/(tabs)/routes.tsx` (Pantalla de Rutas)
> **Ubicación:** `routego-app/app/(tabs)/routes.tsx`  
> **Propósito:** Pestaña secundaria que enumera las rutas de autobús universitarias.

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function RoutesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutas Disponibles 🚌</Text>
      <Text style={styles.text}>1. Ruta Norte - Campus Principal</Text>
      <Text style={styles.text}>2. Ruta Sur - Facultad de Medicina</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#000666', marginBottom: 12 },
  text: { fontSize: 14, color: '#334155', marginVertical: 4 }
});
```

---

### 3.5 `app/student/[id].tsx` (Ruta Dinámica)
> **Ubicación:** `routego-app/app/student/[id].tsx`  
> **Propósito:** Lee y muestra parámetros de URL utilizando el hook `useLocalSearchParams()`.

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function StudentDetailScreen() {
  // Captura el parámetro [id] desde la URL de la ruta
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID de Estudiante Detectado:</Text>
      <Text style={styles.idText}>{id}</Text>
      <Text style={styles.info}>
        Esta pantalla leyó el parámetro dinámico desde el archivo [id].tsx.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 24 },
  label: { fontSize: 14, color: '#64748B' },
  idText: { fontSize: 32, fontWeight: '900', color: '#000666', marginVertical: 8 },
  info: { fontSize: 14, color: '#334155', textAlign: 'center' }
});
```

---

### 3.6 `app/modal.tsx` (Pantalla Modal)
> **Ubicación:** `routego-app/app/modal.tsx`  
> **Propósito:** Pantalla con presentación tipo diálogo modal flotante.

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado del Servicio 🚐</Text>
      <Text style={styles.text}>Todas las unidades operan con normalidad.</Text>
      <Text style={styles.text}>Frecuencia estimada: 15 minutos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFBEB', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#B45309', marginBottom: 12 },
  text: { fontSize: 14, color: '#78350F', textAlign: 'center', marginVertical: 4 }
});
```

---

### 3.7 `app/+not-found.tsx` (Manejo de Error 404)
> **Ubicación:** `routego-app/app/+not-found.tsx`  
> **Propósito:** Muestra un mensaje amigable cuando el usuario intenta acceder a una ruta inexistente.

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 - Ruta no encontrada</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Volver al Inicio</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  link: { marginTop: 15, paddingVertical: 15 },
  linkText: { fontSize: 14, color: '#2e78b7' },
});
```

---

## 🎨 Paso 4: Modularización Feature-First (`src/`)

Para cumplir con la buena práctica de arquitectura de software explicada en la clase (separar rutas en `app/` de la lógica de negocio en `src/`), crea los siguientes archivos opcionales:

### 4.1 `src/components/CustomButton.tsx`
> **Ubicación:** `routego-app/src/components/CustomButton.tsx`

```tsx
import { Pressable, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'warning';
}

export function CustomButton({ title, onPress, variant = 'primary' }: CustomButtonProps) {
  return (
    <Pressable 
      style={[styles.btn, variant === 'warning' ? styles.btnWarning : styles.btnPrimary]} 
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginVertical: 6 },
  btnPrimary: { backgroundColor: '#000666' },
  btnWarning: { backgroundColor: '#F59E0B' },
  text: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }
});
```

---

## 📝 Paso 5: Entregable - Documento `ARCHITECTURE.md`

Para el **Paso 3 del Taller Entregable**, debes incluir un archivo `ARCHITECTURE.md` en la raíz de tu proyecto. Copia este contenido directamente:

> **Ubicación:** `routego-app/ARCHITECTURE.md`

```markdown
# Análisis de Arquitectura: Expo Router & Feature-First Pattern

**Estudiante:** [Tu Nombre Completo]  
**Módulo:** Desarrollo Móvil - Semana 3  
**Proyecto:** RouteGo App  

---

## 1. Estructura Actual del Proyecto (File-based Routing)

La aplicación utiliza el sistema de enrutamiento basado en archivos de **Expo Router**, en el cual la carpeta `app/` define de forma declarativa y jerárquica las rutas de la aplicación:

```text
app/
├── (tabs)/
│   ├── _layout.tsx       # Bottom Tabs Navigator
│   ├── index.tsx         # Ruta: / (Pestaña Inicio)
│   └── routes.tsx        # Ruta: /routes (Pestaña Rutas)
├── student/
│   └── [id].tsx          # Ruta Dinámica: /student/:id
├── modal.tsx             # Ruta Modal: /modal
├── _layout.tsx           # Root Stack Navigator
└── +not-found.tsx        # Manejador de error 404
```

---

## 2. Propuesta de Arquitectura Alternativa: Feature-First Architecture

Para optimizar la mantenibilidad en aplicaciones a gran escala, se propone desacoplar la lógica de presentación y de negocio de la carpeta `app/`, utilizándola únicamente para la definición de los puntos de entrada (rutas):

```text
routego-app/
├── app/                  # EXCLUSIVO PARA RUTAS (File-based Router wrappers)
│   ├── (tabs)/
│   ├── student/
│   ├── _layout.tsx
│   └── modal.tsx
│
└── src/                  # LÓGICA DE NEGOCIO Y COMPONENTES
    ├── components/       # Componentes UI atomizados y reutilizables (Botones, Tarjetas, Modales)
    ├── features/         # Módulos organizados por dominio funcional
    │   ├── shuttles/     # Componentes, hooks y estado de las rutas de autobús
    │   └── student/      # Componentes, hooks y estado del perfil de estudiante
    ├── hooks/            # Custom Hooks globales
    └── services/         # Consumo de API REST / Supabase / Firebase
```

---

## 3. Comparativa de Ventajas y Desventajas

| Criterio | Estructura Pura `app/` | Arquitectura Feature-First (`app/` + `src/`) |
| :--- | :--- | :--- |
| **Simplicidad inicial** | ⭐⭐⭐ Alta (Rápido para prototipos) | ⭐⭐ Moderada (Requiere más carpetas) |
| **Separación de Conceptos** | ❌ Baja (Lógica y UI mezcladas en rutas) | ✅ Alta (Rutas delgadas y lógica en `src/`) |
| **Mantenibilidad en equipos** | ❌ Media (Posible conflicto en `app/`) | ✅ Excelente (Cada feature está aislada) |
| **Reutilización de Código** | ⚠️ Limitada | ✅ Alta (Componentes y Hooks en `src/`) |

---

## 4. Conclusión del Arquitecto

Para proyectos pequeños o prototipos rápidos, la estructura básica en `app/` es adecuada. Sin embargo, para aplicaciones de producción como **RouteGo**, la **Arquitectura Feature-First** es la opción recomendada porque permite escalar módulos de manera independiente sin afectar la navegación global.
```

---

## 🚀 Paso 6: Ejecución y Pruebas

Para poner en marcha tu aplicación y probar la navegación en vivo:

1. Ejecuta el servidor de desarrollo Expo:
   ```bash
   npx expo start
   ```
2. Presiona `w` para abrir en el navegador web, o escanea el código QR desde la app **Expo Go** en tu dispositivo móvil (Android/iOS).
3. **Verificaciones recomendadas:**
   - [x] Haz clic en "Ver Estado de Shuttles (Modal)" para comprobar que abre la ventana flotante.
   - [x] Haz clic en "Ver Perfil Estudiante ST-202688" para verificar que pasa el parámetro `ST-202688` a la pantalla `[id].tsx`.
   - [x] Navega entre la pestaña **Inicio** y **Rutas** en la barra inferior.
