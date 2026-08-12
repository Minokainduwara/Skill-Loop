import { useMemo, useState } from 'react'
import type { PageProps } from '../types'
import {
  AICallout,
  Avatar,
  Badge,
  Btn,
  C,
  Card,
  Divider,
  Grid,
  Input,
  PageHead,
  Progress,
  SectionTitle,
  SHADOW,
  Shell,
  Stars,
  StatusBadge,
  rupees,
} from '../components/ui'

interface Requirement {
  id: string
  label: string
  done: boolean
}

interface FileItem {
  name: string
  icon: string
  type: string
  size: string
  by: string
  date: string
}

interface Message {
  id: number
  from: 'me' | 'them'
  text: string
  time: string
}

const STEPS = ['Posted', 'Accepted', 'In Progress', 'Submitted', 'Completed']
const CURRENT_STEP = 2

const INITIAL_REQS: Requirement[] = [
  { id: 'r1', label: 'A3 portrait poster, print-ready at 300 DPI', done: true },
  { id: 'r2', label: 'Society logo and Peradeniya crest placed in header', done: true },
  { id: 'r3', label: 'Event date, venue and QR registration link included', done: true },
  { id: 'r4', label: 'Colour palette matches the society brand (indigo / teal)', done: true },
  { id: 'r5', label: 'Editable source file delivered (.fig or .ai)', done: false },
  { id: 'r6', label: 'Social media crop (1080 × 1080) exported as PNG', done: false },
]

const FILES: FileItem[] = [
  { name: 'robotics-brief-v1.pdf', icon: '📄', type: 'PDF', size: '820 KB', by: 'Dinuka Bandara', date: '02 Aug' },
  { name: 'society-logo-pack.zip', icon: '🗜️', type: 'ZIP', size: '2.4 MB', by: 'Dinuka Bandara', date: '02 Aug' },
  { name: 'poster-draft-v1.png', icon: '🖼️', type: 'PNG', size: '3.1 MB', by: 'Kasun Perera', date: '06 Aug' },
  { name: 'poster-draft-v2.png', icon: '🖼️', type: 'PNG', size: '3.4 MB', by: 'Kasun Perera', date: '10 Aug' },
]

const INITIAL_MESSAGES: Message[] = [
  { id: 1, from: 'them', text: 'Hi Kasun! Thanks for accepting. The exhibition is on the 22nd, so we need the final poster by the 14th.', time: '02 Aug · 9:12 AM' },
  { id: 2, from: 'me', text: 'Noted. I will send a first direction by Wednesday. Could you share the logo pack and the crest file?', time: '02 Aug · 9:31 AM' },
  { id: 3, from: 'them', text: 'Uploaded both to the files section just now. Please keep the indigo/teal society colours.', time: '02 Aug · 10:04 AM' },
  { id: 4, from: 'me', text: 'Draft v1 is up. I used a dark indigo base with a teal accent grid behind the robot silhouette.', time: '06 Aug · 6:45 PM' },
  { id: 5, from: 'them', text: "This looks great. Can you make the venue line larger and add the QR code near the bottom right?", time: '07 Aug · 8:20 AM' },
  { id: 6, from: 'me', text: 'Done — draft v2 has the bigger venue line and the QR block. Working on the editable source next.', time: '10 Aug · 4:02 PM' },
]

