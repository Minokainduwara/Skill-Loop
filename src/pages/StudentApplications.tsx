import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import { Badge, Btn, Card, C, EmptyState, Grid, PageHead, Shell } from '../components/ui'

export default function StudentApplications({ onNavigate }: PageProps) {
  const applications = useQuery(api.applications.listMine)

  return (
    <Shell>
      <PageHead
        title="My Applications"
        subtitle="Track the status of the job requests you have applied to."
      />

      {applications === undefined ? (
        <Card>Loading applications...</Card>
      ) : applications.length === 0 ? (
        <EmptyState
          emoji="📝"
          title="No applications yet"
          text="Browse the live marketplace and apply to a job request to get started."
          action={<Btn onClick={() => onNavigate('opportunities')}>Browse Opportunities</Btn>}
        />
      ) : (
        <Grid min={300} gap={16}>
          {applications.map((app) => (
            <Card key={app._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>Applied on {new Date(app._creationTime).toLocaleDateString()}</h3>
                </div>
                <Badge color={app.status === 'accepted' ? C.success : app.status === 'rejected' ? C.error : C.muted}>{app.status}</Badge>
              </div>
              <p style={{ color: C.text, fontSize: 14 }}>{app.proposal}</p>
            </Card>
          ))}
        </Grid>
      )}
    </Shell>
  )
}
