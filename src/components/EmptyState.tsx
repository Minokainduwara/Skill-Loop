import type { ReactNode } from 'react'
import { C } from './tokens'

export function EmptyState({
  emoji,
  title,
  text,
  action,
}: {
  emoji: ReactNode
  title: string
  text: string
  action?: ReactNode
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '64px 24px',
        background: C.surface,
        border: `1px dashed ${C.border}`,
        borderRadius: 20,
      }}
    >
      <div
        style={{
          width: 78,
          height: 78,
          borderRadius: 24,
          margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #EEF2FF, #F0FDFA)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 34,
        }}
      >
        {emoji}
      </div>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.text }}>{title}</h3>
      <p style={{ margin: '8px auto 20px', fontSize: 14, color: C.muted, maxWidth: 380, lineHeight: 1.6 }}>
        {text}
      </p>
      {action}
    </div>
  )
}
