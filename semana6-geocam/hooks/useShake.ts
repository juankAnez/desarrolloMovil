// hooks/useShake.ts
import { useEffect, useRef, useState } from 'react';
import { Accelerometer } from 'expo-sensors';

interface ShakeOptions {
  threshold?: number;
  cooldownMs?: number;
}

export function useShake(
  onShake: () => void,
  options?: ShakeOptions
): { isAvailable: boolean | null } {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Mantener la referencia más reciente del callback para no recrear la suscripción
  const onShakeRef = useRef(onShake);
  useEffect(() => {
    onShakeRef.current = onShake;
  }, [onShake]);

  const threshold = options?.threshold ?? 2.0;
  const cooldownMs = options?.cooldownMs ?? 1500;
  const lastShakeTimeRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    let subscription: { remove: () => void } | null = null;

    // 1. Verificar disponibilidad antes de suscribirse
    Accelerometer.isAvailableAsync()
      .then((available) => {
        if (cancelled) return;
        setIsAvailable(available);

        if (!available) return;

        // 2. Fijar intervalo de actualización a 100ms
        Accelerometer.setUpdateInterval(100);

        // 3. Suscribirse y calcular magnitud del vector
        subscription = Accelerometer.addListener(({ x, y, z }) => {
          // Magnitud del vector: sqrt(x^2 + y^2 + z^2). En reposo es aprox 1.0 g
          const magnitude = Math.sqrt(x * x + y * y + z * z);

          if (magnitude >= threshold) {
            const now = Date.now();
            // 4. Tiempo de enfriamiento (cooldown)
            if (now - lastShakeTimeRef.current >= cooldownMs) {
              lastShakeTimeRef.current = now;
              onShakeRef.current?.();
            }
          }
        });
      })
      .catch(() => {
        if (!cancelled) setIsAvailable(false);
      });

    // 5. Limpieza segura con bandera cancelled
    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [threshold, cooldownMs]);

  return { isAvailable };
}
