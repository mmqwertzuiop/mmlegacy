'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }

    const hover = () => cursor.classList.add('hovering')
    const unhover = () => cursor.classList.remove('hovering')

    document.addEventListener('mousemove', move)

    const interactives = document.querySelectorAll('a, button, [data-cursor-hover]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', hover)
      el.addEventListener('mouseleave', unhover)
    })

    return () => {
      document.removeEventListener('mousemove', move)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', hover)
        el.removeEventListener('mouseleave', unhover)
      })
    }
  }, [])

  return <div ref={cursorRef} className="cursor hidden md:block" />
}
