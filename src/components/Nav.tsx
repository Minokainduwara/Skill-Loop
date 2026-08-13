import { useEffect, useRef, useState } from 'react'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { NavProps, Page } from '../types'
import { Avatar, Badge, Btn, C, Logo, SHADOW } from './ui'

function getNotificationVisuals(type: string) {
  switch (type) {
    case 'new_match':
      return { icon: '🔥', tone: '#FEF3C7' }
    case 'payment':
      return { icon: '💰', tone: '#DCFCE7' }
    case 'review':
      return { icon: '⭐', tone: '#FEF9C3' }
    case 'opportunity':
      return { icon: '🎯', tone: '#EEF2FF' }
    case 'system':
      return { icon: '⚙️', tone: '#F3F4F6' }
    default:
      return { icon: '🔔', tone: '#F0FDFA' }
  }
}

function formatTime(createdAt: number) {
  const diffMs = Date.now() - createdAt
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return new Date(createdAt).toLocaleDateString()
}

const LINKS: { key: Page; label: string }[] = [
  { key: 'radar', label: 'Discover' },
  { key: 'opportunities', label: 'Opportunities' },
  { key: 'my-jobs', label: 'My Jobs' },
  { key: 'messages', label: 'Messages' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'portfolio', label: 'Portfolio' },
]

export default function Nav({ onNavigate, currentPage }: NavProps) {
  const [bell, setBell] = useState(false)
  const [menu, setMenu] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const clerk = useClerk()
  const { user, isLoaded, isSignedIn } = useUser()
  const authed = isLoaded && isSignedIn
  const dbUser = useQuery(api.queries.me)
  const profileData = useQuery(api.queries.myStudentProfile)
  const notifications = useQuery(api.queries.myNotifications, {})
  const unread = notifications ? notifications.filter((n: any) => !n.isRead).length : 0
  const displayName = user?.firstName || user?.username || dbUser?.username || 'User'

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        setBell(false)
        setMenu(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const go = (p: Page) => {
    setBell(false)
    setMenu(false)
    onNavigate(p)
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        background: 'rgba(255,255,255,0.86)',
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        ref={wrap}
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div style={{ cursor: 'pointer' }} onClick={() => go(authed ? 'dashboard' : 'landing')}>
          <Logo />
        </div>

        {authed && (
          <nav
            className="scrollbar-hide"
            style={{ display: 'flex', gap: 2, marginLeft: 12, overflowX: 'auto', flex: 1 }}
          >
            {LINKS.map((l) => {
              const on = currentPage === l.key
              return (
                <button
                  key={l.key}
                  onClick={() => go(l.key)}
                  className="sl-link"
                  style={{
                    border: 'none',
                    background: on ? C.primary + '12' : 'transparent',
                    color: on ? C.primary : C.muted,
                    fontFamily: 'inherit',
                    fontSize: 13.5,
                    fontWeight: 700,
                    padding: '9px 13px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {l.label}
                </button>
              )
            })}
          </nav>
        )}

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            position: 'relative',
          }}
        >
          {!authed ? (
            <>
              <Btn variant="ghost" size="sm" onClick={() => { if (isSignedIn) return; clerk.openSignIn() }}>
                Sign in
              </Btn>
              <Btn size="sm" onClick={() => go('signup')}>
                Get started
              </Btn>
            </>
          ) : (
            <>
              <Btn variant="secondary" size="sm" onClick={() => go('admin-dashboard')} style={{ display: 'inline-flex' }}>
                ⚙ Admin
              </Btn>
              <Btn size="sm" onClick={() => go('post-need')} style={{ display: 'inline-flex' }}>
                + Post a Need
              </Btn>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setBell(!bell)
                    setMenu(false)
                  }}
                  className="sl-press"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    cursor: 'pointer',
                    fontSize: 16,
                    position: 'relative',
                  }}
                  aria-label="Notifications"
                >
                  🔔
                  {unread > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        minWidth: 18,
                        height: 18,
                        borderRadius: 999,
                        background: C.error,
                        color: '#fff',
                        fontSize: 10.5,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #fff',
                        animation: 'sl-blip 2.4s ease-in-out infinite',
                      }}
                    >
                      {unread}
                    </span>
                  )}
                </button>

                {bell && (
                  <div
                    className="sl-rise"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 50,
                      width: 340,
                      maxWidth: 'calc(100vw - 40px)',
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: 16,
                      boxShadow: SHADOW.lg,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '13px 16px',
                        borderBottom: `1px solid ${C.border}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 800 }}>Notifications</span>
                      <Badge color={C.primary}>{unread} new</Badge>
                    </div>
                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                      {(notifications || []).slice(0, 4).map((n: any, i: number) => {
                        const { icon, tone } = getNotificationVisuals(n.type)
                        return (
                          <div
                            key={i}
                            onClick={() => go('notifications')}
                            className="sl-link"
                            style={{
                              display: 'flex',
                              gap: 12,
                              padding: '13px 16px',
                              cursor: 'pointer',
                              borderBottom: `1px solid ${C.subtle}`,
                              background: !n.isRead ? '#FAFBFF' : C.surface,
                            }}
                          >
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 10,
                                background: tone,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                flexShrink: 0,
                              }}
                            >
                              {icon}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{n.title}</div>
                              <div style={{ fontSize: 11.5, color: C.faint, marginTop: 2 }}>{formatTime(n.createdAt)}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => go('notifications')}
                      style={{
                        width: '100%',
                        padding: 13,
                        border: 'none',
                        background: C.subtle,
                        color: C.primary,
                        fontFamily: 'inherit',
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setMenu(!menu)
                    setBell(false)
                  }}
                  className="sl-press"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 10px 5px 5px',
                    borderRadius: 999,
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <Avatar name={displayName} size={30} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{displayName}</span>
                  <span style={{ fontSize: 9, color: C.faint }}>▼</span>
                </button>

                {menu && (
                  <div
                    className="sl-rise"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 50,
                      width: 236,
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: 16,
                      boxShadow: SHADOW.lg,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 14, fontWeight: 800 }}>{displayName}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                        Trust Score {profileData?.profile?.profileCompletion || 92}/100 · {profileData?.profile?.averageRating || 4.8} ★
                      </div>
                    </div>
                    {(
                      [
                        ['profile', '👤  My Profile'],
                        ['portfolio', '🗂  Portfolio'],
                        ['economic-impact', '📈  Economic Impact'],
                        ['skill-demand', '🎯  Skill Demand'],
                        ['notifications', '🔔  Notifications'],
                      ] as [Page, string][]
                    ).map(([p, label]) => (
                      <button
                        key={p}
                        onClick={() => go(p)}
                        className="sl-link"
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '11px 16px',
                          border: 'none',
                          background: 'transparent',
                          fontFamily: 'inherit',
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.text,
                          cursor: 'pointer',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      onClick={() => clerk.signOut().then(() => go('landing'))}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '11px 16px',
                        border: 'none',
                        borderTop: `1px solid ${C.border}`,
                        background: 'transparent',
                        fontFamily: 'inherit',
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.error,
                        cursor: 'pointer',
                      }}
                    >
                      ↩  Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
