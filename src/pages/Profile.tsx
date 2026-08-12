import { useState } from 'react'
import type { PageProps } from '../types'
import {
  AICallout,
  Avatar,
  BRAND_GRADIENT,
  Badge,
  Btn,
  C,
  Card,
  CircleProgress,
  Divider,
  Grid,
  InfoTile,
  MetricBar,
  Progress,
  SectionTitle,
  Shell,
  SkillChip,
  Stars,
  Tabs,
  USER,
  Verified,
  rupees,
} from '../components/ui'

interface Experience {
  role: string
  org: string
  period: string
  detail: string
  emoji: string
}

const EXPERIENCE: Experience[] = [
  {
    role: 'Freelance Graphic Designer',
    org: 'SkillLoop · Peradeniya',
    period: 'Jan 2025 — Present',
    detail:
      '18 completed micro-jobs for university societies and Kandy small businesses. Posters, menus, social kits and short promo videos.',
    emoji: '🎨',
  },
  {
    role: 'Design Lead',
    org: 'University Robotics Society',
    period: 'Aug 2024 — Present',
    detail:
      'Own the visual identity for the annual robotics exhibition: posters, badges, stage backdrop and the Instagram launch sequence.',
    emoji: '🤖',
  },
  {
    role: 'Volunteer ICT Tutor',
    org: 'Kandy Community Learning Circle',
    period: 'Mar 2024 — Dec 2024',
    detail:
      'Weekend sessions on spreadsheets and basic web literacy for 24 O/L students. Built the whole worksheet pack in Canva.',
    emoji: '📘',
  },
]

interface Lang {
  name: string
  level: string
  value: number
}

const LANGUAGES: Lang[] = [
  { name: 'Sinhala', level: 'Native', value: 100 },
  { name: 'English', level: 'Professional', value: 88 },
  { name: 'Tamil', level: 'Conversational', value: 62 },
]

const ACHIEVEMENTS = [
  { icon: '🏆', label: 'Top Rated', tone: '#F59E0B' },
  { icon: '⚡', label: 'Fast Responder', tone: '#4F46E5' },
  { icon: '📦', label: '10+ Jobs', tone: '#14B8A6' },
  { icon: '✓', label: 'Verified Student', tone: '#0E7490' },
]

interface Skill {
  name: string
  value: number
  endorsed: number
}

interface SkillGroup {
  category: string
  emoji: string
  skills: Skill[]
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Design',
    emoji: '🎨',
    skills: [
      { name: 'Graphic Design', value: 95, endorsed: 14 },
      { name: 'Canva', value: 92, endorsed: 12 },
      { name: 'Photoshop', value: 85, endorsed: 9 },
      { name: 'Illustrator', value: 78, endorsed: 6 },
    ],
  },
  {
    category: 'Media',
    emoji: '🎬',
    skills: [{ name: 'Video Editing', value: 74, endorsed: 5 }],
  },
  {
    category: 'Development',
    emoji: '💻',
    skills: [
      { name: 'Web Development', value: 68, endorsed: 3 },
      { name: 'React', value: 55, endorsed: 1 },
    ],
  },
  {
    category: 'Teaching',
    emoji: '📚',
    skills: [{ name: 'Tutoring', value: 80, endorsed: 7 }],
  },
]

interface Work {
  title: string
  client: string
  skills: string[]
  rating: number
  date: string
  earned: number
  emoji: string
  gradient: string
}

const WORKS: Work[] = [
  {
    title: 'Robotics Exhibition Poster',
    client: 'University Robotics Society',
    skills: ['Graphic Design', 'Canva'],
    rating: 5,
    date: 'Jul 2026',
    earned: 2000,
    emoji: '🤖',
    gradient: 'linear-gradient(135deg,#4F46E5,#14B8A6)',
  },
  {
    title: 'Spice Kitchen Menu Redesign',
    client: 'Kandy Spice Kitchen',
    skills: ['Illustrator', 'Print'],
    rating: 5,
    date: 'Jun 2026',
    earned: 3500,
    emoji: '🍛',
    gradient: 'linear-gradient(135deg,#F59E0B,#EF4444)',
  },
  {
    title: 'Lecture Series Promo Reel',
    client: 'Dr. Anura Rajapaksa',
    skills: ['Video Editing', 'Motion'],
    rating: 4,
    date: 'May 2026',
    earned: 4200,
    emoji: '🎬',
    gradient: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
  },
  {
    title: 'Boutique Instagram Kit',
    client: 'Nimali Jayasuriya',
    skills: ['Canva', 'Social Media'],
    rating: 5,
    date: 'Apr 2026',
    earned: 1800,
    emoji: '👗',
    gradient: 'linear-gradient(135deg,#14B8A6,#0F766E)',
  },
]

