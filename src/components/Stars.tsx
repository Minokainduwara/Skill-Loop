import { C } from './tokens'

export function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <span style={{ fontSize: size, letterSpacing: 1, color: '#F59E0B' }}>
        {'★'.repeat(Math.round(rating))}
        <span style={{ color: '#E2E8F0' }}>{'★'.repeat(5 - Math.round(rating))}</span>
      </span>
      <span style={{ fontSize: size - 0.5, fontWeight: 700, color: C.text, marginLeft: 3 }}>
        {rating.toFixed(1)}
      </span>
    </span>
  )
}
