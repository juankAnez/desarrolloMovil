// db/repositories/products.ts
import * as Crypto from 'expo-crypto';
import { eq, isNull, desc } from 'drizzle-orm';
import { db } from '../client';
import { products, Product } from '../schema';

// Clave para almacenamiento de respaldo en Web si el navegador no soporta SharedArrayBuffer
const WEB_STORAGE_KEY = 'mitienda_web_products_v1';

function emitWebChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mitienda_db_changed'));
  }
}

function getWebProducts(): Product[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WEB_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((item: any) => ({
      ...item,
      updatedAt: new Date(item.updatedAt),
      syncedAt: item.syncedAt ? new Date(item.syncedAt) : null,
      deletedAt: item.deletedAt ? new Date(item.deletedAt) : null,
    }));
  } catch {
    return [];
  }
}

function saveWebProducts(items: Product[]) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(items));
    emitWebChange();
  } catch (err) {
    console.error('Error guardando en almacenamiento web local:', err);
  }
}

/**
 * Repositorio de Productos.
 * Desacopla la lógica de base de datos de los componentes y pantallas.
 * Soporta SQLite con Drizzle ORM en plataformas nativas y persistencia web automática.
 */
export const productsRepository = {
  /**
   * Consulta reactiva para useLiveQuery en la pantalla principal (móvil y web soportada).
   */
  getActiveProductsQuery() {
    if (!db) return null;
    return db
      .select()
      .from(products)
      .where(isNull(products.deletedAt))
      .orderBy(desc(products.updatedAt));
  },

  /**
   * Obtiene todos los productos activos de forma directa (asíncrona).
   */
  async getAllActive(): Promise<Product[]> {
    if (db) {
      return await db
        .select()
        .from(products)
        .where(isNull(products.deletedAt))
        .orderBy(desc(products.updatedAt));
    }

    const items = getWebProducts();
    return items
      .filter((p) => !p.deletedAt)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  },

  /**
   * Obtiene un producto por su ID local primario.
   */
  async getById(id: number): Promise<Product | undefined> {
    if (db) {
      const results = await db
        .select()
        .from(products)
        .where(eq(products.id, id));
      return results[0];
    }

    const items = getWebProducts();
    return items.find((p) => p.id === id);
  },

  /**
   * Obtiene un producto por su clientId (UUID).
   */
  async getByClientId(clientId: string): Promise<Product | undefined> {
    if (db) {
      const results = await db
        .select()
        .from(products)
        .where(eq(products.clientId, clientId));
      return results[0];
    }

    const items = getWebProducts();
    return items.find((p) => p.clientId === clientId);
  },

  /**
   * Crea un producto en la base de datos local.
   * Genera el UUID único con Crypto.randomUUID().
   * Escribe updatedAt con fecha actual y deja syncedAt en null (pendiente de sincronizar).
   */
  async create(data: { name: string; quantity: number; price: number }): Promise<Product> {
    const now = new Date();
    const clientId = Crypto.randomUUID();

    if (db) {
      const [inserted] = await db
        .insert(products)
        .values({
          clientId,
          name: data.name.trim(),
          quantity: Math.floor(data.quantity),
          price: Math.floor(data.price),
          updatedAt: now,
          syncedAt: null,
          deletedAt: null,
        })
        .returning();
      return inserted;
    }

    // Modo Web con almacenamiento local
    const items = getWebProducts();
    const nextId = items.length > 0 ? Math.max(...items.map((p) => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: nextId,
      clientId,
      name: data.name.trim(),
      quantity: Math.floor(data.quantity),
      price: Math.floor(data.price),
      updatedAt: now,
      syncedAt: null,
      deletedAt: null,
    };
    items.push(newProduct);
    saveWebProducts(items);
    return newProduct;
  },

  /**
   * Modifica un producto existente.
   * Actualiza updatedAt y resetea syncedAt a null para marcarlo como pendiente de sincronizar.
   */
  async update(id: number, data: { name: string; quantity: number; price: number }): Promise<Product | undefined> {
    const now = new Date();

    if (db) {
      const [updated] = await db
        .update(products)
        .set({
          name: data.name.trim(),
          quantity: Math.floor(data.quantity),
          price: Math.floor(data.price),
          updatedAt: now,
          syncedAt: null,
        })
        .where(eq(products.id, id))
        .returning();
      return updated;
    }

    // Modo Web
    const items = getWebProducts();
    const index = items.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    items[index] = {
      ...items[index],
      name: data.name.trim(),
      quantity: Math.floor(data.quantity),
      price: Math.floor(data.price),
      updatedAt: now,
      syncedAt: null,
    };
    saveWebProducts(items);
    return items[index];
  },

  /**
   * Eliminación con borrado lógico (Punto Extra).
   * Marca deletedAt con la fecha actual, actualiza updatedAt y setea syncedAt a null
   * para sincronizar el borrado con Supabase.
   */
  async softDelete(id: number): Promise<void> {
    const now = new Date();

    if (db) {
      await db
        .update(products)
        .set({
          deletedAt: now,
          updatedAt: now,
          syncedAt: null,
        })
        .where(eq(products.id, id));
      return;
    }

    // Modo Web
    const items = getWebProducts();
    const index = items.findIndex((p) => p.id === id);
    if (index !== -1) {
      items[index] = {
        ...items[index],
        deletedAt: now,
        updatedAt: now,
        syncedAt: null,
      };
      saveWebProducts(items);
    }
  },

  /**
   * Obtiene los productos locales pendientes de subir a la nube.
   * Regla del parcial: un producto está pendiente si syncedAt es null o es menor que updatedAt.
   */
  async getPending(): Promise<Product[]> {
    if (db) {
      const all: Product[] = await db.select().from(products);
      return all.filter((p: Product) => {
        if (!p.syncedAt) return true;
        return p.syncedAt.getTime() < p.updatedAt.getTime();
      });
    }

    const items = getWebProducts();
    return items.filter((p) => {
      if (!p.syncedAt) return true;
      return p.syncedAt.getTime() < p.updatedAt.getTime();
    });
  },

  /**
   * Marca un producto como sincronizado actualizando su syncedAt.
   */
  async markAsSynced(clientId: string, syncedAt: Date): Promise<void> {
    if (db) {
      await db
        .update(products)
        .set({
          syncedAt,
        })
        .where(eq(products.clientId, clientId));
      return;
    }

    const items = getWebProducts();
    const index = items.findIndex((p) => p.clientId === clientId);
    if (index !== -1) {
      items[index].syncedAt = syncedAt;
      saveWebProducts(items);
    }
  },

  /**
   * Elimina permanentemente de SQLite una fila ya sincronizada como borrada.
   */
  async hardDeleteByClientId(clientId: string): Promise<void> {
    if (db) {
      await db.delete(products).where(eq(products.clientId, clientId));
      return;
    }

    const items = getWebProducts().filter((p) => p.clientId !== clientId);
    saveWebProducts(items);
  },

  /**
   * Aplica un producto recibido desde Supabase.
   * Si no existe localmente, se inserta.
   * Si existe, aplica regla "gana el último cambio" (last-write-wins) comparando marcas de tiempo (Punto Extra).
   */
  async applyRemoteProduct(remote: {
    client_id: string;
    name: string;
    quantity: number;
    price: number;
    updated_at: string;
  }): Promise<'inserted' | 'updated' | 'kept_local'> {
    const local = await this.getByClientId(remote.client_id);
    const remoteUpdatedAt = new Date(remote.updated_at);

    if (!local) {
      // No existe localmente: se inserta
      if (db) {
        await db.insert(products).values({
          clientId: remote.client_id,
          name: remote.name,
          quantity: remote.quantity,
          price: remote.price,
          updatedAt: remoteUpdatedAt,
          syncedAt: remoteUpdatedAt,
          deletedAt: null,
        });
      } else {
        const items = getWebProducts();
        const nextId = items.length > 0 ? Math.max(...items.map((p) => p.id)) + 1 : 1;
        items.push({
          id: nextId,
          clientId: remote.client_id,
          name: remote.name,
          quantity: remote.quantity,
          price: remote.price,
          updatedAt: remoteUpdatedAt,
          syncedAt: remoteUpdatedAt,
          deletedAt: null,
        });
        saveWebProducts(items);
      }
      return 'inserted';
    }

    // Ya existe: regla "gana el último cambio"
    if (remoteUpdatedAt.getTime() > local.updatedAt.getTime()) {
      if (db) {
        await db
          .update(products)
          .set({
            name: remote.name,
            quantity: remote.quantity,
            price: remote.price,
            updatedAt: remoteUpdatedAt,
            syncedAt: remoteUpdatedAt,
            deletedAt: null,
          })
          .where(eq(products.clientId, remote.client_id));
      } else {
        const items = getWebProducts();
        const index = items.findIndex((p) => p.clientId === remote.client_id);
        if (index !== -1) {
          items[index] = {
            ...items[index],
            name: remote.name,
            quantity: remote.quantity,
            price: remote.price,
            updatedAt: remoteUpdatedAt,
            syncedAt: remoteUpdatedAt,
            deletedAt: null,
          };
          saveWebProducts(items);
        }
      }
      return 'updated';
    }

    return 'kept_local';
  },
};
