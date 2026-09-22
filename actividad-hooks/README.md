# TaskFlow Mobile 🚀 (React Native + Expo)

Aplicación móvil moderna de gestión de proyectos y tareas (tipo SaaS) desarrollada para demostrar el uso real, funcional y profesional de los **6 React Hooks fundamentales** en React Native:

1. **`useState`**: Estado local de tareas, filtros activos, inputs y modales.
2. **`useEffect`**: Hidratación asíncrona simulada de API (700ms con spinner `ActivityIndicator`), persistencia y listeners de foco.
3. **`useContext`**: `AppContext` global que distribuye el usuario autenticado (*Juan Carlos Áñez*), cambio dinámico de tema Claro/Oscuro y sistema de notificaciones Toast.
4. **`useRef`**: Auto-enfoque programático en el `TextInput` al abrir el modal nativo de creación y al activar la búsqueda desde el header.
5. **`useMemo`**: Cálculo de estadísticas KPI, % de progreso global y filtrado reactivo multitarea sin recalcular en renders secundarios.
6. **`useCallback`**: Callbacks de acción memorizados para evitar re-renderizados innecesarios en componentes envueltos en `React.memo(TaskCard)`.

---

## 📱 Cómo ejecutar la aplicación

```bash
# 1. Posicionarse en la carpeta
cd C:\Proyectos\desarrolloMovil\actividad-hooks

# 2. Iniciar con Expo
npx expo start
```

* Presiona **`w`** para abrir en navegador web.
* Escanea el QR con **Expo Go** en Android o iOS.
* Presiona **`a`** para abrir en el emulador de Android.

---

## 📑 Documentación para la Presentación
Revisa [`HOOKS_DOCUMENTATION.md`](./HOOKS_DOCUMENTATION.md) para consultar la justificación técnica y la guía paso a paso para la sustentación oral frente al docente.
