# TaskFlow Mobile — Documentación Técnica de React Hooks (React Native & Expo)

**Actividad Académica:** Demostración Práctica y Funcional de React Hooks en una Aplicación Móvil Real.  
**Desarrollador / Estudiante:** Juan Carlos Áñez  
**Proyecto:** TaskFlow (Dashboard SaaS Móvil para Gestión de Proyectos y Tareas)  
**Tecnologías:** React Native 0.86, Expo SDK 57, React 19, TypeScript, React Native Safe Area Context, Expo Vector Icons.

---

## 1. Justificación y Análisis de los 6 React Hooks

A continuación se detalla cómo cada uno de los 6 Hooks requeridos fue implementado con un propósito real y tangible, evitando usos artificiales o declarativos sin impacto en el ciclo de vida del software móvil.

---

### 1. `useState`

* **Archivos donde se utiliza:**
  * [`src/hooks/useTasks.ts`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/hooks/useTasks.ts)
  * [`src/components/tasks/TaskModal.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/components/tasks/TaskModal.tsx)
  * [`src/context/AppContext.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/context/AppContext.tsx)
* **Qué problema resuelve:**
  Permite a los componentes funcionales mantener y actualizar memoria reactiva entre renders, provocando actualizaciones instantáneas en el árbol de componentes móviles de React Native cuando los datos cambian.
* **Qué parte de la aplicación controla:**
  * La lista viva de tareas (`tasks`).
  * Los filtros activos: búsqueda textual (`searchQuery`), estado (`statusFilter`), prioridad (`priorityFilter`) y proyecto (`projectFilter`).
  * El estado de apertura/cierre de modales nativos (`isTaskModalOpen`, `taskToDelete`).
  * Los campos locales del formulario de tarea (`title`, `description`, `project`, `priority`, `status`, `dueDate`).
  * La cola de notificaciones tipo Toast y la pestaña activa (`activeTab`).
* **Por qué se eligió:**
  Es el Hook estándar y fundamental de React para estados mutables que deben reflejarse inmediatamente en la interfaz móvil.

---

### 2. `useEffect`

* **Archivos donde se utiliza:**
  * [`src/hooks/useTasks.ts`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/hooks/useTasks.ts)
  * [`src/components/tasks/TaskModal.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/components/tasks/TaskModal.tsx)
  * [`src/components/tasks/TaskFilters.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/components/tasks/TaskFilters.tsx)
* **Qué problema resuelve:**
  Permite sincronizar la aplicación con sistemas externos y efectos secundarios (Side Effects) fuera del flujo puro de renderizado, como APIs asíncronas simuladas, temporizadores de hidratación y manipulación de foco en inputs nativos.
* **Qué parte de la aplicación controla:**
  1. **Carga simulada de API (`useTasks.ts`):** al montar la aplicación (`[]`), ejecuta un retardo controlado de 700ms mostrando un estado de *Loading con ActivityIndicator* profesional antes de hidratar las tareas mock.
  2. **Persistencia y sincronización (`useTasks.ts`):** al modificar tareas, dispara el efecto de actualización persistente.
  3. **Auto-focus del Modal (`TaskModal.tsx`):** al abrir el modal nativo, sincroniza los datos y dispara el temporizador de auto-focus sobre el campo de texto.
  4. **Disparo de búsqueda remota (`TaskFilters.tsx`):** cuando el usuario presiona el icono de búsqueda en el Header, `useEffect` detecta el cambio y enfoca programáticamente el `TextInput`.
* **Por qué se eligió:**
  Garantiza que las operaciones asíncronas y los eventos de montaje/desmontaje no bloqueen la renderización inicial ni generen fugas de memoria (*memory leaks*).

---

### 3. `useContext`

* **Archivos donde se utiliza:**
  * Definición: [`src/context/AppContext.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/context/AppContext.tsx)
  * Consumo: [`src/App.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/App.tsx), [`src/components/layout/Header.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/components/layout/Header.tsx), [`src/components/layout/BottomTabs.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/components/layout/BottomTabs.tsx), [`src/pages/ProfilePage.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/pages/ProfilePage.tsx), [`src/components/common/ToastContainer.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/components/common/ToastContainer.tsx).
