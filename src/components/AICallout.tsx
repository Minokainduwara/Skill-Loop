import type { ReactNode } from 'react'
import { C, SHADOW } from './tokens'

export function AICallout({
  title,
  children,
  action,
  compact,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
  compact?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        padding: compact ? 14 : 18,
        borderRadius: 16,
        background: 'linear-gradient(120deg, #EEF2FF 0%, #F0FDFA 100%)',
        border: '1px solid #C7D2FE',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
          boxShadow: SHADOW.sm,
        }}
      >
        🤖
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: C.primaryDark, marginBottom: children ? 4 : 0 }}>
          {title}
        </div>
        {children && (
          <div style={{ fontSize: 13, color: '#4338CA', lineHeight: 1.6, opacity: 0.9 }}>{children}</div>
        )}
      </div>
      {action}
    </div>
  )
}
