-- ============================================================
-- Pokemon TCG E-shop — Seed Data
-- Migration: 20260313000002_seed_data
-- ============================================================

-- ============================================================
-- LOYALTY LEVELS
-- ============================================================
INSERT INTO loyalty_levels (id, name, min_points, max_points, discount_percent, perks) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Bronze',   0,     499,   0,    '{"early_access": false, "free_shipping": false, "mystery_box_discount": 0}'::jsonb),
  ('a1b2c3d4-0001-0001-0001-000000000002', 'Silver',   500,   1999,  3,    '{"early_access": false, "free_shipping": false, "mystery_box_discount": 5}'::jsonb),
  ('a1b2c3d4-0001-0001-0001-000000000003', 'Gold',     2000,  4999,  5,    '{"early_access": true, "free_shipping": false, "mystery_box_discount": 10}'::jsonb),
  ('a1b2c3d4-0001-0001-0001-000000000004', 'Platinum', 5000,  9999,  8,    '{"early_access": true, "free_shipping": true, "mystery_box_discount": 15}'::jsonb),
  ('a1b2c3d4-0001-0001-0001-000000000005', 'Diamond',  10000, NULL,  12,   '{"early_access": true, "free_shipping": true, "mystery_box_discount": 20, "dedicated_support": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- MYSTERY BOX TIERS
-- ============================================================
INSERT INTO mystery_box_tiers (id, name, price, description, min_value, max_value, possible_cards) VALUES
  (
    'b2c3d4e5-0002-0002-0002-000000000001',
    'Bronze',
    1999,  -- 19.99€
    'Základný mystery box — obsahuje 3-5 náhodných kariet z bežných setov. Garantovaná min. hodnota 20€.',
    2000, 5000,
    '["commons", "uncommons", "rares", "occasional_holo"]'::jsonb
  ),
  (
    'b2c3d4e5-0002-0002-0002-000000000002',
    'Silver',
    3999,  -- 39.99€
    'Silver mystery box — 5-8 kariet vrátane aspoň 1 holo rare. Garantovaná min. hodnota 45€.',
    4500, 10000,
    '["rares", "holo_rares", "ultra_rares", "occasional_v"]'::jsonb
  ),
  (
    'b2c3d4e5-0002-0002-0002-000000000003',
    'Gold',
    7999,  -- 79.99€
    'Gold mystery box — 8-12 kariet vrátane aspoň 1 V alebo VMAX karty. Garantovaná min. hodnota 90€.',
    9000, 20000,
    '["ultra_rares", "v_cards", "vmax_cards", "full_arts", "occasional_alt_art"]'::jsonb
  ),
  (
    'b2c3d4e5-0002-0002-0002-000000000004',
    'Platinum',
    14999, -- 149.99€
    'Platinum mystery box — 10-15 kariet vrátane aspoň 1 Alt Art alebo Full Art. Garantovaná min. hodnota 175€.',
    17500, 40000,
    '["full_arts", "alt_arts", "rainbow_rares", "gold_cards", "psa_possible"]'::jsonb
  ),
  (
    'b2c3d4e5-0002-0002-0002-000000000005',
    'Diamond',
    29999, -- 299.99€
    'Diamond mystery box — prémiový box s 15-20 kartami vrátane garantovanej PSA graded karty alebo Secret Rare. Garantovaná min. hodnota 350€.',
    35000, 100000,
    '["secret_rares", "special_illustration_rares", "guaranteed_psa", "alt_arts", "gold_cards"]'::jsonb
  )
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- PRODUCTS — 50 produktov
-- ============================================================

-- ----------------------------------------------------------
-- BOOSTER BOXY (10x) — Scarlet & Violet séria
-- ----------------------------------------------------------
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, is_mystery_box) VALUES

-- SV sety
('sv-obsidian-flames-booster-box',
 'Obsidian Flames Booster Box',
 'Scarlet & Violet — Obsidian Flames. 36 booster balíčkov. Set obsahuje Charizard ex Special Illustration Rare a ďalšie top karty.',
 'booster-box', 14999, 12, NULL,
 'https://images.pokemontcg.io/sv3/logo.png',
 'Obsidian Flames', false),

