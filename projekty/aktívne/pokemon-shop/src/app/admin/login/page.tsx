'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
      router.refresh()
    } else {
      setError('Nesprávne heslo')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', letterSpacing: '0.3em', color: 'var(--ghost)' }}>
            MM<span style={{ color: 'var(--orange)' }}>LEGACY</span>
          </p>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--dim)', marginTop: '6px' }}>
            ADMIN PANEL
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)', padding: '40px' }}>
          {error && (
            <div style={{ padding: '10px 14px', marginBottom: '20px', fontFamily: 'Space Mono, monospace', fontSize: '11px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--red)', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', display: 'block', marginBottom: '8px' }}>
            HESLO
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            style={{ width: '100%', padding: '14px 16px', fontFamily: 'Space Mono, monospace', fontSize: '14px', background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)', outline: 'none', marginBottom: '20px' }}
            onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
            onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
          />

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '12px', letterSpacing: '0.15em', opacity: password ? 1 : 0.4 }}
          >
            {loading ? 'PRIHLASOVANIE...' : 'VSTÚPIŤ →'}
          </button>
        </form>
      </div>
    </div>
  )
}
