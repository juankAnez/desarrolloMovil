# FocusUp - Aplicación de Seguimiento de Hábitos

Una aplicación móvil moderna para seguimiento de hábitos y productividad personal, desarrollada con React Native y Expo.

## 📋 Descripción

**FocusUp** es una app minimalista y profesional que permite a los usuarios:
- 📊 Monitorear el progreso diario de hábitos
- ➕ Crear nuevos hábitos personalizados
- 📈 Visualizar estadísticas semanales
- 🏆 Mantener una racha de cumplimiento

## 🎯 Características

### Tres Vistas Principales

#### 1. **HomeScreen** (Inicio / Dashboard)
- Saludo personalizado con avatar del usuario
- Barra de progreso del día (70% completado)
- Listado de hábitos con estado actual
- Botón para crear nuevos hábitos

#### 2. **CreateHabitScreen** (Crear Hábito)
- Formulario para crear hábitos
- Campos: Nombre, Descripción, Meta diaria, Categoría
- Validación de datos
- Sugerencias de categorías

#### 3. **ProgressScreen** (Mi Progreso)
- Avatar y nombre del usuario
- Estadísticas rápidas (12 hábitos, 86% completados, 7 días racha)
- Progreso semanal por categoría
- Objetivo semanal general (78%)

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **JavaScript/JSX** - Lenguaje de programación
- **Componentes nativos**: View, Text, TextInput, Image, ScrollView, Pressable

## 📁 Estructura del Proyecto

```
actividad/
├── App.js                          # Componente principal (navegación)
├── index.ts                        # Punto de entrada
├── package.json                    # Dependencias
├── app.json                        # Configuración de Expo
├── tailwind.config.js              # Configuración de Tailwind
├── postcss.config.js               # Configuración PostCSS
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js           # Vista 1: Dashboard
│   │   ├── CreateHabitScreen.js    # Vista 2: Crear hábito
│   │   └── ProgressScreen.js       # Vista 3: Progreso
│   ├── components/
│   │   ├── ProgressBar.js          # Barra de progreso reutilizable
│   │   ├── HabitCard.js            # Tarjeta de hábito reutilizable
│   │   └── BottomNavigation.js     # Navegación inferior
│   └── styles/
│       └── theme.js                # Colores y estilos globales
```

## 🚀 Cómo Ejecutar

### Requisitos Previos
- Node.js instalado
- npm o yarn

### Instalación

1. **Navega a la carpeta del proyecto:**
   ```bash
   cd c:\Proyectos\desarrolloMovil\actividad
   ```

2. **Las dependencias ya están instaladas, pero puedes verificar:**
   ```bash
   npm install
   ```

3. **Ejecuta el proyecto:**
   ```bash
   npm start
   ```

### Opciones de Ejecución

- **Web (recomendado para prueba rápida):**
  ```bash
  npm run web
  ```

- **Android:**
  ```bash
  npm run android
  ```

- **iOS:**
  ```bash
  npm run ios
  ```

## 📌 Componentes Requeridos y Dónde Se Usan

### 1. **View** ✅
El componente View se utiliza para crear contenedores y layouts en toda la aplicación:
- `src/screens/HomeScreen.js` (línea 21) - Contenedor principal
- `src/screens/CreateHabitScreen.js` (línea 66) - Tarjeta del formulario
- `src/screens/ProgressScreen.js` (línea 39) - Contenedor de avatar
- `src/components/ProgressBar.js` (línea 10) - Barra de progreso
- `src/components/HabitCard.js` (línea 13) - Tarjeta de hábito
- `src/components/BottomNavigation.js` (línea 12) - Barra de navegación
- `App.js` (línea 17) - Contenedor principal

### 2. **Text** ✅
El componente Text se usa para mostrar todo tipo de texto:
- `src/screens/HomeScreen.js` (línea 29) - "Hola, Juan 👋"
- `src/screens/CreateHabitScreen.js` (línea 65) - Labels del formulario
- `src/screens/ProgressScreen.js` (línea 48) - "Mi progreso"
- `src/components/HabitCard.js` (línea 24) - Nombre del hábito
- `src/components/ProgressBar.js` - No requiere Text (solo View)

### 3. **Image** ✅
El componente Image se utiliza para mostrar avatares del usuario:
- `src/screens/HomeScreen.js` (línea 20) - Avatar circular de 60x60
- `src/screens/ProgressScreen.js` (línea 35) - Avatar de 80x80

