'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Product } from '@/types'
import { formatPrice } from '@/data/products'
import RarityBadge from './RarityBadge'
import CartButton from './CartButton'
import MysteryBox3D from './MysteryBox3D'

interface ProductCardProps {
  product: Product
  featured?: boolean
}

export default function ProductCard({ product, featured }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mouseNorm, setMouseNorm] = useState({ x: 0.5, y: 0.5 })

  const isPsa10 = product.psa_grade === 10
  const isHot = product.stock > 0 && product.stock <= 3
  const isBestseller = [
    'psa-10-umbreon-vmax-alt-art',
    'sv-prismatic-evolutions-booster-box',
    'psa-9-charizard-ex-sir-obsidian',
    'single-umbreon-vmax-alt-art',
  ].includes(product.slug)

  // Spring-based smooth tilt from mouse
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 180, damping: 20 })
  const springY = useSpring(my, { stiffness: 180, damping: 20 })
  const rotateY = useTransform(springX, [-0.5, 0.5], [-18, 18])
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12])

  // Floating shadow — moves opposite to tilt (realistic light source)
  const shadowX = useTransform(springX, [-0.5, 0.5], [28, -28])
  const shadowY = useTransform(springY, [-0.5, 0.5], [-12, 32])

  // Hover spring for scale + lift
  const hp = useSpring(0, { stiffness: 260, damping: 24 })
  const hoverScale = useTransform(hp, [0, 1], [1, 1.06])
  const hoverY = useTransform(hp, [0, 1], [0, -12])
  const shadowOpacity = useTransform(hp, [0, 1], [0, 1])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(x)
    my.set(y)
    setMouseNorm({ x: x + 0.5, y: y + 0.5 })
  }

  const handleMouseEnter = () => { setIsHovered(true); hp.set(1) }
  const handleMouseLeave = () => {
    setIsHovered(false)
    hp.set(0)
    mx.set(0); my.set(0)
    setMouseNorm({ x: 0.5, y: 0.5 })
  }

  // Specular edge highlight angle based on mouse position
  const specAngle = Math.atan2(mouseNorm.y - 0.5, -(mouseNorm.x - 0.5)) * (180 / Math.PI) + 135
  const specIntensity = Math.min(Math.sqrt((mouseNorm.x - 0.5) ** 2 + (mouseNorm.y - 0.5) ** 2) * 2, 1)

  const getPsaBadgeStyle = (grade: number) => {
    if (grade === 10) return { bg: '#F59E0B', color: '#000' }
    if (grade === 9) return { bg: '#C0C0C0', color: '#000' }
    return { bg: '#CD7F32', color: '#000' }
  }

  return (
    <div style={{ position: 'relative', perspective: '1000px' }}>
      {/* Floating glow shadow — shifts opposite to tilt */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '6px',
          zIndex: 0,
          opacity: shadowOpacity,
          background: isPsa10
            ? 'radial-gradient(ellipse at center, rgba(245,158,11,0.55) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(250,93,41,0.38) 0%, transparent 70%)',
          filter: 'blur(22px)',
          x: shadowX,
          y: shadowY,
          pointerEvents: 'none',
        }}
      />

      {/* Main card */}
      <motion.div
        className={`relative group ${isPsa10 ? 'psa-10-rainbow' : ''}`}
        style={{
          background: 'var(--surface)',
          border: isHovered
            ? `1px solid ${isPsa10 ? 'rgba(245,158,11,0.5)' : 'rgba(250,93,41,0.35)'}`
            : '1px solid rgba(255,255,255,0.04)',
          rotateY,
          rotateX,
          scale: hoverScale,
          y: hoverY,
          transformStyle: 'preserve-3d',
          position: 'relative',
          zIndex: 1,
          transition: 'border-color 0.3s ease',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* HOT badge */}
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

        {/* Image area */}
        <Link href={`/shop/${product.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
          {product.mystery_tier ? (
            // Mystery box: full 3D interactive box
            <div className="absolute inset-0" style={{
              background: `linear-gradient(135deg, var(--surface) 0%, ${
                product.mystery_tier === 'Diamond' ? '#B9F2FF12' :
                product.mystery_tier === 'Platinum' ? '#E5E4E210' :
                product.mystery_tier === 'Gold' ? '#FFD70012' :
                product.mystery_tier === 'Silver' ? '#C0C0C010' :
                '#CD7F3210'
              } 100%)`,
            }}>
              <MysteryBox3D tier={product.mystery_tier} />
            </div>
          ) : product.img_url ? (
            <Image
              src={product.img_url}
              alt={product.name}
              fill
              className="object-contain p-4 transition-premium group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : null}

          {/* Holographic shimmer — tracks mouse */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at ${mouseNorm.x * 100}% ${mouseNorm.y * 100}%,
              rgba(255,220,80,0.6) 0%,
              rgba(80,220,255,0.45) 28%,
              rgba(220,80,255,0.35) 55%,
              rgba(80,255,160,0.22) 75%,
              transparent 90%)`,
            mixBlendMode: 'color-dodge',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }} />

          {/* Specular edge highlight (light reflection based on tilt angle) */}
          {isHovered && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(${specAngle}deg, rgba(255,255,255,${(specIntensity * 0.18).toFixed(3)}) 0%, transparent 55%)`,
              mixBlendMode: 'soft-light',
              pointerEvents: 'none',
            }} />
          )}

          {/* Scan line sweep on hover */}
          {isHovered && (
            <div style={{
              position: 'absolute', left: 0, right: 0, height: '35%',
              background: 'linear-gradient(transparent, rgba(255,255,255,0.07) 50%, transparent)',
              animation: 'scan 1.8s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          )}

          {/* Holo base for graded cards */}
          {product.category === 'psa-graded' && <div className="card-holo absolute inset-0" />}

          {/* Sold out overlay */}
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

        {/* Info block */}
        <div className="p-4" style={{
          borderTop: `1px solid ${isHovered
            ? isPsa10 ? 'rgba(245,158,11,0.4)' : 'rgba(250,93,41,0.3)'
            : 'var(--surface-2)'}`,
          transition: 'border-color 0.3s',
        }}>
          <Link href={`/shop/${product.slug}`} className="block link-underline mb-1">
            <h3 className="font-bold text-sm leading-tight" style={{ color: 'var(--ghost)' }}>
              {product.name}
            </h3>
          </Link>

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
              textShadow: isHovered ? '0 0 14px rgba(245,158,11,0.65)' : 'none',
              transition: 'text-shadow 0.3s',
            }}>
              {formatPrice(product.price)}
            </span>
            <span className="font-mono text-xs" style={{ color: product.stock > 0 ? 'var(--green)' : 'var(--red)' }}>
              {product.stock > 0 ? `${product.stock}×` : 'OUT'}
            </span>
          </div>

          <CartButton product={product} fullWidth className="mt-3" />
        </div>
      </motion.div>
    </div>
  )
}
