'use client'
import Link from 'next/link'
import { MysteryBoxTier } from '@/types'
import { formatPrice } from '@/data/products'

interface MysteryBoxCardProps {
  tier: MysteryBoxTier
  compact?: boolean
}

function MiniBox({ color }: { color: string }) {
  return (
    <div style={{ width: '80px', height: '88px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${color}18 0%, transparent 70%)` }} />
      <svg viewBox="0 0 100 110" style={{ width: '100%', filter: `drop-shadow(0 6px 16px ${color}45)` }}>
        {/* Lid */}
        <rect x="8" y="28" width="84" height="26" rx="1.5" fill={`${color}20`} stroke={color} strokeWidth="1.2" />
        <rect x="8" y="28" width="84" height="5" fill={`${color}30`} rx="1.5" />
        {/* Ribbon H on lid */}
        <rect x="8" y="37" width="84" height="8" fill={`${color}22`} />
        {/* Ribbon V on lid */}
        <rect x="44" y="28" width="12" height="26" fill={`${color}22`} />
        {/* Bow left */}
        <path d="M50 28 C44 18 30 18 32 26 C34 32 45 30 50 28Z" fill={color} opacity="0.9" />
        {/* Bow right */}
        <path d="M50 28 C56 18 70 18 68 26 C66 32 55 30 50 28Z" fill={color} opacity="0.9" />
        {/* Bow center */}
        <ellipse cx="50" cy="28" rx="6" ry="5" fill={color} />
        {/* Body */}
        <rect x="8" y="54" width="84" height="52" rx="1.5" fill={`${color}15`} stroke={color} strokeWidth="1.2" />
        <rect x="8" y="54" width="84" height="4" fill={`${color}28`} />
        {/* Ribbon V on body */}
        <rect x="44" y="54" width="12" height="52" fill={`${color}18`} />
        {/* Ribbon H on body */}
        <rect x="8" y="76" width="84" height="7" fill={`${color}12`} />
        {/* ? */}
        <text x="50" y="93" textAnchor="middle" fontSize="26" fill={color} fontFamily="Bebas Neue, sans-serif" opacity="0.88">?</text>
        {/* Stars */}
        <text x="17" y="65" fontSize="7" fill={color} opacity="0.5">★</text>
        <text x="76" y="62" fontSize="6" fill={color} opacity="0.42">★</text>
      </svg>
    </div>
  )
}

export default function MysteryBoxCard({ tier, compact = false }: MysteryBoxCardProps) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: compact ? '20px 16px' : '24px',
        background: 'var(--surface)',
        border: `1px solid ${tier.color}30`,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = `0 20px 50px ${tier.color}25, 0 0 0 1px ${tier.color}45`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Tier color bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: tier.color, boxShadow: `0 0 10px ${tier.color}` }} />

      {/* Mini box visual */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <MiniBox color={tier.color} />
      </div>

      {/* Name */}
      <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: compact ? '22px' : '26px', textAlign: 'center', letterSpacing: '0.08em', marginBottom: '2px', color: tier.color }}>
        {tier.name.toUpperCase()}
      </h3>
      <p style={{ textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', marginBottom: '14px', color: 'var(--dim)' }}>
        MYSTERY BOX
      </p>

      {/* Price */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: compact ? '22px' : '28px', fontWeight: 700, color: 'var(--ghost)' }}>
          {formatPrice(tier.price)}
        </span>
      </div>

      {/* Guaranteed value */}
      <div style={{
        textAlign: 'center', padding: '7px 10px', marginBottom: '14px',
        fontFamily: 'Space Mono, monospace', fontSize: '10px',
        background: `${tier.color}10`, border: `1px solid ${tier.color}28`,
      }}>
        <span style={{ color: 'var(--dim)' }}>HODNOTA </span>
        <span style={{ color: tier.color, fontWeight: 700 }}>{formatPrice(tier.min_value)}–{formatPrice(tier.max_value)}</span>
      </div>

      {!compact && (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', flex: 1 }}>
            {tier.possible_cards.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px', fontFamily: 'Inter Tight, sans-serif', fontSize: '12px', color: 'var(--ghost)', lineHeight: 1.4 }}>
                <span style={{ color: tier.color, flexShrink: 0, fontWeight: 700 }}>→</span>
                {item}
              </li>
            ))}
          </ul>
          <div style={{ textAlign: 'center', padding: '7px', marginBottom: '12px', background: 'var(--surface-2)', fontFamily: 'Space Mono, monospace', fontSize: '10px' }}>
            <span style={{ color: 'var(--dim)' }}>BONUS ŠANCA </span>
            <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{tier.bonus_chance}%</span>
          </div>
        </>
      )}

      <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '11px', textAlign: 'center', marginBottom: '16px', color: 'var(--dim)', lineHeight: 1.5 }}>
        {tier.description}
      </p>

      <Link href="/mystery-boxy" style={{ display: 'block' }}>
        <button
          style={{
            width: '100%', padding: '12px 0',
            fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: '10px',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            background: 'transparent', color: tier.color,
            border: `1px solid ${tier.color}`,
            cursor: 'none', transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = tier.color; e.currentTarget.style.color = '#000' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = tier.color }}
        >
          OBJEDNAŤ
        </button>
      </Link>
    </div>
  )
}