('sv-paldea-evolved-booster-box',
 'Paldea Evolved Booster Box',
 'Scarlet & Violet — Paldea Evolved. 36 booster balíčkov. Obsahuje Iono Full Art, Miraidon ex a Koraidon ex.',
 'booster-box', 13999, 8, NULL,
 'https://images.pokemontcg.io/sv2/logo.png',
 'Paldea Evolved', false),

('sv-scarlet-violet-base-booster-box',
 'Scarlet & Violet Base Set Booster Box',
 'Základný set Scarlet & Violet. 36 booster balíčkov. Koraidon ex, Miraidon ex, Arcanine ex.',
 'booster-box', 12999, 15, NULL,
 'https://images.pokemontcg.io/sv1/logo.png',
 'Scarlet & Violet Base', false),

('sv-paradox-rift-booster-box',
 'Paradox Rift Booster Box',
 'Scarlet & Violet — Paradox Rift. 36 booster balíčkov. Roaring Moon ex, Iron Valiant ex.',
 'booster-box', 14499, 10, NULL,
 'https://images.pokemontcg.io/sv4/logo.png',
 'Paradox Rift', false),

('sv-temporal-forces-booster-box',
 'Temporal Forces Booster Box',
 'Scarlet & Violet — Temporal Forces. 36 booster balíčkov. Walking Wake ex, Iron Leaves ex.',
 'booster-box', 13499, 7, NULL,
 'https://images.pokemontcg.io/sv5/logo.png',
 'Temporal Forces', false),

('sv-twilight-masquerade-booster-box',
 'Twilight Masquerade Booster Box',
 'Scarlet & Violet — Twilight Masquerade. 36 booster balíčkov. Teal Mask Ogerpon ex Alt Art.',
 'booster-box', 15499, 9, NULL,
 'https://images.pokemontcg.io/sv6/logo.png',
 'Twilight Masquerade', false),

('sv-shrouded-fable-booster-box',
 'Shrouded Fable Booster Box',
 'Scarlet & Violet — Shrouded Fable. 36 booster balíčkov. Pecharunt ex, Iron Crown ex.',
 'booster-box', 14999, 6, NULL,
 'https://images.pokemontcg.io/sv6pt5/logo.png',
 'Shrouded Fable', false),

('sv-stellar-crown-booster-box',
 'Stellar Crown Booster Box',
 'Scarlet & Violet — Stellar Crown. 36 booster balíčkov. Terapagos ex, Stellar Tera Type karty.',
 'booster-box', 15999, 5, NULL,
 'https://images.pokemontcg.io/sv7/logo.png',
 'Stellar Crown', false),

('swsh-evolving-skies-booster-box',
 'Evolving Skies Booster Box',
 'Sword & Shield — Evolving Skies. 36 booster balíčkov. Umbreon VMAX Alt Art, Rayquaza VMAX Alt Art. Najobľúbenejší SWSH set!',
 'booster-box', 28999, 4, NULL,
 'https://images.pokemontcg.io/swsh7/logo.png',
 'Evolving Skies', false),

('swsh-brilliant-stars-booster-box',
 'Brilliant Stars Booster Box',
 'Sword & Shield — Brilliant Stars. 36 booster balíčkov. Arceus VSTAR, Charizard VSTAR.',
 'booster-box', 18999, 6, NULL,
 'https://images.pokemontcg.io/swsh9/logo.png',
 'Brilliant Stars', false),

-- ----------------------------------------------------------
-- PSA GRADED KARTY (10x)
-- ----------------------------------------------------------

('psa-9-charizard-ex-sir-obsidian',
 'Charizard ex SIR — PSA 9 (Obsidian Flames)',
 'Charizard ex Special Illustration Rare z Obsidian Flames. PSA grade 9 — Near Mint / Mint. Jedna z najhodnotnejších kariet SV éry.',
 'psa-graded', 39999, 1, 'Special Illustration Rare',
 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
 'Obsidian Flames', false),

