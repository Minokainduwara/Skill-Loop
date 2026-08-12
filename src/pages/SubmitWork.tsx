import { useMemo, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import type { PageProps } from '../types'
import {
  AICallout,
  Badge,
  Btn,
  C,
  Card,
  Divider,
  Field,
  Grid,
  PageHead,
  Progress,
  SectionTitle,
  Shell,
  Textarea,
  rupees,
} from '../components/ui'

interface Attached {
  id: string
  name: string
  size: string
  type: string
  icon: string
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const iconFor = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return '🖼️'
  if (ext === 'pdf') return '📄'
  if (['mp4', 'mov', 'avi'].includes(ext)) return '🎬'
  if (['zip', 'rar', '7z'].includes(ext)) return '🗜️'
  return '📎'
}

const INITIAL_FILES: Attached[] = [
  { id: 'f1', name: 'robotics-poster-final-A3.pdf', size: '4.2 MB', type: 'PDF · print ready', icon: '📄' },
  { id: 'f2', name: 'robotics-poster-social-1080.png', size: '2.8 MB', type: 'PNG · 1080 × 1080', icon: '🖼️' },
]

export default function SubmitWork({ onNavigate }: PageProps) {
  const [files, setFiles] = useState<Attached[]>(INITIAL_FILES)
  const [dragging, setDragging] = useState(false)
  const [note, setNote] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const canSubmit = useMemo(() => files.length > 0 && confirmed, [files.length, confirmed])

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return
    const next: Attached[] = Array.from(list).map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: formatSize(f.size),
      type: f.type || 'File',
      icon: iconFor(f.name),
    }))
    setFiles((prev) => [...prev, ...next])
  }

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <Shell>
      <PageHead
        eyebrow="Delivery"
        title="Submit Your Work"
        subtitle="Upload the final deliverables. The requester has 48 hours to review before payment is released."
        onBack={() => onNavigate('job-workspace')}
        backLabel="Back to workspace"
      />

      <Card pad={18} style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 14,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 800, color: C.text }}>
              Robotics Exhibition Poster
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
              University Robotics Society · Peradeniya
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge color={C.primary}>💰 {rupees(2000)}</Badge>
            <Badge color={C.warning}>⏱ Due 14 Aug, 6:00 PM</Badge>
            <Badge color={C.accent}>Escrow funded</Badge>
          </div>
        </div>
      </Card>

      <Grid min={560} gap={20} style={{ alignItems: 'start' }}>
        <div>
          <Card pad={22} style={{ marginBottom: 18 }}>
            <SectionTitle title="Upload deliverables" />
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className="sl-press"
              style={{
                border: `2px dashed ${dragging ? C.primary : C.border}`,
                borderRadius: 18,
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragging
                  ? 'linear-gradient(135deg, #EEF2FF, #F0FDFA)'
                  : C.bg,
                transition: 'border-color .2s ease, background .2s ease',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  margin: '0 auto 16px',
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  animation: dragging ? 'sl-float 1.6s ease-in-out infinite' : undefined,
                }}
              >
                {dragging ? '📥' : '☁️'}
              </div>
              <div style={{ fontSize: 16.5, fontWeight: 800, color: C.text }}>
                {dragging ? 'Drop your files here' : 'Drag and drop your files'}
              </div>
              <div style={{ fontSize: 13.5, color: C.muted, marginTop: 7 }}>
                or{' '}
                <span style={{ color: C.primary, fontWeight: 800, textDecoration: 'underline' }}>
                  browse files
                </span>{' '}
                from your device
              </div>
              <div style={{ fontSize: 12, color: C.faint, marginTop: 14 }}>
                PNG, JPG, PDF, MP4, ZIP up to 50 MB
              </div>
              <input
                ref={inputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </div>

            <Divider label={`${files.length} FILE${files.length === 1 ? '' : 'S'} ATTACHED`} />

            {files.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: C.faint, textAlign: 'center' }}>
                Nothing attached yet — add at least one deliverable to submit.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="sl-rise"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '13px 15px',
                      borderRadius: 14,
                      border: `1px solid ${C.border}`,
                      background: C.surface,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 11,
                        background: C.subtle,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 19,
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
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          marginTop: 7,
                        }}
                      >
                        <div style={{ flex: 1, maxWidth: 220 }}>
                          <Progress value={100} height={5} />
                        </div>
                        <span style={{ fontSize: 11.5, color: C.success, fontWeight: 800 }}>
                          ✓ Uploaded
                        </span>
                        <span style={{ fontSize: 11.5, color: C.faint }}>
                          {f.size} · {f.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                      className="sl-press"
                      aria-label={`Remove ${f.name}`}
                      style={{
                        border: `1px solid ${C.border}`,
                        background: C.surface,
                        color: C.muted,
                        width: 30,
                        height: 30,
                        borderRadius: 9,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontFamily: 'inherit',
                        flexShrink: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card pad={22}>
            <SectionTitle title="Delivery note" subtitle="Optional, but it speeds up approval" />
            <Field label="Add a note for the requester...">
              <Textarea
                rows={5}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Hi Dinuka — the final A3 poster is print-ready at 300 DPI and I have included the 1080 × 1080 social crop plus the editable source file."
              />
            </Field>

            <button
              onClick={() => setConfirmed((v) => !v)}
              className="sl-press"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                textAlign: 'left',
                padding: '14px 16px',
                borderRadius: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
                background: confirmed ? '#F0FDF4' : C.subtle,
                border: `1px solid ${confirmed ? '#BBF7D0' : C.border}`,
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
                  background: confirmed ? C.success : 'transparent',
                  border: `2px solid ${confirmed ? C.success : C.faint}`,
                }}
              >
                {confirmed ? '✓' : ''}
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>
                I confirm this work meets all the requirements
              </span>
            </button>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
              <Btn size="lg" disabled={!canSubmit} onClick={() => onNavigate('completion')}>
                Submit for Review
              </Btn>
              <Btn size="lg" variant="secondary" onClick={() => onNavigate('job-workspace')}>
                Save draft
              </Btn>
            </div>
            {!canSubmit && (
              <p style={{ margin: '12px 0 0', fontSize: 12, color: C.faint }}>
                Attach at least one file and tick the confirmation to enable submission.
              </p>
            )}
          </Card>
        </div>

        <div>
          <Card pad={22} style={{ marginBottom: 18 }}>
            <SectionTitle title="Submission checklist" />
            <div style={{ display: 'grid', gap: 13 }}>
              {[
                ['📐', 'Match the brief exactly', 'A3 portrait, 300 DPI, indigo and teal palette.'],
                ['🗂️', 'Include the source file', 'Requesters rate 0.4 stars higher when editable files are shared.'],
                ['🔤', 'Proofread every line', 'Double-check the venue, date and QR link before sending.'],
                ['📦', 'Zip multiple exports', 'Keeps the review clean and under the 50 MB limit.'],
                ['💬', 'Write a short note', 'Explain what changed since the last draft.'],
              ].map(([icon, title, text]) => (
                <div key={title} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>{title}</div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3, lineHeight: 1.55 }}>
                      {text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={22} style={{ marginBottom: 18 }}>
            <SectionTitle title="How payment is released" />
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                ['1', 'You submit', 'Your files are locked and timestamped in escrow.'],
                ['2', 'Requester reviews', 'Up to 48 hours to approve or request a revision.'],
                ['3', 'Payment released', `${rupees(2000)} lands in your SkillLoop wallet instantly on approval.`],
                ['4', 'Reputation updates', 'Trust score, rating and portfolio all refresh automatically.'],
              ].map(([n, title, text]) => (
                <div key={n} style={{ display: 'flex', gap: 12 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: C.primary + '15',
                      color: C.primary,
                      fontSize: 12,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {n}
                  </span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>{title}</div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3, lineHeight: 1.55 }}>
                      {text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <AICallout title="Auto-check passed">
            Your two attachments cover every deliverable in the brief. Add the editable source file
            to hit a perfect completeness score.
          </AICallout>
        </div>
      </Grid>
    </Shell>
  )
}