### 4. **TextInput** ✅
El componente TextInput se usa para capturar datos del usuario:
- `src/screens/CreateHabitScreen.js` (línea 58) - Nombre del hábito
- `src/screens/CreateHabitScreen.js` (línea 74) - Descripción (multiline)
- `src/screens/CreateHabitScreen.js` (línea 95) - Meta diaria
- `src/screens/CreateHabitScreen.js` (línea 115) - Categoría

### 5. **Barras de Progreso (creadas con View)** ✅
Las barras de progreso se construyen manualmente usando Views:
- `src/components/ProgressBar.js` (línea 10-20) - Componente principal
- `src/screens/HomeScreen.js` (línea 70) - Progreso diario
- `src/screens/ProgressScreen.js` (línea 92) - Progreso semanal por categoría
- `src/screens/ProgressScreen.js` (línea 126) - Objetivo semanal
- `src/components/HabitCard.js` (línea 36) - Progreso individual del hábito

### 6. **TouchableOpacity / Pressable** ✅
Se utiliza Pressable para botones interactivos:
- `src/screens/HomeScreen.js` (línea 88) - Botón "Nuevo hábito"
- `src/screens/CreateHabitScreen.js` (línea 136) - Botón "Guardar hábito"
- `src/components/BottomNavigation.js` (línea 28) - Botones de navegación
- `src/components/HabitCard.js` (línea 12) - Tarjeta interactiva

### 7. **ScrollView** ✅
ScrollView se usa para permitir desplazamiento en pantallas largas:
- `src/screens/HomeScreen.js` (línea 17) - Contenedor principal de HomeScreen
- `src/screens/CreateHabitScreen.js` (línea 48) - Contenedor principal de CreateHabitScreen
- `src/screens/ProgressScreen.js` (línea 25) - Contenedor principal de ProgressScreen

## 🎨 Paleta de Colores

```javascript
Colores principales:
- Morado primario: #7c5cff
- Azul secundario: #6366f1
- Verde éxito: #10b981
- Fondo: #f9fafb
- Blanco: #ffffff
- Texto oscuro: #1f2937
- Texto claro: #9ca3af
- Bordes: #e5e7eb
```

## 📱 Responsividad

La aplicación está optimizada para:
- Android 360x800 (móviles pequeños)
- Android 412x915 (móviles estándar)
- iPhone estándar (375x812)

Se utilizan unidades relativas (flex, %, padding, margin) en lugar de valores fijos.

## 🔄 Flujo de Navegación

```
HomeScreen
    ↓
[+ Nuevo hábito] → CreateHabitScreen
    ↓
BottomNavigation
    ├── 🏠 Inicio (HomeScreen)
    ├── ➕ Crear (CreateHabitScreen)
    └── 📊 Progreso (ProgressScreen)
```

## ✨ Notas Importantes

- ✅ No hay backend ni base de datos
- ✅ Los datos son datos de ejemplo en tiempo de compilación
- ✅ Las alertas funcionan pero no persisten datos
- ✅ El código está comentado para fácil identificación de componentes
- ✅ La app es completamente funcional y lista para presentar

## 📚 Líneas Importantes para la Presentación

Cuando presentes la app al profesor, muestra:

1. **Componente View** → `src/components/ProgressBar.js` (línea 10)
2. **Componente Text** → `src/screens/HomeScreen.js` (línea 29)
3. **Componente Image** → `src/screens/HomeScreen.js` (línea 20)
4. **Componente TextInput** → `src/screens/CreateHabitScreen.js` (línea 58)
5. **Barras de Progreso** → `src/components/ProgressBar.js` (línea 10-20)
6. **Pressable** → `src/components/BottomNavigation.js` (línea 28)
7. **ScrollView** → `src/screens/HomeScreen.js` (línea 17)

## 🐛 Validación

- ✅ Validación en formulario de crear hábito
- ✅ Alertas de éxito
- ✅ Bordes suaves y sombras en tarjetas
- ✅ Espaciado consistente
- ✅ Colores profesionales y modernos

## 📞 Soporte

Si tienes problemas ejecutando la app:
1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que npm esté actualizado: `npm --version`
3. Reinstala dependencias: `npm install`
4. Limpia cache: `npm start -- --reset-cache`

---

**¡Buena suerte con tu presentación!** 🚀
