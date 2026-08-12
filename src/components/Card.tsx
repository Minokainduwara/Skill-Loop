import type { CSSProperties, ReactNode } from 'react'
import { C, SHADOW } from './tokens'

export function Card({
  children,
  style,
  hover,
  onClick,
  pad = 22,
}: {
  children: ReactNode
  style?: CSSProperties
  hover?: boolean
  onClick?: () => void
  pad?: number
}) {
  return (
    <div
      onClick={onClick}
      className={hover ? 'sl-hover' : undefined}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: pad,
        boxShadow: SHADOW.card,
        minWidth: 0,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
