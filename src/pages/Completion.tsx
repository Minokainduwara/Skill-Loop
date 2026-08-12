import type { PageProps } from '../types'
import {
  Badge,
  Btn,
  C,
  Card,
  Divider,
  Grid,
  HERO_GRADIENT,
  MetricBar,
  Progress,
  SHADOW,
  Shell,
  Stars,
  rupees,
} from '../components/ui'

const CONFETTI_COLORS = ['#4F46E5', '#14B8A6', '#F59E0B', '#EF4444', '#7C3AED', '#22C55E']

const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: (i * 5.6 + (i % 3) * 3) % 96,
  delay: (i % 9) * 0.38,
  size: 7 + (i % 4) * 3,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  round: i % 3 === 0,
}))

const ACHIEVEMENTS = [
  {
    icon: '📁',
    value: '+1',
    title: 'Portfolio Project',
    text: 'Robotics Exhibition Poster is ready to publish.',
    tone: C.primary,
  },
  {
    icon: '✅',
    value: '+1',
    title: 'Completed Job',
    text: '19 jobs delivered with a 100% on-time record.',
    tone: C.accent,
  },
  {
    icon: '🛡️',
    value: '+5',
    title: 'Trust Score',
    text: '92 → 97 · you are in the top 4% near Peradeniya.',
    tone: C.success,
  },
]