* **Qué problema resuelve:**
  Evita el *Prop Drilling* (pasar props manualmente a través de múltiples niveles de componentes intermedios de React Native).
* **Qué parte de la aplicación controla:**
  * La información del perfil de usuario autenticado (*Juan Carlos Áñez*).
  * El tema global (`light` / `dark`) y la paleta dinámica `colors`.
  * La pestaña activa de navegación móvil (`dashboard`, `tasks`, `projects`, `profile`).
  * El sistema centralizado de notificaciones flotantes (`notify(message, type)`).
  * El disparador de enfoque del buscador (`triggerSearchFocus()`).
* **Por qué se eligió:**
  Proporciona una fuente única de verdad para datos globales de la sesión sin acoplar la jerarquía de componentes.

---

### 4. `useRef`

* **Archivos donde se utiliza:**
  * [`src/components/tasks/TaskModal.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/components/tasks/TaskModal.tsx)
  * [`src/components/tasks/TaskFilters.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/components/tasks/TaskFilters.tsx)
* **Qué problema resuelve:**
  Permite interactuar directamente con elementos imperativos de la vista nativa (como enfocar un componente `TextInput` y desplegar el teclado móvil) sin provocar re-renderizados innecesarios del componente.
* **Qué parte de la aplicación controla:**
  1. **Auto-focus del Modal (`TaskModal.tsx`):** la referencia `titleInputRef` apunta al componente nativo `TextInput` del Título. Al abrirse el modal, ejecuta `titleInputRef.current?.focus()` de forma inmediata para que el usuario pueda escribir directamente sin tener que pulsar sobre el campo.
  2. **Enfoque del Buscador (`TaskFilters.tsx`):** la referencia `searchInputRef` apunta al `TextInput` de búsqueda. Cuando el usuario pulsa el icono de búsqueda del Header, `searchInputRef.current?.focus()` le da el foco directamente.
* **Por qué se eligió:**
  Es el mecanismo idóneo y canónico de React Native para acceder a las referencias de componentes nativos de forma limpia y controlada.

---

### 5. `useMemo`

* **Archivos donde se utiliza:**
  * [`src/hooks/useTasks.ts`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/hooks/useTasks.ts)
* **Qué problema resuelve:**
  Memoriza el resultado de cálculos derivados costosos, ejecutándolos **únicamente** cuando sus dependencias cambian, optimizando la tasa de cuadros por segundo (FPS) en dispositivos móviles.
* **Qué parte de la aplicación controla:**
  1. **Estadísticas de Productividad (`statistics`):**
     * Total de tareas.
     * Tareas completadas, en curso y pendientes.
     * Tasa porcentual de finalización (`completionRate = Math.round((completed / total) * 100)`).
     * Cantidad de tareas pendientes de alta prioridad.
     * *Dependencia:* `[tasks]`. Si el usuario cambia de tema o navega entre pestañas, estas estadísticas **no se recalculan**, ahorrando ciclos de CPU del teléfono.
  2. **Lista Filtrada de Tareas (`filteredTasks`):**
     * Cruza búsqueda por texto, filtro de estado, filtro de prioridad y filtro de proyecto.
     * *Dependencias:* `[tasks, searchQuery, statusFilter, priorityFilter, projectFilter]`.
  3. **Resúmenes por Proyecto (`projectSummaries`):**
     * Agrupa y calcula el porcentaje de avance individual de cada proyecto.
* **Por qué se eligió:**
  Garantiza fluidez de nivel profesional en dispositivos móviles al no repetir cálculos en renders secundarios causados por interacciones de UI.

---

### 6. `useCallback`

