import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { PageProps } from '../types'
import {
  Avatar,
  Badge,
  BRAND_GRADIENT,
  Btn,
  C,
  Card,
  Grid,
  HERO_GRADIENT,
  Icon,
  Logo,
  MatchBadge,
  SHADOW,
  Stars,
  rupees,
} from '../components/ui'

const FLOW = [
  { label: 'LOCAL NEED', icon: <Icon name="pin" size={16} color="#F59E0B" />, tone: '#F59E0B' },
  { label: 'AI DISCOVERY', icon: <Icon name="brain" size={16} color="#7C3AED" />, tone: '#7C3AED' },
  { label: 'BEST MATCH', icon: <Icon name="target" size={16} color="#4F46E5" />, tone: '#4F46E5' },
  { label: 'STUDENT', icon: <Icon name="graduation" size={16} color="#14B8A6" />, tone: '#14B8A6' },
  { label: 'INCOME', icon: <Icon name="coin" size={16} color="#16A34A" />, tone: '#16A34A' },
]

const FLOAT_CARDS = [
  { skill: 'Graphic Design', pct: 96, pay: 2000, place: 'Peradeniya', top: 26, left: -46, delay: '0s' },
  { skill: 'Python Tutoring', pct: 91, pay: 3500, place: 'Kandy', top: 232, left: 178, delay: '1.4s' },
  { skill: 'Video Editing', pct: 87, pay: 4500, place: 'Colombo', top: 438, left: -32, delay: '2.6s' },
]

const STEPS = [
  { n: '01', t: 'Discover', d: 'Find real needs around you, surfaced from live local demand.', icon: <Icon name="radar" size={28} color={C.primary} /> },
  { n: '02', t: 'Match', d: 'AI finds the best student for each opportunity — instantly.', icon: <Icon name="brain" size={28} color={C.primary} /> },
  { n: '03', t: 'Earn', d: 'Complete the work, get paid securely in rupees.', icon: <Icon name="coin" size={28} color={C.primary} /> },
  { n: '04', t: 'Grow', d: 'Build ratings, experience, portfolio and new skills.', icon: <Icon name="trend" size={28} color={C.primary} /> },
]

const GROWTH = [
  { m: 'Feb', income: 9200 },
  { m: 'Mar', income: 14800 },
  { m: 'Apr', income: 21400 },
  { m: 'May', income: 27600 },
  { m: 'Jun', income: 38900 },
  { m: 'Jul', income: 44600 },
]

const TESTIMONIALS = [
  {
    name: 'Kasun Perera',
    role: 'ICT Undergraduate · Peradeniya',
    rating: 5,
    quote:
      "I earned Rs. 24,500 in my second semester without ever pitching for a single job. SkillLoop brought the work to me.",
  },
  {
    name: 'Nimali Jayasuriya',
    role: 'Event Organiser · Kandy',
    rating: 5,
    quote:
      "We needed a poster in two days. The match was ready in minutes and cost a third of an agency quote.",
  },
  {
    name: 'Sahan Fernando',
    role: 'Engineering Student · Galle',
    rating: 4.9,
    quote:
      "The radar showed me there were 12 unmet electronics requests within 5 km. I had no idea that demand existed.",
  },
]

const IMPACT = [
  { value: rupees(156500), label: 'Student income generated', icon: <Icon name="coin" size={18} color="#fff" /> },
  { value: '84', label: 'Jobs completed', icon: <Icon name="check" size={18} color="#fff" /> },
  { value: '47', label: 'Students benefited', icon: <Icon name="graduation" size={18} color="#fff" /> },
  { value: rupees(72000), label: 'Requester savings', icon: <Icon name="tag" size={18} color="#fff" /> },
  { value: '92%', label: 'Average match accuracy', icon: <Icon name="target" size={18} color="#fff" /> },
]

