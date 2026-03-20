import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrderSubmit } from './useOrderSubmit';
import type { OrderPayload } from '@/types';

// Mock the supabase module
vi.mock('@/lib/supabase', () => ({
  supabase: {},
}));

// Mock the orders service
const mockSubmitOrder = vi.fn();
vi.mock('@/services/orders', () => ({
  submitOrder: (...args: unknown[]) => mockSubmitOrder(...args),
}));

const validPayload: OrderPayload = {
  customer_name: 'Juan Pérez',
  customer_phone: '+54 9 11 1234-5678',
  items: [
    {
      product_id: '550e8400-e29b-41d4-a716-446655440000',
      product_name: 'Huevos de Campo',
      quantity: 1,
      unit: 'docena',
      unit_price: 4500,
    },
  ],
  total_estimate: 4500,
};

describe('useOrderSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useOrderSubmit());

    expect(result.current.status).toBe('idle');
    expect(result.current.order).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('transitions to success on successful submit', async () => {
    const mockOrder = { ...validPayload, id: 'order-123', status: 'pending', created_at: new Date().toISOString() };
    mockSubmitOrder.mockResolvedValueOnce(mockOrder);

    const { result } = renderHook(() => useOrderSubmit());

    await act(async () => {
      await result.current.submit(validPayload);
    });

    expect(result.current.status).toBe('success');
    expect(result.current.order).toEqual(mockOrder);
    expect(result.current.error).toBeNull();
  });

  it('transitions to error on failed submit', async () => {
    mockSubmitOrder.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useOrderSubmit());

    await act(async () => {
      await result.current.submit(validPayload);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.order).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });

  it('resets to idle state', async () => {
    const mockOrder = { ...validPayload, id: 'order-123', status: 'pending', created_at: new Date().toISOString() };
    mockSubmitOrder.mockResolvedValueOnce(mockOrder);

    const { result } = renderHook(() => useOrderSubmit());

    await act(async () => {
      await result.current.submit(validPayload);
    });

    expect(result.current.status).toBe('success');

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.order).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('calls submitOrder service with payload', async () => {
    mockSubmitOrder.mockResolvedValueOnce({});

    const { result } = renderHook(() => useOrderSubmit());

    await act(async () => {
      await result.current.submit(validPayload);
    });

    expect(mockSubmitOrder).toHaveBeenCalledTimes(1);
    expect(mockSubmitOrder).toHaveBeenCalledWith(expect.anything(), validPayload);
  });
});
