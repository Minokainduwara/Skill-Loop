import { C, SHADOW } from './tokens'

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string; count?: number }[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        padding: 5,
        background: C.subtle,
        borderRadius: 14,
        overflowX: 'auto',
        marginBottom: 22,
      }}
      className="scrollbar-hide"
    >
      {tabs.map((t) => {
        const on = t.key === active
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className="sl-press"
            style={{
              flex: '1 0 auto',
              padding: '10px 18px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13.5,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              color: on ? C.text : C.muted,
              background: on ? C.surface : 'transparent',
              boxShadow: on ? SHADOW.sm : 'none',
            }}
          >
            {t.label}
            {t.count !== undefined && (
              <span
                style={{
                  marginLeft: 7,
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: 999,
                  background: on ? C.primary + '15' : '#E2E8F0',
                  color: on ? C.primary : C.muted,
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
