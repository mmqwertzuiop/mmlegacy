# Pokemon TCG E-shop — Backend Setup

**Supabase projekt:** `jnwtcstrfhmvopqdnzog`
**URL:** `https://jnwtcstrfhmvopqdnzog.supabase.co`
**Región:** eu-north-1
**DB verzia:** PostgreSQL 17.6

---

## Tabuľky a ich účel

### `profiles`
Rozširuje `auth.users` o verejný profil. Auto-vytvorená triggerom pri registrácii.
- `id` — FK na `auth.users`
- `username` — unikátne meno, default = časť emailu pred @
- `avatar_url` — URL avatara
- `joined_at` — dátum registrácie

### `products`
Hlavný katalóg produktov (51 položiek).
- `slug` — URL-friendly identifikátor (unikátny)
- `category` — `booster-box | psa-graded | singles | collection-box | mystery-box`
- `price` — v centoch (napr. 14999 = 149.99€)
- `stock` — počet kusov na sklade
- `rarity` — vzácnosť karty (NULL pre boxy)
- `img_url` — pokemontcg.io hires URL
- `set_name` — názov setu
- `psa_grade` — PSA skóre 1-10 (len pre `psa-graded`)
- `is_mystery_box` — boolean flag
- `mystery_tier` — FK na `mystery_box_tiers`

### `mystery_box_tiers`
Definuje 5 úrovní mystery boxov.
- `name` — Bronze / Silver / Gold / Platinum / Diamond
- `price` — cena v centoch
- `min_value` / `max_value` — garantovaný rozsah hodnoty obsahu
- `possible_cards` — JSONB pole typov kariet v boxe

### `orders`
Objednávky zákazníkov.
- `user_id` — FK na auth.users
- `items` — JSONB snapshot produktov v čase objednávky (cena, názov, qty)
- `total` — celková suma v centoch
- `status` — `pending | paid | processing | shipped | delivered | cancelled | refunded`
- Trigger `on_order_paid` → automaticky udeľuje loyalty body a znižuje sklad

### `order_items`
Riadky objednávky — relačná väzba.
- `order_id` / `product_id` / `quantity` / `price` (snapshot ceny)

### `loyalty_levels`
5 úrovní vernostného programu.
| Level    | Min body | Max body | Zľava | Free shipping |
|----------|----------|----------|-------|---------------|
| Bronze   | 0        | 499      | 0%    | nie           |
| Silver   | 500      | 1999     | 3%    | nie           |
| Gold     | 2000     | 4999     | 5%    | nie           |
| Platinum | 5000     | 9999     | 8%    | áno           |
| Diamond  | 10000    | ∞        | 12%   | áno           |

### `loyalty_points`
Stav bodov každého zákazníka.
- `points` — aktuálny zostatok
- `total_earned` — celkovo zarobené body (nikdy neklesá)
- `level` — FK na `loyalty_levels`
- Pravidlo: 1 bod za každé 1€ (100 centov) objednávky

### `leaderboard`
View (pohľad) z `loyalty_points` + `profiles` + `loyalty_levels`.
- Zobrazuje ranking podľa bodov s RANK() window funkciou
- Verejne čitateľný

---

## API endpointy — čo treba vytvoriť

Supabase REST API (`/rest/v1/`) je dostupné automaticky pre všetky tabuľky.
Pre custom logiku treba Edge Functions alebo Next.js API routes.

### Produkty
- `GET /rest/v1/products` — zoznam všetkých produktov (s filtrami)
- `GET /rest/v1/products?slug=eq.{slug}` — detail produktu
- `GET /rest/v1/products?category=eq.{cat}&order=price.asc` — filtrovanie

### Objednávky
- `POST /api/orders/create` — vytvorenie objednávky (Edge Function)
  - overí stock, vypočíta total, vytvorí order + order_items
- `POST /api/orders/{id}/pay` — webhook zo Stripe (zmení status na paid)
- `GET /rest/v1/orders?user_id=eq.{uid}` — história objednávok (RLS filtruje)

### Mystery boxy
- `GET /rest/v1/mystery_box_tiers` — zoznam tierov
- `POST /api/mystery-box/reveal` — Edge Function: odhalí obsah boxu, vytvorí order

### Vernostný program
- `GET /rest/v1/loyalty_points?user_id=eq.{uid}` — stav bodov užívateľa
- `GET /rest/v1/leaderboard?limit=100` — top 100 leaderboard
- `GET /rest/v1/loyalty_levels` — zoznam levelov

### Profil
- `GET /rest/v1/profiles?id=eq.{uid}` — profil užívateľa
- `PATCH /rest/v1/profiles?id=eq.{uid}` — update profilu (RLS)

### Auth (cez Supabase Auth SDK)
- `POST /auth/v1/signup` — registrácia
- `POST /auth/v1/token?grant_type=password` — login
- `POST /auth/v1/logout` — logout

