import type { Page, Navigate } from '../types'
import { C, BRAND_GRADIENT, Logo } from './ui'

const NAV_ITEMS: { icon: string; label: string; page: Page; badge?: string }[] = [
  { icon: '📊', label: 'Dashboard', page: 'admin-dashboard' },
  { icon: '👥', label: 'Users', page: 'admin-users', badge: '3' },
  { icon: '💼', label: 'Jobs', page: 'admin-jobs' },
  { icon: '💳', label: 'Payments', page: 'admin-payments', badge: '5' },
  { icon: '📈', label: 'Analytics', page: 'admin-analytics' },
]

export default function AdminNav({
  currentPage,
  onNavigate,
}: {
  currentPage: Page
  onNavigate: Navigate
}) {
  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: '#0F172A',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Logo light size={18} />
        <div style={{ marginTop: 8, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
          Admin Panel
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.page
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className="sl-press"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '10px 12px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13.5,
                fontWeight: active ? 700 : 500,
                textAlign: 'left',
                marginBottom: 2,
                background: active ? `linear-gradient(90deg, ${C.primary}30, ${C.accent}18)` : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                borderLeft: active ? `2.5px solid ${C.primary}` : '2.5px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: '1px 7px',
                    borderRadius: 999,
                    background: C.error,
                    color: '#fff',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '14px 4px' }} />

        <button
          onClick={() => onNavigate('dashboard')}
          className="sl-press"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '10px 12px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 13.5,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.45)',
            background: 'transparent',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>↩</span>
          Logout
        </button>
      </nav>

      {/* Admin profile */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: BRAND_GRADIENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 800,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>Admin User</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 1 }}>Platform Manager</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