function FlowNode({ item, last }: { item: (typeof FLOW)[number]; last?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: 250,
          padding: '13px 18px',
          borderRadius: 14,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.16)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: item.tone + '2E',
            border: `1px solid ${item.tone}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
          }}
        >
          {item.icon}
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.4, color: '#fff' }}>
          {item.label}
        </span>
      </div>
      {!last && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0' }}>
          <div style={{ width: 2, height: 16, background: 'rgba(255,255,255,0.28)' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, lineHeight: 1 }}>▼</span>
        </div>
      )}
    </div>
  )
}

function Eyebrow({ children, light }: { children: string; light?: boolean }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: 1.6,
        textTransform: 'uppercase',
        color: light ? '#5EEAD4' : C.primary,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  )
}

export default function Landing({ onNavigate }: PageProps) {
  return (
    <div style={{ background: C.bg }}>
      {/* ------------------------------------------------------------ hero */}
      <section style={{ background: HERO_GRADIENT, position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.28), transparent 68%)',
            top: -220,
            right: -160,
          }}
        />
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '86px 20px 96px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
            gap: 56,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div className="sl-rise">
            <Badge color="#5EEAD4" bg="rgba(94,234,212,0.14)" dot style={{ marginBottom: 22 }}>
              AI-powered MicroEconomy opportunity discovery
            </Badge>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(38px, 6vw, 62px)',
                lineHeight: 1.04,
                fontWeight: 800,
                letterSpacing: -2,
                color: '#fff',
              }}
            >
              Your Skills Are<br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #5EEAD4, #A5B4FC)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Worth More.
              </span>
            </h1>
            <p
              style={{
                margin: '22px 0 0',
                fontSize: 17.5,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.78)',
                maxWidth: 500,
              }}
            >
              SkillLoop connects your skills with real needs around you — so you can earn, build
              experience, and grow. No bidding wars. No waiting.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 34 }}>
              <Btn size="lg" onClick={() => onNavigate('login')} style={{ boxShadow: SHADOW.glow }}>
                Find Opportunities →
              </Btn>
              <Btn
                size="lg"
                variant="secondary"
                onClick={() => onNavigate('post-need')}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                Post a Need
              </Btn>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 38 }}>
              <div style={{ display: 'flex' }}>
                {['Kasun Perera', 'Nimal Silva', 'Nimali Jayasuriya', 'Dinuka Bandara'].map((n, i) => (
                  <div key={n} style={{ marginLeft: i === 0 ? 0 : -12 }}>
                    <Avatar name={n} size={38} ring />
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                <strong style={{ color: '#fff' }}>47 students</strong> earning across Peradeniya,
                <br />
                Kandy, Colombo and Galle.
              </div>
            </div>
          </div>

          {/* flow + floating cards */}
          <div style={{ position: 'relative', minHeight: 560 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '26px 0',
              }}
            >
              {FLOW.map((f, i) => (
                <FlowNode key={f.label} item={f} last={i === FLOW.length - 1} />
              ))}
            </div>
            {FLOAT_CARDS.map((f) => (
              <div
                key={f.skill}
                style={{
                  position: 'absolute',
                  top: f.top,
                  left: `calc(50% + ${f.left}px)`,
                  animation: `sl-float 5s ease-in-out ${f.delay} infinite`,
                  background: C.surface,
                  borderRadius: 16,
                  padding: '13px 16px',
                  boxShadow: SHADOW.lg,
                  border: `1px solid ${C.border}`,
                  minWidth: 208,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{f.skill}</span>
                </div>
                <MatchBadge pct={f.pct} size="sm" />
                <div style={{ fontSize: 12, color: C.muted, marginTop: 9, fontWeight: 600 }}>
                  {rupees(f.pay)} · {f.place}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* trust strip */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.18)' }}>
          <div
            style={{
              maxWidth: 1180,
              margin: '0 auto',
              padding: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 28,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {[
              '✓ University-verified students',
              '✓ Escrow-protected payments',
              '✓ 92% match accuracy',
              '✓ Local-first, within 10 km',
            ].map((t) => (
              <span key={t} style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.72)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- problem */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '96px 20px 0' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 46px' }}>
          <Eyebrow>The gap</Eyebrow>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              letterSpacing: -1.2,
              color: C.text,
              lineHeight: 1.15,
            }}
          >
            The opportunity already exists.<br />
            <span style={{ color: C.muted }}>The connection doesn&apos;t.</span>
          </h2>
        </div>
        <Grid min={300} gap={20} style={{ alignItems: 'stretch' }}>
          <Card pad={28} hover>
            <div style={{ width: 34, height: 34, marginBottom: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: C.primary }}><Icon name="graduation" size={34} color={C.primary} /></div>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: C.text }}>Students</h3>
            <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none' }}>
              {['Have skills', 'Need income', 'Lack customers', 'Need experience'].map((l) => (
                <li
                  key={l}
                  style={{
                    fontSize: 14,
                    color: C.muted,
                    padding: '8px 0',
                    borderBottom: `1px dashed ${C.subtle}`,
                  }}
                >
                  {l}
                </li>
              ))}
            </ul>
          </Card>
          <Card
            pad={28}
            style={{
              background: BRAND_GRADIENT,
              border: 'none',
              boxShadow: SHADOW.glow,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{ width: 34, height: 34, marginBottom: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="spark" size={34} color="#fff" /></div>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: -0.6 }}>
              SkillLoop
            </h3>
            <p style={{ margin: '10px 0 0', fontSize: 15, color: 'rgba(255,255,255,0.86)', lineHeight: 1.6 }}>
              Connects the two — automatically, with AI reading real local demand.
            </p>
            <div
              style={{
                marginTop: 20,
                padding: '10px 14px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.16)',
                fontSize: 12.5,
                fontWeight: 800,
                color: '#fff',
                letterSpacing: 0.6,
              }}
            >
              DEMAND IN → MATCH OUT
            </div>
          </Card>
          <Card pad={28} hover>
            <div style={{ width: 34, height: 34, marginBottom: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: C.primary }}><Icon name="people" size={34} color={C.primary} /></div>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: C.text }}>Community</h3>
            <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none' }}>
              {[
                'Has real needs',
                'Needs affordable services',
                "Doesn't know who can help",
                'Wants trusted local talent',
              ].map((l) => (
                <li
                  key={l}
                  style={{
                    fontSize: 14,
                    color: C.muted,
                    padding: '8px 0',
                    borderBottom: `1px dashed ${C.subtle}`,
                  }}
                >
                  {l}
                </li>
              ))}
            </ul>
          </Card>
        </Grid>
      </section>

      {/* ----------------------------------------------------- how it works */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '96px 20px 0' }}>
        <div style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto 46px' }}>
          <Eyebrow>How it works</Eyebrow>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 800,
              letterSpacing: -1.1,
              color: C.text,
            }}
          >
            Four steps from skill to income
          </h2>
        </div>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 54,
              left: '12%',
              right: '12%',
              height: 2,
              background: `linear-gradient(90deg, ${C.primary}33, ${C.accent}55, ${C.primary}33)`,
            }}
          />
          <Grid min={230} gap={20} style={{ position: 'relative' }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 24,
                    margin: '0 auto 18px',
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    boxShadow: SHADOW.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 30,
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 1.4,
                    color: C.primary,
                    marginBottom: 6,
                  }}
                >
                  {s.n}
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.text }}>{s.t}</h3>
                <p
                  style={{
                    margin: '8px auto 0',
                    fontSize: 13.5,
                    color: C.muted,
                    lineHeight: 1.6,
                    maxWidth: 230,
                  }}
                >
                  {s.d}
                </p>
              </div>
            ))}
          </Grid>
        </div>
      </section>

      {/* --------------------------------------------------- differentiator */}
      <section style={{ marginTop: 96, background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '86px 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 46px' }}>
            <Eyebrow>The difference</Eyebrow>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                letterSpacing: -1.2,
                color: C.text,
              }}
            >
              Not another freelancing platform.
            </h2>
            <p style={{ margin: '14px 0 0', fontSize: 16, color: C.muted, lineHeight: 1.65 }}>
              Freelancing makes students chase work. SkillLoop makes the work find the student.
            </p>
          </div>
          <Grid min={340} gap={20}>
            <Card pad={28} style={{ background: C.subtle, borderColor: C.border }}>
              <Badge color={C.muted} bg="#E2E8F0">Traditional freelancing</Badge>
              <div style={{ marginTop: 22 }}>
                {['Search', 'Apply', 'Compete', 'Wait'].map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 9,
                        background: '#fff',
                        border: `1px solid ${C.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                        color: C.faint,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.muted }}>{s}</span>
                    {i === 3 && <Badge color={C.error} bg="#FEE2E2">often no reply</Badge>}
                  </div>
                ))}
              </div>
            </Card>
            <Card
              pad={28}
              style={{ borderColor: '#C7D2FE', boxShadow: SHADOW.md, background: 'linear-gradient(160deg,#fff,#F5F3FF)' }}
            >
              <Badge color={C.primary}>SkillLoop</Badge>
              <div style={{ marginTop: 22 }}>
                {['Demand', 'AI Discovery', 'Match', 'Opportunity', 'Earn'].map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 9,
                        background: BRAND_GRADIENT,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#fff',
                      }}
                    >
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{s}</span>
                    {i === 1 && <Badge color={C.accent} bg="#CCFBF1">automatic</Badge>}
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 18,
                  padding: 14,
                  borderRadius: 12,
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: C.primaryDark,
                }}
              >
                AI discovers local unmet demand — before anyone posts a job.
              </div>
            </Card>
          </Grid>
        </div>
      </section>

      {/* ---------------------------------------------------------- impact */}
      <section style={{ background: HERO_GRADIENT }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '90px 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto 44px' }}>
            <Eyebrow light>Economic impact</Eyebrow>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                letterSpacing: -1.2,
                color: '#fff',
              }}
            >
              Turn Skills Into Economic Impact.
            </h2>
            <p style={{ margin: '14px 0 0', fontSize: 16, color: 'rgba(255,255,255,0.72)' }}>
              Every completed opportunity creates value for both sides.
            </p>
          </div>
          <Grid min={190} gap={16}>
            {IMPACT.map((s) => (
              <div
                key={s.label}
                className="sl-hover"
                style={{
                  padding: 22,
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -1, color: '#fff' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.66)', fontWeight: 600, marginTop: 5 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </Grid>

          <div
            style={{
              marginTop: 24,
              padding: 24,
              borderRadius: 20,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 18,
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                  Monthly student income growth
                </div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                  Aggregate earnings across the Peradeniya pilot
                </div>
              </div>
              <Badge color="#5EEAD4" bg="rgba(94,234,212,0.14)">+384% since February</Badge>
            </div>
            <div style={{ height: 210, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GROWTH} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
                  <defs>
                    <linearGradient id="slLandingArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5EEAD4" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#5EEAD4" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="m"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0F172A',
                      border: '1px solid rgba(255,255,255,0.16)',
                      borderRadius: 12,
                      fontSize: 12.5,
                      color: '#fff',
                    }}
                    labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                    formatter={(v) => [rupees(Number(v)), 'Income']}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#5EEAD4"
                    strokeWidth={2.5}
                    fill="url(#slLandingArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- testimonials */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '90px 20px 0' }}>
        <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 40px' }}>
          <Eyebrow>Voices from the loop</Eyebrow>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(26px, 3.6vw, 36px)',
              fontWeight: 800,
              letterSpacing: -1.1,
              color: C.text,
            }}
          >
            Real students. Real income.
          </h2>
        </div>
        <Grid min={300} gap={20}>
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} pad={26} hover>
              <Stars rating={t.rating} size={14} />
              <p style={{ margin: '14px 0 20px', fontSize: 14.5, color: C.text, lineHeight: 1.7 }}>
                {t.quote}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={t.name} size={42} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </Grid>
      </section>

      {/* ------------------------------------------------------- final CTA */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '90px 20px 0' }}>
        <div
          style={{
            background: BRAND_GRADIENT,
            borderRadius: 28,
            padding: '62px 32px',
            textAlign: 'center',
            boxShadow: SHADOW.glow,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 800,
              letterSpacing: -1.2,
              color: '#fff',
              lineHeight: 1.2,
            }}
          >
            Your skill. Your opportunity. Your income.
          </h2>
          <p
            style={{
              margin: '16px auto 30px',
              fontSize: 16,
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 520,
              lineHeight: 1.65,
            }}
          >
            Join the students already turning what they know into what they earn.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn size="lg" variant="secondary" onClick={() => onNavigate('signup')}>
              Create free account
            </Btn>
            <Btn
              size="lg"
              onClick={() => onNavigate('post-need')}
              style={{
                background: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.34)',
                boxShadow: 'none',
              }}
            >
              Post a Need
            </Btn>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- footer */}
      <footer style={{ marginTop: 76, borderTop: `1px solid ${C.border}`, background: C.surface }}>
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '36px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Logo size={18} />
            <p style={{ margin: '10px 0 0', fontSize: 12.5, color: C.faint }}>
              FOT Ruhuna
            </p>
          </div>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            {(
              [
                ['Opportunities', 'opportunities'],
                ['Post a Need', 'post-need'],
                ['Impact', 'economic-impact'],
                ['Sign in', 'login'],
              ] as const
            ).map(([label, page]) => (
              <button
                key={label}
                onClick={() => onNavigate(page)}
                className="sl-link"
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.muted,
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12.5, color: C.faint }}>© 2026 SkillLoop</div>
        </div>
      </footer>
    </div>
  )
}
