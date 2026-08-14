import { useMemo, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
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
  Stars,
  StatusBadge,
  Verified,
  rupees,
} from '../components/ui'

// Removed all mock data

export default function OpportunityDetail({ onNavigate, data }: PageProps) {
  const [saved, setSaved] = useState(false)
  const jobRequestId = data?.jobRequestId as Id<"jobRequests"> | undefined
  const opportunityId = data?.opportunityId as Id<"opportunities"> | undefined
  const detail = useQuery(api.frontend.opportunityDetail, (jobRequestId || opportunityId) ? { jobRequestId, opportunityId } : 'skip')
  const matchesForJob = useQuery(api.matches.listByJob, jobRequestId ? { jobRequestId } : 'skip')
  const myMatches = useQuery(api.matches.listForStudent, {})
  const jobRequest = detail ? { _id: detail._id, title: detail.title, budgetMax: detail.budgetMax } : null
  const myApplications = useQuery(api.applications.listMine)
  const applyMutation = useMutation(api.applications.apply)
  const getOrCreateChannel = useMutation(api.messages.getOrCreateChannel)
  const user = useQuery(api.users.current)
  
  const currentMatch = myMatches?.find((match) => match.jobRequestId === jobRequestId)
  const matchPct = Math.round((currentMatch?.totalScore ?? 0) * 100)
  const fitLabel = matchPct >= 90 ? 'Excellent fit' : matchPct >= 75 ? 'Strong fit' : 'Potential fit'

  const skillPct = Math.round((currentMatch?.skillScore ?? 0) * 100)
  const availabilityPct = Math.round((currentMatch?.availabilityScore ?? 0) * 100)
  const experiencePct = Math.round((currentMatch?.experienceScore ?? 0) * 100)
  const ratingPct = Math.round((currentMatch?.ratingScore ?? 0) * 100)

  // Check if we have already applied
  const application = myApplications?.find(a => a.jobRequestId === jobRequestId)
  const applied = !!application
  const accepted = application?.status === 'accepted'
  const rank = useMemo(() => {
    if (!matchesForJob || !currentMatch) return null
    const index = matchesForJob.findIndex((match) => match._id === currentMatch._id)
    return index >= 0 ? index + 1 : null
  }, [currentMatch, matchesForJob])
  const totalMatches = matchesForJob?.length ?? 0
  const statusLabel = detail?.status ? detail.status.charAt(0).toUpperCase() + detail.status.slice(1) : 'Open'
  const escrowAmount = detail?.budgetMax ?? detail?.budgetMin

  const handleApply = async () => {
    if (!jobRequest || !jobRequestId) return
    await applyMutation({
      jobRequestId: jobRequestId,
      proposal: "I would love to work on this project! I have the required skills.",
      proposedPrice: jobRequest.budgetMax ?? 2000,
    })
    
    if (user) {
      const channelId = await getOrCreateChannel({
        jobRequestId: jobRequestId,
        studentId: user._id,
      })
      onNavigate('messages', { channelId })
    }
  }

  const handleMessageRequester = async () => {
    if (!jobRequest || !user || !jobRequestId) return
    const channelId = await getOrCreateChannel({
      jobRequestId: jobRequestId,
      studentId: user._id,
    })
    onNavigate('messages', { channelId })
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 20px 120px' }}>
        <PageHead
          onBack={() => onNavigate('opportunities')}
          backLabel="Back to Opportunities"
          title={detail ? detail.title || "Untitled" : "Loading Opportunity..."}
          subtitle={`Posted by ${detail?.requester?.username ?? 'Requester'} · ${detail?.isRemote ? 'Remote' : 'Local'}`}
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
                <MatchBadge pct={matchPct} />
                <StatusBadge status={statusLabel} />
                <Badge color={C.muted} bg={C.subtle}>
                  Quick Task
                </Badge>
                <Badge color={C.accent} bg="#CCFBF1">
                  Escrow protected
                </Badge>
              </div>

              <Grid min={170} gap={12}>
                <InfoTile icon="💰" label="Budget" value={rupees(detail?.budgetMax ?? detail?.budgetMin ?? 0)} />
                <InfoTile icon="🗓️" label="Deadline" value="Flexible" tone={C.warning} />
                <InfoTile icon="📍" label="Location" value={detail?.isRemote ? 'Remote' : 'Local'} tone={C.accent} />
              </Grid>

              <Divider />

              <h2 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 800, color: C.text }}>The brief</h2>
              <p style={{ margin: 0, fontSize: 14.5, color: C.muted, lineHeight: 1.75 }}>
                {detail?.description || 'Loading description...'}
              </p>

              {detail?.requirements?.suggestedSkills && detail.requirements.suggestedSkills.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: 14.5, fontWeight: 800, color: C.text }}>AI Suggested Needs</h3>
                  <BulletList items={["Analysis suggests the following would be helpful: " + detail.requirements.suggestedSkills.join(', ')]} tone={C.primary} />
                </div>
              )}

              <Divider />

              <h3 style={{ margin: '0 0 10px', fontSize: 14.5, fontWeight: 800, color: C.text }}>Required skills</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {detail?.skills?.map((s) => (
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
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: C.text }}>About the client</h3>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <Avatar name={detail?.requester?.username ?? "Requester"} size={52} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15.5, fontWeight: 800, color: C.text }}>
                      {detail?.requester?.username ?? "Requester"}
                    </span>
                    <Verified label="Verified Requester" />
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Stars rating={4.8} />
                    <span style={{ fontSize: 12.5, color: C.muted }}>Verified User</span>
                  </div>
                </div>
              </div>
              <p style={{ margin: '14px 0 0', fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>
                {detail?.requester?.bio || "Requester on SkillLoop."}
              </p>
            </Card>
          </div>

          {/* ----------------------------------------------------- sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>
            <Card style={{ boxShadow: SHADOW.md }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
                <CircleProgress value={matchPct} size={92} label="MATCH" />
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 800, color: C.text }}>{fitLabel}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, lineHeight: 1.55 }}>
                    {rank && totalMatches > 0
                      ? `You rank #${rank} of ${totalMatches} students for this request.`
                      : 'Your match score will appear once the database returns match rows.'}
                  </div>
                </div>
              </div>

              <MetricBar label="Skill match" value={skillPct} />
              <MetricBar label="Availability" value={availabilityPct} color={C.accent} />
              <MetricBar label="Experience" value={experiencePct} color="#7C3AED" />
              <MetricBar label="Rating" value={ratingPct} color={C.warning} />

              <div style={{ marginTop: 6 }}>
                <AICallout title="AI Analysis" compact>
                  {detail?.requirements?.rawResponse ?? "No AI analysis available for this request."}
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
                    {escrowAmount !== undefined ? `${rupees(escrowAmount)} is now held in escrow.` : 'The agreed amount is now held in escrow.'} The requester has been notified and your workspace is ready.
                  </p>
                  <Btn full onClick={() => onNavigate('job-workspace')}>
                    Open Job Workspace
                  </Btn>
                  <div style={{ height: 10 }} />
                  <Btn full variant="secondary" onClick={() => onNavigate('messages')}>
                    Message Requester
                  </Btn>
                </div>
              ) : applied ? (
                <div style={{ animation: 'sl-pop .4s both', textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>⏳</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Application Pending</div>
                  <p style={{ margin: '6px 0 16px', fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
                    Your application has been sent to the requester. You will be notified once they review it!
                  </p>
                  <Btn full variant="secondary" onClick={() => onNavigate('dashboard')}>
                    Back to Dashboard
                  </Btn>
                </div>
              ) : (
                <>
                  <Btn full size="lg" onClick={handleApply} disabled={!detail || !jobRequestId}>
                    Apply for Opportunity
                  </Btn>
                  <div style={{ height: 10 }} />
                  <Btn full variant="secondary" onClick={handleMessageRequester} disabled={!detail || !user || !jobRequestId}>
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
                    {escrowAmount !== undefined ? `The full ${rupees(escrowAmount)} is locked before you start and released within 24 hours of approval.` : 'The full agreed amount is locked before you start and released within 24 hours of approval.'} Keep all
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
