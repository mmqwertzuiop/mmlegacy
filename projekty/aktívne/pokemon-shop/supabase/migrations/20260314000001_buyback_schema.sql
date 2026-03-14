-- ============================================================
-- Buyback System — výkup kariet
-- Migration: 20260314000001_buyback_schema
-- ============================================================

-- ============================================================
-- BUYBACK SUBMISSIONS (hlavička žiadosti)
-- ============================================================
CREATE TABLE IF NOT EXISTS buyback_submissions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  total_items   INTEGER NOT NULL DEFAULT 1,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','reviewing','offer_sent','accepted','rejected','completed')),
  offered_total NUMERIC(10,2),
  admin_notes   TEXT
);

ALTER TABLE buyback_submissions ENABLE ROW LEVEL SECURITY;

-- Ktokoľvek môže vložiť žiadosť (anon)
CREATE POLICY "Anyone can submit buyback"
  ON buyback_submissions FOR INSERT WITH CHECK (true);

-- Iba autentifikovaný admin číta/mení
CREATE POLICY "Authenticated can read buyback submissions"
  ON buyback_submissions FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update buyback submissions"
  ON buyback_submissions FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- BUYBACK ITEMS (jednotlivé karty v žiadosti)
-- ============================================================
CREATE TABLE IF NOT EXISTS buyback_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id   UUID NOT NULL REFERENCES buyback_submissions(id) ON DELETE CASCADE,
  card_name       TEXT NOT NULL,
  card_set        TEXT NOT NULL,
  card_condition  TEXT NOT NULL,
  is_graded       BOOLEAN NOT NULL DEFAULT FALSE,
  psa_grade       SMALLINT CHECK (psa_grade BETWEEN 1 AND 10),
  quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  card_language   TEXT NOT NULL DEFAULT 'EN',
  expected_price  NUMERIC(10,2),
  offered_price   NUMERIC(10,2),
  notes           TEXT
);

ALTER TABLE buyback_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert buyback items"
  ON buyback_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can read buyback items"
  ON buyback_items FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update buyback items"
  ON buyback_items FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- INDEX pre rýchle vyhľadávanie podľa submission
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_buyback_items_submission
  ON buyback_items (submission_id);

-- ============================================================
-- TRIGGER: auto-update updated_at na submissions
-- ============================================================
CREATE OR REPLACE FUNCTION update_buyback_submission_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_buyback_submission_update ON buyback_submissions;
CREATE TRIGGER on_buyback_submission_update
  BEFORE UPDATE ON buyback_submissions
  FOR EACH ROW EXECUTE FUNCTION update_buyback_submission_timestamp();
