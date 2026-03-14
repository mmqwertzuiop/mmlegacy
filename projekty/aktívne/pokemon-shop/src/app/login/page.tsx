'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Nesprávny email alebo heslo.'
          : authError.message
      )
      setLoading(false)
      return
    }

    router.push('/profil')
  }

  return (
    <div
      className="flex items-center justify-center px-6"
      style={{ background: 'var(--void)', minHeight: 'calc(100vh - 104px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="font-headline text-4xl tracking-[0.2em]" style={{ color: 'var(--ghost)' }}>
            MM<span style={{ color: 'var(--orange)' }}>LEGACY</span>
          </Link>
          <p className="font-mono text-xs mt-2 tracking-widest" style={{ color: 'var(--dim)' }}>PRIHLÁSENIE</p>
        </div>

        <div className="p-8" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
          {error && (
            <div className="p-3 mb-6 font-mono text-xs" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid var(--red)', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-xs block mb-2" style={{ color: 'var(--dim)' }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tvoj@email.sk"
                className="w-full px-4 py-3 font-mono text-sm outline-none"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                required
              />
            </div>
            <div>
              <label className="font-mono text-xs block mb-2" style={{ color: 'var(--dim)' }}>HESLO</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 font-mono text-sm outline-none"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-sm tracking-widest mt-6"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'PRIHLASOVANIE...' : 'PRIHLÁSIŤ SA'}
            </button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid var(--surface-2)' }}>
            <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>
              Nemáš účet?{' '}
              <Link href="/register" className="transition-premium" style={{ color: 'var(--orange)' }}>
                Registrovať sa
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
