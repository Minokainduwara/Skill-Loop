import type { CSSProperties } from 'react'
import { C } from './tokens'

export function Divider({ label, style }: { label?: string; style?: CSSProperties }) {
  if (!label)
    return <div style={{ height: 1, background: C.border, margin: '20px 0', ...style }} />
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '22px 0', ...style }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <span style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, letterSpacing: 1 }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  )
}
