
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useQuery, useMutation } from 'convex/react'
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
  Grid,
  InfoTile,
  PageHead,
  SectionTitle,
  Shell,
  SkillChip,
  rupees,
} from '../components/ui'

export default function DemandCluster({ onNavigate }: PageProps) {
  const data = useQuery(api.dashboardMock.getClusterDetails, {})
  const interested = useQuery(api.dashboardMock.getInterestState, {}) || false
  const expressInterest = useMutation(api.dashboardMock.expressInterest)

  const REQUESTS = data?.requests || []
  const SKILLS = data?.skills || []

  const total = REQUESTS.reduce((s: any, r: any) => s + r.budget, 0)
  const chartData = REQUESTS.map((r: any) => ({
    name: r.title.split(' ')[0],
    value: r.budget,
    fill: r.budget >= 2000 ? C.primary : r.budget >= 1200 ? '#7C3AED' : C.accent,
  }))

  return (
    <Shell>
      <PageHead
        eyebrow="Demand cluster"
        title="Graphic Design Opportunity"
        subtitle="SkillLoop grouped 7 scattered community requests into one high-value opportunity near you."
        onBack={() => onNavigate('radar')}
        backLabel="Back to Opportunity Radar"
        actions={<Badge color="#B91C1C" bg="#FEE2E2" dot>🔥 High demand</Badge>}
      />

      <Grid min={200} gap={14} style={{ marginBottom: 26 }}>
        <InfoTile icon="🙋" label="People looking" value="7 requesters" />
        <InfoTile icon="💰" label="Total request value" value={rupees(total)} tone={C.success} />
        <InfoTile icon="🎓" label="Skilled students" value="14 available" tone={C.accent} />
        <InfoTile icon="📍" label="Radius" value="5 km · Peradeniya" tone={C.warning} />
      </Grid>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 20,
        }}
      >
        {/* ---------------------------------------------- request list */}
        <div style={{ minWidth: 0 }}>
          <SectionTitle
            title="7 people need design services"
            subtitle="Every request below can be claimed individually"
          />
          <div style={{ display: 'grid', gap: 12 }}>
            {REQUESTS.map((r: any, i: number) => (
              <div key={r.title} className="sl-rise" style={{ animationDelay: `${i * 45}ms` }}>
                <Card hover pad={18}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 14,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #EEF2FF, #F0FDFA)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      🎨
                    </div>
                    <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{r.title}</div>
                      <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>
                        {r.requester} · 📍 {r.distance}
                      </div>
                      <div style={{ fontSize: 12, color: C.faint, marginTop: 3 }}>🕒 {r.deadline}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: C.text,
                          letterSpacing: -0.4,
                        }}
                      >
                        {rupees(r.budget)}
                      </div>
                      <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 700 }}>Budget</div>
                    </div>
                    <Btn variant="secondary" size="sm" onClick={() => onNavigate('opportunity-detail')}>
                      View
                    </Btn>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <Divider />

          <SectionTitle title="Required skills" subtitle="Matched against your verified skill profile" />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {SKILLS.map((s: string, i: number) => (
              <SkillChip key={s} label={s} active={i < 4} />
            ))}
          </div>

          <Card pad={20} style={{ marginBottom: 20 }}>
            <SectionTitle
              title="Request value distribution"
              subtitle={`Average task ${rupees(1500)} across 7 requests`}
            />
            <div style={{ height: 220, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke={C.subtle} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: C.muted }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v) => rupees(Number(v))}
                    contentStyle={{ borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[7, 7, 0, 0]}>
                    {chartData.map((d: any) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <AICallout
            title="How this cluster was detected"
            action={
              <Btn variant="secondary" size="sm" onClick={() => onNavigate('radar')}>
                Radar
              </Btn>
            }
          >
            Seven separate requests posted around Peradeniya and Kandy over the last five days used
            similar intent language (poster, menu, invitation, layout). SkillLoop AI clustered them
            into a single Graphic Design demand pocket worth {rupees(12500)} — invisible to any one
            requester on their own.
          </AICallout>
        </div>

        {/* ---------------------------------------------- sticky panel */}
        <div style={{ minWidth: 0 }}>
          <div style={{ position: 'sticky', top: 24, display: 'grid', gap: 14 }}>
            <Card pad={22}>
              <SectionTitle title="Opportunity Potential" />
              <div style={{ display: 'grid', gap: 12 }}>
                <Row label="Estimated demand" value={rupees(12500)} strong />
                <Row label="Potential student earnings" value={rupees(10500)} tone={C.success} strong />
                <Row label="Average task" value={rupees(1500)} />
                <Row label="Matching students" value="14" />
              </div>

              <Divider />

              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <CircleProgress value={96} size={92} label="MATCH" />
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>Your match: 96%</div>
                  <p style={{ margin: '6px 0 0', fontSize: 12.5, color: C.muted, lineHeight: 1.55 }}>
                    Top-ranked among 14 students on skill fit, trust score and distance.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                {interested ? (
                  <div
                    className="sl-rise"
                    style={{
                      padding: 18,
                      borderRadius: 16,
                      background: 'linear-gradient(120deg, #DCFCE7, #F0FDFA)',
                      border: '1px solid #86EFAC',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 30, animation: 'sl-pop .4s ease both' }}>✅</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#166534', marginTop: 8 }}>
                      You are in the running
                    </div>
                    <p style={{ margin: '6px 0 14px', fontSize: 12.5, color: '#15803D', lineHeight: 1.6 }}>
                      Interest recorded for all 7 requests. Next step: requesters review the AI match
                      shortlist and you will be notified within 24 hours.
                    </p>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <Btn size="sm" full onClick={() => onNavigate('ai-match')}>
                        View AI match shortlist
                      </Btn>
                      <Btn variant="secondary" size="sm" full onClick={() => onNavigate('opportunities')}>
                        Browse opportunities
                      </Btn>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 10 }}>
                    <Btn size="lg" full onClick={() => expressInterest({})}>
                      {"I'm Interested"}
                    </Btn>
                    <Btn variant="secondary" full onClick={() => onNavigate('messages')}>
                      💬 Message requesters
                    </Btn>
                  </div>
                )}
              </div>
            </Card>

            <Card pad={20}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, color: C.faint }}>
                CLUSTER SIGNALS
              </div>
              <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                <Row label="Demand level" value="🔥 HIGH" />
                <Row label="Requests in 5 days" value="7" />
                <Row label="Competition" value="Low · 14 students" />
                <Row label="Repeat-work chance" value="High" tone={C.success} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  )
}

function Row({
  label,
  value,
  tone = C.text,
  strong,
}: {
  label: string
  value: string
  tone?: string
  strong?: boolean
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
      <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{label}</span>
      <span
        style={{
          fontSize: strong ? 16 : 13.5,
          fontWeight: 800,
          color: tone,
          letterSpacing: strong ? -0.4 : 0,
        }}
      >
        {value}
      </span>
    </div>
  )
}
