import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PageProps } from '../../types'
import { AICallout, Btn, C, Card, Grid, rupees, SectionTitle } from '../../components/ui'

const GROWTH = [
  { month: 'Mar', students: 820, jobs: 38, volume: 42000 },
  { month: 'Apr', students: 940, jobs: 52, volume: 58000 },
  { month: 'May', students: 1020, jobs: 67, volume: 71000 },
  { month: 'Jun', students: 1100, jobs: 61, volume: 65000 },
  { month: 'Jul', students: 1190, jobs: 82, volume: 88000 },
  { month: 'Aug', students: 1284, jobs: 87, volume: 112000 },
]

const SKILL_DEMAND = [
  { skill: 'Graphic Design', demand: 94, supply: 58, gap: 36 },
  { skill: 'Video Editing', demand: 76, supply: 42, gap: 34 },
  { skill: 'Web Dev', demand: 68, supply: 31, gap: 37 },
  { skill: 'Photography', demand: 55, supply: 49, gap: 6 },
  { skill: 'Tutoring', demand: 88, supply: 72, gap: 16 },
  { skill: 'Music', demand: 32, supply: 28, gap: 4 },
]

const CATEGORY_MIX = [
  { name: 'Design', value: 42, fill: C.primary },
  { name: 'Tutoring', value: 28, fill: C.accent },
  { name: 'Video', value: 14, fill: '#7C3AED' },
  { name: 'Web Dev', value: 11, fill: C.warning },
  { name: 'Other', value: 5, fill: C.faint },
]

const GEO = [
  { location: 'Peradeniya', students: 412, jobs: 38, volume: 48000 },
  { location: 'Kandy City', students: 318, jobs: 29, volume: 35000 },
  { location: 'Katugastota', students: 187, jobs: 11, volume: 14000 },
  { location: 'Gatambe', students: 142, jobs: 6, volume: 8500 },
  { location: 'Digana', students: 98, jobs: 3, volume: 4200 },
  { location: 'Other', students: 127, jobs: 0, volume: 0 },
]

const AI_STATS = [
  { label: 'Matches Generated', value: '3,841', delta: '+318 this month' },
  { label: 'Match Acceptance Rate', value: '68%', delta: '+5% vs last month' },
  { label: 'Avg Match Score', value: '87%', delta: 'Top 10% of platform' },
  { label: 'Clusters Detected', value: '24', delta: '4 active right now' },
]

export default function AdminAnalytics({ onNavigate }: PageProps) {
  return (
    <div style={{ padding: '28px 32px 80px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, letterSpacing: 0.5, marginBottom: 4 }}>Analytics · Live</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.8 }}>Platform Analytics</h1>
        </div>
        <Btn variant="secondary" size="sm">Export Report</Btn>
      </div>

      {/* Growth trends */}
      <Card pad={22} style={{ marginBottom: 20 }}>
        <SectionTitle title="Platform Growth" subtitle="Students registered, jobs posted and volume (6 months)" />
        <div style={{ height: 220, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GROWTH} margin={{ top: 0, right: 6, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.primary} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="volGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.success} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={C.success} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.subtle} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={(v: unknown) => `${Number(v) / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Area yAxisId="left" type="monotone" dataKey="students" stroke={C.primary} strokeWidth={2.5} fill="url(#studGrad)" name="Students" />
              <Area yAxisId="right" type="monotone" dataKey="volume" stroke={C.success} strokeWidth={2} fill="url(#volGrad2)" name="Volume (Rs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 10 }}>
          {[{ label: 'Students', color: C.primary }, { label: 'Volume (Rs)', color: C.success }].map(l => (
            <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: 'inline-block' }} /> {l.label}
            </span>
          ))}
        </div>
      </Card>

      {/* Skill demand vs supply + category mix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card pad={22}>
          <SectionTitle title="Skill Demand vs Supply" subtitle="Identifies gaps the platform can fill" />
          <div style={{ height: 220, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SKILL_DEMAND} margin={{ top: 0, right: 6, left: -18, bottom: 0 }} layout="vertical">
                <CartesianGrid stroke={C.subtle} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis dataKey="skill" type="category" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} width={88} />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 12 }} />
                <Bar dataKey="demand" fill={C.primary} radius={[0, 5, 5, 0]} name="Demand" />
                <Bar dataKey="supply" fill={C.accent} radius={[0, 5, 5, 0]} name="Supply" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            {[{ label: 'Demand', color: C.primary }, { label: 'Supply', color: C.accent }].map(l => (
              <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: 'inline-block' }} /> {l.label}
              </span>
            ))}
          </div>
        </Card>

        <Card pad={22}>
          <SectionTitle title="Job Category Mix" />
          <div style={{ height: 180, minWidth: 0, margin: '0 auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_MIX} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                  {CATEGORY_MIX.map((c) => <Cell key={c.name} fill={c.fill} />)}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {CATEGORY_MIX.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: c.fill, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: C.muted }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: C.text }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Geographic breakdown */}
      <Card pad={22} style={{ marginBottom: 20 }}>
        <SectionTitle title="Geographic Breakdown" subtitle="Students and job volume by location" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${C.border}` }}>
                {['Location', 'Students', 'Jobs Posted', 'Volume', 'Share'].map(h => (
                  <th key={h} style={{ padding: '0 14px 12px 0', textAlign: 'left', fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.6 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GEO.map((g, i) => {
                const share = Math.round((g.students / 1284) * 100)
                return (
                  <tr key={g.location} style={{ borderBottom: i < GEO.length - 1 ? `1px solid ${C.subtle}` : 'none' }}>
                    <td style={{ padding: '12px 14px 12px 0', fontWeight: 700, color: C.text }}>{g.location}</td>
                    <td style={{ padding: '12px 14px 12px 0', color: C.muted }}>{g.students.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px 12px 0', color: C.muted }}>{g.jobs}</td>
                    <td style={{ padding: '12px 14px 12px 0', fontWeight: 700, color: C.success }}>{g.volume > 0 ? rupees(g.volume) : '—'}</td>
                    <td style={{ padding: '12px 14px 12px 0', minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 5, borderRadius: 3, background: C.subtle, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${share}%`, background: C.primary, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.text, minWidth: 28 }}>{share}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Engine stats */}
      <div style={{ marginBottom: 20 }}>
        <SectionTitle title="AI Matching Engine" subtitle="Performance of the SkillLoop AI" />
        <Grid min={200} gap={14}>
          {AI_STATS.map(s => (
            <Card key={s.label} pad={18}>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, color: C.primary }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11.5, color: C.success, fontWeight: 700, marginTop: 3 }}>↑ {s.delta}</div>
            </Card>
          ))}
        </Grid>
      </div>

      <AICallout
        title="Demand-supply gap alert: Web Dev shortage in Kandy"
        action={<Btn size="sm" onClick={() => onNavigate('admin-users')}>Recruit Students</Btn>}
      >
        Web Development has a 37-point demand-supply gap — the largest on the platform. Recruiting 10–15 web dev students from
        University of Peradeniya faculty could unlock an estimated {rupees(85000)} in annual local economic activity.
      </AICallout>
    </div>
  )
}
