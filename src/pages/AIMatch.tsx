import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import {
  AICallout,
  Avatar,
  Badge,
  Btn,
  C,
  Card,
  CircleProgress,
  Divider,
  Grid,
  InfoTile,
  MatchBadge,
  MetricBar,
  PageHead,
  SHADOW,
  SectionTitle,
  Stars,
  Verified,
  rupees,
} from '../components/ui'



const MEDALS: Record<number, { emoji: string; bg: string; color: string }> = {
  1: { emoji: '🥇', bg: '#FEF3C7', color: '#B45309' },
  2: { emoji: '🥈', bg: '#F1F5F9', color: '#475569' },
  3: { emoji: '🥉', bg: '#FFEDD5', color: '#C2410C' },
}

const FACTORS = [
  { icon: '🎯', label: 'Skill match', weight: '40%', text: 'Verified skills compared against the skills extracted from the request.' },
  { icon: '🗓️', label: 'Availability', weight: '25%', text: 'Free hours declared this week measured against the deadline.' },
  { icon: '🧰', label: 'Experience', weight: '20%', text: 'Completed jobs in the same category plus portfolio depth.' },
  { icon: '⭐', label: 'Rating & trust', weight: '15%', text: 'Average review score, on-time delivery and verification status.' },
]

export default function AIMatch({ onNavigate }: PageProps) {
  const [expanded, setExpanded] = useState('c1')
  const [assigned, setAssigned] = useState<string | null>(null)

  const CANDIDATES = useQuery(api.dashboard.getBestCandidates, {}) || []
  const REQUIRED_SKILLS = useQuery(api.dashboard.getJobRequirements, {}) || []
  const request = useQuery(api.dashboard.getRequestDetails, {})

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 20px 120px' }}>
        <PageHead
          eyebrow="Matching engine"
          title="AI Match"
          subtitle="SkillLoop reads the request, extracts the skills it needs, then ranks nearby verified students. No bidding, no proposals."
          onBack={() => onNavigate('post-need')}
          backLabel="Back to Post a Need"
        />

        {/* ----------------------------------------------- request context */}
        <Card style={{ marginBottom: 22, animation: 'sl-rise .5s both' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Avatar name={request?.requester ?? "Requester"} size={48} emoji="🤖" />
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.faint, letterSpacing: 0.8 }}>THE REQUEST</div>
              <blockquote
                style={{
                  margin: '8px 0 0',
                  paddingLeft: 14,
                  borderLeft: `3px solid ${C.primary}`,
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.text,
                  lineHeight: 1.5,
                  letterSpacing: -0.2,
                }}
              >
                {request?.title ?? "Loading request…"}
              </blockquote>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 10 }}>
                {request ? `${request.requester} · ${request.area} · posted ${request.postedLabel}` : ' '}
              </div>
            </div>
          </div>

          <Divider />

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0,1fr)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 9 }}>
                Required skills extracted
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {REQUIRED_SKILLS.map((s, i) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      padding: '6px 12px',
                      borderRadius: 999,
                      color: C.primaryDark,
                      background: '#EEF2FF',
                      border: '1px solid #C7D2FE',
                      animation: `sl-pop .4s ${0.1 + i * 0.08}s both`,
                    }}
                  >
                    ✦ {s}
                  </span>
                ))}
              </div>
            </div>
            <Grid min={165} gap={12}>
              <InfoTile icon="💰" label="Budget" value={rupees(request?.budget ?? 0)} />
              <InfoTile icon="⏳" label="Deadline" value={request?.deadlineDays != null ? `${request.deadlineDays} days` : 'Flexible'} tone={C.warning} />
              <InfoTile icon="📍" label="Radius" value={`Within 5 km · ${request?.area ?? ''}`} tone={C.accent} />
            </Grid>
          </div>

          <div style={{ marginTop: 18 }}>
            <AICallout title="Skills auto-extracted from the description" compact>
              No skill tags were entered manually — the engine inferred all four from the wording of the request and
              matched them against verified student profiles nearby.
            </AICallout>
          </div>
        </Card>

        <SectionTitle
          title={`${CANDIDATES.length} strong match${CANDIDATES.length === 1 ? '' : 'es'} from ${Math.max(CANDIDATES.length, 1)} candidates scanned`}
          subtitle="Ranked by weighted match score"
          action={
            <Badge color={C.accent} bg="#CCFBF1" dot>
              Live ranking
            </Badge>
          }
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 30 }}>
          {CANDIDATES.map((c: any, i: number) => {
            const medal = MEDALS[c.rank] || MEDALS[3]
            const open = expanded === c.id
            const isAssigned = assigned === c.id
            return (
              <Card
                key={c.id}
                pad={0}
                style={{
                  overflow: 'hidden',
                  borderColor: open ? '#C7D2FE' : C.border,
                  boxShadow: open ? SHADOW.md : SHADOW.card,
                  animation: `sl-rise .5s cubic-bezier(.22,1,.36,1) ${i * 0.08}s both`,
                }}
              >
                <div
                  onClick={() => setExpanded(open ? '' : c.id)}
                  style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    padding: 22,
                    cursor: 'pointer',
                    flexWrap: 'wrap',
                    background: open ? 'linear-gradient(120deg, #FAFAFF 0%, #F5FEFC 100%)' : C.surface,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: medal.bg,
                      color: medal.color,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {medal.emoji}
                  </div>
                  <Avatar name={c.name} size={52} ring />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: C.faint }}>#{c.rank}</span>
                      <span style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: -0.3 }}>
                        {c.name}
                      </span>
                      <Verified />
                    </div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>{c.program}</div>
                    <div style={{ marginTop: 8 }}>
                      <MatchBadge pct={c.match} size="sm" />
                    </div>
                  </div>
                  <CircleProgress value={c.match} size={84} label="MATCH" />
                  <span style={{ fontSize: 13, color: C.faint, fontWeight: 800 }}>{open ? '▲' : '▼'}</span>
                </div>

                {open && (
                  <div style={{ padding: '0 22px 22px', animation: 'sl-rise .35s both' }}>
                    <div style={{ height: 1, background: C.border, marginBottom: 18 }} />
                    <Grid min={260} gap={22}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 12 }}>
                          Score breakdown
                        </div>
                        <MetricBar label="Skill match" value={c.skill} />
                        <MetricBar label="Availability" value={c.availability} color={C.accent} />
                        <MetricBar label="Experience" value={c.experience} color="#7C3AED" />
                        <MetricBar label="Rating" value={c.ratingScore} color={C.warning} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 12 }}>
                          Track record
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
                            gap: 12,
                            marginBottom: 14,
                          }}
                        >
                          <Stat label="Rating" node={<Stars rating={c.rating} />} />
                          <Stat label="Jobs completed" node={<strong style={{ fontSize: 15 }}>{c.jobs}</strong>} />
                          <Stat label="On-time" node={<strong style={{ fontSize: 15 }}>{c.onTime}%</strong>} />
                          <Stat label="Avg response" node={<strong style={{ fontSize: 15 }}>{c.response}</strong>} />
                          <Stat
                            label="Earned on SkillLoop"
                            node={<strong style={{ fontSize: 15 }}>{rupees(c.earned)}</strong>}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                          {c.skills?.map((s: string) => (
                            <span
                              key={s}
                              style={{
                                fontSize: 11.5,
                                fontWeight: 700,
                                padding: '4px 10px',
                                borderRadius: 999,
                                color: REQUIRED_SKILLS.includes(s) ? C.primaryDark : C.muted,
                                background: REQUIRED_SKILLS.includes(s) ? '#EEF2FF' : C.subtle,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Grid>

                    <div style={{ marginTop: 18 }}>
                      <AICallout title={`Why ${c.name.split(' ')[0]} ranks #${c.rank}`} compact>
                        {c.note}
                      </AICallout>
                    </div>

                    {isAssigned ? (
                      <div
                        style={{
                          marginTop: 16,
                          padding: 16,
                          borderRadius: 14,
                          background: '#DCFCE7',
                          border: '1px solid #86EFAC',
                          animation: 'sl-pop .4s both',
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#15803D' }}>
                          ✅ {c.name} has been invited and assigned
                        </div>
                        <p style={{ margin: '6px 0 14px', fontSize: 13, color: '#166534', lineHeight: 1.6 }}>
                          Rs. 2,000 moved into escrow. A shared workspace has been created for the poster brief.
                        </p>
                        <Btn size="sm" onClick={() => onNavigate('job-workspace')}>
                          Open Job Workspace
                        </Btn>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                        <Btn onClick={() => setAssigned(c.id)}>Invite / Assign</Btn>
                        <Btn variant="secondary" onClick={() => onNavigate('profile')}>
                          View Profile
                        </Btn>
                        <Btn variant="ghost" onClick={() => onNavigate('messages')}>
                          Message
                        </Btn>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* --------------------------------------------------- explainer */}
        <Card>
          <SectionTitle
            title="How SkillLoop ranks matches"
            subtitle="A transparent weighted score — the same four factors for every request."
          />
          <Grid min={230} gap={14}>
            {FACTORS.map((f) => (
              <div
                key={f.label}
                style={{ padding: 16, borderRadius: 14, border: `1px solid ${C.border}`, background: C.bg }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                  <Badge>{f.weight}</Badge>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginTop: 12 }}>{f.label}</div>
                <p style={{ margin: '6px 0 0', fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>{f.text}</p>
              </div>
            ))}
          </Grid>
        </Card>
      </div>
    </div>
  )
}

function Stat({ label, node }: { label: string; node: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 700, marginBottom: 3 }}>{label}</div>
      <div style={{ color: C.text }}>{node}</div>
    </div>
  )
}
