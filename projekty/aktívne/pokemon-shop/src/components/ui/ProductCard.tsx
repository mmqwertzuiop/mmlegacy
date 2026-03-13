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
            className="absolute inset-0 flex items-center justify-center text-6xl"
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
            <span className="font-headline text-8xl" style={{ color: 'var(--surface-2)' }}>?</span>
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
