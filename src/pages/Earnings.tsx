import { useMemo, useState } from 'react'
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
import type { PageProps } from '../types'
import {
  Badge,
  Btn,
  C,
  Card,
  Divider,
  EmptyState,
  Grid,
  HERO_GRADIENT,
  PageHead,
  Progress,
  SHADOW,
  Shell,
  SectionTitle,
  Select,
  SkillChip,
  StatCard,
  rupees,
} from '../components/ui'

const PALETTE = ['#4F46E5', '#14B8A6', '#7C3AED', '#F59E0B', '#0EA5E9', '#16A34A']

interface Point {
  month: string
  income: number
}

const SERIES: Record<string, Point[]> = {
  '6 months': [
    { month: 'Feb', income: 1800 },
    { month: 'Mar', income: 2600 },
    { month: 'Apr', income: 3400 },
    { month: 'May', income: 4100 },
    { month: 'Jun', income: 5200 },
    { month: 'Jul', income: 6600 },
    { month: 'Aug', income: 7800 },
  ],
  '12 months': [
    { month: 'Sep', income: 900 },
    { month: 'Oct', income: 1200 },
    { month: 'Nov', income: 1500 },
    { month: 'Dec', income: 1100 },
    { month: 'Jan', income: 1600 },
    { month: 'Feb', income: 1800 },
    { month: 'Mar', income: 2600 },
    { month: 'Apr', income: 3400 },
    { month: 'May', income: 4100 },
    { month: 'Jun', income: 5200 },
    { month: 'Jul', income: 6600 },
    { month: 'Aug', income: 7800 },
  ],
  All: [
    { month: '2024 Q3', income: 2400 },
    { month: '2024 Q4', income: 3800 },
    { month: '2025 Q1', income: 6000 },
    { month: '2025 Q2', income: 12700 },
    { month: '2025 Q3', income: 14400 },
  ],
}

const PERIODS = ['6 months', '12 months', 'All']

interface CategoryRow {
  label: string
  amount: number
  jobs: number
  color: string
}

const CATEGORIES: CategoryRow[] = [
  { label: 'Graphic Design', amount: 11200, jobs: 8, color: PALETTE[0] },
  { label: 'Tutoring', amount: 5400, jobs: 4, color: PALETTE[1] },
  { label: 'Web Development', amount: 4700, jobs: 3, color: PALETTE[2] },
  { label: 'Video Editing', amount: 3200, jobs: 3, color: PALETTE[3] },
]

const CATEGORY_TOTAL = CATEGORIES.reduce((sum, c) => sum + c.amount, 0)

type TxStatus = 'Paid' | 'Pending' | 'Processing'

interface Tx {
  id: string
  title: string
  client: string
  date: string
  amount: number
  status: TxStatus
}

const TRANSACTIONS: Tx[] = [
  { id: 't1', title: 'Robotics Exhibition Poster', client: 'University Robotics Society', date: '12 Aug 2026', amount: 2000, status: 'Paid' },
  { id: 't2', title: 'Cafe Menu Redesign', client: 'Nimali Jayasuriya', date: '09 Aug 2026', amount: 1500, status: 'Processing' },
  { id: 't3', title: 'A/L Maths Tutoring — 4 sessions', client: 'Nimal Silva', date: '05 Aug 2026', amount: 2400, status: 'Paid' },
  { id: 't4', title: 'Small Business Landing Page', client: 'Kandy Spice House', date: '02 Aug 2026', amount: 3200, status: 'Pending' },
  { id: 't5', title: 'Instagram Reel Edit', client: 'Peradeniya Music Club', date: '28 Jul 2026', amount: 1200, status: 'Paid' },
  { id: 't6', title: 'Sports Meet Banner Set', client: 'Faculty of Engineering', date: '21 Jul 2026', amount: 1800, status: 'Paid' },
  { id: 't7', title: 'Product Photo Retouching', client: 'Colombo Craft Store', date: '14 Jul 2026', amount: 900, status: 'Paid' },
  { id: 't8', title: 'Society Website Bug Fixes', client: 'ICT Students Union', date: '08 Jul 2026', amount: 1500, status: 'Pending' },
]

