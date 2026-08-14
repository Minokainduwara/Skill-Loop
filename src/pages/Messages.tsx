import { useMemo, useState } from 'react'
import type { PageProps } from '../types'
import {
  Avatar,
  Badge,
  Btn,
  C,
  Card,
  EmptyState,
  Input,
  PageHead,
  SearchInput,
  Shell,
  rupees,
} from '../components/ui'

interface Bubble {
  id: number
  from: 'me' | 'them'
  text?: string
  attachment?: { icon: string; name: string; meta: string }
  time: string
  dateSep?: string
}

interface Conversation {
  id: string
  name: string
  job: string
  online: boolean
  preview: string
  time: string
  unread: number
  emoji?: string
  messages: Bubble[]
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'University Robotics Society',
    job: 'Robotics Exhibition Poster · ' + rupees(2000),
    online: true,
    preview: 'Perfect, the v2 poster looks great. Sending approval now.',
    time: '4:02 PM',
    unread: 2,
    emoji: '🤖',
    messages: [
      { id: 1, from: 'them', text: 'Hi Kasun! Thanks for accepting the poster job. Deadline is the 14th.', time: '9:12 AM', dateSep: 'Monday, 10 August' },
      { id: 2, from: 'me', text: 'Noted. I will share a first direction on Wednesday.', time: '9:31 AM' },
      { id: 3, from: 'them', attachment: { icon: '🗜️', name: 'society-logo-pack.zip', meta: 'ZIP · 2.4 MB' }, time: '10:04 AM' },
      { id: 4, from: 'me', text: 'Got it. I will keep the indigo and teal society palette.', time: '10:20 AM' },
      { id: 5, from: 'them', text: 'Could you make the venue line larger and add the QR code bottom right?', time: '8:20 AM', dateSep: 'Today' },
      { id: 6, from: 'me', attachment: { icon: '🖼️', name: 'poster-draft-v2.png', meta: 'PNG · 3.4 MB · A3 preview' }, time: '3:48 PM' },
      { id: 7, from: 'them', text: 'Perfect, the v2 poster looks great. Sending approval now.', time: '4:02 PM' },
    ],
  },
  {
    id: 'c2',
    name: 'Nimali Jayasuriya',
    job: 'Instagram Reel Edit · ' + rupees(2500),
    online: true,
    preview: 'Can you make the intro a bit more minimal?',
    time: '1:15 PM',
    unread: 1,
    messages: [
      { id: 1, from: 'them', text: 'Hi! I saw your portfolio — the Kandy heritage map is beautiful.', time: '11:02 AM', dateSep: 'Today' },
      { id: 2, from: 'me', text: 'Thank you Nimali! Happy to take on the reel edit for the food tour.', time: '11:40 AM' },
      { id: 3, from: 'them', text: 'Can you make the intro a bit more minimal?', time: '1:15 PM' },
    ],
  },
  {
    id: 'c3',
    name: 'Kandy Spice Kitchen',
    job: 'Spice Menu Redesign · ' + rupees(3500),
    online: false,
    preview: 'The colour palette is approved. Go ahead with print layout.',
    time: 'Yesterday',
    unread: 0,
    emoji: '🍛',
    messages: [
      { id: 1, from: 'them', text: 'We need the A4 menu plus a digital version for the QR code stands.', time: '2:10 PM', dateSep: 'Yesterday' },
      { id: 2, from: 'me', text: 'Understood. I will send two palette options tonight.', time: '2:44 PM' },
      { id: 3, from: 'them', text: 'The colour palette is approved. Go ahead with print layout.', time: '6:05 PM' },
    ],
  },
  {
    id: 'c4',
    name: 'Dr. Anura Rajapaksa',
    job: 'Chemistry Slide Deck · Completed',
    online: false,
    preview: 'Thanks again — the students found the slides very clear.',
    time: 'Mon',
    unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'Thanks again — the students found the slides very clear.', time: '9:30 AM', dateSep: 'Monday, 10 August' },
      { id: 2, from: 'me', text: 'Glad to hear it, Sir. Happy to help with the next tutorial set too.', time: '10:12 AM' },
    ],
  },
  {
    id: 'c5',
    name: 'Tharindu Weerasinghe',
    job: 'Heritage Walk Map · Completed',
    online: false,
    preview: 'Let me know when you are free for the second map.',
    time: 'Sat',
    unread: 0,
    messages: [],
  },
]

