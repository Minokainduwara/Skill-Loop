import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import type { Id } from '../../convex/_generated/dataModel'
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
  Stars,
  StatusBadge,
  Verified,
  rupees,
} from '../components/ui'


const DELIVERABLES = [
  'One A2 print-ready poster (300 dpi, CMYK, with 3 mm bleed)',
  'One square social media version (1080 × 1080) for Instagram and Facebook',
  'One story version (1080 × 1920) with space for the event date overlay',
  'Editable source file (Canva link or .PSD) handed over on completion',
  'Two rounds of revisions included within the agreed timeline',
]

const REQUIREMENTS = [
  'Use the Society colour palette — deep indigo and teal — from the brand sheet',
  'Include the university crest and the three sponsor logos supplied',
  'Sinhala and English headline treatment, English body text',
  'Deliver a first draft within 36 hours so printing can be booked in Kandy',
]

const ATTACHMENTS = [
  { icon: '📄', name: 'robotics-exhibition-brief.pdf', size: '412 KB' },
  { icon: '🗂️', name: 'society-logo-assets.zip', size: '2.1 MB' },
  { icon: '🎨', name: 'brand-colours-sheet.png', size: '188 KB' },
]

const SIMILAR = [
  { title: 'Social Media Kit for Fresher Night', budget: 7500, match: 88, meta: '2.1 km · 9 days left' },
  { title: 'CV & Cover Letter Designer', budget: 1500, match: 84, meta: '0.8 km · 2 days left' },
  { title: 'Product Photography — Handmade Batik', budget: 5200, match: 76, meta: '6.4 km · 13 days left' },
]

