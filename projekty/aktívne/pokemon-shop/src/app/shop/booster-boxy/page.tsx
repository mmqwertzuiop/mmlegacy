import { Metadata } from 'next'
import { PRODUCTS } from '@/data/products'
import ProductGrid from '@/components/shop/ProductGrid'

export const metadata: Metadata = {
  title: 'Booster Boxy — MM Legacy',
  description: 'Prémiové Pokemon TCG booster boxy zo Scarlet & Violet a Sword & Shield éry.',
}

const products = PRODUCTS.filter(p => p.category === 'booster-box')

export default function BoosterBoxyPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="mb-12" style={{ borderBottom: '1px solid var(--surface-2)', paddingBottom: '2rem' }}>
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--orange)' }}>KATEGÓRIA</p>
          <h1 className="font-headline text-6xl md:text-8xl" style={{ color: 'var(--ghost)' }}>BOOSTER BOXY</h1>
          <p className="mt-4 text-lg max-w-2xl" style={{ color: 'var(--dim)' }}>
            Každý box je nová šanca na výnimočnú kartu. Naše booster boxy pochádzajú z overených zdrojov, sú originálne zapečatené a skladované za ideálnych podmienok.
          </p>
        </div>
        <ProductGrid products={products} showFilters={false} initialCategory="booster-box" />
      </div>
    </div>
  )
}
