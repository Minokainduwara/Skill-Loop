import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import { Badge, Btn, Card, EmptyState, Grid, PageHead, Shell, StatCard, C, rupees } from '../components/ui'

export default function Dashboard({ onNavigate }: PageProps) {
  const data = useQuery(api.frontend.studentHome, {})
  if (data === undefined) return <Shell><PageHead title="Dashboard" subtitle="Loading your live workspace…" /></Shell>
  const activeJobs = data.jobs.filter((job) => !['completed', 'cancelled'].includes(job.status))
  const available = data.earnings.filter((earning) => earning.status === 'available').reduce((sum, earning) => sum + earning.netAmount, 0)
  return <Shell>
    <PageHead eyebrow="Your workspace" title={`Welcome, ${data.user.username}`} subtitle="Your live jobs, recommendations, and earnings." actions={<Btn onClick={() => onNavigate('opportunities')}>Browse opportunities</Btn>} />
    <Grid min={180} gap={14} style={{ marginBottom: 24 }}>
      <StatCard icon="💼" label="Active jobs" value={activeJobs.length} />
      <StatCard icon="🎯" label="Recommendations" value={data.matches.length} tone={C.primary} />
      <StatCard icon="💰" label="Available earnings" value={rupees(available)} tone={C.success} />
      <StatCard icon="🔔" label="Unread updates" value={data.notifications.filter((note) => !note.isRead).length} />
    </Grid>
    <Grid min={330} gap={18}>
      <Card><h2 style={{ marginTop: 0 }}>Active jobs</h2>{activeJobs.length === 0 ? <EmptyState emoji="💼" title="No active jobs" text="Accepted work will appear here." /> : activeJobs.map((job) => <div key={job._id} style={{ padding: '12px 0', borderTop: `1px solid ${C.border}` }}><strong>{job.request?.title ?? 'Job'}</strong><div style={{ color: C.muted, fontSize: 13 }}>{job.requester?.username ?? 'Requester'} · {rupees(job.agreedPrice)}</div><Badge color={C.primary}>{job.status.replace('_', ' ')}</Badge></div>)}</Card>
      <Card><h2 style={{ marginTop: 0 }}>Recommended for you</h2>{data.matches.length === 0 ? <EmptyState emoji="🎯" title="No recommendations yet" text="Complete your profile and check back soon." /> : data.matches.slice(0, 5).map((match) => <div key={match._id} style={{ padding: '12px 0', borderTop: `1px solid ${C.border}` }}><strong>{match.request?.title ?? 'Job'}</strong><div style={{ color: C.muted, fontSize: 13 }}>{match.totalScore}% match · {match.matchReason ?? 'Matched to your profile'}</div></div>)}</Card>
    </Grid>
  </Shell>
}
