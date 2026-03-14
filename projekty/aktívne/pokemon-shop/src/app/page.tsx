'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import CountdownTimer from '@/components/ui/CountdownTimer'
import MysteryBoxCard from '@/components/ui/MysteryBoxCard'
import ProductCard from '@/components/ui/ProductCard'
import { PRODUCTS, MYSTERY_BOX_TIERS, MOCK_LEADERBOARD } from '@/data/products'

const HERO_CARDS = [
  { url: 'https://images.pokemontcg.io/sv3pt5/199_hires.png', name: 'Charizard ex SIR' },
  { url: 'https://images.pokemontcg.io/swsh7/215_hires.png', name: 'Umbreon VMAX Alt Art' },
  { url: 'https://images.pokemontcg.io/swsh4/188_hires.png', name: 'Pikachu VMAX Rainbow' },
  { url: 'https://images.pokemontcg.io/swsh7/218_hires.png', name: 'Rayquaza VMAX Alt Art' },
  { url: 'https://images.pokemontcg.io/swsh12/186_hires.png', name: 'Giratina V Full Art' },
  { url: 'https://images.pokemontcg.io/sv1/252_hires.png', name: 'Koraidon ex' },
]

// Fan positions — each card offset from center of container
const POS = [
  { x: -270, y: 70,  r: -26 },
  { x: -155, y: 22,  r: -14 },
  { x:  -45, y: -8,  r:  -3 },
  { x:   70, y: -8,  r:   8 },
  { x:  180, y: 22,  r:  19 },
  { x:  290, y: 70,  r:  30 },
]

const CARD_W = 178
const CARD_H = 249

