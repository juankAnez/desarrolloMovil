// Polyfills que el AI SDK necesita en Hermes (Android/iOS).
// Se importa PRIMERO en app/_layout.tsx, antes que cualquier otra cosa.
import { Platform } from 'react-native';
import structuredClone from '@ungap/structured-clone';

// Asignación síncrona inmediata en globalThis para evitar race-conditions
if (!('structuredClone' in globalThis)) {
  (globalThis as unknown as { structuredClone: typeof structuredClone }).structuredClone = structuredClone;
}

if (Platform.OS !== 'web') {
  const setupPolyfills = async () => {
    try {
      const { polyfillGlobal } = await import('react-native/Libraries/Utilities/PolyfillFunctions');
      const { TextEncoderStream, TextDecoderStream } = await import('@stardazed/streams-text-encoding');

      polyfillGlobal('structuredClone', () => structuredClone);
      polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
      polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
    } catch (e) {
      console.warn('[polyfills] Advertencia al configurar polyfills:', e);
    }
  };

  setupPolyfills();
}

export {};
