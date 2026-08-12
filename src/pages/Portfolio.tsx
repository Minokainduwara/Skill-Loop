import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import type { PageProps } from '../types'
import {
  Avatar,
  BRAND_GRADIENT,
  Badge,
  Btn,
  C,
  Card,
  Divider,
  EmptyState,
  Field,
  Grid,
  Input,
  PageHead,
  SHADOW,
  SectionTitle,
  Select,
  Shell,
  SkillChip,
  StatCard,
  Stars,
  Textarea,
  rupees,
} from '../components/ui'

type Category =
  | 'Graphic Design'
  | 'Video Editing'
  | 'Web Development'
  | 'Tutoring'
  | 'Photography'

interface Project {
  id: string
  title: string
  role: string
  category: Category
  skills: string[]
  rating: number
  date: string
  client: string
  earned: number
  emoji: string
  gradient: string
}

const CATEGORIES: Category[] = [
  'Graphic Design',
  'Video Editing',
  'Web Development',
  'Tutoring',
  'Photography',
]

const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Robotics Exhibition Poster',
    role: 'Lead Designer',
    category: 'Graphic Design',
    skills: ['Graphic Design', 'Canva'],
    rating: 5,
    date: 'Jul 2026',
    client: 'University Robotics Society',
    earned: 2000,
    emoji: '🤖',
    gradient: 'linear-gradient(135deg,#4F46E5,#14B8A6)',
  },
  {
    id: 'p2',
    title: 'Spice Kitchen Menu Redesign',
    role: 'Print Designer',
    category: 'Graphic Design',
    skills: ['Illustrator', 'Print Layout'],
    rating: 5,
    date: 'Jun 2026',
    client: 'Kandy Spice Kitchen',
    earned: 3500,
    emoji: '🍛',
    gradient: 'linear-gradient(135deg,#F59E0B,#EF4444)',
  },
  {
    id: 'p3',
    title: 'Lecture Series Promo Reel',
    role: 'Video Editor',
    category: 'Video Editing',
    skills: ['Video Editing', 'Motion Titles'],
    rating: 4,
    date: 'May 2026',
    client: 'Dr. Anura Rajapaksa',
    earned: 4200,
    emoji: '🎬',
    gradient: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
  },
  {
    id: 'p4',
    title: 'Boutique Instagram Kit',
    role: 'Social Designer',
    category: 'Graphic Design',
    skills: ['Canva', 'Social Media'],
    rating: 5,
    date: 'Apr 2026',
    client: 'Nimali Jayasuriya',
    earned: 1800,
    emoji: '👗',
    gradient: 'linear-gradient(135deg,#14B8A6,#0F766E)',
  },
  {
    id: 'p5',
    title: 'Society Landing Page',
    role: 'Front-end Developer',
    category: 'Web Development',
    skills: ['HTML/CSS', 'Web Development'],
    rating: 4,
    date: 'Mar 2026',
    client: 'University Robotics Society',
    earned: 5000,
    emoji: '💻',
    gradient: 'linear-gradient(135deg,#1E1B4B,#4F46E5)',
  },
  {
    id: 'p6',
    title: 'A/L ICT Revision Sessions',
    role: 'Tutor',
    category: 'Tutoring',
    skills: ['Tutoring', 'ICT'],
    rating: 5,
    date: 'Feb 2026',
    client: 'Dr. Anura Rajapaksa',
    earned: 3000,
    emoji: '📘',
    gradient: 'linear-gradient(135deg,#0EA5E9,#14B8A6)',
  },
  {
    id: 'p7',
    title: 'Kandy Food Photo Set',
    role: 'Photographer',
    category: 'Photography',
    skills: ['Photography', 'Lightroom'],
    rating: 5,
    date: 'Jan 2026',
    client: 'Kandy Spice Kitchen',
    earned: 2500,
    emoji: '📸',
    gradient: 'linear-gradient(135deg,#BE185D,#F59E0B)',
  },
  {
    id: 'p8',
    title: 'Colombo Expo Reels Pack',
    role: 'Video Editor',
    category: 'Video Editing',
    skills: ['Video Editing', 'Captions'],
    rating: 4,
    date: 'Dec 2025',
    client: 'Nimali Jayasuriya',
    earned: 1500,
    emoji: '🎞',
    gradient: 'linear-gradient(135deg,#312E81,#0F766E)',
  },
  {
    id: 'p9',
    title: 'Freshers Week Badge Set',
    role: 'Designer',
    category: 'Graphic Design',
    skills: ['Photoshop', 'Branding'],
    rating: 5,
    date: 'Nov 2025',
    client: 'University Robotics Society',
    earned: 1000,
    emoji: '🎟',
    gradient: 'linear-gradient(135deg,#4F46E5,#BE185D)',
  },
]

