'use client'

import type { Category } from '@/types/shop'

interface CategoryNavProps {
  active: Category | 'all'
  onChange: (cat: Category | 'all') => void
}

const CATEGORIES: { value: Category | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'Vsetko', icon: '🎴' },
  { value: 'booster-box', label: 'Booster Boxy', icon: '📦' },
  { value: 'balicky', label: 'Balicky', icon: '🃏' },
  { value: 'psa-graded', label: 'PSA Graded', icon: '🏆' },
  { value: 'singles', label: 'Singles', icon: '⭐' },
  { value: 'accessories', label: 'Accessories', icon: '🛡️' },
]

export function CategoryNav({ active, onChange }: CategoryNavProps) {
  return (
    <div
      className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide"
      role="tablist"
      aria-label="Kategorie produktov"
    >
      {CATEGORIES.map(({ value, label, icon }) => {
        const isActive = active === value
        return (
          <button
            key={value}
            role="tab"
            aria-selected={isActive}
            data-testid={`category-tab-${value}`}
            onClick={() => onChange(value)}
            className={`
              flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium
              transition-all duration-150 whitespace-nowrap
              ${
                isActive
                  ? 'bg-[#f5c842]/15 text-[#f5c842] border border-[#f5c842]/40'
                  : 'bg-transparent text-[#64748b] border border-transparent hover:text-[#e2e8f0] hover:bg-[#1e1e2e]'
              }
            `}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </button>
        )
      })}
    </div>
  )
}
