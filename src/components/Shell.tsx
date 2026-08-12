import type { CSSProperties, ReactNode } from 'react'

export function Shell({
  children,
  width = 1180,
  style,
}: {
  children: ReactNode
  width?: number
  style?: CSSProperties
}) {
  return (
    <div style={{ maxWidth: width, margin: '0 auto', padding: '28px 20px 120px', ...style }}>
      {children}
    </div>
  )
}
