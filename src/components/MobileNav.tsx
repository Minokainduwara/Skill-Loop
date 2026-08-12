import type { NavProps, Page } from '../types'
import { C } from './ui'

const ITEMS: { key: Page; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Home', icon: '🏠' },
  { key: 'radar', label: 'Discover', icon: '📡' },
  { key: 'my-jobs', label: 'Jobs', icon: '💼' },
  { key: 'earnings', label: 'Earnings', icon: '💰' },
  { key: 'profile', label: 'Profile', icon: '👤' },
]

const HIDE: Page[] = ['landing', 'login', 'signup', 'onboarding']

export default function MobileNav({ onNavigate, currentPage }: NavProps) {
  if (HIDE.includes(currentPage)) return null
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 70,
        display: 'flex',
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(14px)',
        borderTop: `1px solid ${C.border}`,
        padding: '8px 4px 10px',
        boxShadow: '0 -6px 24px rgba(15,23,42,0.06)',
      }}
      className="sl-mobile-nav"
    >
      <style>{`@media (min-width: 860px) { .sl-mobile-nav { display: none !important } }`}</style>
      {ITEMS.map((it) => {
        const on = currentPage === it.key
        return (
          <button
            key={it.key}
            onClick={() => onNavigate(it.key)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '4px 0',
              color: on ? C.primary : C.faint,
            }}
          >
            <span style={{ fontSize: 18, filter: on ? 'none' : 'grayscale(0.6)' }}>{it.icon}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700 }}>{it.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
