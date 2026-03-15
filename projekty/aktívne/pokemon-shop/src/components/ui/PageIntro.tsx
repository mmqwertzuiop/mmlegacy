'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export type PageIntroType = 'mystery' | 'psa' | 'booster' | 'singles' | 'collection' | 'vykup' | 'shop'

interface Props {
  type: PageIntroType
  title: string
  subtitle?: string
}

// ─── Real card images ───────────────────────────────────────
const IMG = {
  charizard: 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
  umbreon:   'https://images.pokemontcg.io/swsh7/215_hires.png',
  pikachu:   'https://images.pokemontcg.io/swsh4/188_hires.png',
  rayquaza:  'https://images.pokemontcg.io/swsh7/218_hires.png',
  giratina:  'https://images.pokemontcg.io/swsh12/186_hires.png',
  koraidon:  'https://images.pokemontcg.io/sv1/252_hires.png',
}

// Deterministic particles
const BURST_P = Array.from({ length: 28 }, (_, i) => ({
  angle: (i / 28) * Math.PI * 2 + (i % 3) * 0.22,
  dist:  90 + (i * 17 % 80),
  size:  i % 5 === 0 ? 7 : i % 3 === 0 ? 5 : 3,
  dur:   0.55 + (i * 41 % 100) / 220,
  delay: 0.04 + (i * 31 % 28) / 160,
  purple: i % 3 !== 0,
}))

// ─────────────────────────────────────────────────────────────
// MYSTERY — box appears → shakes → lid opens → cards fly out
// ─────────────────────────────────────────────────────────────
const MYSTERY_CARDS = [
  { img: IMG.charizard, x: -272, y: -22,  r: -27, s: 0.90, z: 2 },
  { img: IMG.umbreon,   x: -140, y: -165, r: -13, s: 0.98, z: 3 },
  { img: IMG.rayquaza,  x:    0, y: -185, r:   0, s: 1.08, z: 5 },
  { img: IMG.pikachu,   x:  140, y: -165, r:  13, s: 0.98, z: 3 },
  { img: IMG.giratina,  x:  272, y: -22,  r:  27, s: 0.90, z: 2 },
]

