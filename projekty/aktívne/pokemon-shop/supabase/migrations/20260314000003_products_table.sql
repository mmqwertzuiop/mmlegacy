-- Products table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id           TEXT PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  description  TEXT,
  category     TEXT NOT NULL CHECK (category IN ('booster-box','psa-graded','singles','collection-box','mystery-box')),
  price        INTEGER NOT NULL DEFAULT 0,
  stock        INTEGER NOT NULL DEFAULT 0,
  rarity       TEXT,
  img_url      TEXT NOT NULL DEFAULT '',
  set_name     TEXT,
  psa_grade    SMALLINT,
  is_mystery_box BOOLEAN DEFAULT FALSE,
  mystery_tier TEXT,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT USING (active = true OR auth.role() = 'authenticated');

CREATE POLICY "Anyone can manage products via admin"
  ON products FOR ALL USING (true);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload product images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can read product images"
  ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can update product images"
  ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can delete product images"
  ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_product_update ON products;
CREATE TRIGGER on_product_update
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_timestamp();
