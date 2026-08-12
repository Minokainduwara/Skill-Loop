import { useState } from 'react'
import type { PageProps } from '../types'
import {
  Badge,
  Btn,
  C,
  Card,
  Field,
  Grid,
  HERO_GRADIENT,
  Input,
  KPI,
  Logo,
  SHADOW,
  Select,
  Verified,
  rupees,
} from '../components/ui'

type Role = 'student' | 'requester'

const ROLES: { key: Role; icon: string; title: string; sub: string; perks: string[] }[] = [
  {
    key: 'student',
    icon: '🎓',
    title: 'Earn with my skills',
    sub: "I'm a student who wants paid local work",
    perks: ['AI-matched opportunities', 'Verified student badge', 'Portfolio + ratings'],
  },
  {
    key: 'requester',
    icon: '🧩',
    title: 'Find someone for a task',
    sub: 'I have a need and want affordable local help',
    perks: ['Matches in minutes', 'Escrow protection', 'Average 60% savings'],
  },
]

const UNIVERSITIES = [
  'University of Peradeniya',
  'University of Colombo',
  'University of Moratuwa',
  'University of Ruhuna',
  'University of Kelaniya',
]
const FACULTIES = ['Science', 'Engineering', 'Arts', 'Management', 'Medicine', 'Agriculture']
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate']

