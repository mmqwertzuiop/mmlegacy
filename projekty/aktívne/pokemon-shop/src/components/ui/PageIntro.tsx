'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MysteryBox3D from './MysteryBox3D'

export type PageIntroType = 'mystery' | 'psa' | 'booster' | 'singles' | 'collection' | 'vykup' | 'shop'

interface Props {
  type: PageIntroType
  title: string
  subtitle?: string
}

// ─── Deterministic particles ───────────────────────────────
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x:     (i * 127 % 100),
  delay: (i * 0.37) % 4,
  dur:   3.5 + (i * 1.1) % 4,
  size:  i % 5 === 0 ? 3 : 2,
  orange: i % 3 !== 0,
}))

const CARD_FAN = [
  { x: -260, y: -55, r: -34, d: 0.0 },
  { x: -140, y: -155, r: -18, d: 0.07 },
  { x:    0, y: -185, r:   0, d: 0.14 },
  { x:  140, y: -155, r:  18, d: 0.07 },
  { x:  260, y: -55,  r:  34, d: 0.0 },
]

// ─────────────────────────────────────────────────────────────
// MYSTERY — 3D box auto-opens
// ─────────────────────────────────────────────────────────────
function MysteryAnim({ active }: { active: boolean }) {
  return (
    <div style={{
      transform: 'scale(1.75)',
      transformOrigin: 'center center',
      width: 200, height: 210,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <MysteryBox3D tier="Gold" interactive={false} autoOpen={active} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PSA GRADED — slab slides up, grade pops, rainbow glow
// ─────────────────────────────────────────────────────────────
function PsaAnim({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ y: 90, scale: 0.75 }}
      animate={{ y: active ? 0 : 90, scale: active ? 1 : 0.75 }}
      transition={{ type: 'spring', stiffness: 62, damping: 13, delay: 0.2 }}
      style={{ perspective: '700px' }}
    >
      <div style={{
        width: 230, padding: '20px 18px 18px',
        background: 'linear-gradient(160deg, #1c1c1c 0%, #111 100%)',
        border: '2px solid #F59E0B',
        boxShadow: '0 0 60px rgba(245,158,11,0.65), 0 0 120px rgba(245,158,11,0.3), 0 40px 80px rgba(0,0,0,0.8)',
        animation: 'rainbow-border 3.5s linear infinite',
        textAlign: 'center' as const,
      }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 7, letterSpacing: '0.38em', color: '#555', margin: '0 0 10px' }}>
          PROFESSIONAL SPORTS AUTHENTICATOR
        </p>
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.65 }}
          style={{
            display: 'block',
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 124, lineHeight: 1,
            color: '#F59E0B',
            textShadow: '0 0 60px rgba(245,158,11,0.9)',
            marginBottom: 6,
          }}
        >10</motion.span>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, letterSpacing: '0.28em', color: '#F59E0B', margin: 0, opacity: 0.7 }}>
          GEM MINT
        </p>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// BOOSTER — pack shakes, 5 cards explode out
