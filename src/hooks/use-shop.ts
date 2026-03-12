'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type {
  ShopProduct,
  ShopProductRow,
  CartItem,
  ProductFilters,
  CreateOrderInput,
  StockStatus,
} from '@/types/shop'
import { getStockStatus } from '@/types/shop'

// ─── useProducts ─────────────────────────────────────────────────────────────

interface UseProductsResult {
  products: ShopProduct[]
  loading: boolean
  error: string | null
  total: number
  refetch: () => void
}

export function useProducts(filters?: ProductFilters): UseProductsResult {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const page  = filters?.page  ?? 1
      const limit = filters?.limit ?? 20
      const from  = (page - 1) * limit
      const to    = from + limit - 1

      let query = supabase
        .from('shop_products')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .range(from, to)

      if (filters?.category_slug) {
        query = query.eq('category_slug', filters.category_slug)
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      switch (filters?.sort) {
        case 'price_asc':
          query = query.order('price_cents', { ascending: true })
          break
        case 'price_desc':
          query = query.order('price_cents', { ascending: false })
          break
        case 'name_asc':
          query = query.order('name', { ascending: true })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      const { data: rawData, error: dbError, count } = await query
      const data = rawData as ShopProductRow[] | null

      if (dbError) throw dbError

      // Normalizuj images z jsonb na string[]
      const normalized: ShopProduct[] = (data ?? []).map((row) => ({
        ...row,
        description: row.description ?? '',
        category_slug: (row.category_slug ?? 'accessories') as ShopProduct['category_slug'],
        images: Array.isArray(row.images)
          ? (row.images as unknown as string[])
          : [],
        metadata: row.metadata as Record<string, unknown> | undefined,
      } as ShopProduct))

      setProducts(normalized)
      setTotal(count ?? 0)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Neznama chyba'
      setError(message)
      console.error('[useProducts]', message)
    } finally {
      setLoading(false)
    }
  }, [
    filters?.category_slug,
    filters?.search,
    filters?.sort,
    filters?.page,
    filters?.limit,
  ])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, total, refetch: fetchProducts }
}

// ─── useProduct ──────────────────────────────────────────────────────────────

interface UseProductResult {
  product: ShopProduct | null
  loading: boolean
  error: string | null
  stockStatus: StockStatus
}

export function useProduct(slug: string): UseProductResult {
  const [product, setProduct] = useState<ShopProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    let cancelled = false

    const fetchProduct = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()
        const { data: rawData, error: dbError } = await supabase
          .from('shop_products')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single()
        const data = rawData as ShopProductRow | null

        if (dbError) throw dbError
        if (cancelled) return
        if (!data) return

        const normalized: ShopProduct = {
          ...data,
          description: data.description ?? '',
          category_slug: (data.category_slug ?? 'accessories') as ShopProduct['category_slug'],
          images: Array.isArray(data.images)
            ? (data.images as unknown as string[])
            : [],
        } as ShopProduct

        setProduct(normalized)
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Neznama chyba'
        setError(message)
        console.error('[useProduct]', slug, message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProduct()

    return () => {
      cancelled = true
    }
  }, [slug])

  const stockStatus = product ? getStockStatus(product.stock_quantity) : 'out-of-stock'

  return { product, loading, error, stockStatus }
}

// ─── useCart ─────────────────────────────────────────────────────────────────

interface UseCartResult {
  items: CartItem[]
  loading: boolean
  error: string | null
  totalItems: number
  subtotalCents: number
  refetch: () => void
}

export function useCart(): UseCartResult {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setItems([])
        setLoading(false)
        return
      }

      const { data, error: dbError } = await supabase
        .from('shop_cart_items')
        .select(`
          id,
          user_id,
          quantity,
          created_at,
          product:shop_products(*)
        `)
        .eq('user_id', user.id)

      if (dbError) throw dbError

      const cartItems: CartItem[] = (data ?? [])
        .filter((row) => row.product !== null)
        .map((row) => {
          const p = row.product as unknown as ShopProduct
          return {
            product: {
              ...p,
              description: p.description ?? '',
              category_slug: (p.category_slug ?? 'accessories') as ShopProduct['category_slug'],
              images: Array.isArray(p.images)
                ? (p.images as unknown as string[])
                : [],
            },
            quantity: row.quantity,
          }
        })

      setItems(cartItems)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Neznama chyba'
      setError(message)
      console.error('[useCart]', message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotalCents = items.reduce((sum, i) => sum + i.product.price_cents * i.quantity, 0)

  return { items, loading, error, totalItems, subtotalCents, refetch: fetchCart }
}

// ─── useAddToCart ─────────────────────────────────────────────────────────────

interface UseAddToCartResult {
  addToCart: (productId: string, quantity?: number) => Promise<void>
  loading: boolean
  error: string | null
}

export function useAddToCart(): UseAddToCartResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Pre pridanie do kosika sa treba prihlasit')

      const { error: dbError } = await supabase
        .from('shop_cart_items')
        .upsert(
          { user_id: user.id, product_id: productId, quantity },
          {
            onConflict: 'user_id,product_id',
            ignoreDuplicates: false,
          }
        )

      if (dbError) throw dbError
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Neznama chyba'
      setError(message)
      console.error('[useAddToCart]', message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { addToCart, loading, error }
}

// ─── useUpdateCartQty ─────────────────────────────────────────────────────────

interface UseUpdateCartQtyResult {
  updateQty: (productId: string, quantity: number) => Promise<void>
  loading: boolean
  error: string | null
}

export function useUpdateCartQty(): UseUpdateCartQtyResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateQty = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 1) return

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Neprihlaseny pouzivatel')

      const { error: dbError } = await supabase
        .from('shop_cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (dbError) throw dbError
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Neznama chyba'
      setError(message)
      console.error('[useUpdateCartQty]', message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateQty, loading, error }
}

// ─── useRemoveFromCart ────────────────────────────────────────────────────────

interface UseRemoveFromCartResult {
  removeFromCart: (productId: string) => Promise<void>
  loading: boolean
  error: string | null
}

export function useRemoveFromCart(): UseRemoveFromCartResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const removeFromCart = useCallback(async (productId: string) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Neprihlaseny pouzivatel')

      const { error: dbError } = await supabase
        .from('shop_cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (dbError) throw dbError
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Neznama chyba'
      setError(message)
      console.error('[useRemoveFromCart]', message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { removeFromCart, loading, error }
}

// ─── useCreateOrder ───────────────────────────────────────────────────────────

interface UseCreateOrderResult {
  createOrder: (input: CreateOrderInput) => Promise<{ orderId: string }>
  loading: boolean
  error: string | null
}

export function useCreateOrder(): UseCreateOrderResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = useCallback(async (input: CreateOrderInput) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? `HTTP ${res.status}`)
      }

      return { orderId: json.data.orderId }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Neznama chyba'
      setError(message)
      console.error('[useCreateOrder]', message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createOrder, loading, error }
}
