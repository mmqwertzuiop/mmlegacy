'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MYSTERY_BOX_TIERS, formatPrice } from '@/data/products'
import CountdownTimer from '@/components/ui/CountdownTimer'
import PageIntro from '@/components/ui/PageIntro'

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
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

// Per-tier metadata: stock, popularity %, badge, last sold, live browsers
const TIER_META = [
  { stock: 8,  maxStock: 50, popularity: 42, badge: null,          lastSold: '3h',      browsers: 3 },
  { stock: 6,  maxStock: 30, popularity: 58, badge: null,          lastSold: '1h 20m',  browsers: 5 },
  { stock: 4,  maxStock: 20, popularity: 76, badge: 'BESTSELLER',  lastSold: '28 min',  browsers: 9 },
  { stock: 3,  maxStock: 10, popularity: 87, badge: 'ODPORÚČAME',  lastSold: '41 min',  browsers: 6 },
  { stock: 2,  maxStock: 5,  popularity: 95, badge: 'LIMITOVANÝ',  lastSold: '12 min',  browsers: 4 },
]

// Comparison table rows
const COMPARE_ROWS = [
  { label: 'Booster packy',     vals: ['3 packy', '6 packov', '10–15', '+ celý box', '2× box'] },
  { label: 'Holographic karta', vals: ['✓', '✓', '✓', '✓', '✓'] },
  { label: 'Ultra Rare',        vals: ['šanca', 'šanca', '✓ garantovaná', '2× ✓', '3× SIR'] },
  { label: 'PSA Graded karta',  vals: ['—', '—', 'možné', '✓ PSA 9+', '2× PSA 10'] },
  { label: 'Exkluzívny sleeve', vals: ['—', '✓', '✓', '✓', '✓ Premium'] },
  { label: 'VIP Diamond Club',  vals: ['—', '—', '—', '—', '3 mesiace'] },
  { label: 'Signed certifikát', vals: ['—', '—', '—', '—', '✓'] },
  { label: 'Bonus šanca',       vals: ['20%', '35%', '25%', '15%', '10%'] },
]

const STEPS = [
  { num: '01', icon: '🎯', title: 'VYBER TIER', desc: 'Bronze až Diamond — každý tier má garantovanú minimálnu hodnotu obsahu.' },
  { num: '02', icon: '💳', title: 'OBJEDNAJ', desc: 'Bezpečná platba kartou alebo PayPal. Box ručne zostavíme do 24 hodín.' },
  { num: '03', icon: '📦', title: 'OTVOR & VYHRÁVAJ', desc: 'Box dorazí v ochrannom balení. Každý box je unikátny — žiadne duplikáty.' },
]

const FAQ = [
  { q: 'Je garantovaná minimálna hodnota naozaj garantovaná?', a: 'Áno. Každý box obsahuje karty s trhovú hodnotou minimálne na úrovni uvedenej pre daný tier. Ak by sme to nedodržali, vrátime rozdiel bez diskusie.' },
  { q: 'Aké karty môžem dostať?', a: 'Záleží od tieru. Bronze obsahuje rare + holo singles. Diamond obsahuje PSA graded karty, booster boxy aj SIR karty — trhová hodnota 350€ až 1000€+.' },
  { q: 'Ako dlho trvá doručenie?', a: 'Box zostavíme do 24 hodín, doručenie 2–4 pracovné dni. Karty sú chránené v topcloaderoch a bubble wrap obale.' },
  { q: 'Môžem dostať duplicitu z predchádzajúceho boxu?', a: 'Nie. Každý box je unikátny — opakovaní zákazníci nikdy nedostanú rovnakú kartu dvakrát.' },
  { q: 'Čo ak nie som spokojný s obsahom?', a: 'Zákaznícka spokojnosť je pre nás priorita. Ak box nespĺňa garantovanú hodnotu, riešime to okamžite — výmena alebo vrátenie.' },
]

const S = {
  mono: 'Space Mono, monospace' as const,
  display: 'Bebas Neue, sans-serif' as const,
  body: 'Inter Tight, sans-serif' as const,
}

