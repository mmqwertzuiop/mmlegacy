'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--surface-2)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 48px' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-headline text-3xl tracking-[0.2em] mb-4">
              MM<span style={{ color: 'var(--orange)' }}>LEGACY</span>
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--dim)' }}>
              MM Legacy vznikol z vášne pre Pokemon TCG. Prémiové produkty, overená autentickosť, férové ceny.
            </p>
            <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>
              MM Legacy — Prémiový Pokemon TCG Shop.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-mono text-xs tracking-widest mb-6" style={{ color: 'var(--orange)' }}>SHOP</h4>
            <ul className="space-y-3">
              {[
                { href: '/shop/booster-boxy', label: 'Booster Boxy' },
                { href: '/shop/graded', label: 'PSA Graded' },
                { href: '/shop/singles', label: 'Single Karty' },
                { href: '/shop/collection-boxy', label: 'Collection Boxy' },
                { href: '/shop/mystery-boxy', label: 'Mystery Boxy' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-premium" style={{ color: 'var(--dim)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-mono text-xs tracking-widest mb-6" style={{ color: 'var(--orange)' }}>ÚČET</h4>
            <ul className="space-y-3">
              {[
                { href: '/login', label: 'Prihlásenie' },
                { href: '/register', label: 'Registrácia' },
                { href: '/profil', label: 'Môj profil' },
                { href: '/kosik', label: 'Košík' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-premium" style={{ color: 'var(--dim)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--orange)' }}>NEWSLETTER</h4>
            <h3 className="font-headline text-2xl mb-2" style={{ color: 'var(--ghost)' }}>Buď prvý. Vždy.</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--dim)' }}>
              Early access k novým produktom, exkluzívne ponuky. Žiadny spam.
            </p>
            {subscribed ? (
              <p className="font-mono text-sm" style={{ color: 'var(--green)' }}>✓ ZAREGISTROVANÝ</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="tvoj@email.sk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="px-4 py-2.5 text-sm font-mono w-full outline-none"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--surface-2)',
                    color: 'var(--ghost)',
                  }}
                  required
                />
                <button type="submit" className="btn-primary px-4 py-2.5 text-xs tracking-widest">
                  CHCEM EARLY ACCESS
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--surface-2)' }}
        >
          <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>
            © 2026 MM Legacy. Všetky práva vyhradené.
          </p>
          <p className="font-mono text-xs text-center" style={{ color: 'var(--dim)' }}>
            Pokemon a všetky súvisiace mená sú ochrannými známkami Nintendo / Creatures Inc. / GAME FREAK inc.
          </p>
        </div>
      </div>
    </footer>
  )
}
