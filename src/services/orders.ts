import type { SupabaseClient } from '@supabase/supabase-js';
import { OrderSubmitError } from '@/lib/errors';
import type { OrderPayload, Order } from '@/types';

export async function submitOrder(
  client: SupabaseClient,
  payload: OrderPayload
): Promise<Order> {
  const { data, error } = await client
    .from('orders')
    .insert({
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      customer_email: payload.customer_email || null,
      items: payload.items,
      notes: payload.notes || null,
      delivery_zone: payload.delivery_zone || null,
      total_estimate: payload.total_estimate,
    })
    .select()
    .single();

  if (error) {
    throw new OrderSubmitError('Error al enviar el pedido', error);
  }

  return data as Order;
}