---

## Seed dáta — zoznam všetkých 51 produktov

### Booster Boxy (10x)

| # | Slug | Názov | Cena | Sklad |
|---|------|-------|------|-------|
| 1 | `sv-obsidian-flames-booster-box` | Obsidian Flames Booster Box | 149.99€ | 12 |
| 2 | `sv-paldea-evolved-booster-box` | Paldea Evolved Booster Box | 139.99€ | 8 |
| 3 | `sv-scarlet-violet-base-booster-box` | Scarlet & Violet Base Set Booster Box | 129.99€ | 15 |
| 4 | `sv-paradox-rift-booster-box` | Paradox Rift Booster Box | 144.99€ | 10 |
| 5 | `sv-temporal-forces-booster-box` | Temporal Forces Booster Box | 134.99€ | 7 |
| 6 | `sv-twilight-masquerade-booster-box` | Twilight Masquerade Booster Box | 154.99€ | 9 |
| 7 | `sv-shrouded-fable-booster-box` | Shrouded Fable Booster Box | 149.99€ | 6 |
| 8 | `sv-stellar-crown-booster-box` | Stellar Crown Booster Box | 159.99€ | 5 |
| 9 | `swsh-evolving-skies-booster-box` | Evolving Skies Booster Box | 289.99€ | 4 |
| 10 | `swsh-brilliant-stars-booster-box` | Brilliant Stars Booster Box | 189.99€ | 6 |

### PSA Graded (10x)

| # | Slug | Názov | Cena | Grade |
|---|------|-------|------|-------|
| 11 | `psa-9-charizard-ex-sir-obsidian` | Charizard ex SIR — PSA 9 | 399.99€ | 9 |
| 12 | `psa-10-umbreon-vmax-alt-art` | Umbreon VMAX Alt Art — PSA 10 | 899.99€ | 10 |
| 13 | `psa-9-rayquaza-vmax-alt-art` | Rayquaza VMAX Alt Art — PSA 9 | 549.99€ | 9 |
| 14 | `psa-10-pikachu-vmax-rainbow` | Pikachu VMAX Rainbow — PSA 10 | 349.99€ | 10 |
| 15 | `psa-9-giratina-v-full-art` | Giratina V Full Art — PSA 9 | 249.99€ | 9 |
| 16 | `psa-10-koraidon-ex-sar` | Koraidon ex SAR — PSA 10 | 199.99€ | 10 |
| 17 | `psa-9-miraidon-ex-sar` | Miraidon ex SAR — PSA 9 | 149.99€ | 9 |
| 18 | `psa-8-umbreon-vmax-regular` | Umbreon VMAX Regular — PSA 8 | 129.99€ | 8 |
| 19 | `psa-10-charizard-vstar` | Charizard VSTAR Rainbow — PSA 10 | 299.99€ | 10 |
| 20 | `psa-9-arceus-vstar` | Arceus VSTAR Rainbow — PSA 9 | 199.99€ | 9 |

### Singles — Rare / Ultra Rare (21x)

| # | Slug | Názov | Cena | Rarity |
|---|------|-------|------|--------|
| 21 | `single-charizard-ex-sir-obsidian` | Charizard ex SIR (Obsidian Flames) | 249.99€ | Special Illustration Rare |
| 22 | `single-umbreon-vmax-alt-art` | Umbreon VMAX Alt Art (Evolving Skies) | 599.99€ | Alt Art |
| 23 | `single-rayquaza-vmax-alt-art` | Rayquaza VMAX Alt Art (Evolving Skies) | 349.99€ | Alt Art |
| 24 | `single-pikachu-vmax-rainbow` | Pikachu VMAX Rainbow (Vivid Voltage) | 199.99€ | Rainbow Rare |
| 25 | `single-giratina-v-full-art` | Giratina V Full Art (Lost Origin) | 149.99€ | Full Art |
| 26 | `single-koraidon-ex-sar` | Koraidon ex SAR (S&V Base) | 89.99€ | Special Art Rare |
| 27 | `single-miraidon-ex-sar` | Miraidon ex SAR (S&V Base) | 79.99€ | Special Art Rare |
| 28 | `single-umbreon-vmax-regular` | Umbreon VMAX Regular (Evolving Skies) | 49.99€ | VMAX Rare |
| 29 | `single-charizard-vstar-rainbow` | Charizard VSTAR Rainbow (Brilliant Stars) | 179.99€ | Rainbow Rare |
| 30 | `single-arceus-vstar-rainbow` | Arceus VSTAR Rainbow (Brilliant Stars) | 119.99€ | Rainbow Rare |
| 31 | `single-lugia-vstar-alt-art` | Lugia VSTAR Alt Art (Silver Tempest) | 399.99€ | Alt Art |
| 32 | `single-mew-vmax-alt-art` | Mew VMAX Alt Art (Fusion Strike) | 299.99€ | Alt Art |
| 33 | `single-glaceon-vmax-alt-art` | Glaceon VMAX Alt Art (Evolving Skies) | 249.99€ | Alt Art |
| 34 | `single-leafeon-vmax-alt-art` | Leafeon VMAX Alt Art (Evolving Skies) | 199.99€ | Alt Art |
| 35 | `single-espeon-vmax-alt-art` | Espeon VMAX Alt Art (Evolving Skies) | 229.99€ | Alt Art |
| 36 | `single-sylveon-vmax-alt-art` | Sylveon VMAX Alt Art (Evolving Skies) | 179.99€ | Alt Art |
| 37 | `single-giratina-vstar-alt-art` | Giratina VSTAR Alt Art (Lost Origin) | 449.99€ | Alt Art |
| 38 | `single-mewtwo-v-union` | Mewtwo V-UNION (Celebrations) | 89.99€ | Special Card |
| 39 | `single-roaring-moon-ex-sar` | Roaring Moon ex SAR (Paradox Rift) | 99.99€ | Special Art Rare |
| 40 | `single-iron-valiant-ex-sar` | Iron Valiant ex SAR (Paradox Rift) | 89.99€ | Special Art Rare |
| 41 | `single-iono-full-art` | Iono Full Art Trainer (Paldea Evolved) | 69.99€ | Full Art Trainer |

