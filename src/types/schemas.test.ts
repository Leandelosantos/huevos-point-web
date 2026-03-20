import { describe, it, expect } from 'vitest';
import { orderSchema, contactSchema, orderItemSchema } from './index';

describe('orderItemSchema', () => {
  const validItem = {
    product_id: '550e8400-e29b-41d4-a716-446655440000',
    product_name: 'Huevos de Campo Libre',
    quantity: 2,
    unit: 'docena' as const,
    unit_price: 4500,
  };

  it('accepts a valid order item', () => {
    const result = orderItemSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  it('rejects quantity below 1', () => {
    const result = orderItemSchema.safeParse({ ...validItem, quantity: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects quantity above 50', () => {
    const result = orderItemSchema.safeParse({ ...validItem, quantity: 51 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid unit', () => {
    const result = orderItemSchema.safeParse({ ...validItem, unit: 'caja' });
    expect(result.success).toBe(false);
  });

  it('rejects non-UUID product_id', () => {
    const result = orderItemSchema.safeParse({ ...validItem, product_id: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('rejects negative unit_price', () => {
    const result = orderItemSchema.safeParse({ ...validItem, unit_price: -100 });
    expect(result.success).toBe(false);
  });
});

describe('orderSchema', () => {
  const validOrder = {
    customer_name: 'Juan Pérez',
    customer_phone: '+54 9 11 1234-5678',
    customer_email: '',
    items: [
      {
        product_id: '550e8400-e29b-41d4-a716-446655440000',
        product_name: 'Huevos de Campo',
        quantity: 1,
        unit: 'docena' as const,
        unit_price: 4500,
      },
    ],
    notes: '',
    delivery_zone: 'CABA',
    total_estimate: 4500,
  };

  it('accepts a valid order', () => {
    const result = orderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 chars', () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_name: 'J' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid phone number', () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_phone: '12345' });
    expect(result.success).toBe(false);
  });

  it('accepts valid AR phone formats', () => {
    const phones = ['+54 9 11 1234-5678', '+5491112345678', '54 9 11 12345678'];
    for (const phone of phones) {
      const result = orderSchema.safeParse({ ...validOrder, customer_phone: phone });
      expect(result.success).toBe(true);
    }
  });

  it('rejects empty items array', () => {
    const result = orderSchema.safeParse({ ...validOrder, items: [] });
    expect(result.success).toBe(false);
  });

  it('rejects notes longer than 500 characters', () => {
    const result = orderSchema.safeParse({ ...validOrder, notes: 'a'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('accepts notes up to 500 characters', () => {
    const result = orderSchema.safeParse({ ...validOrder, notes: 'a'.repeat(500) });
    expect(result.success).toBe(true);
  });

  it('accepts empty email', () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_email: '' });
    expect(result.success).toBe(true);
  });

  it('accepts valid email', () => {
    const result = orderSchema.safeParse({ ...validOrder, customer_email: 'test@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects negative total_estimate', () => {
    const result = orderSchema.safeParse({ ...validOrder, total_estimate: -1 });
    expect(result.success).toBe(false);
  });
});

describe('contactSchema', () => {
  const validContact = {
    name: 'María García',
    email: 'maria@example.com',
    message: 'Hola, quiero información sobre los huevos orgánicos.',
  };

  it('accepts a valid contact message', () => {
    const result = contactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });

  it('rejects name shorter than 2 chars', () => {
    const result = contactSchema.safeParse({ ...validContact, name: 'M' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...validContact, email: 'not-email' });
    expect(result.success).toBe(false);
  });

  it('rejects message shorter than 10 chars', () => {
    const result = contactSchema.safeParse({ ...validContact, message: 'Hola' });
    expect(result.success).toBe(false);
  });

  it('rejects message longer than 500 chars', () => {
    const result = contactSchema.safeParse({ ...validContact, message: 'x'.repeat(501) });
    expect(result.success).toBe(false);
  });
});
