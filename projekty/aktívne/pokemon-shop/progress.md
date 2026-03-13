# Pokemon Shop — Progress Log

## Fáza 1: Research + Texty + DB — HOTOVO
- [x] Adam — research.md
- [x] Zuzana — texts.md
- [x] Martin — Supabase DB setup + seed dáta

## Fáza 2: Frontend (Lukáš) — HOTOVO
- [x] Next.js projekt, design system
- [x] Homepage + hero 3D
- [x] Všetky stránky

## Fáza 3: Backend napojenie (Martin) — HOTOVO
- [x] Supabase credentials v .env.local
- [x] Produktová dáta v src/data/products.ts (51 produktov)

## Fáza 4: QA (Tomáš) — 5x kontrola — KOMPLETNÉ

### Kolo 1 — Štruktúra a súbory ✅ PASS

| Kontrola | Výsledok |
|---|---|
| .next/ build priečinok | EXISTS — build prebehol úspešne |
| .env.local — Supabase credentials | NEXT_PUBLIC_SUPABASE_URL + ANON_KEY prítomné |
| next.config.ts — images.pokemontcg.io | remotePatterns obsahuje `images.pokemontcg.io` |
| package.json — framer-motion | ^12.36.0 ✓ |
| package.json — @supabase/supabase-js | ^2.99.1 ✓ |
| Všetky page.tsx súbory | /, /shop, /shop/[slug], /shop/booster-boxy, /shop/graded, /shop/singles, /shop/collection-boxy, /mystery-boxy, /kosik, /checkout, /login, /register, /profil — všetky existujú |
| Komponenty | Navbar, Footer, ProductCard, ProductGrid, CategoryFilter, CartButton, CountdownTimer, MysteryBoxCard, RarityBadge, CustomCursor — všetky prítomné |

---

### Kolo 2 — HTTP odpovede ✅ PASS

Testované cez `curl -s -o /dev/null -w "%{http_code}"`:

| Stránka | HTTP kód |
|---|---|
| / | 200 ✓ |
| /shop | 200 ✓ |
| /shop/booster-boxy | 200 ✓ |
| /shop/graded | 200 ✓ |
| /shop/singles | 200 ✓ |
| /shop/collection-boxy | 200 ✓ |
| /mystery-boxy | 200 ✓ |
| /kosik | 200 ✓ |
| /checkout | 200 ✓ |
| /login | 200 ✓ |
| /register | 200 ✓ |
| /profil | 200 ✓ |

Všetky stránky vracajú HTTP 200. Žiadne 404 ani 500.

---

### Kolo 3 — Obsah stránok ✅ PASS

**Homepage (/):**
- Hero text "ZBIERAJ LEGENDY. VLASTNI HISTÓRIU." — PRÍTOMNÝ ✓
- Hero card fan (6 Pokemon kariet s tilt efektom) — PRÍTOMNÝ ✓
- CountdownTimer komponent (client-side, JS-rendered) — PRÍTOMNÝ v kóde ✓
- Featured products sekcia (4 vybrané produkty) — PRÍTOMNÁ ✓
- Mystery boxy sekcia (5 tierov) — PRÍTOMNÁ ✓
- Loyalty program / XP bar — PRÍTOMNÝ ✓
- Leaderboard "WALL OF LEGENDS" — PRÍTOMNÝ ✓
- CTA sekcia — PRÍTOMNÁ ✓

**Poznámka k Countdown:** Komponent je `'use client'` s `useState` — renderuje sa client-side po hydratácii, preto nie je v statickom HTML servera. Toto je správne Next.js správanie.

**Shop (/shop):**
- Filter sidebar (CategoryFilter) — PRÍTOMNÝ ✓
- ProductGrid so zoradením — PRÍTOMNÝ ✓
- 51 produktov zobrazených — PRÍTOMNÉ ✓

**Mystery boxy (/mystery-boxy):**
- Bronze tier — PRÍTOMNÝ ✓
- Silver tier — PRÍTOMNÝ ✓
- Gold tier — PRÍTOMNÝ ✓
- Platinum tier — PRÍTOMNÝ ✓
- Diamond tier — PRÍTOMNÝ ✓
- Flip animácia na každej karte — IMPLEMENTOVANÁ ✓
- Countdown timer — PRÍTOMNÝ ✓
- "Predošlé otvárania" sekcia — PRÍTOMNÁ ✓

