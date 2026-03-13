interface RarityBadgeProps {
  rarity: string
  className?: string
}

const rarityConfig: Record<string, { label: string; color: string; bg: string }> = {
  'Special Illustration Rare': { label: 'SIR', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  'Alt Art': { label: 'ALT ART', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  'Rainbow Rare': { label: 'RAINBOW', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
  'Full Art': { label: 'FULL ART', color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
  'Full Art Trainer': { label: 'FA TRAINER', color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
  'Special Art Rare': { label: 'SAR', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  'Secret Rare': { label: 'SECRET', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  'VMAX Rare': { label: 'VMAX', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  'Special Card': { label: 'SPECIAL', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
}

export default function RarityBadge({ rarity, className = '' }: RarityBadgeProps) {
  const config = rarityConfig[rarity] || { label: rarity.toUpperCase(), color: '#666666', bg: 'rgba(102,102,102,0.15)' }

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-mono font-bold tracking-wider border ${className}`}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: config.color + '40',
      }}
    >
      {config.label}
    </span>
  )
}