function MysteryIntro({ active }: { active: boolean }) {
  // stage: 0=idle 1=box-in 2=shake 3=lid-open 4=cards-out
  const [stage, setStage] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (!active) return
    setStage(1)
    timers.current.push(setTimeout(() => setStage(2), 420))
    timers.current.push(setTimeout(() => setStage(3), 860))
    timers.current.push(setTimeout(() => setStage(4), 1050))
    return () => { timers.current.forEach(clearTimeout); timers.current = [] }
  }, [active])

  const BW = 170
  const BH = 150
  const LH = 56

  return (
    <div style={{ position: 'relative', width: 720, height: 460, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* ── THE BOX ── */}
      <motion.div
        initial={{ scale: 0, y: 60, opacity: 0 }}
        animate={stage >= 1 ? { scale: 1, y: 0, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 210, damping: 17, delay: 0.05 }}
        style={{
          position: 'absolute', zIndex: 20,
          animation: stage === 2 ? 'mystery-box-shake 0.44s ease-in-out' : 'none',
        }}
      >
        {/* Radial glow that pulses open when lid opens */}
        <motion.div
          animate={{ opacity: stage >= 3 ? 1 : 0.3, scale: stage >= 3 ? 2.2 : 0.9 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: -50,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.8) 0%, rgba(250,93,41,0.3) 40%, transparent 68%)',
            filter: 'blur(28px)',
            pointerEvents: 'none',
          }}
        />

        {/* 3D perspective wrapper */}
        <div style={{ perspective: '520px', perspectiveOrigin: '50% 85%' }}>

          {/* LID — hinges at bottom edge */}
          <motion.div
            animate={{ rotateX: stage >= 3 ? -132 : 0 }}
            transition={{ type: 'spring', stiffness: 82, damping: 13 }}
            style={{
              width: BW + 10, height: LH,
              transformOrigin: `${(BW + 10) / 2}px ${LH}px`,
              transformStyle: 'preserve-3d',
              position: 'relative', zIndex: 2, marginBottom: -2,
              background: 'linear-gradient(148deg, #4f28cc 0%, #1e0e60 100%)',
              border: '2px solid rgba(139,92,246,0.9)',
              boxShadow: '0 -6px 28px rgba(139,92,246,0.55)',
              overflow: 'visible',
            }}
          >
            {/* Lid top shine */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 55%)', overflow: 'hidden' }} />
            {/* Ribbon V */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: 24, background: 'rgba(200,150,255,0.28)' }} />

            {/* BOW — sits above lid */}
            <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', width: 0, zIndex: 5 }}>
              {/* Left loop */}
              <div style={{
                position: 'absolute',
                width: 60, height: 40,
                background: 'radial-gradient(ellipse at 58% 38%, rgba(195,145,255,1) 0%, rgba(139,92,246,0.9) 100%)',
                borderRadius: '68% 32% 28% 72% / 58% 62% 38% 42%',
                transform: 'rotate(-26deg)',
                left: -66, top: -14,
                boxShadow: '0 0 20px rgba(139,92,246,1)',
              }} />
              {/* Right loop */}
              <div style={{
                position: 'absolute',
                width: 60, height: 40,
                background: 'radial-gradient(ellipse at 42% 38%, rgba(195,145,255,1) 0%, rgba(139,92,246,0.9) 100%)',
                borderRadius: '32% 68% 72% 28% / 58% 62% 38% 42%',
                transform: 'rotate(26deg)',
                right: -66, top: -14,
                boxShadow: '0 0 20px rgba(139,92,246,1)',
              }} />
              {/* Knot */}
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'radial-gradient(circle at 38% 32%, #d0a8ff, #8B5CF6)',
                boxShadow: '0 0 22px rgba(175,120,255,1)',
                transform: 'translateX(-12px)',
                position: 'relative', zIndex: 3,
              }} />
            </div>
          </motion.div>

          {/* BOX BODY */}
          <div style={{
            width: BW + 10, height: BH,
            background: 'linear-gradient(148deg, #2e1888 0%, #120940 100%)',
            border: '2px solid rgba(139,92,246,0.78)',
            borderTop: 'none',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(139,92,246,0.28), 0 48px 90px rgba(0,0,0,0.88)',
          }}>
            {/* Ribbon V */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: 24, background: 'rgba(180,120,255,0.18)' }} />
            {/* Ribbon H */}
            <div style={{ position: 'absolute', top: '44%', left: 0, right: 0, height: 22, background: 'rgba(180,120,255,0.14)' }} />
            {/* Big ? */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: 92,
              color: 'rgba(139,92,246,0.52)',
              textShadow: '0 0 42px rgba(139,92,246,0.85)',
            }}>?</div>
            {/* Accent stars */}
            <div style={{ position: 'absolute', top: 12, left: 16, fontSize: 12, color: 'rgba(180,120,255,0.5)' }}>✦</div>
            <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 10, color: 'rgba(180,120,255,0.4)' }}>★</div>
            <div style={{ position: 'absolute', bottom: 14, right: 20, fontSize: 11, color: 'rgba(180,120,255,0.4)' }}>✦</div>
            {/* Top edge highlight */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'rgba(139,92,246,0.55)' }} />
            {/* Side gloss */}
            <div style={{ position: 'absolute', top: 0, left: 9, width: 5, bottom: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 2 }} />
          </div>
        </div>
      </motion.div>

      {/* ── CARDS fly out of the box ── */}
      {MYSTERY_CARDS.map((c, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 20, rotate: 0, scale: 0, opacity: 0 }}
          animate={stage >= 4 ? { x: c.x, y: c.y, rotate: c.r, scale: c.s, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 52, damping: 11, delay: i * 0.1 }}
          style={{ position: 'absolute', width: 112, height: 157, zIndex: c.z }}
        >
          <div style={{
            width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
            transform: `perspective(700px) rotateY(${(i - 2) * 5}deg) rotateX(-4deg)`,
            boxShadow: `0 22px 55px rgba(0,0,0,0.88), 0 0 24px rgba(139,92,246,0.38)`,
            border: '1px solid rgba(139,92,246,0.45)',
          }}>
            <Image src={c.img} alt="" fill style={{ objectFit: 'cover' }} sizes="112px" priority={i === 2} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(115deg, transparent 0%, rgba(255,200,100,0.28) 32%, rgba(100,200,255,0.28) 62%, transparent 100%)',
              backgroundSize: '200% 200%',
              animation: `holo ${2.4 + i * 0.35}s linear infinite`,
              mixBlendMode: 'color-dodge', pointerEvents: 'none',
            }} />
          </div>
        </motion.div>
      ))}

      {/* ── Particle burst when lid opens ── */}
      <AnimatePresence>
        {stage >= 3 && BURST_P.map((p, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(p.angle) * p.dist, y: Math.sin(p.angle) * p.dist, scale: 1, opacity: 0 }}
            transition={{ duration: p.dur, ease: 'easeOut', delay: p.delay }}
            style={{
              position: 'absolute', width: p.size, height: p.size, borderRadius: '50%',
              background: p.purple ? '#8B5CF6' : '#FA5D29',
              boxShadow: `0 0 ${p.size * 2}px ${p.purple ? 'rgba(139,92,246,0.9)' : 'rgba(250,93,41,0.9)'}`,
              pointerEvents: 'none', zIndex: 10,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PSA GRADED — real Charizard card in PSA slab, grade pops
// ─────────────────────────────────────────────────────────────
function PsaIntro({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ y: 110, rotateX: 28, scale: 0.72 }}
      animate={{ y: active ? 0 : 110, rotateX: active ? 0 : 28, scale: active ? 1 : 0.72 }}
      transition={{ type: 'spring', stiffness: 58, damping: 13, delay: 0.22 }}
      style={{ perspective: '700px', perspectiveOrigin: '50% 60%' }}
    >
      {/* PSA Slab */}
      <div style={{
        width: 264,
        background: 'linear-gradient(162deg, #1e1e1e 0%, #111 100%)',
        border: '2.5px solid #F59E0B',
        boxShadow: '0 0 80px rgba(245,158,11,0.65), 0 0 160px rgba(245,158,11,0.22), 0 40px 100px rgba(0,0,0,0.9)',
        animation: 'rainbow-border 3.5s linear infinite',
        padding: '14px 12px 16px',
        textAlign: 'center' as const,
      }}>
        {/* Header */}
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 6.5, letterSpacing: '0.36em', color: '#555', margin: '0 0 10px', textTransform: 'uppercase' as const }}>
          Professional Sports Authenticator
        </p>

        {/* Card image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.85 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', marginBottom: 10 }}
        >
          <Image src={IMG.charizard} alt="Charizard ex PSA 10" fill style={{ objectFit: 'cover' }} sizes="240px" priority />
          {/* Holographic sweep */}
          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: active ? '280%' : '-120%' }}
            transition={{ duration: 1.1, delay: 0.95, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(108deg, transparent 28%, rgba(255,255,255,0.62) 45%, rgba(255,220,80,0.5) 52%, rgba(80,200,255,0.4) 60%, transparent 75%)',
              pointerEvents: 'none',
            }}
          />
          {/* Inner frame */}
          <div style={{ position: 'absolute', inset: 2, border: '1px solid rgba(245,158,11,0.35)', pointerEvents: 'none' }} />
        </motion.div>

        {/* Grade badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.72 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 62, lineHeight: 1, color: '#F59E0B', textShadow: '0 0 40px rgba(245,158,11,0.9)' }}>10</span>
          <div style={{ textAlign: 'left' as const }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 7, letterSpacing: '0.28em', color: '#F59E0B', opacity: 0.75 }}>GEM MINT</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 7, letterSpacing: '0.18em', color: '#888' }}>CHARIZARD EX SIR</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// BOOSTER — pack shakes, real cards burst out in fan
// ─────────────────────────────────────────────────────────────
const BOOSTER_CARDS = [
  { img: IMG.koraidon,  x: -275, y: -38,  r: -35, delay: 0.00 },
  { img: IMG.pikachu,   x: -138, y: -162, r: -16, delay: 0.07 },
  { img: IMG.rayquaza,  x:    0, y: -184, r:   0, delay: 0.14 },
  { img: IMG.umbreon,   x:  138, y: -162, r:  16, delay: 0.07 },
  { img: IMG.giratina,  x:  275, y: -38,  r:  35, delay: 0.00 },
]

function BoosterIntro({ active }: { active: boolean }) {
  return (
    <div style={{ position: 'relative', width: 680, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Fan cards */}
      {BOOSTER_CARDS.map((c, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 50, rotate: 0, scale: 0, opacity: 0 }}
          animate={active ? { x: c.x, y: c.y, rotate: c.r, scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 65, damping: 12, delay: 0.52 + c.delay }}
          style={{
            position: 'absolute',
            width: 108, height: 151,
            transformOrigin: 'center bottom',
          }}
        >
          <div style={{
            width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 55px rgba(0,0,0,0.85)',
            border: '1px solid rgba(250,93,41,0.35)',
          }}>
            <Image src={c.img} alt="" fill style={{ objectFit: 'cover' }} sizes="110px" />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(115deg, transparent 0%, rgba(255,180,80,0.22) 30%, rgba(100,200,255,0.22) 60%, transparent 100%)',
              backgroundSize: '200% 200%',
              animation: `holo ${2.2 + i * 0.3}s linear infinite`,
              mixBlendMode: 'color-dodge', pointerEvents: 'none',
            }} />
          </div>
        </motion.div>
      ))}

      {/* Booster pack centre */}
      <motion.div
        animate={active ? { x: [0, -9, 9, -6, 6, -3, 0], y: [0, -2, 2, -1, 1, 0] } : {}}
        transition={{ duration: 0.5, delay: 0.28, ease: 'easeInOut' }}
        style={{
          width: 148, height: 220, position: 'relative', zIndex: 20,
          background: 'linear-gradient(155deg, #1a0d00 0%, #0e0800 55%, #180f00 100%)',
          border: '1px solid rgba(250,93,41,0.5)',
          overflow: 'hidden',
          boxShadow: '0 0 45px rgba(250,93,41,0.25), 0 20px 65px rgba(0,0,0,0.85)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, rgba(250,93,41,0.24) 0%, transparent 45%, rgba(245,158,11,0.14) 100%)' }} />
        {[20, 40, 58, 76].map(p => (
          <div key={p} style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, height: 1, background: `rgba(250,93,41,${0.07 + p * 0.001})`, transform: `rotate(${-2.5 + p * 0.02}deg)` }} />
        ))}
        <div style={{ position: 'absolute', top: '21%', left: '-4%', right: '-4%', height: 1, background: 'rgba(255,255,255,0.2)', transform: 'rotate(-2.5deg)' }} />
        {/* Shine sweep */}
        <motion.div
          initial={{ x: '-130%' }}
          animate={active ? { x: '240%' } : {}}
          transition={{ duration: 0.65, delay: 0.26 }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(108deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)', pointerEvents: 'none' }}
        />
        <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center' as const, fontFamily: 'Space Mono, monospace', fontSize: 7, letterSpacing: '0.3em', color: 'rgba(250,93,41,0.65)' }}>
          POKEMON TCG
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SINGLES — Umbreon VMAX flips from MM-branded back to front
// ─────────────────────────────────────────────────────────────
function SinglesIntro({ active }: { active: boolean }) {
  return (
    <div style={{ perspective: '900px', perspectiveOrigin: '50% 45%' }}>
      <motion.div
        initial={{ rotateY: 180, scale: 0.68, y: 30 }}
        animate={{ rotateY: active ? 0 : 180, scale: active ? 1 : 0.68, y: active ? 0 : 30 }}
        transition={{ type: 'spring', stiffness: 48, damping: 10, delay: 0.3 }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: 250, height: 350 }}
      >
        {/* BACK — MM Legacy branded */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0900 50%, #0d0d0d 100%)',
          border: '1.5px solid rgba(250,93,41,0.4)',
          boxShadow: '0 25px 65px rgba(0,0,0,0.9)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
          overflow: 'hidden',
        }}>
          {/* Pattern grid */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(250,93,41,1) 0px, transparent 2px, transparent 28px), repeating-linear-gradient(90deg, rgba(250,93,41,1) 0px, transparent 2px, transparent 28px)',
          }} />
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 64, color: 'rgba(250,93,41,0.32)', letterSpacing: '0.06em', zIndex: 1 }}>MM</div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, letterSpacing: '0.42em', color: 'rgba(250,93,41,0.22)', zIndex: 1 }}>LEGACY</div>
          {/* Border ornament */}
          <div style={{ position: 'absolute', inset: 8, border: '1px solid rgba(250,93,41,0.15)' }} />
          <div style={{ position: 'absolute', inset: 14, border: '1px solid rgba(250,93,41,0.08)' }} />
        </div>

        {/* FRONT — real Umbreon VMAX Alt Art */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          overflow: 'hidden',
          border: '1.5px solid rgba(59,130,246,0.6)',
          boxShadow: '0 0 55px rgba(59,130,246,0.5), 0 0 100px rgba(59,130,246,0.2), 0 30px 80px rgba(0,0,0,0.9)',
        }}>
          <Image src={IMG.umbreon} alt="Umbreon VMAX Alt Art" fill style={{ objectFit: 'cover' }} sizes="250px" priority />
          {/* Rainbow holographic sweep on reveal */}
          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: active ? '300%' : '-120%' }}
            transition={{ duration: 1.3, delay: 1.05, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(108deg, transparent 22%, rgba(255,220,80,0.75) 38%, rgba(80,200,255,0.65) 50%, rgba(220,80,255,0.6) 62%, rgba(80,255,160,0.5) 72%, transparent 82%)',
              pointerEvents: 'none',
            }}
          />
          {/* Soft vignette */}
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 50px rgba(59,130,246,0.25)', pointerEvents: 'none' }} />
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// VYKUP — card slides in, gold coins cascade, value shows
// ─────────────────────────────────────────────────────────────
const COINS_V = Array.from({ length: 14 }, (_, i) => ({
  left: 8 + (i * 131 % 84),
  delay: (i * 0.18) % 1.4,
  dur: 0.75 + (i * 0.09) % 0.45,
  size: i % 3 === 0 ? 22 : i % 2 === 0 ? 16 : 12,
}))