const TX_TONES: Record<TxStatus, { color: string; bg: string }> = {
  Paid: { color: '#15803D', bg: '#DCFCE7' },
  Pending: { color: '#B45309', bg: '#FEF3C7' },
  Processing: { color: '#1D4ED8', bg: '#DBEAFE' },
}

const tooltipStyle = {
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  boxShadow: SHADOW.md,
  fontSize: 12.5,
  fontWeight: 600,
  padding: '8px 12px',
}

export default function Earnings({ onNavigate }: PageProps) {
  const [period, setPeriod] = useState(PERIODS[0])
  const [filter, setFilter] = useState('All')

  const data = SERIES[period] ?? SERIES[PERIODS[0]]

  const rows = useMemo(
    () => (filter === 'All' ? TRANSACTIONS : TRANSACTIONS.filter((t) => t.status === filter)),
    [filter],
  )

  const filteredTotal = rows.reduce((sum, r) => sum + r.amount, 0)

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <Shell>
        <PageHead
          eyebrow="Wallet"
          title="My Earnings"
          subtitle="Every rupee you have earned through skills offered near Peradeniya and Kandy, tracked in one place."
          actions={
            <>
              <Btn variant="secondary" onClick={() => onNavigate('my-jobs')}>
                View jobs
              </Btn>
              <Btn onClick={() => onNavigate('economic-impact')}>Economic impact →</Btn>
            </>
          }
        />

        {/* -------------------------------------------------------- hero */}
        <div
          className="sl-rise"
          style={{
            background: HERO_GRADIENT,
            borderRadius: 24,
            padding: 28,
            color: '#fff',
            boxShadow: SHADOW.lg,
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: -70,
              top: -70,
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: 'rgba(94,234,212,0.16)',
              filter: 'blur(4px)',
            }}
          />
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 26,
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.66)' }}>
                Total earned
              </div>
              <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: -2.2, lineHeight: 1.05, marginTop: 6 }}>
                {rupees(24500)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.82)', fontWeight: 600 }}>
                  This month {rupees(7800)}
                </span>
                <Badge color="#5EEAD4" bg="rgba(94,234,212,0.16)">
                  ▲ +18%
                </Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 12.5, color: 'rgba(255,255,255,0.6)' }}>
                <span>🏦</span> Payout account · Bank of Ceylon •••• 4821 · Kandy branch
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 220 }}>
              <Btn variant="accent" size="lg" onClick={() => onNavigate('earnings')}>
                Withdraw earnings
              </Btn>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  fontSize: 12.5,
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.5,
                }}
              >
                Withdrawals reach your bank within 2 working days. No platform fee for students.
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- stats */}
        <Grid min={230} style={{ marginBottom: 30 }}>
          <StatCard icon="💵" label="Available" value={rupees(6300)} tone={C.success} />
          <StatCard icon="⏳" label="Pending" value={rupees(2000)} tone={C.warning} />
          <StatCard icon="📈" label="Total earned" value={rupees(24500)} delta="+18%" tone={C.primary} />
          <StatCard icon="✅" label="Completed jobs" value={18} delta="+3" tone={C.accent} />
        </Grid>

        {/* ------------------------------------------------------ charts */}
        <SectionTitle
          title="Monthly income"
          subtitle="Your earnings trend across completed opportunities"
          action={
            <div style={{ display: 'flex', gap: 8 }}>
              {PERIODS.map((p) => (
                <SkillChip key={p} label={p} active={p === period} onClick={() => setPeriod(p)} />
              ))}
            </div>
          }
        />
        <Card style={{ marginBottom: 30 }} pad={20}>
          <div style={{ height: 300, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="earnBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: C.muted }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: C.muted }}
                  tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: unknown) => [rupees(Number(v)), 'Income']}
                  cursor={{ fill: 'rgba(79,70,229,0.06)' }}
                />
                <Bar dataKey="income" fill="url(#earnBar)" radius={[10, 10, 4, 4]} maxBarSize={46} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* -------------------------------------------------- categories */}
        <SectionTitle title="Where your income comes from" subtitle="Breakdown by skill category" />
        <Grid min={340} gap={18} style={{ marginBottom: 30 }}>
          <Card>
            {CATEGORIES.map((cat) => {
              const pct = Math.round((cat.amount / CATEGORY_TOTAL) * 100)
              return (
                <div key={cat.label} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 3, background: cat.color, marginRight: 8 }} />
                      {cat.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>
                      {rupees(cat.amount)}{' '}
                      <span style={{ color: C.faint, fontWeight: 700 }}>· {pct}%</span>
                    </span>
                  </div>
                  <Progress value={pct} gradient={`linear-gradient(90deg, ${cat.color}, ${cat.color}99)`} />
                  <div style={{ fontSize: 11.5, color: C.faint, marginTop: 6, fontWeight: 600 }}>
                    {cat.jobs} completed jobs · avg {rupees(Math.round(cat.amount / cat.jobs))}
                  </div>
                </div>
              )
            })}
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 800, color: C.text }}>
              <span>Total</span>
              <span>{rupees(CATEGORY_TOTAL)}</span>
            </div>
          </Card>

          <Card pad={20}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, marginBottom: 4 }}>Category share</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 10 }}>
              Graphic Design is your strongest earner
            </div>
            <div style={{ height: 210, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORIES}
                    dataKey="amount"
                    nameKey="label"
                    innerRadius={54}
                    outerRadius={86}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {CATEGORIES.map((cat) => (
                      <Cell key={cat.label} fill={cat.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => rupees(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {CATEGORIES.map((cat) => (
                <Badge key={cat.label} color={cat.color} dot>
                  {cat.label}
                </Badge>
              ))}
            </div>
          </Card>
        </Grid>

        {/* ------------------------------------------------ mini area viz */}
        <Card style={{ marginBottom: 30 }} pad={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>Cumulative growth</div>
              <div style={{ fontSize: 12.5, color: C.muted }}>Momentum since your first job in February</div>
            </div>
            <Badge color={C.success} dot>
              Steady climb
            </Badge>
          </div>
          <div style={{ height: 170, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SERIES['6 months']} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="earnArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.42} />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: C.muted }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: C.muted }}
                  tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [rupees(Number(v)), 'Income']} />
                <Area type="monotone" dataKey="income" stroke="#14B8A6" strokeWidth={2.5} fill="url(#earnArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ---------------------------------------------- transactions */}
        <SectionTitle
          title="Transaction history"
          subtitle={`${rows.length} transactions · ${rupees(filteredTotal)}`}
          action={
            <Select
              value={filter}
              onChange={setFilter}
              options={['All', 'Paid', 'Pending']}
              style={{ width: 150 }}
            />
          }
        />
        {rows.length === 0 ? (
          <EmptyState
            emoji="🧾"
            title="No transactions here"
            text="Nothing matches this filter yet. Try switching back to all transactions."
            action={<Btn variant="secondary" onClick={() => setFilter('All')}>Show all</Btn>}
          />
        ) : (
          <Card pad={0} style={{ overflow: 'hidden', marginBottom: 30 }}>
            {rows.map((tx, i) => {
              const tone = TX_TONES[tx.status]
              return (
                <div
                  key={tx.id}
                  className="sl-link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 20px',
                    borderTop: i === 0 ? 'none' : `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: tone.bg,
                      color: tone.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 17,
                      flexShrink: 0,
                    }}
                  >
                    {tx.status === 'Paid' ? '✓' : tx.status === 'Pending' ? '⏳' : '↻'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tx.title}
                    </div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
                      {tx.client} · {tx.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>{rupees(tx.amount)}</div>
                    <div style={{ marginTop: 5 }}>
                      <Badge color={tone.color} bg={tone.bg}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </Card>
        )}

        {/* --------------------------------------------------- footer CTA */}
        <Card
          style={{
            background: 'linear-gradient(120deg, #EEF2FF 0%, #F0FDFA 100%)',
            border: '1px solid #C7D2FE',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 18,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.primaryDark }}>
              Your earnings are part of something bigger
            </div>
            <div style={{ fontSize: 13.5, color: '#4338CA', marginTop: 5, maxWidth: 520, lineHeight: 1.6 }}>
              See how {rupees(24500)} of student income adds up to real economic value across the Kandy community.
            </div>
          </div>
          <Btn size="lg" onClick={() => onNavigate('economic-impact')}>
            View economic impact
          </Btn>
        </Card>
      </Shell>
    </div>
  )
}
