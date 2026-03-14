'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const MESSAGES = [
  {
    label: '⚡ FLASH SALE',
    text: 'Prismatic Evolutions Booster Box',
    highlight: '−15% DNES',
    href: '/shop/sv-prismatic-evolutions-booster-box',
    cta: 'KÚPIŤ →',
    countdown: true,
  },
  {
    label: '🚚 DOPRAVA ZADARMO',
    text: 'Pri objednávke nad',
    highlight: '100€',
    href: '/shop',
    cta: 'NAKUPOVAŤ →',
    countdown: false,
  },
  {
    label: '🏆 PSA GRADED',
    text: 'Charizard ex SIR PSA 10 — investičná karta roka',
    highlight: '899€',
    href: '/shop/psa-9-charizard-ex-sir-obsidian',
    cta: 'POZRIEŤ →',
    countdown: false,
  },
  {
    label: '💎 LIMITOVANÉ',
    text: 'Diamond Mystery Box — posledné',
    highlight: '5 kusov',
    href: '/mystery-boxy',
    cta: 'ZAOBSTARAŤ →',
    countdown: false,
  },
]

export default function PromoBanner() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const [time, setTime] = useState({ h: 4, m: 58, s: 22 })

  // Rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % MESSAGES.length)
        setVisible(true)
      }, 350)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Countdown for flash sale
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 4; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')
  const msg = MESSAGES[idx]

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '40px',
      background: 'var(--orange)',
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      overflow: 'hidden',
    }}>
      {/* Animated shine */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'card-shimmer 3s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* Dot indicators */}
      <div style={{ position: 'absolute', right: '16px', display: 'flex', gap: '4px' }}>
        {MESSAGES.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: i === idx ? '#000' : 'rgba(0,0,0,0.3)',
            cursor: 'none', transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700, color: '#000', letterSpacing: '0.06em' }}>
          {msg.label}
        </span>
        <span style={{ color: 'rgba(0,0,0,0.5)', fontFamily: 'Space Mono, monospace' }}>|</span>
        <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', fontWeight: 600, color: '#000' }}>
          {msg.text} <strong>{msg.highlight}</strong>
        </span>
        {msg.countdown && (
          <>
            <span style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'Space Mono, monospace' }}>|</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'rgba(0,0,0,0.8)' }}>
              Končí o: <strong style={{ color: '#000' }}>{pad(time.h)}:{pad(time.m)}:{pad(time.s)}</strong>
            </span>
          </>
        )}
        <Link href={msg.href} style={{
          fontFamily: 'Space Mono, monospace', fontSize: '10px',
          color: '#000', textDecoration: 'none',
          padding: '4px 10px',
          border: '1px solid rgba(0,0,0,0.5)',
          letterSpacing: '0.1em', fontWeight: 700,
          background: 'rgba(0,0,0,0.06)',
        }}>
          {msg.cta}
        </Link>
      </div>
    </div>
  )
}
