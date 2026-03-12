import type { Database } from './database'

// ─── DB row typy priamo z Database ───────────────────────────────────────────

export type ShopCategoryRow =
  Database['public']['Tables']['shop_categories']['Row']

export type ShopProductRow =
  Database['public']['Tables']['shop_products']['Row']

export type CartItemRow =
  Database['public']['Tables']['shop_cart_items']['Row']

export type ShopOrderRow =
  Database['public']['Tables']['shop_orders']['Row']

export type ShopOrderItemRow =
  Database['public']['Tables']['shop_order_items']['Row']

// ─── Frontend typy (zachovane pre Lukasa) ────────────────────────────────────

export type Category =
  | 'booster-box'
  | 'balicky'
  | 'psa-graded'
  | 'singles'
  | 'accessories'

/** Hlavny typ produktu pre UI (kompatibilny s DB Row + frontend pouzitim) */
export interface ShopProduct {
  id: string
  slug: string
  name: string
  description: string
  category_slug: Category
  price_cents: number
  stock_quantity: number
  images: string[]
  is_active: boolean
  metadata?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

/** CartItem pre UI (s produktom embednutym) */
export interface CartItem {
  product: ShopProduct
  quantity: number
}

/** CartItem z DB (riadok v shop_cart_items) */
export type DbCartItem = CartItemRow

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'popular'

export const CATEGORY_LABELS: Record<Category | 'all', string> = {
  all: 'Vsetko',
  'booster-box': 'Booster Boxy',
  balicky: 'Balicky',
  'psa-graded': 'PSA Graded',
  singles: 'Singles',
  accessories: 'Accessories',
}

// ─── Typy pre API a objednavky ────────────────────────────────────────────────

/** Filtrovanie produktov */
export interface ProductFilters {
  category_slug?: string
  search?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'name_asc'
  page?: number
  limit?: number
}

/** Shipping adresa */
export interface ShippingAddress {
  first_name: string
  last_name: string
  email: string
  phone: string
  street: string
  city: string
  postal_code: string
  country: string
}

/** Vstup pre vytvorenie objednavky */
export interface CreateOrderInput {
  items: Array<{
    product_id: string
    quantity: number
    price_cents: number
  }>
  shipping_address: ShippingAddress
  notes?: string
}

/** Paginated response */
export interface PaginatedProducts {
  data: ShopProduct[]
  meta: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

// ─── Helpery ─────────────────────────────────────────────────────────────────

export function getStockStatus(quantity: number): StockStatus {
  if (quantity === 0) return 'out-of-stock'
  if (quantity <= 3) return 'low-stock'
  return 'in-stock'
}

export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',') + ' \u20ac'
}
