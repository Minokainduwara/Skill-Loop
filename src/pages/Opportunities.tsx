import { useMemo, useState } from 'react'
import type { PageProps } from '../types'
import {
  AICallout,
  Badge,
  Btn,
  C,
  Card,
  EmptyState,
  Grid,
  MatchBadge,
  PageHead,
  SearchInput,
  Select,
  SkillChip,
  Icon,
  rupees,
} from '../components/ui'
import type { ReactNode } from 'react'

type JobType = 'Quick Task' | 'Medium Task' | 'Project'

interface Opportunity {
  id: string
  title: string
  client: string
  category: string
  type: JobType
  budget: number
  deadline: string
  daysLeft: number
  distance: number
  skills: string[]
  match: number
  posted: string
  blurb: string
}

const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'o1',
    title: 'Event Poster Design',
    client: 'University Robotics Society',
    category: 'Design',
    type: 'Quick Task',
    budget: 2000,
    deadline: 'August 15',
    daysLeft: 3,
    distance: 2.4,
    skills: ['Graphic Design', 'Canva', 'Poster Design'],
    match: 96,
    posted: '2 min ago',
    blurb: 'Modern promotional poster for the annual Robotics Exhibition — print plus social.',
  },
  {
    id: 'o2',
function Meta({ icon, value }: { icon: ReactNode; value: string }) {
    client: 'Nimali Jayasuriya',
    category: 'Tutoring',
      <span style={{ fontSize: 13, display: 'inline-flex' }}>{icon}</span>
    budget: 4500,
    deadline: 'August 22',
    daysLeft: 10,
    distance: 1.1,
    skills: ['Python', 'Tutoring', 'Data Structures'],
    match: 91,
    posted: '35 min ago',
    blurb: 'Six one-hour sessions covering loops, functions and basic OOP for a Grade 13 student.',
  },
  {
    id: 'o3',
    title: 'Video Editing for Cafe Promo',
    client: 'Kandy Hills Cafe',
    category: 'Video',
    type: 'Medium Task',
    budget: 6500,
    deadline: 'August 19',
    daysLeft: 7,
    distance: 4.8,
    skills: ['Video Editing', 'Premiere Pro', 'Colour Grading'],
    match: 87,
    posted: '2 hours ago',
    blurb: 'Cut a 45-second reel from 20 minutes of phone footage. Music and subtitles included.',
  },
  {
    id: 'o4',
    title: 'CV & Cover Letter Designer',
    client: 'Dinuka Bandara',
    category: 'Design',
    type: 'Quick Task',
    budget: 1500,
    deadline: 'August 14',
    daysLeft: 2,
    distance: 0.8,
    skills: ['Graphic Design', 'Typography', 'Canva'],
    match: 84,
    posted: '4 hours ago',
    blurb: 'A clean single-page CV template for an internship application at a Colombo firm.',
  },
  {
    id: 'o5',
    title: 'Website Landing Page',
    client: 'Peradeniya Book Hub',
    category: 'Development',
    type: 'Project',
    budget: 18000,
    deadline: 'September 2',
    daysLeft: 21,
    distance: 3.2,
    skills: ['Web Development', 'React', 'Responsive Design'],
    match: 79,
    posted: 'Yesterday',
    blurb: 'One-page responsive site with catalogue section and WhatsApp order button.',
  },
  {
    id: 'o6',
    title: 'Product Photography — Handmade Batik',
    client: 'Tharindu Weerasinghe',
    category: 'Photography',
    type: 'Medium Task',
    budget: 5200,
    deadline: 'August 25',
    daysLeft: 13,
    distance: 6.4,
    skills: ['Photography', 'Lighting', 'Photo Retouching'],
    match: 76,
    posted: 'Yesterday',
    blurb: 'Shoot 15 batik pieces on white background for an online store listing.',
  },
  {
    id: 'o7',
    title: 'Laptop Troubleshooting Visit',
    client: 'Nimal Silva',
    category: 'IT Support',
    type: 'Quick Task',
    budget: 1200,
    deadline: 'August 13',
    daysLeft: 1,
    distance: 1.9,
    skills: ['IT Support', 'Windows', 'Hardware'],
    match: 72,
    posted: '2 days ago',
    blurb: 'Laptop overheating and slow boot. On-site diagnosis in Kandy town.',
  },
  {
    id: 'o8',
    title: 'Social Media Kit for Fresher Night',
    client: 'Faculty of Engineering Union',
    category: 'Design',
    type: 'Medium Task',
    budget: 7500,
    deadline: 'August 21',
    daysLeft: 9,
    distance: 2.1,
    skills: ['Graphic Design', 'Social Media', 'Canva'],
    match: 88,
    posted: '6 hours ago',
    blurb: 'Twelve coordinated posts, stories and a cover banner in one visual system.',
  },
  {
    id: 'o9',
    title: 'Sinhala–English Translation',
    client: 'Sahan Fernando',
    category: 'Writing',
    type: 'Quick Task',
    budget: 2800,
    deadline: 'August 18',
    daysLeft: 6,
    distance: 9.6,
    skills: ['Translation', 'Sinhala', 'Proofreading'],
    match: 68,
    posted: '3 days ago',
    blurb: 'Translate a 6-page community project report from Sinhala into English.',
  },
]

