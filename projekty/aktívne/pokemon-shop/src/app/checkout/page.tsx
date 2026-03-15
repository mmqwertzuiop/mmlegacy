'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/cart'
import { formatPrice } from '@/data/products'

// ── Floating label input ─────────────────────────────────────────────────────
function FloatInput({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string
  id: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0

  return (
    <div style={{ position: 'relative', paddingTop: 8 }}>
      <motion.label
        htmlFor={id}
        animate={{
          top: lifted ? 2 : 18,
          fontSize: lifted ? 9 : 12,
          color: focused ? 'var(--orange)' : lifted ? 'var(--dim)' : 'rgba(160,160,160,0.5)',
          letterSpacing: lifted ? '0.15em' : '0.05em',
        }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          left: 14,
          pointerEvents: 'none',
          fontFamily: 'Space Mono, monospace',
          fontWeight: 700,
          zIndex: 1,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </motion.label>
      <input
        id={id}
        type={type}
        placeholder={focused ? placeholder : ''}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full font-mono text-sm outline-none"
        style={{
          background: focused
            ? 'rgba(250,93,41,0.05)'
            : 'rgba(255,255,255,0.03)',
          border: 'none',
          borderBottom: `2px solid ${focused ? 'var(--orange)' : value.length > 0 ? 'rgba(250,93,41,0.35)' : 'rgba(255,255,255,0.1)'}`,
          borderLeft: `3px solid ${focused ? 'var(--orange)' : value.length > 0 ? 'rgba(250,93,41,0.35)' : 'rgba(255,255,255,0.06)'}`,
          color: 'var(--ghost)',
          padding: '24px 14px 8px',
          boxShadow: focused
            ? '0 4px 20px rgba(250,93,41,0.08), inset 0 0 0 1px rgba(250,93,41,0.08)'
            : 'inset 0 1px 3px rgba(0,0,0,0.15)',
          transition: 'background 0.15s, border-color 0.2s, box-shadow 0.2s',
          cursor: 'text',
        }}
      />
    </div>
  )
}

// ── Payment method icons ─────────────────────────────────────────────────────
const PAYMENT_ICONS: Record<string, string> = {
  card: '💳',
  transfer: '🏦',
  cod: '📦',
}

const PAYMENT_METHODS = [
  { value: 'card', label: 'Kreditná / Debetná karta', desc: 'Visa · Mastercard · Amex', badge: 'STRIPE SECURE' },
  { value: 'transfer', label: 'Bankový prevod', desc: 'IBAN platba · 1–2 dni', badge: '' },
  { value: 'cod', label: 'Dobierka', desc: 'Platba pri prevzatí (+2 €)', badge: '' },
]

// ── Confetti particles (deterministic) ──────────────────────────────────────
const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: ((i * 97) % 100) - 50,
  y: -((i * 67) % 80) - 20,
  rotate: (i * 37) % 360,
  color: ['var(--orange)', 'var(--gold)', 'var(--green)', '#a78bfa', '#38bdf8'][i % 5],
  size: 4 + (i % 5),
  delay: (i * 0.04),
}))

