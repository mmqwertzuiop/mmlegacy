'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MYSTERY_BOX_TIERS, formatPrice } from '@/data/products'
import CountdownTimer from '@/components/ui/CountdownTimer'
import PageIntro from '@/components/ui/PageIntro'

// ── Recent wins feed ──────────────────────────────────────────
const WIN_FEED = [
  { user: 'M***aster', tier: 'Diamond', got: 'PSA 10 Charizard ex SIR', value: '400€', color: '#B9F2FF' },
  { user: 'U***eonfan', tier: 'Gold', got: 'PSA 9 Umbreon VMAX Alt Art', value: '220€', color: '#FFD700' },
  { user: 'P***achu', tier: 'Platinum', got: 'Rayquaza VMAX Alt Art NM', value: '350€', color: '#E5E4E2' },
  { user: 'S***hinyx', tier: 'Silver', got: 'Ultra Rare Full Art Holo', value: '65€', color: '#C0C0C0' },
  { user: 'R***ainbow', tier: 'Gold', got: 'SIR Giratina V', value: '155€', color: '#FFD700' },
  { user: 'D***ragon', tier: 'Diamond', got: 'PSA 10 Umbreon VMAX Alt Art', value: '950€', color: '#B9F2FF' },
  { user: 'K***orai', tier: 'Bronze', got: 'Rare Holo V card', value: '28€', color: '#CD7F32' },
  { user: 'X***erneas', tier: 'Platinum', got: 'Alt Art Giratina V NM', value: '160€', color: '#E5E4E2' },
]

const STEPS = [
  { num: '01', title: 'VYBER TIER', desc: 'Bronze až Diamond — každý tier má garantovanú minimálnu hodnotu obsahu.' },
  { num: '02', title: 'OBJEDNAJ', desc: 'Bezpečná platba. Box je ručne zostavený naším tímom do 24 hodín.' },
  { num: '03', title: 'OTVOR & VYHRÁVAJ', desc: 'Box dorazí zapečatený. Otvor ho, odfotь, zdieľaj. Každý je unikátny.' },
]

const FAQ = [
  {
    q: 'Je garantovaná minimálna hodnota naozaj garantovaná?',
    a: 'Áno. Každý box obsahuje karty/produkty s trhovú hodnotou minimálne na úrovni uvedenej pre daný tier. Ak by sme to nedodržali, vrátime rozdiel.',
  },
  {
    q: 'Aké karty môžem dostať?',
    a: 'Záleží od tieru. Bronze obsahuje rare + ultra rare singles. Diamond môže obsahovať PSA graded karty, booster boxy aj SIR karty v hodnote 400€+.',
  },
  {
    q: 'Ako dlho trvá doručenie?',
    a: 'Box zostavíme do 24 hodín, doručenie 2-4 pracovné dni. Karty sú chránené v topcloaderoch a bubble wrap.',
  },
  {
    q: 'Môžem dostať duplicitu z predchádzajúceho boxu?',
    a: 'Nie. Každý box je unikátny — nikdy nedostaneš rovnakú kartu dvakrát ak si opakovaný zákazník.',
  },
]

const S = {
  mono: 'Space Mono, monospace',
  display: 'Bebas Neue, sans-serif',
  body: 'Inter Tight, sans-serif',
}

