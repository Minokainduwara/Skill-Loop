import { useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Page, PageProps } from '../types'
import {
  Badge,
  Btn,
  C,
  Card,
  Divider,
  EmptyState,
  PageHead,
  SHADOW,
  SectionTitle,
  Shell,
  Tabs,
} from '../components/ui'

type Category = 'opportunities' | 'payments' | 'social' | 'insights'
type Bucket = 'Today' | 'Yesterday' | 'Earlier'

interface Note {
  id: string
  icon: string
  title: string
  body: string
  time: string
  tone: string
  unread: boolean
  category: Category
  bucket: Bucket
  action: { label: string; page: Page }
}



const BUCKETS: Bucket[] = ['Today', 'Yesterday', 'Earlier']

interface Pref {
  key: string
  label: string
  desc: string
  on: boolean
}

const PREFS: Pref[] = [
  { key: 'match', label: 'New high-match opportunities', desc: 'Alert me when a match above 90% appears near Peradeniya', on: true },
  { key: 'pay', label: 'Payments and withdrawals', desc: 'Confirmations when money is released or paid out', on: true },
  { key: 'demand', label: 'Demand insights', desc: 'Weekly digest of skills trending in my area', on: true },
  { key: 'msg', label: 'Messages', desc: 'Notify me when a requester replies', on: false },
  { key: 'email', label: 'Email summary', desc: 'A short recap every Sunday evening', on: false },
]