// ── Main page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, total } = useCartStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '', country: 'Slovakia',
    payment: 'card',
    cardNumber: '', cardExpiry: '', cardCvv: '',
  })

  const totalCents = total()

  const set = (key: string) => (v: string) => setFormData(p => ({ ...p, [key]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) setStep(2)
    else setStep(3)
  }

  const STEPS = [
    { n: 1, label: 'ADRESA' },
    { n: 2, label: 'PLATBA' },
    { n: 3, label: 'POTVRDENIE' },
  ]

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">

        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--orange)' }}>MM LEGACY</p>
          <h1 className="font-headline text-6xl" style={{ color: 'var(--ghost)' }}>CHECKOUT</h1>

          {/* Premium step indicator */}
          <div className="flex items-center mt-8" style={{ gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center">
                {/* Step circle */}
                <div style={{ position: 'relative' }}>
                  <motion.div
                    animate={{
                      background: step > s.n
                        ? 'var(--green)'
                        : step === s.n
                        ? 'var(--orange)'
                        : 'var(--surface)',
                      borderColor: step >= s.n ? (step > s.n ? 'var(--green)' : 'var(--orange)') : 'var(--surface-2)',
                      boxShadow: step === s.n
                        ? '0 0 16px rgba(250,93,41,0.5), 0 0 32px rgba(250,93,41,0.15)'
                        : step > s.n
                        ? '0 0 12px rgba(34,197,94,0.4)'
                        : 'none',
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: '2px solid',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {step > s.n ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                          className="font-mono font-bold"
                          style={{ fontSize: 14, color: '#000' }}
                        >
                          ✓
                        </motion.span>
                      ) : (
                        <motion.span
                          key="num"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-mono font-bold"
                          style={{
                            fontSize: 12,
                            color: step === s.n ? '#000' : 'var(--dim)',
                          }}
                        >
                          {s.n}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Label under step */}
                <span
                  className="font-mono text-xs ml-2"
                  style={{ color: step >= s.n ? 'var(--ghost)' : 'var(--dim)', whiteSpace: 'nowrap' }}
                >
                  {s.label}
                </span>

                {/* Connector line */}
                {i < 2 && (
                  <div
                    style={{
                      width: 48,
                      height: 1,
                      margin: '0 12px',
                      background: 'var(--surface-2)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      animate={{ scaleX: step > s.n ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--green)',
                        transformOrigin: 'left',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 3 — Success */}
        <AnimatePresence mode="wait">
          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {/* Confetti */}
              {CONFETTI.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ y: -40, x: p.x * 3, opacity: 1, rotate: 0 }}
                  animate={{ y: 500, x: p.x * 5, opacity: 0, rotate: p.rotate }}
                  transition={{ duration: 1.8, delay: p.delay, ease: 'easeIn' }}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    borderRadius: p.id % 3 === 0 ? '50%' : 1,
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />
              ))}

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                style={{
                  width: 80, height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
                  border: '2px solid var(--green)',
                  boxShadow: '0 0 32px rgba(34,197,94,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 32px',
                  fontSize: 36,
                  position: 'relative', zIndex: 1,
                }}
              >
                ✓
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <h2 className="font-headline text-5xl mb-3" style={{ color: 'var(--ghost)' }}>OBJEDNÁVKA ODOSLANÁ!</h2>
                <p className="font-mono text-sm mb-2" style={{ color: 'var(--dim)' }}>Pošleme ti potvrdenie na email.</p>
                <p className="font-mono text-sm mb-10" style={{ color: 'var(--dim)' }}>Ďakujeme za nákup v MM Legacy! 🔥</p>
                <Link href="/shop">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary px-10 py-4 text-sm tracking-widest"
                    style={{ cursor: 'none' }}
                  >
                    POKRAČOVAŤ V NÁKUPE
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          )}

          {step !== 3 && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* ── Step 1: Address ── */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <h2 className="font-headline text-3xl mb-6" style={{ color: 'var(--ghost)' }}>DORUČOVACIA ADRESA</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <FloatInput id="firstName" label="Meno" placeholder="Ján" value={formData.firstName} onChange={set('firstName')} required />
                          <FloatInput id="lastName" label="Priezvisko" placeholder="Novák" value={formData.lastName} onChange={set('lastName')} required />
                        </div>
                        <div className="mb-4">
                          <FloatInput id="email" label="Email" type="email" placeholder="jan@example.sk" value={formData.email} onChange={set('email')} required />
                        </div>
                        <div className="mb-4">
                          <FloatInput id="phone" label="Telefón" type="tel" placeholder="+421 900 000 000" value={formData.phone} onChange={set('phone')} required />
                        </div>
                        <div className="mb-4">
                          <FloatInput id="address" label="Adresa" placeholder="Ulica a číslo domu" value={formData.address} onChange={set('address')} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <FloatInput id="city" label="Mesto" placeholder="Bratislava" value={formData.city} onChange={set('city')} required />
                          <FloatInput id="zip" label="PSČ" placeholder="81101" value={formData.zip} onChange={set('zip')} required />
                        </div>
                      </motion.div>
                    )}

                    {/* ── Step 2: Payment ── */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <h2 className="font-headline text-3xl mb-6" style={{ color: 'var(--ghost)' }}>SPÔSOB PLATBY</h2>

                        <div className="space-y-3 mb-8">
                          {PAYMENT_METHODS.map(method => {
                            const selected = formData.payment === method.value
                            return (
                              <motion.label
                                key={method.value}
                                whileHover={{ borderColor: 'rgba(250,93,41,0.4)' }}
                                animate={{
                                  background: selected ? 'rgba(250,93,41,0.07)' : 'var(--surface)',
                                  borderColor: selected ? 'var(--orange)' : 'var(--surface-2)',
                                  boxShadow: selected ? '0 0 20px rgba(250,93,41,0.1)' : 'none',
                                }}
                                transition={{ duration: 0.15 }}
                                className="flex items-center gap-4 p-4 cursor-none"
                                style={{
                                  border: '1px solid',
                                  position: 'relative',
                                  overflow: 'hidden',
                                }}
                              >
                                {selected && (
                                  <motion.div
                                    layoutId="payment-select-bg"
                                    style={{
                                      position: 'absolute',
                                      top: 0, left: 0, bottom: 0,
                                      width: 3,
                                      background: 'var(--orange)',
                                    }}
                                  />
                                )}
                                <input
                                  type="radio"
                                  name="payment"
                                  value={method.value}
                                  checked={selected}
                                  onChange={e => setFormData(p => ({ ...p, payment: e.target.value }))}
                                  className="accent-orange-500"
                                />
                                <span style={{ fontSize: 20 }}>{PAYMENT_ICONS[method.value]}</span>
                                <div className="flex-1">
                                  <p className="font-bold text-sm" style={{ color: 'var(--ghost)' }}>{method.label}</p>
                                  <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>{method.desc}</p>
                                </div>
                                {method.badge && (
                                  <span
                                    className="font-mono text-xs px-2 py-0.5"
                                    style={{
                                      background: 'rgba(34,197,94,0.15)',
                                      color: 'var(--green)',
                                      border: '1px solid rgba(34,197,94,0.25)',
                                    }}
                                  >
                                    {method.badge}
                                  </span>
                                )}
                              </motion.label>
                            )
                          })}
                        </div>

                        {/* Card fields */}
                        <AnimatePresence>
                          {formData.payment === 'card' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div
                                className="p-5 mb-8"
                                style={{
                                  background: 'var(--surface)',
                                  border: '1px solid var(--surface-2)',
                                  position: 'relative',
                                  overflow: 'hidden',
                                }}
                              >
                                {/* Card shimmer top */}
                                <div style={{
                                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                                  background: 'linear-gradient(90deg, transparent, rgba(250,93,41,0.3), transparent)',
                                }} />
                                <p className="font-mono text-xs mb-5 tracking-widest" style={{ color: 'var(--dim)' }}>
                                  🔒 PLATOBNÉ ÚDAJE (Stripe sandbox)
                                </p>
                                <div className="space-y-3">
                                  <FloatInput
                                    id="cardNumber"
                                    label="Číslo karty"
                                    placeholder="4242 4242 4242 4242"
                                    value={formData.cardNumber}
                                    onChange={set('cardNumber')}
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <FloatInput
                                      id="cardExpiry"
                                      label="Platnosť"
                                      placeholder="MM/YY"
                                      value={formData.cardExpiry}
                                      onChange={set('cardExpiry')}
                                    />
                                    <FloatInput
                                      id="cardCvv"
                                      label="CVV"
                                      placeholder="123"
                                      value={formData.cardCvv}
                                      onChange={set('cardCvv')}
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary px-10 py-4 text-sm tracking-widest w-full"
                    style={{ cursor: 'none', position: 'relative', overflow: 'hidden' }}
                  >
                    {step === 1 ? 'POKRAČOVAŤ NA PLATBU →' : 'DOKONČIŤ OBJEDNÁVKU →'}
                  </motion.button>

                  {step === 2 && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setStep(1)}
                      className="w-full py-3 font-mono text-xs tracking-widest mt-3"
                      style={{
                        border: '1px solid var(--surface-2)',
                        color: 'var(--dim)',
                        background: 'transparent',
                        cursor: 'none',
                        transition: 'border-color 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = 'rgba(250,93,41,0.3)'
                        el.style.color = 'var(--ghost)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = 'var(--surface-2)'
                        el.style.color = 'var(--dim)'
                      }}
                    >
                      ← SPÄŤ NA ADRESU
                    </motion.button>
                  )}
                </form>
              </div>

              {/* Order summary sidebar */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{ position: 'sticky', top: 80 }}
                >
                  <div
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--surface-2)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        padding: '1.25rem 1.25rem 1rem',
                        borderBottom: '1px solid var(--surface-2)',
                        background: 'linear-gradient(135deg, rgba(250,93,41,0.06), transparent)',
                      }}
                    >
                      <h3 className="font-headline text-xl" style={{ color: 'var(--ghost)' }}>SÚHRN OBJEDNÁVKY</h3>
                    </div>

                    <div style={{ padding: '1.25rem' }}>
                      <div className="space-y-3 mb-4">
                        {items.map(item => (
                          <div key={item.product.id} className="flex justify-between text-sm gap-2">
                            <span style={{ color: 'var(--dim)', flex: 1, minWidth: 0 }} className="truncate">
                              {item.product.name}{' '}
                              <span style={{ color: 'var(--orange)' }}>×{item.quantity}</span>
                            </span>
                            <span className="font-mono shrink-0" style={{ color: 'var(--ghost)' }}>
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div
                        className="pt-4"
                        style={{
                          borderTop: '1px solid transparent',
                          borderImage: 'linear-gradient(90deg, transparent, var(--surface-2), transparent) 1',
                        }}
                      >
                        <div className="flex justify-between font-bold">
                          <span style={{ color: 'var(--ghost)' }}>CELKOM</span>
                          <span className="font-mono text-xl" style={{ color: 'var(--gold)' }}>
                            {formatPrice(totalCents)}
                          </span>
                        </div>
                      </div>

                      {/* Payment logos */}
                      <div
                        className="mt-4 pt-4 flex flex-wrap gap-2"
                        style={{ borderTop: '1px solid var(--surface-2)' }}
                      >
                        {['VISA', 'MC', 'PAYPAL', 'APPLE PAY'].map(badge => (
                          <span
                            key={badge}
                            className="font-mono"
                            style={{
                              fontSize: 8,
                              letterSpacing: '0.1em',
                              padding: '3px 6px',
                              border: '1px solid var(--surface-2)',
                              color: 'var(--dim)',
                            }}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>

                      <p
                        className="font-mono mt-3"
                        style={{ fontSize: 9, color: 'var(--dim)', letterSpacing: '0.08em' }}
                      >
                        🔒 256-bit SSL · Platba je zabezpečená
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
