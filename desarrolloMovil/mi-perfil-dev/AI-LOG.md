#  Bitácora de Auditoría de IA (AI-LOG) - Semana 1

**Estudiante:** Juan Carlos Añez Ahumada  
**Fecha:** 26/08/2026  
**Asignatura:** DESARROLLO MOVIL GRUPO B1  

---

## 1. Prompt de Configuración Utilizado

> **Instrucciones / Regla de Sistema (System Prompt):**
> "Actúa como un **Junior Tech Lead** y mentor en React Native / Expo. Tu objetivo es ayudar al estudiante Juan Carlos Añez Ahumada a construir la aplicación móvil `mi-perfil-dev` usando el plantilla `blank-typescript` de Expo.
> 
> Debes seguir las mejores prácticas de arquitectura móvil:
> 1. Código limpio, tipado estricto en TypeScript y componentes funcionales.
> 2. Diseño de interfaz moderno, responsivo y visualmente atractivo utilizando `StyleSheet` con jerarquía clara de colores, elevación/sombras y bordes redondeados.
> 3. Utilizar únicamente componentes oficiales de React Native (`SafeAreaView`, `ScrollView`, `View`, `Text`, `Image`, `StatusBar`).
> 4. Auditar cada decisión de código y explicar detalladamente qué hace cada componente para que el estudiante entienda el funcionamiento interno y pueda defender su proyecto."

---

## 2. Peticiones Realizadas (Prompts)

###  Prompt #1: Generación del Proyecto Base Expo con TypeScript
- **Petición del Estudiante:**  
  "Genera un nuevo proyecto de Expo con el nombre `mi-perfil-dev` usando el template de TypeScript (`blank-typescript`)."
- **Acción Realizada:**  
  Se ejecutó el comando de inicialización de Expo:
  ```bash
  npx create-expo-app@latest mi-perfil-dev --template blank-typescript --yes
  ```
- **Auditoría Técnica:**  
  El comando crea una estructura mínima y limpia de React Native con TypeScript habilitado (`tsconfig.json`), con `App.tsx` como el punto de entrada principal del desarrollo.

---

### Prompt #2: Diseño e Implementación de la Interfaz (`App.tsx`)
- **Petición del Estudiante:**  
  "Diseña la interfaz principal en `App.tsx` para mostrar:
  1. Mi foto o avatar utilizando el componente `<Image>`.
  2. Mi nombre completo (Juan Carlos Añez Ahumada), rol/carrera (Ingeniería de Sistemas / Desarrollador Móvil Junior) y una breve biografía.
  3. Una lista de mis 3 tecnologías o habilidades favoritas estilizadas como badges."
- **Acción Realizada:**  
  Se implementó el componente funcional `App.tsx` con un sistema de diseño basado en tarjetas (`cards`), avatares circulares y badges interactivos.

---

### Prompt #3: Configuración y Resolución de Entorno Web
- **Petición del Estudiante:**  
  "Soporte y resolución del error de empaquetado `Unable to resolve react-native-web` al ejecutar en el navegador."
- **Acción Realizada:**  
  Se ejecutó la instalación de las dependencias oficiales para el soporte web de Expo:
  ```bash
  npx expo install react-dom react-native-web @expo/metro-runtime
  ```
- **Auditoría Técnica:**  
  Permite que Metro bundler transpile los componentes nativos de React Native a elementos HTML5 equivalentes (`<div>`, `<span>`, `<img>`) al ejecutar en el navegador.

---

## 3. Auditoría y Explicación Detallada de Componentes de React Native

| Componente | Función en la Aplicación |
| :--- | :--- |
| **`<SafeAreaView>`** | Evita que el contenido quede oculto bajo la muesca (*notch*), la barra de estado o la barra de navegación del dispositivo. |
| **`<ScrollView>`** | Permite el desplazamiento vertical para garantizar que todo el contenido sea visible en pantallas de cualquier tamaño. |
| **`<Image>`** | Renderiza la fotografía o avatar del usuario. Se configura con un `source` (imagen local o remota) y `style` para el borde circular (`borderRadius`). |
| **`<Text>`** | Componente nativo para mostrar textos. Permite definir la jerarquía visual mediante estilos (`fontSize`, `fontWeight`, `color`). |
| **`<View>`** | Funciona como contenedor (`div` en React web) utilizando el modelo Flexbox por defecto en React Native para organizar elementos horizontal o verticalmente. |
| **`<StatusBar>`** | Ajusta el estilo visual de la barra de estado del teléfono (reloj, batería, iconos) para que encaje con el tema claro/oscuro de la app. |
| **`StyleSheet.create`** | Abstracción que valida y compila los objetos de estilo de manera eficiente, manteniendo el código organizado y de alto rendimiento. |

---

## 4. Lecciones Aprendidas y Conclusión

1. **Diferencia entre React Web y React Native:** En React Native no se usan etiquetas HTML como `<div>`, `<span>` o `<img>`, sino componentes nativos de la plataforma (`View`, `Text`, `Image`).
2. **Flexbox en React Native:** A diferencia de la web donde `flex-direction` es por defecto `row`, en React Native `flexDirection` es por defecto `column`.
3. **Manejo de Estilos:** Usar `StyleSheet.create` previene re-crear objetos de estilo en cada renderizado, optimizando la memoria y el rendimiento de la app.
