import { useMemo, useState } from 'react'
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

const JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Robotics Exhibition Poster',
    client: 'University of Ruhuna',
    budget: 2000,
    deadline: '2 days left',
    progress: 65,
    status: 'Active',
    category: 'Graphic Design',
    lastUpdate: 'You uploaded draft v2 · 3 hours ago',
  },
  {
    id: 'j2',
    title: 'Spice Menu Redesign (A4 + Digital)',
    client: 'Machan Resturant',
    budget: 3500,
    deadline: '5 days left',
    progress: 40,
    status: 'Active',
    category: 'Graphic Design',
    lastUpdate: 'Lahiru approved the colour palette · Yesterday',
  },
  {
    id: 'j3',
    title: 'BST Lab Data Entry — Semester 2',
    client: 'Faculty of Technology',
    budget: 1800,
    deadline: '9 days left',
    progress: 20,
    status: 'Active',
    category: 'Data Entry',
    lastUpdate: 'Sheet 3 of 12 verified · 2 days ago',
  },
  {
    id: 'j4',
    title: 'Instagram Reel Edit — Budget Food shop',
    client: 'Hunduwa Canteen',
    budget: 2500,
    deadline: 'Awaiting confirmation',
    progress: 0,
    status: 'Pending',
    category: 'Video Editing',
    lastUpdate: 'Proposal sent to Avishka ishan · 6 hours ago',
  },
  {
    id: 'j5',
    title: 'Sinhala–English Translation of Event Flyer',
    client: 'FOT Career Circle',
    budget: 1200,
    deadline: 'Awaiting confirmation',
    progress: 0,
    status: 'Pending',
    category: 'Translation',
    lastUpdate: 'Requester is reviewing 4 proposals · Yesterday',
  },
  {
    id: 'j6',
    title: 'Society Membership Certificate Template',
    client: 'University of Ruhuna FOT',
    budget: 1500,
    deadline: 'Delivered 18 Jul',
    progress: 100,
    status: 'Completed',
    category: 'Graphic Design',
    lastUpdate: 'Payment released · 5-star review from Chehan Mendiya',
  },
  {
    id: 'j7',
    title: 'ICT Java OOP concepts',
    client: 'Faculty of Technology',
    budget: 2200,
    deadline: 'Delivered 09 Jul',
    progress: 100,
    status: 'Completed',
    category: 'Presentation Design',
    lastUpdate: 'Payment released · Reviewed by Dr. Anura Rajapaksa',
  },
  {
    id: 'j8',
    title: 'Colombo Startup Pitch Deck Polish',
    client: 'LoopLab Colombo',
    budget: 4000,
    deadline: 'Delivered 28 Jun',
    progress: 100,
    status: 'Completed',
    category: 'Presentation Design',
    lastUpdate: 'Payment released · Repeat client',
  },
  {
    id: 'j9',
    title: 'Batch Trip T-shirt Artwork',
    client: 'ICT Batch of 2022',
    budget: 1800,
    deadline: 'Delivered 14 Jun',
    progress: 100,
    status: 'Completed',
    category: 'Illustration',
    lastUpdate: 'Payment released · Added to portfolio',
  },
  {
    id: 'j10',
    title: 'Kandy Heritage Walk Map Illustration',
    client: 'Tharindu Weerasinghe',
    budget: 2600,
    deadline: 'Delivered 02 Jun',
    progress: 100,
    status: 'Completed',
    category: 'Illustration',
    lastUpdate: 'Payment released · 4.9 rating',
  },
]

const TABS: { key: JobStatus; label: string }[] = [
  { key: 'Active', label: 'Active' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Completed', label: 'Completed' },
  { key: 'Cancelled', label: 'Cancelled' },
]

export default function MyJobs({ onNavigate }: PageProps) {
  const [tab, setTab] = useState<JobStatus>('Active')

  const counts = useMemo(() => {
    const base: Record<JobStatus, number> = { Active: 0, Pending: 0, Completed: 0, Cancelled: 0 }
    for (const j of JOBS) base[j.status] += 1
    return base
  }, [])

  const visible = useMemo(() => JOBS.filter((j) => j.status === tab), [tab])

  const summary = [
    { label: 'Active jobs', value: '3', tone: '#1D4ED8' },
    { label: 'Pending proposals', value: '2', tone: C.warning },
    { label: 'Completed', value: '18', tone: C.success },
    { label: 'Total earned', value: rupees(24500), tone: C.primary },
  ]

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
          title="Nothing cancelled"
          text="You have never dropped a job — that consistency is a big part of your 92 trust score. Keep the streak going."
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
            <Btn size="sm" onClick={() => onNavigate('job-workspace')}>
              Open Job
            </Btn>
            <Btn size="sm" variant="secondary" onClick={() => onNavigate('submit-work')}>
              Submit Work
            </Btn>
          </>
        )}
        {job.status === 'Pending' && (
          <>
            <Btn size="sm" onClick={() => onNavigate('opportunity-detail')}>
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
