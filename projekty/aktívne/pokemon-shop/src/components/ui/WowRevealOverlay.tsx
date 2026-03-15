'use client'
import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { formatPrice } from '@/data/products'
import MysteryBox3D from './MysteryBox3D'
import CartButton from './CartButton'

type Phase = 'enter' | 'reveal' | 'info'

// ─────────────────────────────────────────────────────────────
// Deterministic particles (no Math.random() during render)
// ─────────────────────────────────────────────────────────────
const BURST = Array.from({ length: 26 }, (_, i) => ({
  angle: (i / 26) * Math.PI * 2 + (i % 4) * 0.18,
  dist:  100 + (i * 19 % 90),
  size:  i % 5 === 0 ? 9 : i % 3 === 0 ? 6 : 3,
  dur:   0.55 + (i * 41 % 100) / 220,
  delay: 0.06 + (i * 31 % 26) / 140,
  accent: i % 3 !== 0,
}))

const CARD_FAN = [
  { x: -280, y: -60, r: -35, delay: 0.0 },
  { x: -155, y: -165, r: -18, delay: 0.06 },
  { x: 0,    y: -195, r:   0, delay: 0.12 },
  { x: 155,  y: -165, r:  18, delay: 0.06 },
  { x: 280,  y: -60,  r:  35, delay: 0.0 },
]

