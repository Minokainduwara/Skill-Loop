import type { ReactNode } from 'react'
import { C } from './tokens'

export function InfoTile({
  icon,
  label,
  value,
  tone = C.primary,
}: {
  icon: ReactNode
  label: string
  value: string
  tone?: string
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 14,
        background: tone + '0D',
        border: `1px solid ${tone}22`,
      }}
    >
      <div style={{ fontSize: 18, marginBottom: 8, display: 'inline-flex' }}>{icon}</div>
      <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: C.text, marginTop: 3 }}>{value}</div>
    </div>
  )
}
