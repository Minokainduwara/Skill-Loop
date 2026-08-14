import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import { Shell, PageHead, Grid, Card, Badge, Btn, C } from '../components/ui'
import type { Id } from '../../convex/_generated/dataModel'

export default function RequesterApplications({ onNavigate, data }: PageProps) {
  const jobRequestId = data?.jobRequestId as Id<"jobRequests"> | undefined
  const applications = useQuery(api.applications.listByJob, jobRequestId ? { jobRequestId } : 'skip')
  const accept = useMutation(api.applications.accept)
  const reject = useMutation(api.applications.reject)

  if (!jobRequestId) {
    return (
      <Shell>
        <PageHead title="Review Applications" onBack={() => onNavigate('requester-dashboard')} backLabel="Back to Dashboard" />
        <p style={{ color: C.muted }}>No job request selected.</p>
      </Shell>
    )
  }

  return (
    <Shell>
      <PageHead title="Review Applications" onBack={() => onNavigate('requester-dashboard')} backLabel="Back to Dashboard" />
      {applications === undefined ? (
        <p style={{ color: C.muted }}>Loading...</p>
      ) : applications.length === 0 ? (
        <p style={{ color: C.muted }}>No applications yet.</p>
      ) : (
        <Grid>
          {applications.map((app) => (
            <Card key={app._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: C.text }}>Applicant ID: {app.studentId.slice(0, 8)}...</h3>
                  <span style={{ fontSize: 12, color: C.faint }}>Applied {new Date(app._creationTime).toLocaleDateString()}</span>
                </div>
                <Badge color={app.status === 'accepted' ? C.success : app.status === 'rejected' ? C.error : C.muted}>{app.status}</Badge>
              </div>
              <p style={{ margin: '0 0 16px 0', color: C.text, fontSize: 14 }}>{app.proposal || 'No proposal provided.'}</p>
              
              {app.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn onClick={() => accept({ applicationId: app._id })} style={{ background: C.success }}>Accept</Btn>
                  <Btn variant="secondary" onClick={() => reject({ applicationId: app._id })}>Reject</Btn>
                </div>
              )}
            </Card>
          ))}
        </Grid>
      )}
    </Shell>
  )
}
