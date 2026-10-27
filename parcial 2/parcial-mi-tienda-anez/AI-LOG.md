# 🤖 Registro de Uso de Inteligencia Artificial (AI-LOG.md)

**Estudiante:** Juan Carlos Áñez Ahumada  
**Módulo:** Desarrollo Móvil — Parcial 2  
**Fecha:** 26 de Octubre de 2026  

---

## 1. Prompts Utilizados

### Prompt Principal:
> *"Lee lo que hay en el documento dentro de parcial 2 y empieza a realizarlo al pie de la letra siguiendo todos los reglamentos que pide el docente porfa, todo perfecto sin errores."*

### Prompt Secundario (Refinamiento técnico):
> *"Genera la estructura de base de datos local para SQLite con Drizzle ORM siguiendo estrictamente la restricción del docente de no importar librerías de Expo en `db/schema.ts` para evitar fallos de ejecución en Node con `drizzle-kit`, implementando un repositorio desacoplado y el adaptador por fragmentos en SecureStore."*

---

## 2. Ajustes y Correcciones Realizadas sobre el Código Generado

1. **Corrección de Sintaxis en Repositorio Drizzle:**
   - **Problema detectado:** Al redactar los filtros `.where()`, se colocó inicialmente una coma externa en las llamadas `eq()`, como `eq(products.id), id`.
   - **Ajuste aplicado:** Se corrigió inmediatamente a `eq(products.id, id)` y `eq(products.clientId, clientId)`. El compilador TypeScript (`npx tsc --noEmit`) verificó que 0 errores permanecieran en el proyecto.

2. **Aislamiento Estricto de Dependencias Expo en `schema.ts`:**
   - **Regla docente:** `drizzle-kit generate` es ejecutado directamente por Node.js en la máquina de desarrollo; si se importa `expo-crypto` o cualquier módulo de Expo en `db/schema.ts`, falla con `Unexpected "typeof"`.
   - **Ajuste aplicado:** `db/schema.ts` se mantuvo exclusivamente dependiente de `drizzle-orm/sqlite-core`. La generación de UUIDs se trasladó a [`db/repositories/products.ts`](db/repositories/products.ts) utilizando `Crypto.randomUUID()`.

3. **Adaptador de Almacenamiento Seguro (SecureStore Chunking):**
   - **Regla docente:** No utilizar `AsyncStorage`. Solo `SecureStore`.
   - **Ajuste aplicado:** Para solventar el límite de tamaño por clave en Android/iOS (~2048 bytes), se implementó un algoritmo de fragmentación por bloques de 1800 caracteres en [`lib/secureStorage.ts`](lib/secureStorage.ts), garantizando compatibilidad con tokens JWT de Supabase sin romper la persistencia tras reiniciar la app.

---

## 3. Alucinaciones o Desviaciones Detectadas y Resueltas

* **Alucinación potencial sobre `Stack.Protected`:**
  - Algunas versiones antiguas de asistentes sugieren que `Stack.Protected` no existe de forma nativa en React Navigation y recomiendan usar únicamente grupos de rutas `(auth)` o `(app)`.
  - **Verificación real:** Se inspeccionó el paquete `expo-router` versión SDK 57 instalado en el proyecto (`node_modules/expo-router/build/views/Protected.d.ts`), confirmando que `Stack.Protected` sí es un componente nativo soportado en Expo Router SDK 57 con la propiedad `guard: boolean`. Se implementó nativamente en [`app/_layout.tsx`](app/_layout.tsx) junto con un efecto guard reactivo para doble capa de protección.

---

## 4. Conclusión
El uso de asistencia de IA permitió estructurar de forma metódica y acelerada los módulos del parcial, garantizando una arquitectura desacoplada, tipado estricto con TypeScript, cumplimiento riguroso de cada directriz y la inclusión de todas las características de puntos adicionales solicitadas.
