import { Metadata } from 'next'
import { PRODUCTS } from '@/data/products'
import ProductGrid from '@/components/shop/ProductGrid'

export const metadata: Metadata = {
  title: 'Collection Boxy — MM Legacy',
  description: 'Elite Trainer Boxy a Collection Boxy — prémiový zberateľský balíček.',
}

const products = PRODUCTS.filter(p => p.category === 'collection-box')

export default function CollectionBoxyPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="mb-12" style={{ borderBottom: '1px solid var(--surface-2)', paddingBottom: '2rem' }}>
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--green)' }}>ETB & PREMIUM</p>
          <h1 className="font-headline text-6xl md:text-8xl" style={{ color: 'var(--ghost)' }}>COLLECTION BOXY</h1>
          <p className="mt-4 text-lg max-w-2xl" style={{ color: 'var(--dim)' }}>
            Pre tých, čo chcú viac ako len karty. Collection boxy a ETB ponúkajú prémiový balíček — boosters, promo karty, sleeves, dice a ďalší collector&apos;s obsah. Perfektný darček alebo ikonický kúsok zbierky.
          </p>
        </div>
        <ProductGrid products={products} showFilters={false} />
      </div>
    </div>
  )
}
