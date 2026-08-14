import type { CSSProperties, ReactNode } from 'react'
import { C } from './tokens'

export function SectionTitle({
  title,
  subtitle,
  action,
  style,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 14,
        marginBottom: 16,
        ...style,
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: -0.3, color: C.text }}>
          {title}
        </h2>
        {subtitle && <p style={{ margin: '5px 0 0', fontSize: 13.5, color: C.muted }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
