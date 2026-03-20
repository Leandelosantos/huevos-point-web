import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { getProducts, getFeaturedProducts } from '@/services/products';
import type { Product } from '@/types';

interface UseProductsResult {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts(supabase);
      setProducts(data);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('Error desconocido');
      setError(fetchError);
      console.error('[useProducts]', fetchError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const featuredProducts = useMemo(
    () => products.filter((p) => p.is_featured),
    [products]
  );

  return { products, featuredProducts, isLoading, error, refetch: fetchProducts };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getFeaturedProducts(supabase);
        setProducts(data);
      } catch (err) {
        const fetchError = err instanceof Error ? err : new Error('Error desconocido');
        setError(fetchError);
        console.error('[useFeaturedProducts]', fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    void fetch();
  }, []);

  return { products, isLoading, error };
}
