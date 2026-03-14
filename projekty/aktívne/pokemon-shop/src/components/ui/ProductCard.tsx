'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/data/products'
import RarityBadge from './RarityBadge'
import CartButton from './CartButton'

interface ProductCardProps {
  product: Product
  featured?: boolean
}

export default function ProductCard({ product, featured }: ProductCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [isHovered, setIsHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const isPsa10 = product.psa_grade === 10
  const isHot = product.stock > 0 && product.stock <= 3
  const isBestseller = ['psa-10-umbreon-vmax-alt-art', 'sv-prismatic-evolutions-booster-box', 'psa-9-charizard-ex-sir-obsidian', 'single-umbreon-vmax-alt-art'].includes(product.slug)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x, y })
    setTilt({ x: x - 0.5, y: y - 0.5 })
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  const getPsaBadgeStyle = (grade: number) => {
    if (grade === 10) return { bg: '#F59E0B', color: '#000' }
    if (grade === 9) return { bg: '#C0C0C0', color: '#000' }
    return { bg: '#CD7F32', color: '#000' }
  }

  return (
    <div
      className={`relative group product-glow ${isPsa10 ? 'psa-10-rainbow' : ''}`}
      style={{
        background: 'var(--surface)',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered
          ? `perspective(700px) rotateY(${tilt.x * 8}deg) rotateX(${-tilt.y * 8}deg) translateY(-6px) scale(1.02)`
          : 'perspective(700px) rotateY(0) rotateX(0) translateY(0) scale(1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* HOT / BESTSELLER floating badge */}
      {isHot && !product.is_mystery_box && (
        <div className="badge-hot" style={{
          position: 'absolute', top: '-10px', left: '12px', zIndex: 30,
          padding: '3px 10px',
          background: 'var(--red)',
          fontFamily: 'Space Mono, monospace', fontSize: '9px', fontWeight: 700,
          color: '#fff', letterSpacing: '0.15em',
          animation: 'badge-pulse 1.6s ease-in-out infinite, hot-float 1.8s ease-in-out infinite',
        }}>
          🔥 POSLEDNÉ {product.stock}
        </div>
      )}
      {isBestseller && !isHot && (
        <div style={{
          position: 'absolute', top: '-10px', left: '12px', zIndex: 30,
          padding: '3px 10px',
          background: 'var(--gold)',
          fontFamily: 'Space Mono, monospace', fontSize: '9px', fontWeight: 700,
          color: '#000', letterSpacing: '0.15em',
        }}>
          ★ BESTSELLER
        </div>
      )}

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
                <svg viewBox="0 0 120 130" width="72%" height="72%"
                  style={{ filter: `drop-shadow(0 0 14px ${tierGlow})` }}
                  xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="28" width="100" height="22" rx="3" fill={tierColor} opacity="0.9" />
                  <rect x="53" y="28" width="14" height="22" fill="rgba(0,0,0,0.18)" />
                  <ellipse cx="44" cy="22" rx="14" ry="8" fill={tierColor} opacity="0.85" transform="rotate(-20 44 22)" />
                  <ellipse cx="76" cy="22" rx="14" ry="8" fill={tierColor} opacity="0.85" transform="rotate(20 76 22)" />
                  <ellipse cx="60" cy="22" rx="7" ry="6" fill={tierColor} />
                  <ellipse cx="60" cy="22" rx="4" ry="3.5" fill="rgba(255,255,255,0.25)" />
                  <rect x="14" y="50" width="92" height="68" rx="3" fill={tierColor} opacity="0.18" />
                  <rect x="14" y="50" width="92" height="68" rx="3" fill="none" stroke={tierColor} strokeWidth="2" opacity="0.7" />
                  <rect x="53" y="50" width="14" height="68" fill={tierColor} opacity="0.22" />
                  <rect x="14" y="72" width="92" height="12" fill={tierColor} opacity="0.22" />
                  <text x="60" y="100" textAnchor="middle" dominantBaseline="middle"
                    fontFamily="'Bebas Neue', sans-serif" fontSize="30" fontWeight="bold"
                    fill={tierColor} opacity="0.95">?</text>
                </svg>
              )
            })()}
          </div>
        )}

        {/* === MOUSE-TRACKING HOLO SHIMMER === */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(255,220,80,0.55) 0%,
            rgba(80,220,255,0.4) 30%,
            rgba(220,80,255,0.3) 55%,
            rgba(80,255,160,0.2) 75%,
            transparent 90%)`,
          mixBlendMode: 'color-dodge',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
          pointerEvents: 'none',
        }} />

        {/* Scan line on hover */}
        {isHovered && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '35%',
            background: 'linear-gradient(transparent, rgba(255,255,255,0.06) 50%, transparent)',
            animation: 'scan 1.8s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Holo base for graded cards */}
        {product.category === 'psa-graded' && <div className="card-holo absolute inset-0" />}

        {/* Sold out */}
        {product.stock === 0 && (
          <div className="sold-out-overlay">
            <span className="font-headline text-2xl tracking-widest" style={{ color: 'var(--red)' }}>VYPREDANÉ</span>
          </div>
        )}

        {/* PSA Grade badge */}
        {product.psa_grade && (
          <div className="absolute top-2 right-2 w-10 h-10 flex flex-col items-center justify-center z-20"
            style={{
              background: getPsaBadgeStyle(product.psa_grade).bg,
              boxShadow: isPsa10 ? '0 0 16px rgba(245,158,11,0.8)' : 'none',
              animation: isPsa10 ? 'badge-pulse 2s ease-in-out infinite' : 'none',
            }}>
            <span className="font-mono text-xs font-bold leading-none" style={{ color: getPsaBadgeStyle(product.psa_grade).color }}>PSA</span>
            <span className="font-mono text-lg font-bold leading-none" style={{ color: getPsaBadgeStyle(product.psa_grade).color }}>{product.psa_grade}</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4" style={{ borderTop: `1px solid ${isHovered ? 'var(--orange)' : 'var(--surface-2)'}`, transition: 'border-color 0.25s' }}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/shop/${product.slug}`} className="block link-underline">
            <h3 className="font-bold text-sm leading-tight transition-premium" style={{ color: isHovered ? 'var(--ghost)' : 'var(--ghost)' }}>
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
          <span className="font-mono font-bold text-lg" style={{
            color: 'var(--gold)',
            textShadow: isHovered ? '0 0 12px rgba(245,158,11,0.6)' : 'none',
            transition: 'text-shadow 0.25s',
          }}>
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
