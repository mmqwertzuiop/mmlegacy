'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/types'
import { useCartStore } from '@/lib/cart'

interface CartButtonProps {
  product: Product
  className?: string
  fullWidth?: boolean
}

const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

export default function CartButton({ product, fullWidth = false }: CartButtonProps) {
  const [added, setAdded] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [burst, setBurst] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setBurst(true)
    setTimeout(() => setBurst(false), 600)
    setTimeout(() => setAdded(false), 2200)
  }

  const disabled = product.stock === 0

  return (
    <motion.button
      onClick={disabled ? undefined : handleAdd}
      disabled={disabled}
      onMouseEnter={() => !disabled && !added && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      whileTap={disabled ? {} : { scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        display: 'block',
        width: fullWidth ? '100%' : 'auto',
        padding: '11px 16px',
        fontFamily: 'Space Mono, monospace',
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'none',
        opacity: disabled ? 0.35 : 1,
        position: 'relative',
        overflow: 'hidden',
        background: disabled
          ? 'rgba(255,255,255,0.02)'
          : added
          ? 'linear-gradient(135deg, var(--green), #16a34a)'
          : hovering
          ? 'linear-gradient(135deg, var(--orange), #e85b20)'
          : 'linear-gradient(135deg, rgba(250,93,41,0.1), rgba(250,93,41,0.04))',
        color: disabled ? 'var(--dim)' : added || hovering ? '#000' : 'var(--orange)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : added ? 'var(--green)' : hovering ? 'var(--orange)' : 'rgba(250,93,41,0.5)'}`,
        boxShadow: added
          ? '0 0 24px rgba(34,197,94,0.5), 0 0 48px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.15)'
          : hovering
          ? '0 0 20px rgba(250,93,41,0.35), 0 0 40px rgba(250,93,41,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 0 12px rgba(250,93,41,0.12), inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Shine sweep on hover */}
      <motion.div
        initial={false}
        animate={{ x: hovering && !added && !disabled ? '350%' : '-100%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          top: 0,
          left: '-40%',
          width: '40%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          transform: 'skewX(-18deg)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Added glow pulse ring */}
      <AnimatePresence>
        {added && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              border: '1px solid var(--green)',
              borderRadius: 1,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}
      </AnimatePresence>

      {/* Text */}
      <span style={{ position: 'relative', zIndex: 2, display: 'inline-block' }}>
        <AnimatePresence mode="wait">
          {disabled ? (
            <motion.span key="sold">VYPREDANÉ</motion.span>
          ) : added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              ✓&nbsp;&nbsp;PRIDANÉ
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              + DO KOŠÍKA
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Particle burst */}
      <AnimatePresence>
        {burst &&
          BURST_ANGLES.map((angle, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((angle * Math.PI) / 180) * 32,
                y: Math.sin((angle * Math.PI) / 180) * 18,
                opacity: 0,
                scale: 0.4,
              }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.02 }}
              style={{
                position: 'absolute',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: i % 2 === 0 ? 'var(--green)' : '#86efac',
                pointerEvents: 'none',
                zIndex: 10,
                left: 'calc(50% - 2.5px)',
                top: 'calc(50% - 2.5px)',
              }}
            />
          ))}
      </AnimatePresence>
    </motion.button>
  )
}
