// hooks/useProducts.ts
import { useState, useMemo, useEffect } from 'react';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { productsRepository } from '@/db/repositories/products';
import { Product } from '@/db/schema';
import { db } from '@/db/client';

// Indicador de si un producto individual está pendiente de subir a Supabase
export const isProductPending = (product: Product): boolean => {
  if (!product.syncedAt) return true;
  return product.syncedAt.getTime() < product.updatedAt.getTime();
};

function calculateTotals(productsList: Product[]) {
  let units = 0;
  let value = 0;
  let pending = 0;

  for (const p of productsList) {
    units += p.quantity;
    value += p.quantity * p.price;
    if (isProductPending(p)) {
      pending++;
    }
  }

  return {
    totalUnits: units,
    totalValue: value,
    pendingCount: pending,
    totalProducts: productsList.length,
  };
}

/**
 * Hook para plataformas nativas (Android/iOS) con Drizzle useLiveQuery.
 */
function useProductsNative() {
  const query = useMemo(() => productsRepository.getActiveProductsQuery()!, []);
  const { data: productsList = [], error } = useLiveQuery(query);
  const [searchQuery, setSearchQuery] = useState('');

  const totals = useMemo(() => calculateTotals(productsList), [productsList]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return productsList;
    const q = searchQuery.trim().toLowerCase();
    return productsList.filter((p: Product) => p.name.toLowerCase().includes(q));
  }, [productsList, searchQuery]);

  return {
    products: filteredProducts,
    allProducts: productsList,
    totals,
    searchQuery,
    setSearchQuery,
    error,
    isPending: isProductPending,
    createProduct: productsRepository.create.bind(productsRepository),
    updateProduct: productsRepository.update.bind(productsRepository),
    deleteProduct: productsRepository.softDelete.bind(productsRepository),
    getById: productsRepository.getById.bind(productsRepository),
  };
}

/**
 * Hook reactivo para la Web (cuando el navegador no tiene habilitado SharedArrayBuffer).
 */
function useProductsWeb() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<any>(null);

  const loadData = () => {
    productsRepository
      .getAllActive()
      .then(setProductsList)
      .catch(setError);
  };

  useEffect(() => {
    loadData();

    if (typeof window !== 'undefined') {
      const handleWebChange = () => loadData();
      window.addEventListener('mitienda_db_changed', handleWebChange);
      return () => {
        window.removeEventListener('mitienda_db_changed', handleWebChange);
      };
    }
  }, []);

  const totals = useMemo(() => calculateTotals(productsList), [productsList]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return productsList;
    const q = searchQuery.trim().toLowerCase();
    return productsList.filter((p: Product) => p.name.toLowerCase().includes(q));
  }, [productsList, searchQuery]);

  return {
    products: filteredProducts,
    allProducts: productsList,
    totals,
    searchQuery,
    setSearchQuery,
    error,
    isPending: isProductPending,
    createProduct: productsRepository.create.bind(productsRepository),
    updateProduct: productsRepository.update.bind(productsRepository),
    deleteProduct: productsRepository.softDelete.bind(productsRepository),
    getById: productsRepository.getById.bind(productsRepository),
  };
}

export const useProducts = db ? useProductsNative : useProductsWeb;
