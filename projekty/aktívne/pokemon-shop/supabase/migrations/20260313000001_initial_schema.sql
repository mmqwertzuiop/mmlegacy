-- ============================================================
-- Pokemon TCG E-shop — Initial Schema
-- Migration: 20260313000001_initial_schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     TEXT UNIQUE,
  avatar_url   TEXT,
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- MYSTERY BOX TIERS
-- ============================================================
CREATE TABLE IF NOT EXISTS mystery_box_tiers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL UNIQUE,  -- Bronze, Silver, Gold, Platinum, Diamond
  price           INTEGER NOT NULL,      -- v centoch
  description     TEXT,
  min_value       INTEGER NOT NULL,      -- garantovaná min hodnota v centoch
  max_value       INTEGER NOT NULL,      -- max možná hodnota v centoch
  possible_cards  JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL CHECK (category IN ('booster-box', 'psa-graded', 'singles', 'collection-box', 'mystery-box')),
  price           INTEGER NOT NULL CHECK (price > 0),  -- v centoch
  stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rarity          TEXT,                 -- napr. 'Hyper Rare', 'Alt Art', 'Special Illustration Rare'
  img_url         TEXT,
  set_name        TEXT,                 -- napr. 'Obsidian Flames', 'Evolving Skies'
  psa_grade       SMALLINT CHECK (psa_grade BETWEEN 1 AND 10),  -- len pre psa-graded
  is_mystery_box  BOOLEAN NOT NULL DEFAULT FALSE,
  mystery_tier    UUID REFERENCES mystery_box_tiers(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_stock ON products(stock);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items       JSONB NOT NULL DEFAULT '[]'::jsonb,  -- snapshot produktov v čase objednávky
  total       INTEGER NOT NULL CHECK (total >= 0), -- v centoch
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  price       INTEGER NOT NULL CHECK (price > 0)  -- cena v čase nákupu, v centoch
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- ============================================================
-- LOYALTY LEVELS
-- ============================================================
CREATE TABLE IF NOT EXISTS loyalty_levels (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL UNIQUE,  -- Bronze, Silver, Gold, Platinum, Diamond
  min_points       INTEGER NOT NULL,
  max_points       INTEGER,               -- NULL = neobmedzené (najvyšší level)
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (discount_percent BETWEEN 0 AND 100),
  perks            JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ============================================================
-- LOYALTY POINTS
-- ============================================================
CREATE TABLE IF NOT EXISTS loyalty_points (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  points        INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  level         UUID REFERENCES loyalty_levels(id),
  total_earned  INTEGER NOT NULL DEFAULT 0 CHECK (total_earned >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX idx_loyalty_points_points ON loyalty_points(points DESC);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loyalty points"
  ON loyalty_points FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view all for leaderboard"
  ON loyalty_points FOR SELECT USING (true);

-- ============================================================
-- LEADERBOARD (View)
-- ============================================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  lp.user_id,
  p.username,
  p.avatar_url,
  lp.points,
  lp.total_earned,
  ll.name AS level_name,
  RANK() OVER (ORDER BY lp.points DESC) AS rank
FROM loyalty_points lp
LEFT JOIN profiles p ON p.id = lp.user_id
LEFT JOIN loyalty_levels ll ON ll.id = lp.level
ORDER BY lp.points DESC;

-- ============================================================
-- FUNCTION: Award loyalty points after paid order
-- ============================================================
CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
  earned_points INTEGER;
  new_total INTEGER;
  new_level UUID;
BEGIN
  -- 1 bod za každé celé euro (100 centov)
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    earned_points := NEW.total / 100;

    INSERT INTO loyalty_points (user_id, points, total_earned)
    VALUES (NEW.user_id, earned_points, earned_points)
    ON CONFLICT (user_id) DO UPDATE
      SET points = loyalty_points.points + earned_points,
          total_earned = loyalty_points.total_earned + earned_points;

    -- Aktualizuj level
    SELECT lp.points + earned_points INTO new_total
    FROM loyalty_points lp WHERE lp.user_id = NEW.user_id;

    SELECT id INTO new_level
    FROM loyalty_levels
    WHERE min_points <= COALESCE(new_total, earned_points)
      AND (max_points IS NULL OR max_points >= COALESCE(new_total, earned_points))
    ORDER BY min_points DESC
    LIMIT 1;

    UPDATE loyalty_points
    SET level = new_level
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_paid ON orders;
CREATE TRIGGER on_order_paid
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION award_loyalty_points();

-- ============================================================
-- FUNCTION: Decrease stock after order
-- ============================================================
CREATE OR REPLACE FUNCTION decrease_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    UPDATE products p
    SET stock = p.stock - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
      AND oi.product_id = p.id
      AND p.stock >= oi.quantity;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_paid_decrease_stock ON orders;
CREATE TRIGGER on_order_paid_decrease_stock
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION decrease_stock_on_order();