('psa-10-umbreon-vmax-alt-art',
 'Umbreon VMAX Alt Art — PSA 10 (Evolving Skies)',
 'Umbreon VMAX Alternative Art z Evolving Skies. PSA grade 10 — Gem Mint. Ikonická karta, grail pre kolekcionárov.',
 'psa-graded', 89999, 1, 'Alt Art',
 'https://images.pokemontcg.io/swsh7/215_hires.png',
 'Evolving Skies', false),

('psa-9-rayquaza-vmax-alt-art',
 'Rayquaza VMAX Alt Art — PSA 9 (Evolving Skies)',
 'Rayquaza VMAX Alternative Art z Evolving Skies. PSA grade 9 — Near Mint / Mint.',
 'psa-graded', 54999, 1, 'Alt Art',
 'https://images.pokemontcg.io/swsh7/218_hires.png',
 'Evolving Skies', false),

('psa-10-pikachu-vmax-rainbow',
 'Pikachu VMAX Rainbow Rare — PSA 10 (Vivid Voltage)',
 'Pikachu VMAX Rainbow Rare z Vivid Voltage. PSA grade 10 — Gem Mint. Obľúbená karta medzi fanúšikmi Pikachu.',
 'psa-graded', 34999, 1, 'Rainbow Rare',
 'https://images.pokemontcg.io/swsh4/188_hires.png',
 'Vivid Voltage', false),

('psa-9-giratina-v-full-art',
 'Giratina V Full Art — PSA 9 (Lost Origin)',
 'Giratina V Full Art z Lost Origin. PSA grade 9. Krásny artwork, veľmi žiadaná karta.',
 'psa-graded', 24999, 2, 'Full Art',
 'https://images.pokemontcg.io/swsh12/186_hires.png',
 'Lost Origin', false),

('psa-10-koraidon-ex-sar',
 'Koraidon ex Special Art Rare — PSA 10 (Scarlet & Violet)',
 'Koraidon ex Special Art Rare zo základného Scarlet & Violet setu. PSA grade 10 — Gem Mint.',
 'psa-graded', 19999, 2, 'Special Art Rare',
 'https://images.pokemontcg.io/sv1/252_hires.png',
 'Scarlet & Violet Base', false),

('psa-9-miraidon-ex-sar',
 'Miraidon ex Special Art Rare — PSA 9 (Scarlet & Violet)',
 'Miraidon ex Special Art Rare zo základného Scarlet & Violet setu. PSA grade 9.',
 'psa-graded', 14999, 2, 'Special Art Rare',
 'https://images.pokemontcg.io/sv1/254_hires.png',
 'Scarlet & Violet Base', false),

('psa-8-umbreon-vmax-regular',
 'Umbreon VMAX Regular — PSA 8 (Evolving Skies)',
 'Umbreon VMAX Regular Art z Evolving Skies. PSA grade 8 — Near Mint. Skvelá vstupná možnosť pre Umbreon kolekciu.',
 'psa-graded', 12999, 3, 'VMAX Rare',
 'https://images.pokemontcg.io/swsh7/94_hires.png',
 'Evolving Skies', false),

('psa-10-charizard-vstar',
 'Charizard VSTAR Rainbow Rare — PSA 10 (Brilliant Stars)',
 'Charizard VSTAR Rainbow Rare z Brilliant Stars. PSA grade 10 — Gem Mint.',
 'psa-graded', 29999, 1, 'Rainbow Rare',
 'https://images.pokemontcg.io/swsh9/174_hires.png',
 'Brilliant Stars', false),

('psa-9-arceus-vstar',
 'Arceus VSTAR Rainbow Rare — PSA 9 (Brilliant Stars)',
 'Arceus VSTAR Rainbow Rare z Brilliant Stars. PSA grade 9.',
 'psa-graded', 19999, 2, 'Rainbow Rare',
 'https://images.pokemontcg.io/swsh9/176_hires.png',
 'Brilliant Stars', false),

-- ----------------------------------------------------------
-- SINGLES — Rare + Ultra Rare karty (20x)
-- ----------------------------------------------------------

('single-charizard-ex-sir-obsidian',
 'Charizard ex SIR (Obsidian Flames) — NM',
 'Charizard ex Special Illustration Rare z Obsidian Flames. Near Mint kondícia. Ikona SV éry.',
 'singles', 24999, 5, 'Special Illustration Rare',
 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
 'Obsidian Flames', false),

