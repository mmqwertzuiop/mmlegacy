'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

const CONDITIONS = ['NM (Near Mint)', 'LP (Lightly Played)', 'MP (Moderately Played)', 'HP (Heavily Played)', 'D (Damaged)']
const LANGUAGES = ['SK', 'EN', 'DE', 'FR', 'JP', 'IT', 'ES', 'PT', 'KO', 'ZH']
const PSA_GRADES = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']

const POPULAR_SETS = [
  'Scarlet & Violet — Prismatic Evolutions (sv8pt5)',
  'Scarlet & Violet — Obsidian Flames (sv3pt5)',
  'Sword & Shield — Evolving Skies (swsh7)',
  'Sword & Shield — Chilling Reign (swsh6)',
  'Sword & Shield — Silver Tempest (swsh12)',
  'Sword & Shield — Brilliant Stars (swsh9)',
  'Scarlet & Violet — Paldea Evolved (sv2)',
  'Scarlet & Violet Base Set (sv1)',
  'Crown Zenith (swsh12pt5)',
  'Sword & Shield Base (swsh1)',
  'Other / Iná sada',
]

type Step = 'card' | 'contact' | 'done'

export default function VykupFormularPage() {
  const [step, setStep] = useState<Step>('card')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [card, setCard] = useState({
    card_name: '',
    card_set: '',
    card_condition: '',
    is_graded: false,
    psa_grade: '',
    quantity: '1',
    card_language: 'EN',
    expected_price: '',
    notes: '',
  })

  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const cardValid = card.card_name.trim() && card.card_set && card.card_condition && (card.is_graded ? card.psa_grade : true)
  const contactValid = contact.name.trim() && contact.email.trim()

  const handleSubmit = async () => {
    if (!contactValid) return
    setLoading(true)
    setError('')

    const { error: dbError } = await supabase.from('buyback_requests').insert({
      card_name: card.card_name.trim(),
      card_set: card.card_set,
      card_condition: card.card_condition,
      is_graded: card.is_graded,
      psa_grade: card.is_graded && card.psa_grade ? parseInt(card.psa_grade) : null,
      quantity: parseInt(card.quantity) || 1,
      card_language: card.card_language,
      expected_price: card.expected_price ? parseFloat(card.expected_price) : null,
      notes: card.notes.trim() || null,
      name: contact.name.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim() || null,
      status: 'pending',
    })

    if (dbError) {
      setError('Nastala chyba pri odosielaní. Skús to znovu alebo nás kontaktuj priamo.')
      setLoading(false)
      return
    }

    setStep('done')
    setLoading(false)
  }

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 48px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', textDecoration: 'none', letterSpacing: '0.15em' }}>DOMOV</Link>
        <span style={{ color: 'var(--dim)', fontSize: '10px' }}>›</span>
        <Link href="/vykup" style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', textDecoration: 'none', letterSpacing: '0.15em' }}>VÝKUP KARIET</Link>
        <span style={{ color: 'var(--dim)', fontSize: '10px' }}>›</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--ghost)', letterSpacing: '0.15em' }}>FORMULÁR</span>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 48px 80px' }}>

        {step !== 'done' && (
          <>
            <div className="text-center" style={{ marginBottom: '48px' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.4em', color: 'var(--orange)', marginBottom: '12px' }}>VÝKUP KARIET</p>
              <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: '8px' }}>
                {step === 'card' ? 'DETAIL KARTY' : 'KONTAKTNÉ ÚDAJE'}
              </h1>

              {/* Step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                {(['card', 'contact'] as Step[]).map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700,
                      background: step === s ? 'var(--orange)' : (step === 'contact' && s === 'card') ? 'var(--green)' : 'var(--surface-2)',
                      color: step === s ? '#000' : (step === 'contact' && s === 'card') ? '#000' : 'var(--dim)',
                    }}>
                      {step === 'contact' && s === 'card' ? '✓' : i + 1}
                    </div>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: step === s ? 'var(--ghost)' : 'var(--dim)', letterSpacing: '0.1em' }}>
                      {s === 'card' ? 'KARTA' : 'KONTAKT'}
                    </span>
                    {i === 0 && <span style={{ color: 'var(--dim)', margin: '0 4px' }}>—</span>}
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 'card' && (
                <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', padding: '40px' }}>

                    {/* Card name */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
                        NÁZOV KARTY *
                      </label>
                      <input
                        type="text"
                        placeholder="napr. Umbreon VMAX Alt Art"
                        value={card.card_name}
                        onChange={e => setCard(p => ({ ...p, card_name: e.target.value }))}
                        style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '15px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                        onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                        required
                      />
                    </div>

                    {/* Set */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
                        SADA / SET *
                      </label>
                      <select
                        value={card.card_set}
                        onChange={e => setCard(p => ({ ...p, card_set: e.target.value }))}
                        style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: card.card_set ? 'var(--ghost)' : 'var(--dim)', outline: 'none' }}
                        onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                        required
                      >
                        <option value="" disabled>Vyber sadu...</option>
                        {POPULAR_SETS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Condition + Language row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                      <div>
                        <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
                          STAV KARTY *
                        </label>
                        <select
                          value={card.card_condition}
                          onChange={e => setCard(p => ({ ...p, card_condition: e.target.value }))}
                          style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: card.card_condition ? 'var(--ghost)' : 'var(--dim)', outline: 'none' }}
                          onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                          onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                          required
                        >
                          <option value="" disabled>Vyber stav...</option>
                          {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
                          JAZYK
                        </label>
                        <select
                          value={card.card_language}
                          onChange={e => setCard(p => ({ ...p, card_language: e.target.value }))}
                          style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                          onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                          onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                        >
                          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* PSA graded toggle */}
                    <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--void)', border: '1px solid var(--surface-2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: card.is_graded ? '16px' : '0' }}>
                        <div>
                          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--ghost)', letterSpacing: '0.1em' }}>PSA GRADED KARTA</p>
                          <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '12px', color: 'var(--dim)', marginTop: '2px' }}>Má karta PSA certifikát?</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCard(p => ({ ...p, is_graded: !p.is_graded, psa_grade: '' }))}
                          style={{
                            width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'none',
                            background: card.is_graded ? 'var(--orange)' : 'var(--surface-2)',
                            position: 'relative', transition: 'background 0.2s',
                          }}
                        >
                          <div style={{
                            position: 'absolute', top: '3px',
                            left: card.is_graded ? '25px' : '3px',
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: 'var(--ghost)', transition: 'left 0.2s',
                          }} />
                        </button>
                      </div>

                      {card.is_graded && (
                        <div>
                          <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
                            PSA GRADE *
                          </label>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {PSA_GRADES.map(g => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setCard(p => ({ ...p, psa_grade: g }))}
                                style={{
                                  width: '44px', height: '44px', border: '1px solid',
                                  borderColor: card.psa_grade === g ? 'var(--gold)' : 'var(--surface-2)',
                                  background: card.psa_grade === g ? 'rgba(245,158,11,0.15)' : 'transparent',
                                  color: card.psa_grade === g ? 'var(--gold)' : 'var(--dim)',
                                  fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700,
                                  cursor: 'none', transition: 'all 0.15s',
                                }}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quantity + expected price */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                      <div>
                        <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
                          POČET KUSOV
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={card.quantity}
                          onChange={e => setCard(p => ({ ...p, quantity: e.target.value }))}
                          style={{ width: '100%', padding: '12px 16px', fontFamily: 'Space Mono, monospace', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                          onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                          onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                        />
                      </div>
                      <div>
                        <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
                          TVOJA CENA (€) <span style={{ color: 'var(--dim)', fontSize: '8px' }}>VOLITEĽNÉ</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="napr. 150"
                          value={card.expected_price}
                          onChange={e => setCard(p => ({ ...p, expected_price: e.target.value }))}
                          style={{ width: '100%', padding: '12px 16px', fontFamily: 'Space Mono, monospace', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                          onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                          onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div style={{ marginBottom: '32px' }}>
                      <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
                        POZNÁMKA <span style={{ fontSize: '8px' }}>VOLITEĽNÉ</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Napr. karta má malý ohyb na rohu, svetlé škrabance..."
                        value={card.notes}
                        onChange={e => setCard(p => ({ ...p, notes: e.target.value }))}
                        style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none', resize: 'vertical' }}
                        onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => cardValid && setStep('contact')}
                      disabled={!cardValid}
                      className="btn-primary"
                      style={{ width: '100%', padding: '16px', fontSize: '13px', letterSpacing: '0.15em', opacity: cardValid ? 1 : 0.4 }}
                    >
                      ĎALEJ — KONTAKTNÉ ÚDAJE →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', padding: '40px' }}>

                    {/* Card summary */}
                    <div style={{ padding: '16px 20px', background: 'var(--void)', border: '1px solid var(--surface-2)', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--ghost)', marginBottom: '2px' }}>{card.card_name}</p>
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>
                          {card.card_set.split('(')[0].trim()} · {card.card_condition.split(' ')[0]} · {card.card_language}
                          {card.is_graded && card.psa_grade ? ` · PSA ${card.psa_grade}` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep('card')}
                        style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--orange)', background: 'none', border: 'none', cursor: 'none', letterSpacing: '0.1em' }}
                      >
                        UPRAVIŤ
                      </button>
                    </div>

                    {error && (
                      <div style={{ padding: '12px 16px', marginBottom: '24px', fontFamily: 'Space Mono, monospace', fontSize: '11px', background: 'rgba(239,68,68,0.15)', border: '1px solid var(--red)', color: 'var(--red)' }}>
                        {error}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                      {[
                        { key: 'name', label: 'MENO A PRIEZVISKO *', type: 'text', placeholder: 'Ján Novák' },
                        { key: 'email', label: 'EMAIL *', type: 'email', placeholder: 'tvoj@email.sk' },
                        { key: 'phone', label: 'TELEFÓN', type: 'tel', placeholder: '+421 9XX XXX XXX', optional: true },
                      ].map(field => (
                        <div key={field.key}>
                          <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
                            {field.label} {field.optional && <span style={{ fontSize: '8px' }}>VOLITEĽNÉ</span>}
                          </label>
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={contact[field.key as keyof typeof contact]}
                            onChange={e => setContact(p => ({ ...p, [field.key]: e.target.value }))}
                            style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '15px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                            onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                            onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                            required={!field.optional}
                          />
                        </div>
                      ))}
                    </div>

                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', marginBottom: '24px', lineHeight: 1.6, letterSpacing: '0.05em' }}>
                      Odoslaním formulára súhlasíš so spracovaním osobných údajov za účelom výkupu kariet. Neposielame spam.
                    </p>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setStep('card')}
                        style={{ padding: '16px 24px', fontSize: '12px', fontFamily: 'Space Mono, monospace', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'transparent', cursor: 'none' }}
                      >
                        ← SPÄŤ
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !contactValid}
                        className="btn-primary"
                        style={{ flex: 1, padding: '16px', fontSize: '13px', letterSpacing: '0.15em', opacity: contactValid ? 1 : 0.4 }}
                      >
                        {loading ? 'ODOSIELANIE...' : 'ODOSLAŤ PONUKU →'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', padding: '64px 40px', textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: '32px', color: 'var(--green)' }}>✓</div>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: '16px' }}>PONUKA ODOSLANÁ!</h2>
              <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '16px', color: 'var(--dim)', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 8px' }}>
                Dostali sme tvoju ponuku. Do 24 hodín ti pošleme cenovú ponuku na <span style={{ color: 'var(--orange)' }}>{contact.email}</span>.
              </p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--dim)', marginBottom: '40px' }}>
                Karta: <span style={{ color: 'var(--ghost)' }}>{card.card_name}</span>
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link href="/">
                  <button style={{ padding: '14px 28px', fontSize: '12px', fontFamily: 'Space Mono, monospace', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'transparent', cursor: 'none' }}>
                    DOMOV
                  </button>
                </Link>
                <Link href="/vykup/formular">
                  <button
                    className="btn-primary"
                    style={{ padding: '14px 28px', fontSize: '12px', letterSpacing: '0.12em' }}
                    onClick={() => { setStep('card'); setCard({ card_name: '', card_set: '', card_condition: '', is_graded: false, psa_grade: '', quantity: '1', card_language: 'EN', expected_price: '', notes: '' }); setContact({ name: '', email: '', phone: '' }) }}
                  >
                    ĎALŠIA KARTA →
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
