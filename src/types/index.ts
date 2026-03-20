import { z } from 'zod/v4';

// ─── Product ───

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_desc: string | null;
  price: number;
  unit: ProductUnit;
  category: ProductCategory;
  image_url: string | null;
  image_alt: string | null;
  is_featured: boolean;
  is_available: boolean;
  sort_order: number;
  nutrition: Record<string, string> | null;
  origin: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductUnit = 'unidad' | 'media_docena' | 'docena' | 'maple';
export type ProductCategory = 'campo_libre' | 'organico' | 'especial' | 'premium';

export interface ProductCardProps {
  product: Product;
  variant: 'featured' | 'standard' | 'compact';
  onAddToOrder: (product: Product) => void;
}

// ─── Order ───

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit: ProductUnit;
  unit_price: number;
}

export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  notes?: string;
  delivery_zone?: string;
  total_estimate: number;
}

export interface Order extends OrderPayload {
  id: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
}

// ─── Contact ───

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

// ─── Zod Schemas ───

export const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
  unit: z.enum(['unidad', 'media_docena', 'docena', 'maple']),
  unit_price: z.number().positive(),
});

export const orderSchema = z.object({
  customer_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  customer_phone: z
    .string()
    .regex(
      /^\+?54\s?9?\s?\d{2,4}\s?\d{4}[\s-]?\d{4}$/,
      'Ingresá un número de teléfono argentino válido'
    ),
  customer_email: z.email('Ingresá un email válido').optional().or(z.literal('')),
  items: z.array(orderItemSchema).min(1, 'Agregá al menos un producto'),
  notes: z.string().max(500, 'Las notas no pueden superar los 500 caracteres').optional(),
  delivery_zone: z.string().optional(),
  total_estimate: z.number().nonnegative(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.email('Ingresá un email válido'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no puede superar los 500 caracteres'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
