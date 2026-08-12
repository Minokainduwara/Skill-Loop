import type { ReactNode } from 'react'
import { C } from './tokens'

export function PageHead({
  eyebrow,
  title,
  subtitle,
  actions,
  onBack,
  backLabel = 'Back',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
  onBack?: () => void
  backLabel?: string
}) {
  return (
    <div style={{ marginBottom: 26 }}>
      {onBack && (
        <button
          onClick={onBack}
          className="sl-press"
          style={{
            border: 'none',
            background: 'transparent',
            color: C.muted,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px 0',
            marginBottom: 10,
            fontFamily: 'inherit',
          }}
        >
          ← {backLabel}
        </button>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          {eyebrow && (
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: C.primary, marginBottom: 8 }}>
              {eyebrow}
            </div>
          )}
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: -0.6, color: C.text }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ margin: '8px 0 0', fontSize: 15, color: C.muted, maxWidth: 640, lineHeight: 1.6 }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
      </div>
    </div>
  )
}
