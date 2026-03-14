'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin/dashboard', label: 'DASHBOARD', icon: '▦' },
  { href: '/admin/vykup', label: 'VÝKUP KARIET', icon: '⇄' },
  { href: '/admin/objednavky', label: 'OBJEDNÁVKY', icon: '◫' },
  { href: '/admin/zakaznici', label: 'ZÁKAZNÍCI', icon: '◉' },
  { href: '/admin/produkty', label: 'PRODUKTY', icon: '◈' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin/login') return <>{children}</>

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--void)', fontFamily: 'Space Mono, monospace' }}>

      {/* Sidebar */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--surface-2)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 0',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 24px 28px', borderBottom: '1px solid var(--surface-2)', marginBottom: '16px' }}>
          <Link href="/" target="_blank" style={{ textDecoration: 'none' }}>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '0.2em', color: 'var(--ghost)', lineHeight: 1 }}>
              MM<span style={{ color: 'var(--orange)' }}>LEGACY</span>
            </p>
          </Link>
          <p style={{ fontSize: '9px', color: 'var(--dim)', letterSpacing: '0.25em', marginTop: '4px' }}>ADMIN PANEL</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
          {NAV.map(item => {
            const active = pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px',
                  background: active ? 'rgba(250,93,41,0.12)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(250,93,41,0.3)' : 'transparent'}`,
                  color: active ? 'var(--orange)' : 'var(--dim)',
                  fontSize: '10px', letterSpacing: '0.15em',
                  transition: 'all 0.15s',
                  cursor: 'none',
                }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--ghost)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--dim)'; (e.currentTarget as HTMLElement).style.background = 'transparent' } }}
                >
                  <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom: shop link + logout */}
        <div style={{ padding: '16px 12px 0', borderTop: '1px solid var(--surface-2)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Link href="/" target="_blank" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', color: 'var(--dim)', fontSize: '10px', letterSpacing: '0.15em', cursor: 'none' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--ghost)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--dim)')}>
              <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>↗</span>
              OTVORIŤ SHOP
            </div>
          </Link>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', color: 'var(--dim)', fontSize: '10px', letterSpacing: '0.15em', background: 'none', border: 'none', cursor: 'none', width: '100%', textAlign: 'left' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--red)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--dim)')}>
            <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>⏻</span>
            ODHLÁSIŤ
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px 48px' }}>
        {children}
      </main>
    </div>
  )
}