// ── Animated gift box SVG (hero visual) ──────────────────────
function HeroBox({ color = '#8B5CF6' }: { color?: string }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Outer glow */}
      <div style={{
        position: 'absolute', inset: '10%', borderRadius: '50%',
        background: `radial-gradient(ellipse, ${color}44 0%, transparent 65%)`,
        filter: 'blur(32px)',
        animation: 'box-glow-pulse 3s ease-in-out infinite',
      }} />
      {/* Floating particles */}
      {[0,1,2,3,4,5,6,7,8,9].map(j => (
        <div key={j} style={{
          position: 'absolute',
          width: j % 3 === 0 ? '3px' : '2px',
          height: j % 3 === 0 ? '3px' : '2px',
          borderRadius: '50%',
          background: j % 2 === 0 ? color : '#FA5D29',
          opacity: 0.55,
          left: `${8 + j * 9}%`,
          top: `${15 + (j % 5) * 14}%`,
          animation: `float-particle ${3.5 + j * 0.5}s linear infinite`,
          animationDelay: `${j * 0.4}s`,
          boxShadow: `0 0 6px ${j % 2 === 0 ? color : '#FA5D29'}`,
        }} />
      ))}
      {/* Box SVG with float animation */}
      <div style={{ animation: 'box-float 4s ease-in-out infinite', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 220 260" style={{ width: '78%', filter: `drop-shadow(0 20px 50px ${color}55) drop-shadow(0 0 80px ${color}33)` }}>
          {/* Box body */}
          <rect x="16" y="116" width="188" height="128" rx="3" fill={`${color}14`} stroke={color} strokeWidth="1.8" />
          {/* Body gradient top */}
          <rect x="16" y="116" width="188" height="8" fill={`${color}35`} rx="3" />
          {/* Ribbon V body */}
          <rect x="97" y="116" width="26" height="128" fill={`${color}20`} />
          {/* Ribbon H body */}
          <rect x="16" y="172" width="188" height="14" fill={`${color}16`} />
          {/* Side shine */}
          <rect x="26" y="124" width="5" height="112" fill={`${color}12`} rx="2.5" />
          {/* "?" */}
          <text x="110" y="206" textAnchor="middle" fontSize="62" fill={color} fontFamily="Bebas Neue, sans-serif" opacity="0.88">?</text>
          {/* Stars */}
          <text x="36" y="138" fontSize="13" fill={color} opacity="0.5">★</text>
          <text x="180" y="134" fontSize="11" fill={color} opacity="0.42">★</text>
          <text x="28" y="218" fontSize="9" fill={color} opacity="0.32">✦</text>
          <text x="186" y="226" fontSize="11" fill={color} opacity="0.42">✦</text>
          <circle cx="168" cy="148" r="2.5" fill={color} opacity="0.3" />
          <circle cx="62" cy="188" r="2" fill={color} opacity="0.25" />

          {/* Lid */}
          <rect x="12" y="62" width="196" height="56" rx="3" fill={`${color}18`} stroke={color} strokeWidth="1.8" />
          <rect x="12" y="62" width="196" height="9" fill={`${color}32`} rx="3" />
          {/* Lid ribbon V */}
          <rect x="97" y="62" width="26" height="56" fill={`${color}22`} />
          {/* Lid ribbon H */}
          <rect x="12" y="80" width="196" height="14" fill={`${color}18`} />
          {/* Lid shine */}
          <rect x="12" y="62" width="196" height="5" fill="rgba(255,255,255,0.12)" rx="3" />

          {/* Bow — left loop */}
          <path d={`M110 62 C92 38 60 38 63 54 C66 68 92 64 110 62Z`} fill={color} opacity="0.92" />
          <path d={`M110 62 C94 42 66 43 69 55 C72 65 93 62 110 62Z`} fill="rgba(0,0,0,0.2)" />
          {/* Bow — right loop */}
          <path d={`M110 62 C128 38 160 38 157 54 C154 68 128 64 110 62Z`} fill={color} opacity="0.92" />
          <path d={`M110 62 C126 42 154 43 151 55 C148 65 127 62 110 62Z`} fill="rgba(0,0,0,0.2)" />
          {/* Bow knot */}
          <ellipse cx="110" cy="62" rx="13" ry="11" fill={color} />
          <ellipse cx="110" cy="62" rx="6.5" ry="5.5" fill="rgba(0,0,0,0.22)" />
          {/* Knot shine */}
          <ellipse cx="107" cy="59" rx="3" ry="2.5" fill="rgba(255,255,255,0.35)" />
        </svg>
      </div>
    </div>
  )
}

