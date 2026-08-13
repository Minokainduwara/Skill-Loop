import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import type { Id } from '../../convex/_generated/dataModel'
import {
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



const DISTRIBUTION: { stars: number; count: number }[] = [
  { stars: 5, count: 14 },
  { stars: 4, count: 3 },
  { stars: 3, count: 1 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
]



export default function Profile({ onNavigate, selectedStudentId }: PageProps) {
  const [tab, setTab] = useState('about')

  const selfProfile = useQuery(api.queries.myStudentProfile)
  const userId = selectedStudentId || selfProfile?.user?._id

  const profileBundle = useQuery(
    api.queries.studentProfile,
    userId ? { studentId: userId as Id<'users'> } : 'skip'
  )

  const loading = selfProfile === undefined || (userId !== undefined && profileBundle === undefined)

  if (loading) {
    return (
      <Shell>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontSize: 16, color: C.muted }}>
          Loading profile...
        </div>
      </Shell>
    )
  }

  if (!profileBundle) {
    return (
      <Shell>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', fontSize: 16, color: C.muted }}>
          Profile not found.
        </div>
      </Shell>
    )
  }

  const { user, profile, skills, portfolios, reviews } = profileBundle

  const name = user.username
  const roleText = profile?.degree || 'Student'
  const locationText = user.location || 'Peradeniya, Kandy'
  const trustScore = profile?.profileCompletion || 92
  const rating = profile?.averageRating || 4.8
  const jobsDone = profile?.completedJobs || 18
  const totalEarned = profile?.totalEarnings || 24500
  const totalReviews = reviews.length

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
            <Avatar name={name} size={100} ring emoji="🧑‍🎓" />
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
                  {name}
                </h1>
                <Verified />
              </div>
              <p style={{ margin: '7px 0 0', fontSize: 14.5, color: C.muted, fontWeight: 600 }}>
                {roleText}
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
                <span>📍 {locationText}</span>
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
              <CircleProgress value={trustScore} size={80} label="TRUST" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.7, color: C.faint }}>
                  TRUST SCORE
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.text, marginTop: 2 }}>
                  {trustScore}/100
                </div>
                <div style={{ fontSize: 12, color: C.success, fontWeight: 700, marginTop: 2 }}>
                  Top 8% in Kandy
                </div>
              </div>
            </div>
            <div style={{ width: 1, height: 54, background: C.border }} />
            <StatBit label="Rating" node={<Stars rating={rating} size={15} />} sub={`${totalReviews} reviews`} />
            <StatBit label="Jobs done" node={<Big>{jobsDone}</Big>} sub="0 cancelled" />
            <StatBit label="Total earned" node={<Big>{rupees(totalEarned)}</Big>} sub="Across 9 clients" />
            <StatBit label="On-time" node={<Big>96%</Big>} sub="Delivery rate" />
          </div>
        </div>
      </Card>

      <Tabs
        tabs={[
          { key: 'about', label: 'About' },
          { key: 'skills', label: 'Skills', count: skills.length },
          { key: 'portfolio', label: 'Portfolio', count: portfolios.length },
          { key: 'reviews', label: 'Reviews', count: totalReviews },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'about' && (
        <div className="sl-rise" style={{ display: 'grid', gap: 18 }}>
          <Card>
            <SectionTitle title={`About ${name.split(' ')[0]}`} />
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.75, color: C.muted }}>
              {user.bio || `Freelancer offering high quality services near Peradeniya and Kandy. Specialized in graphic design, tutoring, web development, and video editing.`}
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
                      <div style={{ width: 2, flex: 1, background: C.border, margin: '8px 0' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>{e.role}</div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>
                      {e.org} · {e.period}
                    </div>
                    <p style={{ margin: '8px 0 16px', fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                      {e.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'skills' && (
        <div className="sl-rise" style={{ display: 'grid', gap: 18 }}>
          <Card>
            <SectionTitle title="Skills & expertise" subtitle="Verified on-chain credentials" />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
              {skills.map((s: any) => (
                <SkillChip key={s.skill._id} label={`${s.skill.name} · ${s.studentSkill.endorsedByCount || 0} endorsements`} active />
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'portfolio' && (
        <div className="sl-rise" style={{ display: 'grid', gap: 18 }}>
          <Grid min={280} gap={16}>
            {portfolios.map((p: any) => (
              <Card key={p._id} pad={0} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    height: 160,
                    background: 'linear-gradient(135deg, #4F46E5, #14B8A6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 46,
                  }}
                >
                  🎨
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.text, lineHeight: 1.35 }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 5, fontWeight: 600 }}>
                    {p.category || 'Freelance Work'}
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                    {p.description}
                  </p>
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
                    {rating}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Stars rating={rating} size={15} />
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
                        value={totalReviews > 0 ? (reviews.filter((r: any) => r.rating === d.stars).length / totalReviews) * 100 : 0}
                        height={7}
                        gradient="linear-gradient(90deg,#F59E0B,#FBBF24)"
                      />
                      <span
                        style={{ fontSize: 12, fontWeight: 700, color: C.faint, width: 20, textAlign: 'right' }}
                      >
                        {totalReviews > 0 ? reviews.filter((r: any) => r.rating === d.stars).length : 0}
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

          {reviews.length === 0 ? (
            <div style={{ padding: 18, textAlign: 'center', color: C.muted, fontSize: 12.5 }}>
              No reviews yet.
            </div>
          ) : (
            reviews.map((r: any) => (
              <Card key={r._id} hover>
                <div style={{ display: 'flex', gap: 14 }}>
                  <Avatar name="Client" size={46} />
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
                        <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>Client Review</div>
                        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>Completed Job</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Stars rating={r.rating} />
                        <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 600, marginTop: 4 }}>
                          {new Date(r.createdAt).toLocaleDateString()}
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
                      “{r.comment}”
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
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