* **Archivos donde se utiliza:**
  * Definición: [`src/hooks/useTasks.ts`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/hooks/useTasks.ts)
  * Consumo con `React.memo`: [`src/components/tasks/TaskCard.tsx`](file:///C:/Proyectos/desarrolloMovil/actividad-hooks/src/components/tasks/TaskCard.tsx)
* **Qué problema resuelve:**
  En JavaScript, las funciones declaradas dentro de un componente funcional se recrean como nuevas instancias en cada renderizado (`() => {} !== () => {}`). Esto destruye la optimización de componentes hijos memorizados con `React.memo`. `useCallback` memoriza la referencia de la función.
* **Qué parte de la aplicación controla:**
  * `handleChangeStatus`: cambia el estado de una tarea entre TODO, IN_PROGRESS y COMPLETED.
  * `handleSaveTask`: crea o actualiza tareas.
  * `handleConfirmDelete`: remueve una tarea confirmada.
  * `handleTogglePin`: fija o desfija una tarea en la lista.
* **Por qué se eligió:**
  Al pasar estas funciones a `TaskCard` (que está envuelto en `React.memo`), garantizamos que al editar o cambiar el estado de una tarea específica, **las demás tarjetas del `FlatList` no se vuelvan a renderizar**, logrando un rendimiento móvil suave a 60 FPS.

---

## 2. Guía para Demostración durante la Presentación Oral

Sigue estos sencillos pasos durante la sustentación oral para demostrar el funcionamiento en vivo de cada Hook:

| Hook | Acción a realizar frente al docente | Resultado observable en pantalla |
| :--- | :--- | :--- |
| **`useEffect`** | Recarga la aplicación (pulsa `R` en la terminal de Expo o recarga la app). | Observa la pantalla de carga (*Iniciando TaskFlow SaaS...*) con el `ActivityIndicator` animado durante 700ms mientras hidrata los datos iniciales. |
| **`useContext`** | Pulsa el icono de **Sol / Luna** en el Header o el Switch en la pestaña **Perfil**. | Toda la aplicación móvil (header, barra inferior de pestañas, fondo, tarjetas, textos, badges y modales) cambia entre Modo Claro y Oscuro instantáneamente sin pasar props manuales. |
| **`useRef`** | En la barra superior, pulsa el botón **"+"** para crear una tarea. | El modal se desliza y el cursor **se posiciona automáticamente dentro del TextInput "Título"** con el teclado disponible sin tener que tocar el campo. Luego cierra el modal y pulsa el icono de la lupa en el Header: el buscador de la pestaña de tareas recibirá el foco de inmediato. |
| **`useState`** | Escribe un título (ej: *"Prueba Parcial"*), selecciona un proyecto y pulsa **"Crear Tarea"**. | La tarea aparece de inmediato en la lista, se lanza un Toast nativo de confirmación y los contadores y badges se actualizan al instante. |
| **`useMemo`** | En el **Dashboard**, pulsa el checkbox de cualquier tarea reciente para marcarla como **"Completada"**. | Observa cómo la barra de progreso global, el porcentaje `%` y las tarjetas de métricas se recalculan al instante sin bloqueos. |
| **`useCallback`** | En la pestaña **Tareas**, pulsa el botón de actualizar estado o el pin en una tarjeta. | La acción se ejecuta a través de un callback memorizado estable. Al estar `TaskCard` envuelto en `React.memo`, las demás tarjetas de la lista no experimentan re-renderizados innecesarios. |

---

## 3. Instrucciones de Ejecución

Para iniciar la aplicación en cualquier momento:

```bash
# 1. Ingresar a la carpeta del proyecto
cd C:\Proyectos\desarrolloMovil\actividad-hooks

# 2. Iniciar el servidor Expo
npx expo start
```

### Opciones de visualización:
* **En el celular (Android / iOS):** Escanea el código QR que aparece en la terminal con la aplicación **Expo Go**.
* **En el navegador Web:** Pulsa la tecla **`w`** en la terminal para abrirlo en el navegador con emulación móvil.
* **En emulador Android:** Pulsa la tecla **`a`** en la terminal.
