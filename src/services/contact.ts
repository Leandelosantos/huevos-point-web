import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContactFormValues } from '@/types';

export class ContactSubmitError extends Error {
  readonly originalError?: unknown;
  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'ContactSubmitError';
    this.originalError = originalError;
  }
}

export async function submitContactMessage(
  client: SupabaseClient,
  payload: ContactFormValues
): Promise<void> {
  const { error } = await client.from('contact_messages').insert({
    name: payload.name,
    email: payload.email,
    message: payload.message,
  });

  if (error) {
    throw new ContactSubmitError('Error al enviar el mensaje', error);
  }
}
