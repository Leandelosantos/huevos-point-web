// Supabase Edge Function: notify-order
// Triggered via DB webhook on orders INSERT → sends WhatsApp notification
// SRS §5.2.2 · buenas-practicas §5

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface OrderItem {
  product_id: string;
  quantity: number;
  unit: string;
}

interface OrderPayload {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  notes?: string;
  delivery_zone?: string;
  total_estimate?: number;
  created_at: string;
}

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  schema: string;
  record: OrderPayload;
  old_record: null;
}

const UNIT_LABELS: Record<string, string> = {
  unidad: 'unidad(es)',
  media_docena: 'media docena(s)',
  docena: 'docena(s)',
  maple: 'maple(s)',
};

function formatOrderItems(items: OrderItem[]): string {
  return items
    .map((item) => `• ${item.quantity} ${UNIT_LABELS[item.unit] ?? item.unit}`)
    .join('\n');
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount);
}

Deno.serve(async (req: Request) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const webhook: WebhookPayload = await req.json();
    const order = webhook.record;

    if (!order?.id) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Resolve product names from DB
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    let itemsText = formatOrderItems(order.items);

    if (supabaseUrl && serviceRoleKey) {
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      const productIds = order.items.map((i) => i.product_id);

      const { data: products } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds);

      if (products && products.length > 0) {
        const nameMap = new Map(products.map((p: { id: string; name: string }) => [p.id, p.name]));
        itemsText = order.items
          .map((item) => {
            const name = nameMap.get(item.product_id) ?? 'Producto';
            return `• ${item.quantity} ${UNIT_LABELS[item.unit] ?? item.unit} — ${name}`;
          })
          .join('\n');
      }
    }

    // Build notification message
    const total = order.total_estimate ? `\n💰 *Estimado:* ${formatPrice(order.total_estimate)}` : '';
    const zone = order.delivery_zone ? `\n📍 *Zona:* ${order.delivery_zone}` : '';
    const notes = order.notes ? `\n📝 *Notas:* ${order.notes}` : '';
    const email = order.customer_email ? `\n📧 *Email:* ${order.customer_email}` : '';

    const message = [
      `🥚 *Nuevo pedido — Huevos Point*`,
      ``,
      `👤 *Cliente:* ${order.customer_name}`,
      `📱 *Teléfono:* ${order.customer_phone}`,
      email,
      zone,
      ``,
      `📦 *Productos:*`,
      itemsText,
      total,
      notes,
      ``,
      `🆔 ${order.id}`,
      `📅 ${new Date(order.created_at).toLocaleString('es-AR', { timeZone: 'America/Buenos_Aires' })}`,
    ]
      .filter(Boolean)
      .join('\n');

    // Send WhatsApp notification via WhatsApp Business Cloud API
    const waToken = Deno.env.get('WHATSAPP_BUSINESS_API_TOKEN');
    const waPhoneId = Deno.env.get('WHATSAPP_BUSINESS_PHONE_ID');
    const ownerPhone = Deno.env.get('WHATSAPP_OWNER_PHONE');

    if (waToken && waPhoneId && ownerPhone) {
      const waResponse = await fetch(
        `https://graph.facebook.com/v21.0/${waPhoneId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${waToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: ownerPhone,
            type: 'text',
            text: { body: message },
          }),
        },
      );

      if (!waResponse.ok) {
        const errorBody = await waResponse.text();
        console.error('[notify-order] WhatsApp API error:', waResponse.status, errorBody);
        return new Response(
          JSON.stringify({ error: 'WhatsApp notification failed', status: waResponse.status }),
          { status: 502, headers: { 'Content-Type': 'application/json' } },
        );
      }

      console.log('[notify-order] WhatsApp notification sent for order:', order.id);
    } else {
      // Fallback: log the notification when WhatsApp is not configured
      console.log('[notify-order] WhatsApp not configured. Order notification:');
      console.log(message);
    }

    return new Response(JSON.stringify({ success: true, order_id: order.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[notify-order] Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