// ── Tier box SVG (card front) ──────────────────────────────────
function BoxFront({ color }: { color: string }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}06`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 65%, ${color}22 0%, transparent 62%)` }} />
      {[0,1,2,3,4,5,6,7].map(j => (
        <div key={j} style={{ position: 'absolute', width: '2px', height: '2px', borderRadius: '50%', background: color, opacity: 0.38, left: `${12 + j * 11}%`, top: `${18 + (j % 4) * 18}%`, animation: `float-particle ${3.5 + j * 0.4}s linear infinite`, animationDelay: `${j * 0.45}s` }} />
      ))}
      <svg viewBox="0 0 180 205" style={{ width: '74%', position: 'relative', zIndex: 1, filter: `drop-shadow(0 14px 32px ${color}55)` }}>
        <rect x="14" y="52" width="152" height="44" rx="2" fill={`${color}18`} stroke={color} strokeWidth="1.3" />
        <rect x="14" y="52" width="152" height="7" fill={`${color}30`} rx="2" />
        <rect x="14" y="65" width="152" height="11" fill={`${color}20`} />
        <rect x="79" y="52" width="22" height="44" fill={`${color}20`} />
        <path d="M90 52 C78 33 54 34 57 48 C60 59 80 55 90 52Z" fill={color} opacity="0.88" />
        <path d="M90 52 C80 37 61 39 64 49 C67 57 81 54 90 52Z" fill="rgba(0,0,0,0.18)" />
        <path d="M90 52 C102 33 126 34 123 48 C120 59 100 55 90 52Z" fill={color} opacity="0.88" />
        <path d="M90 52 C100 37 119 39 116 49 C113 57 99 54 90 52Z" fill="rgba(0,0,0,0.18)" />
        <ellipse cx="90" cy="52" rx="10" ry="8" fill={color} />
        <ellipse cx="90" cy="52" rx="5" ry="4" fill="rgba(0,0,0,0.2)" />
        <rect x="14" y="96" width="152" height="100" rx="2" fill={`${color}12`} stroke={color} strokeWidth="1.3" />
        <rect x="14" y="96" width="152" height="5" fill={`${color}28`} />
        <rect x="79" y="96" width="22" height="100" fill={`${color}18`} />
        <rect x="14" y="138" width="152" height="11" fill={`${color}14`} />
        <rect x="23" y="102" width="4" height="84" fill={`${color}10`} rx="2" />
        <text x="90" y="166" textAnchor="middle" fontSize="46" fill={color} fontFamily="Bebas Neue, sans-serif" opacity="0.92">?</text>
        <text x="30" y="113" fontSize="11" fill={color} opacity="0.5">★</text>
        <text x="146" y="109" fontSize="9" fill={color} opacity="0.42">★</text>
        <text x="23" y="170" fontSize="7" fill={color} opacity="0.32">✦</text>
        <text x="150" y="175" fontSize="9" fill={color} opacity="0.42">✦</text>
      </svg>
      <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, textAlign: 'center' }}>
        <span style={{ fontFamily: S.mono, fontSize: '7px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>klikni pre reveal</span>
      </div>
    </div>
  )
}

const TIER_IMAGES = [
  'https://images.pokemontcg.io/sv1/252_hires.png',
  'https://images.pokemontcg.io/swsh12/186_hires.png',
  'https://images.pokemontcg.io/swsh7/218_hires.png',
  'https://images.pokemontcg.io/swsh7/215_hires.png',
  'https://images.pokemontcg.io/sv3pt5/199_hires.png',
]

// ── Live win ticker ───────────────────────────────────────────
function WinTicker() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % WIN_FEED.length)
        setVisible(true)
      }, 350)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  const win = WIN_FEED[idx]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', background: 'var(--surface-2)', border: `1px solid ${win.color}25`, maxWidth: 480 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.9)', flexShrink: 0, animation: 'badge-pulse 1.5s ease-in-out infinite' }} />
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
          >
            <span style={{ fontFamily: S.mono, fontSize: '10px', color: 'var(--dim)', letterSpacing: '0.1em' }}>{win.user}</span>
            <span style={{ fontFamily: S.mono, fontSize: '9px', color: win.color, letterSpacing: '0.12em', background: `${win.color}12`, padding: '2px 7px', border: `1px solid ${win.color}30` }}>{win.tier}</span>
            <span style={{ fontFamily: S.body, fontSize: '12px', color: 'var(--ghost)' }}>{win.got}</span>
            <span style={{ fontFamily: S.mono, fontSize: '11px', fontWeight: 700, color: 'var(--green)', marginLeft: 'auto' }}>{win.value}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── FAQ Item ──────────────────────────────────────────────────