// ─────────────────────────────────────────────────────────────
function BoosterAnim({ active }: { active: boolean }) {
  return (
    <div style={{ position: 'relative', width: 380, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Fan cards — appear after pack shakes */}
      {CARD_FAN.map((c, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.2 }}
          animate={active ? { x: c.x, y: c.y, rotate: c.r, opacity: 0.82, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 72, damping: 11, delay: 0.55 + c.d }}
          style={{
            position: 'absolute',
            width: 58, height: 82,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
            border: '1px solid rgba(250,93,41,0.5)',
            boxShadow: '0 10px 35px rgba(0,0,0,0.7)',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: 'rgba(250,93,41,0.5)' }}>?</span>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(250,93,41,0.14) 0%, transparent 50%, rgba(245,158,11,0.09) 100%)' }} />
        </motion.div>
      ))}

      {/* Main pack */}
      <motion.div
        animate={active ? {
          x: [0, -10, 10, -7, 7, -4, 0],
          y: [0, -3, 3, -2, 2, 0],
        } : {}}
        transition={{ duration: 0.55, ease: 'easeInOut', delay: 0.3 }}
        style={{
          width: 160, height: 236,
          background: 'linear-gradient(155deg, #1a0d00 0%, #0d0800 60%, #1a1000 100%)',
          border: '1px solid rgba(250,93,41,0.45)',
          position: 'relative', zIndex: 5, overflow: 'hidden',
          boxShadow: '0 0 40px rgba(250,93,41,0.2), 0 20px 60px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, rgba(250,93,41,0.22) 0%, transparent 45%, rgba(245,158,11,0.12) 100%)' }} />
        {/* Foil lines */}
        {[20, 40, 60, 80].map(p => (
          <div key={p} style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: '1px', background: `rgba(250,93,41,${0.08 + p * 0.001})`, transform: `rotate(${-3 + p * 0.02}deg)` }} />
        ))}
        {/* Diagonal tear line */}
        <div style={{ position: 'absolute', top: '22%', left: '-5%', right: '-5%', height: '1px', background: 'rgba(255,255,255,0.18)', transform: 'rotate(-2.5deg)' }} />
        <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: 8, letterSpacing: '0.28em', color: 'rgba(250,93,41,0.6)' }}>
          POKEMON TCG
        </div>
        {/* Shine */}
        <motion.div
          initial={{ x: '-120%' }}
          animate={active ? { x: '220%' } : {}}
          transition={{ duration: 0.7, delay: 0.28 }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)', pointerEvents: 'none' }}
        />
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SINGLES — card flips face-up with rainbow holographic sweep
// ─────────────────────────────────────────────────────────────
function SinglesAnim({ active }: { active: boolean }) {
  return (
    <div style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}>
      <motion.div
        initial={{ rotateY: 180, scale: 0.7 }}
        animate={{ rotateY: active ? 0 : 180, scale: active ? 1 : 0.7 }}
        transition={{ type: 'spring', stiffness: 50, damping: 10, delay: 0.28 }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: 220, height: 308 }}
      >
        {/* BACK */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #111 0%, #1a0800 100%)',
          border: '1px solid rgba(250,93,41,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        }}>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 56, color: 'rgba(250,93,41,0.3)', letterSpacing: '0.08em' }}>MM</span>
        </div>

        {/* FRONT — holographic surface */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          overflow: 'hidden',
          border: '1.5px solid rgba(250,93,41,0.6)',
          boxShadow: '0 0 50px rgba(250,93,41,0.4), 0 30px 80px rgba(0,0,0,0.8)',
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a05 50%, #0a1a0a 100%)',
        }}>
          {/* Holographic grid pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(250,93,41,0.04) 0px, transparent 2px, transparent 30px), repeating-linear-gradient(90deg, rgba(250,93,41,0.04) 0px, transparent 2px, transparent 30px)',
          }} />
          {/* Center logo */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, color: 'rgba(245,158,11,0.55)', letterSpacing: '0.1em', lineHeight: 1 }}>MM</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 7, letterSpacing: '0.35em', color: 'rgba(250,93,41,0.4)', marginTop: 5 }}>LEGACY</div>
          </div>
          {/* Corner stars */}
          {[[8,8],[8,92],[92,8],[92,92]].map(([t,l], i) => (
            <span key={i} style={{ position: 'absolute', top: `${t}%`, left: `${l}%`, transform: 'translate(-50%,-50%)', fontSize: 10, color: 'rgba(245,158,11,0.35)' }}>✦</span>
          ))}
          {/* Rainbow holographic sweep */}
          <motion.div
            initial={{ x: '-120%' }}
            animate={active ? { x: '280%' } : {}}
            transition={{ duration: 1.3, delay: 1.0, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(108deg, transparent 25%, rgba(255,220,80,0.72) 40%, rgba(80,200,255,0.6) 50%, rgba(220,80,255,0.55) 60%, rgba(80,255,160,0.45) 70%, transparent 80%)',
              pointerEvents: 'none',
            }}
          />
          {/* Edge glow */}
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 40px rgba(250,93,41,0.2)', pointerEvents: 'none' }} />
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// VYKUP — coins rain down, "VÝKUP" glows
// ─────────────────────────────────────────────────────────────
const COINS = Array.from({ length: 12 }, (_, i) => ({
  x: 10 + (i * 137 % 80),
  delay: (i * 0.19) % 1.2,
  dur: 0.8 + (i * 0.11) % 0.5,
  size: i % 3 === 0 ? 22 : 16,
}))