function HeroCardFan() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({
      x: (e.clientX - cx) / (rect.width / 2),
      y: (e.clientY - cy) / (rect.height / 2),
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        height: '500px',
        width: '100%',
        overflow: 'visible',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '250px',
        background: 'radial-gradient(ellipse at center bottom, rgba(250,93,41,0.22) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Cards */}
      {HERO_CARDS.map((card, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: -700, rotate: 0, opacity: 0 }}
          animate={{
            x: POS[i].x,
            y: POS[i].y,
            rotate: POS[i].r,
            opacity: 1,
          }}
          transition={{
            delay: 0.15 + i * 0.13,
            duration: 1.0,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: POS[i].y - 32,
            scale: 1.12,
            rotate: POS[i].r * 0.4,
            zIndex: 30,
            transition: { duration: 0.2 },
          }}
          onHoverStart={() => setHovered(i)}
          onHoverEnd={() => setHovered(null)}
          style={{
            position: 'absolute',
            left: `calc(50% - ${CARD_W / 2}px)`,
            top: `calc(50% - ${CARD_H / 2}px)`,
            width: `${CARD_W}px`,
            height: `${CARD_H}px`,
            zIndex: hovered === i ? 30 : i + 1,
            cursor: 'none',
            transformOrigin: 'center center',
            filter: hovered === i
              ? 'drop-shadow(0 28px 56px rgba(250,93,41,0.6)) drop-shadow(0 0 20px rgba(250,93,41,0.3))'
              : hovered !== null
              ? 'brightness(0.65)'
              : 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))',
          }}
        >
          {/* Inner wrapper — 3D perspective tilt from mouse */}
          <div style={{
            width: '100%',
            height: '100%',
            transform: `perspective(900px) rotateY(${tilt.x * 14}deg) rotateX(${-tilt.y * 10}deg)`,
            transition: hovered !== null ? 'transform 0.08s ease' : 'transform 0.4s ease',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <Image
              src={card.url}
              alt={card.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="180px"
              priority={i < 3}
            />
            {/* Dynamic holo shimmer responding to tilt */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${115 + tilt.x * 20}deg, transparent 0%, rgba(255,210,110,${0.18 + Math.abs(tilt.x) * 0.15}) 35%, rgba(100,200,255,${0.18 + Math.abs(tilt.y) * 0.15}) 65%, transparent 100%)`,
              backgroundSize: '200% 200%',
              animation: `holo ${2.5 + i * 0.4}s linear infinite`,
              mixBlendMode: 'color-dodge',
              pointerEvents: 'none',
            }} />
            {/* Edge highlight on tilt */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${135 + tilt.x * 45}deg, rgba(255,255,255,${0.04 + Math.abs(tilt.x) * 0.06}) 0%, transparent 50%)`,
              pointerEvents: 'none',
            }} />
          </div>
        </motion.div>
      ))}

      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 13 + 5) % 100}%`,
              animationDuration: `${3.5 + (i * 1.1) % 3.5}s`,
              animationDelay: `${(i * 0.6) % 4}s`,
              width: i % 3 === 0 ? '3px' : '2px',
              height: i % 3 === 0 ? '3px' : '2px',
              background: i % 2 === 0 ? 'var(--orange)' : 'var(--gold)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

const FEATURED = PRODUCTS.filter(p => [
  'psa-10-umbreon-vmax-alt-art',
  'psa-9-charizard-ex-sir-obsidian',
  'single-umbreon-vmax-alt-art',
  'sv-prismatic-evolutions-booster-box',
].includes(p.slug))

const LOYALTY_LEVELS = [
  { name: 'Bronze', xp: '0', color: '#CD7F32' },
  { name: 'Silver', xp: '5K', color: '#C0C0C0' },
  { name: 'Gold', xp: '15K', color: '#FFD700' },
  { name: 'Platinum', xp: '35K', color: '#E5E4E2' },
  { name: 'Diamond', xp: '80K+', color: '#B9F2FF' },
]

export default function Home() {
  const userXP = 0
  const maxXP = 5000
  const xpPercent = 0

  return (
    <div style={{ background: 'var(--void)' }}>

      {/* ─── HERO ─── */}
      <section style={{
        position: 'relative',
        minHeight: 'auto',
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
        background: 'var(--void)',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--surface-2) 1px, transparent 1px), linear-gradient(90deg, var(--surface-2) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px 48px 60px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '24px',
          alignItems: 'center',
        }}>
          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.4em', color: 'var(--orange)', marginBottom: '20px', textTransform: 'uppercase' }}>
              MM LEGACY — PRÉMIOVÝ TCG SHOP
            </p>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(70px, 8vw, 120px)',
              lineHeight: 0.92,
              color: 'var(--ghost)',
              letterSpacing: '0.02em',
              marginBottom: '28px',
            }}>
              ZBIERAJ<br />
              <span style={{ color: 'var(--orange)' }}>LEGENDY.</span><br />
              VLASTNI<br />
              HISTÓRIU.
            </h1>
            <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '17px', lineHeight: 1.7, color: 'var(--dim)', maxWidth: '440px', marginBottom: '40px' }}>
              MM Legacy je prémiový Pokemon TCG shop pre skutočných zberateľov. Boostery, graded karty a mystery boxy — všetko na jednom mieste.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/shop">
                <button className="btn-primary" style={{ padding: '16px 36px', fontSize: '12px', letterSpacing: '0.12em' }}>
                  OBJAVIŤ KOLEKCIU
                </button>
              </Link>
              <Link href="/mystery-boxy">
                <button style={{
                  padding: '16px 36px', fontSize: '12px',
                  fontFamily: 'Space Mono, monospace', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  border: '1px solid var(--surface-2)', color: 'var(--ghost)',
                  background: 'transparent', cursor: 'none',
                }}>
                  MYSTERY BOXY
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex', gap: '40px', marginTop: '48px', paddingTop: '32px',
              borderTop: '1px solid var(--surface-2)',
            }}>
              {[
                { value: '51+', label: 'Produktov' },
                { value: '100%', label: 'Originálne' },
                { value: 'PSA', label: 'Certifikované' },
              ].map((stat, i) => (
                <div key={i}>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '26px', fontWeight: 700, color: 'var(--orange)', lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Cards fan — shifted left to visually center across the page */}
          <div style={{ position: 'relative', marginLeft: '-80px' }}>
            <HeroCardFan />
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
          background: 'linear-gradient(transparent, var(--void))',
          pointerEvents: 'none',
        }} />
      </section>

      {/* ─── TRENDING TICKER ─── */}
      <div style={{ overflow: 'hidden', background: 'var(--surface)', borderTop: '1px solid var(--surface-2)', borderBottom: '1px solid var(--surface-2)', padding: '11px 0' }}>
        <div style={{ display: 'flex', gap: '64px', animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {[
            { name: 'Charizard ex SIR PSA 10', price: '400€+', color: 'var(--orange)' },
            { name: 'Umbreon VMAX Alt Art PSA 10', price: '900€+', color: 'var(--gold)' },
            { name: 'Prismatic Evolutions Booster Box', price: '179,99€', color: 'var(--green)' },
            { name: 'Rayquaza VMAX Alt Art PSA 9', price: '550€+', color: 'var(--blue)' },
            { name: 'Pikachu VMAX Rainbow PSA 10', price: '350€+', color: 'var(--gold)' },
            { name: 'Giratina V Full Art', price: '149,99€', color: 'var(--purple)' },
            { name: 'Evolving Skies Booster Box', price: '289,99€', color: 'var(--orange)' },
            { name: 'Charizard ex SIR PSA 10', price: '400€+', color: 'var(--orange)' },
            { name: 'Umbreon VMAX Alt Art PSA 10', price: '900€+', color: 'var(--gold)' },
            { name: 'Prismatic Evolutions Booster Box', price: '179,99€', color: 'var(--green)' },
            { name: 'Rayquaza VMAX Alt Art PSA 9', price: '550€+', color: 'var(--blue)' },
            { name: 'Pikachu VMAX Rainbow PSA 10', price: '350€+', color: 'var(--gold)' },
            { name: 'Giratina V Full Art', price: '149,99€', color: 'var(--purple)' },
            { name: 'Evolving Skies Booster Box', price: '289,99€', color: 'var(--orange)' },
          ].map((item, i) => (
            <span key={i} style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--dim)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: item.color, fontSize: '8px' }}>▶</span>
              <span style={{ color: 'var(--ghost)' }}>{item.name}</span>
              <span style={{ color: item.color }}>{item.price}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── TRUST BADGES ─── */}
      <section style={{ padding: '28px 0', background: 'var(--void)', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[
            { icon: '✓', label: 'OVERENÁ AUTENTICKOSŤ', sub: 'Každý produkt garantovaný' },
            { icon: '⚡', label: 'RÝCHLE DORUČENIE', sub: '1–3 pracovné dni' },
            { icon: '🔒', label: 'BEZPEČNÁ PLATBA', sub: 'SSL šifrované transakcie' },
            { icon: '↩', label: '14-DŇOVÝ RETURN', sub: 'Bez otázok' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '18px', color: 'var(--orange)' }}>{b.icon}</span>
              <div>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', fontWeight: 700, color: 'var(--ghost)', letterSpacing: '0.1em' }}>{b.label}</p>
                <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '12px', color: 'var(--dim)', marginTop: '2px' }}>{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COUNTDOWN ─── */}
      <section style={{ padding: '60px 0', background: 'var(--surface)', borderTop: '1px solid var(--surface-2)', borderBottom: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px', textAlign: 'center' }}>
          <CountdownTimer />
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', marginTop: '20px', color: 'var(--dim)', letterSpacing: '0.1em' }}>
            Prismatic Evolutions Booster Box — limitovaný drop
          </p>
        </div>
      </section>

      {/* ─── FEATURED ─── */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px' }}>
              <div>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '8px', textTransform: 'uppercase' }}>VÝBER EDITOROV</p>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 5vw, 72px)', color: 'var(--ghost)', lineHeight: 1 }}>FEATURED</h2>
              </div>
              <Link href="/shop" style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--dim)', textDecoration: 'none' }}>
                ZOBRAZIŤ VŠETKO →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {FEATURED.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section style={{ padding: '80px 0', background: 'var(--surface)', borderTop: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--orange)', marginBottom: '8px', textTransform: 'uppercase' }}>KATEGÓRIE</p>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 5vw, 72px)', color: 'var(--ghost)', lineHeight: 1, marginBottom: '48px' }}>ČOMU SA VENUJEME</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { href: '/shop/booster-boxy', title: 'BOOSTER BOXY', desc: 'Každý box je nová šanca. Originálne zapečatené, overené zdroje.', img: 'https://images.pokemontcg.io/sv3pt5/199_hires.png', count: '10 boxov' },
                { href: '/shop/graded', title: 'PSA GRADED', desc: 'Certifikovaná hodnota uzatvorená v slabe. Investičná kvalita.', img: 'https://images.pokemontcg.io/swsh7/215_hires.png', count: '10 graded' },
                { href: '/shop/singles', title: 'SINGLE KARTY', desc: 'Konkrétna karta, hneď, bez náhody. Rare & Ultra Rare only.', img: 'https://images.pokemontcg.io/swsh7/218_hires.png', count: '20+ singles' },
              ].map((cat, i) => (
                <Link key={i} href={cat.href} style={{ textDecoration: 'none', display: 'block', aspectRatio: '4/3', background: 'var(--surface-2)', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                >
                  <Image src={cat.img} alt={cat.title} fill style={{ objectFit: 'cover', opacity: 0.3, transition: 'opacity 0.3s' }} sizes="33vw" />
                  <div style={{ position: 'absolute', inset: 0, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(transparent 30%, rgba(8,8,8,0.92))' }}>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--orange)', marginBottom: '4px' }}>{cat.count}</p>
                    <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: 'var(--ghost)', marginBottom: '8px' }}>{cat.title}</h3>
                    <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '13px', color: 'var(--dim)' }}>{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── MYSTERY BOXY ─── */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--purple)', marginBottom: '8px', textTransform: 'uppercase' }}>GAMIFIED UNBOXING</p>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 6vw, 80px)', color: 'var(--ghost)', lineHeight: 1, marginBottom: '16px' }}>MYSTERY BOXY</h2>
            <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '16px', color: 'var(--dim)', maxWidth: '520px', margin: '0 auto' }}>
              Vyber si tier — my vyberieme obsah. Každý box je ručne zostavený z originálnych produktov.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {MYSTERY_BOX_TIERS.map(tier => (
              <MysteryBoxCard key={tier.id} tier={tier} compact />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/mystery-boxy">
              <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '12px', letterSpacing: '0.12em' }}>ZOBRAZIŤ DETAILY</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LOYALTY ─── */}
      <section style={{ padding: '80px 0', background: 'var(--surface)', borderTop: '1px solid var(--surface-2)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '8px', textTransform: 'uppercase' }}>VERNOSTNÝ PROGRAM</p>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 5vw, 72px)', color: 'var(--ghost)', lineHeight: 1, marginBottom: '24px' }}>
                  COLLECTOR&apos;S<br />CLUB
                </h2>
                <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '16px', lineHeight: 1.7, color: 'var(--dim)', marginBottom: '32px' }}>
                  Každý nákup ťa posúva bližšie k legende. Zarábaj XP body, odomykaj odmeny a staň sa legendárnym zberateľom.
                </p>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: 'var(--ghost)', marginBottom: '32px' }}>
                  <span style={{ color: 'var(--orange)' }}>10 XP</span> za každé 1€ utratené
                </p>
                <div style={{ padding: '24px', background: 'var(--surface-2)', border: '1px solid var(--surface)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'var(--ghost)' }}>DEMO LEVEL</span>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>{userXP.toLocaleString()} / {maxXP.toLocaleString()} XP</span>
                  </div>
                  <div style={{ height: '4px', width: '100%', background: 'var(--surface)', borderRadius: 0 }}>
                    <div style={{ height: '100%', width: `${xpPercent}%`, background: 'var(--gold)', transition: 'width 1s ease' }} />
                  </div>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', marginTop: '8px', color: 'var(--dim)' }}>Zaregistruj sa a začni zbierať XP</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {LOYALTY_LEVELS.map((level, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                    background: i === 0 ? `${level.color}12` : 'var(--surface-2)',
                    border: `1px solid ${i === 0 ? level.color + '40' : 'transparent'}`,
                  }}>
                    <div style={{
                      width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${level.color}20`, color: level.color,
                      fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', flexShrink: 0,
                    }}>
                      {level.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 700, color: level.color }}>{level.name.toUpperCase()} COLLECTOR</p>
                      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>od {level.xp} XP</p>
                    </div>
                    {i === 0 && (
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', padding: '2px 8px', background: level.color, color: '#000' }}>TVOJ LEVEL</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── LEADERBOARD ─── */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '8px', textTransform: 'uppercase' }}>TOP ZBERATELIA</p>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 5vw, 72px)', color: 'var(--ghost)', lineHeight: 1, marginBottom: '12px' }}>WALL OF LEGENDS</h2>
              <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '15px', color: 'var(--dim)' }}>Náš leaderboard sleduje top zberateľov MM Legacy v reálnom čase.</p>
            </div>
            <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {MOCK_LEADERBOARD.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '24px', padding: '16px 20px',
                    background: i === 0 ? `${entry.level_color}10` : 'var(--surface)',
                    border: `1px solid ${i === 0 ? entry.level_color + '30' : 'var(--surface-2)'}`,
                  }}
                >
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '22px', fontWeight: 700, width: '40px', textAlign: 'center', flexShrink: 0, color: i === 0 ? 'var(--gold)' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--dim)' }}>
                    #{entry.rank}
                  </span>
                  <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', color: entry.level_color, fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', flexShrink: 0 }}>
                    {entry.username[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Inter Tight, sans-serif', fontWeight: 700, color: 'var(--ghost)', fontSize: '14px' }}>{entry.username}</p>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: entry.level_color }}>{entry.level}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, color: 'var(--ghost)', fontSize: '16px' }}>{entry.points.toLocaleString()}</p>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--dim)' }}>XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '100px 0', position: 'relative', overflow: 'hidden', background: 'var(--surface)', borderTop: '1px solid var(--surface-2)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(250,93,41,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '700px', margin: '0 auto', padding: '0 48px' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(56px, 7vw, 96px)', lineHeight: 0.92, color: 'var(--ghost)', marginBottom: '24px' }}>
              PRIPRAVENÝ<br /><span style={{ color: 'var(--orange)' }}>ZAČAŤ?</span>
            </h2>
            <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: '18px', color: 'var(--dim)', marginBottom: '40px' }}>
              Zaregistruj sa a získaj <span style={{ color: 'var(--orange)' }}>+500 XP</span> bonus na prvý nákup.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register">
                <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '12px', letterSpacing: '0.12em' }}>ZAREGISTROVAŤ SA ZADARMO</button>
              </Link>
              <Link href="/shop">
                <button style={{
                  padding: '16px 40px', fontSize: '12px',
                  fontFamily: 'Space Mono, monospace', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  border: '1px solid var(--surface-2)', color: 'var(--ghost)',
                  background: 'transparent', cursor: 'none',
                }}>
                  PREHLIADAŤ SHOP
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
