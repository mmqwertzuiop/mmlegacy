'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: 0, y: 0 })
  const mousePos = useRef({ x: 0, y: 0 })
  const rafRef  = useRef<number>(0)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // ── Move dot instantly, ring follows with lag ──────────────
    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      dot.style.left = e.clientX + 'px'
      dot.style.top  = e.clientY + 'px'
    }

    const animate = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.11
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.11
      ring.style.left = ringPos.current.x + 'px'
      ring.style.top  = ringPos.current.y + 'px'
      rafRef.current = requestAnimationFrame(animate)
    }

    // ── Hover state — only cursor changes, nothing else ────────
    const onEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      // Skip if it's inside an overlay/modal (those handle their own cursor)
      if (target.closest('[data-no-cursor-effect]')) return
      dot.classList.add('hovering')
      ring.classList.add('hovering')
    }

    const onLeave = () => {
      dot.classList.remove('hovering')
      ring.classList.remove('hovering')
    }

    // ── Attach hover listeners via delegation ─────────────────
    // Using event delegation instead of attaching to every element
    // avoids MutationObserver re-attachment storms and transform conflicts
    const onDocEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [data-cursor-hover], input, select, textarea, label')
      if (interactive && !interactive.closest('[data-no-cursor-effect]')) {
        dot.classList.add('hovering')
        ring.classList.add('hovering')
      } else {
        dot.classList.remove('hovering')
        ring.classList.remove('hovering')
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onDocEnter)
    rafRef.current = requestAnimationFrame(animate)

    // Hide cursor when leaving window
    const onLeaveDoc = () => { dot.style.opacity = '0'; ring.style.opacity = '0' }
    const onEnterDoc = () => { dot.style.opacity = '1'; ring.style.opacity = '1' }
    document.addEventListener('mouseleave', onLeaveDoc)
    document.addEventListener('mouseenter', onEnterDoc)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onDocEnter)
      document.removeEventListener('mouseleave', onLeaveDoc)
      document.removeEventListener('mouseenter', onEnterDoc)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot  hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  )
}
