'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart'
import { formatPrice } from '@/data/products'

export default function CheckoutPage() {
  const { items, total } = useCartStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '', country: 'Slovakia',
    payment: 'card',
  })

  const totalCents = total()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) setStep(2)
    else setStep(3)
  }

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--orange)' }}>MM LEGACY</p>
          <h1 className="font-headline text-6xl" style={{ color: 'var(--ghost)' }}>CHECKOUT</h1>

          {/* Steps */}
          <div className="flex items-center gap-4 mt-6">
            {[
              { n: 1, label: 'ADRESA' },
              { n: 2, label: 'PLATBA' },
              { n: 3, label: 'POTVRDENIE' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center font-mono text-xs font-bold"
                  style={{ background: step >= s.n ? 'var(--orange)' : 'var(--surface)', color: step >= s.n ? '#000' : 'var(--dim)' }}
                >
                  {step > s.n ? '✓' : s.n}
                </div>
                <span className="font-mono text-xs" style={{ color: step >= s.n ? 'var(--ghost)' : 'var(--dim)' }}>{s.label}</span>
                {i < 2 && <div className="h-px w-8" style={{ background: 'var(--surface-2)' }} />}
              </div>
            ))}
          </div>
        </div>

        {step === 3 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 text-4xl" style={{ background: 'rgba(34,197,94,0.2)', color: 'var(--green)' }}>✓</div>
            <h2 className="font-headline text-5xl mb-4" style={{ color: 'var(--ghost)' }}>OBJEDNÁVKA ODOSLANÁ!</h2>
            <p className="font-mono text-sm mb-8" style={{ color: 'var(--dim)' }}>Pošleme ti potvrdenie na email. Ďakujeme za nákup!</p>
            <Link href="/shop">
              <button className="btn-primary px-10 py-4 text-sm tracking-widest">POKRAČOVAŤ V NÁKUPE</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div>
                    <h2 className="font-headline text-3xl mb-6" style={{ color: 'var(--ghost)' }}>DORUČOVACIA ADRESA</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {[
                        { key: 'firstName', label: 'Meno', placeholder: 'Ján' },
                        { key: 'lastName', label: 'Priezvisko', placeholder: 'Novák' },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="font-mono text-xs block mb-2" style={{ color: 'var(--dim)' }}>{field.label.toUpperCase()}</label>
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={formData[field.key as keyof typeof formData]}
                            onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                            className="w-full px-4 py-3 font-mono text-sm outline-none"
                            style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }}
                            required
                          />
                        </div>
                      ))}
                    </div>
                    {[
                      { key: 'email', label: 'Email', type: 'email', placeholder: 'jan@example.sk' },
                      { key: 'phone', label: 'Telefón', type: 'tel', placeholder: '+421 900 000 000' },
                      { key: 'address', label: 'Adresa', type: 'text', placeholder: 'Ulica a číslo domu' },
                    ].map(field => (
                      <div key={field.key} className="mb-4">
                        <label className="font-mono text-xs block mb-2" style={{ color: 'var(--dim)' }}>{field.label.toUpperCase()}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-full px-4 py-3 font-mono text-sm outline-none"
                          style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }}
                          required
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div>
                        <label className="font-mono text-xs block mb-2" style={{ color: 'var(--dim)' }}>MESTO</label>
                        <input type="text" placeholder="Bratislava" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} className="w-full px-4 py-3 font-mono text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }} required />
                      </div>
                      <div>
                        <label className="font-mono text-xs block mb-2" style={{ color: 'var(--dim)' }}>PSČ</label>
                        <input type="text" placeholder="81101" value={formData.zip} onChange={e => setFormData(p => ({ ...p, zip: e.target.value }))} className="w-full px-4 py-3 font-mono text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }} required />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="font-headline text-3xl mb-6" style={{ color: 'var(--ghost)' }}>SPÔSOB PLATBY</h2>
                    <div className="space-y-3 mb-8">
                      {[
                        { value: 'card', label: 'Kreditná / Debetná karta', desc: 'Visa, Mastercard, Amex' },
                        { value: 'transfer', label: 'Bankový prevod', desc: 'IBAN platba' },
                        { value: 'cod', label: 'Dobierka', desc: 'Platba pri prevzatí' },
                      ].map(method => (
                        <label
                          key={method.value}
                          className="flex items-center gap-4 p-4 cursor-none"
                          style={{
                            background: formData.payment === method.value ? 'rgba(250,93,41,0.1)' : 'var(--surface)',
                            border: `1px solid ${formData.payment === method.value ? 'var(--orange)' : 'var(--surface-2)'}`,
                          }}
                        >
                          <input type="radio" name="payment" value={method.value} checked={formData.payment === method.value} onChange={e => setFormData(p => ({ ...p, payment: e.target.value }))} className="accent-orange-500" />
                          <div>
                            <p className="font-bold text-sm" style={{ color: 'var(--ghost)' }}>{method.label}</p>
                            <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>{method.desc}</p>
                          </div>
                          {method.value === 'card' && (
                            <span className="ml-auto font-mono text-xs px-2 py-0.5" style={{ background: 'rgba(34,197,94,0.2)', color: 'var(--green)' }}>
                              STRIPE
                            </span>
                          )}
                        </label>
                      ))}
                    </div>

                    {formData.payment === 'card' && (
                      <div className="p-4 mb-8" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
                        <p className="font-mono text-xs mb-4" style={{ color: 'var(--dim)' }}>PLATOBNÉ ÚDAJE (Stripe sandbox)</p>
                        <div className="space-y-3">
                          <div>
                            <label className="font-mono text-xs block mb-1" style={{ color: 'var(--dim)' }}>ČÍSLO KARTY</label>
                            <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-3 py-2 font-mono text-sm outline-none" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="font-mono text-xs block mb-1" style={{ color: 'var(--dim)' }}>PLATNOSŤ</label>
                              <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 font-mono text-sm outline-none" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }} />
                            </div>
                            <div>
                              <label className="font-mono text-xs block mb-1" style={{ color: 'var(--dim)' }}>CVV</label>
                              <input type="text" placeholder="123" className="w-full px-3 py-2 font-mono text-sm outline-none" style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button type="submit" className="btn-primary px-10 py-4 text-sm tracking-widest w-full">
                  {step === 1 ? 'POKRAČOVAŤ NA PLATBU' : 'DOKONČIŤ OBJEDNÁVKU'}
                </button>
              </form>
            </div>

            {/* Order summary */}
            <div>
              <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', position: 'sticky', top: '80px' }}>
                <h3 className="font-headline text-xl mb-4" style={{ color: 'var(--ghost)' }}>SÚHRN OBJEDNÁVKY</h3>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span style={{ color: 'var(--dim)' }}>{item.product.name} <span style={{ color: 'var(--orange)' }}>×{item.quantity}</span></span>
                      <span className="font-mono" style={{ color: 'var(--ghost)' }}>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4" style={{ borderTop: '1px solid var(--surface-2)' }}>
                  <div className="flex justify-between font-bold">
                    <span style={{ color: 'var(--ghost)' }}>CELKOM</span>
                    <span className="font-mono text-xl" style={{ color: 'var(--gold)' }}>{formatPrice(totalCents)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
