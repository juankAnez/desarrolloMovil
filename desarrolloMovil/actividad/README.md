# FocusUp - App Comercial de Seguimiento de Hábitos y Productividad

![App Screenshot](./screenshot.png)

## 📌 Explicación del Diseño Replicado

**FocusUp** es una maquetación móvil moderna desarrollada con **React Native**, **Expo** y **NativeWind (Tailwind CSS)**. Su diseño replica la experiencia visual y fluidez de aplicaciones comerciales como *Airbnb*, *Uber* o *Instagram*, organizando componentes nativos y tarjetas interactivas de seguimiento personal.

---

## 📝 Requisitos Técnicos Cumplidos

### 1. Contenedores Principales
- **`<SafeAreaView>`**: Garantiza la correcta adaptación del área segura en dispositivos iOS y Android.
- **`<ScrollView>`**: Permite el desplazamiento continuo y fluido en toda la interfaz sin desbordamientos.

### 2. Componentes Core Obligatorios
- **`<TextInput>` Funcional**: 
  - Barra de búsqueda interactiva en `HomeScreen.js` para filtrar hábitos en tiempo real por palabra clave.
  - Campos de entrada de datos en `LoginScreen.js` y `CreateHabitScreen.js` (Nombre completo, Correo electrónico y Contraseña).
- **`<Image>` (Remotas y Locales)**:
  - **Imagen 1 (Avatar del Usuario)**: Carga remota con URL en `HomeScreen.js` (`source={{ uri: 'https://images.unsplash.com/photo-1534528741775...' }}`).
  - **Imagen 2 (Banner Hero de Fondo)**: Carga remota de alta resolución en el dashboard principal para el fondo de la tarjeta de progreso.
- **`<Pressable>` con Respuesta de Estado**:
  - Botones de acción con clases de utilidad como `active:opacity-70`, `active:scale-95` y `active:opacity-90` para dar retroalimentación visual al toque en:
    1. Botón de búsqueda / notificación.
    2. Botón de cerrar sesión (`logout`).
    3. Botón flotante CTA *"Crear nuevo hábito"*.
    4. Botones de filtrado de categorías (*Todos, Hoy, Completados, Pendientes*).

### 3. Estilos NativeWind (Tailwind CSS)
- **Sin utilizar `StyleSheet.create()`**: Todos los estilos están definidos 100% mediante clases de utilidad de Tailwind CSS (`className="..."`) para bordes, sombras, degradados, espaciados y respuesta de opacidad.

---

## 🛠️ Cómo Ejecutar el Proyecto

1. **Instalar dependencias (si es necesario):**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de Expo:**
   ```bash
   npm start
   ```

3. **Abrir en el navegador o emulador:**
   - Presiona `w` para la versión web.
   - Presiona `a` para emulador de Android.
   - Presiona `i` para emulador de iOS.

---

## 📁 Estructura del Código

```
actividad/
├── App.js                     # Contenedor principal y navegación (SafeAreaView + Animated)
├── screenshot.png             # Captura de pantalla de la aplicación
├── tailwind.config.js         # Configuración de NativeWind / Tailwind CSS
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js      # Dashboard principal (TextInput, Images remotas, Pressable)
│   │   ├── LoginScreen.js     # Pantalla de Login e ingreso de usuario
│   │   ├── WelcomeScreen.js   # Onboarding en 3 pasos
│   │   ├── CreateHabitScreen.js # Formulario de creación
│   │   └── ProgressScreen.js  # Estadísticas del usuario
│   ├── components/
│   │   ├── ProgressBar.js     # Barra de progreso
│   │   ├── HabitCard.js       # Tarjetas interactivas
│   │   └── BottomNavigation.js# Navegación inferior
```

---

**Desarrollado con React Native, Expo & NativeWind.**
