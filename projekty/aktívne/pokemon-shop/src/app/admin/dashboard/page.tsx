'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PRODUCTS } from '@/data/products'

type Stats = {
  buyback_pending: number
  buyback_total: number
  orders_total: number
  orders_pending: number
  users_total: number
  revenue_total: number
}

type RecentBuyback = {
  id: string
  name: string
  email: string
  total_items: number
  status: string
  created_at: string
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'var(--orange)',
  reviewing: 'var(--blue)',
  offer_sent: 'var(--gold)',
  accepted: 'var(--green)',
  rejected: 'var(--red)',
  completed: 'var(--dim)',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'NOVÁ',
  reviewing: 'POSUDZUJEME',
  offer_sent: 'PONUKA POSLANÁ',
  accepted: 'PRIJATÁ',
  rejected: 'ZAMIETNUTÁ',
  completed: 'DOKONČENÁ',
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentBuyback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [buybackRes, ordersRes, usersRes] = await Promise.all([
        supabase.from('buyback_submissions').select('id, status, created_at, name, email, total_items').order('created_at', { ascending: false }),
        supabase.from('orders').select('id, total, status'),
        supabase.from('profiles').select('id'),
      ])

      const buybacks = buybackRes.data || []
      const orders = ordersRes.data || []
      const users = usersRes.data || []

      setStats({
        buyback_pending: buybacks.filter(b => b.status === 'pending').length,
        buyback_total: buybacks.length,
        orders_total: orders.length,
        orders_pending: orders.filter(o => o.status === 'pending').length,
        users_total: users.length,
        revenue_total: orders.filter(o => o.status === 'paid' || o.status === 'delivered').reduce((s, o) => s + (o.total || 0), 0),
      })
      setRecent(buybacks.slice(0, 5) as RecentBuyback[])
      setLoading(false)
    }
    load()
  }, [])

  const totalProducts = PRODUCTS.length
  const totalStock = PRODUCTS.reduce((s, p) => s + (p.stock || 0), 0)

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '8px' }}>
          {new Date().toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
        </p>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', color: 'var(--ghost)', letterSpacing: '0.04em', lineHeight: 1 }}>
          DOBRÝ DEŇ, MM
        </h1>
      </div>

      {loading ? (
        <p style={{ color: 'var(--dim)', fontSize: '12px' }}>Načítavam...</p>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '40px' }}>
            {[
              { label: 'VÝKUP — NOVÉ', value: stats!.buyback_pending, sub: `z ${stats!.buyback_total} celkom`, color: stats!.buyback_pending > 0 ? 'var(--orange)' : 'var(--ghost)', href: '/admin/vykup' },
              { label: 'OBJEDNÁVKY', value: stats!.orders_total, sub: `${stats!.orders_pending} čakajúcich`, color: 'var(--ghost)', href: '/admin/objednavky' },
              { label: 'ZÁKAZNÍCI', value: stats!.users_total, sub: 'registrovaných', color: 'var(--ghost)', href: '/admin/zakaznici' },
              { label: 'TRŽBY', value: `${(stats!.revenue_total / 100).toFixed(0)}€`, sub: 'zaplatené objednávky', color: 'var(--green)', href: '/admin/objednavky' },
            ].map((card, i) => (
              <Link key={i} href={card.href} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--surface-2)', transition: 'border-color 0.15s', cursor: 'none' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--surface-2)')}>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)', marginBottom: '12px' }}>{card.label}</p>
                  <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: card.color, lineHeight: 1, marginBottom: '6px' }}>{card.value}</p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.1em' }}>{card.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Second row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
            <Link href="/admin/produkty" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--surface-2)', cursor: 'none', transition: 'border-color 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--surface-2)')}>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)', marginBottom: '12px' }}>PRODUKTY V KATALÓGU</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px' }}>
                  <div>
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: 'var(--ghost)', lineHeight: 1 }}>{totalProducts}</p>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.1em' }}>produktov</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: totalStock < 20 ? 'var(--red)' : 'var(--ghost)', lineHeight: 1 }}>{totalStock}</p>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.1em' }}>ks skladom</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Quick links */}
            <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)', marginBottom: '16px' }}>RÝCHLE AKCIE</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: '→ Nové výkup žiadosti', href: '/admin/vykup', badge: stats!.buyback_pending > 0 ? stats!.buyback_pending : null },
                  { label: '→ Prehľad objednávok', href: '/admin/objednavky', badge: null },
                  { label: '→ Všetci zákazníci', href: '/admin/zakaznici', badge: null },
                  { label: '↗ Otvoriť shop', href: '/', badge: null },
                ].map((link, i) => (
                  <Link key={i} href={link.href} target={link.href === '/' ? '_blank' : undefined} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', letterSpacing: '0.1em', transition: 'color 0.15s', cursor: 'none' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--orange)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--dim)')}>
                      {link.label}
                    </span>
                    {link.badge && (
                      <span style={{ padding: '2px 8px', background: 'var(--orange)', color: '#000', fontFamily: 'Space Mono, monospace', fontSize: '9px', fontWeight: 700 }}>{link.badge}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent buybacks */}
          {recent.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)' }}>POSLEDNÉ VÝKUP ŽIADOSTI</p>
                <Link href="/admin/vykup" style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--orange)', textDecoration: 'none', letterSpacing: '0.1em' }}>ZOBRAZIŤ VŠETKY →</Link>
              </div>
              <div style={{ border: '1px solid var(--surface-2)' }}>
                {recent.map((r, i) => (
                  <Link key={r.id} href="/admin/vykup" style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 120px 60px 100px 140px',
                      padding: '12px 20px', gap: '16px', alignItems: 'center',
                      borderBottom: i < recent.length - 1 ? '1px solid var(--surface-2)' : 'none',
                      background: 'transparent', cursor: 'none', transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(250,93,41,0.04)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                      <div>
                        <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', color: 'var(--ghost)', fontWeight: 600 }}>{r.name}</p>
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', marginTop: '2px' }}>{r.email}</p>
                      </div>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>{r.total_items} kariet</span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: STATUS_COLOR[r.status] || 'var(--dim)', padding: '3px 8px', border: `1px solid ${STATUS_COLOR[r.status] || 'var(--dim)'}` }}>
                        {STATUS_LABEL[r.status] || r.status}
                      </span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)' }}>
                        {new Date(r.created_at).toLocaleDateString('sk-SK')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
