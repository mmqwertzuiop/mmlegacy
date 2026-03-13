'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { MYSTERY_BOX_TIERS, formatPrice } from '@/data/products'
import CountdownTimer from '@/components/ui/CountdownTimer'

const PREVIOUS_OPENS = [
  { user: 'M***aster', tier: 'Diamond', got: 'PSA 10 Charizard ex SIR', value: '400€+', color: '#B9F2FF' },
  { user: 'U***eonfan', tier: 'Gold', got: 'PSA 9 Umbreon VMAX Alt Art', value: '200€+', color: '#FFD700' },
  { user: 'P***achu', tier: 'Platinum', got: 'Rayquaza VMAX Alt Art', value: '350€+', color: '#E5E4E2' },
  { user: 'S***hinyx', tier: 'Silver', got: 'Ultra Rare Full Art', value: '60€+', color: '#C0C0C0' },
  { user: 'R***ainbow', tier: 'Gold', got: 'SIR Giratina V', value: '150€+', color: '#FFD700' },
]

const S = {
  mono: 'Space Mono, monospace',
  display: 'Bebas Neue, sans-serif',
  body: 'Inter Tight, sans-serif',
}

export default function MysteryBoxyPage() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        padding: '100px 0 80px',
        textAlign: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid var(--surface-2)',
        background: 'linear-gradient(180deg, var(--void) 0%, rgba(139,92,246,0.06) 50%, var(--void) 100%)',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(139,92,246,0.12) 0%, transparent 70%)',
        }} />
        {/* Particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="particle" style={{
            position: 'absolute',
            left: `${(i * 7 + 3) % 100}%`,
            animationDuration: `${4 + (i * 1.1) % 5}s`,
            animationDelay: `${(i * 0.4) % 5}s`,
            background: i % 3 === 0 ? 'var(--purple)' : i % 3 === 1 ? 'var(--gold)' : 'var(--orange)',
          }} />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto', padding: '0 40px' }}
        >
          <p style={{ fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.45em', color: 'var(--purple)', marginBottom: '20px', textTransform: 'uppercase' }}>
            GAMIFIED UNBOXING EXPERIENCE
          </p>
          <h1 style={{
            fontFamily: S.display,
            fontSize: 'clamp(72px, 12vw, 140px)',
            lineHeight: 0.88,
            color: 'var(--ghost)',
            letterSpacing: '0.02em',
            marginBottom: '28px',
          }}>
            MYSTERY<br />
            <span style={{ color: 'var(--purple)' }}>BOXY</span>
          </h1>
          <p style={{ fontFamily: S.body, fontSize: '18px', lineHeight: 1.7, color: 'var(--dim)', maxWidth: '560px', margin: '0 auto 36px' }}>
            Toto je najčistejší zážitok z Pokemon kariet. Ty vyberieš tier — my vyberieme obsah. Každý mystery box je ručne zostavený naším tímom.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {[
              { label: 'Žiadne duplikáty', color: 'var(--green)' },
              { label: 'Originálne produkty', color: 'var(--blue)' },
              { label: 'Zaručená hodnota', color: 'var(--gold)' },
              { label: 'Ručne zostavené', color: 'var(--orange)' },
            ].map((b, i) => (
              <span key={i} style={{
                fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.1em',
                padding: '8px 16px',
                border: `1px solid ${b.color}50`,
                color: b.color,
                background: `${b.color}10`,
              }}>✓ {b.label}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section style={{ padding: '48px 0', background: 'var(--surface)', borderBottom: '1px solid var(--surface-2)', textAlign: 'center' }}>
        <CountdownTimer label="NOVÝ DROP ZA" targetHours={6} />
      </section>

      {/* ── TIERS ── */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: '12px', textTransform: 'uppercase' }}>5 TIEROV</p>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(56px, 7vw, 96px)', color: 'var(--ghost)', lineHeight: 1 }}>VYBER SI TIER</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {MYSTERY_BOX_TIERS.map((tier, i) => (
              <div
                key={tier.id}
                style={{
                  display: 'flex', flexDirection: 'column',
                  background: 'var(--surface)',
                  border: `1px solid ${tier.color}35`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  opacity: 0,
                  animation: `fadeInUp 0.6s ease ${0.1 + i * 0.1}s forwards`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-8px)'
                  el.style.boxShadow = `0 20px 60px ${tier.color}20, 0 0 0 1px ${tier.color}50`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Top bar */}
                <div style={{ height: '3px', background: tier.color, boxShadow: `0 0 12px ${tier.color}` }} />

                {/* Header */}
                <div style={{ padding: '28px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Flip box */}
                  <div
                    style={{ width: '76px', height: '76px', perspective: '600px', cursor: 'pointer', marginBottom: '20px' }}
                    onClick={() => setFlipped(p => ({ ...p, [i]: !p[i] }))}
                  >
                    <div style={{
                      width: '100%', height: '100%',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backfaceVisibility: 'hidden',
                        background: `${tier.color}15`,
                        border: `2px solid ${tier.color}55`,
                        fontFamily: S.display, fontSize: '40px', color: tier.color,
                      }}>?</div>
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: tier.color, color: '#000',
                        fontFamily: S.display, fontSize: '32px',
                      }}>✓</div>
                    </div>
                  </div>

                  <h3 style={{ fontFamily: S.display, fontSize: '30px', color: tier.color, letterSpacing: '0.08em', marginBottom: '2px' }}>
                    {tier.name.toUpperCase()}
                  </h3>
                  <p style={{ fontFamily: S.mono, fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.2em', marginBottom: '20px' }}>MYSTERY BOX</p>

                  <p style={{ fontFamily: S.mono, fontSize: '30px', fontWeight: 700, color: 'var(--ghost)', marginBottom: '12px', lineHeight: 1 }}>
                    {formatPrice(tier.price)}
                  </p>

                  <div style={{
                    width: '100%', padding: '8px 12px', marginBottom: '20px', textAlign: 'center',
                    background: `${tier.color}10`, border: `1px solid ${tier.color}25`,
                    fontFamily: S.mono, fontSize: '10px',
                  }}>
                    <span style={{ color: 'var(--dim)' }}>HODNOTA </span>
                    <span style={{ color: tier.color, fontWeight: 700 }}>
                      {formatPrice(tier.min_value)}–{formatPrice(tier.max_value)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '0 20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', flex: 1 }}>
                    {tier.possible_cards.map((item, j) => (
                      <li key={j} style={{
                        display: 'flex', gap: '8px', alignItems: 'flex-start',
                        marginBottom: '8px', fontFamily: S.body, fontSize: '12px', color: 'var(--ghost)', lineHeight: 1.4,
                      }}>
                        <span style={{ color: tier.color, flexShrink: 0, fontWeight: 700, marginTop: '1px' }}>→</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div style={{
                    padding: '8px', marginBottom: '16px', textAlign: 'center',
                    background: 'var(--surface-2)', fontFamily: S.mono, fontSize: '10px',
                  }}>
                    <span style={{ color: 'var(--dim)' }}>BONUS ŠANCA </span>
                    <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{tier.bonus_chance}%</span>
                  </div>

                  <p style={{ fontFamily: S.body, fontSize: '11px', color: 'var(--dim)', textAlign: 'center', marginBottom: '20px', lineHeight: 1.5 }}>
                    {tier.description}
                  </p>

                  <button
                    style={{
                      width: '100%', padding: '14px 0',
                      fontFamily: S.mono, fontWeight: 700, fontSize: '11px',
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      background: tier.color, color: '#000',
                      border: 'none', cursor: 'pointer',
                      transition: 'opacity 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(0.98)' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    OBJEDNAŤ
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontFamily: S.mono, fontSize: '10px', marginTop: '16px', color: 'var(--dim)' }}>
            Klikni na ? pre 3D reveal animáciu
          </p>
        </div>
      </section>

      {/* ── PREVIOUS OPENS ── */}
      <section style={{ padding: '80px 0', background: 'var(--surface)', borderTop: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.3em', color: 'var(--purple)', marginBottom: '10px', textTransform: 'uppercase' }}>PREDOŠLÉ OTVÁRANIA</p>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(40px, 5vw, 64px)', color: 'var(--ghost)', lineHeight: 1 }}>ČO DOSTALI INÍ</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PREVIOUS_OPENS.map((open, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                  background: 'var(--surface-2)', border: `1px solid ${open.color}20`,
                }}
              >
                <div style={{
                  width: '44px', height: '44px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${open.color}18`, color: open.color,
                  fontFamily: S.display, fontSize: '22px',
                }}>{open.tier[0]}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: S.mono, fontSize: '10px', color: 'var(--dim)', marginBottom: '4px' }}>
                    {open.user} — <span style={{ color: open.color }}>{open.tier}</span>
                  </p>
                  <p style={{ fontFamily: S.body, fontWeight: 700, fontSize: '14px', color: 'var(--ghost)' }}>{open.got}</p>
                </div>
                <p style={{ fontFamily: S.mono, fontSize: '14px', fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>{open.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
