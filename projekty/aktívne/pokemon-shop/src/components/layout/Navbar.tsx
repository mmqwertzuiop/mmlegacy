'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart'

const navLinks = [
  { href: '/shop/booster-boxy', label: 'BOOSTER BOXY' },
  { href: '/shop/graded', label: 'PSA GRADED' },
  { href: '/shop/singles', label: 'SINGLES' },
  { href: '/shop/mystery-boxy', label: 'MYSTERY' },
  { href: '/shop', label: 'VŠETKO' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const count = useCartStore(s => s.count())

  return (
    <nav
      className="fixed left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16"
      style={{
        top: '40px',
        background: 'rgba(8,8,8,0.95)',
        borderBottom: '1px solid var(--surface-2)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="font-headline text-2xl tracking-[0.2em]" style={{ color: 'var(--ghost)' }}>
        MM<span style={{ color: 'var(--orange)' }}>LEGACY</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono text-xs tracking-widest transition-premium"
            style={{ color: 'var(--dim)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Link href="/login" className="font-mono text-xs tracking-widest hidden md:block transition-premium" style={{ color: 'var(--dim)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}
        >
          LOGIN
        </Link>

        {/* Cart */}
        <Link href="/kosik" className="relative flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--ghost)' }}>
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {count > 0 && (
            <span
              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center font-mono text-xs font-bold"
              style={{ background: 'var(--orange)', color: '#000' }}
            >
              {count}
            </span>
          )}
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {[0,1,2].map(i => (
            <div key={i} className="w-6 h-0.5 transition-premium" style={{ background: 'var(--ghost)' }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute top-16 left-0 right-0 flex flex-col gap-0 md:hidden"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--surface-2)' }}
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-6 py-4 font-mono text-xs tracking-widest"
              style={{ color: 'var(--dim)', borderBottom: '1px solid var(--surface-2)' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="px-6 py-4 font-mono text-xs tracking-widest" style={{ color: 'var(--dim)' }} onClick={() => setMobileOpen(false)}>
            LOGIN / REGISTER
          </Link>
        </div>
      )}
    </nav>
  )
}