export default function Messages({ onNavigate }: PageProps) {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [extra, setExtra] = useState<Record<string, Bubble[]>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CONVERSATIONS
    return CONVERSATIONS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q),
    )
  }, [query])

  const active = useMemo(
    () => CONVERSATIONS.find((c) => c.id === activeId) ?? CONVERSATIONS[0],
    [activeId],
  )

  const thread = useMemo(
    () => [...active.messages, ...(extra[active.id] ?? [])],
    [active, extra],
  )

  const send = () => {
    const text = draft.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
    setExtra((prev) => ({
      ...prev,
      [active.id]: [
        ...(prev[active.id] ?? []),
        { id: Date.now(), from: 'me', text, time: now },
      ],
    }))
    setDraft('')
  }

  return (
    <Shell width={1240}>
      <style>{`
        .sl-msg-grid { display: grid; grid-template-columns: 340px 1fr; gap: 18px; align-items: start }
        @media (max-width: 880px) {
          .sl-msg-grid { grid-template-columns: 1fr }
          .sl-msg-list { max-height: 320px }
        }
      `}</style>

      <PageHead
        eyebrow="Inbox"
        title="Messages"
        subtitle="Every conversation tied to a job, in one place."
        actions={
          <Btn variant="secondary" onClick={() => onNavigate('my-jobs')}>
            My jobs
          </Btn>
        }
      />

      <div className="sl-msg-grid">
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ padding: 14, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
            <SearchInput value={query} onChange={setQuery} placeholder="Search conversations" />
          </div>
          <div className="sl-msg-list scrollbar-hide" style={{ maxHeight: 560, overflowY: 'auto' }}>
            {filtered.length === 0 && (
              <p style={{ padding: 24, margin: 0, fontSize: 13, color: C.faint, textAlign: 'center' }}>
                No conversations match "{query}".
              </p>
            )}
            {filtered.map((c) => {
              const on = c.id === activeId
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className="sl-press"
                  style={{
                    display: 'flex',
                    gap: 12,
                    width: '100%',
                    textAlign: 'left',
                    padding: '14px 16px',
                    border: 'none',
                    borderLeft: `3px solid ${on ? C.primary : 'transparent'}`,
                    borderBottom: `1px solid ${C.subtle}`,
                    background: on ? '#EEF2FF' : C.surface,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar name={c.name} size={42} emoji={c.emoji} />
                    {c.online && (
                      <span
                        style={{
                          position: 'absolute',
                          right: -1,
                          bottom: -1,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: C.success,
                          border: '2px solid #fff',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 13.5,
                          fontWeight: 800,
                          color: C.text,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.name}
                      </span>
                      <span style={{ fontSize: 11, color: C.faint, flexShrink: 0 }}>{c.time}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 5,
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 12.5,
                          color: c.unread ? C.text : C.muted,
                          fontWeight: c.unread ? 700 : 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.preview}
                      </span>
                      {c.unread > 0 && (
                        <span
                          style={{
                            flexShrink: 0,
                            minWidth: 20,
                            height: 20,
                            padding: '0 6px',
                            borderRadius: 999,
                            background: C.primary,
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        <Card pad={0} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: '15px 20px',
              borderBottom: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <Avatar name={active.name} size={40} emoji={active.emoji} />
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>{active.name}</div>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: active.online ? C.success : C.faint,
                  marginTop: 2,
                }}
              >
                {active.online ? '● Online now' : '○ Last seen recently'}
              </div>
            </div>
            <Badge color={C.accent}>{active.job}</Badge>
            <Btn size="sm" variant="secondary" onClick={() => onNavigate('job-workspace')}>
              View job
            </Btn>
          </div>

          <div
            className="scrollbar-hide"
            style={{
              padding: 20,
              minHeight: 360,
              maxHeight: 480,
              overflowY: 'auto',
              display: 'grid',
              gap: 12,
              alignContent: thread.length ? 'start' : 'center',
              background: C.bg,
            }}
          >
            {thread.length === 0 ? (
              <EmptyState
                emoji="💬"
                title="No messages yet"
                text={`Start the conversation with ${active.name} — a short intro doubles your reply rate.`}
                action={<Btn size="sm" onClick={() => setDraft('Hi! Are you free to discuss the next map?')}>Draft a hello</Btn>}
              />
            ) : (
              thread.map((m) => {
                const mine = m.from === 'me'
                return (
                  <div key={m.id} style={{ display: 'grid', gap: 12 }}>
                    {m.dateSep && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          margin: '4px 0',
                        }}
                      >
                        <div style={{ flex: 1, height: 1, background: C.border }} />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.faint,
                            letterSpacing: 0.6,
                            textTransform: 'uppercase',
                          }}
                        >
                          {m.dateSep}
                        </span>
                        <div style={{ flex: 1, height: 1, background: C.border }} />
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '72%' }}>
                        {m.attachment ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: 12,
                              borderRadius: 16,
                              borderBottomRightRadius: mine ? 5 : 16,
                              borderBottomLeftRadius: mine ? 16 : 5,
                              background: mine ? 'rgba(79,70,229,0.08)' : C.surface,
                              border: `1px solid ${mine ? '#C7D2FE' : C.border}`,
                            }}
                          >
                            <div
                              style={{
                                width: 46,
                                height: 46,
                                borderRadius: 12,
                                background: 'linear-gradient(135deg, #EEF2FF, #F0FDFA)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 21,
                                flexShrink: 0,
                              }}
                            >
                              {m.attachment.icon}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>
                                {m.attachment.name}
                              </div>
                              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>
                                {m.attachment.meta}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              padding: '11px 15px',
                              borderRadius: 16,
                              borderBottomRightRadius: mine ? 5 : 16,
                              borderBottomLeftRadius: mine ? 16 : 5,
                              fontSize: 13.5,
                              lineHeight: 1.6,
                              background: mine
                                ? 'linear-gradient(135deg, #4F46E5, #6D5AE6)'
                                : C.surface,
                              color: mine ? '#fff' : C.text,
                              border: mine ? 'none' : `1px solid ${C.border}`,
                            }}
                          >
                            {m.text}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: 11,
                            color: C.faint,
                            marginTop: 5,
                            textAlign: mine ? 'right' : 'left',
                          }}
                        >
                          {m.time}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              padding: 14,
              borderTop: `1px solid ${C.border}`,
              alignItems: 'center',
            }}
          >
            <button
              className="sl-press"
              aria-label="Attach a file"
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: C.surface,
                cursor: 'pointer',
                fontSize: 17,
                flexShrink: 0,
                fontFamily: 'inherit',
              }}
            >
              📎
            </button>
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send()
              }}
              placeholder={`Message ${active.name.split(' ')[0]}…`}
            />
            <Btn onClick={send}>Send</Btn>
          </div>
        </Card>
      </div>
    </Shell>
  )
}
