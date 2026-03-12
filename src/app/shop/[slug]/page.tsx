'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Package, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProductBySlug, getRelatedProducts, formatPrice } from '@/lib/mock-products'
import { getStockStatus } from '@/types/shop'
import { useCartStore } from '@/store/cart'
import { use } from 'react'

const CATEGORY_COLORS: Record<string, string> = {
  'booster-box': 'bg-[#f5c842]/15 text-[#f5c842] border-[#f5c842]/30',
  balicky: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'psa-graded': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  singles: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  accessories: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
}

const CATEGORY_LABELS: Record<string, string> = {
  'booster-box': 'Booster Box',
  balicky: 'Balicek',
  'psa-graded': 'PSA Graded',
  singles: 'Single',
  accessories: 'Accessory',
}

interface Props {
  params: Promise<{ slug: string }>
}

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params)
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = getRelatedProducts(product, 4)
  const stockStatus = getStockStatus(product.stock_quantity)
  const isOutOfStock = stockStatus === 'out-of-stock'

  return <ProductDetail product={product} related={related} isOutOfStock={isOutOfStock} />
}

function ProductDetail({
  product,
  related,
  isOutOfStock,
}: {
  product: NonNullable<ReturnType<typeof getProductBySlug>>
  related: ReturnType<typeof getRelatedProducts>
  isOutOfStock: boolean
}) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [imgError, setImgError] = useState(false)
  const [adding, setAdding] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const stockStatus = getStockStatus(product.stock_quantity)
  const imageSrc = imgError || !product.images[selectedImage]
    ? null
    : product.images[selectedImage]

  function handleAddToCart() {
    if (isOutOfStock) return
    setAdding(true)
    addItem(product, qty)
    setTimeout(() => {
      setAdding(false)
      openCart()
    }, 400)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[#64748b] mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#e2e8f0] transition-colors">
          Domov
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/shop" className="hover:text-[#e2e8f0] transition-colors">
          Obchod
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-[#e2e8f0] line-clamp-1 max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Image gallery */}
        <div
          className="flex flex-col gap-4"
          data-testid={`detail-gallery-${product.slug}`}
        >
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#1e1e2e] bg-[#0d0d15]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8"
                onError={() => setImgError(true)}
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="size-24 text-[#1e1e2e]" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(i)
                    setImgError(false)
                  }}
                  className={`relative size-16 rounded-xl overflow-hidden border transition-all ${
                    selectedImage === i
                      ? 'border-[#f5c842] ring-2 ring-[#f5c842]/30'
                      : 'border-[#1e1e2e] hover:border-[#f5c842]/40'
                  } bg-[#0d0d15]`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - foto ${i + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div
          className="flex flex-col gap-6"
          data-testid={`detail-info-${product.slug}`}
        >
          {/* Category + stock */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              className={`border text-[11px] font-medium px-2.5 py-1 ${
                CATEGORY_COLORS[product.category_slug] ?? 'bg-[#1e1e2e] text-[#e2e8f0]'
              }`}
            >
              {CATEGORY_LABELS[product.category_slug] ?? product.category_slug}
            </Badge>

            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                isOutOfStock
                  ? 'bg-red-500/10 text-red-400'
                  : stockStatus === 'low-stock'
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {isOutOfStock
                ? 'Vypredane'
                : stockStatus === 'low-stock'
                ? `Poslednych ${product.stock_quantity} ks`
                : `Skladom (${product.stock_quantity} ks)`}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#e2e8f0] leading-snug">
            {product.name}
          </h1>

          {/* Price */}
          <div>
            <p className="text-4xl font-bold text-[#f5c842]">
              {formatPrice(product.price_cents)}
            </p>
            <p className="text-sm text-[#64748b] mt-1">Cena vrátane DPH</p>
          </div>

          <Separator className="bg-[#1e1e2e]" />

          {/* Qty selector + Add to cart */}
          {!isOutOfStock && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium text-[#64748b] mb-2">Mnozstvo</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="size-9 rounded-lg border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-[#64748b] hover:text-[#e2e8f0] hover:border-[#f5c842]/40 transition-all disabled:opacity-30"
                    aria-label="Znizit mnozstvo"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-10 text-center text-lg font-semibold text-[#e2e8f0]">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty((q) => Math.min(product.stock_quantity, q + 1))
                    }
                    disabled={qty >= product.stock_quantity}
                    className="size-9 rounded-lg border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-[#64748b] hover:text-[#e2e8f0] hover:border-[#f5c842]/40 transition-all disabled:opacity-30"
                    aria-label="Zvysit mnozstvo"
                  >
                    <Plus className="size-4" />
                  </button>
                  <span className="text-xs text-[#64748b] ml-1">
                    max {product.stock_quantity}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={adding}
                className={`h-12 w-full sm:w-auto sm:min-w-[220px] font-semibold text-sm transition-all ${
                  adding
                    ? 'bg-[#f5c842]/70 scale-[0.98]'
                    : 'bg-[#f5c842] hover:bg-[#f5c842]/80'
                } text-black`}
              >
                <ShoppingCart className="size-4 mr-2" />
                {adding ? 'Pridane do kosika...' : 'Pridat do kosika'}
              </Button>
            </div>
          )}

          {isOutOfStock && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
              Tento produkt je momentalne vypredany. Sleduj nas pre dostupnost.
            </div>
          )}

          <Separator className="bg-[#1e1e2e]" />

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-[#e2e8f0] mb-3 uppercase tracking-wide">
              Popis produktu
            </h2>
            <p className="text-[#64748b] text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Back link */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#e2e8f0] transition-colors mt-2"
          >
            <ArrowLeft className="size-3.5" />
            Spat do obchodu
          </Link>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-xl font-bold text-[#e2e8f0] mb-6">
            Suvisejuce produkty
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
