'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PromoBanner() {
  const [time, setTime] = useState({ h: 4, m: 58, s: 22 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 4; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

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
      gap: '20px',
    }}>
      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700, color: '#000', letterSpacing: '0.08em' }}>
        ⚡ FLASH SALE
      </span>
      <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', fontWeight: 700, color: '#000' }}>
        Prismatic Evolutions Booster Box — <strong>-15%</strong>
      </span>
      <span style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'Space Mono, monospace' }}>|</span>
      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'rgba(0,0,0,0.8)' }}>
        Končí o: <strong style={{ color: '#000' }}>{pad(time.h)}:{pad(time.m)}:{pad(time.s)}</strong>
      </span>
      <Link href="/shop/sv-prismatic-evolutions-booster-box" style={{
        fontFamily: 'Space Mono, monospace', fontSize: '10px',
        color: '#000', textDecoration: 'none',
        padding: '4px 10px',
        border: '1px solid rgba(0,0,0,0.5)',
        letterSpacing: '0.1em',
        fontWeight: 700,
      }}>
        KÚPIŤ →
      </Link>
    </div>
  )
}
