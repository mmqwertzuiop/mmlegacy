import { Metadata } from 'next'
import { PRODUCTS } from '@/data/products'
import ProductGrid from '@/components/shop/ProductGrid'

export const metadata: Metadata = {
  title: 'Single Karty — MM Legacy',
  description: 'Rare & Ultra Rare single karty — bez náhody, konkrétna karta hneď.',
}

const products = PRODUCTS.filter(p => p.category === 'singles')

export default function SinglesPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="mb-12" style={{ borderBottom: '1px solid var(--surface-2)', paddingBottom: '2rem' }}>
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--blue)' }}>RARE & ULTRA RARE</p>
          <h1 className="font-headline text-6xl md:text-8xl" style={{ color: 'var(--ghost)' }}>SINGLES</h1>
          <p className="mt-4 text-lg max-w-2xl" style={{ color: 'var(--dim)' }}>
            Nechceš otvárať boxy? Chceš konkrétnu kartu, hneď, bez náhody. Naše single karty sú starostlivo vyberané — iba rare a ultra rare, iba v top stave.
          </p>
        </div>
        <ProductGrid products={products} showFilters={false} />
      </div>
    </div>
  )
}
