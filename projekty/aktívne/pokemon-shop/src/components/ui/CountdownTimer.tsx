'use client'
import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetHours?: number
  label?: string
}

export default function CountdownTimer({ targetHours = 14, label = 'ĎALŠÍ DROP ZA' }: CountdownTimerProps) {
  const [time, setTime] = useState({ hours: targetHours, minutes: 32, seconds: 7 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = targetHours; minutes = 59; seconds = 59 }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [targetHours])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-headline text-2xl md:text-3xl tracking-[0.3em]" style={{ color: 'var(--dim)' }}>
        {label}
      </p>
      <div className="flex items-center gap-2 md:gap-4">
        {[
          { value: pad(time.hours), label: 'HOD' },
          { value: pad(time.minutes), label: 'MIN' },
          { value: pad(time.seconds), label: 'SEK' },
        ].map((unit, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-4">
            <div className="flex flex-col items-center">
              <span
                className="font-mono text-5xl md:text-7xl font-bold leading-none tabular-nums"
                style={{ color: 'var(--orange)' }}
              >
                {unit.value}
              </span>
              <span className="font-mono text-xs tracking-widest mt-1" style={{ color: 'var(--dim)' }}>
                {unit.label}
              </span>
            </div>
            {i < 2 && (
              <span className="font-mono text-4xl md:text-6xl font-bold" style={{ color: 'var(--dim)' }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
