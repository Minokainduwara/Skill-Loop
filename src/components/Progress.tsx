import { C } from './tokens'

export function Progress({
  value,
  height = 8,
  gradient = 'linear-gradient(90deg, #4F46E5, #14B8A6)',
  track = C.subtle,
  animate = true,
}: {
  value: number
  height?: number
  gradient?: string
  track?: string
  animate?: boolean
}) {
  return (
    <div style={{ height, background: track, borderRadius: 999, overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          height: '100%',
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: gradient,
          borderRadius: 999,
          transformOrigin: 'left',
          animation: animate ? 'sl-grow-x .9s cubic-bezier(.22,1,.36,1) both' : undefined,
        }}
      />
    </div>
  )
}

export function MetricBar({
  label,
  value,
  suffix = '%',
  color = C.primary,
}: {
  label: string
  value: number
  suffix?: string
  color?: string
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, color: C.text, fontWeight: 800 }}>
          {value}{suffix}
        </span>
      </div>
      <Progress value={value} gradient={`linear-gradient(90deg, ${color}, ${color}bb)`} />
    </div>
  )
}

export function CircleProgress({
  value,
  size = 84,
  stroke = 8,
  strokeColor,
  color,
  label,
}: {
  value: number
  size?: number
  stroke?: number
  strokeColor?: string
  color?: string
  label?: string
}) {
  const resolvedColor = strokeColor ?? color ?? C.primary
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  const id = 'g' + Math.round(value) + Math.round(size)
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={resolvedColor} />
            <stop offset="100%" stopColor={C.accent} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.subtle} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: size * 0.26, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>
          {value}%
        </span>
        {label && <span style={{ fontSize: 10, color: C.faint, fontWeight: 700 }}>{label}</span>}
      </div>
    </div>
  )
}
