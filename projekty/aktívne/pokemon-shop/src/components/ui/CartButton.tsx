'use client'
import { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/cart'

interface CartButtonProps {
  product: Product
  className?: string
  fullWidth?: boolean
}

export default function CartButton({ product, fullWidth = false }: CartButtonProps) {
  const [added, setAdded] = useState(false)
  const [hovering, setHovering] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const disabled = product.stock === 0

  const bg = disabled
    ? 'transparent'
    : added
    ? 'var(--green)'
    : hovering
    ? 'var(--orange)'
    : 'transparent'

  const color = disabled
    ? 'var(--dim)'
    : added
    ? '#000'
    : hovering
    ? '#000'
    : 'var(--orange)'

  const borderColor = disabled
    ? 'var(--surface-2)'
    : added
    ? 'var(--green)'
    : 'var(--orange)'

  return (
    <button
      onClick={disabled ? undefined : handleAdd}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        display: 'block',
        width: fullWidth ? '100%' : 'auto',
        padding: '11px 16px',
        fontFamily: 'Space Mono, monospace',
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        background: bg,
        color,
        border: `1px solid ${borderColor}`,
        cursor: disabled ? 'not-allowed' : 'none',
        opacity: disabled ? 0.35 : 1,
        transition: 'all 0.18s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {disabled ? 'VYPREDANÉ' : added ? '✓  PRIDANÉ' : '+ DO KOŠÍKA'}
    </button>
  )
}
