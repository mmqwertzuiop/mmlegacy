'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu, X, Zap } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { CartDrawer } from '@/components/shop/CartDrawer'

const NAV_LINKS = [
  { href: '/shop', label: 'Obchod' },
  { href: '/o-nas', label: 'O nas' },
  { href: '/kontakt', label: 'Kontakt' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems())
  const toggleCart = useCartStore((s) => s.toggleCart)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#1e1e2e] bg-[#0a0a0f]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="PullEmpire - domov"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#f5c842] text-black">
              <Zap className="size-4 fill-black" />
            </span>
            <span className="text-lg font-bold tracking-tight text-[#e2e8f0] group-hover:text-[#f5c842] transition-colors">
              Pull<span className="text-[#f5c842]">Empire</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Hlavna navigacia">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#1e1e2e] transition-all"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart trigger */}
            <button
              onClick={toggleCart}
              aria-label={`Kosik — ${totalItems} poloziek`}
              className="relative flex size-9 items-center justify-center rounded-lg border border-[#1e1e2e] bg-[#111118] text-[#64748b] hover:text-[#e2e8f0] hover:border-[#f5c842]/40 transition-all"
            >
              <ShoppingCart className="size-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-[#f5c842] text-[9px] font-bold text-black">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Zatvorit menu' : 'Otvorit menu'}
              aria-expanded={menuOpen}
              className="md:hidden flex size-9 items-center justify-center rounded-lg border border-[#1e1e2e] bg-[#111118] text-[#64748b] hover:text-[#e2e8f0] transition-all"
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            className="md:hidden border-t border-[#1e1e2e] bg-[#0a0a0f] px-4 py-3 flex flex-col gap-1"
            aria-label="Mobilna navigacia"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#1e1e2e] transition-all"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Cart drawer lives here, outside header */}
      <CartDrawer />
    </>
  )
}