function VykupAnim({ active }: { active: boolean }) {
  return (
    <div style={{ position: 'relative', width: 280, height: 240, overflow: 'hidden' }}>
      {/* Coins raining */}
      {COINS.map((c, i) => (
        <motion.div
          key={i}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={active ? { y: [-40, 260], opacity: [0, 1, 1, 0], rotate: [0, 360] } : {}}
          transition={{ duration: c.dur + 0.6, delay: c.delay, ease: 'easeIn', repeat: active ? 3 : 0, repeatDelay: 0.3 }}
          style={{
            position: 'absolute',
            left: `${c.x}%`, top: 0,
            width: c.size, height: c.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #FFE55C, #F59E0B 50%, #B8720A)',
            boxShadow: '0 0 10px rgba(245,158,11,0.8)',
          }}
        />
      ))}
      {/* Central diamond/checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={active ? { scale: 1, rotate: 0 } : {}}
        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.4 }}
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 100, height: 100,
          background: 'linear-gradient(135deg, #FFD700, #F59E0B)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          boxShadow: '0 0 60px rgba(245,158,11,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#000', marginTop: 4 }}>€</span>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CONFIG per type
// ─────────────────────────────────────────────────────────────
const CONFIG: Record<PageIntroType, { glow: string; accent: string; particleColor: string }> = {
  mystery:    { glow: 'rgba(139,92,246,0.18)', accent: '#8B5CF6', particleColor: '#8B5CF6' },
  psa:        { glow: 'rgba(245,158,11,0.16)', accent: '#F59E0B', particleColor: '#F59E0B' },
  booster:    { glow: 'rgba(250,93,41,0.16)',  accent: '#FA5D29', particleColor: '#FA5D29' },
  singles:    { glow: 'rgba(59,130,246,0.15)', accent: '#3B82F6', particleColor: '#3B82F6' },
  collection: { glow: 'rgba(245,158,11,0.16)', accent: '#F59E0B', particleColor: '#F59E0B' },
  vykup:      { glow: 'rgba(245,158,11,0.18)', accent: '#F59E0B', particleColor: '#F59E0B' },
  shop:       { glow: 'rgba(250,93,41,0.14)',  accent: '#FA5D29', particleColor: '#FA5D29' },
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────
export default function PageIntro({ type, title, subtitle }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in')
  const cfg = CONFIG[type]

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 150)
    const t2 = setTimeout(() => setPhase('out'), type === 'mystery' ? 2800 : 2500)
    const t3 = setTimeout(() => setPhase('done'), type === 'mystery' ? 3600 : 3300)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [type])

  if (phase === 'done') return null

  const isActive = phase === 'hold' || phase === 'out'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9996,
        background: `radial-gradient(ellipse at 50% 40%, ${cfg.glow} 0%, var(--void) 65%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        transform: phase === 'out' ? 'translateY(-100%)' : 'translateY(0)',
        transition: phase === 'out' ? 'transform 0.78s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
        pointerEvents: phase === 'out' ? 'none' : 'all',
      }}
    >
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.022,
        backgroundImage: 'linear-gradient(var(--ghost) 1px, transparent 1px), linear-gradient(90deg, var(--ghost) 1px, transparent 1px)',
        backgroundSize: '70px 70px',
      }} />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            width: p.size, height: p.size,
            background: p.orange ? cfg.particleColor : '#FA5D29',
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)`,
        animation: isActive ? 'loader-scan 1.8s ease-in-out infinite' : 'none',
        opacity: 0.7,
      }} />

      {/* ── Category animation ── */}
      <div style={{ marginBottom: 44 }}>
        {type === 'mystery'    && <MysteryAnim active={isActive} />}
        {type === 'psa'        && <PsaAnim active={isActive} />}
        {type === 'booster'    && <BoosterAnim active={isActive} />}
        {type === 'singles'    && <SinglesAnim active={isActive} />}
        {type === 'collection' && <MysteryAnim active={isActive} />}
        {type === 'vykup'      && <VykupAnim active={isActive} />}
        {type === 'shop'       && <BoosterAnim active={isActive} />}
      </div>

      {/* ── Title ── */}
      <div style={{ overflow: 'hidden', textAlign: 'center' }}>
        <motion.h1
          initial={{ y: '105%' }}
          animate={{ y: isActive ? 0 : '105%' }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(56px, 10vw, 110px)',
            lineHeight: 0.9,
            color: 'var(--ghost)',
            letterSpacing: '0.03em',
            margin: 0,
          }}
        >
          {title}
        </motion.h1>
      </div>

      {/* ── Subtitle / accent line ── */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          style={{
            fontFamily: 'Space Mono, monospace', fontSize: 10,
            letterSpacing: '0.38em', color: cfg.accent,
            marginTop: 12, margin: '12px 0 0',
          }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* ── Progress bar ── */}
      <div style={{ marginTop: 40, width: 160, height: 1, background: 'var(--surface-2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          background: cfg.accent,
          animation: isActive ? `loader-progress ${type === 'mystery' ? 2.6 : 2.3}s ease forwards` : 'none',
        }} />
      </div>

      {/* ── Skip button ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0.38 : 0 }}
        transition={{ delay: 0.8 }}
        onClick={() => setPhase('out')}
        style={{
          position: 'absolute', bottom: 24, right: 28,
          background: 'none', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'Space Mono, monospace', fontSize: 9,
          letterSpacing: '0.22em', padding: '7px 14px',
          cursor: 'none',
        }}
      >
        PRESKOČIŤ →
      </motion.button>
    </div>
  )
}
