'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import PageIntro from '@/components/ui/PageIntro'

const STEPS = [
  {
    num: '01',
    title: 'VYPLN FORMULÁR',
    desc: 'Zadaj názov karty, stav, jazyk a orientačnú cenu. Trvá to 2 minúty.',
  },
  {
    num: '02',
    title: 'DOSTANEŠ PONUKU',
    desc: 'Do 24 hodín ti pošleme cenovú ponuku emailom na základe aktuálneho trhu.',
  },
  {
    num: '03',
    title: 'POŠLI KARTU',
    desc: 'Ak súhlasíš s cenou, pošleš kartu na našu adresu. Platíme dopravu.',
  },
  {
    num: '04',
    title: 'DOSTANEŠ PENIAZE',
    desc: 'Po overení karty ti prevedieme peniaze do 48 hodín. Bankový prevod alebo PayPal.',
  },
]

const PRICE_GUIDE = [
  { card: 'Charizard ex SIR (sv3pt5)', grade: 'PSA 10', price: '350–420€' },
  { card: 'Umbreon VMAX Alt Art (swsh7)', grade: 'PSA 10', price: '800–1000€' },
  { card: 'Umbreon VMAX Alt Art (swsh7)', grade: 'NM/LP', price: '180–240€' },
  { card: 'Rayquaza VMAX Alt Art (swsh4)', grade: 'PSA 10', price: '500–650€' },
  { card: 'Giratina V Alt Art (swsh11)', grade: 'PSA 10', price: '130–170€' },
  { card: 'Pikachu VMAX Rainbow (swsh4)', grade: 'PSA 10', price: '300–380€' },
  { card: 'Charizard ex SIR (sv3pt5)', grade: 'NM/LP', price: '60–90€' },
  { card: 'Prismatic Evolutions Booster Box', grade: 'Sealed', price: '160–185€' },
]

const WHY = [
  { icon: '💰', title: 'FÉROVÉ CENY', desc: 'Platíme 75–85% aktuálnej trhovej hodnoty. Žiadne nízke výkupné ceny.' },
  { icon: '⚡', title: 'RÝCHLA PLATBA', desc: 'Peniaze na účte do 48 hodín od prijatia karty.' },
  { icon: '📦', title: 'DOPRAVA ZADARMO', desc: 'Zaplatíme poštovné. Pošleš nám na náklady MM Legacy.' },
  { icon: '🔒', title: 'BEZPEČNOSŤ', desc: 'Tvoje karty sú poistené počas prepravy. Pracujeme len s overenými kartami.' },
]

export default function VykupPage() {
  return (
    <>
    <PageIntro type="vykup" title="VÝKUP KARIET" subtitle="PREDAJ NÁM SVOJU ZBIERKU" />
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 48px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', textDecoration: 'none', letterSpacing: '0.15em' }}>DOMOV</Link>
        <span style={{ color: 'var(--dim)', fontSize: '10px' }}>›</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--ghost)', letterSpacing: '0.15em' }}>VÝKUP KARIET</span>
      </div>

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', padding: '60px 0 80px', overflow: 'hidden' }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--surface-2) 1px, transparent 1px), linear-gradient(90deg, var(--surface-2) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(250,93,41,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)', textDecoration: 'none', marginBottom: '28px', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ghost)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}>
              ← DOMOV
            </Link>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.4em', color: 'var(--orange)', marginBottom: '20px' }}>
              MM LEGACY — VÝKUP KARIET
            </p>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(60px, 7vw, 100px)',
              lineHeight: 0.92,
              color: 'var(--ghost)',
              letterSpacing: '0.02em',
              marginBottom: '24px',
            }}>
              PREDAJ NÁM<br />
              <span style={{ color: 'var(--orange)' }}>SVOJE KARTY.</span>
            </h1>
            <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '17px', lineHeight: 1.7, color: 'var(--dim)', maxWidth: '540px', marginBottom: '40px' }}>
              Vykupujeme Pokemon TCG karty za férové ceny. PSA graded, raw singles, booster boxy — všetko. Rýchla platba, jednoduchý proces.
            </p>
            <Link href="/vykup/formular">
              <button className="btn-primary" style={{ padding: '18px 48px', fontSize: '13px', letterSpacing: '0.15em' }}>
                ODOSLAŤ PONUKU →
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '80px 0', background: 'var(--surface)', borderTop: '1px solid var(--surface-2)', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '12px' }}>POSTUP</p>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: 'var(--ghost)', marginBottom: '56px', letterSpacing: '0.04em' }}>AKO TO FUNGUJE</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ padding: '32px 28px', background: 'var(--void)', border: '1px solid var(--surface-2)', position: 'relative' }}
              >
                <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '64px', lineHeight: 1, color: 'rgba(250,93,41,0.12)', marginBottom: '8px' }}>{step.num}</p>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', lineHeight: 1.6, color: 'var(--dim)' }}>{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <span style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Space Mono, monospace', fontSize: '18px', color: 'var(--surface-2)', zIndex: 2 }}>→</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '12px' }}>PREČO MY</p>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: 'var(--ghost)', marginBottom: '48px', letterSpacing: '0.04em' }}>FÉROVÝ VÝKUP</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {WHY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ padding: '28px 24px', background: 'var(--surface)', border: '1px solid var(--surface-2)' }}
              >
                <div style={{ fontSize: '28px', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', lineHeight: 1.6, color: 'var(--dim)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICE GUIDE ─── */}
      <section style={{ padding: '80px 0', background: 'var(--surface)', borderTop: '1px solid var(--surface-2)', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '12px' }}>ORIENTAČNÉ CENY</p>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: 'var(--ghost)', marginBottom: '8px', letterSpacing: '0.04em' }}>CENNÍK VÝKUPU</h2>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: 'var(--dim)', marginBottom: '40px', letterSpacing: '0.1em' }}>Platíme 75–85% trhovej hodnoty. Ceny sa aktualizujú podľa trhu.</p>

          <div style={{ border: '1px solid var(--surface-2)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px', background: 'var(--void)', borderBottom: '1px solid var(--surface-2)', padding: '12px 24px' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)' }}>KARTA</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--dim)' }}>STAV / GRADE</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--orange)' }}>VÝKUPNÁ CENA</span>
            </div>
            {PRICE_GUIDE.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 160px 160px',
                  padding: '16px 24px',
                  borderBottom: i < PRICE_GUIDE.length - 1 ? '1px solid var(--surface-2)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}
              >
                <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '14px', color: 'var(--ghost)' }}>{row.card}</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: row.grade.includes('PSA') ? 'var(--gold)' : 'var(--dim)' }}>{row.grade}</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>{row.price}</span>
              </motion.div>
            ))}
          </div>

          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', marginTop: '16px', letterSpacing: '0.1em' }}>
            * Finálna cena závisí od presného stavu karty a aktuálneho trhu. Nemáš tu svoju kartu? Pošli nám ponuku — hodnotíme všetko.
          </p>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '100px 48px', textAlign: 'center', background: 'var(--void)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 5vw, 80px)', color: 'var(--ghost)', letterSpacing: '0.04em', marginBottom: '16px' }}>
            PRIPRAVENÝ PREDAŤ?
          </h2>
          <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '16px', color: 'var(--dim)', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px' }}>
            Formulár ti zaberie 2 minúty. Odpovedáme do 24 hodín s konkrétnou cenovou ponukou.
          </p>
          <Link href="/vykup/formular">
            <button className="btn-primary" style={{ padding: '20px 60px', fontSize: '14px', letterSpacing: '0.15em' }}>
              ODOSLAŤ PONUKU →
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
    </>
  )
}
