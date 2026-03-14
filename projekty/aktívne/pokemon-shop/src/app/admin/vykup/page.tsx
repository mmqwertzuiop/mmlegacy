'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:      { label: 'NOVÁ',           color: 'var(--orange)' },
  reviewing:    { label: 'POSUDZUJEME',    color: 'var(--blue)' },
  offer_sent:   { label: 'PONUKA POSLANÁ', color: 'var(--gold)' },
  accepted:     { label: 'PRIJATÁ',        color: 'var(--green)' },
  rejected:     { label: 'ZAMIETNUTÁ',     color: 'var(--red)' },
  completed:    { label: 'DOKONČENÁ',      color: 'var(--dim)' },
}

type Item = {
  id: string
  card_name: string
  card_set: string
  card_condition: string
  is_graded: boolean
  psa_grade: number | null
  quantity: number
  card_language: string
  expected_price: number | null
  offered_price: number | null
  notes: string | null
}

type Submission = {
  id: string
  created_at: string
  updated_at: string
  status: string
  name: string
  email: string
  phone: string | null
  total_items: number
  offered_total: number | null
  admin_notes: string | null
  buyback_items: Item[]
}

export default function AdminVykupPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Submission | null>(null)
  const [filter, setFilter] = useState('all')
  const [saving, setSaving] = useState(false)
  const [editStatus, setEditStatus] = useState('')
  const [editOfferedTotal, setEditOfferedTotal] = useState('')
  const [editAdminNotes, setEditAdminNotes] = useState('')
  const [itemPrices, setItemPrices] = useState<Record<string, string>>({})

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('buyback_submissions')
      .select('*, buyback_items(*)')
      .order('created_at', { ascending: false })
    setSubmissions((data as Submission[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openDetail = (s: Submission) => {
    setSelected(s)
    setEditStatus(s.status)
    setEditOfferedTotal(s.offered_total?.toString() || '')
    setEditAdminNotes(s.admin_notes || '')
    const prices: Record<string, string> = {}
    s.buyback_items?.forEach(item => { prices[item.id] = item.offered_price?.toString() || '' })
    setItemPrices(prices)
  }

  const saveChanges = async () => {
    if (!selected) return
    setSaving(true)

    await supabase.from('buyback_submissions').update({
      status: editStatus,
      offered_total: editOfferedTotal ? parseFloat(editOfferedTotal) : null,
      admin_notes: editAdminNotes || null,
      updated_at: new Date().toISOString(),
    }).eq('id', selected.id)

    // Save individual item prices
    for (const [itemId, price] of Object.entries(itemPrices)) {
      await supabase.from('buyback_items').update({
        offered_price: price ? parseFloat(price) : null,
      }).eq('id', itemId)
    }

    await load()
    setSelected(null)
    setSaving(false)
  }

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter)
  const counts = Object.fromEntries(
    Object.keys(STATUS_LABELS).map(s => [s, submissions.filter(r => r.status === s).length])
  )

  // Auto-sum item prices into total when items change
  const autoSum = () => {
    const total = Object.values(itemPrices).reduce((s, p) => s + (parseFloat(p) || 0), 0)
    if (total > 0) setEditOfferedTotal(total.toFixed(2))
  }

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', padding: '48px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '8px' }}>ADMIN PANEL</p>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>VÝKUP KARIET</h1>
          </div>
          <button onClick={load} style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', background: 'none', border: '1px solid var(--surface-2)', padding: '10px 16px', cursor: 'none', letterSpacing: '0.1em' }}>
            ↻ OBNOVIŤ
          </button>
        </div>

        {/* Status filter tiles */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div onClick={() => setFilter('all')} style={{ padding: '12px 20px', background: filter === 'all' ? 'var(--surface-2)' : 'var(--surface)', border: '1px solid var(--surface-2)', cursor: 'none' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '22px', fontWeight: 700, color: 'var(--ghost)' }}>{submissions.length}</p>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em' }}>VŠETKY</p>
          </div>
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <div key={key} onClick={() => setFilter(key)}
              style={{ padding: '12px 20px', background: filter === key ? 'var(--surface-2)' : 'var(--surface)', border: `1px solid ${filter === key ? val.color : 'var(--surface-2)'}`, cursor: 'none' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '22px', fontWeight: 700, color: val.color }}>{counts[key] || 0}</p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.1em' }}>{val.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--dim)' }}>NAČÍTAVAM...</p>
        ) : filtered.length === 0 ? (
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--dim)' }}>Žiadne záznamy.</p>
        ) : (
          <div style={{ border: '1px solid var(--surface-2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 160px 80px 90px 100px 90px', background: 'var(--surface-2)', padding: '10px 16px', gap: '8px' }}>
              {['DÁTUM', 'ZÁKAZNÍK + KARTY', 'EMAIL', 'KS', 'STAV', 'OČAKÁVA', 'PONUKA'].map((h, i) => (
                <span key={i} style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)' }}>{h}</span>
              ))}
            </div>
            {filtered.map((s, i) => (
              <div key={s.id} onClick={() => openDetail(s)}
                style={{
                  display: 'grid', gridTemplateColumns: '160px 1fr 160px 80px 90px 100px 90px',
                  padding: '14px 16px', gap: '8px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--surface-2)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  cursor: 'none', alignItems: 'center',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(250,93,41,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)')}>

                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', lineHeight: 1.5 }}>
                  {new Date(s.created_at).toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  <br />
                  {new Date(s.created_at).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                </span>

                <div>
                  <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', color: 'var(--ghost)', marginBottom: '3px', fontWeight: 600 }}>{s.name}</p>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(s.buyback_items || []).slice(0, 3).map((item, j) => (
                      <span key={j} style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', background: 'var(--surface-2)', padding: '2px 6px' }}>
                        {item.card_name.split(' ').slice(0, 3).join(' ')}{item.is_graded && item.psa_grade ? ` PSA${item.psa_grade}` : ''}
                      </span>
                    ))}
                    {(s.buyback_items || []).length > 3 && (
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--orange)', padding: '2px 6px' }}>+{(s.buyback_items || []).length - 3}</span>
                    )}
                  </div>
                </div>

                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email}</span>

                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', fontWeight: 700, color: 'var(--ghost)' }}>{s.total_items}</span>

                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', color: STATUS_LABELS[s.status]?.color || 'var(--dim)', padding: '4px 8px', border: `1px solid ${STATUS_LABELS[s.status]?.color || 'var(--dim)'}`, display: 'inline-block' }}>
                  {STATUS_LABELS[s.status]?.label || s.status}
                </span>

                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--dim)' }}>
                  {(s.buyback_items || []).filter(i => i.expected_price).reduce((sum, i) => sum + (i.expected_price || 0), 0) > 0
                    ? `${(s.buyback_items || []).filter(i => i.expected_price).reduce((sum, i) => sum + (i.expected_price || 0), 0).toFixed(0)}€`
                    : '—'}
                </span>

                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 700, color: s.offered_total ? 'var(--green)' : 'var(--dim)' }}>
                  {s.offered_total ? `${s.offered_total}€` : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', width: '100%', maxWidth: '700px', padding: '40px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: '4px' }}>{selected.name}</h2>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>
                  #{selected.id.slice(0, 8).toUpperCase()} · {new Date(selected.created_at).toLocaleDateString('sk-SK')}
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--dim)', fontSize: '24px', cursor: 'none', lineHeight: 1 }}>✕</button>
            </div>

            {/* Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '16px 20px', background: 'var(--void)', border: '1px solid var(--surface-2)', marginBottom: '24px' }}>
              <div>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em', marginBottom: '2px' }}>EMAIL</p>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--orange)' }}>{selected.email}</p>
              </div>
              {selected.phone && (
                <div>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em', marginBottom: '2px' }}>TELEFÓN</p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--ghost)' }}>{selected.phone}</p>
                </div>
              )}
            </div>

            {/* Cards list */}
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', marginBottom: '10px' }}>
              KARTY ({(selected.buyback_items || []).length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '28px' }}>
              {(selected.buyback_items || []).map((item, i) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px', gap: '8px', padding: '12px 16px', background: 'var(--void)', border: '1px solid var(--surface-2)', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', color: 'var(--ghost)', marginBottom: '2px' }}>
                      {item.card_name}
                      {item.is_graded && item.psa_grade && <span style={{ marginLeft: '8px', fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--gold)' }}>PSA {item.psa_grade}</span>}
                    </p>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)' }}>
                      {item.card_set.split('(')[0].trim()} · {item.card_condition.split(' ')[0]} · {item.card_language} · {item.quantity}ks
                      {item.expected_price ? ` · Čaká: ${item.expected_price}€` : ''}
                    </p>
                    {item.notes && <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '12px', color: 'var(--dim)', marginTop: '4px', fontStyle: 'italic' }}>{item.notes}</p>}
                  </div>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: item.expected_price ? 'var(--dim)' : 'var(--surface-2)', textAlign: 'right' }}>
                    {item.expected_price ? `${item.expected_price}€` : '—'}
                  </span>
                  <div>
                    <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', display: 'block', marginBottom: '4px', letterSpacing: '0.1em' }}>NAŠA PONUKA</label>
                    <input type="number" step="0.01" placeholder="€"
                      value={itemPrices[item.id] || ''}
                      onChange={e => setItemPrices(p => ({ ...p, [item.id]: e.target.value }))}
                      onBlur={autoSum}
                      style={{ width: '100%', padding: '6px 10px', fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--green)', outline: 'none' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--orange)')} />
                  </div>
                </div>
              ))}
            </div>

            {/* Admin controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>STAV ŽIADOSTI</label>
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', fontFamily: 'Space Mono, monospace', fontSize: '12px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>CELKOVÁ PONUKA (€)</label>
                  <input type="number" step="0.01" placeholder="Automaticky zo súčtu"
                    value={editOfferedTotal}
                    onChange={e => setEditOfferedTotal(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', fontFamily: 'Space Mono, monospace', fontSize: '14px', fontWeight: 700, background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--green)', outline: 'none' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')} />
                </div>
              </div>

              <div>
                <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>ADMIN POZNÁMKA (zákazník nevidí)</label>
                <textarea rows={3} placeholder="Interná poznámka..."
                  value={editAdminNotes}
                  onChange={e => setEditAdminNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none', resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setSelected(null)}
                  style={{ flex: 1, padding: '14px', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'transparent', cursor: 'none' }}>
                  ZRUŠIŤ
                </button>
                <button onClick={saveChanges} disabled={saving} className="btn-primary"
                  style={{ flex: 2, padding: '14px', fontSize: '12px', letterSpacing: '0.15em', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'UKLADÁM...' : 'ULOŽIŤ ZMENY'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
