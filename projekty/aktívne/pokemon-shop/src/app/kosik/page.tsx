'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/cart'
import { formatPrice } from '@/data/products'

function QtyBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      className="px-3 py-1 font-mono text-sm"
      style={{
        color: 'var(--ghost)',
        background: 'var(--surface-2)',
        border: 'none',
        cursor: 'none',
        minWidth: 32,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(250,93,41,0.2)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--surface-2)')}
    >
      {children}
    </motion.button>
  )
}

export default function KosikPage() {
  const { items, removeItem, updateQuantity, total, count } = useCartStore()
  const totalCents = total()
  const loyaltyPoints = Math.floor(totalCents / 100)

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 48px' }}>

        {/* Header */}
        <div className="mb-12" style={{ borderBottom: '1px solid var(--surface-2)', paddingBottom: '2rem' }}>
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--orange)' }}>MM LEGACY</p>
          <h1 className="font-headline text-6xl md:text-7xl" style={{ color: 'var(--ghost)' }}>KOŠÍK</h1>
          <p className="font-mono text-sm mt-2" style={{ color: 'var(--dim)' }}>{count()} položiek</p>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-24"
          >
            {/* Empty cart icon */}
            <div style={{
              width: 80, height: 80,
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'var(--surface)',
              border: '1px solid var(--surface-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32,
            }}>
              🛒
            </div>
            <p className="font-headline text-5xl mb-4" style={{ color: 'var(--dim)' }}>PRÁZDNY KOŠÍK</p>
            <p className="font-mono text-sm mb-10" style={{ color: 'var(--dim)' }}>Zatiaľ si nič nepridali do košíka.</p>
            <Link href="/shop">
              <button className="btn-primary px-10 py-4 text-sm tracking-widest">PREHLIADAŤ SHOP</button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item, idx) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -40, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28, delay: idx * 0.04 }}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--surface-2)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Top gradient accent line */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: 1,
                      background: 'linear-gradient(90deg, transparent, rgba(250,93,41,0.4), transparent)',
                    }} />

                    <div className="flex gap-4 p-4">
                      {/* Product image */}
                      <div
                        className="relative shrink-0"
                        style={{
                          width: 80, height: 110,
                          background: 'linear-gradient(135deg, var(--surface-2), rgba(250,93,41,0.05))',
                          overflow: 'hidden',
                        }}
                      >
                        {item.product.img_url && (
                          <Image
                            src={item.product.img_url}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                            sizes="80px"
                            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
                          />
                        )}
                        {/* Holographic shimmer overlay */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(135deg, rgba(250,93,41,0.06) 0%, transparent 50%, rgba(245,158,11,0.06) 100%)',
                          pointerEvents: 'none',
                        }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold mb-1 truncate" style={{ color: 'var(--ghost)' }}>{item.product.name}</h3>
                        {item.product.set_name && (
                          <p className="font-mono text-xs mb-2" style={{ color: 'var(--dim)' }}>{item.product.set_name}</p>
                        )}
                        {item.product.psa_grade && (
                          <span
                            className="font-mono text-xs px-2 py-0.5 mr-2 inline-block mb-2"
                            style={{
                              background: 'linear-gradient(135deg, var(--gold), #d97706)',
                              color: '#000',
                              boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
                            }}
                          >
                            PSA {item.product.psa_grade}
                          </span>
                        )}

                        <div className="flex items-center gap-3 mt-3">
                          {/* Quantity controls */}
                          <div
                            className="flex items-center"
                            style={{
                              border: '1px solid var(--surface-2)',
                              overflow: 'hidden',
                            }}
                          >
                            <QtyBtn onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</QtyBtn>
                            <span
                              className="px-3 py-1 font-mono text-sm"
                              style={{ color: 'var(--ghost)', minWidth: 32, textAlign: 'center' }}
                            >
                              {item.quantity}
                            </span>
                            <QtyBtn onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</QtyBtn>
                          </div>

                          <motion.button
                            whileHover={{ color: 'var(--red)' }}
                            className="font-mono text-xs"
                            style={{ color: 'var(--dim)', cursor: 'none', background: 'none', border: 'none', transition: 'color 0.15s' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--red)')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--dim)')}
                            onClick={() => removeItem(item.product.id)}
                          >
                            ODSTRÁNIŤ
                          </motion.button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right pl-2">
                        <p className="font-mono font-bold text-lg" style={{ color: 'var(--gold)' }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="font-mono text-xs mt-1" style={{ color: 'var(--dim)' }}>
                            {formatPrice(item.product.price)} / ks
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{ position: 'sticky', top: '120px' }}
              >
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--surface-2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Header accent */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(250,93,41,0.08), transparent)',
                    padding: '1.5rem 1.5rem 0',
                    borderBottom: '1px solid var(--surface-2)',
                    marginBottom: '1.5rem',
                    paddingBottom: '1.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h2 className="font-headline text-2xl" style={{ color: 'var(--ghost)' }}>SÚHRN</h2>
                      <span className="font-mono text-xs" style={{ color: 'var(--dim)' }}>{count()} ks</span>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="font-mono text-sm" style={{ color: 'var(--dim)' }}>Medzisúčet</span>
                        <span className="font-mono text-sm" style={{ color: 'var(--ghost)' }}>{formatPrice(totalCents)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono text-sm" style={{ color: 'var(--dim)' }}>Doprava</span>
                        <span className="font-mono text-sm" style={{ color: 'var(--green)' }}>Vypočíta sa</span>
                      </div>
                    </div>

                    {/* Total line */}
                    <div
                      className="flex justify-between py-4 mb-6"
                      style={{
                        borderTop: '1px solid transparent',
                        borderBottom: '1px solid transparent',
                        borderImage: 'linear-gradient(90deg, transparent, var(--surface-2), transparent) 1',
                      }}
                    >
                      <span className="font-mono font-bold" style={{ color: 'var(--ghost)' }}>CELKOM</span>
                      <span className="font-mono font-bold text-xl" style={{ color: 'var(--gold)' }}>{formatPrice(totalCents)}</span>
                    </div>

                    {/* XP loyalty */}
                    <div
                      className="p-3 mb-5"
                      style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))',
                        border: '1px solid rgba(245,158,11,0.25)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: 3,
                        background: 'linear-gradient(180deg, var(--gold), transparent)',
                      }} />
                      <p className="font-mono text-xs pl-2" style={{ color: 'var(--gold)' }}>
                        ⚡ Za tento nákup získaš <strong>{loyaltyPoints} XP</strong>
                      </p>
                    </div>

                    {/* CTA */}
                    <Link href="/checkout" className="block mb-3">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary w-full py-4 text-sm tracking-widest"
                        style={{ cursor: 'none', position: 'relative', overflow: 'hidden' }}
                      >
                        POKRAČOVAŤ NA PLATBU →
                      </motion.button>
                    </Link>
                    <Link href="/shop" className="block">
                      <button
                        className="w-full py-3 font-mono text-xs tracking-widest"
                        style={{
                          border: '1px solid var(--surface-2)',
                          color: 'var(--dim)',
                          background: 'transparent',
                          cursor: 'none',
                          transition: 'border-color 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.borderColor = 'var(--orange)'
                          el.style.color = 'var(--ghost)'
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.borderColor = 'var(--surface-2)'
                          el.style.color = 'var(--dim)'
                        }}
                      >
                        ← POKRAČOVAŤ V NÁKUPE
                      </button>
                    </Link>

                    {/* Trust strip */}
                    <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--surface-2)' }}>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { icon: '🔒', label: 'Zabezpečená platba' },
                          { icon: '📦', label: 'Rýchle odoslanie' },
                          { icon: '✅', label: 'Overený predajca' },
                          { icon: '↩️', label: '14-dňový vrátenie' },
                        ].map((t, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span style={{ fontSize: 12 }}>{t.icon}</span>
                            <span className="font-mono" style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.05em' }}>{t.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
