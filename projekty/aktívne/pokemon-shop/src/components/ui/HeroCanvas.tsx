'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  size: number
  alpha: number
  colorR: number; colorG: number; colorB: number
  isCard: boolean
  cardW: number; cardH: number
  rotation: number; rotSpeed: number
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)
    let mouseX = W / 2
    let mouseY = H / 2
    const FOCAL = 650

    // Color palette: orange, gold, white
    const PALETTE = [
      [250, 93, 41],   // orange
      [245, 158, 11],  // gold
      [240, 240, 240], // white
      [250, 93, 41],   // orange (higher chance)
      [245, 158, 11],  // gold (higher chance)
    ]

    const particles: Particle[] = Array.from({ length: 130 }, () => {
      const col = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      const isCard = Math.random() < 0.14
      const cardW = Math.random() * 28 + 12
      return {
        x: (Math.random() - 0.5) * 1400,
        y: (Math.random() - 0.5) * 900,
        z: Math.random() * 900,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.2,
        vz: Math.random() * 0.6 + 0.1,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.55 + 0.08,
        colorR: col[0], colorG: col[1], colorB: col[2],
        isCard,
        cardW,
        cardH: cardW * 1.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
      }
    })

    let camX = 0
    let camY = 0
    let raf: number

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Smooth camera parallax from mouse
      camX += ((mouseX - W / 2) * 0.018 - camX) * 0.04
      camY += ((mouseY - H / 2) * 0.012 - camY) * 0.04

      // Sort back-to-front
      particles.sort((a, b) => b.z - a.z)

      for (const p of particles) {
        // Move
        p.x += p.vx; p.y += p.vy; p.z += p.vz
        p.rotation += p.rotSpeed

        // Loop z
        if (p.z > 900) { p.z = 0; p.x = (Math.random() - 0.5) * 1400; p.y = (Math.random() - 0.5) * 900 }
        // Bounce edges
        if (Math.abs(p.x) > 900) p.vx *= -1
        if (Math.abs(p.y) > 700) p.vy *= -1

        const scale = FOCAL / (FOCAL + p.z)
        const sx = (p.x + camX) * scale + W / 2
        const sy = (p.y + camY) * scale + H / 2

        if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) continue

        const a = p.alpha * scale * 0.85

        ctx.save()
        ctx.globalAlpha = Math.min(a, 0.7)

        if (p.isCard) {
          ctx.translate(sx, sy)
          ctx.rotate(p.rotation)
          const w = p.cardW * scale
          const h = p.cardH * scale
          ctx.strokeStyle = `rgba(${p.colorR},${p.colorG},${p.colorB},0.7)`
          ctx.lineWidth = 0.6
          ctx.strokeRect(-w / 2, -h / 2, w, h)
          ctx.fillStyle = `rgba(${p.colorR},${p.colorG},${p.colorB},0.06)`
          ctx.fillRect(-w / 2, -h / 2, w, h)
          // Inner shine line
          ctx.strokeStyle = `rgba(255,255,255,0.15)`
          ctx.lineWidth = 0.3
          ctx.beginPath()
          ctx.moveTo(-w / 2 + w * 0.2, -h / 2 + 2)
          ctx.lineTo(-w / 2 + w * 0.5, h / 2 - 2)
          ctx.stroke()
        } else {
          const r = Math.max(0.3, p.size * scale)
          ctx.beginPath()
          ctx.arc(sx, sy, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${p.colorR},${p.colorG},${p.colorB},${a.toFixed(2)})`
          ctx.fill()
        }

        ctx.restore()
      }

      // Draw connection lines between close particles
      ctx.save()
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const scaleA = FOCAL / (FOCAL + a.z)
          const scaleB = FOCAL / (FOCAL + b.z)
          const ax = (a.x + camX) * scaleA + W / 2
          const ay = (a.y + camY) * scaleA + H / 2
          const bx = (b.x + camX) * scaleB + W / 2
          const by = (b.y + camY) * scaleB + H / 2
          const dist = Math.hypot(ax - bx, ay - by)
          if (dist < 80) {
            const lineAlpha = (1 - dist / 80) * 0.12
            ctx.beginPath()
            ctx.strokeStyle = `rgba(250,93,41,${lineAlpha.toFixed(3)})`
            ctx.lineWidth = 0.4
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
            ctx.stroke()
          }
        }
      }
      ctx.restore()

      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
