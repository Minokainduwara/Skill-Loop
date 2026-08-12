import type { ReactNode } from 'react'
import { SHADOW } from './tokens'

const AV_TONES = [
  ['#EEF2FF', '#4338CA'],
  ['#CCFBF1', '#0F766E'],
  ['#FEF3C7', '#B45309'],
  ['#FCE7F3', '#BE185D'],
  ['#DCFCE7', '#15803D'],
  ['#E0E7FF', '#3730A3'],
]

export function Avatar({
  name,
  size = 44,
  ring,
  emoji,
}: {
  name: string
  size?: number
  ring?: boolean
  emoji?: ReactNode
}) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
  const idx = name.charCodeAt(0) % AV_TONES.length
  const [bg, fg] = AV_TONES[idx]
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: emoji ? size * 0.5 : size * 0.38,
        flexShrink: 0,
        border: ring ? '2.5px solid #fff' : undefined,
        boxShadow: ring ? SHADOW.md : undefined,
      }}
    >
      {emoji ?? initials}
    </div>
  )
}
