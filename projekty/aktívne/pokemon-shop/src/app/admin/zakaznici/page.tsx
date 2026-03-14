'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Customer = {
  id: string
  username: string | null
  avatar_url: string | null
  joined_at: string
  order_count?: number
  total_spent?: number
}

export default function AdminZakazniciPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('joined_at', { ascending: false })

      const { data: orders } = await supabase
        .from('orders')
        .select('user_id, total, status')

      const enriched = (profiles || []).map(p => {
        const userOrders = (orders || []).filter(o => o.user_id === p.id)
        return {
          ...p,
          order_count: userOrders.length,
          total_spent: userOrders.filter(o => o.status === 'paid' || o.status === 'delivered').reduce((s, o) => s + o.total, 0),
        }
      })

      setCustomers(enriched)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = customers.filter(c =>
    !search || (c.username || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '8px' }}>SPRÁVA</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>ZÁKAZNÍCI</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Hľadať zákazníka..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '10px 16px', fontFamily: 'Space Mono, monospace', fontSize: '11px', background: 'var(--surface)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none', width: '220px' }}
              onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
              onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
            />
            <div style={{ padding: '10px 20px', background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '16px', color: 'var(--ghost)', fontWeight: 700 }}>{customers.length}</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.15em', marginLeft: '8px' }}>CELKOM</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--dim)', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>NAČÍTAVAM...</p>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', border: '1px solid var(--surface-2)', background: 'var(--surface)' }}>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: 'var(--dim)', letterSpacing: '0.04em', marginBottom: '8px' }}>ŽIADNI ZÁKAZNÍCI</p>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>
            {customers.length === 0 ? 'Zatiaľ sa nezaregistroval žiadny zákazník.' : 'Žiadny výsledok pre hľadaný výraz.'}
          </p>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--surface-2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px 140px', background: 'var(--surface-2)', padding: '10px 16px', gap: '8px' }}>
            {['ZÁKAZNÍK', 'OBJEDNÁVKY', 'UTRATIL', 'REGISTROVANÝ'].map((h, i) => (
              <span key={i} style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)' }}>{h}</span>
            ))}
          </div>
          {filtered.map((c, i) => (
            <div key={c.id}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 160px 120px 140px',
                padding: '14px 16px', gap: '8px', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--surface-2)' : 'none',
                background: 'transparent', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.01)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c.avatar_url ? (
                    <img src={c.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: 'var(--orange)' }}>
                      {(c.username || '?')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', color: 'var(--ghost)', fontWeight: 600 }}>{c.username || '(bez mena)'}</p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', marginTop: '2px' }}>#{c.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: (c.order_count || 0) > 0 ? 'var(--ghost)' : 'var(--dim)' }}>
                {c.order_count || 0} obj.
              </span>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, color: (c.total_spent || 0) > 0 ? 'var(--green)' : 'var(--dim)' }}>
                {c.total_spent ? `${(c.total_spent / 100).toFixed(2)}€` : '—'}
              </span>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>
                {new Date(c.joined_at).toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
