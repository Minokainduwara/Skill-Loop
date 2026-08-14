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
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
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

const LEVEL_TONES: Record<Level, { color: string; bg: string; icon: string }> = {
  High: { color: '#B91C1C', bg: '#FEE2E2', icon: '🔥' },
  Medium: { color: '#B45309', bg: '#FEF3C7', icon: '📈' },
  Low: { color: C.muted, bg: C.subtle, icon: '•' },
}

const PERIODS = ['7 days', '30 days', '90 days']

export default function SkillDemand({ onNavigate }: PageProps) {
  const data = useQuery(api.dashboard.getSkillDemand)
  
  const ROWS = data?.rows || []
  const GAP = data?.gap?.map((g: any) => ({ name: g.skill, have: g.you })) || []
  const CATEGORIES = data?.categories || ['All']

  const [category, setCategory] = useState(CATEGORIES[0])
  const [period, setPeriod] = useState(PERIODS[1])

  const rows = useMemo(
    () => (category === CATEGORIES[0] || category === 'All' ? ROWS : ROWS.filter((r: any) => r.category === category)),
    [category, CATEGORIES, ROWS],
  )

  const top3 = ROWS.slice(0, 3)
  const gapData = ROWS.slice(0, 6).map((r: any) => ({
    skill: r.skill.split(' ')[0],
    requests: r.requests,
    students: r.students,
  }))
  const topSkill = ROWS[0]
  const gapTotal = GAP.length
  const gapHave = GAP.filter((g: any) => g.have).length
  const readyPct = gapTotal > 0 ? Math.round((gapHave / gapTotal) * 100) : 0
  const gapMissing = gapTotal - gapHave

  if (!data) return null;

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
          {top3.map((r: any) => {
            const tone = LEVEL_TONES[r.level as Level]
            const sparkData = r.spark.map((v: number, i: number) => ({ i, v }))
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
            emoji="📊"
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
                  {rows.map((r: any) => {
                    const tone = LEVEL_TONES[r.level as Level]
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
        <SectionTitle title="Grow Your Skills" subtitle="AI skill-gap analysis for your profile" />
        <Grid min={340} gap={18} style={{ marginBottom: 26 }}>
          <Card>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, marginBottom: 14 }}>
              Your {topSkill?.category || 'top'} stack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {GAP.map((g: any) => (
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
              <CircleProgress value={readyPct} size={96} label="ready" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.text, lineHeight: 1.45 }}>
                  You&apos;re {readyPct}% ready for current {topSkill?.category || 'in-demand'} opportunities.
                </div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>
                  {gapMissing} of {gapTotal} in-demand skills are still missing from your profile.
                </div>
              </div>
            </div>
          </Card>

          <Card style={{ display: 'flex', flexDirection: 'column' }}>
            <Badge color="#7C3AED" bg="#EDE9FE">
              Recommended next step
            </Badge>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.8, color: C.text, marginTop: 12 }}>
              {topSkill ? `Learn ${topSkill.skill}` : 'Build your profile'}
            </div>
            <div style={{ fontSize: 13.5, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>
              {topSkill
                ? `${topSkill.skill} leads the demand signals near Peradeniya this month. Adding it unlocks the highest-value briefs on the board.`
                : 'Complete your profile and skills to see personalised recommendations.'}
            </div>
            <Grid min={140} gap={12} style={{ marginTop: 18 }}>
              <div style={{ padding: 14, borderRadius: 14, background: C.primary + '0D', border: `1px solid ${C.primary}22` }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: -0.6 }}>{topSkill?.requests ?? 0}</div>
                <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 700, marginTop: 2 }}>
                  Matching opportunities
                </div>
              </div>
              <div style={{ padding: 14, borderRadius: 14, background: C.accent + '0D', border: `1px solid ${C.accent}22` }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: -0.4 }}>
                  {rupees(topSkill?.budget ?? 0)}
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
            {topSkill?.skill || 'Top skill'} requests near Peradeniya, weekly
          </div>
          <div style={{ height: 180, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ROWS[0]?.spark?.map((v: number, i: number) => ({ week: `W${i + 1}`, requests: v })) || []}
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
          title={topSkill ? `${topSkill.skill} demand is outpacing supply` : 'Demand data coming soon'}
          action={<Btn onClick={() => onNavigate('demand-cluster')}>See cluster</Btn>}
        >
          {topSkill
            ? `${topSkill.requests} requests are competing for only ${topSkill.students || 'a handful of'} available ${topSkill.skill.toLowerCase()} providers near Peradeniya. Requesters are paying an average of ${rupees(topSkill.budget)} per brief — a strong moment to raise your rates.`
            : 'No demand signals have been recorded yet. Check back once requests are posted near you.'}
        </AICallout>
      </Shell>
    </div>
  )
}