// ─────────────────────────────────────────────────────────────
// ANIMATED COUNT-UP
// ─────────────────────────────────────────────────────────────
function CountUp({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const ran = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true
        let cur = 0
        const step = 16
        const inc = target / (1600 / step)
        const t = setInterval(() => {
          cur += inc
          if (cur >= target) { setCount(target); clearInterval(t) }
          else setCount(Math.floor(cur))
        }, step)
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{prefix}{count.toLocaleString('sk-SK')}{suffix}</span>
}

// ─────────────────────────────────────────────────────────────
// LIVE WIN TICKER
// ─────────────────────────────────────────────────────────────
function WinTicker() {
  const [idx, setIdx] = useState(0)
  const [vis, setVis] = useState(true)
  useEffect(() => {
    const iv = setInterval(() => {
      setVis(false)
      setTimeout(() => { setIdx(i => (i + 1) % WIN_FEED.length); setVis(true) }, 320)
    }, 3400)
    return () => clearInterval(iv)
  }, [])
  const w = WIN_FEED[idx]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', background: 'var(--surface-2)', border: `1px solid ${w.color}22`, maxWidth: 480 }}>
      <div className="live-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.9)', flexShrink: 0 }} />
      <AnimatePresence mode="wait">
        {vis && (
          <motion.div key={idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.25 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1 }}>
            <span style={{ fontFamily: S.mono, fontSize: 10, color: 'var(--dim)', letterSpacing: '0.1em' }}>{w.user}</span>
            <span style={{ fontFamily: S.mono, fontSize: 9, color: w.color, background: `${w.color}12`, border: `1px solid ${w.color}30`, padding: '2px 7px', letterSpacing: '0.12em' }}>{w.tier}</span>
            <span style={{ fontFamily: S.body, fontSize: 12, color: 'var(--ghost)' }}>{w.got}</span>
            <span style={{ fontFamily: S.mono, fontSize: 11, fontWeight: 700, color: 'var(--green)', marginLeft: 'auto' }}>{w.value}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FAQ ITEM
// ─────────────────────────────────────────────────────────────
function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }}
      style={{ borderBottom: '1px solid var(--surface-2)' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontFamily: S.display, fontSize: 18, color: 'var(--ghost)', letterSpacing: '0.04em', paddingRight: 16 }}>{q}</span>
        <span style={{ fontFamily: S.mono, fontSize: 18, color: 'var(--purple)', flexShrink: 0, transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}>
            <p style={{ fontFamily: S.body, fontSize: 14, lineHeight: 1.7, color: 'var(--dim)', paddingBottom: 20 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// HERO BOX (animated floating SVG)
// ─────────────────────────────────────────────────────────────
function HeroBox() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', inset: '10%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.45) 0%, transparent 65%)', filter: 'blur(32px)', animation: 'box-glow-pulse 3s ease-in-out infinite' }} />
      {[0,1,2,3,4,5,6,7,8,9].map(j => (
        <div key={j} style={{ position: 'absolute', width: j%3===0?'3px':'2px', height: j%3===0?'3px':'2px', borderRadius: '50%', background: j%2===0?'#8B5CF6':'#FA5D29', opacity: 0.55, left: `${8+j*9}%`, top: `${15+(j%5)*14}%`, animation: `float-particle ${3.5+j*0.5}s linear infinite`, animationDelay: `${j*0.4}s`, boxShadow: `0 0 6px ${j%2===0?'#8B5CF6':'#FA5D29'}` }} />
      ))}
      <div style={{ animation: 'box-float 4s ease-in-out infinite', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 220 260" style={{ width: '78%', filter: 'drop-shadow(0 20px 50px rgba(139,92,246,0.55)) drop-shadow(0 0 80px rgba(139,92,246,0.33))' }}>
          <rect x="16" y="116" width="188" height="128" rx="3" fill="rgba(139,92,246,0.14)" stroke="rgba(139,92,246,0.9)" strokeWidth="1.8"/>
          <rect x="16" y="116" width="188" height="8" fill="rgba(139,92,246,0.35)" rx="3"/>
          <rect x="97" y="116" width="26" height="128" fill="rgba(139,92,246,0.2)"/>
          <rect x="16" y="172" width="188" height="14" fill="rgba(139,92,246,0.16)"/>
          <rect x="26" y="124" width="5" height="112" fill="rgba(139,92,246,0.12)" rx="2.5"/>
          <text x="110" y="206" textAnchor="middle" fontSize="62" fill="rgba(139,92,246,0.88)" fontFamily="Bebas Neue, sans-serif">?</text>
          <text x="36" y="138" fontSize="13" fill="rgba(139,92,246,0.5)">★</text>
          <text x="180" y="134" fontSize="11" fill="rgba(139,92,246,0.42)">★</text>
          <text x="28" y="218" fontSize="9" fill="rgba(139,92,246,0.32)">✦</text>
          <text x="186" y="226" fontSize="11" fill="rgba(139,92,246,0.42)">✦</text>
          <circle cx="168" cy="148" r="2.5" fill="rgba(139,92,246,0.3)"/>
          <circle cx="62" cy="188" r="2" fill="rgba(139,92,246,0.25)"/>
          <rect x="12" y="62" width="196" height="56" rx="3" fill="rgba(139,92,246,0.18)" stroke="rgba(139,92,246,0.9)" strokeWidth="1.8"/>
          <rect x="12" y="62" width="196" height="9" fill="rgba(139,92,246,0.32)" rx="3"/>
          <rect x="97" y="62" width="26" height="56" fill="rgba(139,92,246,0.22)"/>
          <rect x="12" y="80" width="196" height="14" fill="rgba(139,92,246,0.18)"/>
          <rect x="12" y="62" width="196" height="5" fill="rgba(255,255,255,0.12)" rx="3"/>
          <path d="M110 62 C92 38 60 38 63 54 C66 68 92 64 110 62Z" fill="rgba(139,92,246,0.92)"/>
          <path d="M110 62 C94 42 66 43 69 55 C72 65 93 62 110 62Z" fill="rgba(0,0,0,0.2)"/>
          <path d="M110 62 C128 38 160 38 157 54 C154 68 128 64 110 62Z" fill="rgba(139,92,246,0.92)"/>
          <path d="M110 62 C126 42 154 43 151 55 C148 65 127 62 110 62Z" fill="rgba(0,0,0,0.2)"/>
          <ellipse cx="110" cy="62" rx="13" ry="11" fill="rgba(139,92,246,1)"/>
          <ellipse cx="110" cy="62" rx="6.5" ry="5.5" fill="rgba(0,0,0,0.22)"/>
          <ellipse cx="107" cy="59" rx="3" ry="2.5" fill="rgba(255,255,255,0.35)"/>
        </svg>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// BOX FRONT (tier card face)
// ─────────────────────────────────────────────────────────────
function BoxFront({ color }: { color: string }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}06`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 65%, ${color}22 0%, transparent 62%)` }} />
      {[0,1,2,3,4,5,6,7].map(j => (
        <div key={j} style={{ position: 'absolute', width: '2px', height: '2px', borderRadius: '50%', background: color, opacity: 0.38, left: `${12+j*11}%`, top: `${18+(j%4)*18}%`, animation: `float-particle ${3.5+j*0.4}s linear infinite`, animationDelay: `${j*0.45}s` }} />
      ))}
      <svg viewBox="0 0 180 205" style={{ width: '74%', position: 'relative', zIndex: 1, filter: `drop-shadow(0 14px 32px ${color}55)` }}>
        <rect x="14" y="52" width="152" height="44" rx="2" fill={`${color}18`} stroke={color} strokeWidth="1.3"/>
        <rect x="14" y="52" width="152" height="7" fill={`${color}30`} rx="2"/>
        <rect x="14" y="65" width="152" height="11" fill={`${color}20`}/>
        <rect x="79" y="52" width="22" height="44" fill={`${color}20`}/>
        <path d="M90 52 C78 33 54 34 57 48 C60 59 80 55 90 52Z" fill={color} opacity="0.88"/>
        <path d="M90 52 C80 37 61 39 64 49 C67 57 81 54 90 52Z" fill="rgba(0,0,0,0.18)"/>
        <path d="M90 52 C102 33 126 34 123 48 C120 59 100 55 90 52Z" fill={color} opacity="0.88"/>
        <path d="M90 52 C100 37 119 39 116 49 C113 57 99 54 90 52Z" fill="rgba(0,0,0,0.18)"/>
        <ellipse cx="90" cy="52" rx="10" ry="8" fill={color}/>
        <ellipse cx="90" cy="52" rx="5" ry="4" fill="rgba(0,0,0,0.2)"/>
        <rect x="14" y="96" width="152" height="100" rx="2" fill={`${color}12`} stroke={color} strokeWidth="1.3"/>
        <rect x="14" y="96" width="152" height="5" fill={`${color}28`}/>
        <rect x="79" y="96" width="22" height="100" fill={`${color}18`}/>
        <rect x="14" y="138" width="152" height="11" fill={`${color}14`}/>
        <rect x="23" y="102" width="4" height="84" fill={`${color}10`} rx="2"/>
        <text x="90" y="166" textAnchor="middle" fontSize="46" fill={color} fontFamily="Bebas Neue, sans-serif" opacity="0.92">?</text>
        <text x="30" y="113" fontSize="11" fill={color} opacity="0.5">★</text>
        <text x="146" y="109" fontSize="9" fill={color} opacity="0.42">★</text>
      </svg>
      <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center' }}>
        <span style={{ fontFamily: S.mono, fontSize: 7, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>klikni pre reveal</span>
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

// ─────────────────────────────────────────────────────────────
// PAYMENT BADGES
// ─────────────────────────────────────────────────────────────
function PaymentBadges() {
  const badges = [
    { label: 'VISA',       color: '#1A1F71', textColor: '#fff' },
    { label: 'MASTERCARD', color: '#EB001B', textColor: '#fff' },
    { label: 'PAYPAL',     color: '#003087', textColor: '#fff' },
    { label: 'APPLE PAY',  color: '#000', textColor: '#fff', border: '1px solid #333' },
    { label: 'GOOGLE PAY', color: '#fff', textColor: '#000' },
    { label: '🔒 SSL 256-BIT', color: 'transparent', textColor: 'var(--green)', border: '1px solid rgba(34,197,94,0.3)' },
  ]
  return (
    <div className="payment-badges">
      {badges.map((b, i) => (
        <div key={i} className="pay-badge" style={{ background: b.color, color: b.textColor, border: b.border ?? '1px solid transparent', fontSize: 9 }}>
          {b.label}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function MysteryBoxyPage() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const tiersRef = useRef<HTMLDivElement>(null)

  const scrollToTiers = useCallback(() => {
    tiersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
    <PageIntro type="mystery" title="MYSTERY BOXY" subtitle="GAMIFIED UNBOXING" />
    <div style={{ background: 'var(--void)', minHeight: '100vh', paddingBottom: 80 }}>

      {/* ── TRUST STRIP ── */}
      <div className="trust-strip">
        <div className="trust-strip-item" style={{ color: 'var(--green)' }}><span>🔒</span> Bezpečná platba</div>
        <div className="trust-strip-item"><span>📦</span> Doručenie 2–4 dni</div>
        <div className="trust-strip-item"><span>✓</span> Originálne produkty</div>
        <div className="trust-strip-item"><span>⭐</span> 1 200+ spokojných zákazníkov</div>
        <div className="trust-strip-item hide-mobile" style={{ color: 'var(--orange)' }}><span>🎁</span> Každý box ručne zostavený</div>
        <div className="trust-strip-item hide-mobile"><span>↩</span> Vrátenie do 14 dní</div>
      </div>

      {/* ── BREADCRUMB ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 48px 0', display: 'flex', alignItems: 'center', gap: 8 }} className="px-section">
        <Link href="/" style={{ fontFamily: S.mono, fontSize: 10, color: 'var(--dim)', textDecoration: 'none', letterSpacing: '0.15em' }}>DOMOV</Link>
        <span style={{ color: 'var(--surface-2)', fontSize: 10 }}>›</span>
        <span style={{ fontFamily: S.mono, fontSize: 10, color: 'var(--ghost)', letterSpacing: '0.15em' }}>MYSTERY BOXY</span>
      </div>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', padding: '44px 0 64px', overflow: 'hidden', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025, backgroundImage: 'linear-gradient(var(--surface-2) 1px,transparent 1px),linear-gradient(90deg,var(--surface-2) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div style={{ position: 'absolute', top: '-20%', right: '-6%', width: 520, height: 520, background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div className="mystery-hero-grid px-section" style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, x: -36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}>
            <p style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: '0.45em', color: 'var(--purple)', marginBottom: 18, textTransform: 'uppercase' }}>GAMIFIED UNBOXING EXPERIENCE</p>
            <h1 style={{ fontFamily: S.display, fontSize: 'clamp(68px,10vw,128px)', lineHeight: 0.88, color: 'var(--ghost)', letterSpacing: '0.02em', marginBottom: 24 }}>
              MYSTERY<br /><span style={{ color: 'var(--purple)' }}>BOXY</span>
            </h1>
            <p style={{ fontFamily: S.body, fontSize: 17, lineHeight: 1.75, color: 'var(--dim)', maxWidth: 480, marginBottom: 28 }}>
              Vyber tier — my zostavíme obsah. Každý mystery box je ručne pripravený s <strong style={{ color: 'var(--ghost)' }}>garantovanou hodnotou</strong> a žiadnymi duplikátmi.
            </p>
            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 28 }}>
              {[['✓ Garantovaná hodnota','var(--green)'],['✓ Originálne produkty','var(--blue)'],['✓ Žiadne duplikáty','var(--purple)'],['✓ Ručne zostavené','var(--orange)']].map(([l,c],i) => (
                <span key={i} style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: '0.1em', padding: '7px 13px', border: `1px solid ${c}50`, color: c, background: `${c}10` }}>{l}</span>
              ))}
            </div>
            {/* Live win ticker */}
            <WinTicker />
            {/* CTA */}
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ padding: '16px 44px', fontSize: 13, letterSpacing: '0.15em' }} onClick={scrollToTiers}>
                VYBRAŤ TIER →
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', border: '1px solid var(--surface-2)', fontFamily: S.mono, fontSize: 10, color: 'var(--dim)' }}>
                <div className="live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                <span><span style={{ color: 'var(--ghost)' }}>24</span> ľudí práve prezerá</span>
              </div>
            </div>
          </motion.div>

          {/* Hero box */}
          <motion.div className="mystery-hero-box" initial={{ opacity: 0, scale: 0.84, x: 36 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1, ease: [0.16,1,0.3,1], delay: 0.18 }} style={{ height: 420, position: 'relative' }}>
            <HeroBox />
          </motion.div>
        </div>

        {/* Stats row */}
        <div style={{ maxWidth: 1400, margin: '44px auto 0' }} className="px-section">
          <div className="mystery-stats-grid">
            {[
              { num: 1200, suf: '+', label: 'Otvorených boxov', col: 'var(--purple)' },
              { num: 48000, pre: '€', label: 'Hodnota výhier', col: 'var(--green)' },
              { num: 98, suf: '%', label: 'Spokojnosť zákazníkov', col: 'var(--gold)' },
              { num: 24, suf: 'H', label: 'Odoslanie po objednávke', col: 'var(--orange)' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, delay: i * 0.07 }}
                style={{ padding: '22px 26px', borderRight: '1px solid var(--surface-2)', borderBottom: '1px solid var(--surface-2)' }}>
                <p className="count-up-num" style={{ color: s.col }}>
                  <CountUp target={s.num} suffix={s.suf} prefix={s.pre} />
                </p>
                <p style={{ fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', letterSpacing: '0.2em', marginTop: 6, textTransform: 'uppercase' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section style={{ padding: '44px 0', background: 'var(--surface)', borderBottom: '1px solid var(--surface-2)', textAlign: 'center' }}>
        <CountdownTimer label="NOVÝ DROP ZA" targetHours={6} />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }} className="px-section">
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: 12, textTransform: 'uppercase' }}>POSTUP</p>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(44px,6vw,80px)', color: 'var(--ghost)', lineHeight: 1 }}>AKO TO FUNGUJE</h2>
          </div>
          <div className="mystery-steps-grid">
            {STEPS.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
                style={{ padding: '32px 28px', background: 'var(--surface)', border: '1px solid var(--surface-2)', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
                  <span style={{ fontSize: 28 }}>{step.icon}</span>
                  <p style={{ fontFamily: S.display, fontSize: 64, lineHeight: 1, color: 'rgba(139,92,246,0.1)', userSelect: 'none' }}>{step.num}</p>
                </div>
                <h3 style={{ fontFamily: S.display, fontSize: 22, color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontFamily: S.body, fontSize: 14, lineHeight: 1.65, color: 'var(--dim)' }}>{step.desc}</p>
                {i < STEPS.length - 1 && <span className="hide-mobile" style={{ position: 'absolute', right: -13, top: '50%', transform: 'translateY(-50%)', fontFamily: S.mono, fontSize: 20, color: 'var(--surface-2)', zIndex: 2 }}>→</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIERS ── */}
      <section ref={tiersRef} style={{ padding: '72px 0' }} id="tiers">
        <div style={{ maxWidth: 1400, margin: '0 auto' }} className="px-section">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: 12, textTransform: 'uppercase' }}>5 TIEROV</p>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(52px,7vw,96px)', color: 'var(--ghost)', lineHeight: 1 }}>VYBER SI TIER</h2>
            <p style={{ fontFamily: S.mono, fontSize: 10, color: 'var(--dim)', marginTop: 10, letterSpacing: '0.2em' }}>KLIKNI NA BOX PRE 3D REVEAL</p>
          </div>

          <div className="mystery-tiers-grid">
            {MYSTERY_BOX_TIERS.map((tier, i) => {
              const meta = TIER_META[i]
              const stockPct = (meta.stock / meta.maxStock) * 100
              const isLow = meta.stock <= 3
              return (
                <motion.div key={tier.id}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16,1,0.3,1] }}
                  style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: `1px solid ${tier.color}35`, position: 'relative', transition: 'transform 0.28s ease, box-shadow 0.28s ease' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-7px)'; el.style.boxShadow=`0 20px 60px ${tier.color}22, 0 0 0 1px ${tier.color}50` }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(0)'; el.style.boxShadow='none' }}
                  onClick={() => setSelectedTier(i)}
                >
                  {/* Badge */}
                  {meta.badge && (
                    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 5, background: tier.color, color: '#000', fontFamily: S.mono, fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', padding: '4px 9px' }}>
                      {meta.badge}
                    </div>
                  )}

                  {/* Top bar */}
                  <div style={{ height: 3, background: tier.color, boxShadow: `0 0 16px ${tier.color}` }} />

                  {/* Card flip */}
                  <div style={{ width: '100%', paddingBottom: '140%', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, perspective: 1000, cursor: 'pointer' }}
                      onClick={e => { e.stopPropagation(); setFlipped(p => ({ ...p, [i]: !p[i] })) }}>
                      <div style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 0.85s cubic-bezier(0.16,1,0.3,1)', transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
                          <BoxFront color={tier.color} />
                        </div>
                        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={TIER_IMAGES[i]} alt={tier.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg,transparent 0%,rgba(255,210,110,0.3) 35%,rgba(100,200,255,0.3) 65%,transparent 100%)', backgroundSize: '200% 200%', animation: 'holo 3s linear infinite', mixBlendMode: 'color-dodge', pointerEvents: 'none' }} />
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 16px 14px', background: 'linear-gradient(transparent,rgba(0,0,0,0.92))', textAlign: 'center' }}>
                            <span style={{ fontFamily: S.display, fontSize: 16, letterSpacing: '0.18em', color: tier.color }}>✓ ODHALENÉ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '18px 16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: S.display, fontSize: 26, color: tier.color, letterSpacing: '0.08em', marginBottom: 2 }}>{tier.name.toUpperCase()}</h3>
                    <p style={{ fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', letterSpacing: '0.2em', marginBottom: 12 }}>MYSTERY BOX</p>

                    {/* Last sold */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                      <div className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                      <span style={{ fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', letterSpacing: '0.1em' }}>Predaný: <span style={{ color: 'var(--ghost)' }}>{meta.lastSold}</span> späť</span>
                    </div>

                    {/* Price + value anchor */}
                    <div style={{ width: '100%', textAlign: 'center', marginBottom: 10 }}>
                      <p style={{ fontFamily: S.mono, fontSize: 26, fontWeight: 700, color: 'var(--ghost)', lineHeight: 1, marginBottom: 4 }}>{formatPrice(tier.price)}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <span style={{ fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', textDecoration: 'line-through' }}>trhová hodnota</span>
                        <span style={{ fontFamily: S.mono, fontSize: 11, fontWeight: 700, color: tier.color }}>{formatPrice(tier.min_value)}–{formatPrice(tier.max_value)}</span>
                      </div>
                    </div>

                    {/* Stock bar */}
                    <div style={{ width: '100%', marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', letterSpacing: '0.1em' }}>DOSTUPNOSŤ</span>
                        <span style={{ fontFamily: S.mono, fontSize: 9, color: isLow ? '#EF4444' : 'var(--dim)', letterSpacing: '0.1em', fontWeight: isLow ? 700 : 400 }}>
                          {isLow ? `⚠ IBA ${meta.stock} ks` : `${meta.stock} ks`}
                        </span>
                      </div>
                      <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                        <div className="stock-bar-fill" style={{ '--fill': `${stockPct}%`, background: isLow ? '#EF4444' : tier.color, boxShadow: `0 0 8px ${isLow ? 'rgba(239,68,68,0.6)' : `${tier.color}88`}` } as React.CSSProperties} />
                      </div>
                    </div>

                    {/* Popularity */}
                    <div style={{ width: '100%', marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', letterSpacing: '0.1em' }}>POPULARITA</span>
                        <span style={{ fontFamily: S.mono, fontSize: 9, color: tier.color, letterSpacing: '0.1em' }}>{meta.popularity}%</span>
                      </div>
                      <div style={{ height: 3, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                        <div className="pop-bar-fill" style={{ '--pop': `${meta.popularity}%`, background: `linear-gradient(90deg, ${tier.color}88, ${tier.color})` } as React.CSSProperties} />
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0 16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', flex: 1 }}>
                      {tier.possible_cards.map((item, j) => (
                        <li key={j} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 6, fontFamily: S.body, fontSize: 12, color: 'var(--ghost)', lineHeight: 1.4 }}>
                          <span style={{ color: tier.color, flexShrink: 0, fontWeight: 700 }}>→</span>{item}
                        </li>
                      ))}
                    </ul>

                    <div style={{ padding: '7px', marginBottom: 12, textAlign: 'center', background: 'var(--surface-2)', fontFamily: S.mono, fontSize: 10 }}>
                      <span style={{ color: 'var(--dim)' }}>BONUS ŠANCA </span>
                      <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{tier.bonus_chance}%</span>
                    </div>

                    {/* Browsers watching */}
                    <div style={{ fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', textAlign: 'center', marginBottom: 12, letterSpacing: '0.1em' }}>
                      👁 <span style={{ color: 'var(--ghost)' }}>{meta.browsers}</span> ľudia si prezerajú tento tier
                    </div>

                    <button style={{ width: '100%', padding: '14px 0', fontFamily: S.mono, fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', background: tier.color, color: '#000', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.opacity='0.85'; e.currentTarget.style.transform='scale(0.98)' }}
                      onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='scale(1)' }}>
                      OBJEDNAŤ — {formatPrice(tier.price)}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARE TABLE ── */}
      <section style={{ padding: '72px 0', background: 'var(--surface)', borderTop: '1px solid var(--surface-2)', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }} className="px-section">
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: 12, textTransform: 'uppercase' }}>POROVNANIE</p>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(40px,5vw,72px)', color: 'var(--ghost)', lineHeight: 1 }}>ČO DOSTANEŠ</h2>
          </div>
          <div className="mystery-compare-wrap">
            <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--surface-2)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontFamily: S.mono, fontSize: 10, color: 'var(--dim)', letterSpacing: '0.2em', fontWeight: 400 }}></th>
                  {MYSTERY_BOX_TIERS.map((t, i) => (
                    <th key={i} style={{ textAlign: 'center', padding: '12px 10px', fontFamily: S.display, fontSize: 20, color: t.color, letterSpacing: '0.06em', fontWeight: 400, whiteSpace: 'nowrap' }}>{t.name}</th>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid var(--surface-2)', background: 'var(--void)' }}>
                  <td style={{ padding: '10px 16px', fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', letterSpacing: '0.15em' }}>CENA</td>
                  {MYSTERY_BOX_TIERS.map((t, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '10px 10px', fontFamily: S.mono, fontSize: 12, fontWeight: 700, color: 'var(--ghost)' }}>{formatPrice(t.price)}</td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid var(--surface-2)' }}>
                  <td style={{ padding: '10px 16px', fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', letterSpacing: '0.15em' }}>MIN. HODNOTA</td>
                  {MYSTERY_BOX_TIERS.map((t, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '10px 10px', fontFamily: S.mono, fontSize: 11, fontWeight: 700, color: MYSTERY_BOX_TIERS[i].color }}>{formatPrice(t.min_value)}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid var(--surface-2)', background: ri%2===0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: S.body, fontSize: 13, color: 'var(--ghost)', whiteSpace: 'nowrap' }}>{row.label}</td>
                    {row.vals.map((v, vi) => {
                      const isCheck = v === '✓' || v.startsWith('✓')
                      const isCross = v === '—'
                      return (
                        <td key={vi} style={{ textAlign: 'center', padding: '12px 10px', fontFamily: isCheck || isCross ? S.mono : S.body, fontSize: 12, color: isCross ? 'var(--surface-2)' : isCheck ? 'var(--green)' : 'var(--ghost)', whiteSpace: 'nowrap' }}>
                          {v}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PAYMENT & TRUST ── */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--surface-2)', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="px-section">
          <p style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: '0.35em', color: 'var(--dim)', marginBottom: 24, textTransform: 'uppercase' }}>BEZPEČNÁ PLATBA — AKCEPTUJEME</p>
          <PaymentBadges />
          <p style={{ fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', marginTop: 18, letterSpacing: '0.15em' }}>
            Všetky platby sú šifrované 256-bit SSL. Tvoje údaje nikdy nezdieľame.
          </p>
        </div>
      </section>

      {/* ── GUARANTEE ── */}
      <section style={{ padding: '72px 0', background: 'var(--surface)', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }} className="px-section">
          <div className="mystery-guarantee-grid">
            <div>
              <p style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: 12, textTransform: 'uppercase' }}>NAŠE ZÁVÄZKY</p>
              <h2 style={{ fontFamily: S.display, fontSize: 'clamp(40px,5vw,72px)', color: 'var(--ghost)', lineHeight: 1, marginBottom: 20 }}>
                FÉROVÝ<br /><span style={{ color: 'var(--purple)' }}>MYSTERY</span>
              </h2>
              <p style={{ fontFamily: S.body, fontSize: 15, lineHeight: 1.75, color: 'var(--dim)', maxWidth: 420, marginBottom: 24 }}>
                Každý box je ručne zostavený — nie algoritmom. Garantujeme minimálnu trhovú hodnotu obsahu. Ak nesplníme záväzok, vrátime rozdiel bez diskusie.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['🔒', 'Trhová hodnota obsahu vždy ≥ cena tieru'],
                  ['📦', 'Topcloadery + bubble wrap — karty v perfektnom stave'],
                  ['⚡', 'Odoslanie do 24 hodín od platby'],
                  ['↩', 'Riešime každý problém — vrátenie do 14 dní'],
                ].map(([icon, text], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: S.body, fontSize: 14, color: 'var(--dim)' }}>
                    <span style={{ fontSize: 18 }}>{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>
            <div className="mystery-guarantee-inner">
              {[
                { icon: '🔒', title: 'ZÁRUKA HODNOTY', desc: 'Trhová hodnota obsahu vždy ≥ cena tieru. Garantované.' },
                { icon: '🎯', title: 'ŽIADNE DUPLIKÁTY', desc: 'Opakovaní zákazníci nikdy nedostanú rovnakú kartu.' },
                { icon: '📦', title: 'CHRÁNENÉ BALENIE', desc: 'Topcloadery + bubble wrap. Karty dorazia v perfektnom stave.' },
                { icon: '⚡', title: '24H ODOSLANIE', desc: 'Box zostavíme a odošleme do 24 hodín od platby.' },
              ].map((g, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.38, delay: i * 0.07 }}
                  style={{ padding: '24px 20px', background: 'var(--void)', border: '1px solid var(--surface-2)' }}>
                  <div style={{ fontSize: 24, marginBottom: 12 }}>{g.icon}</div>
                  <h4 style={{ fontFamily: S.display, fontSize: 16, color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: 8 }}>{g.title}</h4>
                  <p style={{ fontFamily: S.body, fontSize: 12, lineHeight: 1.6, color: 'var(--dim)' }}>{g.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PREVIOUS OPENS ── */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="px-section">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div className="live-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.9)' }} />
              <span style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: '0.3em', color: 'var(--green)' }}>LIVE VÝHRY</span>
            </div>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(38px,5vw,64px)', color: 'var(--ghost)', lineHeight: 1 }}>ČO DOSTALI INÍ</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {WIN_FEED.map((open, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.055 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 17px', background: 'var(--surface)', border: `1px solid ${open.color}18`, transition: 'border-color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor=`${open.color}45` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=`${open.color}18` }}>
                <div style={{ width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${open.color}18`, color: open.color, fontFamily: S.display, fontSize: 20, border: `1px solid ${open.color}30` }}>{open.tier[0]}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: S.mono, fontSize: 10, color: 'var(--dim)', marginBottom: 3 }}>{open.user} — <span style={{ color: open.color }}>{open.tier} BOX</span></p>
                  <p style={{ fontFamily: S.body, fontWeight: 700, fontSize: 13, color: 'var(--ghost)' }}>{open.got}</p>
                </div>
                <p style={{ fontFamily: S.mono, fontSize: 14, fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>{open.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '72px 0', background: 'var(--surface)', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }} className="px-section">
          <div style={{ marginBottom: 44 }}>
            <p style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: 12, textTransform: 'uppercase' }}>OTÁZKY</p>
            <h2 style={{ fontFamily: S.display, fontSize: 'clamp(40px,5vw,68px)', color: 'var(--ghost)', lineHeight: 1 }}>FAQ</h2>
          </div>
          {FAQ.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} i={i} />)}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: '96px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.02, backgroundImage: 'linear-gradient(var(--surface-2) 1px,transparent 1px),linear-gradient(90deg,var(--surface-2) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.16,1,0.3,1] }} style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: S.mono, fontSize: 10, letterSpacing: '0.4em', color: 'var(--purple)', marginBottom: 14 }}>PRIPRAVENÝ?</p>
          <h2 style={{ fontFamily: S.display, fontSize: 'clamp(48px,7vw,96px)', color: 'var(--ghost)', letterSpacing: '0.03em', lineHeight: 0.92, marginBottom: 18 }}>
            OTVOR SVOJ<br /><span style={{ color: 'var(--purple)' }}>MYSTERY BOX</span>
          </h2>
          <p style={{ fontFamily: S.body, fontSize: 16, color: 'var(--dim)', maxWidth: 420, margin: '0 auto 36px' }}>
            Vyber tier, objednaj a zistí čo ťa čaká. Každý box je iný. Každý box je nezabudnuteľný.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <button className="btn-primary" style={{ padding: '18px 52px', fontSize: 13, letterSpacing: '0.15em' }} onClick={scrollToTiers}>
              VYBRAŤ TIER →
            </button>
            <Link href="/shop">
              <button style={{ padding: '18px 36px', fontSize: 13, letterSpacing: '0.15em', fontFamily: 'Inter Tight, sans-serif', fontWeight: 700, textTransform: 'uppercase', background: 'none', border: '1px solid var(--surface-2)', color: 'var(--dim)', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--ghost)'; e.currentTarget.style.color='var(--ghost)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--surface-2)'; e.currentTarget.style.color='var(--dim)' }}>
                POZRIEŤ SINGLES
              </button>
            </Link>
          </div>
          {/* Mini payment row in CTA */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
            {['VISA', 'MASTERCARD', 'PAYPAL', '🔒 BEZPEČNÁ PLATBA'].map((b, i) => (
              <span key={i} style={{ fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', letterSpacing: '0.1em', padding: '4px 10px', border: '1px solid var(--surface-2)' }}>{b}</span>
            ))}
          </div>
        </motion.div>
      </section>

    </div>

    {/* ── STICKY MOBILE CTA ── */}
    <div className="sticky-mobile-cta">
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: S.mono, fontSize: 9, color: 'var(--dim)', letterSpacing: '0.1em' }}>OD</p>
        <p style={{ fontFamily: S.display, fontSize: 22, color: 'var(--ghost)', lineHeight: 1 }}>19.99 €</p>
      </div>
      <button className="btn-primary" style={{ padding: '14px 28px', fontSize: 12, letterSpacing: '0.15em', flexShrink: 0 }} onClick={scrollToTiers}>
        VYBRAŤ TIER →
      </button>
    </div>
    </>
  )
}