('single-umbreon-vmax-alt-art',
 'Umbreon VMAX Alt Art (Evolving Skies) — NM',
 'Umbreon VMAX Alternative Art z Evolving Skies. Near Mint. Jeden z najobľúbenejších alt artov.',
 'singles', 59999, 3, 'Alt Art',
 'https://images.pokemontcg.io/swsh7/215_hires.png',
 'Evolving Skies', false),

('single-rayquaza-vmax-alt-art',
 'Rayquaza VMAX Alt Art (Evolving Skies) — NM',
 'Rayquaza VMAX Alternative Art. Near Mint. Neuveriteľný artwork od Takeshita.',
 'singles', 34999, 4, 'Alt Art',
 'https://images.pokemontcg.io/swsh7/218_hires.png',
 'Evolving Skies', false),

('single-pikachu-vmax-rainbow',
 'Pikachu VMAX Rainbow Rare (Vivid Voltage) — NM',
 'Pikachu VMAX Rainbow Rare z Vivid Voltage. Near Mint kondícia.',
 'singles', 19999, 6, 'Rainbow Rare',
 'https://images.pokemontcg.io/swsh4/188_hires.png',
 'Vivid Voltage', false),

('single-giratina-v-full-art',
 'Giratina V Full Art (Lost Origin) — NM',
 'Giratina V Full Art z Lost Origin. Near Mint. Temný artwork plný detailov.',
 'singles', 14999, 8, 'Full Art',
 'https://images.pokemontcg.io/swsh12/186_hires.png',
 'Lost Origin', false),

('single-koraidon-ex-sar',
 'Koraidon ex Special Art Rare (S&V Base) — NM',
 'Koraidon ex SAR. Near Mint. Maskot Scarlet hry.',
 'singles', 8999, 10, 'Special Art Rare',
 'https://images.pokemontcg.io/sv1/252_hires.png',
 'Scarlet & Violet Base', false),

('single-miraidon-ex-sar',
 'Miraidon ex Special Art Rare (S&V Base) — NM',
 'Miraidon ex SAR. Near Mint. Maskot Violet hry.',
 'singles', 7999, 10, 'Special Art Rare',
 'https://images.pokemontcg.io/sv1/254_hires.png',
 'Scarlet & Violet Base', false),

('single-umbreon-vmax-regular',
 'Umbreon VMAX Regular (Evolving Skies) — NM',
 'Umbreon VMAX Regular Art z Evolving Skies. Near Mint. Dostupnejšia alternatíva k alt artu.',
 'singles', 4999, 15, 'VMAX Rare',
 'https://images.pokemontcg.io/swsh7/94_hires.png',
 'Evolving Skies', false),

('single-charizard-vstar-rainbow',
 'Charizard VSTAR Rainbow Rare (Brilliant Stars) — NM',
 'Charizard VSTAR Rainbow Rare. Near Mint. Najobľúbenejší Charizard z SWSH éry.',
 'singles', 17999, 5, 'Rainbow Rare',
 'https://images.pokemontcg.io/swsh9/174_hires.png',
 'Brilliant Stars', false),

('single-arceus-vstar-rainbow',
 'Arceus VSTAR Rainbow Rare (Brilliant Stars) — NM',
 'Arceus VSTAR Rainbow Rare. Near Mint. Silná karta do hry aj do kolekcie.',
 'singles', 11999, 7, 'Rainbow Rare',
 'https://images.pokemontcg.io/swsh9/176_hires.png',
 'Brilliant Stars', false),

('single-lugia-vstar-alt-art',
 'Lugia VSTAR Alt Art (Silver Tempest) — NM',
 'Lugia VSTAR Alternative Art zo Silver Tempest. Near Mint. Legendárny artwork.',
 'singles', 39999, 3, 'Alt Art',
 'https://images.pokemontcg.io/swsh12pt5/195_hires.png',
 'Silver Tempest', false),

