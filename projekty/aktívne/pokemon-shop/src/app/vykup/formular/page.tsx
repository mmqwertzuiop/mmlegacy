'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

const CONDITIONS = ['NM (Near Mint)', 'LP (Lightly Played)', 'MP (Moderately Played)', 'HP (Heavily Played)', 'D (Damaged)']
const LANGUAGES = ['EN', 'SK', 'DE', 'FR', 'JP', 'IT', 'ES', 'PT', 'KO', 'ZH']
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
  'Iná sada',
]

type CardItem = {
  id: string
  card_name: string
  card_set: string
  custom_set: string
  card_condition: string
  is_graded: boolean
  psa_grade: string
  quantity: string
  card_language: string
  expected_price: string
  notes: string
}

const emptyCard = (): CardItem => ({
  id: Math.random().toString(36).slice(2),
  card_name: '', card_set: '', custom_set: '', card_condition: '',
  is_graded: false, psa_grade: '', quantity: '1',
  card_language: 'EN', expected_price: '', notes: '',
})

type Step = 'cards' | 'contact' | 'done'

export default function VykupFormularPage() {
  const [step, setStep] = useState<Step>('cards')
  const [cards, setCards] = useState<CardItem[]>([emptyCard()])
  const [editingId, setEditingId] = useState<string>(cards[0].id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })

  const updateCard = (id: string, patch: Partial<CardItem>) =>
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))

  const removeCard = (id: string) => {
    const next = cards.filter(c => c.id !== id)
    setCards(next.length > 0 ? next : [emptyCard()])
    if (editingId === id) setEditingId(next[0]?.id || '')
  }

  const addCard = () => {
    const nc = emptyCard()
    setCards(prev => [...prev, nc])
    setEditingId(nc.id)
  }

  const editing = cards.find(c => c.id === editingId) || cards[0]

  const isCardValid = (c: CardItem) =>
    c.card_name.trim() &&
    (c.card_set && c.card_set !== 'Iná sada' ? true : c.custom_set.trim()) &&
    c.card_set && c.card_condition && (c.is_graded ? c.psa_grade : true) &&
    parseInt(c.quantity) >= 1

  const allCardsValid = cards.every(isCardValid)
  const contactValid = contact.name.trim() && contact.email.trim()

  const totalExpected = cards.reduce((s, c) => s + (parseFloat(c.expected_price) || 0) * (parseInt(c.quantity) || 1), 0)

  const handleSubmit = async () => {
    if (!contactValid) return
    setLoading(true)
    setError('')

    const { data: sub, error: subErr } = await supabase
      .from('buyback_submissions')
      .insert({
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim() || null,
        total_items: cards.reduce((s, c) => s + (parseInt(c.quantity) || 1), 0),
        status: 'pending',
      })
      .select('id')
      .single()

    if (subErr || !sub) {
      setError('Nastala chyba. Skús to znovu.')
      setLoading(false)
      return
    }

    const items = cards.map(c => ({
      submission_id: sub.id,
      card_name: c.card_name.trim(),
      card_set: c.card_set === 'Iná sada' ? (c.custom_set.trim() || 'Iná sada') : c.card_set,
      card_condition: c.card_condition,
      is_graded: c.is_graded,
      psa_grade: c.is_graded && c.psa_grade ? parseInt(c.psa_grade) : null,
      quantity: parseInt(c.quantity) || 1,
      card_language: c.card_language,
      expected_price: c.expected_price ? parseFloat(c.expected_price) : null,
      notes: c.notes.trim() || null,
    }))

    const { error: itemsErr } = await supabase.from('buyback_items').insert(items)

    if (itemsErr) {
      setError('Nastala chyba pri ukladaní kariet. Skús to znovu.')
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

      {step === 'done' ? (
        <div style={{ maxWidth: '640px', margin: '80px auto', padding: '0 48px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', padding: '64px 40px', textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: '32px', color: 'var(--green)' }}>✓</div>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: '16px' }}>PONUKA ODOSLANÁ!</h2>
              <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '16px', color: 'var(--dim)', lineHeight: 1.7, marginBottom: '8px' }}>
                Do 24 hodín ti pošleme cenovú ponuku na <span style={{ color: 'var(--orange)' }}>{contact.email}</span>.
              </p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--dim)', marginBottom: '40px' }}>
                Počet kariet: <span style={{ color: 'var(--ghost)' }}>{cards.length}</span>
                {totalExpected > 0 && <> · Tvoja cena: <span style={{ color: 'var(--green)' }}>{totalExpected.toFixed(2)}€</span></>}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link href="/"><button style={{ padding: '14px 28px', fontSize: '11px', fontFamily: 'Space Mono, monospace', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'transparent', cursor: 'none' }}>DOMOV</button></Link>
                <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '11px', letterSpacing: '0.12em' }}
                  onClick={() => { setStep('cards'); setCards([emptyCard()]); setContact({ name: '', email: '', phone: '' }) }}>
                  NOVÁ PONUKA →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>

          {/* LEFT: main form */}
          <div>
            {/* Step header */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.4em', color: 'var(--orange)', marginBottom: '10px' }}>
                {step === 'cards' ? 'KROK 1 / 2 — KARTY' : 'KROK 2 / 2 — KONTAKT'}
              </p>
              <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>
                {step === 'cards' ? 'PRIDAJ KARTY NA VÝKUP' : 'KONTAKTNÉ ÚDAJE'}
              </h1>
            </div>

            <AnimatePresence mode="wait">
              {step === 'cards' && (
                <motion.div key="cards-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

                  {/* Card tabs */}
                  {cards.length > 1 && (
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      {cards.map((c, i) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setEditingId(c.id)}
                          style={{
                            padding: '6px 14px',
                            fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.1em',
                            background: editingId === c.id ? 'var(--orange)' : 'var(--surface)',
                            border: `1px solid ${editingId === c.id ? 'var(--orange)' : 'var(--surface-2)'}`,
                            color: editingId === c.id ? '#000' : isCardValid(c) ? 'var(--green)' : 'var(--dim)',
                            cursor: 'none',
                            display: 'flex', alignItems: 'center', gap: '6px',
                          }}
                        >
                          {isCardValid(c) && editingId !== c.id && <span style={{ fontSize: '8px' }}>✓</span>}
                          KARTA {i + 1}
                          {cards.length > 1 && (
                            <span
                              onClick={e => { e.stopPropagation(); removeCard(c.id) }}
                              style={{ marginLeft: '2px', opacity: 0.6, fontSize: '12px', lineHeight: 1 }}
                            >✕</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Card form */}
                  {editing && (
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', padding: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>
                          KARTA {cards.findIndex(c => c.id === editing.id) + 1}
                          {isCardValid(editing) && <span style={{ marginLeft: '10px', fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--green)' }}>✓ VYPLNENÁ</span>}
                        </p>
                        {cards.length > 1 && (
                          <button type="button" onClick={() => removeCard(editing.id)}
                            style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--red)', background: 'none', border: 'none', cursor: 'none', letterSpacing: '0.1em' }}>
                            ODSTRÁNIŤ
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Name */}
                        <div>
                          <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>NÁZOV KARTY *</label>
                          <input type="text" placeholder="napr. Umbreon VMAX Alt Art"
                            value={editing.card_name}
                            onChange={e => updateCard(editing.id, { card_name: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '15px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                            onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                            onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')} />
                        </div>

                        {/* Set */}
                        <div>
                          <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>SADA / SET *</label>
                          <select value={editing.card_set}
                            onChange={e => updateCard(editing.id, { card_set: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: editing.card_set ? 'var(--ghost)' : 'var(--dim)', outline: 'none' }}
                            onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                            onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}>
                            <option value="" disabled>Vyber sadu...</option>
                            {POPULAR_SETS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        {/* Custom set input when "Iná sada" is selected */}
                        {editing.card_set === 'Iná sada' && (
                          <div>
                            <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--orange)', display: 'block', marginBottom: '8px' }}>ZADAJ NÁZOV SADY *</label>
                            <input type="text" placeholder="napr. Base Set 1999, Jungle, Fossil..."
                              value={editing.custom_set}
                              onChange={e => updateCard(editing.id, { custom_set: e.target.value })}
                              style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '15px', background: 'var(--surface-2)', border: '1px solid var(--orange)', color: 'var(--ghost)', outline: 'none' }}
                              onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                              onBlur={e => (e.target.style.borderColor = editing.custom_set ? 'var(--orange)' : 'var(--surface-2)')} />
                          </div>
                        )}

                        {/* Condition + Language */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>STAV KARTY *</label>
                            <select value={editing.card_condition}
                              onChange={e => updateCard(editing.id, { card_condition: e.target.value })}
                              style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: editing.card_condition ? 'var(--ghost)' : 'var(--dim)', outline: 'none' }}
                              onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                              onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}>
                              <option value="" disabled>Vyber stav...</option>
                              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>JAZYK</label>
                            <select value={editing.card_language}
                              onChange={e => updateCard(editing.id, { card_language: e.target.value })}
                              style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                              onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                              onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}>
                              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* PSA toggle */}
                        <div style={{ padding: '18px 20px', background: 'var(--void)', border: '1px solid var(--surface-2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editing.is_graded ? '16px' : '0' }}>
                            <div>
                              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--ghost)', letterSpacing: '0.1em' }}>PSA GRADED KARTA</p>
                              <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '12px', color: 'var(--dim)', marginTop: '2px' }}>Má karta PSA certifikát?</p>
                            </div>
                            <button type="button"
                              onClick={() => updateCard(editing.id, { is_graded: !editing.is_graded, psa_grade: '' })}
                              style={{ width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'none', background: editing.is_graded ? 'var(--orange)' : 'var(--surface-2)', position: 'relative', transition: 'background 0.2s' }}>
                              <div style={{ position: 'absolute', top: '3px', left: editing.is_graded ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--ghost)', transition: 'left 0.2s' }} />
                            </button>
                          </div>
                          {editing.is_graded && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {PSA_GRADES.map(g => (
                                <button key={g} type="button"
                                  onClick={() => updateCard(editing.id, { psa_grade: g })}
                                  style={{ width: '44px', height: '44px', border: '1px solid', borderColor: editing.psa_grade === g ? 'var(--gold)' : 'var(--surface-2)', background: editing.psa_grade === g ? 'rgba(245,158,11,0.15)' : 'transparent', color: editing.psa_grade === g ? 'var(--gold)' : 'var(--dim)', fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, cursor: 'none', transition: 'all 0.15s' }}>
                                  {g}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Qty + price */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>POČET KUSOV</label>
                            <input type="number" min="1" max="9999" value={editing.quantity}
                              onChange={e => {
                                const val = parseInt(e.target.value)
                                updateCard(editing.id, { quantity: (isNaN(val) || val < 1) ? '1' : e.target.value })
                              }}
                              style={{ width: '100%', padding: '12px 16px', fontFamily: 'Space Mono, monospace', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                              onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                              onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')} />
                          </div>
                          <div>
                            <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>TVOJA CENA (€) <span style={{ fontSize: '8px' }}>VOLITEĽNÉ</span></label>
                            <input type="number" min="0" step="0.01" placeholder="napr. 150"
                              value={editing.expected_price}
                              onChange={e => updateCard(editing.id, { expected_price: e.target.value })}
                              style={{ width: '100%', padding: '12px 16px', fontFamily: 'Space Mono, monospace', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                              onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                              onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')} />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>POZNÁMKA <span style={{ fontSize: '8px' }}>VOLITEĽNÉ</span></label>
                          <textarea rows={2} placeholder="Napr. malý ohyb na rohu, EN first edition..."
                            value={editing.notes}
                            onChange={e => updateCard(editing.id, { notes: e.target.value })}
                            style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none', resize: 'vertical' }}
                            onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                            onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add card button */}
                  <button type="button" onClick={addCard}
                    style={{ width: '100%', marginTop: '12px', padding: '14px', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase', border: '1px dashed var(--surface-2)', color: 'var(--dim)', background: 'transparent', cursor: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--orange)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--surface-2)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--dim)' }}>
                    + PRIDAŤ ĎALŠIU KARTU
                  </button>

                  {/* Continue */}
                  <button type="button"
                    onClick={() => allCardsValid && setStep('contact')}
                    disabled={!allCardsValid}
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '12px', padding: '16px', fontSize: '13px', letterSpacing: '0.15em', opacity: allCardsValid ? 1 : 0.4 }}>
                    POKRAČOVAŤ — KONTAKTNÉ ÚDAJE ({cards.length} {cards.length === 1 ? 'KARTA' : cards.length < 5 ? 'KARTY' : 'KARIET'}) →
                  </button>
                </motion.div>
              )}

              {step === 'contact' && (
                <motion.div key="contact-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', padding: '32px' }}>
                    {error && (
                      <div style={{ padding: '12px 16px', marginBottom: '20px', fontFamily: 'Space Mono, monospace', fontSize: '11px', background: 'rgba(239,68,68,0.15)', border: '1px solid var(--red)', color: 'var(--red)' }}>
                        {error}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                      {[
                        { key: 'name', label: 'MENO A PRIEZVISKO *', type: 'text', placeholder: 'Ján Novák', optional: false },
                        { key: 'email', label: 'EMAIL *', type: 'email', placeholder: 'tvoj@email.sk', optional: false },
                        { key: 'phone', label: 'TELEFÓN', type: 'tel', placeholder: '+421 9XX XXX XXX', optional: true },
                      ].map(field => (
                        <div key={field.key}>
                          <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
                            {field.label} {field.optional && <span style={{ fontSize: '8px' }}>VOLITEĽNÉ</span>}
                          </label>
                          <input type={field.type} placeholder={field.placeholder}
                            value={contact[field.key as keyof typeof contact]}
                            onChange={e => setContact(p => ({ ...p, [field.key]: e.target.value }))}
                            style={{ width: '100%', padding: '12px 16px', fontFamily: 'Inter Tight, sans-serif', fontSize: '15px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                            onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                            onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                            required={!field.optional} />
                        </div>
                      ))}
                    </div>

                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', marginBottom: '24px', lineHeight: 1.6, letterSpacing: '0.05em' }}>
                      Odoslaním súhlasíš so spracovaním osobných údajov za účelom výkupu kariet.
                    </p>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" onClick={() => setStep('cards')}
                        style={{ padding: '16px 24px', fontSize: '11px', fontFamily: 'Space Mono, monospace', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'transparent', cursor: 'none' }}>
                        ← SPÄŤ
                      </button>
                      <button type="button" onClick={handleSubmit}
                        disabled={loading || !contactValid}
                        className="btn-primary"
                        style={{ flex: 1, padding: '16px', fontSize: '13px', letterSpacing: '0.15em', opacity: contactValid ? 1 : 0.4 }}>
                        {loading ? 'ODOSIELANIE...' : `ODOSLAŤ PONUKU (${cards.length} ${cards.length === 1 ? 'KARTA' : cards.length < 5 ? 'KARTY' : 'KARIET'}) →`}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: summary sidebar */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', padding: '24px' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', marginBottom: '16px' }}>
                ZOZNAM KARIET ({cards.length})
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {cards.map((c, i) => (
                  <div key={c.id}
                    onClick={() => { if (step === 'cards') setEditingId(c.id) }}
                    style={{
                      padding: '10px 14px',
                      background: editingId === c.id && step === 'cards' ? 'rgba(250,93,41,0.08)' : 'var(--void)',
                      border: `1px solid ${editingId === c.id && step === 'cards' ? 'var(--orange)' : 'var(--surface-2)'}`,
                      cursor: step === 'cards' ? 'none' : 'default',
                      transition: 'all 0.15s',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.1em', marginBottom: '3px' }}>KARTA {i + 1}</p>
                        <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', color: c.card_name ? 'var(--ghost)' : 'var(--dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.card_name || '(nevyplnené)'}
                        </p>
                        {c.card_condition && (
                          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', marginTop: '2px' }}>
                            {c.card_condition.split(' ')[0]} · {c.card_language}
                            {c.is_graded && c.psa_grade ? ` · PSA ${c.psa_grade}` : ''}
                            {parseInt(c.quantity) > 1 ? ` · ${c.quantity}ks` : ''}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                        {isCardValid(c) ? (
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--green)' }}>✓</span>
                        ) : (
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--orange)' }}>…</span>
                        )}
                        {c.expected_price && (
                          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--green)', fontWeight: 700, marginTop: '4px' }}>{c.expected_price}€</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalExpected > 0 && (
                <div style={{ padding: '12px 14px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '16px' }}>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em', marginBottom: '4px' }}>CELKOVÁ TVOJA CENA</p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '20px', fontWeight: 700, color: 'var(--green)' }}>{totalExpected.toFixed(2)}€</p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', marginTop: '2px' }}>Finálna ponuka príde emailom</p>
                </div>
              )}

              <div style={{ padding: '12px 0', borderTop: '1px solid var(--surface-2)' }}>
                {[
                  { icon: '⚡', text: 'Odpoveď do 24 hodín' },
                  { icon: '📦', text: 'Doprava na naše náklady' },
                  { icon: '💰', text: '75–85% trhovej hodnoty' },
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
                    <span style={{ fontSize: '14px' }}>{b.icon}</span>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.08em' }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
