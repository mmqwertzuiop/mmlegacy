'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:      { label: 'NOVÁ',          color: 'var(--orange)' },
  reviewing:    { label: 'POSUDZUJEME',   color: 'var(--blue)' },
  offer_sent:   { label: 'PONUKA POSLANÁ',color: 'var(--gold)' },
  accepted:     { label: 'PRIJATÁ',       color: 'var(--green)' },
  rejected:     { label: 'ZAMIETNUTÁ',    color: 'var(--red)' },
  completed:    { label: 'DOKONČENÁ',     color: 'var(--dim)' },
}

type Request = {
  id: string
  created_at: string
  status: string
  card_name: string
  card_set: string
  card_condition: string
  is_graded: boolean
  psa_grade: number | null
  quantity: number
  card_language: string
  expected_price: number | null
  notes: string | null
  name: string
  email: string
  phone: string | null
  offered_price: number | null
  admin_notes: string | null
}

export default function AdminVykupPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Request | null>(null)
  const [filter, setFilter] = useState('all')
  const [saving, setSaving] = useState(false)
  const [editStatus, setEditStatus] = useState('')
  const [editOfferedPrice, setEditOfferedPrice] = useState('')
  const [editAdminNotes, setEditAdminNotes] = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('buyback_requests')
      .select('*')
      .order('created_at', { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openDetail = (r: Request) => {
    setSelected(r)
    setEditStatus(r.status)
    setEditOfferedPrice(r.offered_price?.toString() || '')
    setEditAdminNotes(r.admin_notes || '')
  }

  const saveChanges = async () => {
    if (!selected) return
    setSaving(true)
    await supabase.from('buyback_requests').update({
      status: editStatus,
      offered_price: editOfferedPrice ? parseFloat(editOfferedPrice) : null,
      admin_notes: editAdminNotes || null,
      updated_at: new Date().toISOString(),
    }).eq('id', selected.id)
    await load()
    setSelected(null)
    setSaving(false)
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  const counts = Object.fromEntries(
    Object.keys(STATUS_LABELS).map(s => [s, requests.filter(r => r.status === s).length])
  )

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh', padding: '48px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '8px' }}>ADMIN PANEL</p>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>VÝKUP KARIET</h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div
            onClick={() => setFilter('all')}
            style={{ padding: '12px 20px', background: filter === 'all' ? 'var(--surface-2)' : 'var(--surface)', border: '1px solid var(--surface-2)', cursor: 'none' }}
          >
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '20px', fontWeight: 700, color: 'var(--ghost)' }}>{requests.length}</p>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em' }}>VŠETKY</p>
          </div>
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <div
              key={key}
              onClick={() => setFilter(key)}
              style={{ padding: '12px 20px', background: filter === key ? 'var(--surface-2)' : 'var(--surface)', border: `1px solid ${filter === key ? val.color : 'var(--surface-2)'}`, cursor: 'none' }}
            >
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '20px', fontWeight: 700, color: val.color }}>{counts[key] || 0}</p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.1em' }}>{val.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--dim)' }}>NAČÍTAVAM...</p>
        ) : filtered.length === 0 ? (
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--dim)' }}>Žiadne záznamy.</p>
        ) : (
          <div style={{ border: '1px solid var(--surface-2)', overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 140px 100px 100px 100px 100px', background: 'var(--surface-2)', padding: '10px 16px', gap: '8px' }}>
              {['DÁTUM', 'KARTA', 'ZÁKAZNÍK', 'STAV', 'ČAKÁ', 'PONUKA', ''].map((h, i) => (
                <span key={i} style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)' }}>{h}</span>
              ))}
            </div>

            {filtered.map((r, i) => (
              <div
                key={r.id}
                onClick={() => openDetail(r)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr 140px 100px 100px 100px 100px',
                  padding: '14px 16px',
                  gap: '8px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--surface-2)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  cursor: 'none',
                  alignItems: 'center',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(250,93,41,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)')}
              >
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>
                  {new Date(r.created_at).toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  <br />
                  {new Date(r.created_at).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div>
                  <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', color: 'var(--ghost)', marginBottom: '2px' }}>
                    {r.card_name}
                    {r.is_graded && r.psa_grade && <span style={{ marginLeft: '6px', fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--gold)' }}>PSA {r.psa_grade}</span>}
                  </p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)' }}>
                    {r.card_set.split('(')[0].trim()} · {r.card_condition.split(' ')[0]} · {r.card_language} · {r.quantity}ks
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', color: 'var(--ghost)', marginBottom: '2px' }}>{r.name}</p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email}</p>
                </div>
                <span style={{
                  fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em',
                  color: STATUS_LABELS[r.status]?.color || 'var(--dim)',
                  padding: '4px 8px', border: `1px solid ${STATUS_LABELS[r.status]?.color || 'var(--dim)'}`,
                  display: 'inline-block',
                }}>
                  {STATUS_LABELS[r.status]?.label || r.status}
                </span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: r.expected_price ? 'var(--ghost)' : 'var(--dim)' }}>
                  {r.expected_price ? `${r.expected_price}€` : '—'}
                </span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: r.offered_price ? 'var(--green)' : 'var(--dim)', fontWeight: r.offered_price ? 700 : 400 }}>
                  {r.offered_price ? `${r.offered_price}€` : '—'}
                </span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--orange)', letterSpacing: '0.1em' }}>DETAIL →</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}
        >
          <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: '4px' }}>{selected.card_name}</h2>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>#{selected.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--dim)', fontSize: '24px', cursor: 'none', lineHeight: 1 }}>✕</button>
            </div>

            {/* Card info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px', padding: '20px', background: 'var(--void)', border: '1px solid var(--surface-2)' }}>
              {[
                ['Sada', selected.card_set.split('(')[0].trim()],
                ['Stav', selected.card_condition],
                ['Jazyk', selected.card_language],
                ['Počet', `${selected.quantity}ks`],
                ...(selected.is_graded ? [['PSA Grade', `PSA ${selected.psa_grade}`]] : []),
                ...(selected.expected_price ? [['Cena zákazníka', `${selected.expected_price}€`]] : []),
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em', marginBottom: '2px' }}>{k}</p>
                  <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', color: 'var(--ghost)' }}>{v}</p>
                </div>
              ))}
            </div>

            {selected.notes && (
              <div style={{ padding: '14px 16px', background: 'var(--void)', border: '1px solid var(--surface-2)', marginBottom: '20px' }}>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em', marginBottom: '6px' }}>POZNÁMKA</p>
                <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', color: 'var(--ghost)' }}>{selected.notes}</p>
              </div>
            )}

            {/* Contact */}
            <div style={{ marginBottom: '28px', padding: '20px', background: 'var(--void)', border: '1px solid var(--surface-2)' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em', marginBottom: '12px' }}>ZÁKAZNÍK</p>
              <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '15px', color: 'var(--ghost)', marginBottom: '4px' }}>{selected.name}</p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--orange)' }}>{selected.email}</p>
              {selected.phone && <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--dim)', marginTop: '2px' }}>{selected.phone}</p>}
            </div>

            {/* Admin controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>STAV</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontFamily: 'Space Mono, monospace', fontSize: '12px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                >
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>NAŠA PONUKA (€)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={editOfferedPrice}
                  onChange={e => setEditOfferedPrice(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontFamily: 'Space Mono, monospace', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                />
              </div>

              <div>
                <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>ADMIN POZNÁMKA</label>
                <textarea
                  rows={3}
                  placeholder="Interná poznámka (zákazník nevidí)..."
                  value={editAdminNotes}
                  onChange={e => setEditAdminNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none', resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{ flex: 1, padding: '14px', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'transparent', cursor: 'none' }}
                >
                  ZRUŠIŤ
                </button>
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="btn-primary"
                  style={{ flex: 2, padding: '14px', fontSize: '12px', letterSpacing: '0.15em', opacity: saving ? 0.7 : 1 }}
                >
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
