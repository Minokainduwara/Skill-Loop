import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import {
  AICallout,
  Badge,
  Btn,
  C,
  Card,
  CircleProgress,
  Grid,
  HERO_GRADIENT,
  KPI,
  MatchBadge,
  Progress,
  SectionTitle,
  Shell,
  SkillChip,
  StatusBadge,
  rupees,
} from '../components/ui'

/* ─── data ──────────────────────────────────────────────────────────────── */

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}



const RADAR_BLIPS = [
  { x: 34, y: 30, r: 7, color: '#5EEAD4' },
  { x: 62, y: 24, r: 5, color: '#FDE68A' },
  { x: 72, y: 58, r: 6, color: '#A5B4FC' },
  { x: 44, y: 68, r: 5, color: '#5EEAD4' },
  { x: 22, y: 55, r: 4, color: '#FCA5A5' },
]

/* ─── sub-components ─────────────────────────────────────────────────────── */

function StatPill({ icon, value, label, tone, onClick }: { icon: string; value: string | number; label: string; tone?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: '1 1 0',
        minWidth: 120,
        padding: '16px 18px',
        borderRadius: 16,
        border: `1.5px solid ${C.border}`,
        background: C.surface,
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        transition: 'box-shadow 0.15s, border-color 0.15s',
        boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
      }}
      className="sl-hover"
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.8, color: tone ?? C.text, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.faint }}>{label}</span>
    </button>
  )
}

function UrgencyBar({ urgency }: { urgency: string }) {
  const map: Record<string, { color: string; label: string; w: string }> = {
    high:   { color: '#EF4444', label: 'Urgent',  w: '85%' },
    medium: { color: '#F59E0B', label: 'On track', w: '55%' },
    low:    { color: C.accent,  label: 'Plenty of time', w: '25%' },
  }
  const t = map[urgency] ?? map.low
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.subtle, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: t.w, background: t.color, borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: t.color, whiteSpace: 'nowrap' }}>{t.label}</span>
    </div>
  )
}

/* ─── page ───────────────────────────────────────────────────────────────── */

