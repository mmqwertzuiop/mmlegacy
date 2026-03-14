'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import ProductCard from '@/components/ui/ProductCard'
import CategoryFilter from './CategoryFilter'

interface ProductGridProps {
  products: Product[]
  showFilters?: boolean
  initialCategory?: string
}

export default function ProductGrid({ products, showFilters = true, initialCategory = 'all' }: ProductGridProps) {
  const [category, setCategory] = useState(initialCategory)
  const [rarity, setRarity] = useState('all')
  const [sort, setSort] = useState('default')
  const [priceMax, setPriceMax] = useState(100000)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = [...products]

    if (category !== 'all') {
      result = result.filter(p => p.category === category)
    }
    if (rarity !== 'all') {
      result = result.filter(p => p.rarity === rarity)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.set_name?.toLowerCase().includes(q)) ||
        (p.rarity?.toLowerCase().includes(q))
      )
    }
    result = result.filter(p => p.price <= priceMax)

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'stock': result.sort((a, b) => b.stock - a.stock); break
    }

    return result
  }, [products, category, rarity, sort, priceMax])

  const rarities = [...new Set(products.map(p => p.rarity).filter(Boolean))] as string[]

  return (
    <div className="flex gap-8">
      {showFilters && (
        <CategoryFilter
          category={category}
          setCategory={setCategory}
          rarity={rarity}
          setRarity={setRarity}
          rarities={rarities}
          priceMax={priceMax}
          setPriceMax={setPriceMax}
        />
      )}

      <div className="flex-1">
        {/* Search + Sort + count */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <p className="font-mono text-xs" style={{ color: 'var(--dim)', whiteSpace: 'nowrap' }}>
              {filtered.length} PRODUKTOV
            </p>
            <input
              type="text"
              placeholder="Hľadať kartu, set..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="font-mono text-xs px-3 py-2 outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', width: '200px', transition: 'border-color 0.15s' }}
              onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
              onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="font-mono text-xs px-3 py-2 outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }}
          >
            <option value="default">ZORADIŤ</option>
            <option value="price-asc">CENA: RASTÚCO</option>
            <option value="price-desc">CENA: KLESAJÚCO</option>
            <option value="stock">DOSTUPNOSŤ</option>
          </select>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-headline text-4xl mb-2" style={{ color: 'var(--dim)' }}>ŽIADNE PRODUKTY</p>
            <p className="font-mono text-sm" style={{ color: 'var(--dim)' }}>Skús zmeniť filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (index % 8) * 0.055, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}

          </div>
        )}
      </div>
    </div>
  )
}
