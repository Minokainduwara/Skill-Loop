import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PageProps } from '../../types'
import { AICallout, Btn, C, Card, Grid, rupees, SectionTitle, StatusBadge } from '../../components/ui'

const WEEKLY_JOBS = [
  { day: 'Mon', posted: 12, completed: 8 },
  { day: 'Tue', posted: 18, completed: 11 },
  { day: 'Wed', posted: 14, completed: 13 },
  { day: 'Thu', posted: 22, completed: 15 },
  { day: 'Fri', posted: 28, completed: 19 },
  { day: 'Sat', posted: 16, completed: 14 },
  { day: 'Sun', posted: 9, completed: 7 },
]

const VOLUME_TREND = [
  { month: 'Mar', value: 42000 },
  { month: 'Apr', value: 58000 },
  { month: 'May', value: 71000 },
  { month: 'Jun', value: 65000 },
  { month: 'Jul', value: 88000 },
  { month: 'Aug', value: 112000 },
]

const RECENT_JOBS = [
  { title: 'Event Poster Design', student: 'Kasun Perera', requester: 'Student Society', budget: 2000, status: 'In Progress' },
  { title: 'Restaurant Menu Layout', student: 'Nimali J.', requester: 'Kandy Hills Café', budget: 1500, status: 'Awaiting Review' },
  { title: 'Physics Tuition Grade 12', student: 'Roshan M.', requester: 'Dinuka Bandara', budget: 3000, status: 'Completed' },
  { title: 'CV & Cover Letter', student: 'Tharaka S.', requester: 'Individual', budget: 1000, status: 'In Progress' },
  { title: 'Instagram Reel Edit', student: 'Priya W.', requester: 'Café Brown', budget: 2500, status: 'Pending' },
]

const TOP_STUDENTS = [
  { name: 'Kasun Perera', jobs: 18, earned: 24500, trust: 92, rating: 4.8 },
  { name: 'Nimali Jayasuriya', jobs: 14, earned: 19200, trust: 88, rating: 4.7 },
  { name: 'Roshan Mendis', jobs: 11, earned: 15800, trust: 85, rating: 4.6 },
  { name: 'Tharaka Silva', jobs: 9, earned: 12300, trust: 82, rating: 4.5 },
]

function KPICard({ icon, label, value, delta, tone }: { icon: string; label: string; value: string; delta?: string; tone?: string }) {
  return (
    <Card pad={20}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, letterSpacing: 0.8, marginBottom: 10 }}>{label.toUpperCase()}</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1, color: tone ?? C.text }}>{value}</div>
          {delta && (
            <div style={{ fontSize: 12, fontWeight: 700, color: C.success, marginTop: 4 }}>↑ {delta} this month</div>
          )}
        </div>
        <div style={{ fontSize: 26 }}>{icon}</div>
      </div>
    </Card>
  )
}

export default function AdminDashboard({ onNavigate }: PageProps) {
  return (
    <div style={{ padding: '28px 32px 80px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, letterSpacing: 0.5, marginBottom: 4 }}>Overview · August 2026</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.8 }}>Platform Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" size="sm" onClick={() => onNavigate('admin-analytics')}>View Analytics</Btn>
          <Btn size="sm" onClick={() => onNavigate('admin-users')}>Manage Users</Btn>
        </div>
      </div>

      {/* KPIs */}
      <Grid min={200} gap={14} style={{ marginBottom: 24 }}>
        <KPICard icon="👥" label="Total Students" value="1,284" delta="+48" tone={C.primary} />
        <KPICard icon="🏪" label="Requesters" value="342" delta="+12" tone="#7C3AED" />
        <KPICard icon="💼" label="Active Jobs" value="87" delta="+23" tone={C.accent} />
        <KPICard icon="💰" label="Volume Transacted" value={rupees(112000)} delta={rupees(24000)} tone={C.success} />
      </Grid>
      <Grid min={200} gap={14} style={{ marginBottom: 28 }}>
        <KPICard icon="🤝" label="AI Matches Made" value="3,841" delta="+318" />
        <KPICard icon="⭐" label="Avg Student Rating" value="4.7 / 5" />
        <KPICard icon="✅" label="Completion Rate" value="94.2%" delta="+1.8%" tone={C.success} />
        <KPICard icon="🛡️" label="Disputes Open" value="3" tone={C.error} />
      </Grid>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <Card pad={22}>
          <SectionTitle title="Weekly Job Activity" subtitle="Posted vs Completed" />
          <div style={{ height: 200, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_JOBS} margin={{ top: 0, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={C.subtle} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 12 }} />
                <Bar dataKey="posted" fill={C.primary + '80'} radius={[5, 5, 0, 0]} name="Posted" />
                <Bar dataKey="completed" fill={C.primary} radius={[5, 5, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.primary + '80', display: 'inline-block' }} /> Posted
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: C.primary, display: 'inline-block' }} /> Completed
            </span>
          </div>
        </Card>

        <Card pad={22}>
          <SectionTitle title="Monthly Volume" subtitle="Total platform transactions" />
          <div style={{ height: 200, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOLUME_TREND} margin={{ top: 0, right: 6, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.accent} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.subtle} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: any) => rupees(Number(v))} contentStyle={{ borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke={C.accent} strokeWidth={2.5} fill="url(#volGrad)" name="Volume" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent jobs + top students */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 24 }}>
        <Card pad={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Recent Jobs</div>
            <Btn variant="ghost" size="sm" onClick={() => onNavigate('admin-jobs')}>All jobs →</Btn>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${C.border}` }}>
                {['Job', 'Student', 'Budget', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0 10px 10px 0', textAlign: 'left', fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.6 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_JOBS.map((j, i) => (
                <tr key={j.title} style={{ borderBottom: i < RECENT_JOBS.length - 1 ? `1px solid ${C.subtle}` : 'none' }}>
                  <td style={{ padding: '12px 10px 12px 0', fontWeight: 700, color: C.text, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</td>
                  <td style={{ padding: '12px 10px 12px 0', color: C.muted }}>{j.student}</td>
                  <td style={{ padding: '12px 10px 12px 0', fontWeight: 700, color: C.text }}>{rupees(j.budget)}</td>
                  <td style={{ padding: '12px 0 12px 0' }}><StatusBadge status={j.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card pad={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Top Students</div>
            <Btn variant="ghost" size="sm" onClick={() => onNavigate('admin-users')}>All →</Btn>
          </div>
          {TOP_STUDENTS.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i === 0 ? 'none' : `1px solid ${C.subtle}` }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: C.primary, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted }}>{s.jobs} jobs · ⭐ {s.rating}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.success }}>{rupees(s.earned)}</div>
                <div style={{ fontSize: 11, color: C.faint }}>Trust {s.trust}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* AI insight */}
      <AICallout
        title="Platform health is strong — but 3 disputes need attention"
        action={<Btn size="sm" onClick={() => onNavigate('admin-jobs')}>Review Disputes</Btn>}
      >
        AI analysis: 94% job completion rate (industry benchmark 78%). Graphic Design demand in Kandy still outpaces supply by 3×.
        Recommend recruiting 8–12 more design students in Peradeniya to close the gap.
      </AICallout>
    </div>
  )
}
