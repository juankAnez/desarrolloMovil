// db/schema.ts
// IMPORTANTE (Regla del docente): No importar paquetes de Expo en este archivo
// drizzle-kit lee este archivo con Node y fallaría con Unexpected "typeof".
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clientId: text('client_id').notNull().unique(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  syncedAt: integer('synced_at', { mode: 'timestamp_ms' }),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
