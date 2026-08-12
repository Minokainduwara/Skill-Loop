import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PageProps } from '../types'
import {
  AICallout,
  Badge,
  Btn,
  C,
  Card,
  CircleProgress,
  Divider,
  EmptyState,
  Grid,
  PageHead,
  SHADOW,
  SectionTitle,
  Select,
  Shell,
  SkillChip,
  rupees,
} from '../components/ui'

const tooltipStyle = {
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  boxShadow: SHADOW.md,
  fontSize: 12.5,
  fontWeight: 600,
  padding: '8px 12px',
}

type Level = 'High' | 'Medium' | 'Low'

interface DemandRow {
  rank: number
  skill: string
  category: string
  requests: number
  growth: number
  budget: number
  students: number
  level: Level
  spark: number[]
}

const ROWS: DemandRow[] = [
  { rank: 1, skill: 'Graphic Design', category: 'Design', requests: 42, growth: 34, budget: 2400, students: 12, level: 'High', spark: [18, 22, 25, 29, 33, 38, 42] },
  { rank: 2, skill: 'Video Editing', category: 'Media', requests: 31, growth: 28, budget: 3200, students: 7, level: 'High', spark: [12, 15, 18, 22, 25, 28, 31] },
  { rank: 3, skill: 'Web Development', category: 'Development', requests: 27, growth: 19, budget: 8500, students: 9, level: 'High', spark: [14, 16, 18, 20, 22, 25, 27] },
  { rank: 4, skill: 'Tutoring', category: 'Education', requests: 21, growth: 12, budget: 1600, students: 18, level: 'Medium', spark: [15, 16, 17, 18, 19, 20, 21] },
  { rank: 5, skill: 'Photography', category: 'Media', requests: 18, growth: 15, budget: 4200, students: 6, level: 'Medium', spark: [9, 11, 12, 14, 15, 17, 18] },
  { rank: 6, skill: 'Social Media', category: 'Marketing', requests: 16, growth: 22, budget: 2800, students: 11, level: 'Medium', spark: [7, 9, 10, 12, 13, 15, 16] },
  { rank: 7, skill: 'Content Writing', category: 'Marketing', requests: 12, growth: 8, budget: 1900, students: 14, level: 'Medium', spark: [8, 9, 9, 10, 11, 11, 12] },
  { rank: 8, skill: 'Data Entry', category: 'Admin', requests: 10, growth: 4, budget: 1200, students: 22, level: 'Low', spark: [8, 8, 9, 9, 9, 10, 10] },
  { rank: 9, skill: 'Translation', category: 'Admin', requests: 8, growth: 6, budget: 2200, students: 5, level: 'Low', spark: [5, 5, 6, 6, 7, 7, 8] },
  { rank: 10, skill: 'Computer Repair', category: 'Development', requests: 7, growth: 3, budget: 1500, students: 4, level: 'Low', spark: [5, 6, 6, 6, 7, 7, 7] },
]

const LEVEL_TONES: Record<Level, { color: string; bg: string; icon: React.ReactNode }> = {
  High: { color: '#B91C1C', bg: '#FEE2E2', icon: <Icon name="spark" size={14} color="#B91C1C" /> },
  Medium: { color: '#B45309', bg: '#FEF3C7', icon: <Icon name="trend" size={14} color="#B45309" /> },
  Low: { color: C.muted, bg: C.subtle, icon: <span style={{ fontWeight: 800 }}>•</span> },
}

const CATEGORIES = ['All categories', 'Design', 'Media', 'Development', 'Education', 'Marketing', 'Admin']
const PERIODS = ['7 days', '30 days', '90 days']

interface Gap {
  name: string
  have: boolean
}

const GAP: Gap[] = [
  { name: 'HTML', have: true },
  { name: 'CSS', have: true },
  { name: 'JavaScript', have: true },
  { name: 'React', have: false },
  { name: 'Git', have: false },
  { name: 'REST APIs', have: false },
]

