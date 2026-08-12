import type { CSSProperties, ReactNode } from 'react'
import { C, SHADOW } from './tokens'

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'accent' | 'danger'

export function Btn({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  full,
  disabled,
  loading,
  style,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
  disabled?: boolean
  loading?: boolean
  style?: CSSProperties
  type?: 'button' | 'submit'
}) {
  const pads = { sm: '8px 14px', md: '11px 20px', lg: '15px 28px' }
  const fonts = { sm: 13, md: 14, lg: 16 }
  const skins: Record<BtnVariant, CSSProperties> = {
    primary: { background: C.primary, color: '#fff', border: '1px solid ' + C.primary, boxShadow: '0 6px 18px rgba(79,70,229,0.24)' },
    secondary: { background: C.surface, color: C.text, border: `1px solid ${C.border}`, boxShadow: SHADOW.sm },
    ghost: { background: 'transparent', color: C.primary, border: '1px solid transparent' },
    dark: { background: C.text, color: '#fff', border: '1px solid ' + C.text },
    accent: { background: C.accent, color: '#053B37', border: '1px solid ' + C.accent, boxShadow: '0 6px 18px rgba(20,184,166,0.25)' },
    danger: { background: '#FEF2F2', color: C.error, border: '1px solid #FECACA' },
  }
  const off = disabled || loading
  return (
    <button
      type={type}
      onClick={off ? undefined : onClick}
      disabled={off}
      className="sl-press"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: pads[size],
        fontSize: fonts[size],
        fontWeight: 700,
        fontFamily: 'inherit',
        borderRadius: 12,
        cursor: off ? 'not-allowed' : 'pointer',
        width: full ? '100%' : undefined,
        opacity: off ? 0.55 : 1,
        whiteSpace: 'nowrap',
        ...skins[variant],
        ...style,
      }}
    >
      {loading && (
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.4)',
            borderTopColor: '#fff',
            animation: 'sl-spin .7s linear infinite',
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </button>
  )
}