function VykupIntro({ active }: { active: boolean }) {
  return (
    <div style={{ position: 'relative', width: 480, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Coins raining */}
      {COINS_V.map((c, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: 0, opacity: 0, rotate: 0 }}
          animate={active ? { y: 340, opacity: [0, 1, 1, 0], rotate: 360 } : {}}
          transition={{ duration: c.dur + 0.5, delay: c.delay, ease: 'easeIn', repeat: 2, repeatDelay: 0.2 }}
          style={{
            position: 'absolute', top: 0, left: `${c.left}%`,
            width: c.size, height: c.size, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #FFE86A, #F59E0B 55%, #A06400)',
            boxShadow: '0 0 10px rgba(245,158,11,0.8)',
          }}
        />
      ))}

      {/* Koraidon card (value card) sliding in */}
      <motion.div
        initial={{ x: -180, rotate: -15, opacity: 0 }}
        animate={active ? { x: -85, rotate: -8, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.3 }}
        style={{ position: 'absolute', width: 110, height: 154, zIndex: 5 }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', border: '1px solid rgba(245,158,11,0.4)' }}>
          <Image src={IMG.koraidon} alt="" fill style={{ objectFit: 'cover' }} sizes="110px" />
        </div>
      </motion.div>

      {/* Arrow */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.7, type: 'spring', stiffness: 200, damping: 16 }}
        style={{ position: 'relative', zIndex: 10, fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, color: '#F59E0B', textShadow: '0 0 20px rgba(245,158,11,0.7)' }}
      >
        →
      </motion.div>

      {/* Gold diamond/€ */}
      <motion.div
        initial={{ scale: 0, rotate: 45 }}
        animate={active ? { scale: 1, rotate: 0 } : {}}
        transition={{ type: 'spring', stiffness: 120, damping: 13, delay: 0.5 }}
        style={{
          position: 'relative', zIndex: 10,
          width: 90, height: 90,
          background: 'linear-gradient(135deg, #FFE86A 0%, #F59E0B 55%, #A06400 100%)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          boxShadow: '0 0 60px rgba(245,158,11,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: 16,
        }}
      >
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 34, color: '#000', marginTop: 2 }}>€</span>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const CFG: Record<PageIntroType, { bg: string; accent: string; pt: string }> = {
  mystery:    { bg: 'rgba(139,92,246,0.16)', accent: '#8B5CF6', pt: '#8B5CF6' },
  psa:        { bg: 'rgba(245,158,11,0.15)', accent: '#F59E0B', pt: '#F59E0B' },
  booster:    { bg: 'rgba(250,93,41,0.15)',  accent: '#FA5D29', pt: '#FA5D29' },
  singles:    { bg: 'rgba(59,130,246,0.14)', accent: '#3B82F6', pt: '#3B82F6' },
  collection: { bg: 'rgba(245,158,11,0.14)', accent: '#F59E0B', pt: '#F59E0B' },
  vykup:      { bg: 'rgba(245,158,11,0.16)', accent: '#F59E0B', pt: '#F59E0B' },
  shop:       { bg: 'rgba(250,93,41,0.13)',  accent: '#FA5D29', pt: '#FA5D29' },
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function PageIntro({ type, title, subtitle }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in')
  const cfg = CFG[type]

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 120)
    const holdDur = type === 'mystery' ? 2900 : type === 'psa' ? 2700 : 2500
    const t2 = setTimeout(() => setPhase('out'), holdDur)
    const t3 = setTimeout(() => setPhase('done'), holdDur + 820)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [type])

  if (phase === 'done') return null

  const active = phase === 'hold' || phase === 'out'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9996,
        background: `radial-gradient(ellipse at 50% 42%, ${cfg.bg} 0%, #080808 68%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        transform: phase === 'out' ? 'translateY(-100%)' : 'translateY(0)',
        transition: phase === 'out' ? 'transform 0.82s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
        pointerEvents: phase === 'out' ? 'none' : 'all',
      }}
    >
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.018,
        backgroundImage: 'linear-gradient(#F0F0F0 1px,transparent 1px),linear-gradient(90deg,#F0F0F0 1px,transparent 1px)',
        backgroundSize: '72px 72px',
      }} />

      {/* Scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg,transparent,${cfg.accent},transparent)`,
        animation: active ? 'loader-scan 2s ease-in-out infinite' : 'none',
        opacity: 0.65,
      }} />

      {/* ── Animation ── */}
      <div style={{ marginBottom: 48, pointerEvents: 'none' }}>
        {type === 'mystery'    && <MysteryIntro active={active} />}
        {type === 'psa'        && <PsaIntro active={active} />}
        {type === 'booster'    && <BoosterIntro active={active} />}
        {type === 'singles'    && <SinglesIntro active={active} />}
        {type === 'collection' && <BoosterIntro active={active} />}
        {type === 'vykup'      && <VykupIntro active={active} />}
        {type === 'shop'       && <BoosterIntro active={active} />}
      </div>

      {/* ── Title ── */}
      <div style={{ overflow: 'hidden', textAlign: 'center' }}>
        <motion.h1
          initial={{ y: '106%' }}
          animate={{ y: active ? 0 : '106%' }}
          transition={{ delay: 0.52, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(52px, 9vw, 108px)',
            lineHeight: 0.9, color: '#F0F0F0',
            letterSpacing: '0.03em', margin: 0,
          }}
        >
          {title}
        </motion.h1>
      </div>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{
            fontFamily: 'Space Mono, monospace', fontSize: 10,
            letterSpacing: '0.4em', color: cfg.accent,
            margin: '14px 0 0',
          }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* ── Progress bar ── */}
      <div style={{ marginTop: 38, width: 180, height: 1, background: '#1A1A1A', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          background: cfg.accent,
          animation: active ? `loader-progress ${type === 'mystery' ? 2.75 : type === 'psa' ? 2.55 : 2.35}s ease forwards` : 'none',
        }} />
      </div>

      {/* ── Skip ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.35 : 0 }}
        transition={{ delay: 0.9 }}
        onClick={() => setPhase('out')}
        style={{
          position: 'absolute', bottom: 22, right: 26,
          background: 'none', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.38)',
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
