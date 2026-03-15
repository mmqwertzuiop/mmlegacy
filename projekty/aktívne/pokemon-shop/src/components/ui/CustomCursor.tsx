'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: 0, y: 0 })
  const mousePos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const magnetRef = useRef<{ el: HTMLElement; rect: DOMRect } | null>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const MAGNETIC_THRESHOLD = 80
    const MAGNETIC_PULL = 0.38

    const move = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      dot.style.left = e.clientX + 'px'
      dot.style.top = e.clientY + 'px'

      // Check magnetic elements
      let found = false
      document.querySelectorAll('[data-magnetic], .btn-primary, button:not([disabled])').forEach(el => {
        const rect = (el as HTMLElement).getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
        if (dist < MAGNETIC_THRESHOLD) {
          magnetRef.current = { el: el as HTMLElement, rect }
          found = true

          // Pull element toward cursor
          const dx = (e.clientX - cx) * MAGNETIC_PULL
          const dy = (e.clientY - cy) * MAGNETIC_PULL
          ;(el as HTMLElement).style.transform = `translate(${dx}px, ${dy}px)`
          ;(el as HTMLElement).style.transition = 'transform 0.2s ease'

          ring.classList.add('magnetic')
          dot.classList.add('magnetic')
        } else {
          // Reset element if not hovered
          if (magnetRef.current?.el === el) {
            ;(el as HTMLElement).style.transform = 'translate(0,0)'
            magnetRef.current = null
          }
        }
      })

      if (!found) {
        ring.classList.remove('magnetic')
        dot.classList.remove('magnetic')
      }
    }

    const animate = () => {
      // If near a magnetic element, snap ring to element center
      if (magnetRef.current) {
        const { rect } = magnetRef.current
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        ringPos.current.x += (cx - ringPos.current.x) * 0.18
        ringPos.current.y += (cy - ringPos.current.y) * 0.18
      } else {
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12
      }
      ring.style.left = ringPos.current.x + 'px'
      ring.style.top = ringPos.current.y + 'px'
      rafRef.current = requestAnimationFrame(animate)
    }

    const hover = (e: Event) => {
      const el = e.currentTarget as HTMLElement
      if (!el.closest('[data-magnetic], .btn-primary')) {
        dot.classList.add('hovering')
        ring.classList.add('hovering')
      }
    }
    const unhover = (e: Event) => {
      const el = e.currentTarget as HTMLElement
      // Reset magnetic pull on leave
      el.style.transform = 'translate(0,0)'
      dot.classList.remove('hovering')
      ring.classList.remove('hovering')
      ring.classList.remove('magnetic')
      dot.classList.remove('magnetic')
      magnetRef.current = null
    }

    document.addEventListener('mousemove', move)
    rafRef.current = requestAnimationFrame(animate)

    const attachHover = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        el.addEventListener('mouseenter', hover)
        el.addEventListener('mouseleave', unhover)
      })
    }
    attachHover()
    const observer = new MutationObserver(attachHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  )
}
