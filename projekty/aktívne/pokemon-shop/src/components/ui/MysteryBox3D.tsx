'use client'
import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

type Phase = 'idle' | 'hover' | 'shaking' | 'open'

const TIERS: Record<string, { c: string; g: string; accent: string }> = {
  Diamond: { c: '#B9F2FF', g: 'rgba(185,242,255,0.9)', accent: '#00CFFF' },
  Platinum: { c: '#E5E4E2', g: 'rgba(220,218,216,0.85)', accent: '#ADADAD' },
  Gold:     { c: '#FFD700', g: 'rgba(255,215,0,0.9)',   accent: '#FF9500' },
  Silver:   { c: '#C0C0C0', g: 'rgba(192,192,192,0.8)', accent: '#888' },
  Bronze:   { c: '#CD7F32', g: 'rgba(205,127,50,0.8)',  accent: '#8B4513' },
}

// Deterministic particles — no Math.random() in render (SSR-safe)
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  angle: (i / 22) * Math.PI * 2 + (i % 3) * 0.2,
  dist:  48 + (i * 13 % 54),
  size:  i % 5 === 0 ? 7 : i % 3 === 0 ? 5 : 3,
  dur:   0.5 + (i * 47 % 100) / 250,
  delay: 0.08 + (i * 31 % 22) / 110,
  useAccent: i % 3 !== 0,
}))

