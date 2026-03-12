import Link from 'next/link'
import { ArrowRight, Package, Star, Shield, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shop/ProductCard'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import type { Category } from '@/types/shop'

// Featured: first 4 active products
const FEATURED = MOCK_PRODUCTS.filter((p) => p.is_active).slice(0, 4)

const CATEGORIES: {
  slug: Category
  label: string
  icon: React.ReactNode
  description: string
  color: string
}[] = [
  {
    slug: 'booster-box',
    label: 'Booster Boxy',
    icon: <Package className="size-7" />,
    description: '36 packov v jednom boxe',
    color: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
  },
  {
    slug: 'balicky',
    label: 'Balicky & ETB',
    icon: <span className="text-2xl">🃏</span>,
    description: 'Elite Trainer Boxy a premiovky',
    color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
  },
  {
    slug: 'psa-graded',
    label: 'PSA Graded',
    icon: <Trophy className="size-7" />,
    description: 'Certifikovane investicne karty',
    color: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
  },
  {
    slug: 'singles',
    label: 'Singles',
    icon: <Star className="size-7" />,
    description: 'Jednotlive karty podla vyberu',
    color: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    icon: <Shield className="size-7" />,
    description: 'Boxy, sleeves, toploaders',
    color: 'from-slate-500/20 to-slate-600/5 border-slate-500/20',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#f5c842]/8 via-[#0a0a0f] to-[#0a0a0f]"
        />
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#f5c842]/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f5c842]/20 bg-[#f5c842]/10 px-4 py-1.5 text-sm text-[#f5c842]">
              <span className="size-1.5 rounded-full bg-[#f5c842] animate-pulse" />
              Nove produkty pridane kazdy tyzden
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#e2e8f0]">
              Nakupuj karty
              <br />
              <span className="text-[#f5c842]">ktore maju hodnotu</span>
            </h1>
            <p className="mt-6 text-lg text-[#64748b] max-w-xl leading-relaxed">
              Booster boxy, PSA graded investicne karty, vzacne singles
              a prislusenstvo pre Pokemon TCG zberateli aj hracov.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="h-12 px-6 bg-[#f5c842] text-black font-semibold hover:bg-[#f5c842]/80 text-sm"
                render={<Link href="/shop" />}
              >
                Prehladat obchod
                <ArrowRight className="size-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                className="h-12 px-6 border-[#1e1e2e] bg-[#111118] text-[#e2e8f0] hover:bg-[#1e1e2e] text-sm"
                render={<Link href="/shop?category=psa-graded" />}
              >
                PSA Graded karty
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#e2e8f0]">
              Nove prirastky
            </h2>
            <p className="text-[#64748b] text-sm mt-1">
              Najnovsie produkty v nasej ponuke
            </p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-sm font-medium text-[#f5c842] hover:text-[#f5c842]/80 transition-colors"
          >
            Zobrazit vsetky <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#e2e8f0]">Kategorie</h2>
          <p className="text-[#64748b] text-sm mt-1">
            Najdi co hladate
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map(({ slug, label, icon, description, color }) => (
            <Link
              key={slug}
              href={`/shop?category=${slug}`}
              className={`group flex flex-col items-center gap-3 rounded-xl border bg-gradient-to-b p-5 text-center transition-all duration-150 hover:scale-[1.02] ${color}`}
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-[#0a0a0f]/50 text-[#f5c842] group-hover:text-[#f5c842] transition-colors">
                {icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#e2e8f0]">{label}</p>
                <p className="text-[11px] text-[#64748b] mt-0.5">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-[#1e1e2e] bg-[#111118] p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[#f5c842]">500+</p>
              <p className="text-sm text-[#64748b] mt-1">Spokojnych zakaznikov</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#f5c842]">100%</p>
              <p className="text-sm text-[#64748b] mt-1">Autenticke produkty</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#f5c842]">PSA</p>
              <p className="text-sm text-[#64748b] mt-1">Certifikovane graded karty</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