export default function JobWorkspace({ onNavigate }: PageProps) {
  const [reqs, setReqs] = useState<Requirement[]>(INITIAL_REQS)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')

  const progress = useMemo(
    () => Math.round((reqs.filter((r) => r.done).length / reqs.length) * 100),
    [reqs],
  )

  const toggle = (id: string) =>
    setReqs((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)))

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: 'me', text, time: 'Just now' },
    ])
    setDraft('')
  }

  return (
    <Shell>
      <PageHead
        eyebrow="Job workspace"
        title="Robotics Exhibition Poster"
        onBack={() => onNavigate('my-jobs')}
        backLabel="Back to My Jobs"
        actions={
          <>
            <Btn variant="secondary" onClick={() => onNavigate('messages')}>
              All messages
            </Btn>
            <Btn onClick={() => onNavigate('submit-work')}>Submit Work</Btn>
          </>
        }
      />

      <Card pad={22} style={{ marginBottom: 18 }} >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', minWidth: 0 }}>
            <Avatar name="University Robotics Society" size={52} emoji="🤖" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15.5, fontWeight: 800, color: C.text }}>
                  University Robotics Society
                </span>
                <StatusBadge status="In Progress" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 7 }}>
                <Stars rating={4.8} />
                <span style={{ fontSize: 12.5, color: C.faint }}>· Peradeniya · 14 jobs posted</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, letterSpacing: 0.6 }}>
                BUDGET
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: -0.6 }}>
                {rupees(2000)}
              </div>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 999,
                background: '#FEF3C7',
                border: '1px solid #FCD34D',
                color: '#92400E',
                fontSize: 13.5,
                fontWeight: 800,
              }}
            >
              <span style={{ animation: 'sl-blip 1.6s ease-in-out infinite' }}>⏳</span>
              2 days 6 hours left
            </div>
          </div>
        </div>
      </Card>

      <Grid min={520} gap={18} style={{ alignItems: 'start' }}>
        <div>
          <Card pad={22} style={{ marginBottom: 18 }}>
            <SectionTitle title="Job timeline" subtitle="Step 3 of 5 · in progress" />
            <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 6 }}>
              {STEPS.map((step, i) => {
                const done = i < CURRENT_STEP
                const current = i === CURRENT_STEP
                const tone = done ? C.success : current ? C.primary : C.border
                return (
                  <div key={step} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                    {i > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 15,
                          left: 0,
                          right: '50%',
                          height: 3,
                          background: i <= CURRENT_STEP ? C.success : C.border,
                          borderRadius: 999,
                        }}
                      />
                    )}
                    {i < STEPS.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 15,
                          left: '50%',
                          right: 0,
                          height: 3,
                          background: i < CURRENT_STEP ? C.success : C.border,
                          borderRadius: 999,
                        }}
                      />
                    )}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      {current && (
                        <span
                          style={{
                            position: 'absolute',
                            inset: -6,
                            borderRadius: '50%',
                            border: `3px solid ${C.primary}`,
                            animation: 'sl-pulse-ring 1.8s ease-out infinite',
                          }}
                        />
                      )}
                      <div
                        style={{
                          position: 'relative',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: done ? C.success : current ? C.primary : C.surface,
                          border: `3px solid ${done || current ? 'transparent' : tone}`,
                          color: done || current ? '#fff' : C.faint,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 800,
                          margin: '0 auto',
                          boxShadow: current ? SHADOW.glow : undefined,
                        }}
                      >
                        {done ? '✓' : i + 1}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: current ? 800 : 600,
                        color: done ? C.success : current ? C.text : C.faint,
                        marginTop: 10,
                      }}
                    >
                      {step}
                    </div>
                  </div>
                )
              })}
            </div>

            <Divider />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <Progress value={progress} height={10} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: C.primary }}>{progress}%</span>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { label: 'Brief reviewed & accepted', done: true },
                { label: 'First direction shared with client', done: true },
                { label: 'Revisions applied (v2)', done: true },
                { label: 'Final export & source handover', done: false },
              ].map((m) => (
                <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: m.done ? C.success : C.faint }}>
                    {m.done ? '✓' : '○'}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: m.done ? C.muted : C.faint,
                      textDecoration: m.done ? 'line-through' : 'none',
                    }}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={22} style={{ marginBottom: 18 }}>
            <SectionTitle
              title="Requirements"
              subtitle={`${reqs.filter((r) => r.done).length} of ${reqs.length} complete`}
            />
            <div style={{ display: 'grid', gap: 10 }}>
              {reqs.map((r) => (
                <button
                  key={r.id}
                  onClick={() => toggle(r.id)}
                  className="sl-press"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    background: r.done ? '#F0FDF4' : C.subtle,
                    border: `1px solid ${r.done ? '#BBF7D0' : C.border}`,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#fff',
                      background: r.done ? C.success : 'transparent',
                      border: `2px solid ${r.done ? C.success : C.faint}`,
                    }}
                  >
                    {r.done ? '✓' : ''}
                  </span>
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: r.done ? C.muted : C.text,
                      textDecoration: r.done ? 'line-through' : 'none',
                    }}
                  >
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card pad={22}>
            <SectionTitle title="Files & assets" subtitle="Shared between you and the requester" />
            <div style={{ display: 'grid', gap: 10 }}>
              {FILES.map((f) => (
                <div
                  key={f.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: C.subtle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: C.text,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {f.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: C.faint, marginTop: 3 }}>
                      {f.type} · {f.size} · {f.by} · {f.date}
                    </div>
                  </div>
                  <button
                    className="sl-link"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: C.primary,
                      fontSize: 12.5,
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card pad={0} style={{ marginBottom: 18, overflow: 'hidden' }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${C.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 11,
              }}
            >
              <Avatar name="Dinuka Bandara" size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Dinuka Bandara</div>
                <div style={{ fontSize: 11.5, color: C.success, fontWeight: 700 }}>● Online now</div>
              </div>
              <Badge color={C.accent}>Job chat</Badge>
            </div>

            <div
              className="scrollbar-hide"
              style={{ padding: 18, maxHeight: 420, overflowY: 'auto', display: 'grid', gap: 12 }}
            >
              {messages.map((m) => {
                const mine = m.from === 'me'
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      justifyContent: mine ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{ maxWidth: '82%' }}>
                      <div
                        style={{
                          padding: '11px 14px',
                          borderRadius: 16,
                          borderBottomRightRadius: mine ? 5 : 16,
                          borderBottomLeftRadius: mine ? 16 : 5,
                          fontSize: 13.5,
                          lineHeight: 1.6,
                          background: mine ? C.primary : C.subtle,
                          color: mine ? '#fff' : C.text,
                          border: mine ? 'none' : `1px solid ${C.border}`,
                        }}
                      >
                        {m.text}
                      </div>
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
                )
              })}
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                padding: 14,
                borderTop: `1px solid ${C.border}`,
                background: C.bg,
              }}
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send()
                }}
                placeholder="Write a message…"
              />
              <Btn onClick={send}>Send</Btn>
            </div>
          </Card>

          <Card pad={22} style={{ marginBottom: 18 }}>
            <SectionTitle title="Job details" />
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                ['Category', 'Graphic Design'],
                ['Deliverable', 'A3 print poster + social crop'],
                ['Budget', rupees(2000)],
                ['Deadline', '14 Aug 2026, 6:00 PM'],
                ['Location', 'Mathara, kaburupitiya'],
                ['Escrow', 'Funded · released on approval'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 700, textAlign: 'right' }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <Divider />
            <div style={{ display: 'grid', gap: 10 }}>
              <Btn full onClick={() => onNavigate('submit-work')}>
                Submit Work
              </Btn>
              <Btn full variant="secondary">
                Request extension
              </Btn>
            </div>
          </Card>

          <AICallout title="You are ahead of schedule">
            Similar posters take 4.2 days on average. Deliver the source file today and your on-time
            rate stays at 100%.
          </AICallout>
        </div>
      </Grid>
    </Shell>
  )
}