export default function OpportunityDetail({ onNavigate, selectedOpportunityId }: PageProps) {
  const [accepted, setAccepted] = useState(false)
  const [saved, setSaved] = useState(false)

  const oppBundle = useQuery(api.queries.opportunityDetail, {
    opportunityId: selectedOpportunityId as Id<'opportunities'>
  })

  if (oppBundle === undefined) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: 16, color: C.muted }}>
        Loading opportunity details...
      </div>
    )
  }

  if (oppBundle === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: 16, color: C.muted }}>
        Opportunity not found.
      </div>
    )
  }

  const { opportunity, skills } = oppBundle
  const budgetVal = opportunity.estimatedBudgetMax || opportunity.estimatedBudgetMin || 2000
  const matchScore = opportunity.demandScore || 96
  const deadlineText = opportunity.expiresAt ? new Date(opportunity.expiresAt).toLocaleDateString() : 'August 15 · 3 days left'

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 20px 120px' }}>
        <PageHead
          onBack={() => onNavigate('opportunities')}
          backLabel="Back to Opportunities"
          title={opportunity.title}
          subtitle={`Posted ${new Date(opportunity.createdAt).toLocaleDateString()} · Status: ${opportunity.status}`}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 22,
            alignItems: 'start',
          }}
          className="sl-detail-grid"
        >
          <style>{`@media (min-width: 980px) { .sl-detail-grid { grid-template-columns: minmax(0,1.65fr) minmax(300px,1fr) !important } }`}</style>

          {/* -------------------------------------------------------- main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
            <Card style={{ animation: 'sl-rise .5s both' }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
                <MatchBadge pct={matchScore} />
                <StatusBadge status="Open" />
                <Badge color={C.muted} bg={C.subtle}>
                  Quick Task
                </Badge>
                <Badge color={C.accent} bg="#CCFBF1">
                  Escrow protected
                </Badge>
              </div>

              <Grid min={170} gap={12}>
                <InfoTile icon="💰" label="Budget" value={rupees(budgetVal)} />
                <InfoTile icon="🗓️" label="Deadline" value={deadlineText} tone={C.warning} />
                <InfoTile icon="📍" label="Location" value="2.4 km away" tone={C.accent} />
              </Grid>

              <Divider />

              <h2 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 800, color: C.text }}>The brief</h2>
              <p style={{ margin: 0, fontSize: 14.5, color: C.muted, lineHeight: 1.75 }}>
                {opportunity.description}
              </p>

              <div style={{ marginTop: 20 }}>
                <h3 style={{ margin: '0 0 10px', fontSize: 14.5, fontWeight: 800, color: C.text }}>Deliverables</h3>
                <BulletList items={DELIVERABLES} tone={C.primary} />
              </div>

              <div style={{ marginTop: 20 }}>
                <h3 style={{ margin: '0 0 10px', fontSize: 14.5, fontWeight: 800, color: C.text }}>Requirements</h3>
                <BulletList items={REQUIREMENTS} tone={C.accent} />
              </div>

              <Divider />

              <h3 style={{ margin: '0 0 10px', fontSize: 14.5, fontWeight: 800, color: C.text }}>Required skills</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {skills.map((s: any) => (
                  <span
                    key={s._id}
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      padding: '6px 12px',
                      borderRadius: 999,
                      color: C.primaryDark,
                      background: '#EEF2FF',
                      border: '1px solid #C7D2FE',
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </Card>

            <Card>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: C.text }}>Attachments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ATTACHMENTS.map((a) => (
                  <div
                    key={a.name}
                    className="sl-press"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 12,
                      border: `1px solid ${C.border}`,
                      background: C.bg,
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{a.icon}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text, flex: 1, minWidth: 0 }}>
                      {a.name}
                    </span>
                    <span style={{ fontSize: 12, color: C.faint, fontWeight: 700 }}>{a.size}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: C.text }}>About the client</h3>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <Avatar name="University Robotics Society" size={52} emoji="🤖" />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15.5, fontWeight: 800, color: C.text }}>
                      University Robotics Society
                    </span>
                    <Verified label="Verified Requester" />
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Stars rating={4.8} />
                    <span style={{ fontSize: 12.5, color: C.muted }}>12 jobs posted</span>
                    <span style={{ fontSize: 12.5, color: C.muted }}>100% payment rate</span>
                  </div>
                </div>
              </div>
              <p style={{ margin: '14px 0 0', fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>
                Member since January 2024 · Faculty of Engineering, University of Peradeniya. Usually replies within
                40 minutes and has released every escrow payment on time.
              </p>
            </Card>

            <Card>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: C.text }}>
                Similar opportunities
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SIMILAR.map((s) => (
                  <div
                    key={s.title}
                    onClick={() => onNavigate('opportunities')}
                    className="sl-press"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '13px 14px',
                      borderRadius: 12,
                      border: `1px solid ${C.border}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
                        {rupees(s.budget)} · {s.meta}
                      </div>
                    </div>
                    <MatchBadge pct={s.match} size="sm" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ----------------------------------------------------- sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>
            <Card style={{ boxShadow: SHADOW.md }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
                <CircleProgress value={96} size={92} label="MATCH" />
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 800, color: C.text }}>Excellent fit</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, lineHeight: 1.55 }}>
                    You rank #1 of 47 nearby students for this request.
                  </div>
                </div>
              </div>

              <MetricBar label="Skill match" value={100} />
              <MetricBar label="Availability" value={95} color={C.accent} />
              <MetricBar label="Experience" value={90} color="#7C3AED" />
              <MetricBar label="Rating" value={90} color={C.warning} />

              <div style={{ marginTop: 6 }}>
                <AICallout title="Why you matched" compact>
                  All four required skills appear in your verified profile, you have 6 free hours this week, and you
                  have delivered 5 posters with an average 4.8-star rating.
                </AICallout>
              </div>
            </Card>

            <Card>
              {accepted ? (
                <div style={{ animation: 'sl-pop .4s both' }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: '#DCFCE7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      marginBottom: 14,
                    }}
                  >
                    ✅
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Opportunity accepted</div>
                  <p style={{ margin: '6px 0 16px', fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
                    Rs. 2,000 is now held in escrow. The requester has been notified and your workspace is ready.
                  </p>
                  <Btn full onClick={() => onNavigate('job-workspace')}>
                    Open Job Workspace
                  </Btn>
                  <div style={{ height: 10 }} />
                  <Btn full variant="secondary" onClick={() => onNavigate('messages')}>
                    Message Requester
                  </Btn>
                </div>
              ) : (
                <>
                  <Btn full size="lg" onClick={() => setAccepted(true)}>
                    Accept Opportunity
                  </Btn>
                  <div style={{ height: 10 }} />
                  <Btn full variant="secondary" onClick={() => onNavigate('messages')}>
                    Message Requester
                  </Btn>
                  <div style={{ height: 10 }} />
                  <Btn full variant="ghost" onClick={() => setSaved((s) => !s)}>
                    {saved ? '★ Saved for later' : '☆ Save for later'}
                  </Btn>
                </>
              )}
            </Card>

            <Card pad={16} style={{ background: '#F0FDFA', borderColor: '#99F6E4' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 18 }}>🛡️</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F766E' }}>Protected by SkillLoop escrow</div>
                  <p style={{ margin: '5px 0 0', fontSize: 12.5, color: '#0F766E', lineHeight: 1.6, opacity: 0.9 }}>
                    The full Rs. 2,000 is locked before you start and released within 24 hours of approval. Keep all
                    files and chat inside SkillLoop so support can help if anything goes wrong.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function BulletList({ items, tone }: { items: string[]; tone: string }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
      {items.map((t) => (
        <li key={t} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: C.muted, lineHeight: 1.65 }}>
          <span style={{ color: tone, fontWeight: 800, flexShrink: 0 }}>▸</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}