export default function SkillDemand({ onNavigate }: PageProps) {
  const [category, setCategory] = useState(CATEGORIES[0])
  const [period, setPeriod] = useState(PERIODS[1])

  const rows = useMemo(
    () => (category === CATEGORIES[0] ? ROWS : ROWS.filter((r) => r.category === category)),
    [category],
  )

  const top3 = ROWS.slice(0, 3)
  const gapData = ROWS.slice(0, 6).map((r) => ({
    skill: r.skill.split(' ')[0],
    requests: r.requests,
    students: r.students,
  }))

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Shell>
        <PageHead
          eyebrow="Market intelligence"
          title="What Skills Are In Demand?"
          subtitle="Live demand signals from the last 30 days within 15 km of Peradeniya, based on requests posted by clubs, small businesses and families around Kandy."
          actions={
            <>
              <Btn variant="secondary" onClick={() => onNavigate('radar')}>
                Open radar
              </Btn>
              <Btn onClick={() => onNavigate('opportunities')}>Browse opportunities</Btn>
            </>
          }
        />

        {/* --------------------------------------------------- top 3 cards */}
        <SectionTitle title="Top rising skills" subtitle="The three fastest-growing categories right now" />
        <Grid min={320} gap={18} style={{ marginBottom: 30 }}>
          {top3.map((r) => {
            const tone = LEVEL_TONES[r.level]
            const sparkData = r.spark.map((v, i) => ({ i, v }))
            return (
              <Card key={r.skill} hover onClick={() => onNavigate('opportunities')} pad={20}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      background: C.primary + '14',
                      color: C.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    #{r.rank}
                  </div>
                  <Badge color={tone.color} bg={tone.bg}>
                    {tone.icon} {r.level} Demand
                  </Badge>
                </div>
                <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.4, color: C.text }}>{r.skill}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.2, color: C.text }}>
                    {r.requests}
                  </span>
                  <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>requests</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: C.success }}>+{r.growth}%</span>
                </div>
                <div style={{ height: 62, margin: '12px 0 4px', minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`spark${r.rank}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="i" hide />
                      <YAxis hide domain={['dataMin - 4', 'dataMax + 2']} />
                      <Area type="monotone" dataKey="v" stroke="#4F46E5" strokeWidth={2.2} fill={`url(#spark${r.rank})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                  <div>
                    <div style={{ color: C.faint, fontWeight: 700 }}>Avg budget</div>
                    <div style={{ color: C.text, fontWeight: 800, marginTop: 2 }}>{rupees(r.budget)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: C.faint, fontWeight: 700 }}>Students available</div>
                    <div style={{ color: C.text, fontWeight: 800, marginTop: 2 }}>{r.students}</div>
                  </div>
                </div>
              </Card>
            )
          })}
        </Grid>

        {/* -------------------------------------------------------- filters */}
        <SectionTitle
          title="Full demand ranking"
          subtitle={`${rows.length} skills · last ${period}`}
          action={
            <Select value={category} onChange={setCategory} options={CATEGORIES} style={{ width: 190 }} />
          }
        />
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {PERIODS.map((p) => (
            <SkillChip key={p} label={`Last ${p}`} active={p === period} onClick={() => setPeriod(p)} />
          ))}
        </div>

        {/* ---------------------------------------------------------- table */}
        {rows.length === 0 ? (
          <EmptyState
            emoji={<Icon name="chart" size={26} color={C.primary} />}
            title="No skills in this category"
            text="Demand data has not been recorded for this category in the selected period."
            action={<Btn variant="secondary" onClick={() => setCategory(CATEGORIES[0])}>Reset filter</Btn>}
          />
        ) : (
          <Card pad={0} style={{ overflow: 'hidden', marginBottom: 34 }}>
            <style>{`
              .sl-demand-table tbody tr { transition: background .16s ease }
              .sl-demand-table tbody tr:nth-child(even) { background: ${C.bg} }
              .sl-demand-table tbody tr:hover { background: #EEF2FF }
            `}</style>
            <div style={{ overflowX: 'auto', maxHeight: 560 }} className="scrollbar-hide">
              <table
                className="sl-demand-table"
                style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}
              >
                <thead>
                  <tr>
                    {['Rank', 'Skill', 'Requests', 'Growth', 'Avg budget', 'Students', 'Demand level', ''].map((h) => (
                      <th
                        key={h}
                        style={{
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                          background: C.surface,
                          textAlign: h === 'Skill' || h === 'Rank' ? 'left' : 'right',
                          padding: '14px 18px',
                          fontSize: 11.5,
                          fontWeight: 800,
                          letterSpacing: 0.7,
                          textTransform: 'uppercase',
                          color: C.faint,
                          borderBottom: `1px solid ${C.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const tone = LEVEL_TONES[r.level]
                    return (
                      <tr key={r.skill} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '14px 18px', fontSize: 13.5, fontWeight: 800, color: C.faint }}>
                          {r.rank}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{r.skill}</div>
                          <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 600, marginTop: 2 }}>
                            {r.category}
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right', fontSize: 14, fontWeight: 800, color: C.text }}>
                          {r.requests}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right', fontSize: 13, fontWeight: 800, color: C.success }}>
                          +{r.growth}%
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right', fontSize: 13.5, fontWeight: 700, color: C.text }}>
                          {rupees(r.budget)}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right', fontSize: 13.5, fontWeight: 700, color: C.muted }}>
                          {r.students}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <Badge color={tone.color} bg={tone.bg}>
                            {tone.icon} {r.level}
                          </Badge>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => onNavigate('opportunities')}
                            className="sl-press"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: C.primary,
                              fontSize: 12.5,
                              fontWeight: 800,
                              fontFamily: 'inherit',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            View opportunities →
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ------------------------------------------------ supply vs demand */}
        <SectionTitle
          title="Supply and demand gap"
          subtitle="Skills where requests outnumber available students are your best opportunity"
        />
        <Card style={{ marginBottom: 34 }} pad={20}>
          <div style={{ height: 300, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gapReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                  <linearGradient id="gapStu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} vertical={false} />
                <XAxis dataKey="skill" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: C.muted }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: C.muted }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(79,70,229,0.06)' }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, fontWeight: 600, color: C.muted, paddingTop: 10 }}
                />
                <Bar name="Requests" dataKey="requests" fill="url(#gapReq)" radius={[8, 8, 3, 3]} maxBarSize={30} />
                <Bar name="Students available" dataKey="students" fill="url(#gapStu)" radius={[8, 8, 3, 3]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ------------------------------------------------------ skill gap */}
        <SectionTitle title="Grow Your Skills" subtitle="AI skill-gap analysis for Kasun Perera" />
        <Grid min={340} gap={18} style={{ marginBottom: 26 }}>
          <Card>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, marginBottom: 14 }}>
              Your Web Development stack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {GAP.map((g) => (
                <span
                  key={g.name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '9px 14px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                    color: g.have ? '#15803D' : C.muted,
                    background: g.have ? '#DCFCE7' : C.subtle,
                    border: `1px solid ${g.have ? '#86EFAC' : C.border}`,
                  }}
                >
                  {g.have ? '✓' : '○'} {g.name}
                </span>
              ))}
            </div>
            <Divider />
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <CircleProgress value={72} size={96} label="ready" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.text, lineHeight: 1.45 }}>
                  You&apos;re 72% ready for current Web Development opportunities.
                </div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>
                  Three of six in-demand skills are still missing from your profile.
                </div>
              </div>
            </div>
          </Card>

          <Card style={{ display: 'flex', flexDirection: 'column' }}>
            <Badge color="#7C3AED" bg="#EDE9FE">
              Recommended next step
            </Badge>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.8, color: C.text, marginTop: 12 }}>
              Learn React
            </div>
            <div style={{ fontSize: 13.5, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>
              React appears in most Web Development requests posted near Peradeniya this month. Adding it unlocks
              the highest-value briefs on the board.
            </div>
            <Grid min={140} gap={12} style={{ marginTop: 18 }}>
              <div style={{ padding: 14, borderRadius: 14, background: C.primary + '0D', border: `1px solid ${C.primary}22` }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: -0.6 }}>17</div>
                <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 700, marginTop: 2 }}>
                  Matching opportunities
                </div>
              </div>
              <div style={{ padding: 14, borderRadius: 14, background: C.accent + '0D', border: `1px solid ${C.accent}22` }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: -0.4 }}>
                  Rs. 8,000–15,000
                </div>
                <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 700, marginTop: 2 }}>
                  Potential extra / month
                </div>
              </div>
            </Grid>
            <div style={{ marginTop: 'auto', paddingTop: 18 }}>
              <Btn full size="lg" onClick={() => onNavigate('profile')}>
                View Learning Resources
              </Btn>
            </div>
          </Card>
        </Grid>

        <Card style={{ marginBottom: 26 }} pad={20}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>Demand trend for your top skill</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 12 }}>
            Graphic Design requests near Peradeniya, weekly
          </div>
          <div style={{ height: 180, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ROWS[0].spark.map((v, i) => ({ week: `W${i + 1}`, requests: v }))}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke={C.border} vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: C.muted }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: C.muted }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`${Number(v)} requests`, 'Demand']} />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#F59E0B', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <AICallout
          title="Graphic Design demand is outpacing supply by 3.5×"
          action={<Btn onClick={() => onNavigate('demand-cluster')}>See cluster</Btn>}
        >
          42 requests are competing for only 12 available designers near Peradeniya. Requesters are paying an average
          of {rupees(2400)} per brief — a strong moment to raise your rates.
        </AICallout>
      </Shell>
    </div>
  )
}
