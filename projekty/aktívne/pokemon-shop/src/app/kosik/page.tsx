'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart'
import { formatPrice } from '@/data/products'

export default function KosikPage() {
  const { items, removeItem, updateQuantity, total, count } = useCartStore()
  const totalCents = total()
  const loyaltyPoints = Math.floor(totalCents / 100)

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 48px' }}>
        <div className="mb-12" style={{ borderBottom: '1px solid var(--surface-2)', paddingBottom: '2rem' }}>
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--orange)' }}>MM LEGACY</p>
          <h1 className="font-headline text-6xl md:text-7xl" style={{ color: 'var(--ghost)' }}>KOŠÍK</h1>
          <p className="font-mono text-sm mt-2" style={{ color: 'var(--dim)' }}>{count()} položiek</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-headline text-5xl mb-4" style={{ color: 'var(--dim)' }}>PRÁZDNY KOŠÍK</p>
            <p className="font-mono text-sm mb-10" style={{ color: 'var(--dim)' }}>Zatiaľ si nič nepridali do košíka.</p>
            <Link href="/shop">
              <button className="btn-primary px-10 py-4 text-sm tracking-widest">PREHLIADAŤ SHOP</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4"
                  style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)' }}
                >
                  <div className="relative shrink-0" style={{ width: '80px', height: '110px', background: 'var(--surface-2)' }}>
                    {item.product.img_url && (
                      <Image
                        src={item.product.img_url}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1" style={{ color: 'var(--ghost)' }}>{item.product.name}</h3>
                    {item.product.set_name && (
                      <p className="font-mono text-xs mb-1" style={{ color: 'var(--dim)' }}>{item.product.set_name}</p>
                    )}
                    {item.product.psa_grade && (
                      <span className="font-mono text-xs px-2 py-0.5 mr-2" style={{ background: 'var(--gold)', color: '#000' }}>
                        PSA {item.product.psa_grade}
                      </span>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center" style={{ border: '1px solid var(--surface-2)' }}>
                        <button className="px-3 py-1 font-mono text-sm" style={{ color: 'var(--ghost)', background: 'var(--surface-2)' }} onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                        <span className="px-3 py-1 font-mono text-sm" style={{ color: 'var(--ghost)' }}>{item.quantity}</span>
                        <button className="px-3 py-1 font-mono text-sm" style={{ color: 'var(--ghost)', background: 'var(--surface-2)' }} onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="font-mono text-xs transition-premium" style={{ color: 'var(--dim)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}
                        onClick={() => removeItem(item.product.id)}
                      >
                        ODSTRÁNIŤ
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono font-bold text-lg" style={{ color: 'var(--gold)' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>
                        {formatPrice(item.product.price)} / ks
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div style={{ position: 'sticky', top: '120px' }}>
                <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
                  <h2 className="font-headline text-2xl mb-6" style={{ color: 'var(--ghost)' }}>SÚHRN</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="font-mono text-sm" style={{ color: 'var(--dim)' }}>Medzisúčet</span>
                      <span className="font-mono text-sm" style={{ color: 'var(--ghost)' }}>{formatPrice(totalCents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-sm" style={{ color: 'var(--dim)' }}>Doprava</span>
                      <span className="font-mono text-sm" style={{ color: 'var(--green)' }}>Vypočíta sa</span>
                    </div>
                    <div className="flex justify-between py-3" style={{ borderTop: '1px solid var(--surface-2)', borderBottom: '1px solid var(--surface-2)' }}>
                      <span className="font-mono font-bold" style={{ color: 'var(--ghost)' }}>CELKOM</span>
                      <span className="font-mono font-bold text-xl" style={{ color: 'var(--gold)' }}>{formatPrice(totalCents)}</span>
                    </div>
                  </div>

                  {/* Loyalty preview */}
                  <div className="p-3 mb-6" style={{ background: 'var(--surface-2)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p className="font-mono text-xs" style={{ color: 'var(--gold)' }}>
                      Za tento nákup získaš <strong>{loyaltyPoints} XP</strong>
                    </p>
                  </div>

                  <Link href="/checkout">
                    <button className="btn-primary w-full py-4 text-sm tracking-widest mb-3">
                      POKRAČOVAŤ NA PLATBU
                    </button>
                  </Link>
                  <Link href="/shop">
                    <button className="w-full py-3 font-mono text-xs tracking-widest transition-premium" style={{ border: '1px solid var(--surface-2)', color: 'var(--dim)', background: 'transparent' }}>
                      POKRAČOVAŤ V NÁKUPE
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