// ─────────────────────────────────────────────────────────────
// MYSTERY BOX reveal (large, auto-opens)
// ─────────────────────────────────────────────────────────────
function MysteryReveal({ product }: { product: Product }) {
  return (
    <div style={{ transform: 'scale(1.65)', transformOrigin: 'center center', width: 220, height: 220 }}>
      <MysteryBox3D tier={product.mystery_tier ?? 'Gold'} interactive={false} autoOpen />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PSA GRADED reveal — slab slides in, grade pops, card fades
// ─────────────────────────────────────────────────────────────
function PsaReveal({ product, phase }: { product: Product; phase: Phase }) {
  const grade = product.psa_grade ?? 9
  const isPsa10 = grade === 10
  const gradeColor  = grade === 10 ? '#F59E0B' : grade >= 9 ? '#C0C0C0' : '#CD7F32'
  const glowColor   = grade === 10 ? 'rgba(245,158,11,0.7)' : grade >= 9 ? 'rgba(192,192,192,0.5)' : 'rgba(205,127,50,0.5)'

  return (
    <motion.div
      initial={{ y: '50vh', rotateX: 22, scale: 0.8 }}
      animate={{ y: 0, rotateX: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 65, damping: 13, delay: 0.25 }}
      style={{ perspective: '900px' }}
    >
      <div style={{
        width: 240,
        background: 'linear-gradient(160deg, #1c1c1c 0%, #111 100%)',
        border: `2px solid ${gradeColor}`,
        boxShadow: `0 0 50px ${glowColor}, 0 0 100px ${glowColor}40, 0 30px 80px rgba(0,0,0,0.7)`,
        animation: isPsa10 ? 'rainbow-border 3.5s linear infinite' : undefined,
        padding: '20px 16px 16px',
        textAlign: 'center' as const,
      }}>
        {/* PSA header */}
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 7, letterSpacing: '0.38em', color: '#555', margin: 0 }}>
            PROFESSIONAL SPORTS AUTHENTICATOR
          </p>
        </div>

        {/* Grade number — pops in */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: phase !== 'enter' ? 1 : 0, opacity: phase !== 'enter' ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.55 }}
        >
          <span style={{
            display: 'block',
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 108,
            lineHeight: 1,
            color: gradeColor,
            textShadow: `0 0 50px ${glowColor}`,
            marginBottom: 4,
          }}>
            {grade}
          </span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, letterSpacing: '0.28em', color: gradeColor, opacity: 0.7 }}>
            GEM MINT
          </span>
        </motion.div>

        {/* Card image */}
        {product.img_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase === 'info' ? 1 : 0, y: phase === 'info' ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ position: 'relative', width: '100%', aspectRatio: '3/4', marginTop: 12, overflow: 'hidden' }}
          >
            <Image src={product.img_url} alt={product.name} fill style={{ objectFit: 'contain' }} sizes="200px" />
            {/* Holographic sweep on reveal */}
            <motion.div
              initial={{ x: '-110%' }}
              animate={{ x: phase === 'info' ? '220%' : '-110%' }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(108deg, transparent 30%, rgba(255,255,255,0.55) 48%, rgba(255,220,80,0.4) 52%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// BOOSTER / COLLECTION BOX reveal — pack explodes, cards fly
// ─────────────────────────────────────────────────────────────
function BoosterReveal({ product, phase }: { product: Product; phase: Phase }) {
  const isReveal = phase !== 'enter'

  return (
    <div style={{ position: 'relative', width: 380, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Flying mini-cards fan */}
      {CARD_FAN.map((c, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.3 }}
          animate={isReveal ? { x: c.x, y: c.y, rotate: c.r, opacity: 0.75, scale: 1 } : { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.3 }}
          transition={{ type: 'spring', stiffness: 70, damping: 11, delay: c.delay }}
          style={{
            position: 'absolute',
            width: 54, height: 76,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
            border: '1px solid rgba(250,93,41,0.45)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.65)',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: 'rgba(250,93,41,0.5)' }}>?</span>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(250,93,41,0.12) 0%, transparent 50%, rgba(245,158,11,0.08) 100%)' }} />
        </motion.div>
      ))}

      {/* Centre: product pack image */}
      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: isReveal ? 1 : 0, rotate: isReveal ? 0 : -12 }}
        transition={{ type: 'spring', stiffness: 90, damping: 13, delay: 0.35 }}
        style={{ position: 'relative', width: 148, height: 208, zIndex: 10 }}
      >
        {product.img_url ? (
          <>
            <Image src={product.img_url} alt={product.name} fill style={{ objectFit: 'contain' }} sizes="160px" />
            {/* Shine sweep */}
            <motion.div
              initial={{ x: '-110%' }}
              animate={{ x: isReveal ? '240%' : '-110%' }}
              transition={{ duration: 0.8, delay: 0.85, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(108deg, transparent 35%, rgba(255,255,255,0.52) 50%, transparent 65%)',
                pointerEvents: 'none',
              }}
            />
          </>
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a1a1a, #111)',
            border: '1px solid rgba(250,93,41,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, color: 'var(--orange)' }}>?</span>
          </div>
        )}

        {/* Burst particles from center */}
        <AnimatePresence>
          {isReveal && BURST.slice(0, 14).map((p, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{ x: Math.cos(p.angle) * p.dist * 0.7, y: Math.sin(p.angle) * p.dist * 0.7, scale: 1, opacity: 0 }}
              transition={{ duration: p.dur, ease: 'easeOut', delay: p.delay }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                width: p.size, height: p.size, borderRadius: '50%',
                background: p.accent ? '#FA5D29' : '#F59E0B',
                boxShadow: `0 0 ${p.size * 2}px ${p.accent ? 'rgba(250,93,41,0.9)' : 'rgba(245,158,11,0.9)'}`,
                pointerEvents: 'none', zIndex: 25,
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SINGLES reveal — card flips face-up with holo sweep
// ─────────────────────────────────────────────────────────────
function SinglesReveal({ product, phase }: { product: Product; phase: Phase }) {
  const isReveal = phase !== 'enter'
  const isPsa = !!product.psa_grade

  return (
    <div style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}>
      <motion.div
        initial={{ rotateY: 180, scale: 0.75 }}
        animate={{ rotateY: isReveal ? 0 : 180, scale: isReveal ? 1 : 0.75 }}
        transition={{ type: 'spring', stiffness: 52, damping: 10, delay: 0.3 }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: 220, height: 308 }}
      >
        {/* BACK face */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #111 0%, #1a0800 100%)',
          border: '1px solid rgba(250,93,41,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        }}>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 52, color: 'rgba(250,93,41,0.3)', letterSpacing: '0.08em' }}>MM</span>
        </div>

        {/* FRONT face */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          overflow: 'hidden',
          border: `1.5px solid ${isPsa ? '#F59E0B' : 'rgba(250,93,41,0.5)'}`,
          boxShadow: isPsa
            ? '0 0 50px rgba(245,158,11,0.5), 0 30px 80px rgba(0,0,0,0.7), animation: rainbow-border 3.5s linear infinite'
            : '0 0 40px rgba(250,93,41,0.35), 0 30px 80px rgba(0,0,0,0.7)',
        }}>
          {product.img_url && (
            <Image src={product.img_url} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="220px" />
          )}
          {/* Holographic rainbow sweep on reveal */}
          <motion.div
            initial={{ x: '-110%' }}
            animate={{ x: isReveal ? '260%' : '-110%' }}
            transition={{ duration: 1.1, delay: 0.95, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(108deg, transparent 25%, rgba(255,220,80,0.65) 42%, rgba(80,200,255,0.5) 52%, rgba(220,80,255,0.4) 62%, transparent 75%)',
              pointerEvents: 'none',
            }}
          />
          {/* Edge glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN OVERLAY
// ─────────────────────────────────────────────────────────────
interface Props {
  product: Product
  onClose: () => void
}

export default function WowRevealOverlay({ product, onClose }: Props) {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<Phase>('enter')
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    // mystery box auto-opens at 1.28s, info phase after ~2.3s
    const t1 = setTimeout(() => setPhase('reveal'), 300)
    const t2 = setTimeout(() => setPhase('info'), product.category === 'mystery-box' ? 2400 : 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [product.category])

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  const handleNavigate = useCallback(() => {
    onClose()
    router.push(`/shop/${product.slug}`)
  }, [onClose, product.slug, router])

  if (!mounted) return null

  const cat = product.category

  const bgGlow =
    cat === 'psa-graded'    ? (product.psa_grade === 10 ? 'rgba(245,158,11,0.14)' : 'rgba(192,192,192,0.1)') :
    cat === 'mystery-box'   ? `rgba(250,93,41,0.12)` :
    cat === 'singles'       ? 'rgba(139,92,246,0.1)' :
    'rgba(250,93,41,0.1)'

  const labelText =
    cat === 'psa-graded'    ? '— PSA GRADED —' :
    cat === 'mystery-box'   ? '— MYSTERY BOX —' :
    cat === 'booster-box'   ? '— BOOSTER BOX —' :
    cat === 'collection-box'? '— KOLEKCIA —' :
    '— SINGLE KARTA —'

  const content = (
    <AnimatePresence>
      <motion.div
        key="wow-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 99997,
          background: `radial-gradient(ellipse at 50% 40%, ${bgGlow} 0%, rgba(8,8,8,0.97) 65%)`,
          backdropFilter: 'blur(14px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
        onClick={onClose}
      >
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.018,
          backgroundImage: 'linear-gradient(var(--ghost) 1px, transparent 1px), linear-gradient(90deg, var(--ghost) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 24, right: 28, zIndex: 10,
            background: 'none', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.45)', cursor: 'none',
            width: 40, height: 40,
            fontFamily: 'Space Mono, monospace', fontSize: 14,
          }}
        >✕</button>

        {/* Category label */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            position: 'absolute', top: 30, left: '50%', translateX: '-50%',
            fontFamily: 'Space Mono, monospace', fontSize: 9,
            letterSpacing: '0.45em', color: 'var(--orange)',
            margin: 0, pointerEvents: 'none',
          }}
        >
          {labelText}
        </motion.p>

        {/* ── Animation area — clicks don't propagate to close overlay ── */}
        <div
          onClick={e => e.stopPropagation()}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ marginBottom: 8 }}>
            {cat === 'mystery-box'                        && <MysteryReveal product={product} />}
            {cat === 'psa-graded'                         && <PsaReveal product={product} phase={phase} />}
            {(cat === 'booster-box' || cat === 'collection-box') && <BoosterReveal product={product} phase={phase} />}
            {cat === 'singles'                            && <SinglesReveal product={product} phase={phase} />}
          </div>

          {/* ── Product info + CTAs — appear in 'info' phase ── */}
          <AnimatePresence>
            {phase === 'info' && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                style={{ textAlign: 'center', padding: '0 24px', maxWidth: 480 }}
              >
                <h2 style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 'clamp(22px, 3.5vw, 40px)',
                  letterSpacing: '0.04em', color: 'var(--ghost)',
                  margin: '0 0 4px',
                }}>
                  {product.name}
                </h2>
                {product.set_name && (
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: '0.24em', color: 'var(--dim)', margin: '0 0 14px' }}>
                    {product.set_name}
                  </p>
                )}
                <div style={{
                  fontFamily: 'Space Mono, monospace', fontSize: 30, fontWeight: 700,
                  color: 'var(--gold)', marginBottom: 22,
                  textShadow: '0 0 24px rgba(245,158,11,0.55)',
                }}>
                  {formatPrice(product.price)}
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <CartButton product={product} />
                  <button
                    onClick={handleNavigate}
                    style={{
                      padding: '11px 22px',
                      border: '1px solid rgba(255,255,255,0.18)',
                      background: 'transparent', color: 'var(--ghost)',
                      fontFamily: 'Space Mono, monospace', fontSize: 9,
                      letterSpacing: '0.16em', cursor: 'none',
                    }}
                  >
                    DETAIL →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hint */}
        <motion.p
          animate={{ opacity: phase === 'info' ? 0.28 : 0 }}
          style={{
            position: 'absolute', bottom: 18,
            fontFamily: 'Space Mono, monospace', fontSize: 8,
            letterSpacing: '0.3em', color: 'var(--dim)', margin: 0,
            pointerEvents: 'none',
          }}
        >
          ESC / KLIK NA ZATVORIŤ
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )

  return createPortal(content, document.body)
}