export default function Completion({ onNavigate }: PageProps) {
  return (
    <Shell style={{ padding: '0 0 120px' }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: HERO_GRADIENT,
          borderRadius: 26,
          padding: '58px 28px 52px',
          textAlign: 'center',
          margin: '20px 20px 24px',
        }}
      >
        {CONFETTI.map((c) => (
          <span
            key={c.id}
            style={{
              position: 'absolute',
              top: -20,
              left: `${c.left}%`,
              width: c.size,
              height: c.size,
              background: c.color,
              borderRadius: c.round ? '50%' : 2,
              animation: `sl-confetti 3.4s ${c.delay}s linear infinite`,
              opacity: 0.9,
            }}
          />
        ))}

        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: 94,
              height: 94,
              borderRadius: '50%',
              margin: '0 auto 22px',
              background: C.success,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 44,
              color: '#fff',
              boxShadow: '0 18px 44px rgba(22,163,74,0.45)',
              animation: 'sl-pop .7s cubic-bezier(.22,1,.36,1) both',
            }}
          >
            ✓
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: -1,
              color: '#fff',
              animation: 'sl-rise .6s .1s both',
            }}
          >
            🎉 Job Completed!
          </h1>
          <p
            style={{
              margin: '12px auto 0',
              fontSize: 15.5,
              color: 'rgba(255,255,255,0.78)',
              maxWidth: 460,
              lineHeight: 1.6,
              animation: 'sl-rise .6s .18s both',
            }}
          >
            University Robotics Society approved your delivery and released the escrow payment.
          </p>

          <div style={{ marginTop: 30, animation: 'sl-rise .6s .26s both' }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 800,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                color: '#5EEAD4',
              }}
            >
              You earned
            </div>
            <div
              style={{
                fontSize: 68,
                fontWeight: 800,
                letterSpacing: -2.6,
                color: '#fff',
                lineHeight: 1.05,
                marginTop: 6,
              }}
            >
              {rupees(2000)}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 16,
                padding: '9px 18px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.22)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              💸 Payment released to your SkillLoop wallet · 12 Aug, 5:41 PM
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <Grid min={260} gap={16} style={{ marginBottom: 22 }}>
          {ACHIEVEMENTS.map((a, i) => (
            <Card
              key={a.title}
              pad={20}
              style={{ animation: `sl-pop .6s ${0.35 + i * 0.14}s both`, textAlign: 'center' }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  margin: '0 auto 14px',
                  background: a.tone + '15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                {a.icon}
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1, color: a.tone }}>
                {a.value}
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text, marginTop: 4 }}>
                {a.title}
              </div>
              <p style={{ margin: '7px 0 0', fontSize: 12.5, color: C.muted, lineHeight: 1.55 }}>
                {a.text}
              </p>
              {a.title === 'Trust Score' && (
                <div style={{ marginTop: 14 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: C.muted,
                      marginBottom: 6,
                    }}
                  >
                    <span>92</span>
                    <span style={{ color: C.success }}>97</span>
                  </div>
                  <Progress
                    value={97}
                    height={9}
                    gradient={`linear-gradient(90deg, ${C.primary}, ${C.success})`}
                  />
                </div>
              )}
            </Card>
          ))}
        </Grid>

        <Grid min={420} gap={18} style={{ alignItems: 'start', marginBottom: 22 }}>
          <Card pad={24} style={{ animation: 'sl-rise .6s .5s both' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <Stars rating={5} size={18} />
              <Badge color={C.success}>New review</Badge>
            </div>
            <blockquote
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 600,
                color: C.text,
                lineHeight: 1.65,
                letterSpacing: -0.2,
              }}
            >
              "Excellent work and delivered before the deadline. Kasun understood exactly what we
              needed."
            </blockquote>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginTop: 14 }}>
              — University Robotics Society
            </div>
            <Divider />
            <MetricBar label="Communication" value={100} color={C.primary} />
            <MetricBar label="Quality of work" value={98} color={C.accent} />
            <MetricBar label="Timeliness" value={100} color={C.success} />
          </Card>

          <Card pad={24} style={{ animation: 'sl-rise .6s .58s both' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 19, fontWeight: 800, color: C.text }}>
              Your updated totals
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 13.5, color: C.muted }}>
              Every completed loop compounds your reputation in Kandy.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {[
                { label: 'Total earned', value: rupees(26500), delta: '+Rs. 2,000' },
                { label: 'Jobs completed', value: '19', delta: '+1' },
                { label: 'Average rating', value: '4.8', delta: '★' },
              ].map((t, i) => (
                <div
                  key={t.label}
                  style={{
                    flex: '1 1 130px',
                    padding: '4px 16px',
                    borderLeft: i === 0 ? 'none' : `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.7, color: C.text }}>
                    {t.value}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginTop: 3 }}>
                    {t.label}{' '}
                    <span style={{ color: C.success, fontWeight: 800 }}>{t.delta}</span>
                  </div>
                </div>
              ))}
            </div>
            <Divider />
            <div
              style={{
                padding: 16,
                borderRadius: 14,
                background: 'linear-gradient(120deg, #EEF2FF 0%, #F0FDFA 100%)',
                border: '1px solid #C7D2FE',
                boxShadow: SHADOW.sm,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: C.primaryDark }}>
                🌱 Local impact
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 12.5, color: '#4338CA', lineHeight: 1.6 }}>
                This job kept {rupees(2000)} inside the Peradeniya student economy and saved the
                society roughly {rupees(6000)} versus a Colombo agency.
              </p>
            </div>
          </Card>
        </Grid>

        <Card pad={26} style={{ textAlign: 'center', animation: 'sl-rise .6s .66s both' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 21, fontWeight: 800, color: C.text }}>
            Keep the loop going
          </h3>
          <p style={{ margin: '0 auto 20px', fontSize: 14, color: C.muted, maxWidth: 420, lineHeight: 1.6 }}>
            There are 7 new matches near you right now, including 2 above a 90% fit.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn size="lg" onClick={() => onNavigate('portfolio')}>
              Add to Portfolio
            </Btn>
            <Btn size="lg" variant="secondary" onClick={() => onNavigate('opportunities')}>
              Find More Opportunities
            </Btn>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 20,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: 20,
            }}
          >
            <Btn variant="ghost" size="sm" onClick={() => onNavigate('earnings')}>
              View earnings breakdown →
            </Btn>
            <Btn variant="ghost" size="sm" onClick={() => onNavigate('economic-impact')}>
              See your economic impact →
            </Btn>
          </div>
        </Card>
      </div>
    </Shell>
  )
}
