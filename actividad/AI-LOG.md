# Bitácora de Auditoría de IA (AI-LOG) - Semana 1

**Estudiante:** Juan Añez, Andrés García  
**Fecha:** 6 de Septiembre de 2026  

---

## 1. Prompt de Configuración Utilizado
> "Actúa como un asistente de código y revisor técnico para mi aplicación móvil en React Native y Expo. Ayúdame a solucionar problemas puntuales de flujo de datos entre pantallas, refactorizar controladores de navegación y mejorar la interfaz manteniendo las mejores prácticas de desarrollo (componentes `Pressable`, transiciones animadas y código modular)."

---

## 2. Peticiones Realizadas (Prompts y Apoyo Técnico)

* **Prompt 1 (Diagnóstico y Paso de Estado):** 
  > "Revisa la estructura de mi proyecto en la carpeta `actividad`. Tengo un detalle con el flujo de información: el nombre que escribe el usuario al iniciar sesión no se refleja en la pantalla principal (Home), ya que el saludo tiene un texto estático. Ayúdame a analizar cómo transferir el valor desde `LoginScreen` hacia `App.js` y enviarlo como prop a `HomeScreen`."

* **Prompt 2 (Navegación y Cierre de Sesión):**
  > "Necesito apoyo para habilitar la acción de retroceso (flecha atrás) desde el inicio de sesión hacia el Onboarding, ajustar los componentes visuales del Login y agregar la funcionalidad de cerrar sesión (`logout`) en el Dashboard principal para volver a la pantalla de inicio."

---

## 3. Análisis Crítico y Correcciones (Auditoría)

* **¿La IA cometió algún error o usó código en desuso?**  
  *En la revisión inicial, el icono de retroceso en el encabezado de `LoginScreen` utilizaba un contenedor `<View>` estático sin controlador de eventos `onPress`. Durante la auditoría del código, le solicité reemplazar esa vista por un `<Pressable>` nativo de React Native para cumplir con los estándares actuales de usabilidad y pasar la función `onBackPress` desde la navegación principal en `App.js`.*

* **¿Qué aprendiste de la sugerencia que te dio la IA?**  
  *Aprendí a estructurar la transferencia de datos unidireccional y el manejo de callbacks (`onLoginPress`, `onLogout`, `onBackPress`) desde un componente padre (`App.js`) hacia las pantallas secundarias. También reforcé cómo derivar propiedades dinámicas en tiempo de ejecución (como calcular la inicial del avatar a partir del nombre del usuario).*
