'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirm) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center px-6" style={{ background: 'var(--void)', minHeight: 'calc(100vh - 104px)' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <Link href="/" className="font-headline text-4xl tracking-[0.2em]" style={{ color: 'var(--ghost)' }}>
            MM<span style={{ color: 'var(--orange)' }}>LEGACY</span>
          </Link>
          <p className="font-mono text-xs mt-2 tracking-widest" style={{ color: 'var(--dim)' }}>REGISTRÁCIA</p>
        </div>

        <div className="p-8" style={{ background: 'var(--surface)', border: '1px solid var(--surface-2)' }}>
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-4xl" style={{ background: 'rgba(34,197,94,0.2)', color: 'var(--green)' }}>✓</div>
              <h2 className="font-headline text-3xl mb-2" style={{ color: 'var(--ghost)' }}>VITAJ!</h2>
              <p className="font-mono text-sm mb-2" style={{ color: 'var(--dim)' }}>Účet bol vytvorený.</p>
              <p className="font-mono text-sm mb-6" style={{ color: 'var(--gold)' }}>+500 XP BONUS pripisaný!</p>
              <Link href="/login">
                <button className="btn-primary px-8 py-3 text-sm tracking-widest">PRIHLÁSIŤ SA</button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* XP bonus banner */}
              <div className="p-3 mb-2 font-mono text-xs text-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--gold)' }}>
                Registrácia zadarmo + <strong>+500 XP</strong> BONUS
              </div>

              {[
                { key: 'username', label: 'POUŽÍVATEĽSKÉ MENO', type: 'text', placeholder: 'PokéMaster' },
                { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'tvoj@email.sk' },
                { key: 'password', label: 'HESLO', type: 'password', placeholder: '••••••••' },
                { key: 'confirm', label: 'POTVRDIŤ HESLO', type: 'password', placeholder: '••••••••' },
              ].map(field => (
                <div key={field.key}>
                  <label className="font-mono text-xs block mb-2" style={{ color: 'var(--dim)' }}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-4 py-3 font-mono text-sm outline-none"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-2)', color: 'var(--ghost)' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--surface-2)')}
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-sm tracking-widest mt-2"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'REGISTRÁCIA...' : 'VYTVORIŤ ÚČET'}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid var(--surface-2)' }}>
              <p className="font-mono text-xs" style={{ color: 'var(--dim)' }}>
                Máš účet?{' '}
                <Link href="/login" className="transition-premium" style={{ color: 'var(--orange)' }}>
                  Prihlásiť sa
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
