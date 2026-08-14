import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import { Badge, Btn, Card, EmptyState, Grid, PageHead, Shell, C, rupees } from '../components/ui'

export default function MyJobs({ onNavigate }: PageProps) {
  const data = useQuery(api.frontend.studentHome, {})
  if (!data) return <Shell><PageHead title="My jobs" subtitle="Loading your live jobs…" /></Shell>
  return <Shell><PageHead eyebrow="Work" title="My Jobs" subtitle={`${data.jobs.length} job${data.jobs.length === 1 ? '' : 's'} from your account.`} />
    {data.jobs.length === 0 ? <EmptyState emoji="💼" title="No jobs yet" text="Accepted applications will appear here." action={<Btn onClick={() => onNavigate('opportunities')}>Browse opportunities</Btn>} /> : <Grid min={300} gap={16}>{data.jobs.map((job) => <Card key={job._id}><h2 style={{ marginTop: 0, fontSize: 17 }}>{job.request?.title ?? 'Job'}</h2><p style={{ color: C.muted }}>{job.request?.description}</p><Badge color={C.primary}>{job.status.replace('_', ' ')}</Badge><p><strong>{rupees(job.agreedPrice)}</strong>{job.deadline ? ` · Due ${new Date(job.deadline).toLocaleDateString()}` : ''}</p><Btn size="sm" onClick={() => onNavigate('job-workspace')}>Open workspace</Btn></Card>)}</Grid>}
  </Shell>
}
