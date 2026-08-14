import type { CSSProperties, ReactNode } from 'react'

export function Grid({
  children,
  min = 260,
  gap = 16,
  style,
}: {
  children: ReactNode
  min?: number
  gap?: number
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))`,
        gap,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