interface Review {
  name: string
  job: string
  rating: number
  quote: string
  date: string
  helpful: number
}

const REVIEWS: Review[] = [
  {
    name: 'University Robotics Society',
    job: 'Robotics Exhibition Poster',
    rating: 5,
    quote: 'Excellent work and delivered before the deadline. Kasun understood the brief on the first try.',
    date: '2 days ago',
    helpful: 12,
  },
  {
    name: 'Kandy Spice Kitchen',
    job: 'Spice Kitchen Menu Redesign',
    rating: 5,
    quote:
      'Our new menu looks like it came from a Colombo agency. Customers actually commented on the design.',
    date: '3 weeks ago',
    helpful: 9,
  },
  {
    name: 'Dr. Anura Rajapaksa',
    job: 'Lecture Series Promo Reel',
    rating: 4,
    quote:
      'Very good editing and clear communication throughout. One round of revisions was needed on the intro titles.',
    date: '1 month ago',
    helpful: 6,
  },
  {
    name: 'Nimali Jayasuriya',
    job: 'Boutique Instagram Kit',
    rating: 5,
    quote: 'Fast, polite and creative. He suggested a minimal version that worked far better than my idea.',
    date: '2 months ago',
    helpful: 15,
  },
]

const DISTRIBUTION: { stars: number; count: number }[] = [
  { stars: 5, count: 14 },
  { stars: 4, count: 3 },
  { stars: 3, count: 1 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
]

const AVAILABILITY = [
  { day: 'Mon', slot: 'Evening' },
  { day: 'Tue', slot: 'Evening' },
  { day: 'Wed', slot: '—' },
  { day: 'Thu', slot: 'Evening' },
  { day: 'Fri', slot: 'Evening' },
  { day: 'Sat', slot: 'Full day' },
  { day: 'Sun', slot: 'Full day' },
]

export default function Profile({ onNavigate }: PageProps) {
  const [tab, setTab] = useState('about')
  const totalReviews = DISTRIBUTION.reduce((a, d) => a + d.count, 0)

  return (
    <Shell>
      {/* ------------------------------------------------ header */}
      <Card pad={0} style={{ overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ height: 132, background: BRAND_GRADIENT, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 82% 18%, rgba(255,255,255,0.25), transparent 55%)',
            }}
          />
          <div style={{ position: 'absolute', right: 18, top: 18 }}>
            <Badge color="#fff" bg="rgba(255,255,255,0.18)" dot>
              Available for work
            </Badge>
          </div>
        </div>
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ marginTop: -46, marginBottom: 16 }}>
            <Avatar name={USER.name} size={100} ring emoji="🧑‍🎓" />
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 18,
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ minWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.7, color: C.text }}>
                  {USER.name}
                </h1>
                <Verified />
              </div>
              <p style={{ margin: '7px 0 0', fontSize: 14.5, color: C.muted, fontWeight: 600 }}>
                {USER.role}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 16,
                  marginTop: 12,
                  fontSize: 13,
                  color: C.faint,
                  fontWeight: 600,
                }}
              >
                <span>📍 {USER.location}</span>
                <span>🗓 Member since Jan 2025</span>
                <span>⚡ Replies in ~2 hours</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Btn onClick={() => onNavigate('post-need')}>Hire / Request Service</Btn>
              <Btn variant="secondary" onClick={() => onNavigate('messages')}>
                💬 Message
              </Btn>
              <Btn variant="ghost">🔗 Share profile</Btn>
            </div>
          </div>

          <Divider style={{ margin: '22px 0 18px' }} />

          {/* stats strip */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <CircleProgress value={USER.trust} size={80} label="TRUST" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.7, color: C.faint }}>
                  TRUST SCORE
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.text, marginTop: 2 }}>
                  {USER.trust}/100
                </div>
                <div style={{ fontSize: 12, color: C.success, fontWeight: 700, marginTop: 2 }}>
                  Top 8% in Kandy
                </div>
              </div>
            </div>
            <div style={{ width: 1, height: 54, background: C.border }} />
            <StatBit label="Rating" node={<Stars rating={USER.rating} size={15} />} sub={`${totalReviews} reviews`} />
            <StatBit label="Jobs done" node={<Big>{USER.jobs}</Big>} sub="0 cancelled" />
            <StatBit label="Total earned" node={<Big>{rupees(USER.earned)}</Big>} sub="Across 9 clients" />
            <StatBit label="On-time" node={<Big>96%</Big>} sub="Delivery rate" />
          </div>
        </div>
      </Card>

      <Tabs
        tabs={[
          { key: 'about', label: 'About' },
          { key: 'skills', label: 'Skills', count: 8 },
          { key: 'portfolio', label: 'Portfolio', count: 9 },
          { key: 'reviews', label: 'Reviews', count: totalReviews },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'about' && (
        <div className="sl-rise" style={{ display: 'grid', gap: 18 }}>
          <Card>
            <SectionTitle title="About Kasun" />
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.75, color: C.muted }}>
              "I'm a third-year ICT undergraduate at the University of Peradeniya who turns campus
              deadlines into design work. I started with society posters, and now I help small
              businesses around Kandy look sharper than their budget suggests. I work fast, ask the
              right questions early, and I have never missed an agreed deadline. Currently levelling
              up my front-end skills so I can take on full web projects."
            </p>
            <Grid min={200} gap={12} style={{ marginTop: 20 }}>
              <InfoTile icon="🎓" label="University" value="Peradeniya" />
              <InfoTile icon="📍" label="Works within" value="5 km radius" tone={C.accent} />
              <InfoTile icon="💼" label="Repeat clients" value="6 of 9" tone={C.warning} />
              <InfoTile icon="⏱" label="Avg. turnaround" value="2.4 days" tone={C.success} />
            </Grid>
          </Card>

          <Card>
            <SectionTitle title="Experience" subtitle="Roles and freelance history" />
            <div style={{ display: 'grid', gap: 4 }}>
              {EXPERIENCE.map((e, i) => (
                <div key={e.role} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: C.subtle,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {e.emoji}
                    </div>
                    {i < EXPERIENCE.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: C.border, marginTop: 6 }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: i < EXPERIENCE.length - 1 ? 22 : 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{e.role}</div>
                    <div style={{ fontSize: 13, color: C.primary, fontWeight: 700, marginTop: 3 }}>
                      {e.org}
                    </div>
                    <div style={{ fontSize: 12, color: C.faint, fontWeight: 600, marginTop: 3 }}>
                      {e.period}
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: 13.5, color: C.muted, lineHeight: 1.65 }}>
                      {e.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Grid min={320} gap={18}>
            <Card>
              <SectionTitle title="Education" />
              <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>
                BSc (Hons) Information &amp; Communication Technology
              </div>
              <div style={{ fontSize: 13.5, color: C.muted, marginTop: 4 }}>
                University of Peradeniya · 2023 — 2027
              </div>
              <div style={{ marginTop: 14 }}>
                <MetricBar label="Degree progress (Year 3)" value={62} />
              </div>
              <Divider />
              <SectionTitle title="Languages" />
              {LANGUAGES.map((l) => (
                <div key={l.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{l.name}</span>
                    <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{l.level}</span>
                  </div>
                  <Progress value={l.value} />
                </div>
              ))}
            </Card>

            <Card>
              <SectionTitle title="Availability" subtitle="Weekday evenings and full weekends" />
              <Grid min={90} gap={10}>
                {AVAILABILITY.map((a) => {
                  const free = a.slot !== '—'
                  return (
                    <div
                      key={a.day}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 12,
                        textAlign: 'center',
                        background: free ? '#F0FDFA' : C.subtle,
                        border: `1px solid ${free ? '#99F6E4' : C.border}`,
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 800, color: C.text }}>{a.day}</div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          marginTop: 5,
                          color: free ? '#0F766E' : C.faint,
                        }}
                      >
                        {a.slot}
                      </div>
                    </div>
                  )
                })}
              </Grid>
              <Divider />
              <SectionTitle title="Badges &amp; achievements" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {ACHIEVEMENTS.map((b) => (
                  <div
                    key={b.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 14px',
                      borderRadius: 999,
                      background: b.tone + '12',
                      border: `1px solid ${b.tone}30`,
                      fontSize: 13,
                      fontWeight: 700,
                      color: b.tone,
                    }}
                  >
                    <span>{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </Card>
          </Grid>
        </div>
      )}

      {tab === 'skills' && (
        <div className="sl-rise" style={{ display: 'grid', gap: 18 }}>
          <AICallout
            title="Skill gap: you are 72% ready for Web Development jobs"
            action={
              <Btn size="sm" onClick={() => onNavigate('skill-demand')}>
                See demand
              </Btn>
            }
          >
            There are 9 open web projects near Peradeniya averaging {rupees(6500)}. Lifting React from
            55% to 75% would unlock most of them — start with components and state.
          </AICallout>

          <Grid min={330} gap={18}>
            {SKILL_GROUPS.map((g) => (
              <Card key={g.category} hover>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: C.subtle,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}
                  >
                    {g.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: 15.5, fontWeight: 800, color: C.text }}>{g.category}</div>
                    <div style={{ fontSize: 12, color: C.faint, fontWeight: 600 }}>
                      {g.skills.length} skill{g.skills.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                {g.skills.map((s) => (
                  <div key={s.name} style={{ marginBottom: 6 }}>
                    <MetricBar
                      label={s.name}
                      value={s.value}
                      color={s.value >= 85 ? C.accent : C.primary}
                    />
                    <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 600, marginTop: -8 }}>
                      Endorsed by {s.endorsed} client{s.endorsed === 1 ? '' : 's'}
                    </div>
                  </div>
                ))}
              </Card>
            ))}
          </Grid>

          <Card
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Add a new skill</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                More verified skills means more matched opportunities in your radar.
              </div>
            </div>
            <Btn variant="secondary">+ Add Skill</Btn>
          </Card>
        </div>
      )}

      {tab === 'portfolio' && (
        <div className="sl-rise">
          <SectionTitle
            title="Featured work"
            subtitle="4 of 9 projects shown"
            action={
              <Btn variant="ghost" size="sm" onClick={() => onNavigate('portfolio')}>
                View full portfolio →
              </Btn>
            }
          />
          <Grid min={260} gap={18}>
            {WORKS.map((w) => (
              <Card key={w.title} hover pad={0} style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    height: 132,
                    background: w.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 46,
                  }}
                >
                  {w.emoji}
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.text, lineHeight: 1.35 }}>
                    {w.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 5, fontWeight: 600 }}>
                    {w.client}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '12px 0' }}>
                    {w.skills.map((s) => (
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
                    <Stars rating={w.rating} />
                    <span style={{ fontSize: 12, color: C.faint, fontWeight: 600 }}>{w.date}</span>
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 13,
                      fontWeight: 800,
                      color: C.success,
                    }}
                  >
                    Earned {rupees(w.earned)}
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="sl-rise" style={{ display: 'grid', gap: 18 }}>
          <Grid min={300} gap={18}>
            <Card>
              <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{ fontSize: 52, fontWeight: 800, letterSpacing: -2, color: C.text, lineHeight: 1 }}
                  >
                    4.8
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Stars rating={4.8} size={15} />
                  </div>
                  <div style={{ fontSize: 12, color: C.faint, fontWeight: 600, marginTop: 6 }}>
                    {totalReviews} reviews
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {DISTRIBUTION.map((d) => (
                    <div
                      key={d.stars}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}
                    >
                      <span
                        style={{ fontSize: 12, fontWeight: 700, color: C.muted, width: 26, flexShrink: 0 }}
                      >
                        {d.stars}★
                      </span>
                      <Progress
                        value={(d.count / totalReviews) * 100}
                        height={7}
                        gradient="linear-gradient(90deg,#F59E0B,#FBBF24)"
                      />
                      <span
                        style={{ fontSize: 12, fontWeight: 700, color: C.faint, width: 20, textAlign: 'right' }}
                      >
                        {d.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <Card>
              <SectionTitle title="Category ratings" />
              <MetricBar label="Communication" value={98} suffix="" color={C.primary} />
              <MetricBar label="Quality of work" value={96} suffix="" color={C.accent} />
              <MetricBar label="Timeliness" value={100} suffix="" color={C.success} />
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  marginTop: 6,
                  fontSize: 12.5,
                  color: C.muted,
                  fontWeight: 700,
                }}
              >
                <span>4.9 Comms</span>
                <span>4.8 Quality</span>
                <span>5.0 On time</span>
              </div>
            </Card>
          </Grid>

          {REVIEWS.map((r) => (
            <Card key={r.name} hover>
              <div style={{ display: 'flex', gap: 14 }}>
                <Avatar name={r.name} size={46} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 10,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>{r.name}</div>
                      <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{r.job}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Stars rating={r.rating} />
                      <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 600, marginTop: 4 }}>
                        {r.date}
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      margin: '14px 0 0',
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: C.text,
                      paddingLeft: 14,
                      borderLeft: `3px solid ${C.primary}33`,
                    }}
                  >
                    “{r.quote}”
                  </p>
                  <div
                    style={{
                      marginTop: 14,
                      fontSize: 12.5,
                      color: C.faint,
                      fontWeight: 600,
                      display: 'flex',
                      gap: 14,
                    }}
                  >
                    <span>👍 {r.helpful} found this helpful</span>
                    <span className="sl-link" style={{ color: C.primary, cursor: 'pointer' }}>
                      Reply
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Shell>
  )
}

function Big({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.6, color: C.text }}>{children}</span>
  )
}

function StatBit({
  label,
  node,
  sub,
}: {
  label: string
  node: React.ReactNode
  sub: string
}) {
  return (
    <div style={{ minWidth: 110 }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.7, color: C.faint }}>
        {label.toUpperCase()}
      </div>
      <div style={{ marginTop: 6 }}>{node}</div>
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginTop: 4 }}>{sub}</div>
    </div>
  )
}
