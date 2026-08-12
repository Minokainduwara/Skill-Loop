import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PageProps } from '../types'
import {
  AICallout,
  Badge,
  Btn,
  C,
  Card,
  Grid,
  HERO_GRADIENT,
  Icon,
  KPI,
  PageHead,
  SectionTitle,
  Shell,
  SkillChip,
  rupees,
} from '../components/ui'

type Level = 'HIGH' | 'MEDIUM' | 'LOW'

interface Cluster {
  key: string
  name: string
  icon: React.ReactNode
  requests: number
  value: number
  students: number
  level: Level
  x: number
  y: number
  area: string
}

const CLUSTERS: Cluster[] = [
  { key: 'design', name: 'Graphic Design', icon: <Icon name="brief" size={16} color="#fff" />, requests: 12, value: 18500, students: 8, level: 'HIGH', x: 36, y: 32, area: 'Peradeniya campus' },
  { key: 'video', name: 'Video Editing', icon: <Icon name="spark" size={16} color="#fff" />, requests: 8, value: 11200, students: 6, level: 'MEDIUM', x: 63, y: 26, area: 'Kandy town' },
  { key: 'web', name: 'Web Development', icon: <Icon name="brief" size={16} color="#fff" />, requests: 6, value: 14800, students: 5, level: 'MEDIUM', x: 71, y: 60, area: 'Colombo Road' },
  { key: 'tutor', name: 'Tutoring', icon: <Icon name="graduation" size={16} color="#fff" />, requests: 5, value: 9000, students: 11, level: 'LOW', x: 46, y: 70, area: 'Gatambe' },
  { key: 'photo', name: 'Photography', icon: <Icon name="spark" size={16} color="#fff" />, requests: 4, value: 7600, students: 4, level: 'LOW', x: 24, y: 58, area: 'Kandy Lake' },
  { key: 'social', name: 'Social Media', icon: <Icon name="target" size={16} color="#fff" />, requests: 3, value: 5400, students: 7, level: 'LOW', x: 55, y: 46, area: 'Peradeniya' },
]

const LEVEL_TONE: Record<Level, { color: string; bg: string; blip: string }> = {
  HIGH: { color: '#B91C1C', bg: '#FEE2E2', blip: '#FCA5A5' },
  MEDIUM: { color: '#B45309', bg: '#FEF3C7', blip: '#FDE68A' },
  LOW: { color: '#0F766E', bg: '#CCFBF1', blip: '#5EEAD4' },
}

const REQUESTS = [
  { text: 'I need someone to design an event flyer for our robotics exhibition.', time: '12 min ago', area: 'Peradeniya', hint: 'Rs. 2,000' },
  { text: 'Looking for an affordable social media poster set for my small bakery.', time: '48 min ago', area: 'Kandy', hint: 'Rs. 1,200' },
  { text: 'Need a birthday invitation designed by this weekend, something playful.', time: '2 hours ago', area: 'Gatambe', hint: 'Rs. 800' },
  { text: 'Can anyone redesign our restaurant menu? Print ready please.', time: '5 hours ago', area: 'Kandy town', hint: 'Rs. 1,500' },
  { text: 'Want a clean CV design for a job application next week.', time: 'Yesterday', area: 'Peradeniya', hint: 'Rs. 1,000' },
  { text: 'Our club needs t-shirt artwork for 60 members before the trip.', time: 'Yesterday', area: 'Campus', hint: 'Rs. 2,500' },
]

