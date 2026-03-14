'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { PRODUCTS } from '@/data/products'
import type { Product } from '@/types'

const CATEGORIES = [
  { value: 'booster-box', label: 'BOOSTER BOXY' },
  { value: 'psa-graded', label: 'PSA GRADED' },
  { value: 'singles', label: 'SINGLES' },
  { value: 'collection-box', label: 'COLLECTION BOXY' },
  { value: 'mystery-box', label: 'MYSTERY BOXY' },
]

const CATEGORY_COLOR: Record<string, string> = {
  'booster-box': 'var(--blue)',
  'psa-graded': 'var(--gold)',
  'singles': 'var(--ghost)',
  'collection-box': 'var(--purple)',
  'mystery-box': 'var(--orange)',
}

const emptyProduct = (): Partial<Product> => ({
  name: '', slug: '', description: '', category: 'booster-box',
  price: 0, stock: 0, img_url: '', set_name: '', rarity: '',
  psa_grade: undefined, is_mystery_box: false, mystery_tier: '',
  active: true,
})

export default function AdminProduktyPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true })
    if (error || !data || data.length === 0) {
      setProducts(PRODUCTS as Product[])
    } else {
      setProducts(data as Product[])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = products.filter(p => {
    if (filter !== 'all' && p.category !== filter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openEdit = (p: Product) => { setEditProduct({ ...p }); setIsNew(false); setError('') }
  const openNew = () => { setEditProduct({ ...emptyProduct() }); setIsNew(true); setError('') }

  const handleImageUpload = async (file: File) => {
    if (!editProduct) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${editProduct.id || Date.now()}-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (error) { setError('Chyba pri nahrávaní obrázka: ' + error.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
    setEditProduct(prev => prev ? { ...prev, img_url: urlData.publicUrl } : prev)
    setUploading(false)
  }

  const saveProduct = async () => {
    if (!editProduct) return
    setSaving(true)
    setError('')

    // Auto-generate slug if empty
    if (!editProduct.slug && editProduct.name) {
      editProduct.slug = editProduct.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
    }

    if (!editProduct.name || !editProduct.slug) {
      setError('Názov a slug sú povinné')
      setSaving(false)
      return
    }

    // Pri novom produkte vynecháme id — Supabase generuje UUID automaticky
    const { id: _omitId, ...insertData } = editProduct as Product
    const { error: err } = isNew
      ? await supabase.from('products').insert(insertData)
      : await supabase.from('products').update(editProduct).eq('id', editProduct.id!)

    if (err) {
      setError('Chyba: ' + err.message)
    } else {
      await load()
      setEditProduct(null)
    }
    setSaving(false)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Naozaj chceš odstrániť tento produkt?')) return
    await supabase.from('products').update({ active: false }).eq('id', id)
    await load()
  }

  const totalValue = products.reduce((s, p) => s + (p.price * p.stock), 0)
  const lowStock = products.filter(p => p.stock < 3 && p.stock >= 0).length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '8px' }}>SPRÁVA</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>PRODUKTY</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="text" placeholder="Hľadať..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '10px 16px', fontFamily: 'Space Mono, monospace', fontSize: '11px', background: 'var(--surface)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none', width: '200px' }}
              onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
              onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')} />
            <button onClick={load} style={{ padding: '10px 16px', fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', background: 'none', border: '1px solid var(--surface-2)', cursor: 'none', letterSpacing: '0.1em' }}>↻</button>
            <button onClick={openNew} className="btn-primary" style={{ padding: '10px 24px', fontSize: '11px', letterSpacing: '0.15em' }}>
              + NOVÝ PRODUKT
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'CELKOM', value: products.length, color: 'var(--ghost)' },
          { label: 'KS SKLADOM', value: products.reduce((s, p) => s + p.stock, 0), color: 'var(--ghost)' },
          { label: 'NÍZKY SKLAD', value: lowStock, color: lowStock > 0 ? 'var(--red)' : 'var(--green)' },
          { label: 'HODNOTA SKLADU', value: `${(totalValue / 100).toFixed(0)}€`, color: 'var(--green)' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)', marginBottom: '6px' }}>{s.label}</p>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: s.color, lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[['all', 'VŠETKY'], ...CATEGORIES.map(c => [c.value, c.label])].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{ padding: '7px 16px', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.15em', background: filter === key ? 'var(--orange)' : 'var(--surface)', border: `1px solid ${filter === key ? 'var(--orange)' : 'var(--surface-2)'}`, color: filter === key ? '#000' : 'var(--dim)', cursor: 'none', fontWeight: filter === key ? 700 : 400 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Products table */}
      {loading ? (
        <p style={{ color: 'var(--dim)', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>NAČÍTAVAM...</p>
      ) : (
        <div style={{ border: '1px solid var(--surface-2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 130px 90px 80px 80px 120px', background: 'var(--surface-2)', padding: '10px 16px', gap: '8px' }}>
            {['', 'NÁZOV', 'KATEGÓRIA', 'CENA', 'SKLAD', 'STAV', 'AKCIE'].map((h, i) => (
              <span key={i} style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--dim)' }}>{h}</span>
            ))}
          </div>
          {filtered.map((p, i) => (
            <div key={p.id}
              style={{ display: 'grid', gridTemplateColumns: '52px 1fr 130px 90px 80px 80px 120px', padding: '10px 16px', gap: '8px', borderBottom: i < filtered.length - 1 ? '1px solid var(--surface-2)' : 'none', alignItems: 'center', background: 'transparent', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.01)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

              <div style={{ width: '40px', height: '40px', background: 'var(--surface-2)', overflow: 'hidden', flexShrink: 0 }}>
                {p.img_url && <img src={p.img_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
              </div>

              <div>
                <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', color: 'var(--ghost)', fontWeight: 600 }}>{p.name}</p>
                {p.set_name && <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--dim)', marginTop: '2px' }}>{p.set_name}</p>}
              </div>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: CATEGORY_COLOR[p.category] || 'var(--dim)', padding: '3px 6px', border: `1px solid ${CATEGORY_COLOR[p.category] || 'var(--surface-2)'}` }}>
                {CATEGORIES.find(c => c.value === p.category)?.label || p.category}
              </span>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 700, color: 'var(--ghost)' }}>
                {(p.price / 100).toFixed(2)}€
              </span>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, color: p.stock === 0 ? 'var(--red)' : p.stock < 3 ? 'var(--gold)' : 'var(--green)' }}>
                {p.stock} ks
              </span>

              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: (p as any).active === false ? 'var(--red)' : 'var(--green)', padding: '3px 6px', border: `1px solid ${(p as any).active === false ? 'var(--red)' : 'var(--green)'}` }}>
                {(p as any).active === false ? 'SKRYTÝ' : 'AKTÍVNY'}
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => openEdit(p)}
                  style={{ padding: '5px 10px', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'none', cursor: 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.color = 'var(--orange)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--surface-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--dim)' }}>
                  EDIT
                </button>
                <button onClick={() => deleteProduct(p.id)}
                  style={{ padding: '5px 10px', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'none', cursor: 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)'; (e.currentTarget as HTMLElement).style.color = 'var(--red)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--surface-2)'; (e.currentTarget as HTMLElement).style.color = 'var(--dim)' }}>
                  DEL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/New modal */}
      {editProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', overflowY: 'auto' }}
          onClick={e => e.target === e.currentTarget && setEditProduct(null)}>
          <div style={{ background: 'var(--surface)', borderLeft: '1px solid var(--surface-2)', width: '100%', maxWidth: '560px', minHeight: '100vh', padding: '40px 36px', overflowY: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: 'var(--ghost)', letterSpacing: '0.04em' }}>
                {isNew ? 'NOVÝ PRODUKT' : 'EDIT PRODUKT'}
              </h2>
              <button onClick={() => setEditProduct(null)} style={{ background: 'none', border: 'none', color: 'var(--dim)', fontSize: '24px', cursor: 'none' }}>✕</button>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', marginBottom: '20px', fontFamily: 'Space Mono, monospace', fontSize: '11px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--red)', color: 'var(--red)' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Image */}
              <div>
                <label style={labelStyle}>OBRÁZOK</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '80px', height: '80px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {editProduct.img_url ? (
                      <img src={editProduct.img_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ color: 'var(--dim)', fontSize: '24px' }}>📷</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input type="text" placeholder="URL obrázka..."
                      value={editProduct.img_url || ''}
                      onChange={e => setEditProduct(prev => prev ? { ...prev, img_url: e.target.value } : prev)}
                      style={{ ...inputStyle, marginBottom: '8px' }} />
                    <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }}
                      onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]) }} />
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                      style={{ padding: '8px 16px', fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', border: '1px solid var(--orange)', color: 'var(--orange)', background: 'transparent', cursor: 'none', opacity: uploading ? 0.6 : 1 }}>
                      {uploading ? 'NAHRÁVAM...' : '↑ NAHRAŤ OBRÁZOK'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={labelStyle}>NÁZOV *</label>
                <input type="text" value={editProduct.name || ''}
                  onChange={e => {
                    const name = e.target.value
                    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()
                    setEditProduct(prev => prev ? { ...prev, name, slug: isNew ? slug : prev.slug } : prev)
                  }}
                  style={inputStyle} />
              </div>

              {/* Slug */}
              <div>
                <label style={labelStyle}>SLUG (URL)</label>
                <input type="text" value={editProduct.slug || ''}
                  onChange={e => setEditProduct(prev => prev ? { ...prev, slug: e.target.value } : prev)}
                  style={inputStyle} />
              </div>

              {/* Category */}
              <div>
                <label style={labelStyle}>KATEGÓRIA</label>
                <select value={editProduct.category || 'booster-box'}
                  onChange={e => setEditProduct(prev => prev ? { ...prev, category: e.target.value as Product['category'] } : prev)}
                  style={selectStyle}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Price + Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>CENA (v centoch)</label>
                  <input type="number" min="0" value={editProduct.price || 0}
                    onChange={e => setEditProduct(prev => prev ? { ...prev, price: parseInt(e.target.value) || 0 } : prev)}
                    style={inputStyle} />
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--orange)', marginTop: '4px' }}>
                    = {((editProduct.price || 0) / 100).toFixed(2)}€
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>SKLAD (ks)</label>
                  <input type="number" min="0" value={editProduct.stock || 0}
                    onChange={e => setEditProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : prev)}
                    style={inputStyle} />
                </div>
              </div>

              {/* Set name + Rarity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>SADA (SET)</label>
                  <input type="text" value={editProduct.set_name || ''}
                    onChange={e => setEditProduct(prev => prev ? { ...prev, set_name: e.target.value } : prev)}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>RARITY</label>
                  <input type="text" value={editProduct.rarity || ''}
                    onChange={e => setEditProduct(prev => prev ? { ...prev, rarity: e.target.value } : prev)}
                    style={inputStyle} />
                </div>
              </div>

              {/* PSA Grade (iba pre graded) */}
              {editProduct.category === 'psa-graded' && (
                <div>
                  <label style={labelStyle}>PSA GRADE</label>
                  <select value={editProduct.psa_grade || ''}
                    onChange={e => setEditProduct(prev => prev ? { ...prev, psa_grade: e.target.value ? parseInt(e.target.value) : undefined } : prev)}
                    style={selectStyle}>
                    <option value="">— žiadny —</option>
                    {[10,9,8,7,6,5,4,3,2,1].map(g => <option key={g} value={g}>PSA {g}</option>)}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label style={labelStyle}>POPIS</label>
                <textarea rows={4} value={editProduct.description || ''}
                  onChange={e => setEditProduct(prev => prev ? { ...prev, description: e.target.value } : prev)}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* Active toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--void)', border: '1px solid var(--surface-2)' }}>
                <div>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--ghost)', letterSpacing: '0.1em' }}>VIDITEĽNÝ V SHOPE</p>
                  <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '12px', color: 'var(--dim)', marginTop: '2px' }}>Skrytý produkt sa nezobrazí zákazníkom</p>
                </div>
                <button type="button"
                  onClick={() => setEditProduct(prev => prev ? { ...prev, active: !(prev as any).active } : prev)}
                  style={{ width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'none', background: (editProduct as any).active !== false ? 'var(--green)' : 'var(--surface-2)', position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: '3px', left: (editProduct as any).active !== false ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--ghost)', transition: 'left 0.2s' }} />
                </button>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                <button onClick={() => setEditProduct(null)}
                  style={{ flex: 1, padding: '14px', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.15em', border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'transparent', cursor: 'none' }}>
                  ZRUŠIŤ
                </button>
                <button onClick={saveProduct} disabled={saving} className="btn-primary"
                  style={{ flex: 2, padding: '14px', fontSize: '12px', letterSpacing: '0.15em', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'UKLADÁM...' : isNew ? 'VYTVORIŤ PRODUKT' : 'ULOŽIŤ ZMENY'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em',
  color: 'var(--dim)', display: 'block', marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', fontFamily: 'Inter Tight, sans-serif',
  fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)',
  color: 'var(--ghost)', outline: 'none',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', fontFamily: 'Inter Tight, sans-serif',
  fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)',
  color: 'var(--ghost)', outline: 'none',
}
