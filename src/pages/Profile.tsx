import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import { Badge, Btn, Card, EmptyState, Grid, PageHead, Shell, SkillChip, StatCard, C } from '../components/ui'

export default function Profile({ onNavigate }: PageProps) {
  const data = useQuery(api.frontend.profile, {})
  if (!data) return <Shell><PageHead title="Profile" subtitle="Loading your profile…" /></Shell>
  return <Shell><PageHead eyebrow="Student profile" title={data.user.username} subtitle={[data.profile?.university, data.profile?.degree, data.user.location].filter(Boolean).join(' · ') || 'Complete your profile to improve matching.'} actions={<Btn onClick={() => onNavigate('portfolio')}>Portfolio</Btn>} />
    <Grid min={180} gap={14} style={{ marginBottom: 24 }}><StatCard icon="⭐" label="Average rating" value={data.profile?.averageRating ?? 0} /><StatCard icon="✅" label="Completed jobs" value={data.profile?.completedJobs ?? 0} /><StatCard icon="💰" label="Total earned" value={`Rs. ${data.profile?.totalEarnings ?? 0}`} tone={C.success} /></Grid>
    <Card style={{ marginBottom: 18 }}><h2 style={{ marginTop: 0 }}>Skills</h2>{data.skills.length ? <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{data.skills.map((link) => link.skill && <SkillChip key={link._id} label={`${link.skill.name} · ${link.proficiencyLevel}`} />)}</div> : <EmptyState emoji="✨" title="No skills added" text="Complete onboarding to add your skills." />}</Card>
    <Card><h2 style={{ marginTop: 0 }}>Reviews</h2>{data.reviews.length ? data.reviews.map((review) => <div key={review._id} style={{ padding: '12px 0', borderTop: `1px solid ${C.border}` }}><Badge color={C.warning}>★ {review.rating}</Badge><p>{review.comment ?? 'No written feedback.'}</p></div>) : <EmptyState emoji="⭐" title="No reviews yet" text="Reviews appear after completed jobs." />}</Card>
  </Shell>
}
