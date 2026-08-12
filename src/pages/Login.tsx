import { useState } from 'react'
import type { PageProps } from '../types'
import {
  Badge,
  Btn,
  C,
  Card,
  Divider,
  Field,
  HERO_GRADIENT,
  Input,
  KPI,
  Logo,
  SHADOW,
  Icon,
  rupees,
} from '../components/ui'

type LoginRole = 'student' | 'community'

const CHAIN = [
  { icon: <Icon name="graduation" size={18} color="#5EEAD4" />, title: 'Student', sub: 'Kasun Perera · Kamburupitiya', tone: '#5EEAD4' },
  { icon: <Icon name="target" size={18} color="#A5B4FC" />, title: 'Opportunity', sub: 'Event Poster Design · 96% match', tone: '#A5B4FC' },
  { icon: <Icon name="coin" size={18} color="#86EFAC" />, title: 'Income', sub: rupees(2000) + ' released to wallet', tone: '#86EFAC' },
]

export default function Login({ onNavigate }: PageProps) {
  const [email, setEmail] = useState('kasun.perera@pdn.ac.lk')
  const [password, setPassword] = useState('skillloop')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [role, setRole] = useState<LoginRole>('student')

  const valid = email.includes('@') && password.length >= 4

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
        @media (max-width: 900px) { .sl-login-aside { display: none !important } }
      `}</style>

      {/* -------------------------------------------------------- left panel */}
      <aside
        className="sl-login-aside"
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
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.3), transparent 68%)',
            bottom: -200,
            left: -140,
          }}
        />
        <div style={{ position: 'relative' }}>
          <Logo light size={21} />
        </div>

        <div style={{ position: 'relative', margin: '44px 0' }} className="sl-rise">
          <Badge color="#5EEAD4" bg="rgba(94,234,212,0.14)" dot style={{ marginBottom: 20 }}>
            AI-matched local work
          </Badge>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(30px, 3.6vw, 40px)',
              fontWeight: 800,
              letterSpacing: -1.4,
              color: '#fff',
              lineHeight: 1.12,
              maxWidth: 420,
            }}
          >
            Turn your skills into opportunities.
          </h2>
          <p
            style={{
              margin: '16px 0 32px',
              fontSize: 15,
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.65,
              maxWidth: 400,
            }}
          >
            Sign in to see the demand that already exists around you — matched to what you can do.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 400 }}>
            {CHAIN.map((c, i) => (
              <div key={c.title}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(6px)',
                    animation: `sl-rise .6s cubic-bezier(.22,1,.36,1) ${i * 0.12}s both`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 19,
                      flexShrink: 0,
                    }}
                  >
                    {c.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: c.tone }}>{c.title}</div>
                    <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.68)', marginTop: 2 }}>
                      {c.sub}
                    </div>
                  </div>
                </div>
                {i < CHAIN.length - 1 && (
                  <div style={{ height: 18, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 2, background: 'rgba(255,255,255,0.24)' }} />
                  </div>
                )}
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
          <KPI value={rupees(156500)} label="Student income generated" />
          <KPI value="84" label="Jobs completed" />
          <KPI value="92%" label="Match accuracy" />
        </div>
      </aside>

      {/* ------------------------------------------------------- right panel */}
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
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
              marginBottom: 22,
              fontFamily: 'inherit',
            }}
          >
            ← Back to home
          </button>

          <Card pad={30} style={{ boxShadow: SHADOW.lg }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: -0.8, color: C.text }}>
              Welcome back
            </h1>
            <p style={{ margin: '8px 0 26px', fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
              Sign in to your SkillLoop account to pick up where you left off.
            </p>

            <Field label="I am logging in as">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className="sl-press"
                  style={{
                    border: `1.5px solid ${role === 'student' ? C.primary : C.border}`,
                    background: role === 'student' ? 'linear-gradient(160deg,#EEF2FF,#F0FDFA)' : C.surface,
                    borderRadius: 14,
                    padding: '12px 14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Student</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>Do jobs and earn</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('community')}
                  className="sl-press"
                  style={{
                    border: `1.5px solid ${role === 'community' ? C.primary : C.border}`,
                    background: role === 'community' ? 'linear-gradient(160deg,#EEF2FF,#F0FDFA)' : C.surface,
                    borderRadius: 14,
                    padding: '12px 14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Community member</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>Post jobs only</div>
                </button>
              </div>
            </Field>

            <Field label="Email address">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.lk"
                autoComplete="email"
              />
            </Field>

            <Field label="Password">
              <div style={{ position: 'relative' }}>
                <Input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: 62 }}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="sl-link"
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.primary,
                  }}
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
            </Field>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 22,
              }}
            >
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', userSelect: 'none' }}
              >
                <span
                  onClick={() => setRemember((r) => !r)}
                  className="sl-press"
                  style={{
                    width: 19,
                    height: 19,
                    borderRadius: 6,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    color: '#fff',
                    background: remember ? C.primary : C.surface,
                    border: `1px solid ${remember ? C.primary : C.border}`,
                    flexShrink: 0,
                  }}
                >
                  {remember ? '✓' : ''}
                </span>
                <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Remember me</span>
              </label>
              <button
                type="button"
                className="sl-link"
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.primary,
                }}
              >
                Forgot password?
              </button>
            </div>

            <Btn full size="lg" disabled={!valid} onClick={() => onNavigate(role === 'student' ? 'dashboard' : 'community-dashboard')}>
              Sign In
            </Btn>

            <Divider label="OR" />

            <Btn
              full
              size="lg"
              variant="secondary"
              onClick={() => onNavigate(role === 'student' ? 'dashboard' : 'community-dashboard')}
            >
              <span style={{ fontSize: 15 }}>G</span> Continue with Google
            </Btn>

            <p style={{ margin: '24px 0 0', textAlign: 'center', fontSize: 13.5, color: C.muted }}>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
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
                Create account
              </button>
            </p>
          </Card>

          <p
            style={{
              margin: '22px 0 0',
              textAlign: 'center',
              fontSize: 12,
              color: C.faint,
              lineHeight: 1.6,
            }}
          >
            Protected by escrow payments · Students and community members
          </p>
        </div>
      </main>
    </div>
  )
}
