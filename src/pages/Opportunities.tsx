import { useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import { Badge, Btn, Card, EmptyState, Grid, PageHead, SearchInput, Shell, SkillChip, C, rupees } from '../components/ui'

export default function Opportunities({ onNavigate }: PageProps) {
  const opportunities = useQuery(api.frontend.opportunityFeed, {})
  const [search, setSearch] = useState('')
  const list = useMemo(() => (opportunities ?? []).filter((job) => [job.title, job.description, job.category ?? '', ...job.skills.map((skill) => skill.name)].join(' ').toLowerCase().includes(search.toLowerCase())), [opportunities, search])
  return <Shell><PageHead eyebrow="Live marketplace" title="Opportunities" subtitle={`${list.length} open request${list.length === 1 ? '' : 's'} from the database.`} actions={<Btn variant="secondary" onClick={() => onNavigate('radar')}>View demand</Btn>} />
    <SearchInput value={search} onChange={setSearch} placeholder="Search open requests…" />
    <div style={{ height: 18 }} />
    {opportunities === undefined ? <Card>Loading opportunities…</Card> : list.length === 0 ? <EmptyState emoji="🧭" title="No open opportunities" text="New requests will appear here as they are posted." /> : <Grid min={300} gap={16}>{list.map((job) => <Card key={job._id}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><h2 style={{ margin: 0, fontSize: 17 }}>{job.title}</h2><Badge color={C.success}>{job.isRemote ? 'Remote' : 'Local'}</Badge></div><p style={{ color: C.muted, lineHeight: 1.55 }}>{job.description}</p><strong>{rupees(job.estimatedBudgetMax ?? job.estimatedBudgetMin ?? 0)}</strong><div style={{ color: C.muted, fontSize: 13, marginTop: 5 }}>{job.requester?.username ?? 'Requester'} · {job.category ?? 'General'}</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '14px 0' }}>{job.skills.map((skill) => <SkillChip key={skill._id} label={skill.name} />)}</div>{job.jobRequestId && <Btn size="sm" onClick={() => onNavigate('opportunity-detail', { jobRequestId: job.jobRequestId })}>View details</Btn>}</Card>)}</Grid>}
  </Shell>
}
