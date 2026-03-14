import { Metadata } from 'next'
import { getProducts } from '@/lib/products-db'
import ProductGrid from '@/components/shop/ProductGrid'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Shop — MM Legacy',
  description: 'Všetky Pokemon TCG produkty — booster boxy, PSA graded karty, singles a mystery boxy.',
}

const CATEGORIES = [
  { label: 'BOOSTER BOXY', href: '/shop/booster-boxy', icon: '▸' },
  { label: 'PSA GRADED', href: '/shop/graded', icon: '▸' },
  { label: 'SINGLES', href: '/shop/singles', icon: '▸' },
  { label: 'MYSTERY BOXY', href: '/mystery-boxy', icon: '▸' },
]

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>

      {/* Hero Banner */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#0a0a0a',
          padding: '80px 48px 64px',
          marginBottom: '0',
        }}
      >
        {/* Orange glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,100,0,0.18) 0%, rgba(255,60,0,0.07) 45%, transparent 75%)',
            pointerEvents: 'none',
          }}
        />
        {/* Subtle bottom fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to bottom, transparent, var(--void))',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Label */}
          <p
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              color: 'var(--orange)',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            MM LEGACY
          </p>

          {/* Main heading */}
          <h1
            className="font-headline"
            style={{
              fontSize: 'clamp(5rem, 16vw, 11rem)',
              lineHeight: 0.9,
              color: '#ffffff',
              textShadow: '0 0 60px rgba(255,90,0,0.5), 0 0 120px rgba(255,50,0,0.2)',
              letterSpacing: '0.04em',
              marginBottom: '1.25rem',
            }}
          >
            SHOP
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--dim)',
              marginBottom: '2.5rem',
              fontFamily: 'Space Mono, monospace',
              letterSpacing: '0.05em',
            }}
          >
            {products.length} produktov — booster boxy, PSA graded, singles, mystery boxy
          </p>

          {/* Category boxes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              maxWidth: '36rem',
            }}
          >
            {CATEGORIES.map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.9rem 0.5rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255, 93, 41, 0.35)',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{cat.icon}</span>
                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.62rem',
                    letterSpacing: '0.12em',
                    color: 'var(--ghost)',
                    textAlign: 'center',
                  }}
                >
                  {cat.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 48px' }}>
        <ProductGrid products={products} showFilters />
      </div>
    </div>
  )
}