**Profil (/profil):**
- XP progress bar — PRÍTOMNÝ ✓ (2400/5000 XP, zlatá farba)
- Historia objednávok — PRÍTOMNÁ ✓
- Collector's Club levely — PRÍTOMNÉ ✓

---

### Kolo 4 — Product detail stránky ✅ PASS

Testované reálne slugy z PRODUCTS dát:

| URL | HTTP kód |
|---|---|
| /shop/sv-obsidian-flames-booster-box | 200 ✓ |
| /shop/psa-10-umbreon-vmax-alt-art | 200 ✓ |
| /shop/single-umbreon-vmax-alt-art | 200 ✓ |
| /shop/mystery-box-bronze | 200 ✓ |
| /shop/collection-box-charizard-ex-premium | 200 ✓ |
| /shop/sv-prismatic-evolutions-booster-box | 200 ✓ |

**Poznámka:** Slugy ako `/shop/charizard-ex-sir` vracajú 404 — správne, tieto slugy v databáze neexistujú. Skutočné slugy (napr. `single-charizard-ex-sir-obsidian`) fungujú správne. Systém `generateStaticParams` generuje len slugy z PRODUCTS, čo je správna implementácia.

---

### Kolo 5 — Finálna kontrola kvality ✅ PASS

**globals.css — CSS variables:**
- `--void: #080808` ✓
- `--gold: #F59E0B` ✓
- `--orange: #FA5D29` ✓
- `--purple: #8B5CF6` ✓
- `--green: #22C55E` ✓
- Holografický efekt `.card-holo` ✓
- Rarity farby (.rarity-sir, .rarity-rainbow, atd.) ✓

**Navbar:**
- Logo MMLEGACY s orange akcentom ✓
- Nav links (BOOSTER BOXY, PSA GRADED, SINGLES, MYSTERY, VŠETKO) ✓
- Košík ikonka s count badge ✓
- LOGIN link ✓
- Mobile menu ✓

**Footer:**
- Copyright "© 2026 MM Legacy" ✓
- Shop links (Booster Boxy, PSA Graded, Single Karty, Collection Boxy, Mystery Boxy) ✓
- Account links (Prihlásenie, Registrácia, Môj profil, Košík) ✓
- Newsletter form ✓

**ProductCard:**
- Tilt efekt (perspective rotateX/rotateY) ✓
- Rarity badge komponent ✓
- PSA grade badge (zlatý pre PSA 10) ✓
- Holografický overlay pre graded karty ✓
- "POSLEDNÝCH X" low stock warning ✓
- "VYPREDANÉ" sold out overlay ✓

**Dizajnová konzistencia:**
- Tmavý dizajn (--void #080808) na všetkých stránkach ✓
- Orange akcentná farba konzistentná ✓
- Bebas Neue pre nadpisy, Inter Tight pre telo, Space Mono pre labels ✓
- Prémiový look — minimalistický, čierny, gold accents ✓

---

## Fáza 5: Finálna kontrola (Viktor) → report MM

### FINAL PASS ✅

**Dátum testovania:** 2026-03-13
**QA tester:** Tomáš

**Zhrnutie:**
Všetkých 5 kôl QA testovania prebehlo úspešne. E-shop je funkčný, kompletný a spĺňa všetky požadované kritériá.

**Splnené podmienky pre FINAL PASS:**
- ✅ Všetky stránky vracajú HTTP 200 (12/12 stránok)
- ✅ Homepage má hero (ZBIERAJ LEGENDY), produkty (FEATURED), countdown (client-side), mystery boxy (5 tierov)
- ✅ Shop má filter sidebar (CategoryFilter) a produktové karty (51 produktov)
- ✅ Mystery boxy stránka má všetkých 5 tierov (Bronze, Silver, Gold, Platinum, Diamond)
- ✅ Product detail stránky fungujú (6/6 testovaných reálnych slugov — HTTP 200)
- ✅ Design je konzistentný — tmavý, prémiový, orange/gold accenty, holografické efekty

**Žiadne kritické chyby nenájdené.**

Projekt je pripravený na review Viktora a prezentáciu MM.
