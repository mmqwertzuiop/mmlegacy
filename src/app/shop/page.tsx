'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CategoryNav } from '@/components/shop/CategoryNav'
import { ProductCard } from '@/components/shop/ProductCard'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import type { Category, SortOption } from '@/types/shop'

export default function ShopPage() {
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [loading] = useState(false)

  const products = useMemo(() => {
    let list = MOCK_PRODUCTS.filter((p) => p.is_active)

    if (category !== 'all') {
      list = list.filter((p) => p.category_slug === category)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price_cents - b.price_cents)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price_cents - a.price_cents)
        break
      case 'newest':
        // mock: use id desc as proxy for newest
        list = [...list].sort((a, b) => Number(b.id) - Number(a.id))
        break
      case 'popular':
        // mock: items with low stock first (high demand)
        list = [...list].sort((a, b) => a.stock_quantity - b.stock_quantity)
        break
    }

    return list
  }, [category, search, sort])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e2e8f0]">Obchod</h1>
        <p className="text-[#64748b] mt-1 text-sm">
          {MOCK_PRODUCTS.filter((p) => p.is_active).length} produktov dostupnych
        </p>
      </div>

      {/* Filters row */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#64748b] pointer-events-none" />
          <Input
            type="search"
            placeholder="Hladat produkty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#111118] border-[#1e1e2e] text-[#e2e8f0] placeholder:text-[#64748b] focus-visible:border-[#f5c842]/50 focus-visible:ring-[#f5c842]/20 h-9"
            aria-label="Vyhladat produkty"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-[#64748b] shrink-0" />
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as SortOption)}
          >
            <SelectTrigger className="w-[160px] bg-[#111118] border-[#1e1e2e] text-[#e2e8f0] h-9 text-sm">
              <SelectValue placeholder="Zoradit" />
            </SelectTrigger>
            <SelectContent className="bg-[#16161f] border-[#1e1e2e]">
              <SelectItem value="newest" className="text-[#e2e8f0] focus:bg-[#1e1e2e]">
                Najnovsie
              </SelectItem>
              <SelectItem value="popular" className="text-[#e2e8f0] focus:bg-[#1e1e2e]">
                Popularita
              </SelectItem>
              <SelectItem value="price-asc" className="text-[#e2e8f0] focus:bg-[#1e1e2e]">
                Cena vzostupne
              </SelectItem>
              <SelectItem value="price-desc" className="text-[#e2e8f0] focus:bg-[#1e1e2e]">
                Cena zostupne
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category nav */}
      <div className="mb-8">
        <CategoryNav active={category} onChange={setCategory} />
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#1e1e2e] bg-[#111118] overflow-hidden"
            >
              <Skeleton className="aspect-[3/4] w-full bg-[#1a1a28]" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-20 bg-[#1a1a28]" />
                <Skeleton className="h-4 w-full bg-[#1a1a28]" />
                <Skeleton className="h-4 w-3/4 bg-[#1a1a28]" />
                <div className="flex justify-between mt-2">
                  <Skeleton className="h-6 w-16 bg-[#1a1a28]" />
                  <Skeleton className="h-9 w-9 rounded-lg bg-[#1a1a28]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <span className="text-5xl">🔍</span>
          <div>
            <p className="text-[#e2e8f0] font-medium text-lg">Ziadne produkty nenajdene</p>
            <p className="text-[#64748b] text-sm mt-1">
              Skus zmenit filter alebo vyhladavany vraz
            </p>
          </div>
          <button
            onClick={() => {
              setSearch('')
              setCategory('all')
            }}
            className="text-sm text-[#f5c842] hover:underline mt-2"
          >
            Resetovat filtre
          </button>
        </div>
      ) : (
        <>
          <p className="text-[#64748b] text-sm mb-5">
            {products.length} {products.length === 1 ? 'produkt' : products.length < 5 ? 'produkty' : 'produktov'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
