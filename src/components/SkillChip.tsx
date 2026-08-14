import { C } from './tokens'

export function SkillChip({
  label,
  active,
  onClick,
  tone = 'default',
}: {
  label: string
  active?: boolean
  onClick?: () => void
  tone?: 'default' | 'accent'
}) {
  const base = tone === 'accent' ? C.accent : C.primary
  return (
    <span
      onClick={onClick}
      className="sl-press"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        cursor: onClick ? 'pointer' : 'default',
        color: active ? '#fff' : C.muted,
        background: active ? base : C.surface,
        border: `1px solid ${active ? base : C.border}`,
        boxShadow: active ? '0 6px 16px rgba(79,70,229,0.2)' : 'none',
        userSelect: 'none',
      }}
    >
      {active && <span style={{ fontSize: 11 }}>✓</span>}
      {label}
    </span>
  )
}