export default function Dashboard({ onNavigate }: PageProps) {
  const [dismissedTip, setDismissedTip] = useState(false)

  // 1. Fetch real backend data
  const profileData = useQuery(api.queries.myStudentProfile)
  const dbJobs = useQuery(api.queries.myJobs, {})
  const dbMatches = useQuery(api.queries.myMatches, {})
  const dbNotifications = useQuery(api.queries.myNotifications, {})
  const dbOpps = useQuery(api.queries.listOpportunities, {})

  // 2. Fallbacks & Loading states
  const loading = profileData === undefined || dbJobs === undefined || dbMatches === undefined || dbNotifications === undefined || dbOpps === undefined

  if (loading) {
    return (
      <Shell>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontSize: 16, fontWeight: 700, color: C.muted }}>
          Loading your dashboard...
        </div>
      </Shell>
    )
  }

  const user = profileData?.user
  const profile = profileData?.profile

  const name = user?.username || 'Student'
  const trustScore = profile?.profileCompletion || 92
  const rating = profile?.averageRating || 4.8
  const jobsCompleted = profile?.completedJobs || 18
  const earned = profile?.totalEarnings || 24500

  // Filter active jobs from dbJobs
  const activeJobsList = dbJobs.filter((j: any) =>
    ['assigned', 'in_progress', 'submitted', 'revision'].includes(j.job.status)
  )

  const activeJobs = activeJobsList.map((j: any) => ({
    id: j.job._id,
    title: j.jobRequest?.title || 'Job Opportunity',
    client: j.requester?.username || 'Client',
    budget: j.job.agreedPrice,
    deadline: j.job.deadline ? `Due in ${Math.round((j.job.deadline - Date.now()) / (24 * 3600 * 1000))} days` : 'Awaiting deadline',
    urgency: j.job.status === 'revision' ? 'high' : 'medium',
    status: j.job.status,
    progress: j.job.status === 'submitted' ? 100 : j.job.status === 'revision' ? 85 : 50,
    icon: '💼',
  }))

  const urgentJob = activeJobs.find((j: any) => j.urgency === 'high') || activeJobs[0]

  const matches = dbMatches.map((m: any) => ({
    id: m.jobRequest?._id,
    title: m.jobRequest?.title || 'Matched Job',
    match: Math.round(m.match.totalScore * 100),
    budget: m.jobRequest?.budgetMin || 1000,
    deadline: m.jobRequest?.deadline ? `${Math.round((m.jobRequest.deadline - Date.now()) / (24 * 3600 * 1000))} days` : '3 days',
    distance: '1.2 km',
    skills: [],
    icon: '🎯',
  }))

  const totalOppsCount = dbOpps.length || 8

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
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`
    return new Date(createdAt).toLocaleDateString()
  }

  const notifications = dbNotifications.slice(0, 5).map((n: any) => {
    const visuals = getNotificationVisuals(n.type)
    return {
      title: n.title,
      body: n.message,
      icon: visuals.icon,
      tone: visuals.tone,
      unread: !n.isRead,
      time: formatTime(n.createdAt),
    }
  })

  return (
    <Shell>
      {/* ═══════════════════════ GREETING BAR ═══════════════════════════ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: 0.3, marginBottom: 4 }}>
            {getGreeting()}, {name.split(' ')[0]} 👋
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.8, lineHeight: 1.15 }}>
            You have{' '}
            <span style={{ color: C.primary }}>{totalOppsCount} new opportunities</span>{' '}
            waiting.
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <Badge color={C.success} dot>✓ Verified Student</Badge>
            <Badge color={C.accent}>Trust Score {trustScore}</Badge>
            <span style={{ fontSize: 12.5, color: C.faint }}>⭐ {rating} · {jobsCompleted} jobs completed</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" size="sm" onClick={() => onNavigate('profile')}>My Profile</Btn>
          <Btn size="sm" onClick={() => onNavigate('post-need')}>+ Post a Need</Btn>
        </div>
      </div>

      {/* ═══════════════════════ STAT PILLS ══════════════════════════════ */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatPill icon="🎯" value={totalOppsCount} label="New opportunities" tone={C.primary} onClick={() => onNavigate('opportunities')} />
        <StatPill icon="💼" value={activeJobs.length} label="Active jobs" tone={C.accent} onClick={() => onNavigate('my-jobs')} />
        <StatPill icon="💰" value={rupees(earned)} label="Total earned" tone={C.success} onClick={() => onNavigate('earnings')} />
        <StatPill icon="📈" value={rupees(7800)} label="This month" tone="#16A34A" onClick={() => onNavigate('earnings')} />
        <StatPill icon="🛡️" value={`${trustScore}/100`} label="Trust score" tone={C.warning} onClick={() => onNavigate('profile')} />
      </div>

      {/* ═══════════════════════ PRIORITY ACTION ════════════════════════ */}
      {urgentJob && (
        <div
          style={{
            borderRadius: 18,
            border: `2px solid #FEE2E2`,
            background: 'linear-gradient(135deg, #FFF5F5, #FFF)',
            padding: '18px 22px',
            marginBottom: 22,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            {urgentJob.icon}
          </div>
          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#B91C1C', letterSpacing: 0.8 }}>🔴 NEEDS ATTENTION</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{urgentJob.title}</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{urgentJob.client} · <strong style={{ color: '#EF4444' }}>{urgentJob.deadline}</strong></div>
            <UrgencyBar urgency={urgentJob.urgency} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Btn size="sm" onClick={() => onNavigate('job-workspace', { jobId: urgentJob.id })}>Open Job</Btn>
            <Btn variant="secondary" size="sm" onClick={() => onNavigate('submit-work', { jobId: urgentJob.id })}>Submit Work</Btn>
          </div>
        </div>
      )}

      {/* ═══════════════════════ QUICK ACTIONS ══════════════════════════ */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginBottom: 28 }} className="scrollbar-hide">
        {[
          { icon: '📡', label: 'Open Radar', sub: '12 nearby', page: 'radar' as const, accent: C.primary },
          { icon: '🔍', label: 'Browse Jobs', sub: `${totalOppsCount} matched`, page: 'opportunities' as const, accent: '#7C3AED' },
          { icon: '💬', label: 'Messages', sub: '2 unread', page: 'messages' as const, accent: C.accent },
          { icon: '💰', label: 'Earnings', sub: rupees(7800), page: 'earnings' as const, accent: C.success },
          { icon: '👤', label: 'My Profile', sub: `Trust ${trustScore}`, page: 'profile' as const, accent: C.warning },
        ].map(a => (
          <button
            key={a.label}
            onClick={() => onNavigate(a.page)}
            className="sl-press"
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '14px 20px',
              borderRadius: 16,
              border: `1.5px solid ${C.border}`,
              background: C.surface,
              cursor: 'pointer',
              minWidth: 80,
              transition: 'all 0.15s',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${a.accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {a.icon}
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{a.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: a.accent }}>{a.sub}</span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════ RADAR + JOBS ═══════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 20, marginBottom: 28 }}>

        {/* Radar CTA */}
        <div
          style={{ background: HERO_GRADIENT, borderRadius: 22, padding: 26, position: 'relative', overflow: 'hidden', boxShadow: '0 16px 48px rgba(30,27,75,0.3)', cursor: 'pointer' }}
          onClick={() => onNavigate('radar')}
          className="sl-hover"
        >
          <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(20,184,166,0.12)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Badge color="#5EEAD4" bg="rgba(94,234,212,0.14)" dot style={{ marginBottom: 14 }}>
              AI discovery · live now
            </Badge>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
              Opportunity Radar
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
              12 design requests detected within 5 km — roughly {rupees(18500)} of unclaimed local work.
            </p>

            {/* Mini radar vis */}
            <div style={{ width: 140, height: 140, position: 'relative', margin: '0 auto 18px' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 0deg, rgba(20,184,166,0.35), transparent 45%)', animation: 'sl-sweep 4s linear infinite' }} />
              <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'relative' }}>
                {[24, 42, 60].map(r => <circle key={r} cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />)}
                <line x1="70" y1="10" x2="70" y2="130" stroke="rgba(255,255,255,0.1)" />
                <line x1="10" y1="70" x2="130" y2="70" stroke="rgba(255,255,255,0.1)" />
                <circle cx="70" cy="70" r="3" fill="#5EEAD4" />
              </svg>
              {RADAR_BLIPS.map((b, i) => (
                <span key={i}>
                  <span style={{ position: 'absolute', left: `${b.x}%`, top: `${b.y}%`, width: b.r * 2, height: b.r * 2, marginLeft: -b.r, marginTop: -b.r, borderRadius: '50%', background: b.color, boxShadow: `0 0 10px ${b.color}` }} />
                  <span style={{ position: 'absolute', left: `${b.x}%`, top: `${b.y}%`, width: 36, height: 36, marginLeft: -18, marginTop: -18, borderRadius: '50%', border: `1.5px solid ${b.color}`, animation: 'sl-pulse-ring 2.2s ease-out infinite', animationDelay: `${i * 0.35}s` }} />
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 24, marginBottom: 18 }}>
              <KPI value="12" label="New requests" />
              <KPI value={rupees(18500)} label="Potential value" tone="#5EEAD4" />
            </div>

            <Btn variant="accent" size="sm" onClick={() => onNavigate('radar')} style={{ width: '100%', justifyContent: 'center' }}>
              Open Opportunity Radar →
            </Btn>
          </div>
        </div>

        {/* Active jobs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Active Jobs</div>
            <Btn variant="ghost" size="sm" onClick={() => onNavigate('my-jobs')}>All jobs →</Btn>
          </div>

          {activeJobs.length === 0 ? (
            <Card pad={20} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: C.muted }}>
              <span style={{ fontSize: 24, marginBottom: 8 }}>💼</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>No active jobs</span>
            </Card>
          ) : (
            activeJobs.map(j => (
              <Card key={j.id} hover pad={16} onClick={() => onNavigate('job-workspace', { jobId: j.id })}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: j.urgency === 'high' ? '#FEE2E2' : j.urgency === 'medium' ? '#FEF3C7' : '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {j.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 2 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, lineHeight: 1.3 }}>{j.title}</div>
                      <StatusBadge status={j.status === 'in_progress' ? 'Active' : j.status === 'revision' ? 'Active' : j.status === 'submitted' ? 'Pending' : 'Active'} />
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>
                      {j.client} · <strong style={{ color: C.text }}>{rupees(j.budget)}</strong> · {j.deadline}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <Progress value={j.progress} height={5} gradient={j.urgency === 'high' ? 'linear-gradient(90deg,#EF4444,#F97316)' : j.urgency === 'medium' ? `linear-gradient(90deg,${C.warning},#F59E0B)` : `linear-gradient(90deg,${C.primary},${C.accent})`} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: C.text, minWidth: 28, textAlign: 'right' }}>{j.progress}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}

          {/* Earnings month card */}
          <Card pad={18} style={{ background: 'linear-gradient(135deg,#F0FDF4,#fff)', border: `1.5px solid #BBF7D0` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.8 }}>THIS MONTH</div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, color: C.text, marginTop: 4 }}>{rupees(7800)}</div>
                <div style={{ fontSize: 12, color: C.success, fontWeight: 700 }}>↑ +32% vs last month</div>
              </div>
              <CircleProgress value={64} size={62} label="GOAL" strokeColor={C.success} />
            </div>
            <Progress value={64} height={6} gradient={`linear-gradient(90deg,${C.success},${C.accent})`} />
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6, marginBottom: 12 }}>
              64% toward your {rupees(12000)} monthly goal
            </div>
            <Btn variant="ghost" size="sm" onClick={() => onNavigate('earnings')}>View full earnings →</Btn>
          </Card>
        </div>
      </div>

      {/* ═══════════════════════ MATCHED OPPORTUNITIES ══════════════════ */}
      <SectionTitle
        title="Your best matches right now"
        subtitle="Ranked by skill fit, distance and urgency"
        action={<Btn variant="ghost" size="sm" onClick={() => onNavigate('opportunities')}>View all {totalOppsCount} →</Btn>}
        style={{ marginBottom: 14 }}
      />
      <Grid min={260} gap={14} style={{ marginBottom: 28 }}>
        {matches.length === 0 ? (
          <Card pad={20} style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
            <span style={{ fontSize: 24, marginBottom: 8 }}>🎯</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>No matched opportunities right now</span>
          </Card>
        ) : (
          matches.map((m: any, i: number) => (
            <div key={i} className="sl-rise" style={{ animationDelay: `${i * 55}ms` }}>
              <Card hover pad={18} style={{ height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => onNavigate('opportunity-detail', { opportunityId: m.id })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.primary}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{m.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1.3 }}>{m.title}</div>
                  </div>
                  <MatchBadge pct={m.match} size="sm" />
                </div>

                <div style={{ display: 'flex', gap: 12, fontSize: 12.5, color: C.muted, fontWeight: 600, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{ color: C.text, fontWeight: 800 }}>{rupees(m.budget)}</span>
                  <span>🕒 {m.deadline}</span>
                  <span>📍 {m.distance}</span>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {m.skills.map((s: string) => <SkillChip key={s} label={s} />)}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Btn variant="secondary" size="sm" full>View opportunity</Btn>
                </div>
              </Card>
            </div>
          ))
        )}
      </Grid>

      {/* ═══════════════════════ AI TIP + RECENT ACTIVITY ════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20 }}>

        {/* AI tip */}
        {!dismissedTip && (
          <div style={{ minWidth: 0 }}>
            <AICallout
              title="Skill gap: earn Rs. 6,500 more per job"
              action={
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn variant="secondary" size="sm" onClick={() => setDismissedTip(true)}>Dismiss</Btn>
                  <Btn size="sm" onClick={() => onNavigate('skill-demand')}>Learn React →</Btn>
                </div>
              }
            >
              You already know HTML, CSS and JavaScript — you are 72% ready for Web Development jobs.
              Learning React (est. 3 weeks) would unlock 6 more local opportunities each worth up to {rupees(6500)}.
            </AICallout>

            <Card pad={18} style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.faint, letterSpacing: 0.8, marginBottom: 14 }}>SKILL DEMAND NEAR YOU</div>
              {[
                { label: 'Graphic Design', pct: 92, trend: '+18%' },
                { label: 'Video Editing', pct: 74, trend: '+11%' },
                { label: 'Web Dev', pct: 68, trend: '+9%' },
              ].map(s => (
                <div key={s.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{s.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: C.success }}>{s.trend}</span>
                  </div>
                  <Progress value={s.pct} height={5} />
                </div>
              ))}
              <Btn variant="ghost" size="sm" onClick={() => onNavigate('skill-demand')}>Full demand analytics →</Btn>
            </Card>
          </div>
        )}

        {/* Recent activity */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Recent Activity</div>
            <Btn variant="ghost" size="sm" onClick={() => onNavigate('notifications')}>All →</Btn>
          </div>
          <Card pad={8}>
            {notifications.length === 0 ? (
              <div style={{ padding: 18, textAlign: 'center', color: C.muted, fontSize: 12.5 }}>No recent activity</div>
            ) : (
              notifications.map((n: any, i: number) => (
                <div
                  key={i}
                  onClick={() => onNavigate('notifications')}
                  className="sl-link"
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    padding: '12px 12px',
                    cursor: 'pointer',
                    borderTop: i === 0 ? 'none' : `1px solid ${C.subtle}`,
                    borderRadius: 10,
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: n.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {n.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.body}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 10.5, color: C.faint, fontWeight: 600 }}>{n.time}</span>
                    {n.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.primary }} />}
                  </div>
                </div>
              ))
            )}
          </Card>

          {/* Trust score card */}
          <Card pad={18} style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <CircleProgress value={trustScore} size={76} label="TRUST" />
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text, marginBottom: 4 }}>Excellent standing</div>
                <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>
                  {jobsCompleted} jobs · ⭐ {rating} avg · 100% on-time
                </div>
                <div style={{ marginTop: 10 }}>
                  <Btn variant="ghost" size="sm" onClick={() => onNavigate('profile')}>View profile →</Btn>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  )
}

