-- ============================================================
-- MM Legacy — TCG Pokemon Shop Schema
-- Migrácia: 20260312_shop_schema.sql
-- ============================================================

-- ─── Kategórie ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS shop_categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL,
  icon        text,
  sort_order  int         DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- ─── Produkty ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS shop_products (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text        UNIQUE NOT NULL,
  name            text        NOT NULL,
  description     text,
  category_slug   text        REFERENCES shop_categories(slug) ON UPDATE CASCADE ON DELETE SET NULL,
  price_cents     int         NOT NULL CHECK (price_cents > 0),
  stock_quantity  int         DEFAULT 0 CHECK (stock_quantity >= 0),
  images          jsonb       DEFAULT '[]'::jsonb,
  metadata        jsonb       DEFAULT '{}'::jsonb,
  is_active       boolean     DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shop_products_updated_at ON shop_products;
CREATE TRIGGER shop_products_updated_at
  BEFORE UPDATE ON shop_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Košík ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS shop_cart_items (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  uuid        REFERENCES shop_products(id) ON DELETE CASCADE,
  quantity    int         DEFAULT 1 CHECK (quantity > 0),
  created_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- ─── Objednávky ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS shop_orders (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  status            text        DEFAULT 'pending'
                                CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  total_cents       int         NOT NULL CHECK (total_cents > 0),
  shipping_address  jsonb       NOT NULL,
  notes             text,
  created_at        timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shop_order_items (
  id           uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     uuid  NOT NULL REFERENCES shop_orders(id) ON DELETE CASCADE,
  product_id   uuid  REFERENCES shop_products(id) ON DELETE SET NULL,
  quantity     int   NOT NULL CHECK (quantity > 0),
  price_cents  int   NOT NULL CHECK (price_cents > 0)
);

-- ─── Seed kategórie ──────────────────────────────────────────────────────────

INSERT INTO shop_categories (slug, name, icon, sort_order) VALUES
  ('booster-box', 'Booster Boxy', 'box',    1),
  ('balicky',     'Balicky',      'cards',  2),
  ('psa-graded',  'PSA Graded',   'trophy', 3),
  ('singles',     'Singles',      'star',   4),
  ('accessories', 'Accessories',  'shield', 5)
ON CONFLICT (slug) DO NOTHING;

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_shop_products_category_slug ON shop_products(category_slug);
CREATE INDEX IF NOT EXISTS idx_shop_products_is_active     ON shop_products(is_active);
CREATE INDEX IF NOT EXISTS idx_shop_products_created_at    ON shop_products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shop_cart_items_user_id     ON shop_cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_user_id         ON shop_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_order_items_order_id   ON shop_order_items(order_id);

-- ─── RLS (Row Level Security) ─────────────────────────────────────────────────

-- Kategórie — verejne čitateľné
ALTER TABLE shop_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories public read" ON shop_categories;
CREATE POLICY "Categories public read"
  ON shop_categories FOR SELECT
  USING (true);

-- Produkty — aktívne sú verejne čitateľné, zápis len pre admin
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products public read" ON shop_products;
CREATE POLICY "Products public read"
  ON shop_products FOR SELECT
  USING (is_active = true);

-- Košík — každý user vidí iba svoje položky
ALTER TABLE shop_cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cart owner all"   ON shop_cart_items;
CREATE POLICY "Cart owner all"
  ON shop_cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Objednávky — user vidí iba svoje, vie vytvárať
ALTER TABLE shop_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Orders owner read"   ON shop_orders;
DROP POLICY IF EXISTS "Orders owner insert" ON shop_orders;
CREATE POLICY "Orders owner read"
  ON shop_orders FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Orders owner insert"
  ON shop_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Order items — viditeľné cez join na orders
ALTER TABLE shop_order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Order items via order" ON shop_order_items;
CREATE POLICY "Order items via order"
  ON shop_order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shop_orders o
      WHERE o.id = order_id
        AND (o.user_id = auth.uid() OR o.user_id IS NULL)
    )
  );
CREATE POLICY "Order items insert"
  ON shop_order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shop_orders o
      WHERE o.id = order_id
        AND (o.user_id = auth.uid() OR o.user_id IS NULL)
    )
  );