function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.07 }}
      style={{ borderBottom: '1px solid var(--surface-2)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: S.display, fontSize: '18px', color: 'var(--ghost)', letterSpacing: '0.04em', paddingRight: 16 }}>{q}</span>
        <span style={{ fontFamily: S.mono, fontSize: '16px', color: 'var(--purple)', flexShrink: 0, transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ fontFamily: S.body, fontSize: '14px', lineHeight: 1.7, color: 'var(--dim)', paddingBottom: '20px' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function MysteryBoxyPage() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})

  return (
    <>
    <PageIntro type="mystery" title="MYSTERY BOXY" subtitle="GAMIFIED UNBOXING" />
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>

      {/* ── BREADCRUMB ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 48px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ fontFamily: S.mono, fontSize: '10px', color: 'var(--dim)', textDecoration: 'none', letterSpacing: '0.15em' }}>DOMOV</Link>
        <span style={{ color: 'var(--surface-2)', fontSize: '10px' }}>›</span>
        <span style={{ fontFamily: S.mono, fontSize: '10px', color: 'var(--ghost)', letterSpacing: '0.15em' }}>MYSTERY BOXY</span>
      </div>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        padding: '48px 0 72px',
        overflow: 'hidden',
        borderBottom: '1px solid var(--surface-2)',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage: 'linear-gradient(var(--surface-2) 1px, transparent 1px), linear-gradient(90deg, var(--surface-2) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
        {/* Purple glow */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-8%',
          width: '520px', height: '520px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '48px', alignItems: 'center' }}>

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.45em', color: 'var(--purple)', marginBottom: '20px', textTransform: 'uppercase' }}>
              GAMIFIED UNBOXING EXPERIENCE
            </p>
            <h1 style={{
              fontFamily: S.display,
              fontSize: 'clamp(72px, 10vw, 128px)',
              lineHeight: 0.88,
              color: 'var(--ghost)',
              letterSpacing: '0.02em',
              marginBottom: '28px',
            }}>
              MYSTERY<br />
              <span style={{ color: 'var(--purple)' }}>BOXY</span>
            </h1>
            <p style={{ fontFamily: S.body, fontSize: '17px', lineHeight: 1.75, color: 'var(--dim)', maxWidth: '500px', marginBottom: '32px' }}>
              Toto je najčistejší zážitok z Pokemon kariet. Vyber tier — my zostavíme obsah. Každý mystery box je ručne pripravený s garantovanou hodnotou.
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
              {[
                { label: 'Garantovaná hodnota', color: 'var(--green)' },
                { label: 'Originálne produkty', color: 'var(--blue)' },
                { label: 'Žiadne duplikáty', color: 'var(--purple)' },
                { label: 'Ručne zostavené', color: 'var(--orange)' },
              ].map((b, i) => (
                <span key={i} style={{
                  fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.1em',
                  padding: '7px 14px',
                  border: `1px solid ${b.color}50`,
                  color: b.color,
                  background: `${b.color}10`,
                }}>✓ {b.label}</span>
              ))}
            </div>

            {/* Live win ticker */}
            <WinTicker />
          </motion.div>

          {/* Right: animated box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ height: 420, position: 'relative' }}
          >
            <HeroBox color="#8B5CF6" />
          </motion.div>
        </div>

        {/* Stats row */}
        <div style={{ maxWidth: '1400px', margin: '48px auto 0', padding: '0 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--surface-2)', borderLeft: '1px solid var(--surface-2)' }}>
            {[
              { num: '1 200+', label: 'Otvorených boxov' },
              { num: '€48 000+', label: 'Hodnota výhier' },
              { num: '98%', label: 'Spokojnosť zákazníkov' },
              { num: '24H', label: 'Odoslanie po objednávke' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ padding: '24px 28px', borderRight: '1px solid var(--surface-2)', borderBottom: '1px solid var(--surface-2)' }}
              >
                <p style={{ fontFamily: S.display, fontSize: '36px', color: 'var(--purple)', letterSpacing: '0.04em', lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontFamily: S.mono, fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.2em', marginTop: '6px', textTransform: 'uppercase' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section style={{ padding: '48px 0', background: 'var(--surface)', borderBottom: '1px solid var(--surface-2)', textAlign: 'center' }}>
        <CountdownTimer label="NOVÝ DROP ZA" targetHours={6} />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ marginBottom: '56px' }}>
            <p style={{ fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: '12px', textTransform: 'uppercase' }}>POSTUP</p>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(48px, 6vw, 80px)', color: 'var(--ghost)', lineHeight: 1 }}>AKO TO FUNGUJE</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                style={{ padding: '36px 32px', background: 'var(--surface)', border: '1px solid var(--surface-2)', position: 'relative' }}
              >
                <p style={{ fontFamily: S.display, fontSize: '72px', lineHeight: 1, color: 'rgba(139,92,246,0.1)', marginBottom: '8px' }}>{step.num}</p>
                <h3 style={{ fontFamily: S.display, fontSize: '24px', color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: '14px' }}>{step.title}</h3>
                <p style={{ fontFamily: S.body, fontSize: '14px', lineHeight: 1.65, color: 'var(--dim)' }}>{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <span style={{ position: 'absolute', right: '-13px', top: '50%', transform: 'translateY(-50%)', fontFamily: S.mono, fontSize: '20px', color: 'var(--surface-2)', zIndex: 2 }}>→</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIERS ── */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: '12px', textTransform: 'uppercase' }}>5 TIEROV</p>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(56px, 7vw, 96px)', color: 'var(--ghost)', lineHeight: 1 }}>VYBER SI TIER</h2>
            <p style={{ fontFamily: S.mono, fontSize: '10px', color: 'var(--dim)', marginTop: '12px', letterSpacing: '0.2em' }}>KLIKNI NA BOX PRE 3D REVEAL</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {MYSTERY_BOX_TIERS.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex', flexDirection: 'column',
                  background: 'var(--surface)',
                  border: `1px solid ${tier.color}35`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-8px)'
                  el.style.boxShadow = `0 20px 60px ${tier.color}22, 0 0 0 1px ${tier.color}50`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Top color bar */}
                <div style={{ height: '3px', background: tier.color, boxShadow: `0 0 16px ${tier.color}` }} />

                {/* Card flip area */}
                <div style={{ width: '100%', paddingBottom: '140%', position: 'relative' }}>
                  <div
                    style={{ position: 'absolute', inset: 0, perspective: '1000px', cursor: 'pointer' }}
                    onClick={() => setFlipped(p => ({ ...p, [i]: !p[i] }))}
                  >
                    <div style={{
                      width: '100%', height: '100%',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}>
                      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
                        <BoxFront color={tier.color} />
                      </div>
                      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={TIER_IMAGES[i]} alt={tier.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 0%, rgba(255,210,110,0.3) 35%, rgba(100,200,255,0.3) 65%, transparent 100%)', backgroundSize: '200% 200%', animation: 'holo 3s linear infinite', mixBlendMode: 'color-dodge', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 16px 14px', background: 'linear-gradient(transparent, rgba(0,0,0,0.92))', textAlign: 'center' }}>
                          <span style={{ fontFamily: S.display, fontSize: '16px', letterSpacing: '0.18em', color: tier.color }}>✓ ODHALENÉ</span>
                        </div>
                        <div style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 40px ${tier.color}25`, pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '20px 18px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: S.display, fontSize: '28px', color: tier.color, letterSpacing: '0.08em', marginBottom: '2px' }}>
                    {tier.name.toUpperCase()}
                  </h3>
                  <p style={{ fontFamily: S.mono, fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.2em', marginBottom: '16px' }}>MYSTERY BOX</p>

                  <p style={{ fontFamily: S.mono, fontSize: '28px', fontWeight: 700, color: 'var(--ghost)', marginBottom: '12px', lineHeight: 1 }}>
                    {formatPrice(tier.price)}
                  </p>

                  <div style={{
                    width: '100%', padding: '8px 10px', marginBottom: '16px', textAlign: 'center',
                    background: `${tier.color}10`, border: `1px solid ${tier.color}25`,
                    fontFamily: S.mono, fontSize: '10px',
                  }}>
                    <span style={{ color: 'var(--dim)' }}>HODNOTA </span>
                    <span style={{ color: tier.color, fontWeight: 700 }}>
                      {formatPrice(tier.min_value)}–{formatPrice(tier.max_value)}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '0 18px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', flex: 1 }}>
                    {tier.possible_cards.map((item, j) => (
                      <li key={j} style={{
                        display: 'flex', gap: '7px', alignItems: 'flex-start',
                        marginBottom: '7px', fontFamily: S.body, fontSize: '12px', color: 'var(--ghost)', lineHeight: 1.4,
                      }}>
                        <span style={{ color: tier.color, flexShrink: 0, fontWeight: 700, marginTop: '1px' }}>→</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div style={{
                    padding: '7px', marginBottom: '14px', textAlign: 'center',
                    background: 'var(--surface-2)', fontFamily: S.mono, fontSize: '10px',
                  }}>
                    <span style={{ color: 'var(--dim)' }}>BONUS ŠANCA </span>
                    <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{tier.bonus_chance}%</span>
                  </div>

                  <p style={{ fontFamily: S.body, fontSize: '11px', color: 'var(--dim)', textAlign: 'center', marginBottom: '18px', lineHeight: 1.5 }}>
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARANTEE ── */}
      <section style={{ padding: '80px 0', background: 'var(--surface)', borderTop: '1px solid var(--surface-2)', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: '12px', textTransform: 'uppercase' }}>NAŠE ZÁVÄZKY</p>
              <h2 style={{ fontFamily: S.display, fontSize: 'clamp(44px, 5vw, 72px)', color: 'var(--ghost)', lineHeight: 1, marginBottom: '24px' }}>
                FÉROVÝ<br /><span style={{ color: 'var(--purple)' }}>MYSTERY</span>
              </h2>
              <p style={{ fontFamily: S.body, fontSize: '16px', lineHeight: 1.75, color: 'var(--dim)', maxWidth: '440px' }}>
                Každý box je ručne zostavený — nie algoritmom. Garantujeme minimálnu trhovú hodnotu obsahu. Ak nesplníme záväzok, vrátime rozdiel bez diskusie.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
              {[
                { icon: '🔒', title: 'ZÁRUKA HODNOTY', desc: 'Trhová hodnota obsahu vždy ≥ cena tieru. Garantované.' },
                { icon: '🎯', title: 'ŽIADNE DUPLIKÁTY', desc: 'Opakovaní zákazníci nikdy nedostanú rovnakú kartu.' },
                { icon: '📦', title: 'CHRÁNENÉ BALENIE', desc: 'Topcloadery + bubble wrap. Karty dorazia v perfektnom stave.' },
                { icon: '⚡', title: '24H ODOSLANIE', desc: 'Box zostavíme a odošleme do 24 hodín od platby.' },
              ].map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  style={{ padding: '24px 20px', background: 'var(--void)', border: '1px solid var(--surface-2)' }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>{g.icon}</div>
                  <h4 style={{ fontFamily: S.display, fontSize: '16px', color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: '8px' }}>{g.title}</h4>
                  <p style={{ fontFamily: S.body, fontSize: '12px', lineHeight: 1.6, color: 'var(--dim)' }}>{g.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PREVIOUS OPENS ── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.9)', animation: 'badge-pulse 1.5s ease-in-out infinite' }} />
              <span style={{ fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.3em', color: 'var(--green)' }}>LIVE VÝHRY</span>
            </div>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(40px, 5vw, 64px)', color: 'var(--ghost)', lineHeight: 1 }}>ČO DOSTALI INÍ</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {WIN_FEED.map((open, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px',
                  background: 'var(--surface)', border: `1px solid ${open.color}18`,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${open.color}45` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${open.color}18` }}
              >
                <div style={{
                  width: '40px', height: '40px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${open.color}18`, color: open.color,
                  fontFamily: S.display, fontSize: '20px',
                  border: `1px solid ${open.color}30`,
                }}>{open.tier[0]}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: S.mono, fontSize: '10px', color: 'var(--dim)', marginBottom: '3px' }}>
                    {open.user} — <span style={{ color: open.color }}>{open.tier} BOX</span>
                  </p>
                  <p style={{ fontFamily: S.body, fontWeight: 700, fontSize: '13px', color: 'var(--ghost)' }}>{open.got}</p>
                </div>
                <p style={{ fontFamily: S.mono, fontSize: '14px', fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>{open.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 0', background: 'var(--surface)', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: '12px', textTransform: 'uppercase' }}>OTÁZKY</p>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(44px, 5vw, 68px)', color: 'var(--ghost)', lineHeight: 1 }}>FAQ</h2>
          </div>
          {FAQ.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} idx={i} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: '100px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <p style={{ fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: '16px' }}>PRIPRAVENÝ?</p>
          <h2 style={{ fontFamily: S.display, fontSize: 'clamp(52px, 7vw, 96px)', color: 'var(--ghost)', letterSpacing: '0.03em', lineHeight: 0.92, marginBottom: '20px' }}>
            OTVOR SVOJ<br /><span style={{ color: 'var(--purple)' }}>MYSTERY BOX</span>
          </h2>
          <p style={{ fontFamily: S.body, fontSize: '16px', color: 'var(--dim)', marginBottom: '40px', maxWidth: '440px', margin: '0 auto 40px' }}>
            Vyber tier, objednaj a zistí čo ťa čaká. Každý box je iný. Každý box je nezabudnuteľný.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ padding: '18px 52px', fontSize: '13px', letterSpacing: '0.15em' }}
              onClick={() => document.getElementById('tiers-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              VYBRAŤ TIER →
            </button>
            <Link href="/shop">
              <button style={{
                padding: '18px 36px', fontSize: '13px', letterSpacing: '0.15em',
                fontFamily: 'Inter Tight, sans-serif', fontWeight: 700, textTransform: 'uppercase',
                background: 'none', border: '1px solid var(--surface-2)', color: 'var(--dim)',
                cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ghost)'; e.currentTarget.style.color = 'var(--ghost)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--dim)' }}
              >
                POZRIEŤ SINGLES
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
    </>
  )
}