const FEATURED = PROJECTS[0]

export default function Portfolio({ onNavigate }: PageProps) {
  const [filter, setFilter] = useState<'All' | Category>('All')
  const [showForm, setShowForm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'Graphic Design',
    skills: '',
    description: '',
  })
  const taxonomy = useQuery(api.skills.list, {})
  const createPortfolio = useMutation(api.portfolios.create)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const visible = useMemo(
    () => (filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter],
  )

  const totalEarned = PROJECTS.reduce((a, p) => a + p.earned, 0)
  const avgRating = PROJECTS.reduce((a, p) => a + p.rating, 0) / PROJECTS.length

  const save = async () => {
    if (!form.title.trim() || isSaving) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const skillIds = form.skills
        .split(',')
        .map((name) => taxonomy?.find((skill) => skill.name.toLowerCase() === name.trim().toLowerCase())?._id)
        .filter((id): id is Id<'skills'> => Boolean(id))
      await createPortfolio({
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim() || undefined,
        skills: skillIds,
      })
      setShowForm(false)
      setSaved(true)
      setForm({ title: '', category: 'Graphic Design', skills: '', description: '' })
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Unable to save this project. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Shell>
      <PageHead
        eyebrow="Your work"
        title="My Portfolio"
        subtitle={`9 projects · ${rupees(totalEarned)} earned · ${avgRating.toFixed(1)} average rating`}
        actions={
          <>
            <Btn variant="secondary" onClick={() => onNavigate('profile')}>
              ← Back to profile
            </Btn>
            <Btn
              onClick={() => {
                setShowForm((s) => !s)
                setSaved(false)
              }}
            >
              + Add Portfolio
            </Btn>
          </>
        }
      />

      {saved && (
        <Card
          pad={14}
          style={{
            marginBottom: 18,
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>✅</span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#15803D' }}>
            Project saved to your portfolio — it will appear once reviewed.
          </span>
        </Card>
      )}

      {showForm && (
        <Card style={{ marginBottom: 20 }} pad={24}>
          <div className="sl-rise">
            <SectionTitle
              title="Add a project"
              subtitle="Showcase completed work so requesters can judge your quality fast."
            />
            <Grid min={280} gap={16}>
              <Field label="Project title">
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Robotics Exhibition Poster"
                />
              </Field>
              <Field label="Category">
                <Select
                  value={form.category}
                  onChange={(v) => setForm({ ...form, category: v })}
                  options={CATEGORIES}
                />
              </Field>
            </Grid>
            <Field label="Skills used" hint="Comma separated, e.g. Canva, Graphic Design">
              <Input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="Canva, Graphic Design"
              />
            </Field>
            <Field label="Short description">
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What was the brief, what did you deliver, and what was the result?"
              />
            </Field>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Btn onClick={save} disabled={!form.title.trim() || isSaving}>{isSaving ? 'Saving…' : 'Save project'}</Btn>
              <Btn variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Btn>
            </div>
            {saveError && <p style={{ color: C.error, fontSize: 13, fontWeight: 700, marginBottom: 0 }}>{saveError}</p>}
          </div>
        </Card>
      )}

      {/* ----------------------------------------------------- featured */}
      <Card pad={0} style={{ overflow: 'hidden', marginBottom: 24, boxShadow: SHADOW.md }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1 1 260px',
              minHeight: 240,
              background: BRAND_GRADIENT,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              padding: 28,
            }}
          >
            <div style={{ fontSize: 74 }}>{FEATURED.emoji}</div>
            <Badge color="#fff" bg="rgba(255,255,255,0.18)">
              ★ Featured project
            </Badge>
          </div>
          <div style={{ flex: '2 1 380px', padding: 28 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: C.text }}>
                {FEATURED.title}
              </h2>
              <Badge color={C.success} bg="#DCFCE7">
                {rupees(FEATURED.earned)} earned
              </Badge>
            </div>
            <div style={{ fontSize: 13.5, color: C.muted, fontWeight: 600, marginTop: 6 }}>
              {FEATURED.role} · {FEATURED.category} · {FEATURED.date}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: '14px 0' }}>
              {FEATURED.skills.map((s) => (
                <SkillChip key={s} label={s} />
              ))}
              <Stars rating={FEATURED.rating} size={14} />
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: C.muted }}>
              The society needed an exhibition poster in 48 hours for print and Instagram. I built one
              Canva master with a bold isometric robot silhouette, then exported A2 print, A4 handout
              and story crops. Registrations doubled compared with last year&apos;s event.
            </p>
            <Divider />
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <Avatar name={FEATURED.client} size={42} emoji="🤖" />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: C.text,
                    fontStyle: 'italic',
                  }}
                >
                  “Excellent work and delivered before the deadline. We are using Kasun for every
                  event this year.”
                </p>
                <div style={{ fontSize: 12.5, color: C.faint, fontWeight: 700, marginTop: 6 }}>
                  — {FEATURED.client}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ----------------------------------------------------- filters */}
      <div
        className="scrollbar-hide"
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}
      >
        <SkillChip label="All" active={filter === 'All'} onClick={() => setFilter('All')} />
        {CATEGORIES.map((c) => (
          <SkillChip key={c} label={c} active={filter === c} onClick={() => setFilter(c)} />
        ))}
      </div>

      <SectionTitle
        title={filter === 'All' ? 'All projects' : filter}
        subtitle={`${visible.length} project${visible.length === 1 ? '' : 's'}`}
      />

      {visible.length === 0 ? (
        <EmptyState
          emoji="📁"
          title="No projects in this category yet"
          text={`You have not added any ${filter} work. Add a project or browse opportunities to land your first one.`}
          action={
            <Btn onClick={() => setShowForm(true)}>+ Add Portfolio</Btn>
          }
        />
      ) : (
        <Grid min={280} gap={18}>
          {visible.map((p) => (
            <Card key={p.id} hover pad={0} style={{ overflow: 'hidden' }}>
              <div
                style={{
                  position: 'relative',
                  height: 150,
                  background: p.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 52,
                }}
              >
                {p.emoji}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    padding: '5px 11px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.92)',
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.text,
                    boxShadow: SHADOW.sm,
                  }}
                >
                  earned {rupees(p.earned)}
                </span>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 15.5, fontWeight: 800, color: C.text, lineHeight: 1.35 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 12.5, color: C.primary, fontWeight: 700, marginTop: 5 }}>
                  {p.role} · {p.category}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '12px 0' }}>
                  {p.skills.map((s) => (
                    <SkillChip key={s} label={s} />
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <Stars rating={p.rating} />
                  <span style={{ fontSize: 12, color: C.faint, fontWeight: 600 }}>{p.date}</span>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12.5,
                    color: C.muted,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Avatar name={p.client} size={22} />
                  {p.client}
                </div>
                <div style={{ marginTop: 14 }}>
                  <Btn variant="ghost" size="sm" full>
                    View project →
                  </Btn>
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      )}

      {/* ----------------------------------------------------- stats */}
      <div style={{ marginTop: 30 }}>
        <SectionTitle title="Portfolio impact" subtitle="What your work has added up to" />
        <Grid min={210} gap={16}>
          <StatCard icon="📁" label="Total projects" value={PROJECTS.length} />
          <StatCard icon="💰" label="Total earned" value={rupees(totalEarned)} tone={C.success} delta="+18%" />
          <StatCard icon="⭐" label="Average rating" value={avgRating.toFixed(1)} tone={C.warning} />
          <StatCard icon="🔁" label="Repeat clients" value="4 of 4" tone={C.accent} />
        </Grid>
      </div>

      <Card
        pad={26}
        style={{
          marginTop: 22,
          background: BRAND_GRADIENT,
          border: 'none',
          boxShadow: SHADOW.glow,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 18,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: -0.4 }}>
            Ready for project #10?
          </h3>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.82)', maxWidth: 460 }}>
            There are 12 open requests near Peradeniya and Kandy that match your top skills right now.
          </p>
        </div>
        <Btn variant="secondary" size="lg" onClick={() => onNavigate('opportunities')}>
          Browse opportunities →
        </Btn>
      </Card>
    </Shell>
  )
}