export default function Notifications({ onNavigate }: PageProps) {
  const dbNotifications = useQuery(api.queries.myNotifications, {})
  const [tab, setTab] = useState('all')
  const [prefs, setPrefs] = useState<Pref[]>(PREFS)
  const [locallyRead, setLocallyRead] = useState<string[]>([])

  const formatTime = (createdAt: number) => {
    const diffMs = Date.now() - createdAt
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`
    return new Date(createdAt).toLocaleDateString()
  }

  const notes: Note[] = useMemo(() => {
    if (!dbNotifications) return []
    return dbNotifications.map((n: any) => {
      const diffMs = Date.now() - n.createdAt
      let bucket: Bucket = 'Earlier'
      if (diffMs < 24 * 3600 * 1000) {
        bucket = 'Today'
      } else if (diffMs < 48 * 3600 * 1000) {
        bucket = 'Yesterday'
      }

      let icon = '🔔'
      let tone = '#F0FDFA'
      let actionPage: Page = 'dashboard'
      let actionLabel = 'View'
      switch (n.type) {
        case 'new_match':
          icon = '🔥'
          tone = '#FEF3C7'
          actionPage = 'opportunities'
          actionLabel = 'View match'
          break
        case 'payment':
          icon = '💰'
          tone = '#DCFCE7'
          actionPage = 'earnings'
          actionLabel = 'View wallet'
          break
        case 'review':
          icon = '⭐'
          tone = '#FEF9C3'
          actionPage = 'profile'
          actionLabel = 'View review'
          break
        case 'opportunity':
          icon = '🎯'
          tone = '#EEF2FF'
          actionPage = 'opportunities'
          actionLabel = 'View opportunity'
          break
      }

      return {
        id: n._id,
        icon,
        title: n.title,
        body: n.message,
        time: formatTime(n.createdAt),
        tone,
        unread: !n.isRead && !locallyRead.includes(n._id),
        category: n.type === 'payment' ? 'payments' : n.type === 'new_match' || n.type === 'opportunity' ? 'opportunities' : 'social',
        bucket,
        action: { label: actionLabel, page: actionPage },
      }
    })
  }, [dbNotifications, locallyRead])

  const unreadCount = notes.filter((n) => n.unread).length

  const visible = useMemo(() => {
    if (tab === 'unread') return notes.filter((n) => n.unread)
    if (tab === 'opportunities') return notes.filter((n) => n.category === 'opportunities')
    if (tab === 'payments') return notes.filter((n) => n.category === 'payments')
    return notes
  }, [notes, tab])

  const markRead = (id: string) => {
    setLocallyRead(prev => [...prev, id])
  }

  const markAll = () => {
    setLocallyRead(notes.map(n => n.id))
  }

  const togglePref = (key: string) =>
    setPrefs((prev) => prev.map((p) => (p.key === key ? { ...p, on: !p.on } : p)))

  const open = (n: Note) => {
    markRead(n.id)
    onNavigate(n.action.page)
  }

  if (dbNotifications === undefined) {
    return (
      <Shell width={860}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontSize: 16, color: C.muted }}>
          Loading notifications...
        </div>
      </Shell>
    )
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Shell width={860}>
        <PageHead
          eyebrow="Activity"
          title="Notifications"
          subtitle={
            unreadCount > 0
              ? `${unreadCount} unread updates about your opportunities, payments and reputation.`
              : "You're all caught up — every update has been read."
          }
          actions={
            <Btn variant="secondary" onClick={markAll} disabled={unreadCount === 0}>
              Mark all as read
            </Btn>
          }
        />

        <Tabs
          tabs={[
            { key: 'all', label: 'All', count: notes.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'opportunities', label: 'Opportunities' },
            { key: 'payments', label: 'Payments' },
          ]}
          active={tab}
          onChange={setTab}
        />

        {visible.length === 0 ? (
          <EmptyState
            emoji="🔔"
            title="Nothing here right now"
            text="No notifications match this filter. Switch to All to see your full activity history."
            action={<Btn variant="secondary" onClick={() => setTab('all')}>Show all</Btn>}
          />
        ) : (
          BUCKETS.map((bucket) => {
            const group = visible.filter((n) => n.bucket === bucket)
            if (group.length === 0) return null
            return (
              <div key={bucket} style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 10,
                    padding: '0 4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      color: C.faint,
                    }}
                  >
                    {bucket}
                  </span>
                  <span style={{ flex: 1, height: 1, background: C.border }} />
                  <Badge color={C.muted} bg={C.subtle}>
                    {group.length}
                  </Badge>
                </div>

                <Card pad={0} style={{ overflow: 'hidden' }}>
                  {group.map((n, i) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className="sl-link"
                      style={{
                        display: 'flex',
                        gap: 14,
                        padding: '16px 18px',
                        cursor: 'pointer',
                        alignItems: 'flex-start',
                        background: n.unread ? 'rgba(79,70,229,0.035)' : C.surface,
                        borderTop: i === 0 ? 'none' : `1px solid ${C.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 13,
                          background: n.tone,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 19,
                          flexShrink: 0,
                          boxShadow: SHADOW.sm,
                        }}
                      >
                        {n.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: n.unread ? 800 : 700,
                              color: C.text,
                              lineHeight: 1.4,
                            }}
                          >
                            {n.title}
                          </span>
                          {n.unread && (
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: C.primary,
                                flexShrink: 0,
                                boxShadow: '0 0 0 3px rgba(79,70,229,0.16)',
                              }}
                            />
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 1.55 }}>
                          {n.body}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 9 }}>
                          <span style={{ fontSize: 11.5, color: C.faint, fontWeight: 600 }}>{n.time}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              open(n)
                            }}
                            className="sl-press"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              padding: 0,
                              color: C.primary,
                              fontSize: 12.5,
                              fontWeight: 800,
                              fontFamily: 'inherit',
                              cursor: 'pointer',
                            }}
                          >
                            {n.action.label} →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            )
          })
        )}

        <Divider />

        {/* --------------------------------------------------- preferences */}
        <SectionTitle
          title="Notification preferences"
          subtitle="Choose what SkillLoop should tell you about"
        />
        <Card>
          {prefs.map((p, i) => (
            <div key={p.key}>
              {i > 0 && <div style={{ height: 1, background: C.border, margin: '14px 0' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{p.label}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>{p.desc}</div>
                </div>
                <div
                  onClick={() => togglePref(p.key)}
                  role="switch"
                  aria-checked={p.on}
                  className="sl-press"
                  style={{
                    width: 46,
                    height: 26,
                    borderRadius: 999,
                    background: p.on ? C.primary : '#CBD5E1',
                    padding: 3,
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background .2s ease',
                    boxShadow: p.on ? '0 4px 12px rgba(79,70,229,0.25)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: SHADOW.sm,
                      transform: p.on ? 'translateX(20px)' : 'translateX(0)',
                      transition: 'transform .2s cubic-bezier(.22,1,.36,1)',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Btn onClick={() => onNavigate('dashboard')}>Save preferences</Btn>
            <Btn variant="ghost" onClick={() => setPrefs(PREFS)}>
              Reset to defaults
            </Btn>
          </div>
        </Card>
      </Shell>
    </div>
  )
}
