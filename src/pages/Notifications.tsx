import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import type { Page, PageProps } from '../types'
import {
  Badge,
  Btn,
  C,
  Card,
  Divider,
  EmptyState,
  NOTIFICATIONS,
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

const BASE: Note[] = [
  {
    id: 'n1',
    icon: NOTIFICATIONS[0].icon,
    title: NOTIFICATIONS[0].title,
    body: NOTIFICATIONS[0].body,
    time: NOTIFICATIONS[0].time,
    tone: NOTIFICATIONS[0].tone,
    unread: true,
    category: 'opportunities',
    bucket: 'Today',
    action: { label: 'View opportunity', page: 'opportunity-detail' },
  },
  {
    id: 'n2',
    icon: NOTIFICATIONS[1].icon,
    title: NOTIFICATIONS[1].title,
    body: NOTIFICATIONS[1].body,
    time: NOTIFICATIONS[1].time,
    tone: NOTIFICATIONS[1].tone,
    unread: true,
    category: 'payments',
    bucket: 'Today',
    action: { label: 'View earnings', page: 'earnings' },
  },
  {
    id: 'n3',
    icon: NOTIFICATIONS[2].icon,
    title: NOTIFICATIONS[2].title,
    body: NOTIFICATIONS[2].body,
    time: NOTIFICATIONS[2].time,
    tone: NOTIFICATIONS[2].tone,
    unread: true,
    category: 'social',
    bucket: 'Today',
    action: { label: 'View review', page: 'profile' },
  },
  {
    id: 'n4',
    icon: '⏰',
    title: 'Deadline reminder: Cafe Menu Redesign',
    body: 'Due tomorrow at 5:00 PM for Nimali Jayasuriya',
    time: '5 hours ago',
    tone: '#FEE2E2',
    unread: true,
    category: 'opportunities',
    bucket: 'Today',
    action: { label: 'Open workspace', page: 'job-workspace' },
  },
  {
    id: 'n5',
    icon: NOTIFICATIONS[3].icon,
    title: NOTIFICATIONS[3].title,
    body: NOTIFICATIONS[3].body,
    time: 'Yesterday, 6:40 PM',
    tone: NOTIFICATIONS[3].tone,
    unread: false,
    category: 'insights',
    bucket: 'Yesterday',
    action: { label: 'Open radar', page: 'radar' },
  },
  {
    id: 'n6',
    icon: NOTIFICATIONS[4].icon,
    title: NOTIFICATIONS[4].title,
    body: NOTIFICATIONS[4].body,
    time: 'Yesterday, 2:15 PM',
    tone: NOTIFICATIONS[4].tone,
    unread: false,
    category: 'insights',
    bucket: 'Yesterday',
    action: { label: 'View portfolio', page: 'portfolio' },
  },
  {
    id: 'n7',
    icon: '🛡️',
    title: 'Your trust score increased to 92',
    body: 'Two verified completions and a 5-star review from Nimal Silva',
    time: 'Yesterday, 9:05 AM',
    tone: '#CFFAFE',
    unread: false,
    category: 'social',
    bucket: 'Yesterday',
    action: { label: 'View profile', page: 'profile' },
  },
  {
    id: 'n8',
    icon: NOTIFICATIONS[5].icon,
    title: NOTIFICATIONS[5].title,
    body: NOTIFICATIONS[5].body,
    time: '2 days ago',
    tone: NOTIFICATIONS[5].tone,
    unread: false,
    category: 'social',
    bucket: 'Earlier',
    action: { label: 'Reply', page: 'messages' },
  },
  {
    id: 'n9',
    icon: '📡',
    title: 'Cluster of 7 requests detected in Kandy',
    body: 'Video Editing demand spike · Rs. 21,000 combined potential',
    time: '3 days ago',
    tone: '#EDE9FE',
    unread: false,
    category: 'insights',
    bucket: 'Earlier',
    action: { label: 'View cluster', page: 'demand-cluster' },
  },
  {
    id: 'n10',
    icon: '🏦',
    title: 'Withdrawal of Rs. 5,000 processed',
    body: 'Sent to Bank of Ceylon •••• 4821 · Kandy branch',
    time: '4 days ago',
    tone: '#DCFCE7',
    unread: false,
    category: 'payments',
    bucket: 'Earlier',
    action: { label: 'View earnings', page: 'earnings' },
  },
]

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
  const notifications = useQuery(api.notifications.listMine, {})
  const markReadMutation = useMutation(api.notifications.markRead)
  const markAllReadMutation = useMutation(api.notifications.markAllRead)
  const [tab, setTab] = useState('all')
  const [prefs, setPrefs] = useState<Pref[]>(PREFS)
  const notes = useMemo<Note[]>(() => notifications === undefined ? BASE : notifications.map((notification) => {
    const age = Date.now() - notification.createdAt
    const bucket: Bucket = age < 86_400_000 ? 'Today' : age < 172_800_000 ? 'Yesterday' : 'Earlier'
    const category: Category = notification.type === 'payment' ? 'payments' : notification.type === 'review' ? 'social' : 'opportunities'
    const action: Note['action'] = notification.relatedJobId
      ? { label: 'Open job', page: 'job-workspace' }
      : notification.relatedJobRequestId
        ? { label: 'View opportunity', page: 'opportunity-detail' }
        : { label: 'View updates', page: 'dashboard' }
    return {
      id: notification._id,
      icon: notification.type === 'payment' ? '💰' : notification.type === 'review' ? '⭐' : notification.type === 'job_completed' ? '🎉' : '🔔',
      title: notification.title,
      body: notification.message,
      time: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-Math.max(1, Math.round(age / 3_600_000)), 'hour'),
      tone: notification.isRead ? C.subtle : '#EEF2FF',
      unread: !notification.isRead,
      category,
      bucket,
      action,
    }
  }), [notifications])

  const unreadCount = notes.filter((n) => n.unread).length

  const visible = useMemo(() => {
    if (tab === 'unread') return notes.filter((n) => n.unread)
    if (tab === 'opportunities') return notes.filter((n) => n.category === 'opportunities')
    if (tab === 'payments') return notes.filter((n) => n.category === 'payments')
    return notes
  }, [notes, tab])

  const markRead = (id: string) => {
    const note = notes.find((item) => item.id === id)
    if (note?.unread) void markReadMutation({ notificationId: id as Id<'notifications'> })
  }

  const markAll = () => void markAllReadMutation({})

  const togglePref = (key: string) =>
    setPrefs((prev) => prev.map((p) => (p.key === key ? { ...p, on: !p.on } : p)))

  const open = (n: Note) => {
    markRead(n.id)
    onNavigate(n.action.page)
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