export default function MysteryBox3D({
  tier = 'Gold',
  interactive = true,
  autoOpen = false,
}: {
  tier?: string
  interactive?: boolean
  autoOpen?: boolean
}) {
  const [phase, setPhase] = useState<Phase>('idle')

  // Auto-open sequence (for overlay use)
  useEffect(() => {
    if (!autoOpen) return
    const t1 = setTimeout(() => setPhase('shaking'), 700)
    const t2 = setTimeout(() => setPhase('open'), 1280)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [autoOpen])
  const col = TIERS[tier] ?? TIERS.Gold

  // Box dimensions
  const W = 116, D = 74, H = 92, LH = 25

  // Spring-driven rotation + position
  const rotY = useMotionValue(30)
  const rotX = useMotionValue(-18)
  const posY = useMotionValue(0)
  const sRotY = useSpring(rotY, { stiffness: 90, damping: 16 })
  const sRotX = useSpring(rotX, { stiffness: 110, damping: 18 })
  const sPosY = useSpring(posY, { stiffness: 200, damping: 22 })

  // Idle: slow continuous auto-spin via RAF
  useEffect(() => {
    if (phase !== 'idle') return
    let active = true
    const spin = () => {
      if (!active) return
      rotY.set(rotY.get() + 0.3)
      requestAnimationFrame(spin)
    }
    const id = requestAnimationFrame(spin)
    return () => { active = false; cancelAnimationFrame(id) }
  }, [phase, rotY])

  // Phase → target values
  useEffect(() => {
    if (phase === 'hover')    { rotX.set(-24); posY.set(-10) }
    if (phase === 'idle')     { rotX.set(-18); posY.set(0) }
    if (phase === 'shaking')  {
      const beats = [42, 28, 46, 26, 40, 33, 38]
      beats.forEach((v, i) => setTimeout(() => rotY.set(v), i * 75))
    }
    if (phase === 'open')     { rotX.set(-20); posY.set(-6) }
  }, [phase, rotX, posY, rotY])

  const handleClick = () => {
    if (phase === 'open') { setPhase('idle'); return }
    if (phase === 'shaking') return
    setPhase('shaking')
    setTimeout(() => setPhase('open'), 560)
  }

  const isOpen = phase === 'open'

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', height: '100%', position: 'relative',
        perspective: '480px', perspectiveOrigin: '50% 36%',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onMouseEnter={() => { if (interactive && phase === 'idle') setPhase('hover') }}
      onMouseLeave={() => { if (interactive && phase === 'hover') setPhase('idle') }}
      onClick={interactive ? handleClick : undefined}
    >
      {/* Ground glow */}
      <motion.div
        animate={{ scale: isOpen ? 1.6 : 1, opacity: isOpen ? 1 : 0.4 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute', bottom: '8%', left: '50%', translateX: '-50%',
          width: '140px', height: '22px',
          background: `radial-gradient(ellipse, ${col.g} 0%, transparent 70%)`,
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />

      {/* ─── 3D BOX ─── */}
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: W, height: H + LH,
          rotateY: sRotY,
          rotateX: sRotX,
          y: sPosY,
        }}
      >
        {/* FRONT face */}
        <BoxFace
          style={{
            position: 'absolute', top: LH, left: 0,
            width: W, height: H,
            transform: `translateZ(${D / 2}px)`,
            background: `linear-gradient(155deg, ${col.c}2A 0%, ${col.c}09 100%)`,
            border: `1px solid ${col.c}58`,
            overflow: 'hidden',
          }}
        >
          {/* Ribbon H */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: '44%', height: '14px', background: `linear-gradient(90deg, transparent, ${col.c}88, transparent)` }} />
          {/* Ribbon V */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '47%', width: '14px', background: `linear-gradient(180deg, transparent, ${col.c}88, transparent)` }} />
          {/* Inner glow on open */}
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${col.c}75 0%, transparent 70%)`, filter: 'blur(5px)' }}
          />
          {/* Tier label */}
          <div style={{
            position: 'absolute', bottom: '7px', left: 0, right: 0, textAlign: 'center',
            fontFamily: 'Space Mono, monospace', fontSize: '8px', letterSpacing: '0.28em',
            color: col.c, opacity: 0.75,
          }}>{tier?.toUpperCase()}</div>
        </BoxFace>

        {/* RIGHT face */}
        <BoxFace
          style={{
            position: 'absolute', top: LH, left: W - 1,
            width: D, height: H,
            transform: 'rotateY(90deg)', transformOrigin: 'left center',
            background: `linear-gradient(155deg, ${col.c}12 0%, ${col.c}04 100%)`,
            border: `1px solid ${col.c}35`,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '38%', width: '12px', background: `linear-gradient(180deg, transparent, ${col.c}60, transparent)` }} />
        </BoxFace>

        {/* BOTTOM face */}
        <div style={{
          position: 'absolute', top: LH + H - 1, left: 0,
          width: W, height: D,
          transform: 'rotateX(-90deg)', transformOrigin: 'center top',
          background: `${col.c}07`,
          border: `1px solid ${col.c}22`,
          boxSizing: 'border-box',
        }} />

        {/* ─── LID (pivots around back-top hinge) ─── */}
        <motion.div
          style={{
            position: 'absolute', top: 0, left: -2,
            transformStyle: 'preserve-3d',
            transformOrigin: `${(W + 4) / 2}px ${LH}px ${-(D / 2 + 2)}px`,
          }}
          animate={{ rotateX: isOpen ? -135 : 0 }}
          transition={{ type: 'spring', stiffness: 50, damping: 9, delay: isOpen ? 0.1 : 0 }}
        >
          {/* Lid TOP */}
          <div style={{
            position: 'absolute', top: LH - 1, left: 0,
            width: W + 4, height: D + 4,
            transform: 'rotateX(-90deg)', transformOrigin: 'center top',
            background: `linear-gradient(135deg, ${col.c}50 0%, ${col.c}22 100%)`,
            border: `1px solid ${col.c}90`,
            overflow: 'hidden', boxSizing: 'border-box',
          }}>
            {/* Bow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '20px', height: '20px', borderRadius: '50%',
              border: `2px solid ${col.c}`,
              boxShadow: `0 0 12px ${col.g}, inset 0 0 6px ${col.c}55`,
            }} />
          </div>
          {/* Lid FRONT */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: W + 4, height: LH,
            transform: `translateZ(${D / 2 + 2}px)`,
            background: `linear-gradient(180deg, ${col.c}48 0%, ${col.c}1A 100%)`,
            border: `1px solid ${col.c}72`, boxSizing: 'border-box',
          }} />
          {/* Lid RIGHT */}
          <div style={{
            position: 'absolute', top: 0, left: W + 3,
            width: D + 4, height: LH,
            transform: 'rotateY(90deg)', transformOrigin: 'left center',
            background: `${col.c}20`,
            border: `1px solid ${col.c}45`, boxSizing: 'border-box',
          }} />
        </motion.div>
      </motion.div>

      {/* ─── BURST PARTICLES ─── */}
      <AnimatePresence>
        {phase === 'open' && PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(p.angle) * p.dist,
              y: Math.sin(p.angle) * p.dist - 38,
              scale: 1, opacity: 0,
            }}
            transition={{ duration: p.dur, ease: 'easeOut', delay: p.delay }}
            style={{
              position: 'absolute',
              width: p.size, height: p.size,
              borderRadius: '50%',
              background: p.useAccent ? col.c : '#FA5D29',
              boxShadow: `0 0 ${p.size * 2}px ${p.useAccent ? col.g : 'rgba(250,93,41,0.9)'}`,
              pointerEvents: 'none', zIndex: 20,
            }}
          />
        ))}
      </AnimatePresence>

      {/* ─── HINT TEXT ─── */}
      <motion.p
        animate={{ opacity: phase === 'hover' ? 1 : phase === 'idle' ? 0.32 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute', bottom: '3%', margin: 0,
          fontFamily: 'Space Mono, monospace',
          fontSize: '7px', letterSpacing: '0.26em',
          color: col.c, pointerEvents: 'none',
        }}
      >
        {phase === 'hover' ? 'KLIKNI A OTVOR' : '— MYSTERY BOX —'}
      </motion.p>

      {/* ─── "OPENED!" ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ delay: 0.42, type: 'spring', stiffness: 280, damping: 18 }}
            style={{
              position: 'absolute', top: '14%',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '28px', letterSpacing: '0.14em',
              color: col.c, textShadow: `0 0 28px ${col.g}, 0 0 60px ${col.g}`,
              pointerEvents: 'none', zIndex: 25,
            }}
          >
            OTVORENÉ!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Tiny helper — just a div wrapper for cleaner JSX
function BoxFace({ style, children }: { style: React.CSSProperties; children?: React.ReactNode }) {
  return <div style={{ boxSizing: 'border-box', ...style }}>{children}</div>
}
