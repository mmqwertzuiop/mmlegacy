/**
 * Seed script — Pokemon TCG produkty pre mmlegacy e-shop
 *
 * Spustenie:
 *   npx tsx scripts/seed-products.ts
 *
 * Vyžaduje .env.local s:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Pred spustením je potrebné spustiť SQL migráciu:
 *   supabase/migrations/20260312_shop_schema.sql
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/database'

// ─── Env ─────────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('NEXT_PUBLIC_SUPABASE_URL alebo SUPABASE_SERVICE_ROLE_KEY nie su nastavene.')
  console.error('Skopiruj .env.local a doplň reálne hodnoty.')
  process.exit(1)
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE)

const PLACEHOLDER = 'https://placehold.co/400x560/1a1a2e/f5c842?text=Pokemon'

// ─── Seed dáta ────────────────────────────────────────────────────────────────

type ProductInsert = Database['public']['Tables']['shop_products']['Insert']

const products: ProductInsert[] = [
  // ── Booster Boxy ──────────────────────────────────────────────────────────
  {
    slug: 'sv01-scarlet-violet-booster-box',
    name: 'Scarlet & Violet Booster Box',
    description:
      'Originálny Booster Box z prvej serie Scarlet & Violet. Obsahuje 36 booster packov, každý s 10 kartami vrátane minimálne 1 holo rare. Skvelá investícia alebo darček pre každého zberateľa.',
    category_slug: 'booster-box',
    price_cents: 4999,
    stock_quantity: 15,
    images: [PLACEHOLDER],
    metadata: { set_code: 'SV01', language: 'EN', cards_per_pack: 10, packs_per_box: 36 },
    is_active: true,
  },
  {
    slug: 'sv02-paldea-evolved-booster-box',
    name: 'Paldea Evolved Booster Box',
    description:
      'Booster Box z Paldea Evolved setu s populárnymi ex kartami. 36 packov, skvelé šance na Rare a Ultra Rare karty vrátane Tera ex variántov.',
    category_slug: 'booster-box',
    price_cents: 5499,
    stock_quantity: 8,
    images: [PLACEHOLDER],
    metadata: { set_code: 'SV02', language: 'EN', cards_per_pack: 10, packs_per_box: 36 },
    is_active: true,
  },
  {
    slug: 'sv03-obsidian-flames-booster-box',
    name: 'Obsidian Flames Booster Box',
    description:
      'Exkluzívny Obsidian Flames set s tematikou Charizard ex. Obsahuje Tera Charizard ex ako chase kartu. Limitované množstvo na sklade.',
    category_slug: 'booster-box',
    price_cents: 5299,
    stock_quantity: 5,
    images: [PLACEHOLDER],
    metadata: { set_code: 'SV03', language: 'EN', cards_per_pack: 10, packs_per_box: 36 },
    is_active: true,
  },
  // ── Balíčky ───────────────────────────────────────────────────────────────
  {
    slug: 'elite-trainer-box-sv',
    name: 'Elite Trainer Box Scarlet & Violet',
    description:
      'Elite Trainer Box obsahuje 9 booster packov, sleeves, dividers, energy karty a collector box. Ideálny štartovací set alebo darček.',
    category_slug: 'balicky',
    price_cents: 4499,
    stock_quantity: 10,
    images: [PLACEHOLDER],
    metadata: { set_code: 'SV01', contents: ['9x booster', 'sleeves', 'dividers', 'energy cards'] },
    is_active: true,
  },
  {
    slug: 'build-and-battle-box',
    name: 'Build & Battle Box',
    description:
      'Build & Battle Box — skvelý pre začiatočníkov. Obsahuje 4 booster packy a pre-built 40-kartový deck. Hraj ihneď po otvorení!',
    category_slug: 'balicky',
    price_cents: 1999,
    stock_quantity: 20,
    images: [PLACEHOLDER],
    metadata: { contents: ['4x booster', '40-card deck', 'playmat'] },
    is_active: true,
  },
  {
    slug: 'paldea-evolved-etb',
    name: 'Elite Trainer Box Paldea Evolved',
    description:
      'ETB z Paldea Evolved setu. 9 booster packov plus kompletné príslušenstvo pre hráčov a zberateľov. Zahrnuje exkluzívnu promo kartu.',
    category_slug: 'balicky',
    price_cents: 4799,
    stock_quantity: 7,
    images: [PLACEHOLDER],
    metadata: { set_code: 'SV02', contents: ['9x booster', 'promo card', 'sleeves'] },
    is_active: true,
  },
  {
    slug: 'obsidian-flames-etb',
    name: 'Elite Trainer Box Obsidian Flames',
    description:
      'ETB z Obsidian Flames setu s Charizard tematikou. Exkluzívna jumbo promo karta Charizard ex priložená. Výborne hodnotené fanúšikmi.',
    category_slug: 'balicky',
    price_cents: 5199,
    stock_quantity: 4,
    images: [PLACEHOLDER],
    metadata: { set_code: 'SV03', contents: ['9x booster', 'jumbo promo', 'sleeves', 'dividers'] },
    is_active: true,
  },
  // ── PSA Graded ────────────────────────────────────────────────────────────
  {
    slug: 'charizard-ex-psa-10',
    name: 'Charizard ex (SV03) — PSA 10 GEM MINT',
    description:
      'Charizard ex z Obsidian Flames v perfektnom PSA 10 GEM MINT stave. Jedna z najhľadanejších kariet sezóny. Certifikát PSA priložený.',
    category_slug: 'psa-graded',
    price_cents: 29999,
    stock_quantity: 1,
    images: [PLACEHOLDER],
    metadata: { psa_grade: 10, cert_number: 'PSA-XXXXXXXX', set: 'SV03', card_number: '228/197' },
    is_active: true,
  },
  {
    slug: 'pikachu-vmax-psa-9',
    name: 'Pikachu VMAX (SWSH045) — PSA 9 MINT',
    description:
      'Promo Pikachu VMAX v PSA 9 MINT grade. Ikonická karta vo vynikajúcom stave. Skvelá pre zberateľov aj investorov.',
    category_slug: 'psa-graded',
    price_cents: 8999,
    stock_quantity: 2,
    images: [PLACEHOLDER],
    metadata: { psa_grade: 9, cert_number: 'PSA-YYYYYYYY', set: 'SWSH Promo', card_number: 'SWSH045' },
    is_active: true,
  },
  {
    slug: 'miraidon-ex-sar-psa-10',
    name: 'Miraidon ex SAR (SV01) — PSA 10 GEM MINT',
    description:
      'Special Art Rare Miraidon ex z prvého SV setu, PSA 10 certifikovaná. Jedna z vizuálne najkrajších kariet generácie.',
    category_slug: 'psa-graded',
    price_cents: 15999,
    stock_quantity: 1,
    images: [PLACEHOLDER],
    metadata: { psa_grade: 10, cert_number: 'PSA-ZZZZZZZZ', set: 'SV01', card_number: '253/198', variant: 'SAR' },
    is_active: true,
  },
  // ── Singles ───────────────────────────────────────────────────────────────
  {
    slug: 'charizard-ex-rr-sv03',
    name: 'Charizard ex RR (SV03) — Double Rare',
    description:
      'Charizard ex z Obsidian Flames v Double Rare variante. Near Mint stav, priamo z booster packu. Populárna kompetitívna karta.',
    category_slug: 'singles',
    price_cents: 4999,
    stock_quantity: 8,
    images: [PLACEHOLDER],
    metadata: { set: 'SV03', card_number: '125/197', rarity: 'Double Rare', condition: 'NM' },
    is_active: true,
  },
  {
    slug: 'mewtwo-ex-sv01',
    name: 'Mewtwo ex (SV01) — Double Rare',
    description:
      'Legendarny Mewtwo ex zo základného SV setu. Silná kompetitívna karta, Near Mint stav.',
    category_slug: 'singles',
    price_cents: 2999,
    stock_quantity: 15,
    images: [PLACEHOLDER],
    metadata: { set: 'SV01', rarity: 'Double Rare', condition: 'NM' },
    is_active: true,
  },
  {
    slug: 'tera-staraptor-ex-sv02',
    name: 'Tera Staraptor ex (SV02)',
    description:
      'Populárna Tera Staraptor ex karta z Paldea Evolved. Kompetitívna karta pre Bird deck buildy. Near Mint.',
    category_slug: 'singles',
    price_cents: 1299,
    stock_quantity: 25,
    images: [PLACEHOLDER],
    metadata: { set: 'SV02', rarity: 'Double Rare', condition: 'NM' },
    is_active: true,
  },
  {
    slug: 'miraidon-ex-sv01',
    name: 'Miraidon ex (SV01)',
    description:
      'Hlavný legendárny Pokemon generácie Scarlet & Violet. Základná karta pre Miraidon ex deck. Near Mint.',
    category_slug: 'singles',
    price_cents: 999,
    stock_quantity: 30,
    images: [PLACEHOLDER],
    metadata: { set: 'SV01', rarity: 'Double Rare', condition: 'NM' },
    is_active: true,
  },
  // ── Accessories ───────────────────────────────────────────────────────────
  {
    slug: 'kmc-perfect-sleeves-100',
    name: 'KMC Perfect Size Sleeves (100ks)',
    description:
      'KMC Perfect Size inner sleeves — najobľúbenejší inner sleeve pre double-sleeving. 100 kusov, číry, japonská kvalita.',
    category_slug: 'accessories',
    price_cents: 799,
    stock_quantity: 50,
    images: [PLACEHOLDER],
    metadata: { brand: 'KMC', quantity: 100, type: 'inner-sleeve', color: 'clear' },
    is_active: true,
  },
  {
    slug: 'ultra-pro-binder-9-pocket',
    name: 'Ultra PRO 9-Pocket Binder',
    description:
      'Ultra PRO 9-pocket binder na 360 kariet. Pevná väzba, ochranné vrecúška. Ideálny pre organizáciu zbierky.',
    category_slug: 'accessories',
    price_cents: 1499,
    stock_quantity: 20,
    images: [PLACEHOLDER],
    metadata: { brand: 'Ultra PRO', capacity: 360, pockets: 9, binding: 'side-loading' },
    is_active: true,
  },
  {
    slug: 'card-pro-toploader-100',
    name: 'Card-Pro Toploader 3x4" (100ks)',
    description:
      'Štandardné toploaders pre ochranu kariet. 100 kusov, 35pt hrúbka. Vhodné pre všetky štandardné TCG karty.',
    category_slug: 'accessories',
    price_cents: 999,
    stock_quantity: 40,
    images: [PLACEHOLDER],
    metadata: { brand: 'Card-Pro', quantity: 100, thickness_pt: 35, size: '3x4"' },
    is_active: true,
  },
  {
    slug: 'dragon-shield-matte-sleeves',
    name: 'Dragon Shield Matte Sleeves (100ks)',
    description:
      'Dragon Shield Matte outer sleeves — štandard pre kompetitívnych hráčov. Anti-glare matný povrch, 100 kusov. Dostupné vo viacerých farbách.',
    category_slug: 'accessories',
    price_cents: 899,
    stock_quantity: 35,
    images: [PLACEHOLDER],
    metadata: { brand: 'Dragon Shield', quantity: 100, finish: 'matte', color: 'black' },
    is_active: true,
  },
]

// ─── Seed funkcia ─────────────────────────────────────────────────────────────

async function seed() {
  console.log('Zacinam seed Pokemon produktov...')
  console.log(`Celkovo produktov: ${products.length}`)

  let inserted = 0
  let skipped  = 0

  for (const product of products) {
    const { error } = await supabase
      .from('shop_products')
      .upsert(product, { onConflict: 'slug', ignoreDuplicates: false })

    if (error) {
      console.error(`CHYBA pri ${product.slug}: ${error.message}`)
    } else {
      console.log(`  OK: ${product.name} (${product.slug})`)
      inserted++
    }
  }

  console.log('\nSeed dokonceny.')
  console.log(`  Vkladanych/aktualizovanych: ${inserted}`)
  console.log(`  Preskocených: ${skipped}`)

  // Verifikácia
  const { count } = await supabase
    .from('shop_products')
    .select('*', { count: 'exact', head: true })

  console.log(`  Celkovo produktov v DB: ${count}`)
}

seed().catch((err) => {
  console.error('Seed zlyhal:', err)
  process.exit(1)
})
