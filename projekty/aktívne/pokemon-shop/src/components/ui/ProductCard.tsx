'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/data/products'
import RarityBadge from './RarityBadge'
import CartButton from './CartButton'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) translateY(-4px)`
  }

  const handleTiltReset = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)'
  }

  const getPsaBadgeStyle = (grade: number) => {
    if (grade === 10) return { bg: '#F59E0B', color: '#000' }
    if (grade === 9) return { bg: '#C0C0C0', color: '#000' }
    return { bg: '#CD7F32', color: '#000' }
  }

  return (
    <div
      className="relative group"
      style={{
        background: 'var(--surface)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseMove={handleTilt}
      onMouseLeave={handleTiltReset}
    >
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {product.img_url ? (
          <Image
            src={product.img_url}
            alt={product.name}
            fill
            className="object-contain p-4 transition-premium group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, var(--surface) 0%, ${
                product.mystery_tier === 'Diamond' ? '#B9F2FF20' :
                product.mystery_tier === 'Platinum' ? '#E5E4E220' :
                product.mystery_tier === 'Gold' ? '#FFD70020' :
                product.mystery_tier === 'Silver' ? '#C0C0C020' :
                '#CD7F3220'
              } 100%)`,
            }}
          >
            {(() => {
              const tierColor =
                product.mystery_tier === 'Diamond' ? '#B9F2FF' :
                product.mystery_tier === 'Platinum' ? '#E5E4E2' :
                product.mystery_tier === 'Gold' ? '#FFD700' :
                product.mystery_tier === 'Silver' ? '#C0C0C0' :
                '#CD7F32'
              const tierGlow =
                product.mystery_tier === 'Diamond' ? 'rgba(185,242,255,0.5)' :
                product.mystery_tier === 'Platinum' ? 'rgba(229,228,226,0.4)' :
                product.mystery_tier === 'Gold' ? 'rgba(255,215,0,0.5)' :
                product.mystery_tier === 'Silver' ? 'rgba(192,192,192,0.4)' :
                'rgba(205,127,50,0.4)'
              return (
                <svg
                  viewBox="0 0 120 130"
                  width="72%"
                  height="72%"
                  style={{ filter: `drop-shadow(0 0 14px ${tierGlow})` }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Box lid */}
                  <rect x="10" y="28" width="100" height="22" rx="3"
                    fill={tierColor} opacity="0.9" />
                  {/* Lid stripe (ribbon vertical) */}
                  <rect x="53" y="28" width="14" height="22"
                    fill="rgba(0,0,0,0.18)" />
                  {/* Bow left loop */}
                  <ellipse cx="44" cy="22" rx="14" ry="8"
                    fill={tierColor} opacity="0.85"
                    transform="rotate(-20 44 22)" />
                  {/* Bow right loop */}
                  <ellipse cx="76" cy="22" rx="14" ry="8"
                    fill={tierColor} opacity="0.85"
                    transform="rotate(20 76 22)" />
                  {/* Bow center knot */}
                  <ellipse cx="60" cy="22" rx="7" ry="6"
                    fill={tierColor} />
                  <ellipse cx="60" cy="22" rx="4" ry="3.5"
                    fill="rgba(255,255,255,0.25)" />
                  {/* Box body */}
                  <rect x="14" y="50" width="92" height="68" rx="3"
                    fill={tierColor} opacity="0.18" />
                  <rect x="14" y="50" width="92" height="68" rx="3"
                    fill="none"
                    stroke={tierColor}
                    strokeWidth="2"
                    opacity="0.7" />
                  {/* Ribbon vertical on body */}
                  <rect x="53" y="50" width="14" height="68"
                    fill={tierColor} opacity="0.22" />
                  {/* Ribbon horizontal on body */}
                  <rect x="14" y="72" width="92" height="12"
                    fill={tierColor} opacity="0.22" />
                  {/* "?" text */}
                  <text
                    x="60" y="100"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="'Bebas Neue', sans-serif"
                    fontSize="30"
                    fontWeight="bold"
                    fill={tierColor}
                    opacity="0.95"
                  >?</text>
                </svg>
              )
            })()}
          </div>
        )}

        {/* Holo overlay for graded cards */}
        {product.category === 'psa-graded' && <div className="card-holo absolute inset-0" />}

        {/* Sold out */}
        {product.stock === 0 && (
          <div className="sold-out-overlay">
            <span className="font-headline text-2xl tracking-widest" style={{ color: 'var(--red)' }}>VYPREDANÉ</span>
          </div>
        )}

        {/* PSA Grade badge */}
        {product.psa_grade && (
          <div
            className="absolute top-2 right-2 w-10 h-10 flex flex-col items-center justify-center z-20"
            style={{
              background: getPsaBadgeStyle(product.psa_grade).bg,
              boxShadow: product.psa_grade === 10 ? '0 0 12px rgba(245,158,11,0.6)' : 'none',
            }}
          >
            <span className="font-mono text-xs font-bold leading-none" style={{ color: getPsaBadgeStyle(product.psa_grade).color }}>PSA</span>
            <span className="font-mono text-lg font-bold leading-none" style={{ color: getPsaBadgeStyle(product.psa_grade).color }}>{product.psa_grade}</span>
          </div>
        )}

        {/* Low stock warning */}
        {product.stock > 0 && product.stock <= 3 && (
          <div className="absolute bottom-2 left-2 z-20">
            <span className="font-mono text-xs px-2 py-0.5" style={{ background: 'var(--red)', color: 'white' }}>
              POSLEDNÝCH {product.stock}
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4" style={{ borderTop: '1px solid var(--surface-2)' }}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="font-bold text-sm leading-tight transition-premium" style={{ color: 'var(--ghost)' }}>
              {product.name}
            </h3>
          </Link>
        </div>

        {product.set_name && (
          <p className="font-mono text-xs mb-2" style={{ color: 'var(--dim)' }}>{product.set_name}</p>
        )}

        {product.rarity && (
          <div className="mb-3">
            <RarityBadge rarity={product.rarity} />
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-lg" style={{ color: 'var(--gold)' }}>
            {formatPrice(product.price)}
          </span>
          <span className="font-mono text-xs" style={{ color: product.stock > 0 ? 'var(--green)' : 'var(--red)' }}>
            {product.stock > 0 ? `${product.stock}x` : 'OUT'}
          </span>
        </div>

        <CartButton product={product} fullWidth className="mt-3" />
      </div>
    </div>
  )
}
