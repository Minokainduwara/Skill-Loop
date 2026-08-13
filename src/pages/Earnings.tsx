import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import { Badge, Card, EmptyState, Grid, PageHead, Shell, StatCard, C, rupees } from '../components/ui'

export default function Earnings(_: PageProps) {
  void _
  const data = useQuery(api.frontend.studentHome, {})
  if (!data) return <Shell><PageHead title="Earnings" subtitle="Loading your earnings…" /></Shell>
  const total = data.earnings.reduce((sum, earning) => sum + earning.netAmount, 0)
  const available = data.earnings.filter((earning) => earning.status === 'available').reduce((sum, earning) => sum + earning.netAmount, 0)
  return <Shell><PageHead eyebrow="Payments" title="Earnings" subtitle="Payment records from completed work." /><Grid min={200} gap={14} style={{ marginBottom: 24 }}><StatCard icon="💰" label="Total earned" value={rupees(total)} tone={C.success} /><StatCard icon="🏦" label="Available" value={rupees(available)} tone={C.primary} /><StatCard icon="📄" label="Transactions" value={data.earnings.length} /></Grid>{data.earnings.length === 0 ? <EmptyState emoji="💰" title="No earnings yet" text="Approved work creates an earning record here." /> : <Card pad={0}>{data.earnings.map((earning) => <div key={earning._id} style={{ padding: 16, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}><span>{new Date(earning.createdAt).toLocaleDateString()}</span><strong>{rupees(earning.netAmount)}</strong><Badge color={earning.status === 'available' ? C.success : C.muted}>{earning.status}</Badge></div>)}</Card>}</Shell>
}
