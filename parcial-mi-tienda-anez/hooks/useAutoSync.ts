// hooks/useAutoSync.ts
import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncProducts } from '@/services/sync';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook de sincronización automática al recuperar la conexión (Punto Extra).
 * Escucha cambios en el estado de la red y, al detectar transición offline -> online,
 * dispara la sincronización en segundo plano sin interrumpir al usuario.
 */
export function useAutoSync(onSyncFinished?: (msg: string) => void) {
  const { user } = useAuth();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);

      if (!isOnline) {
        wasOffline.current = true;
      } else if (wasOffline.current) {
        // Acaba de recuperar la conexión a internet
        wasOffline.current = false;
        syncProducts(user.id).then((result) => {
          if (result.success && (result.uploaded > 0 || result.downloaded > 0)) {
            onSyncFinished?.(result.message);
          }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, onSyncFinished]);
}
