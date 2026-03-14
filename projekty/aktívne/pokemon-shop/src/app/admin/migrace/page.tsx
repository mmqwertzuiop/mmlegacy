'use client'
import { useState } from 'react'

const SUPABASE_URL = 'https://supabase.com/dashboard/project/jnwtcstrfhmvopqdnzog/sql/new'

const MIGRATIONS = [
  {
    id: 1,
    title: 'BUYBACK TABUĽKY',
    desc: 'Tabuľky pre výkup kariet (buyback_submissions, buyback_items)',
    sql: `-- Buyback System
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
CREATE POLICY "Anyone can submit buyback" ON buyback_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read buyback submissions" ON buyback_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update buyback submissions" ON buyback_submissions FOR UPDATE USING (auth.role() = 'authenticated');

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
CREATE POLICY "Anyone can insert buyback items" ON buyback_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read buyback items" ON buyback_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update buyback items" ON buyback_items FOR UPDATE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_buyback_items_submission ON buyback_items (submission_id);

CREATE OR REPLACE FUNCTION update_buyback_submission_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_buyback_submission_update ON buyback_submissions;
CREATE TRIGGER on_buyback_submission_update
  BEFORE UPDATE ON buyback_submissions
  FOR EACH ROW EXECUTE FUNCTION update_buyback_submission_timestamp();`,
  },
  {
    id: 2,
    title: 'ADMIN POLÍCY',
    desc: 'Otvorí prístup pre admin panel (spusti PO SQL 1)',
    sql: `-- Admin policies
DROP POLICY IF EXISTS "Authenticated can read buyback submissions" ON buyback_submissions;
DROP POLICY IF EXISTS "Authenticated can update buyback submissions" ON buyback_submissions;
DROP POLICY IF EXISTS "Authenticated can read buyback items" ON buyback_items;
DROP POLICY IF EXISTS "Authenticated can update buyback items" ON buyback_items;

CREATE POLICY "Anyone can read buyback submissions" ON buyback_submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can update buyback submissions" ON buyback_submissions FOR UPDATE USING (true);
CREATE POLICY "Anyone can read buyback items" ON buyback_items FOR SELECT USING (true);
CREATE POLICY "Anyone can update buyback items" ON buyback_items FOR UPDATE USING (true);

CREATE POLICY "Admin can read all orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Admin can read all profiles" ON profiles FOR SELECT USING (true);`,
  },
  {
    id: 3,
    title: 'PRODUCTS TABUĽKA',
    desc: 'Tabuľka pre produkty + Supabase Storage bucket pre obrázky (spusti PO SQL 2)',
    sql: `-- Products table
-- DROP + RECREATE aby sa predišlo konfliktom so starými schémami
DROP TABLE IF EXISTS products CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE POLICY "Anyone can read active products" ON products FOR SELECT USING (active = true OR auth.role() = 'authenticated');
CREATE POLICY "Anyone can manage products via admin" ON products FOR ALL USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Anyone can read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Anyone can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Anyone can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

CREATE OR REPLACE FUNCTION update_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_product_update ON products;
CREATE TRIGGER on_product_update
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_timestamp();`,
  },
  {
    id: 4,
    title: 'SEED PRODUKTOV',
    desc: 'Naplní tabuľku všetkými 40 produktmi (spusti AKO POSLEDNÝ, PO SQL 3)',
    sql: `-- Seed products (id vynechané — slug je UNIQUE, databáza generuje id)
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('sv-obsidian-flames-booster-box', 'Obsidian Flames Booster Box', 'Tera Charizard ex — jedna z najžiadanejších kariet roku 2023. Set plný ohňa, temnoty a výnimočných ilustrácií. Charizard pull rate je nízky, preto každý otvorený box je adrenalín.', 'booster-box', 14999, 12, NULL, 'https://images.pokemontcg.io/sv3pt5/199_hires.png', 'Obsidian Flames', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('sv-scarlet-violet-base-booster-box', 'Scarlet & Violet Base Set Booster Box', 'Základný set novej éry. 36 boosterpakov obsahujúcich karty zo sveta Paldea — vrátane exov a ilustrácií novej generácie. Vstupná brána do SV éry.', 'booster-box', 12999, 15, NULL, 'https://images.pokemontcg.io/sv1/252_hires.png', 'Scarlet & Violet', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('sv-paradox-rift-booster-box', 'Paradox Rift Booster Box', 'Cestovanie časom v kartách. Paradox Rift prináša Ancient a Future Pokémonov s neobvyklou estetikou. Roaring Moon a Iron Valiant SIR patria medzi top pulls roka.', 'booster-box', 14499, 10, NULL, 'https://images.pokemontcg.io/sv4/182_hires.png', 'Paradox Rift', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('sv-twilight-masquerade-booster-box', 'Twilight Masquerade Booster Box', 'Tajomstvo a maškarný bál. Set s unikátnymi ilustráciami a prvými ACE SPEC kartami v SV éry. ACE SPEC karty sú maximálne jedna na box.', 'booster-box', 15499, 9, NULL, 'https://images.pokemontcg.io/sv6/191_hires.png', 'Twilight Masquerade', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('sv-stellar-crown-booster-box', 'Stellar Crown Booster Box', 'Korunovačný set s Terastal Pokémonmi v plnej sláve. Stellar Crown prináša luxusné ilustrácie. Terapagos ex SIR je jeden z vizuálne najimpresívnejších pull momentov celej éry.', 'booster-box', 15999, 5, NULL, 'https://images.pokemontcg.io/sv7/191_hires.png', 'Stellar Crown', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('sv-shrouded-fable-booster-box', 'Shrouded Fable Booster Box', 'Mini-set s maximálnym dopadom. Shrouded Fable sa zameriava na Pokémonov z ríše legiend s temnou estetikou. Nižší počet kariet = vyšší pull rate vzácností.', 'booster-box', 14999, 6, NULL, 'https://images.pokemontcg.io/sv6pt5/99_hires.png', 'Shrouded Fable', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('sv-prismatic-evolutions-booster-box', 'Prismatic Evolutions Booster Box', 'Eevee a jeho evolúcie nikdy nevyzerali lepšie. Collector''s sen — rainbow foily, exkluzívne Eeveelutions. Sylveon ex SIR, Umbreon ex SIR.', 'booster-box', 17999, 3, NULL, 'https://images.pokemontcg.io/sv8pt5/161_hires.png', 'Prismatic Evolutions', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('swsh-evolving-skies-booster-box', 'Evolving Skies Booster Box', 'Domov Umbreon VMAX Alt Art a Rayquaza VMAX Alt Art — dvoch z najprestížnejších kariet celej SWSH éry. Každé otvorenie je šancou na legendárny pull.', 'booster-box', 28999, 4, NULL, 'https://images.pokemontcg.io/swsh7/218_hires.png', 'Evolving Skies', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('swsh-brilliant-stars-booster-box', 'Brilliant Stars Booster Box', 'Arceus VSTAR dominuje. Brilliant Stars je jeden z najsilnejších setov SWSH éry s mimoriadnym collector''s obsahom a silnými competitive pullmi.', 'booster-box', 18999, 6, NULL, 'https://images.pokemontcg.io/swsh9/186_hires.png', 'Brilliant Stars', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('sv-surging-sparks-booster-box', 'Surging Sparks Booster Box', 'Elektrická búrka Pokémon kariet. Pikachu ex a spol. v plnom náboji — set nabitý energiou. Pikachu pull rate, Raichu SIR a množstvo záber-level ilustrácií.', 'booster-box', 15999, 8, NULL, 'https://images.pokemontcg.io/sv8/191_hires.png', 'Surging Sparks', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('psa-9-charizard-ex-sir-obsidian', 'Charizard ex SIR — PSA 9', 'Kráľ zbierky. Charizard ex SIR v PSA 9 stave — dramatická full-art ilustrácia, bezchybný povrch, legendárny Pokémon. Investičný potenciál prvej kategórie.', 'psa-graded', 39999, 2, 'Special Illustration Rare', 'https://images.pokemontcg.io/sv3pt5/199_hires.png', 'Obsidian Flames', 9, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('psa-10-umbreon-vmax-alt-art', 'Umbreon VMAX Alt Art — PSA 10', 'Nočná legenda. Umbreon VMAX Alt Art patrí dlhodobo medzi najžiadanejšie karty celej SWSH éry. PSA 10 garant dokonalého stavu s ikonickou tmavou estetikou.', 'psa-graded', 89999, 1, 'Alt Art', 'https://images.pokemontcg.io/swsh7/215_hires.png', 'Evolving Skies', 10, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('psa-9-rayquaza-vmax-alt-art', 'Rayquaza VMAX Alt Art — PSA 9', 'Nebeský drak v plnej kráse. Rayquaza VMAX Alt Art je považovaná za jednu z najlepších ilustrácií celej SWSH éry. PSA 9 Near Mint stav.', 'psa-graded', 54999, 1, 'Alt Art', 'https://images.pokemontcg.io/swsh7/218_hires.png', 'Evolving Skies', 9, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('psa-10-pikachu-vmax-rainbow', 'Pikachu VMAX Rainbow — PSA 10', 'Pikachu v rainbow glory. Kombinuje ikonického maskota s oslnivým rainbow foil efektom. PSA 10 — absolútna dokonalosť. Must-have pre každého Pikachu zberateľa.', 'psa-graded', 34999, 2, 'Rainbow Rare', 'https://images.pokemontcg.io/swsh4/188_hires.png', 'Vivid Voltage', 10, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('psa-9-giratina-v-full-art', 'Giratina V Full Art — PSA 9', 'Pán tieňovej ríše. Giratina V Full Art z Lost Origin zachytáva temného legendárneho Pokémona v epickej full-art kompozícii. PSA 9 stav — bezchybné.', 'psa-graded', 24999, 3, 'Full Art', 'https://images.pokemontcg.io/swsh12/186_hires.png', 'Lost Origin', 9, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('psa-10-koraidon-ex-sar', 'Koraidon ex SAR — PSA 10', 'Legendárny Pokémon SV éry v absolútnej dokonalosti. Koraidon ex Special Art Rare s PSA 10 certifikáciou. Ikonická karta novej generácie.', 'psa-graded', 19999, 2, 'Special Art Rare', 'https://images.pokemontcg.io/sv1/252_hires.png', 'Scarlet & Violet', 10, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('psa-9-miraidon-ex-sar', 'Miraidon ex SAR — PSA 9', 'Futuristický legendárny Pokémon v PSA 9 stave. Miraidon ex SAR je perfektný pendant ku Koraidon. Investičná karta so silným collector''s dopytom.', 'psa-graded', 14999, 2, 'Special Art Rare', 'https://images.pokemontcg.io/sv1/254_hires.png', 'Scarlet & Violet', 9, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('psa-8-umbreon-vmax-regular', 'Umbreon VMAX Regular — PSA 8', 'Klasický Umbreon VMAX v PSA 8 stave — skvelý vstup do graded zbierky. Umbreon je jednou z najobľúbenejších kariet pre zberateľov naprieč generáciami.', 'psa-graded', 12999, 3, 'VMAX Rare', 'https://images.pokemontcg.io/swsh7/94_hires.png', 'Evolving Skies', 8, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('psa-10-charizard-vstar', 'Charizard VSTAR Rainbow — PSA 10', 'Charizard vo VSTAR forme s oslnivým rainbow foil efektom. PSA 10 certifikovaný — absolútna dokonalosť v každom detaile. Centerpiece každej graded zbierky.', 'psa-graded', 29999, 1, 'Rainbow Rare', 'https://images.pokemontcg.io/swsh3/189_hires.png', 'Brilliant Stars', 10, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('psa-9-arceus-vstar', 'Arceus VSTAR Rainbow — PSA 9', 'Boh Pokémon sveta vo forme karty. Arceus VSTAR Rainbow v PSA 9 stave — jedna z najzberateľskejších kariet Brilliant Stars setu.', 'psa-graded', 19999, 2, 'Rainbow Rare', 'https://images.pokemontcg.io/swsh9/186_hires.png', 'Brilliant Stars', 9, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('single-charizard-ex-sir-obsidian', 'Charizard ex SIR (Obsidian Flames)', 'Ikona setu. Charizard s Terastal transformáciou v plnej sláve. Jedna z definujúcich kariet SV éry. Near Mint / Raw stav.', 'singles', 24999, 5, 'Special Illustration Rare', 'https://images.pokemontcg.io/sv3pt5/199_hires.png', 'Obsidian Flames', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('single-umbreon-vmax-alt-art', 'Umbreon VMAX Alt Art (Evolving Skies)', 'Tmavá elegancia v najčistejšej forme. Umbreon VMAX Alt Art z Evolving Skies je okamžitý centerpiece každej zbierky. Near Mint / Raw.', 'singles', 59999, 2, 'Alt Art', 'https://images.pokemontcg.io/swsh7/215_hires.png', 'Evolving Skies', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('single-rayquaza-vmax-alt-art', 'Rayquaza VMAX Alt Art (Evolving Skies)', 'Nebeský drak v dramatickej alt-art interpretácii. Rayquaza VMAX Alt Art patrí medzi top investments celej SWSH éry. Near Mint / Raw.', 'singles', 34999, 3, 'Alt Art', 'https://images.pokemontcg.io/swsh7/218_hires.png', 'Evolving Skies', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('single-pikachu-vmax-rainbow', 'Pikachu VMAX Rainbow (Vivid Voltage)', 'Pikachu v rainbow glory. Kombinuje ikonického maskota s oslnivým rainbow foil efektom. Near Mint / Raw.', 'singles', 19999, 4, 'Rainbow Rare', 'https://images.pokemontcg.io/swsh4/188_hires.png', 'Vivid Voltage', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('single-giratina-v-full-art', 'Giratina V Full Art (Lost Origin)', 'Pán tieňovej ríše v epickej full-art forme. Giratina V je top collector''s karta Lost Origin setu. Near Mint / Raw.', 'singles', 14999, 6, 'Full Art', 'https://images.pokemontcg.io/swsh12/186_hires.png', 'Lost Origin', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('single-koraidon-ex-sar', 'Koraidon ex SAR (S&V Base)', 'Legendárny Pokémon novej SV éry v Special Art Rare forme. Ikonická karta, ktorá definovala začiatok Scarlet & Violet. Near Mint / Raw.', 'singles', 8999, 8, 'Special Art Rare', 'https://images.pokemontcg.io/sv1/252_hires.png', 'Scarlet & Violet', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('single-miraidon-ex-sar', 'Miraidon ex SAR (S&V Base)', 'Futuristický rival Koraidona v Special Art Rare forme. Párová karta pre SV zberateľov. Near Mint / Raw.', 'singles', 7999, 7, 'Special Art Rare', 'https://images.pokemontcg.io/sv1/254_hires.png', 'Scarlet & Violet', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('single-charizard-ex-alt', 'Charizard ex Alt Art (Obsidian Flames)', 'Tera Charizard ex v dramatickej alt art interpretácii. Jeden z najžiadanejších pulls roku 2023. Near Mint / Raw.', 'singles', 18999, 3, 'Special Illustration Rare', 'https://images.pokemontcg.io/sv3pt5/183_hires.png', 'Obsidian Flames', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('single-pikachu-ex-fa', 'Pikachu ex Full Art (Surging Sparks)', 'Maskot v plnej sláve. Pikachu ex Full Art je must-have karta každého Pikachu zberateľa. Near Mint / Raw.', 'singles', 11999, 5, 'Full Art', 'https://images.pokemontcg.io/sv8/188_hires.png', 'Surging Sparks', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('single-crown-zenith-sr', 'Crown Zenith Secret Rare', 'Exkluzívna Secret Rare karta z Crown Zenith — jedného z najprestížnejších setov moderného TCG. Near Mint / Raw.', 'singles', 15999, 4, 'Secret Rare', 'https://images.pokemontcg.io/swsh12pt5/160_hires.png', 'Crown Zenith', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('collection-box-charizard-ex-premium', 'Charizard ex Premium Collection Box', 'Prémiový Charizard box s exkluzívnym obsahom. Obsahuje booster packy, oversized promo kartu a exkluzívne Charizard-themed doplnky. Perfektný darček.', 'collection-box', 8999, 15, NULL, 'https://images.pokemontcg.io/sv3pt5/199_hires.png', 'Obsidian Flames', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('collection-box-paldean-fates', 'Paldean Fates Elite Trainer Box', 'Shiny premium balíček. Paldean Fates ETB s exkluzívnymi shiny Pokémonmi, 9 booster packmi a prémiovou promo kartou. Pre vážnych zberateľov.', 'collection-box', 7499, 20, NULL, 'https://images.pokemontcg.io/sv4pt5/91_hires.png', 'Paldean Fates', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('collection-box-evolving-skies-etb', 'Evolving Skies ETB — Umbreon edícia', 'Legendárny ETB s Umbreon tematikou. Evolving Skies ETB obsahuje 8 booster packov a exkluzívne Umbreon-themed doplnky. Ikonický collector piece.', 'collection-box', 9999, 8, NULL, 'https://images.pokemontcg.io/swsh7/215_hires.png', 'Evolving Skies', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('collection-box-151-etb', 'Pokemon 151 Elite Trainer Box', 'Nostalgia v najčistejšej forme. 151 ETB je hold-all pre prvú generáciu — 9 booster packov, exkluzívne promo karty a prémiové Gen 1 doplnky.', 'collection-box', 6999, 18, NULL, 'https://images.pokemontcg.io/sv3pt5/183_hires.png', 'Pokemon 151', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('collection-box-celebrations-ultra-premium', 'Celebrations Ultra Premium Collection', 'Výnimočné 25. výročie v prémiom boxe. Celebrations UPC obsahuje vintage promo karty, 16 booster packov a exkluzívne zberateľské predmety.', 'collection-box', 24999, 3, NULL, 'https://images.pokemontcg.io/cel25/1_hires.png', 'Celebrations', NULL, FALSE, NULL) ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('mystery-box-bronze', 'Bronze Mystery Box', 'Entry level mystery zážitok. 3 booster packy + 1 reverse holo karta + 1 bonus promo karta. 20% šanca na Ultra Rare.', 'mystery-box', 1999, 50, NULL, '', NULL, NULL, TRUE, 'Bronze') ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('mystery-box-silver', 'Silver Mystery Box', 'Mid level mystery box. 6 booster packov + 2 rare karty + 1 garantovaná holographic + exclusive MM Legacy sticker. 35% šanca na Ultra Rare.', 'mystery-box', 3999, 30, NULL, '', NULL, NULL, TRUE, 'Silver') ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('mystery-box-gold', 'Gold Mystery Box', 'Premium mystery experience. 10-15 booster packov + 3 rare+ karty + 1 garantovaná Ultra Rare + exclusive sleeve set. 25% šanca na graded kartu.', 'mystery-box', 7999, 20, NULL, '', NULL, NULL, TRUE, 'Gold') ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('mystery-box-platinum', 'Platinum Mystery Box', 'High-end mystery box. Kompletný booster box + 5 rare+ kariet + 2 Ultra Rare/SIR + 1 graded karta PSA 9/10 + exclusive portfolio.', 'mystery-box', 14999, 10, NULL, '', NULL, NULL, TRUE, 'Platinum') ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier) VALUES ('mystery-box-diamond', 'Diamond Mystery Box', 'Ultimate collector''s experience. 2 booster boxy + 10 rare+ kariet + 3 SIR + 2 graded (aspoň 1x PSA 10) + VIP Diamond Club na 3 mesiace.', 'mystery-box', 29999, 5, NULL, '', NULL, NULL, TRUE, 'Diamond') ON CONFLICT (slug) DO NOTHING;`,
  },
]