export default function OpportunityRadar({ onNavigate }: PageProps) {
  const [selected, setSelected] = useState<string>('design')
  const active = CLUSTERS.find((c) => c.key === selected) ?? CLUSTERS[0]

  const chartData = CLUSTERS.map((c) => ({
    name: c.name.split(' ')[0],
    requests: c.requests,
    fill: LEVEL_TONE[c.level].color,
  }))

  return (
    <Shell>
      <PageHead
        eyebrow="AI discovery"
        title="Opportunity Radar"
        subtitle="Opportunities discovered around you."
        actions={
          <>
            <Btn variant="secondary" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </Btn>
            <Btn onClick={() => onNavigate('opportunities')}>Browse opportunities</Btn>
          </>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
          gap: 20,
          marginBottom: 26,
        }}
      >
        {/* ------------------------------------------------------ radar */}
        <div
          className="sl-rise"
          style={{
            background: HERO_GRADIENT,
            borderRadius: 26,
            padding: 26,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 26px 64px rgba(30,27,75,0.36)',
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 18,
            }}
          >
            <div>
              <Badge color="#5EEAD4" bg="rgba(94,234,212,0.14)" dot>
                Scanning live
              </Badge>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 10 }}>
                5 km radius · Kamburupiya
              </div>
            </div>
            <div style={{ display: 'flex', gap: 26 }}>
              <KPI value="38" label="Requests detected" />
              <KPI value="6" label="Demand clusters" tone="#5EEAD4" />
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 420,
              aspectRatio: '1 / 1',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '4%',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, rgba(20,184,166,0.35), transparent 45%)',
                animation: 'sl-sweep 4s linear infinite',
              }}
            />
            <svg
              viewBox="0 0 400 400"
              style={{ position: 'relative', width: '100%', height: '100%', display: 'block' }}
            >
              {[60, 108, 155, 192].map((r) => (
                <circle
                  key={r}
                  cx="200"
                  cy="200"
                  r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                />
              ))}
              <line x1="200" y1="8" x2="200" y2="392" stroke="rgba(255,255,255,0.12)" />
              <line x1="8" y1="200" x2="392" y2="200" stroke="rgba(255,255,255,0.12)" />
              <circle cx="200" cy="200" r="6" fill="#5EEAD4" />
              <circle cx="200" cy="200" r="14" fill="none" stroke="rgba(94,234,212,0.5)" />
              <text x="200" y="232" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontWeight="700">
                YOU
              </text>
            </svg>

            {CLUSTERS.map((c, i) => {
              const on = c.key === selected
              const tone = LEVEL_TONE[c.level].blip
              const dot = c.level === 'HIGH' ? 16 : c.level === 'MEDIUM' ? 13 : 11
              return (
                <div key={c.key}>
                  <span
                    style={{
                      position: 'absolute',
                      left: `${c.x}%`,
                      top: `${c.y}%`,
                      width: 66,
                      height: 66,
                      marginLeft: -33,
                      marginTop: -33,
                      borderRadius: '50%',
                      border: `2px solid ${tone}`,
                      animation: 'sl-pulse-ring 2.2s ease-out infinite',
                      animationDelay: `${i * 0.32}s`,
                      pointerEvents: 'none',
                    }}
                  />
                  <button
                    onClick={() => setSelected(c.key)}
                    onMouseEnter={() => setSelected(c.key)}
                    aria-label={c.name}
                    className="sl-press"
                    style={{
                      position: 'absolute',
                      left: `${c.x}%`,
                      top: `${c.y}%`,
                      width: dot,
                      height: dot,
                      marginLeft: -dot / 2,
                      marginTop: -dot / 2,
                      borderRadius: '50%',
                      background: tone,
                      border: on ? '3px solid #fff' : 'none',
                      padding: 0,
                      cursor: 'pointer',
                      boxShadow: `0 0 ${on ? 22 : 12}px ${tone}`,
                    }}
                  />
                  {on && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${c.x}%`,
                        top: `${c.y}%`,
                        transform: 'translate(-50%, -160%)',
                        background: 'rgba(15,23,42,0.86)',
                        border: '1px solid rgba(255,255,255,0.16)',
                        borderRadius: 12,
                        padding: '7px 12px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        animation: 'sl-pop .25s ease both',
                      }}
                    >
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: '#fff' }}>
                        {c.icon} {c.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)' }}>
                        {c.requests} requests · {rupees(c.value)}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 18,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 20,
              paddingTop: 18,
              borderTop: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {(['HIGH', 'MEDIUM', 'LOW'] as Level[]).map((l) => (
              <span
                key={l}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: LEVEL_TONE[l].blip,
                    boxShadow: `0 0 10px ${LEVEL_TONE[l].blip}`,
                  }}
                />
                {l.charAt(0) + l.slice(1).toLowerCase()} demand
              </span>
            ))}
          </div>
        </div>

        {/* --------------------------------------------- cluster sidebar */}
        <div style={{ minWidth: 0 }}>
          <SectionTitle title="Demand clusters" subtitle="Grouped by AI from anonymous requests" />
          <Card pad={8}>
            {CLUSTERS.map((c, i) => {
              const on = c.key === selected
              const tone = LEVEL_TONE[c.level]
              return (
                <div
                  key={c.key}
                  onClick={() => setSelected(c.key)}
                  className="sl-link"
                  style={{
                    display: 'flex',
                    gap: 13,
                    alignItems: 'center',
                    padding: 14,
                    borderRadius: 14,
                    cursor: 'pointer',
                    background: on ? '#EEF2FF' : 'transparent',
                    borderTop: i === 0 ? 'none' : `1px solid ${on ? 'transparent' : C.subtle}`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: tone.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {c.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{c.name}</span>
                      <Badge color={tone.color} bg={tone.bg}>
                        {c.level}
                      </Badge>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                      {c.requests} requests · {rupees(c.value)} · {c.students} students
                    </div>
                  </div>
                </div>
              )
            })}
          </Card>

          <Card pad={18} style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, color: C.faint }}>
              REQUESTS PER CATEGORY
            </div>
            <div style={{ height: 170, marginTop: 12, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke={C.subtle} vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: C.muted }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: `1px solid ${C.border}`,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="requests" radius={[6, 6, 0, 0]}>
                    {chartData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* ------------------------------------------- featured cluster */}
      <Card
        pad={26}
        style={{
          marginBottom: 28,
          background: 'linear-gradient(120deg, #FFF7ED 0%, #FEF2F2 55%, #F0FDFA 100%)',
          border: '1px solid #FED7AA',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 26,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: '1 1 320px', minWidth: 260 }}>
            <Badge color="#B91C1C" bg="#FEE2E2" dot>
              High-demand opportunity detected
            </Badge>
            <h2
              style={{
                margin: '14px 0 8px',
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: -0.6,
                color: C.text,
              }}
            >
              <span style={{ display: 'inline-flex', marginRight: 8 }}><Icon name="spark" size={28} color="#fff" /></span>
              {active.name}
            </h2>
            <p style={{ margin: 0, fontSize: 14.5, color: C.muted, lineHeight: 1.65, maxWidth: 520 }}>
              {active.requests} people around {active.area} recently requested {active.name.toLowerCase()}{' '}
              services. SkillLoop grouped these scattered requests into one claimable cluster.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
              {['Canva', 'Illustrator', 'Layout', 'Branding'].map((s) => (
                <SkillChip key={s} label={s} tone="accent" />
              ))}
            </div>
          </div>
          <div style={{ flex: '0 1 380px', minWidth: 240 }}>
            <Grid min={150} gap={12}>
              <MiniStat label="Requests" value={String(active.requests)} tone={C.primary} />
              <MiniStat label="Market value" value={rupees(active.value)} tone={C.success} />
              <MiniStat label="Matching students" value={String(active.students)} tone={C.accent} />
              <MiniStat label="Demand level" value={active.level} tone={LEVEL_TONE[active.level].color} />
            </Grid>
            <div style={{ marginTop: 16 }}>
              <Btn size="lg" full onClick={() => onNavigate('demand-cluster')}>
                Explore Opportunity →
              </Btn>
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------- anonymous feed */}
      <SectionTitle
        title="Anonymous requests feed"
        subtitle="Raw community needs — identities hidden until you are matched"
      />
      <Grid min={300} gap={14} style={{ marginBottom: 22 }}>
        {REQUESTS.map((r, i) => (
          <div key={r.text} className="sl-rise" style={{ animationDelay: `${i * 50}ms` }}>
            <Card hover pad={18} style={{ height: '100%' }}>
              <div style={{ fontSize: 22, color: C.faint, lineHeight: 1 }}>“</div>
              <p style={{ margin: '6px 0 14px', fontSize: 13.5, color: C.text, lineHeight: 1.6 }}>
                {r.text}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  fontSize: 12,
                  color: C.muted,
                  fontWeight: 600,
                }}
              >
                <Badge color={C.accent}>~{r.hint}</Badge>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="pin" size={12} color={C.muted} /> {r.area}</span>
                <span>· {r.time}</span>
              </div>
            </Card>
          </div>
        ))}
      </Grid>

      <AICallout
        title="How the radar works"
        action={
          <Btn variant="secondary" size="sm" onClick={() => onNavigate('demand-cluster')}>
            See cluster
          </Btn>
        }
      >
        SkillLoop AI read 38 anonymous requests posted within 5 km, extracted intent and budget
        signals, then grouped them into 6 demand clusters. Graphic Design is the strongest signal —
        12 related requests worth {rupees(18500)} with only 8 students able to serve them.
      </AICallout>
    </Shell>
  )
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 14,
        background: '#fff',
        border: `1px solid ${tone}26`,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color: C.faint }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: tone, marginTop: 5, letterSpacing: -0.4 }}>
        {value}
      </div>
    </div>
  )
}
