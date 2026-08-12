import type { CSSProperties, ReactNode } from 'react'
import { C } from './tokens'

export function Badge({
  children,
  color = C.primary,
  bg,
  style,
  dot,
  onClick,
}: {
  children: ReactNode
  color?: string
  bg?: string
  style?: CSSProperties
  dot?: boolean
  onClick?: () => void
}) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        color,
        background: bg ?? color + '15',
        border: `1px solid ${color}26`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {dot && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      )}
      {children}
    </span>
  )
}

export function matchTone(pct: number) {
  if (pct >= 90) return { color: '#15803D', bg: '#DCFCE7' }
  if (pct >= 80) return { color: '#B45309', bg: '#FEF3C7' }
  return { color: C.muted, bg: C.subtle }
}

export function MatchBadge({ pct, size = 'md' }: { pct: number; size?: 'sm' | 'md' }) {
  const t = matchTone(pct)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: size === 'sm' ? '3px 9px' : '5px 12px',
        borderRadius: 999,
        fontSize: size === 'sm' ? 11.5 : 13,
        fontWeight: 800,
        color: t.color,
        background: t.bg,
      }}
    >
      <span style={{ fontSize: size === 'sm' ? 10 : 11 }}>◆</span>
      {pct}% Match
    </span>
  )
}

const STATUS_TONES: Record<string, { color: string; bg: string }> = {
  'In Progress': { color: '#1D4ED8', bg: '#DBEAFE' },
  Pending: { color: '#B45309', bg: '#FEF3C7' },
  'Awaiting Review': { color: '#7C3AED', bg: '#EDE9FE' },
  Submitted: { color: '#7C3AED', bg: '#EDE9FE' },
  Completed: { color: '#15803D', bg: '#DCFCE7' },
  Cancelled: { color: '#B91C1C', bg: '#FEE2E2' },
  Open: { color: '#0F766E', bg: '#CCFBF1' },
}

export function StatusBadge({ status }: { status: string }) {
  const t = STATUS_TONES[status] ?? { color: C.muted, bg: C.subtle }
  return (
    <Badge dot color={t.color} bg={t.bg}>
      {status}
    </Badge>
  )
}

export function Verified({ label = 'Verified Student' }: { label?: string }) {
  return (
    <Badge color="#0E7490" bg="#CFFAFE">
      <span style={{ fontSize: 11 }}>✓</span> {label}
    </Badge>
  )
}