const CATEGORIES = ['All categories', 'Design', 'Development', 'Tutoring', 'Video', 'Photography', 'IT Support', 'Writing']
const TYPES = ['All', 'Quick Task', 'Medium Task', 'Project']
const SORTS = ['Best match', 'Newest', 'Highest budget', 'Closest', 'Deadline soonest']
const QUICK_CHIPS = ['90%+ match', 'Under 3 km', 'Rs. 5,000+', 'Due this week']

const POSTED_ORDER: Record<string, number> = {
  '2 min ago': 0,
  '35 min ago': 1,
  '2 hours ago': 2,
  '4 hours ago': 3,
  '6 hours ago': 4,
  Yesterday: 5,
  '2 days ago': 6,
  '3 days ago': 7,
}

export default function Opportunities({ onNavigate }: PageProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [type, setType] = useState(TYPES[0])
  const [sort, setSort] = useState(SORTS[0])
  const [chips, setChips] = useState<string[]>([])

  const toggleChip = (label: string) =>
    setChips((prev) => (prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]))

  const activeCount =
    (query.trim() ? 1 : 0) +
    (category !== CATEGORIES[0] ? 1 : 0) +
    (type !== TYPES[0] ? 1 : 0) +
    chips.length

  const reset = () => {
    setQuery('')
    setCategory(CATEGORIES[0])
    setType(TYPES[0])
    setSort(SORTS[0])
    setChips([])
  }

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = OPPORTUNITIES.filter((o) => {
      if (q) {
        const haystack = [o.title, o.client, o.category, o.blurb, ...o.skills].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (category !== CATEGORIES[0] && o.category !== category) return false
      if (type !== TYPES[0] && o.type !== type) return false
      if (chips.includes('90%+ match') && o.match < 90) return false
      if (chips.includes('Under 3 km') && o.distance >= 3) return false
      if (chips.includes('Rs. 5,000+') && o.budget < 5000) return false
      if (chips.includes('Due this week') && o.daysLeft > 7) return false
      return true
    })
    const sorted = [...filtered]
    if (sort === 'Best match') sorted.sort((a, b) => b.match - a.match)
    if (sort === 'Newest') sorted.sort((a, b) => (POSTED_ORDER[a.posted] ?? 9) - (POSTED_ORDER[b.posted] ?? 9))
    if (sort === 'Highest budget') sorted.sort((a, b) => b.budget - a.budget)
    if (sort === 'Closest') sorted.sort((a, b) => a.distance - b.distance)
    if (sort === 'Deadline soonest') sorted.sort((a, b) => a.daysLeft - b.daysLeft)
    return sorted
  }, [query, category, type, sort, chips])

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 20px 120px' }}>
        <PageHead
          eyebrow="Matched to your skills"
          title="Opportunities For You"
          subtitle={`${list.length} of ${OPPORTUNITIES.length} nearby opportunities match your current filters — ranked by AI match score.`}
          actions={<Btn variant="secondary" onClick={() => onNavigate('radar')}>Open Demand Radar</Btn>}
        />

        <div style={{ marginBottom: 20 }}>
          <AICallout title="Ranked by match score, not by bidding" compact>
            SkillLoop scores every request against your skills, availability, distance and rating. The top card is
            your strongest fit today — no proposals, no undercutting.
          </AICallout>
        </div>

        <Card style={{ marginBottom: 22 }} pad={18}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search skills, tasks, or opportunities..."
            />
            <Select value={category} onChange={setCategory} options={CATEGORIES} style={{ width: 170 }} />
            <Select value={type} onChange={setType} options={TYPES} style={{ width: 150 }} />
            <Select value={sort} onChange={setSort} options={SORTS} style={{ width: 175 }} />
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: 14,
              paddingTop: 14,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 800, color: C.faint, letterSpacing: 0.6, marginRight: 4 }}>
              QUICK FILTERS
            </span>
            {QUICK_CHIPS.map((c) => (
              <SkillChip key={c} label={c} active={chips.includes(c)} onClick={() => toggleChip(c)} />
            ))}
            {activeCount > 0 && (
              <button
                onClick={reset}
                className="sl-link"
                style={{
                  marginLeft: 'auto',
                  border: 'none',
                  background: 'transparent',
                  color: C.primary,
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Reset {activeCount} filter{activeCount > 1 ? 's' : ''} ✕
              </button>
            )}
          </div>
        </Card>

        {list.length === 0 ? (
          <EmptyState
            emoji={<Icon name="radar" size={26} color={C.primary} />}
            title="No opportunities yet"
            text="Your next opportunity may be closer than you think."
            action={<Btn onClick={() => onNavigate('radar')}>Explore Demand</Btn>}
          />
        ) : (
          <Grid min={330} gap={18}>
            {list.map((o, i) => (
              <Card
                key={o.id}
                hover
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  animation: `sl-rise .5s cubic-bezier(.22,1,.36,1) ${i * 0.045}s both`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 16.5, fontWeight: 800, color: C.text, letterSpacing: -0.2 }}>
                      {o.title}
                    </div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>
                      {o.client} · {o.category}
                    </div>
                  </div>
                  <MatchBadge pct={o.match} size="sm" />
                </div>

                <p style={{ margin: '12px 0 0', fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{o.blurb}</p>

                <div
                  style={{
                    display: 'flex',
                    gap: 14,
                    flexWrap: 'wrap',
                    margin: '14px 0',
                    padding: '12px 0',
                    borderTop: `1px solid ${C.subtle}`,
                    borderBottom: `1px solid ${C.subtle}`,
                  }}
                >
                  <Meta icon={<Icon name="coin" size={14} color={C.primary} />} value={rupees(o.budget)} />
                  <Meta icon={<Icon name="clock" size={14} color={C.accent} />} value={`${o.daysLeft} day${o.daysLeft > 1 ? 's' : ''} left`} />
                  <Meta icon={<Icon name="pin" size={14} color={C.warning} />} value={`${o.distance} km`} />
                </div>

                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
                  {o.skills.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 999,
                        color: C.primaryDark,
                        background: '#EEF2FF',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <Badge color={C.muted} bg={C.subtle}>
                    {o.type} · {o.posted}
                  </Badge>
                  <Btn size="sm" onClick={() => onNavigate('opportunity-detail')}>
                    View Opportunity
                  </Btn>
                </div>
              </Card>
            ))}
          </Grid>
        )}
      </div>
    </div>
  )
}

function Meta({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: C.text }}>
      <span style={{ fontSize: 13, display: 'inline-flex' }}>{icon}</span>
      {value}
    </span>
  )
}
