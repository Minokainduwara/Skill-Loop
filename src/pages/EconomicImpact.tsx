import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
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
  Grid,
  HERO_GRADIENT,
  InfoTile,
  KPI,
  PageHead,
  Progress,
  SHADOW,
  SectionTitle,
  Shell,
  SkillChip,
  Icon,
  rupees,
} from '../components/ui'

const PALETTE = ['#4F46E5', '#14B8A6', '#7C3AED', '#F59E0B', '#0EA5E9', '#16A34A']

const tooltipStyle = {
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  boxShadow: SHADOW.md,
  fontSize: 12.5,
  fontWeight: 600,
  padding: '8px 12px',
}

type Scope = 'mine' | 'community'

interface TrendPoint {
  month: string
  income: number
  students: number
}

const TREND: Record<Scope, TrendPoint[]> = {
  mine: [
    { month: 'Feb', income: 1800, students: 1 },
    { month: 'Mar', income: 2600, students: 1 },
    { month: 'Apr', income: 3400, students: 1 },
    { month: 'May', income: 4100, students: 1 },
    { month: 'Jun', income: 5200, students: 1 },
    { month: 'Jul', income: 6600, students: 1 },
    { month: 'Aug', income: 7800, students: 1 },
  ],
  community: [
    { month: 'Feb', income: 8200, students: 9 },
    { month: 'Mar', income: 13400, students: 14 },
    { month: 'Apr', income: 18900, students: 21 },
    { month: 'May', income: 24600, students: 28 },
    { month: 'Jun', income: 31200, students: 35 },
    { month: 'Jul', income: 27800, students: 41 },
    { month: 'Aug', income: 32400, students: 47 },
  ],
}

interface SkillRow {
  skill: string
  requests: number
}

const SKILLS: Record<Scope, SkillRow[]> = {
  mine: [
    { skill: 'Graphic Design', requests: 8 },
    { skill: 'Tutoring', requests: 4 },
    { skill: 'Web Development', requests: 3 },
    { skill: 'Video Editing', requests: 3 },
    { skill: 'Photography', requests: 2 },
  ],
  community: [
    { skill: 'Graphic Design', requests: 42 },
    { skill: 'Video Editing', requests: 31 },
    { skill: 'Web Development', requests: 27 },
    { skill: 'Tutoring', requests: 21 },
    { skill: 'Photography', requests: 18 },
  ],
}

interface CatRow {
  name: string
  value: number
}

const CATS: Record<Scope, CatRow[]> = {
  mine: [
    { name: 'Design', value: 8 },
    { name: 'Education', value: 4 },
    { name: 'Development', value: 3 },
    { name: 'Media', value: 3 },
  ],
  community: [
    { name: 'Design', value: 34 },
    { name: 'Media', value: 22 },
    { name: 'Development', value: 15 },
    { name: 'Education', value: 9 },
    { name: 'Admin', value: 4 },
  ],
}

interface ScopeSummary {
  headline: number
  caption: string
  kpis: { value: string; label: string }[]
}

const SUMMARY: Record<Scope, ScopeSummary> = {
  mine: {
    headline: 33700,
    caption: 'Economic value you have personally generated through SkillLoop',
    kpis: [
      { value: '18', label: 'Jobs completed' },
      { value: '15', label: 'People helped' },
      { value: rupees(9200), label: 'Requester savings' },
      { value: '42', label: 'Hours of work' },
    ],
  },
  community: {
    headline: 156500,
    caption: 'Economic value generated through SkillLoop',
    kpis: [
      { value: '47', label: 'Students earned' },
      { value: '84', label: 'Jobs completed' },
      { value: rupees(72000), label: 'Requester savings' },
      { value: '126', label: 'Opportunities discovered' },
    ],
  },
}

