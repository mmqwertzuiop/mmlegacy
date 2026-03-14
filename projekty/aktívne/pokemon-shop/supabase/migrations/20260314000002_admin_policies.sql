-- ============================================================
-- Admin RLS policies
-- Umožňuje admin panelu čítať všetky dáta cez anon key
-- (Ochrana je riešená na úrovni Next.js middleware + heslo)
-- ============================================================

-- Buyback: otvor SELECT pre všetkých (anon + authenticated)
DROP POLICY IF EXISTS "Authenticated can read buyback submissions" ON buyback_submissions;
DROP POLICY IF EXISTS "Authenticated can update buyback submissions" ON buyback_submissions;
DROP POLICY IF EXISTS "Authenticated can read buyback items" ON buyback_items;
DROP POLICY IF EXISTS "Authenticated can update buyback items" ON buyback_items;

CREATE POLICY "Anyone can read buyback submissions"
  ON buyback_submissions FOR SELECT USING (true);

CREATE POLICY "Anyone can update buyback submissions"
  ON buyback_submissions FOR UPDATE USING (true);

CREATE POLICY "Anyone can read buyback items"
  ON buyback_items FOR SELECT USING (true);

CREATE POLICY "Anyone can update buyback items"
  ON buyback_items FOR UPDATE USING (true);

-- Orders: admin môže čítať všetky objednávky
CREATE POLICY "Admin can read all orders"
  ON orders FOR SELECT USING (true);

-- Profiles: admin môže čítať všetky profily
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT USING (true);
