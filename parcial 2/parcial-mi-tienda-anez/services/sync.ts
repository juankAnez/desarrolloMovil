// services/sync.ts
import { supabase } from '@/lib/supabase';
import { productsRepository } from '@/db/repositories/products';

export interface SyncResult {
  success: boolean;
  uploaded: number;
  downloaded: number;
  deleted?: number;
  message: string;
}

/**
 * Función principal de sincronización bidireccional requerida por el docente.
 * Ejecuta exactamente los dos pasos en orden:
 * 1. Bajar: Traer productos de Supabase e insertarlos/actualizarlos en SQLite.
 *    (Incluye Regla de Conflicto "Gana el último cambio" - Punto Extra).
 * 2. Subir: Enviar pendientes con upsert por client_id y marcarlos como sincronizados.
 *    (Incluye Borrado Lógico sincronizado - Punto Extra).
 */
export async function syncProducts(userId?: string): Promise<SyncResult> {
  try {
    let currentUserId = userId;

    if (!currentUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      currentUserId = user?.id;
    }

    if (!currentUserId) {
      return {
        success: false,
        uploaded: 0,
        downloaded: 0,
        message: 'No hay una sesión activa para sincronizar',
      };
    }

    let downloadedCount = 0;
    let uploadedCount = 0;
    let deletedCount = 0;

    // -------------------------------------------------------------
    // PASO 1: BAJAR (Nube -> SQLite)
    // -------------------------------------------------------------
    const { data: remoteData, error: downloadError } = await supabase
      .from('products')
      .select('*');

    if (downloadError) {
      throw downloadError;
    }

    if (remoteData && remoteData.length > 0) {
      for (const remote of remoteData) {
        const result = await productsRepository.applyRemoteProduct({
          client_id: remote.client_id,
          name: remote.name,
          quantity: remote.quantity,
          price: remote.price,
          updated_at: remote.updated_at,
        });

        if (result === 'inserted') {
          downloadedCount++;
        }
      }
    }

    // -------------------------------------------------------------
    // PASO 2: SUBIR (SQLite -> Nube)
    // -------------------------------------------------------------
    const pendingProducts = await productsRepository.getPending();

    for (const p of pendingProducts) {
      // Caso 2.A: Borrado lógico sincronizado (Punto Extra)
      if (p.deletedAt) {
        const { error: delError } = await supabase
          .from('products')
          .delete()
          .eq('client_id', p.clientId);

        if (!delError) {
          // Ya fue borrado en la nube, se limpia de SQLite local
          await productsRepository.hardDeleteByClientId(p.clientId);
          deletedCount++;
        } else {
          console.warn('[Sync] Error borrando en Supabase:', delError.message);
        }
        continue;
      }

      // Caso 2.B: Creación o Modificación pendiente de subir
      const uploadTimestamp = p.updatedAt;
      const { error: upsertError } = await supabase.from('products').upsert(
        {
          client_id: p.clientId,
          name: p.name,
          quantity: p.quantity,
          price: p.price,
          updated_at: uploadTimestamp.toISOString(),
          // user_id toma por defecto auth.uid() en Supabase según el schema SQL
        },
        { onConflict: 'client_id' }
      );

      if (upsertError) {
        console.warn(`[Sync] Error al subir producto ${p.name}:`, upsertError.message);
        throw upsertError;
      }

      // Marcamos como sincronizado con la fecha de la versión que subió
      await productsRepository.markAsSynced(p.clientId, uploadTimestamp);
      uploadedCount++;
    }

    const message =
      deletedCount > 0
        ? `${uploadedCount} subidos, ${downloadedCount} bajados, ${deletedCount} borrados`
        : `${uploadedCount} subidos, ${downloadedCount} bajados`;

    return {
      success: true,
      uploaded: uploadedCount,
      downloaded: downloadedCount,
      deleted: deletedCount,
      message,
    };
  } catch (error: any) {
    console.error('[Sync] Error en la sincronización:', error);
    const msg =
      error?.message?.includes('Network') || error?.message?.includes('fetch')
        ? 'Error: No hay conexión a internet'
        : `Error de sincronización: ${error?.message || 'Fallo de red'}`;
    return {
      success: false,
      uploaded: 0,
      downloaded: 0,
      message: msg,
    };
  }
}
