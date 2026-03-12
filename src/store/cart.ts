'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, ShopProduct } from '@/types/shop'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: ShopProduct, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  total: () => number
  totalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.quantity + quantity,
                        product.stock_quantity
                      ),
                    }
                  : item
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { product, quantity: Math.min(quantity, product.stock_quantity) },
            ],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.min(quantity, item.product.stock_quantity),
                }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      total: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price_cents * item.quantity,
          0
        )
      },

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'pullempire-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
