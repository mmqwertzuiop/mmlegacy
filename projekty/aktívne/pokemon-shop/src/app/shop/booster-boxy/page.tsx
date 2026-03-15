import { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products-db'
import ProductGrid from '@/components/shop/ProductGrid'
import PageIntro from '@/components/ui/PageIntro'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Booster Boxy — MM Legacy',
  description: 'Prémiové Pokemon TCG booster boxy zo Scarlet & Violet a Sword & Shield éry.',
}

export default async function BoosterBoxyPage() {
  const products = await getProductsByCategory('booster-box')

  return (
    <>
    <PageIntro type="booster" title="BOOSTER BOXY" subtitle="POKEMON TCG" />
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
    </>
  )
}