export default function AdminMigracePage() {
  const [copied, setCopied] = useState<number | null>(null)

  const copy = async (id: number, sql: string) => {
    await navigator.clipboard.writeText(sql)
    setCopied(id)
    setTimeout(() => setCopied(null), 2500)
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '8px' }}>SETUP</p>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>SQL MIGRÁCIE</h1>
        <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', color: 'var(--dim)', marginTop: '8px' }}>
          Skopíruj každý SQL blok a spusti ho v Supabase SQL editore. Spúšťaj v poradí 1 → 2 → 3 → 4.
        </p>
      </div>

      {/* Supabase link */}
      <a href={SUPABASE_URL} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 24px', background: 'rgba(34,197,94,0.08)', border: '1px solid var(--green)', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--green)', textDecoration: 'none', letterSpacing: '0.15em', marginBottom: '36px' }}>
        ↗ OTVORIŤ SUPABASE SQL EDITOR
      </a>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {MIGRATIONS.map((m) => (
          <div key={m.id} style={{ border: '1px solid var(--surface-2)', background: 'var(--surface)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--surface-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: 'var(--orange)', lineHeight: 1 }}>{m.id}</span>
                <div>
                  <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: 'var(--ghost)', letterSpacing: '0.04em', lineHeight: 1 }}>{m.title}</p>
                  <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', color: 'var(--dim)', marginTop: '3px' }}>{m.desc}</p>
                </div>
              </div>
              <button
                onClick={() => copy(m.id, m.sql)}
                style={{
                  padding: '10px 24px',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  fontWeight: 700,
                  background: copied === m.id ? 'rgba(34,197,94,0.15)' : 'var(--orange)',
                  border: `1px solid ${copied === m.id ? 'var(--green)' : 'var(--orange)'}`,
                  color: copied === m.id ? 'var(--green)' : '#000',
                  cursor: 'none',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {copied === m.id ? '✓ SKOPÍROVANÉ!' : 'KOPÍROVAŤ SQL'}
              </button>
            </div>

            {/* SQL preview */}
            <div style={{ position: 'relative' }}>
              <pre style={{
                margin: 0,
                padding: '20px 24px',
                fontFamily: 'Space Mono, monospace',
                fontSize: '11px',
                lineHeight: 1.7,
                color: 'var(--dim)',
                background: 'var(--void)',
                overflowX: 'auto',
                maxHeight: '280px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {m.sql}
              </pre>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px', padding: '20px 24px', background: 'rgba(250,93,41,0.06)', border: '1px solid rgba(250,93,41,0.2)' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--orange)', letterSpacing: '0.2em', marginBottom: '8px' }}>POSTUP</p>
        <ol style={{ margin: 0, padding: '0 0 0 20px' }}>
          {['Klikni "OTVORIŤ SUPABASE SQL EDITOR" vyššie', 'Klikni "KOPÍROVAŤ SQL" pri SQL 1', 'Vlož do editora a klikni Run', 'Opakuj pre SQL 2, 3, 4 v poradí'].map((step, i) => (
            <li key={i} style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', color: 'var(--dim)', marginBottom: '6px' }}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
