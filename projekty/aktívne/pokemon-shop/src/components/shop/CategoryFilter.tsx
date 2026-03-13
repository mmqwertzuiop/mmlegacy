'use client'

const categories = [
  { value: 'all', label: 'VŠETKO' },
  { value: 'booster-box', label: 'BOOSTER BOXY' },
  { value: 'psa-graded', label: 'PSA GRADED' },
  { value: 'singles', label: 'SINGLES' },
  { value: 'collection-box', label: 'COLLECTION' },
  { value: 'mystery-box', label: 'MYSTERY' },
]

interface CategoryFilterProps {
  category: string
  setCategory: (v: string) => void
  rarity: string
  setRarity: (v: string) => void
  rarities: string[]
  priceMax: number
  setPriceMax: (v: number) => void
}

export default function CategoryFilter({
  category, setCategory, rarity, setRarity, rarities, priceMax, setPriceMax
}: CategoryFilterProps) {
  return (
    <aside className="hidden md:block w-56 shrink-0">
      <div style={{ position: 'sticky', top: '80px' }}>
        {/* Categories */}
        <div className="mb-8">
          <h4 className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--orange)' }}>KATEGÓRIA</h4>
          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat.value}>
                <button
                  onClick={() => setCategory(cat.value)}
                  className="w-full text-left font-mono text-xs py-2 px-3 transition-premium"
                  style={{
                    color: category === cat.value ? 'var(--ghost)' : 'var(--dim)',
                    background: category === cat.value ? 'var(--surface-2)' : 'transparent',
                    borderLeft: category === cat.value ? '2px solid var(--orange)' : '2px solid transparent',
                  }}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Rarity */}
        {rarities.length > 0 && (
          <div className="mb-8">
            <h4 className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--orange)' }}>VZÁCNOSŤ</h4>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setRarity('all')}
                  className="w-full text-left font-mono text-xs py-2 px-3 transition-premium"
                  style={{
                    color: rarity === 'all' ? 'var(--ghost)' : 'var(--dim)',
                    background: rarity === 'all' ? 'var(--surface-2)' : 'transparent',
                    borderLeft: rarity === 'all' ? '2px solid var(--orange)' : '2px solid transparent',
                  }}
                >
                  VŠETKY
                </button>
              </li>
              {rarities.map(r => (
                <li key={r}>
                  <button
                    onClick={() => setRarity(r)}
                    className="w-full text-left font-mono text-xs py-2 px-3 transition-premium"
                    style={{
                      color: rarity === r ? 'var(--ghost)' : 'var(--dim)',
                      background: rarity === r ? 'var(--surface-2)' : 'transparent',
                      borderLeft: rarity === r ? '2px solid var(--orange)' : '2px solid transparent',
                    }}
                  >
                    {r.toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price range */}
        <div className="mb-8">
          <h4 className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--orange)' }}>MAX CENA</h4>
          <input
            type="range"
            min={1999}
            max={100000}
            step={1000}
            value={priceMax}
            onChange={e => setPriceMax(Number(e.target.value))}
            className="w-full accent-orange-500"
            style={{ accentColor: 'var(--orange)' }}
          />
          <p className="font-mono text-xs mt-2" style={{ color: 'var(--dim)' }}>
            do {(priceMax / 100).toFixed(0)} €
          </p>
        </div>
      </div>
    </aside>
  )
}
