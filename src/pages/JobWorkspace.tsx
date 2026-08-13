import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import type { PageProps } from '../types'
import {
  AICallout,
  Avatar,
  Btn,
  C,
  Card,
  Divider,
  Grid,
  Input,
  PageHead,
  SectionTitle,
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

export default function JobWorkspace({ onNavigate, selectedJobId }: PageProps) {
  const [reqs, setReqs] = useState<Requirement[]>(INITIAL_REQS)
  const [draft, setDraft] = useState('')

  const workspace = useQuery(api.queries.jobWorkspace, {
    jobId: (selectedJobId || '') as Id<'jobs'>,
  })
  const me = useQuery(api.queries.me)
  const dbMessages = useQuery(api.queries.listMessages, {
    jobId: (selectedJobId || '') as Id<'jobs'>,
  })

  const sendMessageMutation = useMutation(api.mutations.sendMessage)

  const loading = workspace === undefined || me === undefined || dbMessages === undefined

  const toggleReq = (id: string) =>
    setReqs((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)))

  const send = async () => {
    const text = draft.trim()
    if (!text || !me || !workspace) return
    const otherUserId = me._id === workspace.job.studentId ? workspace.job.requesterId : workspace.job.studentId
    try {
      await sendMessageMutation({
        receiverId: otherUserId,
        jobId: workspace.job._id,
        text,
      })
      setDraft('')
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <Shell>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontSize: 16, color: C.muted }}>
          Loading workspace...
        </div>
      </Shell>
    )
  }

  if (!workspace || !me) {
    return (
      <Shell>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontSize: 16, color: C.muted }}>
          Job not found or you are not signed in.
        </div>
      </Shell>
    )
  }

  const { job, jobRequest, requester, student, deliverables } = workspace

  const clientName = requester?.username || 'Client'
  const isStudent = me._id === job.studentId
  const oppositePartyName = isStudent ? clientName : (student?.username || 'Student')
  const budgetVal = job.agreedPrice
  const daysLeft = job.deadline ? Math.round((job.deadline - Date.now()) / (24 * 3600 * 1000)) : 2
  const deadlineText = daysLeft > 0 ? `${daysLeft} days left` : 'Awaiting deadline'

  const mappedMessages = dbMessages.map((m: any) => ({
    id: m._id,
    from: m.senderId === me._id ? 'me' : 'them',
    text: m.text,
    time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }))

  const mappedFiles = deliverables.map((d: any) => ({
    name: d.fileUrl ? d.fileUrl.split('/').pop() : 'deliverable.png',
    icon: '🖼️',
    type: 'Image',
    size: '3.4 MB',
    by: student?.username || 'Student',
    date: new Date(d.submittedAt).toLocaleDateString(),
  }))

  return (
    <Shell>
      <PageHead
        eyebrow="Job workspace"
        title={jobRequest?.title || 'Job Workspace'}
        onBack={() => onNavigate('my-jobs')}
        backLabel="Back to My Jobs"
        actions={
          <>
            <Btn variant="secondary" onClick={() => onNavigate('messages')}>
              All messages
            </Btn>
            {isStudent && (
              <Btn onClick={() => onNavigate('submit-work', { jobId: job._id })}>Submit Work</Btn>
            )}
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
            <Avatar name={oppositePartyName} size={52} emoji="🤖" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15.5, fontWeight: 800, color: C.text }}>
                  {oppositePartyName}
                </span>
                <StatusBadge status={job.status === 'in_progress' ? 'In Progress' : job.status === 'completed' ? 'Completed' : 'In Progress'} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 7 }}>
                <Stars rating={4.8} />
                <span style={{ fontSize: 12.5, color: C.faint }}>· Peradeniya · Active Status</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, letterSpacing: 0.6 }}>
                BUDGET
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: -0.6 }}>
                {rupees(budgetVal)}
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
              {deadlineText}
            </div>
          </div>
        </div>
      </Card>

      <Grid min={520} gap={18} style={{ alignItems: 'start' }}>
        <div>
          <Card pad={22} style={{ marginBottom: 18 }}>
            <SectionTitle title="Job timeline" subtitle="Track progress reactively" />
            <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 6 }}>
              {STEPS.map((step, i) => {
                const done = i < CURRENT_STEP
                const current = i === CURRENT_STEP
                const tone = done ? C.success : current ? C.primary : C.border
                return (
                  <div key={step} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: current ? '#fff' : tone,
                          border: current ? `3px solid ${C.primary}` : 'none',
                          color: current ? C.primary : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 800,
                          margin: '0 auto 8px',
                          zIndex: 1,
                          position: 'relative',
                        }}
                      >
                        {done ? '✓' : i + 1}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: current ? 800 : 600, color: current ? C.text : C.muted }}>
                      {step}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card pad={22} style={{ marginBottom: 18 }}>
            <SectionTitle title="Brief and requirements" />
            <p style={{ margin: '0 0 16px', fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>
              {jobRequest?.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reqs.map((r) => (
                <div
                  key={r.id}
                  onClick={() => toggleReq(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    padding: '8px 10px',
                    borderRadius: 10,
                    transition: 'all 0.1s',
                  }}
                  className="sl-link"
                >
                  <span style={{ fontSize: 16 }}>{r.done ? '✅' : '⬜'}</span>
                  <span
                    style={{
                      fontSize: 13.5,
                      textDecoration: r.done ? 'line-through' : 'none',
                      color: r.done ? C.faint : C.text,
                    }}
                  >
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={22}>
            <SectionTitle title="Shared files" />
            {mappedFiles.length === 0 ? (
              <div style={{ padding: 18, textAlign: 'center', color: C.muted, fontSize: 12.5 }}>
                No files shared yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {mappedFiles.map((f: any) => (
                  <div
                    key={f.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      borderRadius: 14,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{f.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: C.text,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {f.name}
                      </div>
                      <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
                        {f.type} · {f.size} · by {f.by} on {f.date}
                      </div>
                    </div>
                    <Btn size="sm" variant="ghost">
                      Download
                    </Btn>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card pad={0} style={{ overflow: 'hidden', marginBottom: 18 }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${C.border}`,
                background: C.bg,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.success }} />
                <span style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>
                  Chat with {oppositePartyName}
                </span>
              </div>
            </div>

            <div
              style={{
                height: 280,
                overflowY: 'auto',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {mappedMessages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: C.muted, fontSize: 12.5 }}>
                  No messages yet. Say hello!
                </div>
              ) : (
                mappedMessages.map((m: any) => {
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
                })
              )}
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
                ['Category', jobRequest?.category || 'General'],
                ['Budget', rupees(budgetVal)],
                ['Deadline', job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Awaiting deadline'],
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
            {isStudent && (
              <>
                <Divider />
                <div style={{ display: 'grid', gap: 10 }}>
                  <Btn full onClick={() => onNavigate('submit-work', { jobId: job._id })}>
                    Submit Work
                  </Btn>
                  <Btn full variant="secondary">
                    Request extension
                  </Btn>
                </div>
              </>
            )}
          </Card>

          <AICallout title="Escrow is secured">
            Rs. {budgetVal} is held in escrow by SkillLoop and will be released to the student's wallet immediately upon final client approval.
          </AICallout>
        </div>
      </Grid>
    </Shell>
  )
}