('single-mew-vmax-alt-art',
 'Mew VMAX Alt Art (Fusion Strike) — NM',
 'Mew VMAX Alternative Art z Fusion Strike. Near Mint. Obľúbená karta fanúšikov Mew.',
 'singles', 29999, 4, 'Alt Art',
 'https://images.pokemontcg.io/swsh8/269_hires.png',
 'Fusion Strike', false),

('single-glaceon-vmax-alt-art',
 'Glaceon VMAX Alt Art (Evolving Skies) — NM',
 'Glaceon VMAX Alternative Art z Evolving Skies. Near Mint.',
 'singles', 24999, 5, 'Alt Art',
 'https://images.pokemontcg.io/swsh7/209_hires.png',
 'Evolving Skies', false),

('single-leafeon-vmax-alt-art',
 'Leafeon VMAX Alt Art (Evolving Skies) — NM',
 'Leafeon VMAX Alternative Art z Evolving Skies. Near Mint.',
 'singles', 19999, 5, 'Alt Art',
 'https://images.pokemontcg.io/swsh7/210_hires.png',
 'Evolving Skies', false),

('single-espeon-vmax-alt-art',
 'Espeon VMAX Alt Art (Evolving Skies) — NM',
 'Espeon VMAX Alternative Art z Evolving Skies. Near Mint.',
 'singles', 22999, 4, 'Alt Art',
 'https://images.pokemontcg.io/swsh7/208_hires.png',
 'Evolving Skies', false),

('single-sylveon-vmax-alt-art',
 'Sylveon VMAX Alt Art (Evolving Skies) — NM',
 'Sylveon VMAX Alternative Art z Evolving Skies. Near Mint.',
 'singles', 17999, 6, 'Alt Art',
 'https://images.pokemontcg.io/swsh7/212_hires.png',
 'Evolving Skies', false),

('single-giratina-vstar-alt-art',
 'Giratina VSTAR Alt Art (Lost Origin) — NM',
 'Giratina VSTAR Alternative Art z Lost Origin. Near Mint. Temný masterpiece.',
 'singles', 44999, 3, 'Alt Art',
 'https://images.pokemontcg.io/swsh12/201_hires.png',
 'Lost Origin', false),

('single-mewtwo-v-union',
 'Mewtwo V-UNION (Celebrations) — NM',
 'Mewtwo V-UNION špeciálna karta z Celebrations setu. Near Mint. Unikátna mechanika V-UNION.',
 'singles', 8999, 10, 'Special Card',
 'https://images.pokemontcg.io/cel25/1_hires.png',
 'Celebrations', false),

('single-roaring-moon-ex-sar',
 'Roaring Moon ex Special Art Rare (Paradox Rift) — NM',
 'Roaring Moon ex SAR z Paradox Rift. Near Mint. Obľúbená competitive karta.',
 'singles', 9999, 8, 'Special Art Rare',
 'https://images.pokemontcg.io/sv4/251_hires.png',
 'Paradox Rift', false),

('single-iron-valiant-ex-sar',
 'Iron Valiant ex Special Art Rare (Paradox Rift) — NM',
 'Iron Valiant ex SAR z Paradox Rift. Near Mint.',
 'singles', 8999, 8, 'Special Art Rare',
 'https://images.pokemontcg.io/sv4/249_hires.png',
 'Paradox Rift', false),

('single-iono-full-art',
 'Iono Full Art Trainer (Paldea Evolved) — NM',
 'Iono Full Art Trainer z Paldea Evolved. Near Mint. Jedna z najobľúbenejších trainer kariet SV éry.',
 'singles', 6999, 12, 'Full Art Trainer',
 'https://images.pokemontcg.io/sv2/269_hires.png',
 'Paldea Evolved', false),

-- ----------------------------------------------------------
-- COLLECTION BOXY (5x)
-- ----------------------------------------------------------

('collection-box-charizard-ex-premium',
 'Charizard ex Premium Collection Box',
 'Prémiový kolekčný box s Charizard ex promo kartou, 6 booster balíčkami a špeciálnym coincom. Limitovaná edícia.',
 'collection-box', 8999, 15, NULL,
 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
 'Obsidian Flames', false),

