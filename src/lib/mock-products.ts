import type { ShopProduct, Category } from '@/types/shop'
export type { Category }

export const MOCK_PRODUCTS: ShopProduct[] = [
  // --- Booster Boxy ---
  {
    id: '1',
    slug: 'sv-scarlet-violet-booster-box',
    name: 'Scarlet & Violet Booster Box',
    description:
      'Oficialny Booster Box obsahujuci 36 booster packov zo setu Scarlet & Violet. Kazdy pack obsahuje 10 karet vratane minimalnie 1 rare. Idealne pre zberateli aj hracov.',
    category_slug: 'booster-box',
    price_cents: 14999,
    stock_quantity: 8,
    images: [
      'https://images.pokemontcg.io/sv1/en_US/booster.png',
      'https://images.pokemontcg.io/sv1/en_US/logo.png',
    ],
    is_active: true,
  },
  {
    id: '2',
    slug: 'paradox-rift-booster-box',
    name: 'Paradox Rift Booster Box',
    description:
      '36 booster packov z popularneho setu Paradox Rift. Obsahuje Ancient a Future typy karet. Vysoko ziadane pre ultra rare ex a tera karty.',
    category_slug: 'booster-box',
    price_cents: 16999,
    stock_quantity: 3,
    images: [
      'https://images.pokemontcg.io/sv4/en_US/booster.png',
      'https://images.pokemontcg.io/sv4/en_US/logo.png',
    ],
    is_active: true,
  },
  {
    id: '3',
    slug: 'temporal-forces-booster-box',
    name: 'Temporal Forces Booster Box',
    description:
      'Booster Box z najnovsieho setu Temporal Forces. 36 packov s ACE SPEC kartami a novymi ex Pokemon. Limitovana dostupnost.',
    category_slug: 'booster-box',
    price_cents: 18499,
    stock_quantity: 5,
    images: [
      'https://images.pokemontcg.io/sv5/en_US/booster.png',
    ],
    is_active: true,
  },
  {
    id: '4',
    slug: 'obsidian-flames-booster-box',
    name: 'Obsidian Flames Booster Box',
    description:
      'Obsidian Flames - set s prvymi Tera Type kartami pre Charizard ex. 36 booster packov. Jeden z najpopularnejsich setov roku 2023.',
    category_slug: 'booster-box',
    price_cents: 17499,
    stock_quantity: 0,
    images: [
      'https://images.pokemontcg.io/sv3/en_US/booster.png',
    ],
    is_active: true,
  },
  // --- Balicky (Elite Trainer Box / Theme Deck) ---
  {
    id: '5',
    slug: 'sv-elite-trainer-box-koraidon',
    name: 'Scarlet & Violet Elite Trainer Box – Koraidon',
    description:
      'Elite Trainer Box zo setu Scarlet & Violet. Obsahuje 9 booster packov, promo kartu Koraidon ex, divider karty, dice, marky a boxove sleeves.',
    category_slug: 'balicky',
    price_cents: 5999,
    stock_quantity: 14,
    images: [
      'https://images.pokemontcg.io/sv1/en_US/logo.png',
    ],
    is_active: true,
  },
  {
    id: '6',
    slug: 'paradox-rift-etb-iron-valiant',
    name: 'Paradox Rift ETB – Iron Valiant',
    description:
      'Elite Trainer Box Paradox Rift s promo kartou Iron Valiant ex. 9 booster packov + premium prislusenstvo pre hracov a zberateli.',
    category_slug: 'balicky',
    price_cents: 6499,
    stock_quantity: 7,
    images: [
      'https://images.pokemontcg.io/sv4/en_US/logo.png',
    ],
    is_active: true,
  },
  {
    id: '7',
    slug: 'charizard-ex-super-premium-collection',
    name: 'Charizard ex Super Premium Collection',
    description:
      'Limitovana Super Premium Collection s figurkou Charizard, 7 booster packov z roznych setov, oversized promo kartou a exkluzivnymi dividermi.',
    category_slug: 'balicky',
    price_cents: 8999,
    stock_quantity: 2,
    images: [
      'https://images.pokemontcg.io/sv3pt5/en_US/logo.png',
    ],
    is_active: true,
  },
  // --- PSA Graded ---
  {
    id: '8',
    slug: 'psa-10-charizard-holo-base-set',
    name: 'Charizard Holo 1st Edition Base Set – PSA 10',
    description:
      'Legendarna 1st Edition Charizard Holo karta zo zakladneho Base Set setu, ohodnotena PSA 10 (Gem Mint). Bezchybny stav, investicna kartica. Certifikat PSA prilozen.',
    category_slug: 'psa-graded',
    price_cents: 1499900,
    stock_quantity: 1,
    images: [
      'https://images.pokemontcg.io/base1/4_hires.png',
    ],
    is_active: true,
  },
  {
    id: '9',
    slug: 'psa-9-pikachu-illustrator',
    name: 'Pikachu Illustrator Promo – PSA 9',
    description:
      'Ultra-rare Pikachu Illustrator promo karta, jedna z najvzacnejsich karet na svete. Ohodnotena PSA 9 (Mint). Originalny japonsky originál z roku 1998.',
    category_slug: 'psa-graded',
    price_cents: 8999900,
    stock_quantity: 1,
    images: [
      'https://images.pokemontcg.io/base1/58_hires.png',
    ],
    is_active: true,
  },
  {
    id: '10',
    slug: 'psa-10-rayquaza-gold-star',
    name: 'Rayquaza Gold Star – PSA 10',
    description:
      'Ikonicka Rayquaza Gold Star karta zo setu EX Deoxys, ohodnotena PSA 10 Gem Mint. Jedna z najpopularnejsich vintage karet. Investicna hodnota stale rastie.',
    category_slug: 'psa-graded',
    price_cents: 299900,
    stock_quantity: 1,
    images: [
      'https://images.pokemontcg.io/ex7/107_hires.png',
    ],
    is_active: true,
  },
  // --- Singles ---
  {
    id: '11',
    slug: 'charizard-ex-obsidian-flames-tera',
    name: 'Charizard ex (Tera) – Obsidian Flames #125',
    description:
      'Full Art Charizard ex Tera Type karta zo setu Obsidian Flames. Jedna z najziadanejsich karet roku 2023. Near Mint stav, priamo z factory sealed packu.',
    category_slug: 'singles',
    price_cents: 4999,
    stock_quantity: 6,
    images: [
      'https://images.pokemontcg.io/sv3/125_hires.png',
    ],
    is_active: true,
  },
  {
    id: '12',
    slug: 'mewtwo-ex-scarlet-violet-125',
    name: 'Mewtwo ex – Scarlet & Violet #078',
    description:
      'Mewtwo ex Double Rare karta zo zakladneho Scarlet & Violet setu. Silna karta pre competitive play aj do zbierky. Near Mint.',
    category_slug: 'singles',
    price_cents: 1299,
    stock_quantity: 12,
    images: [
      'https://images.pokemontcg.io/sv1/78_hires.png',
    ],
    is_active: true,
  },
  // --- Accessories ---
  {
    id: '13',
    slug: 'ultra-pro-9-pocket-pokemon-binder',
    name: 'Ultra Pro 9-Pocket Binder – Pokemon',
    description:
      'Oficialny Pokemon 9-vreckovkovy binder od Ultra Pro. Chrani karty pred ohybom a praskom. Kapacita 360 karet. Tvrdý obal s Pokemon ikonami.',
    category_slug: 'accessories',
    price_cents: 2999,
    stock_quantity: 25,
    images: [
      'https://images.pokemontcg.io/sv1/en_US/logo.png',
    ],
    is_active: true,
  },
  {
    id: '14',
    slug: 'dragon-shield-matte-sleeves-black',
    name: 'Dragon Shield Matte Sleeves – Black (100 ks)',
    description:
      'Prémium Dragon Shield Matte kártové sleeves v ciernej farbe. 100 kusov v balení. Standard size (63x88mm). Odporucané pre competitive Pokemon hranie.',
    category_slug: 'accessories',
    price_cents: 1199,
    stock_quantity: 50,
    images: [
      'https://images.pokemontcg.io/sv1/en_US/logo.png',
    ],
    is_active: true,
  },
  {
    id: '15',
    slug: 'ultra-pro-toploader-100ks',
    name: 'Ultra Pro Toploader 100 ks – Standard Size',
    description:
      'Rigidné toploaders pre ochranu hodnotnych karet. 100 kusov v balení, standard size 3x4 palce. Idealne pre single karty a PSA submission.',
    category_slug: 'accessories',
    price_cents: 899,
    stock_quantity: 80,
    images: [
      'https://images.pokemontcg.io/sv1/en_US/logo.png',
    ],
    is_active: true,
  },
]

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: string): ShopProduct[] {
  if (category === 'all') return MOCK_PRODUCTS.filter((p) => p.is_active)
  return MOCK_PRODUCTS.filter(
    (p) => p.category_slug === category && p.is_active
  )
}

export function getRelatedProducts(
  product: ShopProduct,
  limit = 4
): ShopProduct[] {
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.category_slug === product.category_slug &&
      p.id !== product.id &&
      p.is_active
  ).slice(0, limit)
}

export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',') + ' \u20ac'
}
