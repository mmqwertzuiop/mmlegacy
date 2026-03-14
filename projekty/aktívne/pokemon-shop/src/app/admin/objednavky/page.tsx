'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: 'ČAKÁ',       color: 'var(--orange)' },
  paid:       { label: 'ZAPLATENÁ',  color: 'var(--green)' },
  processing: { label: 'SPRACÚVA SA', color: 'var(--blue)' },
  shipped:    { label: 'ODOSLANÁ',   color: 'var(--gold)' },
  delivered:  { label: 'DORUČENÁ',   color: 'var(--dim)' },
  cancelled:  { label: 'ZRUŠENÁ',    color: 'var(--red)' },
  refunded:   { label: 'VRÁTENÁ',    color: 'var(--purple)' },
}

type Order = {
  id: string
  created_at: string
  status: string
  total: number
  items: { name: string; quantity: number; price: number }[]
  profiles?: { username: string | null } | null
}

export default function AdminObjednavkyPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Order | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
    setOrders((data as Order[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const counts = Object.fromEntries(Object.keys(STATUS_LABELS).map(s => [s, orders.filter(o => o.status === s).length]))
  const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'delivered').reduce((s, o) => s + o.total, 0)

  const saveStatus = async () => {
    if (!selected) return
    setSaving(true)
    await supabase.from('orders').update({ status: editStatus }).eq('id', selected.id)
    await load()
    setSelected(null)
    setSaving(false)
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '8px' }}>SPRÁVA</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>OBJEDNÁVKY</h1>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em', marginBottom: '4px' }}>CELKOVÉ TRŽBY</p>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: 'var(--green)' }}>{(totalRevenue / 100).toFixed(2)}€</p>
          </div>
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div onClick={() => setFilter('all')} style={{ padding: '10px 18px', background: filter === 'all' ? 'var(--surface-2)' : 'var(--surface)', border: '1px solid var(--surface-2)', cursor: 'none' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '20px', fontWeight: 700, color: 'var(--ghost)' }}>{orders.length}</p>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.1em' }}>VŠETKY</p>
        </div>
        {Object.entries(STATUS_LABELS).map(([key, val]) => (
          <div key={key} onClick={() => setFilter(key)}
            style={{ padding: '10px 18px', background: filter === key ? 'var(--surface-2)' : 'var(--surface)', border: `1px solid ${filter === key ? val.color : 'var(--surface-2)'}`, cursor: 'none' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '20px', fontWeight: 700, color: val.color }}>{counts[key] || 0}</p>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.08em' }}>{val.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--dim)', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>NAČÍTAVAM...</p>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', border: '1px solid var(--surface-2)', background: 'var(--surface)' }}>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: 'var(--dim)', letterSpacing: '0.04em', marginBottom: '8px' }}>ŽIADNE OBJEDNÁVKY</p>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>
            {orders.length === 0 ? 'Zatiaľ nebola vytvorená žiadna objednávka.' : 'Žiadne objednávky v tomto filtri.'}
          </p>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--surface-2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr 100px 110px 100px', background: 'var(--surface-2)', padding: '10px 16px', gap: '8px' }}>
            {['DÁTUM', 'ZÁKAZNÍK', 'PRODUKTY', 'SUMA', 'STAV', 'AKCIA'].map((h, i) => (
              <span key={i} style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)' }}>{h}</span>
            ))}
          </div>
          {filtered.map((order, i) => (
            <div key={order.id}
              style={{
                display: 'grid', gridTemplateColumns: '140px 1fr 1fr 100px 110px 100px',
                padding: '14px 16px', gap: '8px', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--surface-2)' : 'none',
                background: 'transparent', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.01)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', lineHeight: 1.5 }}>
                {new Date(order.created_at).toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                <br />
                {new Date(order.created_at).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
              </span>

              <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', color: 'var(--ghost)', fontWeight: 600 }}>
                {order.profiles?.username || '—'}
                <br />
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', fontWeight: 400 }}>
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
              </span>

              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {(order.items || []).slice(0, 2).map((item, j) => (
                  <span key={j} style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', background: 'var(--surface-2)', padding: '2px 6px' }}>
                    {item.name?.split(' ').slice(0, 2).join(' ')} ×{item.quantity}
                  </span>
                ))}
                {(order.items || []).length > 2 && (
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--orange)', padding: '2px 4px' }}>+{order.items.length - 2}</span>
                )}
              </div>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>
                {(order.total / 100).toFixed(2)}€
              </span>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.08em', color: STATUS_LABELS[order.status]?.color || 'var(--dim)', padding: '3px 8px', border: `1px solid ${STATUS_LABELS[order.status]?.color || 'var(--dim)'}` }}>
                {STATUS_LABELS[order.status]?.label || order.status}
              </span>

              <button onClick={() => { setSelected(order); setEditStatus(order.status) }}
                style={{ padding: '6px 12px', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'none', cursor: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.color = 'var(--orange)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--surface-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--dim)' }}>
                DETAIL →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', width: '100%', maxWidth: '600px', padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>OBJEDNÁVKA</h2>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>#{selected.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--dim)', fontSize: '24px', cursor: 'none' }}>✕</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em', marginBottom: '8px' }}>PRODUKTY</p>
              {(selected.items || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface-2)' }}>
                  <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', color: 'var(--ghost)' }}>{item.name} <span style={{ color: 'var(--dim)' }}>×{item.quantity}</span></span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--ghost)' }}>{((item.price * item.quantity) / 100).toFixed(2)}€</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--dim)', letterSpacing: '0.1em' }}>CELKOM</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '16px', fontWeight: 700, color: 'var(--green)' }}>{(selected.total / 100).toFixed(2)}€</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>ZMENIŤ STAV</label>
              <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', fontFamily: 'Space Mono, monospace', fontSize: '12px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none' }}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setSelected(null)}
                style={{ flex: 1, padding: '14px', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'transparent', cursor: 'none' }}>
                ZAVRIEŤ
              </button>
              <button onClick={saveStatus} disabled={saving} className="btn-primary"
                style={{ flex: 2, padding: '14px', fontSize: '11px', letterSpacing: '0.15em' }}>
                {saving ? 'UKLADÁM...' : 'ULOŽIŤ STAV'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
