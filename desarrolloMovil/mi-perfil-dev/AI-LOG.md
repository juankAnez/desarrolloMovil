# 🤖 Bitácora de Auditoría de IA (AI-LOG) - Semana 1

**Estudiante:** Juan Carlos Añez Ahumada  
**Fecha:** 26/08/2026  
**Asignatura:** DESARROLLO MOVIL GRUPO B1  

---

## 1. Prompt de Configuración Utilizado

> **Instrucciones / Regla de Sistema (System Prompt):**  
> "Actúa como un **Junior Tech Lead** y compañero de *pair programming*. Tu función es orientar y apoyar al estudiante Juan Carlos Añez Ahumada en la creación de su aplicación `mi-perfil-dev`. 
> No debes hacer todo el trabajo de manera automatizada; debes explicar la estructura de React Native con TypeScript, asistir en comandos específicos cuando se requiera, proponer maquetas iniciales en `App.tsx` y permitir que el estudiante tome las decisiones de diseño, personalizados de estilos, gestión de assets y control de versiones con Git."

---

## 2. Peticiones Realizadas y Trabajo Colaborativo (Prompts)

### 📌 Fase 1: Creación del Proyecto Base
- **Petición del Estudiante:**  
  "Ayúdame a generar la estructura inicial del proyecto de Expo con el nombre `mi-perfil-dev` usando el template de TypeScript (`blank-typescript`)."
- **Trabajo Conjunto:**  
  - La IA ejecutó el comando de inicialización de Expo CLI (`npx create-expo-app@latest mi-perfil-dev -t blank-typescript`).
  - El estudiante revisó la estructura de archivos (`App.tsx`, `package.json`, `tsconfig.json`) para comprender la entrada del proyecto.

---

### 📌 Fase 2: Construcción de la Interfaz y Personalización de Diseño (`App.tsx`)
- **Petición del Estudiante:**  
  "Requiero la estructura base en `App.tsx` para mostrar mi foto (`avatar.jpeg`), mi nombre completo (Juan Carlos Añez Ahumada), mi carrera (*Ingeniería de Sistemas / Dev Móvil*), una biografía y mis 3 habilidades principales."
- **Trabajo Conjunto:**  
  - La IA propuso el maquetado inicial en JSX utilizando los componentes nativos de React Native (`SafeAreaView`, `ScrollView`, `Card`, `Text`, `Image`).
  - **Aportes y Modificaciones del Estudiante:**
    1. El estudiante tomó la decisión de reemplazar el tema por una paleta clara y limpia (`#FFFFFF`, `#F1F5F9`, `#0EA5E9`).
    2. El estudiante añadió y configuró su imagen personal `avatar.jpeg` en la carpeta `assets/`.
    3. El estudiante gestionó las confirmaciones y *commits* en el control de versiones de Git (`git add .` y `git commit -m "nuevo avatar"`).

---

### 📌 Fase 3: Resolución de Entorno Web e Integración de Iconos Vectoriales
- **Petición del Estudiante:**  
  "Se presentó el error `Unable to resolve react-native-web` al abrir en el navegador, y deseo cambiar los emojis por iconos vectoriales profesionales."
- **Trabajo Conjunto:**  
  - La IA instaló los módulos de soporte web (`react-dom`, `react-native-web`, `@expo/metro-runtime`) y el paquete de iconos `@expo/vector-icons`.
  - El estudiante solicitó la sustitución de emojis tradicionales por componentes `<Ionicons>` (`code-slash-outline`, `logo-javascript`, `git-branch-outline`, `school-outline`).

---

## 3. Auditoría de Componentes y Decisión de Arquitectura

| Componente | Uso Técnico | Aporte y Personalización del Estudiante |
| :--- | :--- | :--- |
| **`<SafeAreaView>`** | Delimita los márgenes seguros para evitar la muesca (*notch*) del dispositivo. | Mantenido con fondo suave `#F1F5F9`. |
| **`<ScrollView>`** | Habilita el desplazamiento vertical responsivo en cualquier tamaño de pantalla. | Estructurado para centrado de tarjeta de perfil. |
| **`<Image>`** | Renderiza la fotografía de perfil. | El estudiante integró su imagen `avatar.jpeg` con borde azul `#0EA5E9`. |
| **`<Text>`** | Despliega cadenas de texto tipadas. | Ajuste de contrastes oscuros (`#0F172A`, `#475569`) para legibilidad. |
| **`<Ionicons>`** | Iconografía vectorial nativa de Expo. | Selección de iconos temáticos para desarrollo e ingeniería. |
| **`StyleSheet`** | Estilos compilados eficientemente en React Native. | Modificación manual por parte del estudiante del esquema de color a tema claro. |

---

## 4. Conclusión del Trabajo en Equipo

El desarrollo de esta práctica fue un **esfuerzo colaborativo**: la IA actuó como guía de sintaxis, resolución de errores de empaquetado e instalación de dependencias, mientras que el estudiante **Juan Carlos Añez Ahumada** dirigió las especificaciones, personalizó el diseño de la interfaz a tema claro, integró los recursos multimedia y administró el repositorio Git del proyecto.
