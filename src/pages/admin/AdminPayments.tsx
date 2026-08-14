import { useState } from 'react'
import type { PageProps } from '../../types'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge, Btn, C, Card, Grid, SectionTitle, rupees } from '../../components/ui'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  Released: { color: '#15803D', bg: '#DCFCE7' },
  Escrowed: { color: '#1D4ED8', bg: '#DBEAFE' },
  'Pending Payout': { color: '#B45309', bg: '#FEF3C7' },
  Disputed: { color: '#B91C1C', bg: '#FEE2E2' },
}

function TxnBadge({ status }: { status: string }) {
  const t = STATUS_COLOR[status] ?? { color: C.muted, bg: C.subtle }
  return (
    <Badge dot color={t.color} bg={t.bg}>{status}</Badge>
  )
}

export default function AdminPayments(_props: PageProps) {
  void _props
  const transactionsData = useQuery(api.admin.getPayments)
  const weeklyData = useQuery(api.admin.getWeeklyCashFlow)
  
  const TRANSACTIONS = transactionsData || []
  const WEEKLY = weeklyData || []

  const [filter, setFilter] = useState('All')

  const totalReleased = TRANSACTIONS.filter(t => t.status === 'Released').reduce((s, t) => s + t.amount, 0)
  const totalEscrowed = TRANSACTIONS.filter(t => t.status === 'Escrowed').reduce((s, t) => s + t.amount, 0)
  const totalFees = TRANSACTIONS.reduce((s, t) => s + t.fee, 0)
  const pendingPayout = TRANSACTIONS.filter(t => t.status === 'Pending Payout').reduce((s, t) => s + t.net, 0)

  const filtered = filter === 'All' ? TRANSACTIONS : TRANSACTIONS.filter(t => t.status === filter)

  return (
    <div style={{ padding: '28px 32px 80px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, letterSpacing: 0.5, marginBottom: 4 }}>Finance · August 2026</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.8 }}>Payments</h1>
        </div>
        <Btn size="sm">Export CSV</Btn>
      </div>

      {/* KPI row */}
      <Grid min={180} gap={14} style={{ marginBottom: 24 }}>
        <Card pad={20}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.8, marginBottom: 8 }}>RELEASED</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.success, letterSpacing: -0.8 }}>{rupees(totalReleased)}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Paid to students</div>
        </Card>
        <Card pad={20}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.8, marginBottom: 8 }}>ESCROWED</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#1D4ED8', letterSpacing: -0.8 }}>{rupees(totalEscrowed)}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>In active jobs</div>
        </Card>
        <Card pad={20}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.8, marginBottom: 8 }}>PENDING PAYOUT</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.warning, letterSpacing: -0.8 }}>{rupees(pendingPayout)}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Awaiting release</div>
        </Card>
        <Card pad={20}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.8, marginBottom: 8 }}>PLATFORM FEES</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.primary, letterSpacing: -0.8 }}>{rupees(totalFees)}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>10% commission</div>
        </Card>
      </Grid>

      {/* Chart */}
      <Card pad={22} style={{ marginBottom: 24 }}>
        <SectionTitle title="Weekly Cash Flow" subtitle="Released vs Escrowed (Rs)" />
        <div style={{ height: 200, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY} margin={{ top: 0, right: 6, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id="relGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.success} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={C.success} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="escGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.subtle} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v: unknown) => rupees(Number(v ?? 0))} contentStyle={{ borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Area type="monotone" dataKey="released" stroke={C.success} strokeWidth={2} fill="url(#relGrad)" name="Released" />
              <Area type="monotone" dataKey="escrowed" stroke="#1D4ED8" strokeWidth={2} fill="url(#escGrad)" name="Escrowed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
          {[{ label: 'Released', color: C.success }, { label: 'Escrowed', color: '#1D4ED8' }].map(l => (
            <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: 'inline-block' }} /> {l.label}
            </span>
          ))}
        </div>
      </Card>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, padding: 4, background: C.subtle, borderRadius: 12, marginBottom: 16, width: 'fit-content' }}>
        {['All', 'Released', 'Escrowed', 'Pending Payout'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className="sl-press"
            style={{ padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, background: filter === s ? C.surface : 'transparent', color: filter === s ? C.text : C.muted, boxShadow: filter === s ? '0 1px 4px rgba(15,23,42,0.07)' : 'none' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Transactions table */}
      <Card pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.subtle }}>
                {['TXN ID', 'Job', 'Student', 'Amount', 'Fee (10%)', 'Net Payout', 'Date', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.6, whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}
                  style={{ borderTop: `1px solid ${C.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.subtle)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, fontFamily: 'monospace' }}>{t.id}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: C.text, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.job}</td>
                  <td style={{ padding: '12px 14px', color: C.muted }}>{t.student}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: C.text }}>{rupees(t.amount)}</td>
                  <td style={{ padding: '12px 14px', color: C.muted }}>{rupees(t.fee)}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: C.success }}>{rupees(t.net)}</td>
                  <td style={{ padding: '12px 14px', color: C.muted, whiteSpace: 'nowrap' }}>{t.date}</td>
                  <td style={{ padding: '12px 14px' }}><TxnBadge status={t.status} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    {t.status === 'Pending Payout' && <Btn size="sm">Release</Btn>}
                    {t.status === 'Escrowed' && <Btn variant="secondary" size="sm">View Job</Btn>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
