import type { ReactNode } from 'react'
import { C } from './tokens'
import { Card } from './Card'

export function StatCard({
  icon,
  label,
  value,
  delta,
  tone = C.primary,
  onClick,
}: {
  icon: string
  label: string
  value: string | number
  delta?: string
  tone?: string
  onClick?: () => void
}) {
  return (
    <Card hover={!!onClick} onClick={onClick} pad={20}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: tone + '15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          marginBottom: 14,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, color: C.text }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{label}</span>
        {delta && (
          <span style={{ fontSize: 11.5, fontWeight: 800, color: C.success }}>{delta}</span>
        )}
      </div>
    </Card>
  )
}

export function KPI({
  value,
  label,
  tone = '#fff',
}: {
  value: string
  label: string
  tone?: string
  children?: ReactNode
}) {
  return (
    <div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1, color: tone }}>{value}</div>
      <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.68)', fontWeight: 600, marginTop: 3 }}>
        {label}
      </div>
    </div>
  )
}
