'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRODUCTS } from '@/data/products'

const CATEGORIES: Record<string, string> = {
  'booster-box': 'BOOSTER BOXY',
  'psa-graded': 'PSA GRADED',
  'single': 'SINGLES',
  'collection-box': 'COLLECTION BOXY',
  'mystery-box': 'MYSTERY BOXY',
}

const CATEGORY_COLOR: Record<string, string> = {
  'booster-box': 'var(--blue)',
  'psa-graded': 'var(--gold)',
  'single': 'var(--ghost)',
  'collection-box': 'var(--purple)',
  'mystery-box': 'var(--orange)',
}

export default function AdminProduktyPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = PRODUCTS.filter(p => {
    if (filter !== 'all' && p.category !== filter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalValue = PRODUCTS.reduce((s, p) => s + (p.price * p.stock), 0)
  const lowStock = PRODUCTS.filter(p => p.stock < 3).length

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '8px' }}>SPRÁVA</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>PRODUKTY</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Hľadať produkt..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '10px 16px', fontFamily: 'Space Mono, monospace', fontSize: '11px', background: 'var(--surface)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none', width: '220px' }}
              onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
              onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'CELKOM PRODUKTOV', value: PRODUCTS.length, color: 'var(--ghost)' },
          { label: 'CELKOM KUSOV', value: PRODUCTS.reduce((s, p) => s + p.stock, 0), color: 'var(--ghost)' },
          { label: 'NÍZKY SKLAD (<3ks)', value: lowStock, color: lowStock > 0 ? 'var(--red)' : 'var(--green)' },
          { label: 'HODNOTA SKLADU', value: `${(totalValue / 100).toFixed(0)}€`, color: 'var(--green)' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '20px', background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)', marginBottom: '8px' }}>{s.label}</p>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: s.color, lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[['all', 'VŠETKY'], ...Object.entries(CATEGORIES)].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{ padding: '7px 16px', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.15em', background: filter === key ? 'var(--orange)' : 'var(--surface)', border: `1px solid ${filter === key ? 'var(--orange)' : 'var(--surface-2)'}`, color: filter === key ? '#000' : 'var(--dim)', cursor: 'none', fontWeight: filter === key ? 700 : 400 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Product table */}
      <div style={{ border: '1px solid var(--surface-2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 140px 100px 100px 100px', background: 'var(--surface-2)', padding: '10px 16px', gap: '8px' }}>
          {['IMG', 'NÁZOV', 'KATEGÓRIA', 'CENA', 'SKLAD', 'AKCIA'].map((h, i) => (
            <span key={i} style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)' }}>{h}</span>
          ))}
        </div>
        {filtered.map((p, i) => (
          <div key={p.id}
            style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 140px 100px 100px 100px',
              padding: '12px 16px', gap: '8px', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--surface-2)' : 'none',
              background: 'transparent', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.01)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

            <div style={{ width: '44px', height: '44px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {p.img_url && (
                <img src={p.img_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              )}
            </div>

            <div>
              <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', color: 'var(--ghost)', fontWeight: 600, marginBottom: '2px' }}>{p.name}</p>
              {p.set_name && <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)' }}>{p.set_name}</p>}
            </div>

            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: CATEGORY_COLOR[p.category] || 'var(--dim)', padding: '3px 8px', border: `1px solid ${CATEGORY_COLOR[p.category] || 'var(--surface-2)'}` }}>
              {CATEGORIES[p.category] || p.category}
            </span>

            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, color: 'var(--ghost)' }}>
              {(p.price / 100).toFixed(2)}€
            </span>

            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, color: p.stock < 3 ? 'var(--red)' : p.stock < 10 ? 'var(--gold)' : 'var(--green)' }}>
              {p.stock} ks
            </span>

            <Link href={`/shop/${p.slug}`} target="_blank" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '6px 12px', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'none', cursor: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.color = 'var(--orange)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--surface-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--dim)' }}>
                OTVORIŤ ↗
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