export default function Signup({ onNavigate }: PageProps) {
  const [role, setRole] = useState<Role>('student')
  const [name, setName] = useState('Kasun Perera')
  const [email, setEmail] = useState('kasun.perera@gmail.com')
  const [phone, setPhone] = useState('+94 77 214 8830')
  const [password, setPassword] = useState('')
  const [location, setLocation] = useState('Peradeniya, Kandy')
  const [university, setUniversity] = useState(UNIVERSITIES[0])
  const [faculty, setFaculty] = useState(FACULTIES[0])
  const [program, setProgram] = useState('BSc Information & Communication Technology')
  const [year, setYear] = useState(YEARS[1])
  const [uniEmail, setUniEmail] = useState('s19012@pdn.ac.lk')

  const uniEmailOk = /@[a-z]+\.ac\.lk$/i.test(uniEmail)
  const baseOk =
    name.trim().length > 2 && email.includes('@') && phone.trim().length > 6 && password.length >= 6 &&
    location.trim().length > 2
  const canSubmit = baseOk && (role === 'requester' || uniEmailOk)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
        background: C.bg,
      }}
    >
      <style>{`
        @media (max-width: 900px) { .sl-signup-aside { display: none !important } }
      `}</style>

      {/* -------------------------------------------------------- left panel */}
      <aside
        className="sl-signup-aside"
        style={{
          background: HERO_GRADIENT,
          padding: '48px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 460,
            height: 460,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.32), transparent 68%)',
            top: -160,
            right: -150,
          }}
        />
        <div style={{ position: 'relative' }}>
          <Logo light size={21} />
        </div>

        <div style={{ position: 'relative', margin: '44px 0' }} className="sl-rise">
          <Badge color="#5EEAD4" bg="rgba(94,234,212,0.14)" dot style={{ marginBottom: 20 }}>
            Free to join · No listing fees
          </Badge>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 3.4vw, 38px)',
              fontWeight: 800,
              letterSpacing: -1.3,
              color: '#fff',
              lineHeight: 1.14,
              maxWidth: 420,
            }}
          >
            Two minutes to your first opportunity.
          </h2>
          <p
            style={{
              margin: '16px 0 30px',
              fontSize: 15,
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.65,
              maxWidth: 400,
            }}
          >
            Tell us what you can do — or what you need done. SkillLoop reads the demand around you and
            makes the connection.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
            {[
              ['🛰️', 'Live demand radar within 10 km of you'],
              ['🤖', 'AI ranks the best match, no bidding'],
              ['🔒', 'Payments held in escrow until approval'],
              ['⭐', 'Every job builds your public portfolio'],
            ].map(([icon, text], i) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 15px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  animation: `sl-rise .6s cubic-bezier(.22,1,.36,1) ${i * 0.1}s both`,
                }}
              >
                <span style={{ fontSize: 17 }}>{icon}</span>
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            gap: 34,
            flexWrap: 'wrap',
            paddingTop: 26,
            borderTop: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <KPI value="47" label="Students benefited" />
          <KPI value={rupees(72000)} label="Requester savings" />
        </div>
      </aside>

      {/* ------------------------------------------------------- right panel */}
      <main style={{ padding: '44px 24px 72px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <button
            onClick={() => onNavigate('landing')}
            className="sl-press"
            style={{
              border: 'none',
              background: 'transparent',
              color: C.muted,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
              marginBottom: 20,
              fontFamily: 'inherit',
            }}
          >
            ← Back to home
          </button>

          <Card pad={30} style={{ boxShadow: SHADOW.lg }}>
            <h1 style={{ margin: 0, fontSize: 25, fontWeight: 800, letterSpacing: -0.8, color: C.text }}>
              Create your SkillLoop account
            </h1>
            <p style={{ margin: '8px 0 24px', fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
              One account, two ways to use it. You can switch later.
            </p>

            {/* role selector */}
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: C.text,
                marginBottom: 10,
                letterSpacing: 0.2,
              }}
            >
              I want to:
            </div>
            <Grid min={220} gap={12} style={{ marginBottom: 26 }}>
              {ROLES.map((r) => {
                const on = role === r.key
                return (
                  <div
                    key={r.key}
                    onClick={() => setRole(r.key)}
                    className="sl-press"
                    style={{
                      padding: 18,
                      borderRadius: 16,
                      cursor: 'pointer',
                      background: on ? 'linear-gradient(160deg,#EEF2FF,#F0FDFA)' : C.surface,
                      border: `1.5px solid ${on ? C.primary : C.border}`,
                      boxShadow: on ? '0 10px 26px rgba(79,70,229,0.16)' : SHADOW.sm,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{r.icon}</span>
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: `2px solid ${on ? C.primary : C.border}`,
                          background: on ? C.primary : 'transparent',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 11,
                        }}
                      >
                        {on ? '✓' : ''}
                      </span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{r.title}</div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>
                      {r.sub}
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {r.perks.map((p) => (
                        <span key={p} style={{ fontSize: 12, color: on ? C.primaryDark : C.faint, fontWeight: 600 }}>
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </Grid>

            {/* base fields */}
            <Field label="Full name">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nimal Silva" />
            </Field>
            <Grid min={220} gap={0} style={{ columnGap: 14 }}>
              <Field label="Email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" />
              </Field>
            </Grid>
            <Grid min={220} gap={0} style={{ columnGap: 14 }}>
              <Field label="Password" hint="At least 6 characters">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                />
              </Field>
              <Field label="Location">
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Kandy, Sri Lanka"
                />
              </Field>
            </Grid>

            {/* student verification */}
            {role === 'student' && (
              <div
                className="sl-rise"
                style={{
                  marginTop: 8,
                  marginBottom: 22,
                  padding: 20,
                  borderRadius: 18,
                  background: 'linear-gradient(140deg,#F8FAFF,#F0FDFA)',
                  border: '1px solid #C7D2FE',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    marginBottom: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>
                      Student verification
                    </div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>
                      Verified students get 3x more matches.
                    </div>
                  </div>
                  <Verified label={uniEmailOk ? 'Ready to verify' : 'Pending details'} />
                </div>

                <Field label="University">
                  <Select value={university} onChange={setUniversity} options={UNIVERSITIES} />
                </Field>
                <Grid min={200} gap={0} style={{ columnGap: 14 }}>
                  <Field label="Faculty">
                    <Select value={faculty} onChange={setFaculty} options={FACULTIES} />
                  </Field>
                  <Field label="Year">
                    <Select value={year} onChange={setYear} options={YEARS} />
                  </Field>
                </Grid>
                <Field label="Study program">
                  <Input
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    placeholder="BSc Engineering"
                  />
                </Field>
                <Field label="University email" style={{ marginBottom: 12 }}>
                  <Input
                    value={uniEmail}
                    onChange={(e) => setUniEmail(e.target.value)}
                    placeholder="s19012@pdn.ac.lk"
                  />
                </Field>
                <Badge
                  color={uniEmailOk ? C.success : C.warning}
                  bg={uniEmailOk ? '#DCFCE7' : '#FEF3C7'}
                  style={{ padding: '7px 12px', fontSize: 12 }}
                >
                  {uniEmailOk
                    ? '✓ Student status will be verified via your university email'
                    : 'Use your official .ac.lk address to enable verification'}
                </Badge>
              </div>
            )}

            <Btn
              full
              size="lg"
              disabled={!canSubmit}
              onClick={() => onNavigate(role === 'student' ? 'onboarding' : 'post-need')}
              style={{ marginTop: role === 'student' ? 0 : 8 }}
            >
              {role === 'student' ? 'Create account & continue' : 'Create account & post a need'}
            </Btn>

            <p
              style={{
                margin: '14px 0 0',
                fontSize: 11.5,
                color: C.faint,
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              By creating an account you agree to the SkillLoop Terms and Privacy Policy.
            </p>

            <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: 13.5, color: C.muted }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="sl-link"
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: C.primary,
                }}
              >
                Sign in
              </button>
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}
