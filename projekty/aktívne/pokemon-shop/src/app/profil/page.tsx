'use client'
import Link from 'next/link'
import { MOCK_LEADERBOARD } from '@/data/products'

const MOCK_ORDERS = [
  { id: 'ORD-001', date: '2026-03-10', total: 89999, status: 'delivered', items: 2 },
  { id: 'ORD-002', date: '2026-02-28', total: 39999, status: 'shipped', items: 1 },
  { id: 'ORD-003', date: '2026-02-15', total: 14999, status: 'delivered', items: 3 },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  delivered: { label: 'DORUČENÉ', color: 'var(--green)' },
  shipped: { label: 'ODOSLANÉ', color: 'var(--blue)' },
  processing: { label: 'SPRACÚVA SA', color: 'var(--gold)' },
  pending: { label: 'ČAKÁ', color: 'var(--dim)' },
}

export default function ProfilPage() {
  const xp = 2400
  const nextLevel = 5000
  const xpPercent = (xp / nextLevel) * 100

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <div className="mb-12" style={{ borderBottom: '1px solid var(--surface-2)', paddingBottom: '2rem' }}>
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--orange)' }}>MM LEGACY</p>
          <h1 className="font-headline text-6xl" style={{ color: 'var(--ghost)' }}>PROFIL</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left sidebar */}
          <div className="space-y-6">
            {/* User card */}
            <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
              <div className="w-16 h-16 flex items-center justify-center font-headline text-3xl mb-4" style={{ background: 'rgba(250,93,41,0.2)', color: 'var(--orange)' }}>
                P
              </div>
              <h2 className="font-bold text-xl" style={{ color: 'var(--ghost)' }}>PokéZberateľ</h2>
              <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>pokzberatelo@email.sk</p>
              <p className="font-mono text-xs mt-1" style={{ color: 'var(--dim)' }}>Člen od: Február 2026</p>
            </div>

            {/* XP / Level */}
            <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--gold)' }}>BRONZE COLLECTOR</span>
                <span className="font-mono text-xs" style={{ color: 'var(--dim)' }}>Level 1</span>
              </div>
              <p className="font-mono text-3xl font-bold mb-3" style={{ color: 'var(--gold)' }}>
                {xp.toLocaleString()} XP
              </p>
              <div className="h-2 w-full mb-2" style={{ background: 'var(--surface-2)' }}>
                <div className="h-full" style={{ width: `${xpPercent}%`, background: 'var(--gold)' }} />
              </div>
              <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>
                {nextLevel - xp} XP do Silver Collector
              </p>
            </div>

            {/* Quick links */}
            <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
              <h3 className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--orange)' }}>RÝCHLY PRÍSTUP</h3>
              <div className="space-y-2">
                <Link href="/shop" className="block font-mono text-sm transition-premium" style={{ color: 'var(--dim)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}
                >
                  → Shop
                </Link>
                <Link href="/kosik" className="block font-mono text-sm transition-premium" style={{ color: 'var(--dim)' }}>
                  → Košík
                </Link>
                <Link href="/mystery-boxy" className="block font-mono text-sm transition-premium" style={{ color: 'var(--dim)' }}>
                  → Mystery Boxy
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Orders */}
            <div>
              <h2 className="font-headline text-3xl mb-6" style={{ color: 'var(--ghost)' }}>HISTÓRIA OBJEDNÁVOK</h2>
              <div className="space-y-3">
                {MOCK_ORDERS.map(order => {
                  const status = statusConfig[order.status]
                  return (
                    <div key={order.id} className="flex items-center gap-4 p-4" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm font-bold" style={{ color: 'var(--ghost)' }}>{order.id}</span>
                          <span className="font-mono text-xs px-2 py-0.5" style={{ background: `${status.color}20`, color: status.color }}>
                            {status.label}
                          </span>
                        </div>
                        <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>{order.date} — {order.items} položiek</p>
                      </div>
                      <span className="font-mono font-bold" style={{ color: 'var(--gold)' }}>
                        {(order.total / 100).toFixed(2)} €
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Loyalty levels overview */}
            <div>
              <h2 className="font-headline text-3xl mb-6" style={{ color: 'var(--ghost)' }}>COLLECTOR&apos;S CLUB</h2>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { name: 'Bronze', color: '#CD7F32', active: true },
                  { name: 'Silver', color: '#C0C0C0', active: false },
                  { name: 'Gold', color: '#FFD700', active: false },
                  { name: 'Platinum', color: '#E5E4E2', active: false },
                  { name: 'Diamond', color: '#B9F2FF', active: false },
                ].map((level, i) => (
                  <div
                    key={i}
                    className="p-3 text-center"
                    style={{
                      background: level.active ? `${level.color}15` : 'var(--surface)',
                      border: `1px solid ${level.active ? level.color + '50' : 'var(--surface-2)'}`,
                      opacity: level.active ? 1 : 0.5,
                    }}
                  >
                    <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center font-headline" style={{ background: `${level.color}20`, color: level.color }}>
                      {level.name[0]}
                    </div>
                    <p className="font-mono text-xs" style={{ color: level.color }}>{level.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