### Collection Boxy (5x)

| # | Slug | Názov | Cena | Sklad |
|---|------|-------|------|-------|
| 42 | `collection-box-charizard-ex-premium` | Charizard ex Premium Collection Box | 89.99€ | 15 |
| 43 | `collection-box-paldean-fates` | Paldean Fates Elite Trainer Box | 74.99€ | 20 |
| 44 | `collection-box-evolving-skies-etb` | Evolving Skies ETB (Umbreon edícia) | 99.99€ | 8 |
| 45 | `collection-box-151-etb` | Pokemon 151 Elite Trainer Box | 69.99€ | 18 |
| 46 | `collection-box-celebrations-ultra-premium` | Celebrations Ultra Premium Collection | 249.99€ | 3 |

### Mystery Boxy (5x)

| # | Slug | Tier | Cena | Garantovaná hodnota | Sklad |
|---|------|------|------|---------------------|-------|
| 47 | `mystery-box-bronze` | Bronze | 19.99€ | 20–50€ | 50 |
| 48 | `mystery-box-silver` | Silver | 39.99€ | 45–100€ | 30 |
| 49 | `mystery-box-gold` | Gold | 79.99€ | 90–200€ | 20 |
| 50 | `mystery-box-platinum` | Platinum | 149.99€ | 175–400€ | 10 |
| 51 | `mystery-box-diamond` | Diamond | 299.99€ | 350–1000€ | 5 |

---

## Migračné súbory

Umiestnenie: `supabase/migrations/`

| Súbor | Popis |
|-------|-------|
| `20260313000001_initial_schema.sql` | Schéma — všetky tabuľky, indexy, RLS politiky, triggery, view |
| `20260313000002_seed_data.sql` | Seed dáta — loyalty levels, mystery tiers, 51 produktov |

---

## Poznámky k implementácii

- **Ceny sú v centoch** — vždy integer, nikdy float. Na frontend delíme 100.
- **RLS je aktívne** na `profiles`, `orders`, `order_items`, `loyalty_points`.
- **Trigger `on_auth_user_created`** auto-vytvorí profil pri každej registrácii.
- **Trigger `on_order_paid`** pri zmene statusu na `paid`:
  - Udelí loyalty body (1 bod / 1€)
  - Aktualizuje level zákazníka
  - Zníži stock produktov
- **Leaderboard** je VIEW, nie materialized view — real-time, ale pomalší pri veľkom počte užívateľov. Pri 1000+ users zvážiť materialized view s refresh.
- **Mystery box ceny** majú 5 tierov zodpovedajúcich 5 mystery_box_tiers záznamom.
- **PSA grade** uložený len pre `psa-graded` produkty, ostatné majú NULL.

---

## Image URLs (pokemontcg.io)

Formát: `https://images.pokemontcg.io/{set-id}/{card-number}_hires.png`

Kľúčové sety:
- `sv3pt5` — Obsidian Flames (151)
- `sv1` — Scarlet & Violet Base
- `sv2` — Paldea Evolved
- `sv4` — Paradox Rift
- `swsh7` — Evolving Skies
- `swsh9` — Brilliant Stars
- `swsh12` — Lost Origin
- `swsh12pt5` — Silver Tempest
- `swsh8` — Fusion Strike
- `cel25` — Celebrations
