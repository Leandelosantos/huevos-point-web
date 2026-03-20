import type { SupabaseClient } from '@supabase/supabase-js';
import { ProductFetchError } from '@/lib/errors';
import type { Product } from '@/types';

export async function getProducts(client: SupabaseClient): Promise<Product[]> {
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new ProductFetchError('Error al obtener productos', error);
  }

  return data as Product[];
}

export async function getFeaturedProducts(client: SupabaseClient): Promise<Product[]> {
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_available', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new ProductFetchError('Error al obtener productos destacados', error);
  }

  return data as Product[];
}

export async function getProductBySlug(
  client: SupabaseClient,
  slug: string
): Promise<Product | null> {
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new ProductFetchError(`Error al obtener producto: ${slug}`, error);
  }

  return data as Product;
}
