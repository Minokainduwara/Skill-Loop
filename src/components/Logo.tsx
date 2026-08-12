import { C, BRAND_GRADIENT } from './tokens'

export function Logo({ light, size = 20 }: { light?: boolean; size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size * 1.7,
          height: size * 1.7,
          borderRadius: size * 0.5,
          background: BRAND_GRADIENT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: size * 0.85,
          boxShadow: '0 6px 16px rgba(79,70,229,0.3)',
          flexShrink: 0,
        }}
      >
        ⟳
      </div>
      <span style={{ fontSize: size, fontWeight: 800, letterSpacing: -0.5, color: light ? '#fff' : C.text }}>
        Skill<span style={{ color: light ? '#5EEAD4' : C.primary }}>Loop</span>
      </span>
    </div>
  )
}
