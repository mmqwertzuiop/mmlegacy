'use client'
import { useEffect, useState } from 'react'

export default function PageLoader() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 200)
    const t2 = setTimeout(() => setPhase('out'), 1800)
    const t3 = setTimeout(() => setPhase('done'), 2550)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (phase === 'done') return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--void)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transform: phase === 'out' ? 'translateY(-100%)' : 'translateY(0)',
      transition: phase === 'out' ? 'transform 0.75s cubic-bezier(0.76,0,0.24,1)' : 'none',
      pointerEvents: phase === 'out' ? 'none' : 'all',
    }}>
      {/* Scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--orange), transparent)',
        animation: phase !== 'in' ? 'loader-scan 1.5s ease-in-out forwards' : 'none',
      }} />

      {/* Logo block */}
      <div style={{ textAlign: 'center' }}>
        {/* MM */}
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(64px, 12vw, 120px)',
          letterSpacing: '0.08em',
          lineHeight: 1,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.06em',
        }}>
          {['M', 'M'].map((char, i) => (
            <span key={i} style={{
              display: 'inline-block',
              color: 'var(--ghost)',
              animation: `loader-char-in 0.5s ${0.1 + i * 0.08}s cubic-bezier(0.16,1,0.3,1) both`,
            }}>
              {char}
            </span>
          ))}
          {['L', 'E', 'G', 'A', 'C', 'Y'].map((char, i) => (
            <span key={i} style={{
              display: 'inline-block',
              color: 'var(--orange)',
              animation: `loader-char-in 0.5s ${0.28 + i * 0.06}s cubic-bezier(0.16,1,0.3,1) both`,
            }}>
              {char}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.5em',
          color: 'var(--dim)',
          marginTop: '12px',
          animation: 'loader-fade-in 0.6s 0.7s ease both',
        }}>
          PRÉMIOVÝ TCG SHOP
        </p>

        {/* Progress bar */}
        <div style={{
          marginTop: '48px',
          width: '180px',
          height: '1px',
          background: 'var(--surface-2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '100%',
            background: 'linear-gradient(90deg, transparent, var(--orange), transparent)',
            transformOrigin: 'center',
            animation: 'loader-progress 1.6s ease forwards',
          }} />
        </div>
      </div>
    </div>
  )
}
