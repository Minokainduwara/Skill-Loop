import { useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import {
  Avatar,
  Badge,
  Btn,
  C,
  Card,
  EmptyState,
  Grid,
  PageHead,
  Progress,
  Shell,
  StatusBadge,
  Tabs,
  rupees,
} from '../components/ui'

type JobStatus = 'Active' | 'Pending' | 'Completed' | 'Cancelled'

interface Job {
  id: string
  title: string
  client: string
  budget: number
  deadline: string
  progress: number
  status: JobStatus
  category: string
  lastUpdate: string
}


const TABS: { key: JobStatus; label: string }[] = [
  { key: 'Active', label: 'Active' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Completed', label: 'Completed' },
  { key: 'Cancelled', label: 'Cancelled' },
]

export default function MyJobs({ onNavigate }: PageProps) {
  const [tab, setTab] = useState<JobStatus>('Active')
  const dbJobs = useQuery(api.queries.myJobs, {})

  const loading = dbJobs === undefined

  const jobs = useMemo(() => {
    if (!dbJobs) return []
    return dbJobs.map((j: any) => {
      let status: JobStatus = 'Active'
      if (['assigned', 'in_progress', 'submitted', 'revision'].includes(j.job.status)) {
        status = 'Active'
      } else if (j.job.status === 'completed') {
        status = 'Completed'
      } else if (j.job.status === 'cancelled') {
        status = 'Cancelled'
      }
      return {
        id: j.job._id,
        title: j.jobRequest?.title || 'Job Opportunity',
        client: j.requester?.username || 'Client',
        budget: j.job.agreedPrice,
        deadline: j.job.deadline ? `Due on ${new Date(j.job.deadline).toLocaleDateString()}` : 'Awaiting deadline',
        progress: j.job.status === 'completed' ? 100 : j.job.status === 'submitted' ? 100 : j.job.status === 'revision' ? 85 : 50,
        status,
        category: j.jobRequest?.category || 'Category',
        lastUpdate: j.job.status === 'submitted' ? 'Waiting for client review' : j.job.status === 'completed' ? 'Payment released' : 'In progress',
      }
    })
  }, [dbJobs])

  const counts = useMemo(() => {
    const base: Record<JobStatus, number> = { Active: 0, Pending: 0, Completed: 0, Cancelled: 0 }
    for (const j of jobs) base[j.status] += 1
    return base
  }, [jobs])

  const visible = useMemo(() => jobs.filter((j) => j.status === tab), [tab, jobs])

  const summary = [
    { label: 'Active jobs', value: counts['Active'], tone: '#1D4ED8' },
    { label: 'Pending proposals', value: counts['Pending'], tone: C.warning },
    { label: 'Completed', value: counts['Completed'], tone: C.success },
    { label: 'Total earned', value: rupees(jobs.filter(j => j.status === 'Completed').reduce((sum, j) => sum + j.budget, 0)), tone: C.primary },
  ]

  if (loading) {
    return (
      <Shell>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontSize: 16, color: C.muted }}>
          Loading jobs...
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <PageHead
        eyebrow="Workspace"
        title="My Jobs"
        subtitle="Every opportunity you have accepted, submitted or wrapped up — tracked in one loop."
        actions={
          <>
            <Btn variant="secondary" onClick={() => onNavigate('earnings')}>
              View earnings
            </Btn>
            <Btn onClick={() => onNavigate('opportunities')}>Find opportunities</Btn>
          </>
        }
      />

      <div
        className="sl-rise"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 18,
          padding: '18px 8px',
          marginBottom: 22,
        }}
      >
        {summary.map((s, i) => (
          <div
            key={s.label}
            style={{
              flex: '1 1 160px',
              padding: '4px 18px',
              borderLeft: i === 0 ? 'none' : `1px solid ${C.border}`,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.7, color: s.tone }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, marginTop: 3 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <Tabs
        tabs={TABS.map((t) => ({ key: t.key, label: t.label, count: counts[t.key] }))}
        active={tab}
        onChange={(k) => setTab(k as JobStatus)}
      />

      {visible.length === 0 ? (
        <EmptyState
          emoji="🗂️"
          title="Nothing here"
          text="You have no jobs in this category. Browse opportunities to get matched."
          action={<Btn onClick={() => onNavigate('opportunities')}>Browse opportunities</Btn>}
        />
      ) : (
        <Grid min={480} gap={16}>
          {visible.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} onNavigate={onNavigate} />
          ))}
        </Grid>
      )}
    </Shell>
  )
}

function JobCard({
  job,
  index,
  onNavigate,
}: {
  job: Job
  index: number
  onNavigate: PageProps['onNavigate']
}) {
  return (
    <Card hover pad={20} style={{ animation: `sl-rise .5s ${index * 0.06}s both` }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 800, color: C.text, letterSpacing: -0.2 }}>
            {job.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 10 }}>
            <Avatar name={job.client} size={28} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>{job.client}</span>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0 14px' }}>
        <Badge color={C.primary}>💰 {rupees(job.budget)}</Badge>
        <Badge color={job.status === 'Active' ? C.warning : C.muted}>⏱ {job.deadline}</Badge>
        <Badge color={C.accent}>{job.category}</Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <Progress value={job.progress} />
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: C.text, minWidth: 34, textAlign: 'right' }}>
          {job.progress}%
        </span>
      </div>

      <p style={{ margin: '0 0 16px', fontSize: 12.5, color: C.faint, lineHeight: 1.5 }}>
        {job.lastUpdate}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {job.status === 'Active' && (
          <>
            <Btn size="sm" onClick={() => onNavigate('job-workspace', { jobId: job.id })}>
              Open Job
            </Btn>
            <Btn size="sm" variant="secondary" onClick={() => onNavigate('submit-work', { jobId: job.id })}>
              Submit Work
            </Btn>
          </>
        )}
        {job.status === 'Pending' && (
          <>
            <Btn size="sm" onClick={() => onNavigate('opportunity-detail', { opportunityId: job.id })}>
              View Details
            </Btn>
            <Btn size="sm" variant="danger">
              Withdraw
            </Btn>
          </>
        )}
        {job.status === 'Completed' && (
          <>
            <Btn size="sm" variant="secondary" onClick={() => onNavigate('earnings')}>
              View Receipt
            </Btn>
            <Btn size="sm" variant="ghost" onClick={() => onNavigate('portfolio')}>
              Add to Portfolio
            </Btn>
          </>
        )}
        {job.status === 'Cancelled' && (
          <Btn size="sm" variant="secondary" onClick={() => onNavigate('opportunities')}>
            Find Similar
          </Btn>
        )}
      </div>
    </Card>
  )
}