const FLOW = [
  { label: 'Requester Spending', value: 320000, note: 'Paid by clubs, shops and families', gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)' },
  { label: 'Student Earnings', value: 156500, note: 'Income reaching 47 students', gradient: 'linear-gradient(135deg, #7C3AED, #0EA5E9)' },
  { label: 'Community Economic Value', value: 228000, note: 'Re-spent locally in Kandy', gradient: 'linear-gradient(135deg, #0EA5E9, #14B8A6)' },
]

const RETENTION = [
  { label: 'External spending (leaves the community)', amount: 500000, pct: 100, color: C.faint },
  { label: 'SkillLoop-connected spending (stays local)', amount: 320000, pct: 64, color: C.accent },
]

export default function EconomicImpact({ onNavigate }: PageProps) {
  const [scope, setScope] = useState<Scope>('community')
  const summary = SUMMARY[scope]
  const trend = TREND[scope]
  const skills = SKILLS[scope]
  const cats = CATS[scope]

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Shell>
        <PageHead
          eyebrow="Analytics"
          title="Economic Impact"
          subtitle="SkillLoop turns unused student skills into measurable local economic value around Matara District."
          actions={
            <>
              <Btn variant="secondary" onClick={() => onNavigate('earnings')}>
                My earnings
              </Btn>
              <Btn onClick={() => onNavigate('skill-demand')}>Skill demand →</Btn>
            </>
          }
        />

        {/* --------------------------------------------------------- hero */}
        <div
          className="sl-rise"
          style={{
            background: HERO_GRADIENT,
            borderRadius: 26,
            padding: 32,
            color: '#fff',
            boxShadow: SHADOW.lg,
            marginBottom: 22,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -90,
              bottom: -120,
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'rgba(79,70,229,0.28)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <Badge color="#5EEAD4" bg="rgba(94,234,212,0.14)">
              {scope === 'mine' ? 'My impact' : 'Community impact · Matara district'}
            </Badge>
            <div style={{ fontSize: 62, fontWeight: 800, letterSpacing: -2.8, lineHeight: 1.02, marginTop: 16 }}>
              {rupees(summary.headline)}
            </div>
            <div style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.76)', marginTop: 8, maxWidth: 520, lineHeight: 1.6 }}>
              {summary.caption}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: 20,
                marginTop: 30,
                paddingTop: 26,
                borderTop: '1px solid rgba(255,255,255,0.16)',
              }}
            >
              {summary.kpis.map((k) => (
                <KPI key={k.label} value={k.value} label={k.label} />
              ))}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- scope */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <SkillChip label="My impact" active={scope === 'mine'} onClick={() => setScope('mine')} />
          <SkillChip
            label="Community impact"
            active={scope === 'community'}
            onClick={() => setScope('community')}
            tone="accent"
          />
        </div>

        {/* ------------------------------------------------------- charts */}
        <Grid min={420} gap={18} style={{ marginBottom: 18 }}>
          <Card pad={20}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>Income generated over time</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 12 }}>
              Monthly earnings, February to August 2026
            </div>
            <div style={{ height: 250, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="eiArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={C.border} vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: C.muted }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: C.muted }}
                    tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
                  />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [rupees(Number(v)), 'Income']} />
                  <Area type="monotone" dataKey="income" stroke="#4F46E5" strokeWidth={2.6} fill="url(#eiArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card pad={20}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>Most demanded skills</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 12 }}>
              Requests received in the last 30 days
            </div>
            <div style={{ height: 250, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skills} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="eiHBar" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#14B8A6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={C.border} vertical={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: C.muted }} />
                  <YAxis
                    type="category"
                    dataKey="skill"
                    width={112}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: C.muted }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: unknown) => [`${Number(v)} requests`, 'Demand']}
                    cursor={{ fill: 'rgba(124,58,237,0.06)' }}
                  />
                  <Bar dataKey="requests" fill="url(#eiHBar)" radius={[4, 10, 10, 4]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>

        <Grid min={420} gap={18} style={{ marginBottom: 34 }}>
          <Card pad={20}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>Jobs by category</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 6 }}>
              Where the completed work sits
            </div>
            <div style={{ height: 250, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cats}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {cats.map((cat, i) => (
                      <Cell key={cat.name} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`${Number(v)} jobs`, 'Completed']} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, fontWeight: 600, color: C.muted, paddingTop: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card pad={20}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>Student participation</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 12 }}>
              {scope === 'mine' ? 'Your active months on the platform' : 'Students earning each month'}
            </div>
            <div style={{ height: 250, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={C.border} vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: C.muted }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: C.muted }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [`${Number(v)} students`, 'Active']} />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#0EA5E9"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0EA5E9', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>

        {/* ---------------------------------------------------- value flow */}
        <SectionTitle
          title="How value flows"
          subtitle="One payment creates value three times over inside the community"
        />
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {FLOW.map((step, i) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 260px' }}>
              <div
                className="sl-hover"
                style={{
                  flex: 1,
                  padding: 22,
                  borderRadius: 20,
                  background: step.gradient,
                  color: '#fff',
                  boxShadow: SHADOW.glow,
                  border: '1px solid rgba(255,255,255,0.18)',
                  minHeight: 150,
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)' }}>
                  Step {i + 1}
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1.2, marginTop: 10 }}>
                  {rupees(step.value)}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 6 }}>{step.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 4, lineHeight: 1.5 }}>
                  {step.note}
                </div>
              </div>
              {i < FLOW.length - 1 && (
                <span style={{ fontSize: 26, color: C.faint, fontWeight: 800, flexShrink: 0 }}>→</span>
              )}
            </div>
          ))}
        </div>

        <Card style={{ marginBottom: 34 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text, marginBottom: 4 }}>
            Money retained in the community
          </div>
          <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 18 }}>
            When requesters hire local students instead of outside providers, 64% of the spend stays in Kandy.
          </div>
          {RETENTION.map((r) => (
            <div key={r.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{rupees(r.amount)}</span>
              </div>
              <Progress
                value={r.pct}
                height={12}
                gradient={`linear-gradient(90deg, ${r.color}, ${r.color}aa)`}
              />
            </div>
          ))}
          <div
            style={{
              marginTop: 6,
              padding: '12px 16px',
              borderRadius: 14,
              background: C.accent + '12',
              border: `1px solid ${C.accent}33`,
              fontSize: 13,
              fontWeight: 700,
              color: '#0F766E',
            }}
          >
            {rupees(320000)} retained locally — money that keeps circulating between students, shops and families.
          </div>
        </Card>

        {/* ----------------------------------------------- personal impact */}
        <SectionTitle title="Your personal impact" subtitle="Kasun Perera · Peradeniya, Kandy" />
        <Grid min={200} gap={16} style={{ marginBottom: 30 }}>
          <InfoTile icon={<Icon name="coin" size={18} color={C.primary} />} label="Student income" value={rupees(24500)} tone={C.primary} />
          <InfoTile icon={<Icon name="tag" size={18} color={C.accent} />} label="Requester money saved" value={rupees(9200)} tone={C.accent} />
          <InfoTile icon={<Icon name="check" size={18} color="#7C3AED" />} label="Jobs completed" value="18" tone="#7C3AED" />
          <InfoTile icon={<Icon name="people" size={18} color={C.warning} />} label="People helped" value="15" tone={C.warning} />
          <InfoTile icon={<Icon name="clock" size={18} color="#0EA5E9" />} label="Hours of work" value="42" tone="#0EA5E9" />
        </Grid>

        <AICallout
          title="Every completed opportunity creates value for both sides."
          action={<Btn variant="secondary" onClick={() => onNavigate('opportunities')}>Find work</Btn>}
        >
          Students in this network earned {rupees(156500)} while requesters saved {rupees(72000)} against outside
          quotes. Each match keeps talent, trust and money inside the community.
        </AICallout>
      </Shell>
    </div>
  )
}
