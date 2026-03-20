-- ============================================================
-- Database Webhook: Trigger notify-order Edge Function on INSERT
-- SRS §5.2.2 · buenas-practicas §5
-- ============================================================
-- This webhook fires whenever a new order is inserted.
-- It calls the `notify-order` Edge Function which sends a
-- WhatsApp notification to the store owner.
--
-- NOTE: On Supabase hosted platform, webhooks are configured
-- via the Dashboard (Database → Webhooks) or the Management API.
-- This migration uses pg_net (available on Supabase) to call
-- the Edge Function directly via a PostgreSQL trigger.
-- ============================================================

-- Enable pg_net extension for HTTP requests from PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function that sends the webhook payload to the Edge Function
CREATE OR REPLACE FUNCTION notify_order_webhook()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT;
  service_role_key  TEXT;
  payload           JSONB;
BEGIN
  -- These are set via Supabase Vault or as database secrets
  -- In local dev, the function will log but not fail if not configured
  edge_function_url := current_setting('app.settings.edge_function_url', true);
  service_role_key  := current_setting('app.settings.service_role_key', true);

  -- If not configured, skip silently
  IF edge_function_url IS NULL OR service_role_key IS NULL THEN
    RAISE LOG '[notify-order] Edge Function URL or service role key not configured. Skipping webhook.';
    RETURN NEW;
  END IF;

  -- Build the webhook payload matching Supabase webhook format
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', to_jsonb(NEW),
    'old_record', NULL
  );

  -- Fire-and-forget HTTP POST to the Edge Function
  PERFORM extensions.http_post(
    url     := edge_function_url || '/functions/v1/notify-order',
    body    := payload::TEXT,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    )::TEXT
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never block order insertion due to notification failure
    RAISE LOG '[notify-order] Webhook failed: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on orders INSERT
CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_webhook();

-- ============================================================
-- ALTERNATIVE: Supabase Dashboard Configuration
-- ============================================================
-- If using Supabase Dashboard webhooks instead of pg_net:
--   1. Go to Database → Webhooks → Create webhook
--   2. Name: notify-order
--   3. Table: orders
--   4. Events: INSERT
--   5. Type: Supabase Edge Function
--   6. Function: notify-order
--   7. HTTP Headers: Authorization: Bearer <service_role_key>
--
-- In that case, you can remove this migration entirely and
-- rely on the Dashboard configuration.
-- ============================================================
