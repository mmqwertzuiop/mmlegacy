export interface Product {
  id: string
  slug: string
  name: string
  description?: string
  category: 'booster-box' | 'psa-graded' | 'singles' | 'collection-box' | 'mystery-box'
  price: number // in cents
  stock: number
  rarity?: string
  img_url: string
  set_name?: string
  psa_grade?: number
  is_mystery_box?: boolean
  mystery_tier?: string
  active?: boolean
  created_at?: string
  updated_at?: string
}

export interface MysteryBoxTier {
  id: string
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  price: number
  min_value: number
  max_value: number
  possible_cards: string[]
  color: string
  bonus_chance: number
  description: string
}

export interface LoyaltyLevel {
  id: string
  name: string
  min_points: number
  max_points: number | null
  discount: number
  free_shipping: boolean
  color: string
}

export interface LoyaltyPoints {
  id: string
  user_id: string
  points: number
  total_earned: number
  level: string
}

export interface LeaderboardEntry {
  rank: number
  username: string
  avatar_url?: string
  points: number
  level: string
  level_color: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  user_id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  created_at: string
}
