'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { formatPrice } from '@/data/products'
import RarityBadge from '@/components/ui/RarityBadge'
import CartButton from '@/components/ui/CartButton'
import ProductCard from '@/components/ui/ProductCard'

interface Props {
  product: Product
  related: Product[]
}

export default function ProductDetailClient({ product, related }: Props) {
  const [imgTilt, setImgTilt] = useState({ x: 0, y: 0 })
  const [quantity, setQuantity] = useState(1)

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setImgTilt({ x, y })
  }

  const handleTiltReset = () => setImgTilt({ x: 0, y: 0 })

  const getPsaStyle = (grade: number) => {
    if (grade === 10) return { bg: '#F59E0B', color: '#000', shadow: '0 0 20px rgba(245,158,11,0.5)' }
    if (grade === 9) return { bg: '#C0C0C0', color: '#000', shadow: '0 0 15px rgba(192,192,192,0.4)' }
    return { bg: '#CD7F32', color: '#000', shadow: 'none' }
  }

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {/* Breadcrumb */}
        <nav className="flex gap-2 font-mono text-xs mb-12" style={{ color: 'var(--dim)' }}>
          <Link href="/" style={{ color: 'var(--dim)' }}>HOME</Link>
          <span>/</span>
          <Link href="/shop" style={{ color: 'var(--dim)' }}>SHOP</Link>
          <span>/</span>
          <span style={{ color: 'var(--ghost)' }}>{product.name.toUpperCase()}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image */}
          <div>
            <div
              className="sticky top-24"
              style={{ cursor: 'none' }}
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltReset}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: product.category === 'psa-graded' ? '3/4' : '3/4',
                  background: 'var(--surface)',
                  transform: `perspective(800px) rotateY(${imgTilt.x * 20}deg) rotateX(${-imgTilt.y * 20}deg)`,
                  transition: 'transform 0.1s ease',
                }}
              >
                {product.img_url ? (
                  <>
                    <Image
                      src={product.img_url}
                      alt={product.name}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    {/* Holo overlay */}
                    {(product.category === 'psa-graded' || product.rarity?.includes('Rainbow') || product.rarity?.includes('Special Illustration')) && (
                      <div className="card-holo absolute inset-0 pointer-events-none" />
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-headline text-9xl" style={{ color: 'var(--surface-2)' }}>?</span>
                  </div>
                )}

                {/* PSA slab frame effect */}
                {product.psa_grade && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ border: `3px solid ${getPsaStyle(product.psa_grade).bg}40` }}
                  />
                )}
              </div>

              {/* PSA Grade badge large */}
              {product.psa_grade && (
                <div className="flex items-center gap-4 mt-6">
                  <div
                    className="flex flex-col items-center justify-center px-6 py-3"
                    style={{
                      background: getPsaStyle(product.psa_grade).bg,
                      boxShadow: getPsaStyle(product.psa_grade).shadow,
                    }}
                  >
                    <span className="font-mono text-sm font-bold" style={{ color: getPsaStyle(product.psa_grade).color }}>PSA</span>
                    <span className="font-mono text-4xl font-bold leading-none" style={{ color: getPsaStyle(product.psa_grade).color }}>
                      {product.psa_grade}
                    </span>
                    <span className="font-mono text-xs" style={{ color: getPsaStyle(product.psa_grade).color }}>
                      {product.psa_grade === 10 ? 'GEM MINT' : product.psa_grade === 9 ? 'MINT' : 'NM-MT'}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold" style={{ color: 'var(--ghost)' }}>PSA Certified</p>
                    <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>Professional Sports Authenticator</p>
                    <a
                      href="https://www.psacard.com/cert"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs underline mt-1 block transition-premium"
                      style={{ color: 'var(--orange)' }}
                    >
                      Overiť certifikát →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Category */}
            <p className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--orange)' }}>
              {product.category === 'booster-box' ? 'BOOSTER BOX' :
               product.category === 'psa-graded' ? 'PSA GRADED' :
               product.category === 'singles' ? 'SINGLE KARTA' :
               product.category === 'collection-box' ? 'COLLECTION BOX' : 'MYSTERY BOX'}
            </p>

            <h1 className="font-headline text-4xl md:text-5xl mb-4" style={{ color: 'var(--ghost)' }}>
              {product.name}
            </h1>

            {/* Badges row */}
            <div className="flex flex-wrap gap-3 mb-6">
              {product.rarity && <RarityBadge rarity={product.rarity} />}
              {product.set_name && (
                <span className="font-mono text-xs px-2 py-0.5 border" style={{ color: 'var(--dim)', borderColor: 'var(--surface-2)' }}>
                  {product.set_name.toUpperCase()}
                </span>
              )}
              <span className="font-mono text-xs px-2 py-0.5" style={{ background: product.stock > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: product.stock > 0 ? 'var(--green)' : 'var(--red)' }}>
                {product.stock > 0 ? `${product.stock} KS NA SKLADE` : 'VYPREDANÉ'}
              </span>
            </div>

            {/* Price */}
            <div className="mb-8 p-6" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
              <p className="font-mono text-4xl font-bold" style={{ color: 'var(--gold)' }}>
                {formatPrice(product.price)}
              </p>
              <p className="font-mono text-xs mt-1" style={{ color: 'var(--dim)' }}>
                + {Math.round(product.price / 100)} XP bodov za nákup
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--orange)' }}>POPIS</h3>
              <p className="leading-relaxed" style={{ color: 'var(--dim)' }}>{product.description}</p>
            </div>

            {/* Details */}
            <div className="mb-8 space-y-3">
              <h3 className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--orange)' }}>DETAILY</h3>
              {[
                product.set_name && { label: 'Set', value: product.set_name },
                product.rarity && { label: 'Vzácnosť', value: product.rarity },
                product.psa_grade && { label: 'PSA Grade', value: `PSA ${product.psa_grade}` },
                { label: 'Stav', value: product.category === 'psa-graded' ? 'PSA Graded Slab' : 'Near Mint / Raw' },
                { label: 'Autentickosť', value: '100% Originálne' },
              ].filter(Boolean).map((detail, i) => (
                <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--surface-2)' }}>
                  <span className="font-mono text-xs" style={{ color: 'var(--dim)' }}>{(detail as {label: string}).label}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: 'var(--ghost)' }}>{(detail as {value: string}).value}</span>
                </div>
              ))}
            </div>

            {/* Quantity + Cart */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center" style={{ border: '1px solid var(--surface-2)' }}>
                <button
                  className="px-4 py-3 font-mono transition-premium"
                  style={{ color: 'var(--ghost)', background: 'var(--surface)' }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-6 py-3 font-mono" style={{ color: 'var(--ghost)', background: 'var(--surface)' }}>
                  {quantity}
                </span>
                <button
                  className="px-4 py-3 font-mono transition-premium"
                  style={{ color: 'var(--ghost)', background: 'var(--surface)' }}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
              <div className="flex-1">
                <CartButton product={product} fullWidth />
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '✓', label: '100% Originálne' },
                { icon: '🔒', label: 'Bezpečná platba' },
                { icon: '📦', label: 'Rýchle doručenie' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-1 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
                  <span className="text-lg">{badge.icon}</span>
                  <span className="font-mono text-xs text-center" style={{ color: 'var(--dim)' }}>{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="mb-8" style={{ borderBottom: '1px solid var(--surface-2)', paddingBottom: '1rem' }}>
              <p className="font-mono text-xs tracking-widest mb-1" style={{ color: 'var(--orange)' }}>PODOBNÉ PRODUKTY</p>
              <h2 className="font-headline text-4xl" style={{ color: 'var(--ghost)' }}>MOHLO BY ŤA ZAUJÍMAŤ</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
