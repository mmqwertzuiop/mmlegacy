'use client'
import Link from 'next/link'
import { MysteryBoxTier } from '@/types'
import { formatPrice } from '@/data/products'

interface MysteryBoxCardProps {
  tier: MysteryBoxTier
  compact?: boolean
}

export default function MysteryBoxCard({ tier, compact = false }: MysteryBoxCardProps) {
  return (
    <div
      className="relative flex flex-col p-6 transition-premium group"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${tier.color}30`,
        boxShadow: `0 0 0 1px ${tier.color}10`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${tier.color}30, 0 0 0 1px ${tier.color}50`
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${tier.color}10`
      }}
    >
      {/* Tier color bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: tier.color }} />

      {/* Mystery icon */}
      <div
        className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-3xl font-headline"
        style={{
          background: `${tier.color}15`,
          border: `2px solid ${tier.color}40`,
          color: tier.color,
        }}
      >
        ?
      </div>

      {/* Name */}
      <h3 className="font-headline text-2xl text-center tracking-wider mb-1" style={{ color: tier.color }}>
        {tier.name.toUpperCase()}
      </h3>
      <p className="text-center font-mono text-xs mb-4" style={{ color: 'var(--dim)' }}>
        MYSTERY BOX
      </p>

      {/* Price */}
      <div className="text-center mb-4">
        <span className="font-mono text-3xl font-bold" style={{ color: 'var(--ghost)' }}>
          {formatPrice(tier.price)}
        </span>
      </div>

      {/* Guaranteed value */}
      <div
        className="text-center py-2 mb-4 font-mono text-xs"
        style={{ background: `${tier.color}10`, borderTop: `1px solid ${tier.color}30`, borderBottom: `1px solid ${tier.color}30` }}
      >
        <span style={{ color: 'var(--dim)' }}>ZARUČENÁ HODNOTA: </span>
        <span style={{ color: tier.color }}>
          {formatPrice(tier.min_value)} – {formatPrice(tier.max_value)}
        </span>
      </div>

      {!compact && (
        <>
          {/* Contents */}
          <ul className="space-y-1.5 mb-4 flex-1">
            {tier.possible_cards.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ghost)' }}>
                <span style={{ color: tier.color }}>→</span>
                {item}
              </li>
            ))}
          </ul>

          {/* Bonus chance */}
          <div
            className="text-center py-2 mb-4 font-mono text-xs"
            style={{ background: 'var(--surface-2)' }}
          >
            <span style={{ color: 'var(--dim)' }}>BONUS ŠANCA: </span>
            <span style={{ color: 'var(--orange)' }}>{tier.bonus_chance}%</span>
          </div>
        </>
      )}

      {/* Description */}
      <p className="text-xs text-center mb-4" style={{ color: 'var(--dim)' }}>
        {tier.description}
      </p>

      <Link href={`/mystery-boxy`}>
        <button
          className="w-full py-3 font-bold text-sm tracking-widest transition-premium"
          style={{
            background: tier.color,
            color: '#000',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.opacity = '0.85'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.opacity = '1'
          }}
        >
          OBJEDNAŤ
        </button>
      </Link>
    </div>
  )
}