('collection-box-paldean-fates',
 'Paldean Fates Elite Trainer Box',
 'Elite Trainer Box zo Paldean Fates. 9 booster balíčkov, 65 sleeve kariet, divider karty, damage countery.',
 'collection-box', 7499, 20, NULL,
 'https://images.pokemontcg.io/sv4pt5/logo.png',
 'Paldean Fates', false),

('collection-box-evolving-skies-etb',
 'Evolving Skies Elite Trainer Box (Umbreon)',
 'Elite Trainer Box Evolving Skies — Umbreon edícia. 8 booster balíčkov + prémiové doplnky. Výpredaj skladových zásob!',
 'collection-box', 9999, 8, NULL,
 'https://images.pokemontcg.io/swsh7/logo.png',
 'Evolving Skies', false),

('collection-box-151-etb',
 'Pokémon 151 Elite Trainer Box',
 'Elite Trainer Box z obľúbeného setu 151. 9 booster balíčkov s klasickými Kanto Pokémonmi. Mew ex, Alakazam ex.',
 'collection-box', 6999, 18, NULL,
 'https://images.pokemontcg.io/sv3pt5/logo.png',
 'Pokemon 151', false),

('collection-box-celebrations-ultra-premium',
 'Celebrations Ultra Premium Collection',
 'Ultra Premium Collection z 25. výročia Pokémon TCG. Charizard, Base Set karty, plátený pouch, coin. Veľmi limitované!',
 'collection-box', 24999, 3, NULL,
 'https://images.pokemontcg.io/cel25/logo.png',
 'Celebrations', false),

-- ----------------------------------------------------------
-- MYSTERY BOXY (5x — jeden pre každý tier)
-- ----------------------------------------------------------

('mystery-box-bronze',
 'Mystery Box — Bronze Tier',
 'Bronze mystery box — 3-5 náhodných kariet. Garantovaná hodnota minimálne 20€. Ideálny štart pre nových zberateľov.',
 'mystery-box', 1999, 50, NULL,
 NULL,
 NULL, true),

('mystery-box-silver',
 'Mystery Box — Silver Tier',
 'Silver mystery box — 5-8 kariet vrátane aspoň 1 holo rare. Garantovaná hodnota min. 45€. Skvelý pomer cena/hodnota!',
 'mystery-box', 3999, 30, NULL,
 NULL,
 NULL, true),

('mystery-box-gold',
 'Mystery Box — Gold Tier',
 'Gold mystery box — 8-12 kariet s aspoň 1 V alebo VMAX kartou. Garantovaná hodnota min. 90€. Pre serióznych zberateľov.',
 'mystery-box', 7999, 20, NULL,
 NULL,
 NULL, true),

('mystery-box-platinum',
 'Mystery Box — Platinum Tier',
 'Platinum mystery box — 10-15 kariet s aspoň 1 Alt Art alebo Full Art. Garantovaná hodnota min. 175€. Exkluzívny zážitok!',
 'mystery-box', 14999, 10, NULL,
 NULL,
 NULL, true),

('mystery-box-diamond',
 'Mystery Box — Diamond Tier',
 'Diamond mystery box — prémiový box, 15-20 kariet s garantovanou PSA graded kartou. Garantovaná hodnota min. 350€. Najvyšší level!',
 'mystery-box', 29999, 5, NULL,
 NULL,
 NULL, true)

ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------
-- Prepoj mystery boxy s tiermi
-- ----------------------------------------------------------
UPDATE products SET mystery_tier = 'b2c3d4e5-0002-0002-0002-000000000001' WHERE slug = 'mystery-box-bronze';
UPDATE products SET mystery_tier = 'b2c3d4e5-0002-0002-0002-000000000002' WHERE slug = 'mystery-box-silver';
UPDATE products SET mystery_tier = 'b2c3d4e5-0002-0002-0002-000000000003' WHERE slug = 'mystery-box-gold';
UPDATE products SET mystery_tier = 'b2c3d4e5-0002-0002-0002-000000000004' WHERE slug = 'mystery-box-platinum';
UPDATE products SET mystery_tier = 'b2c3d4e5-0002-0002-0002-000000000005' WHERE slug = 'mystery-box-diamond';
