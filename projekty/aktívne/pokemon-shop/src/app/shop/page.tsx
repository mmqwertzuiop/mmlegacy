import { Metadata } from 'next'
import { PRODUCTS } from '@/data/products'
import ProductGrid from '@/components/shop/ProductGrid'

export const metadata: Metadata = {
  title: 'Shop — MM Legacy',
  description: 'Všetky Pokemon TCG produkty — booster boxy, PSA graded karty, singles a mystery boxy.',
}

export default function ShopPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* Header */}
        <div className="mb-12" style={{ borderBottom: '1px solid var(--surface-2)', paddingBottom: '2rem' }}>
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--orange)' }}>MM LEGACY</p>
          <h1 className="font-headline text-6xl md:text-8xl" style={{ color: 'var(--ghost)' }}>SHOP</h1>
          <p className="mt-4 text-lg" style={{ color: 'var(--dim)' }}>
            {PRODUCTS.length} produktov — booster boxy, PSA graded, singles, mystery boxy
          </p>
        </div>

        <ProductGrid products={PRODUCTS} showFilters />
      </div>
    </div>
  )
}
