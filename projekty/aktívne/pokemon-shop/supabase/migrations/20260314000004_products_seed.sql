-- Seed all products from products.ts
-- id vynechané — databáza generuje automaticky, slug je UNIQUE

-- Booster Boxy
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('sv-obsidian-flames-booster-box', 'Obsidian Flames Booster Box', 'Tera Charizard ex — jedna z najžiadanejších kariet roku 2023. Set plný ohňa, temnoty a výnimočných ilustrácií. Charizard pull rate je nízky, preto každý otvorený box je adrenalín.', 'booster-box', 14999, 12, NULL, 'https://images.pokemontcg.io/sv3pt5/199_hires.png', 'Obsidian Flames', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('sv-scarlet-violet-base-booster-box', 'Scarlet & Violet Base Set Booster Box', 'Základný set novej éry. 36 boosterpakov obsahujúcich karty zo sveta Paldea — vrátane exov a ilustrácií novej generácie. Vstupná brána do SV éry.', 'booster-box', 12999, 15, NULL, 'https://images.pokemontcg.io/sv1/252_hires.png', 'Scarlet & Violet', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('sv-paradox-rift-booster-box', 'Paradox Rift Booster Box', 'Cestovanie časom v kartách. Paradox Rift prináša Ancient a Future Pokémonov s neobvyklou estetikou. Roaring Moon a Iron Valiant SIR patria medzi top pulls roka.', 'booster-box', 14499, 10, NULL, 'https://images.pokemontcg.io/sv4/182_hires.png', 'Paradox Rift', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('sv-twilight-masquerade-booster-box', 'Twilight Masquerade Booster Box', 'Tajomstvo a maškarný bál. Set s unikátnymi ilustráciami a prvými ACE SPEC kartami v SV éry. ACE SPEC karty sú maximálne jedna na box.', 'booster-box', 15499, 9, NULL, 'https://images.pokemontcg.io/sv6/191_hires.png', 'Twilight Masquerade', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('sv-stellar-crown-booster-box', 'Stellar Crown Booster Box', 'Korunovačný set s Terastal Pokémonmi v plnej sláve. Stellar Crown prináša luxusné ilustrácie. Terapagos ex SIR je jeden z vizuálne najimpresívnejších pull momentov celej éry.', 'booster-box', 15999, 5, NULL, 'https://images.pokemontcg.io/sv7/191_hires.png', 'Stellar Crown', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('sv-shrouded-fable-booster-box', 'Shrouded Fable Booster Box', 'Mini-set s maximálnym dopadom. Shrouded Fable sa zameriava na Pokémonov z ríše legiend s temnou estetikou. Nižší počet kariet = vyšší pull rate vzácností.', 'booster-box', 14999, 6, NULL, 'https://images.pokemontcg.io/sv6pt5/99_hires.png', 'Shrouded Fable', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('sv-prismatic-evolutions-booster-box', 'Prismatic Evolutions Booster Box', 'Eevee a jeho evolúcie nikdy nevyzerali lepšie. Collector''s sen — rainbow foily, exkluzívne Eeveelutions. Sylveon ex SIR, Umbreon ex SIR — karty, ktoré si zberateľ pamätá navždy.', 'booster-box', 17999, 3, NULL, 'https://images.pokemontcg.io/sv8pt5/161_hires.png', 'Prismatic Evolutions', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('swsh-evolving-skies-booster-box', 'Evolving Skies Booster Box', 'Domov Umbreon VMAX Alt Art a Rayquaza VMAX Alt Art — dvoch z najprestížnejších kariet celej SWSH éry. Každé otvorenie je šancou na legendárny pull.', 'booster-box', 28999, 4, NULL, 'https://images.pokemontcg.io/swsh7/218_hires.png', 'Evolving Skies', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('swsh-brilliant-stars-booster-box', 'Brilliant Stars Booster Box', 'Arceus VSTAR dominuje. Brilliant Stars je jeden z najsilnejších setov SWSH éry s mimoriadnym collector''s obsahom a silnými competitive pullmi.', 'booster-box', 18999, 6, NULL, 'https://images.pokemontcg.io/swsh9/186_hires.png', 'Brilliant Stars', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('sv-surging-sparks-booster-box', 'Surging Sparks Booster Box', 'Elektrická búrka Pokémon kariet. Pikachu ex a spol. v plnom náboji — set nabitý energiou. Pikachu pull rate, Raichu SIR a množstvo záber-level ilustrácií.', 'booster-box', 15999, 8, NULL, 'https://images.pokemontcg.io/sv8/191_hires.png', 'Surging Sparks', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

-- PSA Graded
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('psa-9-charizard-ex-sir-obsidian', 'Charizard ex SIR — PSA 9', 'Kráľ zbierky. Charizard ex SIR v PSA 9 stave — dramatická full-art ilustrácia, bezchybný povrch, legendárny Pokémon. Investičný potenciál prvej kategórie.', 'psa-graded', 39999, 2, 'Special Illustration Rare', 'https://images.pokemontcg.io/sv3pt5/199_hires.png', 'Obsidian Flames', 9, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('psa-10-umbreon-vmax-alt-art', 'Umbreon VMAX Alt Art — PSA 10', 'Nočná legenda. Umbreon VMAX Alt Art patrí dlhodobo medzi najžiadanejšie karty celej SWSH éry. PSA 10 garant dokonalého stavu s ikonickou tmavou estetikou.', 'psa-graded', 89999, 1, 'Alt Art', 'https://images.pokemontcg.io/swsh7/215_hires.png', 'Evolving Skies', 10, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('psa-9-rayquaza-vmax-alt-art', 'Rayquaza VMAX Alt Art — PSA 9', 'Nebeský drak v plnej kráse. Rayquaza VMAX Alt Art je považovaná za jednu z najlepších ilustrácií celej SWSH éry. PSA 9 Near Mint stav.', 'psa-graded', 54999, 1, 'Alt Art', 'https://images.pokemontcg.io/swsh7/218_hires.png', 'Evolving Skies', 9, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('psa-10-pikachu-vmax-rainbow', 'Pikachu VMAX Rainbow — PSA 10', 'Pikachu v rainbow glory. Kombinuje ikonického maskota s oslnivým rainbow foil efektom. PSA 10 — absolútna dokonalosť. Must-have pre každého Pikachu zberateľa.', 'psa-graded', 34999, 2, 'Rainbow Rare', 'https://images.pokemontcg.io/swsh4/188_hires.png', 'Vivid Voltage', 10, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('psa-9-giratina-v-full-art', 'Giratina V Full Art — PSA 9', 'Pán tieňovej ríše. Giratina V Full Art z Lost Origin zachytáva temného legendárneho Pokémona v epickej full-art kompozícii. PSA 9 stav — bezchybné.', 'psa-graded', 24999, 3, 'Full Art', 'https://images.pokemontcg.io/swsh12/186_hires.png', 'Lost Origin', 9, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('psa-10-koraidon-ex-sar', 'Koraidon ex SAR — PSA 10', 'Legendárny Pokémon SV éry v absolútnej dokonalosti. Koraidon ex Special Art Rare s PSA 10 certifikáciou. Ikonická karta novej generácie.', 'psa-graded', 19999, 2, 'Special Art Rare', 'https://images.pokemontcg.io/sv1/252_hires.png', 'Scarlet & Violet', 10, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('psa-9-miraidon-ex-sar', 'Miraidon ex SAR — PSA 9', 'Futuristický legendárny Pokémon v PSA 9 stave. Miraidon ex SAR je perfektný pendant ku Koraidon. Investičná karta so silným collector''s dopytom.', 'psa-graded', 14999, 2, 'Special Art Rare', 'https://images.pokemontcg.io/sv1/254_hires.png', 'Scarlet & Violet', 9, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('psa-8-umbreon-vmax-regular', 'Umbreon VMAX Regular — PSA 8', 'Klasický Umbreon VMAX v PSA 8 stave — skvelý vstup do graded zbierky. Umbreon je jednou z najobľúbenejších kariet pre zberateľov naprieč generáciami.', 'psa-graded', 12999, 3, 'VMAX Rare', 'https://images.pokemontcg.io/swsh7/94_hires.png', 'Evolving Skies', 8, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('psa-10-charizard-vstar', 'Charizard VSTAR Rainbow — PSA 10', 'Charizard vo VSTAR forme s oslnivým rainbow foil efektom. PSA 10 certifikovaný — absolútna dokonalosť v každom detaile. Centerpiece každej graded zbierky.', 'psa-graded', 29999, 1, 'Rainbow Rare', 'https://images.pokemontcg.io/swsh3/189_hires.png', 'Brilliant Stars', 10, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('psa-9-arceus-vstar', 'Arceus VSTAR Rainbow — PSA 9', 'Boh Pokémon sveta vo forme karty. Arceus VSTAR Rainbow v PSA 9 stave — jedna z najzberateľskejších kariet Brilliant Stars setu.', 'psa-graded', 19999, 2, 'Rainbow Rare', 'https://images.pokemontcg.io/swsh9/186_hires.png', 'Brilliant Stars', 9, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

-- Singles
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('single-charizard-ex-sir-obsidian', 'Charizard ex SIR (Obsidian Flames)', 'Ikona setu. Charizard s Terastal transformáciou v plnej sláve. Jedna z definujúcich kariet SV éry. Near Mint / Raw stav.', 'singles', 24999, 5, 'Special Illustration Rare', 'https://images.pokemontcg.io/sv3pt5/199_hires.png', 'Obsidian Flames', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('single-umbreon-vmax-alt-art', 'Umbreon VMAX Alt Art (Evolving Skies)', 'Tmavá elegancia v najčistejšej forme. Umbreon VMAX Alt Art z Evolving Skies je okamžitý centerpiece každej zbierky. Near Mint / Raw.', 'singles', 59999, 2, 'Alt Art', 'https://images.pokemontcg.io/swsh7/215_hires.png', 'Evolving Skies', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('single-rayquaza-vmax-alt-art', 'Rayquaza VMAX Alt Art (Evolving Skies)', 'Nebeský drak v dramatickej alt-art interpretácii. Rayquaza VMAX Alt Art patrí medzi top investments celej SWSH éry. Near Mint / Raw.', 'singles', 34999, 3, 'Alt Art', 'https://images.pokemontcg.io/swsh7/218_hires.png', 'Evolving Skies', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('single-pikachu-vmax-rainbow', 'Pikachu VMAX Rainbow (Vivid Voltage)', 'Pikachu v rainbow glory. Kombinuje ikonického maskota s oslnivým rainbow foil efektom. Near Mint / Raw.', 'singles', 19999, 4, 'Rainbow Rare', 'https://images.pokemontcg.io/swsh4/188_hires.png', 'Vivid Voltage', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('single-giratina-v-full-art', 'Giratina V Full Art (Lost Origin)', 'Pán tieňovej ríše v epickej full-art forme. Giratina V je top collector''s karta Lost Origin setu. Near Mint / Raw.', 'singles', 14999, 6, 'Full Art', 'https://images.pokemontcg.io/swsh12/186_hires.png', 'Lost Origin', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('single-koraidon-ex-sar', 'Koraidon ex SAR (S&V Base)', 'Legendárny Pokémon novej SV éry v Special Art Rare forme. Ikonická karta, ktorá definovala začiatok Scarlet & Violet. Near Mint / Raw.', 'singles', 8999, 8, 'Special Art Rare', 'https://images.pokemontcg.io/sv1/252_hires.png', 'Scarlet & Violet', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('single-miraidon-ex-sar', 'Miraidon ex SAR (S&V Base)', 'Futuristický rival Koraidona v Special Art Rare forme. Párová karta pre SV zberateľov. Near Mint / Raw.', 'singles', 7999, 7, 'Special Art Rare', 'https://images.pokemontcg.io/sv1/254_hires.png', 'Scarlet & Violet', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('single-charizard-ex-alt', 'Charizard ex Alt Art (Obsidian Flames)', 'Tera Charizard ex v dramatickej alt art interpretácii. Jeden z najžiadanejších pulls roku 2023. Near Mint / Raw.', 'singles', 18999, 3, 'Special Illustration Rare', 'https://images.pokemontcg.io/sv3pt5/183_hires.png', 'Obsidian Flames', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('single-pikachu-ex-fa', 'Pikachu ex Full Art (Surging Sparks)', 'Maskot v plnej sláve. Pikachu ex Full Art je must-have karta každého Pikachu zberateľa. Near Mint / Raw.', 'singles', 11999, 5, 'Full Art', 'https://images.pokemontcg.io/sv8/188_hires.png', 'Surging Sparks', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('single-crown-zenith-sr', 'Crown Zenith Secret Rare', 'Exkluzívna Secret Rare karta z Crown Zenith — jedného z najprestížnejších setov moderného TCG. Near Mint / Raw.', 'singles', 15999, 4, 'Secret Rare', 'https://images.pokemontcg.io/swsh12pt5/160_hires.png', 'Crown Zenith', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

-- Collection Boxy
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('collection-box-charizard-ex-premium', 'Charizard ex Premium Collection Box', 'Prémiový Charizard box s exkluzívnym obsahom. Obsahuje booster packy, oversized promo kartu a exkluzívne Charizard-themed doplnky. Perfektný darček.', 'collection-box', 8999, 15, NULL, 'https://images.pokemontcg.io/sv3pt5/199_hires.png', 'Obsidian Flames', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('collection-box-paldean-fates', 'Paldean Fates Elite Trainer Box', 'Shiny premium balíček. Paldean Fates ETB s exkluzívnymi shiny Pokémonmi, 9 booster packmi a prémiovou promo kartou. Pre vážnych zberateľov.', 'collection-box', 7499, 20, NULL, 'https://images.pokemontcg.io/sv4pt5/91_hires.png', 'Paldean Fates', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('collection-box-evolving-skies-etb', 'Evolving Skies ETB — Umbreon edícia', 'Legendárny ETB s Umbreon tematikou. Evolving Skies ETB obsahuje 8 booster packov a exkluzívne Umbreon-themed doplnky. Ikonický collector piece.', 'collection-box', 9999, 8, NULL, 'https://images.pokemontcg.io/swsh7/215_hires.png', 'Evolving Skies', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('collection-box-151-etb', 'Pokemon 151 Elite Trainer Box', 'Nostalgia v najčistejšej forme. 151 ETB je hold-all pre prvú generáciu — 9 booster packov, exkluzívne promo karty a prémiové Gen 1 doplnky.', 'collection-box', 6999, 18, NULL, 'https://images.pokemontcg.io/sv3pt5/183_hires.png', 'Pokemon 151', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('collection-box-celebrations-ultra-premium', 'Celebrations Ultra Premium Collection', 'Výnimočné 25. výročie v prémiom boxe. Celebrations UPC obsahuje vintage promo karty, 16 booster packov a exkluzívne zberateľské predmety.', 'collection-box', 24999, 3, NULL, 'https://images.pokemontcg.io/cel25/1_hires.png', 'Celebrations', NULL, FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;

-- Mystery Boxy
INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('mystery-box-bronze', 'Bronze Mystery Box', 'Entry level mystery zážitok. 3 booster packy + 1 reverse holo karta + 1 bonus promo karta. 20% šanca na Ultra Rare.', 'mystery-box', 1999, 50, NULL, '', NULL, NULL, TRUE, 'Bronze')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('mystery-box-silver', 'Silver Mystery Box', 'Mid level mystery box. 6 booster packov + 2 rare karty + 1 garantovaná holographic + exclusive MM Legacy sticker. 35% šanca na Ultra Rare.', 'mystery-box', 3999, 30, NULL, '', NULL, NULL, TRUE, 'Silver')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('mystery-box-gold', 'Gold Mystery Box', 'Premium mystery experience. 10-15 booster packov + 3 rare+ karty + 1 garantovaná Ultra Rare + exclusive sleeve set. 25% šanca na graded kartu.', 'mystery-box', 7999, 20, NULL, '', NULL, NULL, TRUE, 'Gold')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('mystery-box-platinum', 'Platinum Mystery Box', 'High-end mystery box. Kompletný booster box + 5 rare+ kariet + 2 Ultra Rare/SIR + 1 graded karta PSA 9/10 + exclusive portfolio.', 'mystery-box', 14999, 10, NULL, '', NULL, NULL, TRUE, 'Platinum')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, description, category, price, stock, rarity, img_url, set_name, psa_grade, is_mystery_box, mystery_tier)
VALUES ('mystery-box-diamond', 'Diamond Mystery Box', 'Ultimate collector''s experience. 2 booster boxy + 10 rare+ kariet + 3 SIR + 2 graded (aspoň 1x PSA 10) + VIP Diamond Club na 3 mesiace.', 'mystery-box', 29999, 5, NULL, '', NULL, NULL, TRUE, 'Diamond')
ON CONFLICT (slug) DO NOTHING;
