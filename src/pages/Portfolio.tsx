import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import { Btn, Card, EmptyState, Field, Grid, Input, PageHead, Shell, Textarea, C } from '../components/ui'

export default function Portfolio({ onNavigate }: PageProps) {
  const projects = useQuery(api.portfolios.listMine, {})
  const create = useMutation(api.portfolios.create)
  const [title, setTitle] = useState(''); const [category, setCategory] = useState(''); const [description, setDescription] = useState(''); const [saving, setSaving] = useState(false)
  const save = async () => { if (!title.trim() || saving) return; setSaving(true); try { await create({ title: title.trim(), category: category.trim() || 'General', description: description.trim() || undefined, skills: [] }); setTitle(''); setCategory(''); setDescription('') } finally { setSaving(false) } }
  return <Shell><PageHead eyebrow="Your work" title="Portfolio" subtitle="Projects stored in your SkillLoop profile." actions={<Btn variant="secondary" onClick={() => onNavigate('profile')}>Back to profile</Btn>} />
    <Card style={{ marginBottom: 22 }}><Grid min={240} gap={12}><Field label="Project title"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field><Field label="Category"><Input value={category} onChange={(e) => setCategory(e.target.value)} /></Field></Grid><Field label="Description"><Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Field><Btn onClick={save} disabled={!title.trim() || saving}>{saving ? 'Saving…' : 'Add project'}</Btn></Card>
    {projects === undefined ? <Card>Loading projects…</Card> : projects.length === 0 ? <EmptyState emoji="📁" title="No portfolio projects" text="Add your first project above." /> : <Grid min={280} gap={16}>{projects.map((project) => <Card key={project._id}><h2 style={{ marginTop: 0, fontSize: 17 }}>{project.title}</h2><div style={{ color: C.muted }}>{project.category}</div><p>{project.description}</p>{project.projectUrl && <a href={project.projectUrl} target="_blank" rel="noreferrer">Open project</a>}</Card>)}</Grid>}
  </Shell>
}
