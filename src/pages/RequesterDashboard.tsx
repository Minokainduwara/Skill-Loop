import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import { Shell, PageHead, Grid, Card, Badge, Btn, C } from '../components/ui'

export default function RequesterDashboard({ onNavigate }: PageProps) {
  const jobRequests = useQuery(api.jobRequests.listByRequester)

  return (
    <Shell>
      <PageHead title="Requester Dashboard" subtitle="Manage your posted requests" />
      {jobRequests === undefined ? (
        <p style={{ color: C.muted }}>Loading...</p>
      ) : jobRequests.length === 0 ? (
        <p style={{ color: C.muted }}>No job requests posted yet.</p>
      ) : (
        <Grid>
          {jobRequests.map((job) => (
            <Card key={job._id} onClick={() => onNavigate('requester-applications', { jobRequestId: job._id })} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: C.text }}>{job.title}</h3>
                <Badge color={job.status === 'open' ? C.success : C.muted}>{job.status}</Badge>
              </div>
              <p style={{ margin: '0 0 16px 0', color: C.muted, fontSize: 14 }}>{job.description.length > 100 ? job.description.slice(0, 100) + '...' : job.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: C.faint }}>
                  Budget: ₹{job.budgetMax ?? job.budgetMin ?? 0} • Posted {new Date(job._creationTime).toLocaleDateString()}
                </span>
                <Btn size="sm" variant="secondary" onClick={() => onNavigate('requester-applications', { jobRequestId: job._id })}>View Applications</Btn>
              </div>
            </Card>
          ))}
        </Grid>
      )}
    </Shell>
  )
}
