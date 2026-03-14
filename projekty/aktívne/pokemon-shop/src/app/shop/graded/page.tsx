import { Metadata } from 'next'
import { getProductsByCategory } from '@/lib/products-db'
import ProductGrid from '@/components/shop/ProductGrid'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'PSA Graded Karty — MM Legacy',
  description: 'PSA certifikované graded Pokemon karty — vrchol každej zbierky.',
}

export default async function GradedPage() {
  const products = await getProductsByCategory('psa-graded')

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="mb-12" style={{ borderBottom: '1px solid var(--surface-2)', paddingBottom: '2rem' }}>
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--gold)' }}>PSA CERTIFIED</p>
          <h1 className="font-headline text-6xl md:text-8xl" style={{ color: 'var(--ghost)' }}>GRADED KARTY</h1>
          <p className="mt-4 text-lg max-w-2xl" style={{ color: 'var(--dim)' }}>
            Graded karty sú vrchol kolekcie. Každá karta je profesionálne ohodnotená spoločnosťou PSA a uzatvorená v ochrannom slabe pre večnosť. Kupuješ nielen kartu, kupuješ certifikovanú hodnotu.
          </p>
          <div className="flex gap-6 mt-6">
            {[
              { grade: 10, label: 'PSA 10', color: '#F59E0B', desc: 'Gem Mint' },
              { grade: 9, label: 'PSA 9', color: '#C0C0C0', desc: 'Mint' },
              { grade: 8, label: 'PSA 8', color: '#CD7F32', desc: 'Near Mint-Mint' },
            ].map(g => (
              <div key={g.grade} className="flex items-center gap-2">
                <div className="w-10 h-10 flex flex-col items-center justify-center" style={{ background: g.color, boxShadow: `0 0 10px ${g.color}60` }}>
                  <span className="font-mono text-xs font-bold leading-none text-black">PSA</span>
                  <span className="font-mono text-sm font-bold leading-none text-black">{g.grade}</span>
                </div>
                <span className="font-mono text-sm" style={{ color: 'var(--dim)' }}>{g.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <ProductGrid products={products} showFilters={false} />
      </div>
    </div>
  )
}
