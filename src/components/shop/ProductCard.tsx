'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ShopProduct, Category, StockStatus } from '@/types/shop'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/mock-products'

interface ProductCardProps {
  product: ShopProduct
}

const CATEGORY_COLORS: Record<Category, string> = {
  'booster-box': 'bg-[#f5c842]/15 text-[#f5c842] border-[#f5c842]/30',
  balicky: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'psa-graded': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  singles: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  accessories: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
}

const CATEGORY_LABELS: Record<Category, string> = {
  'booster-box': 'Booster Box',
  balicky: 'Balicek',
  'psa-graded': 'PSA Graded',
  singles: 'Single',
  accessories: 'Accessory',
}

function getStockStatus(qty: number): StockStatus {
  if (qty === 0) return 'out-of-stock'
  if (qty <= 3) return 'low-stock'
  return 'in-stock'
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const stockStatus = getStockStatus(product.stock_quantity)
  const isOutOfStock = stockStatus === 'out-of-stock'
  const imageSrc = imgError || !product.images[0] ? null : product.images[0]

  async function handleAddToCart() {
    if (isOutOfStock) return
    setAddingToCart(true)
    addItem(product, 1)
    // brief feedback then open cart
    setTimeout(() => {
      setAddingToCart(false)
      openCart()
    }, 400)
  }

  return (
    <div
      className="card-hover group relative flex flex-col rounded-xl border border-[#1e1e2e] bg-[#111118] overflow-hidden"
      data-testid={`product-card-${product.slug}`}
    >
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-[#0d0d15]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="size-16 text-[#1e1e2e]" />
          </div>
        )}
        {/* Low stock overlay badge */}
        {stockStatus === 'low-stock' && (
          <span className="absolute top-2 left-2 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold text-black">
            Posledne {product.stock_quantity} ks
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white">
              Vypredane
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Category badge */}
        <Badge
          className={`w-fit border text-[10px] font-medium px-2 py-0.5 ${CATEGORY_COLORS[product.category_slug]}`}
        >
          {CATEGORY_LABELS[product.category_slug]}
        </Badge>

        {/* Name */}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-sm font-medium leading-snug text-[#e2e8f0] line-clamp-2 hover:text-[#f5c842] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Footer: price + stock + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#f5c842]">
              {formatPrice(product.price_cents)}
            </span>
            <span
              data-testid={`stock-status-${product.slug}`}
              className={`text-[11px] font-medium ${
                isOutOfStock
                  ? 'text-red-400'
                  : stockStatus === 'low-stock'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {isOutOfStock
                ? 'Vypredane'
                : stockStatus === 'low-stock'
                ? 'Posledne kusy'
                : 'Skladom'}
            </span>
          </div>

          <Button
            data-testid={`add-to-cart-${product.slug}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
            size="icon"
            className={`size-9 shrink-0 rounded-lg transition-all ${
              isOutOfStock
                ? 'opacity-40 cursor-not-allowed bg-[#1e1e2e]'
                : addingToCart
                ? 'bg-[#f5c842]/80 scale-90'
                : 'bg-[#f5c842] hover:bg-[#f5c842]/80 text-black'
            }`}
          >
            <ShoppingCart className="size-4" />
            <span className="sr-only">Pridat do kosika</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
