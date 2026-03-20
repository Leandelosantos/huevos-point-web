import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { submitOrder } from '@/services/orders';
import type { OrderPayload, Order } from '@/types';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface UseOrderSubmitResult {
  status: SubmitStatus;
  order: Order | null;
  error: Error | null;
  submit: (payload: OrderPayload) => Promise<void>;
  reset: () => void;
}

export function useOrderSubmit(): UseOrderSubmitResult {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(async (payload: OrderPayload) => {
    setStatus('submitting');
    setError(null);

    try {
      const result = await submitOrder(supabase, payload);
      setOrder(result);
      setStatus('success');
    } catch (err) {
      const submitError = err instanceof Error ? err : new Error('Error desconocido');
      setError(submitError);
      setStatus('error');
      console.error('[useOrderSubmit]', submitError);
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setOrder(null);
    setError(null);
  }, []);

  return { status, order, error, submit, reset };
}
