-- ============================================================
-- Huevos Point — Initial Schema Migration
-- SRS §5.1.1 · buenas-practicas §5, §6
-- ============================================================

-- ─── PRODUCTS ─────────────────────────────────────────────────

CREATE TABLE products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  long_desc     TEXT,
  price         NUMERIC(10,2) NOT NULL CHECK (price > 0),
  unit          TEXT NOT NULL DEFAULT 'docena'
                CHECK (unit IN ('unidad', 'media_docena', 'docena', 'maple')),
  category      TEXT NOT NULL
                CHECK (category IN ('campo_libre', 'organico', 'especial', 'premium')),
  image_url     TEXT,
  image_alt     TEXT,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  is_available  BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  nutrition     JSONB,
  origin        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_products_available ON products (is_available, sort_order)
  WHERE is_available = true;

CREATE INDEX idx_products_featured ON products (is_featured, sort_order)
  WHERE is_featured = true;

CREATE INDEX idx_products_category ON products (category);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── ORDERS ───────────────────────────────────────────────────

CREATE TABLE orders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name   TEXT NOT NULL CHECK (char_length(customer_name) >= 2),
  customer_phone  TEXT NOT NULL,
  customer_email  TEXT,
  items           JSONB NOT NULL,
  notes           TEXT CHECK (notes IS NULL OR char_length(notes) <= 500),
  delivery_zone   TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  total_estimate  NUMERIC(10,2),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

-- ─── CONTACT MESSAGES ─────────────────────────────────────────

CREATE TABLE contact_messages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL CHECK (char_length(name) >= 2),
  email       TEXT NOT NULL,
  message     TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 500),
  read        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_messages_read ON contact_messages (read)
  WHERE read = false;

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
-- Products: SELECT public. No INSERT/UPDATE/DELETE public.
-- Orders: INSERT public. No SELECT public.
-- Contact messages: INSERT public. No SELECT public.
-- Admin access via service_role_key only (never in client).

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  USING (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON orders
  FOR INSERT
  WITH CHECK (true);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);
