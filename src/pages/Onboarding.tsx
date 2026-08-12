import type { ReactNode } from 'react'
import { useState } from 'react'
import type { PageProps } from '../types'
import {
  AICallout,
  Avatar,
  Badge,
  BRAND_GRADIENT,
  Btn,
  C,
  Card,
  Field,
  Grid,
  Input,
  Progress,
  SHADOW,
  SectionTitle,
  Shell,
  SkillChip,
  Icon,
  USER,
} from '../components/ui'

const SKILLS = [
  'Web Development',
  'Graphic Design',
  'UI/UX',
  'Video Editing',
  'Photography',
  'Programming',
  'Tutoring',
  'Writing',
  'Translation',
  'Data Entry',
  'Electronics',
  'Computer Repair',
  'Social Media',
  'Marketing',
]

const AVAILABILITY: { key: string; icon: ReactNode; sub: string }[] = [
  { key: 'Weekday mornings', icon: <Icon name="spark" size={16} color={C.primary} />, sub: 'Before 12 pm, Mon–Fri' },
  { key: 'Weekday evenings', icon: <Icon name="clock" size={16} color={C.primary} />, sub: 'After 5 pm, Mon–Fri' },
  { key: 'Weekends', icon: <Icon name="calendar" size={16} color={C.primary} />, sub: 'Saturday & Sunday' },
  { key: 'Flexible', icon: <Icon name="spark" size={16} color={C.primary} />, sub: 'I can adapt to the job' },
]

const RADII = [
  { km: 1, label: 'Within 1 km', sub: 'Campus and walking distance', jobs: 6 },
  { km: 5, label: 'Within 5 km', sub: 'Peradeniya and nearby Kandy', jobs: 23 },
  { km: 10, label: 'Within 10 km', sub: 'Greater Kandy area', jobs: 41 },
]

const LEVELS = [
  { key: 'Beginner', icon: <Icon name="graduation" size={16} color={C.primary} />, desc: 'Learning the craft. Some coursework or personal projects.' },
  { key: 'Intermediate', icon: <Icon name="spark" size={16} color={C.primary} />, desc: 'A few real projects delivered. Comfortable working solo.' },
  { key: 'Advanced', icon: <Icon name="trend" size={16} color={C.primary} />, desc: 'Consistent paid work with strong, repeatable results.' },
  { key: 'Professional', icon: <Icon name="target" size={16} color={C.primary} />, desc: 'Client-ready standard. You work to briefs and deadlines.' },
]

const STEP_META = [
  { title: 'What can you do?', sub: 'Pick every skill you can be paid for — you can refine this later.' },
  { title: 'When and where can you work?', sub: 'We only surface opportunities that fit your real life.' },
  { title: 'How experienced are you?', sub: 'This calibrates the match score, not your visibility.' },
]

function SelectCard({
  active,
  onClick,
  icon,
  title,
  sub,
  right,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  title: string
  sub: string
  right?: string
}) {
  return (
    <div
      onClick={onClick}
      className="sl-press"
      style={{
        padding: 18,
        borderRadius: 16,
        cursor: 'pointer',
        background: active ? 'linear-gradient(160deg,#EEF2FF,#F0FDFA)' : C.surface,
        border: `1.5px solid ${active ? C.primary : C.border}`,
        boxShadow: active ? '0 10px 26px rgba(79,70,229,0.15)' : SHADOW.sm,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: `2px solid ${active ? C.primary : C.border}`,
            background: active ? C.primary : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 11,
          }}
        >
          {active ? '✓' : ''}
        </span>
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>{title}</div>
      <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, lineHeight: 1.55 }}>{sub}</div>
      {right && (
        <div style={{ marginTop: 12 }}>
          <Badge color={C.accent} bg="#CCFBF1">
            {right}
          </Badge>
        </div>
      )}
    </div>
  )
}

export default function Onboarding({ onNavigate }: PageProps) {
  const [step, setStep] = useState(1)
  const [skills, setSkills] = useState<string[]>(['Graphic Design', 'UI/UX'])
  const [custom, setCustom] = useState('')
  const [extra, setExtra] = useState<string[]>([])
  const [slots, setSlots] = useState<string[]>(['Weekday evenings'])
  const [radius, setRadius] = useState<number | null>(5)
  const [level, setLevel] = useState<string | null>(null)
  const [portfolio, setPortfolio] = useState('')

  const allSkills = [...SKILLS, ...extra]

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const addCustom = () => {
    const v = custom.trim()
    if (!v || allSkills.some((s) => s.toLowerCase() === v.toLowerCase())) {
      setCustom('')
      return
    }
    setExtra((e) => [...e, v])
    setSkills((s) => [...s, v])
    setCustom('')
  }

  const stepValid =
    step === 1 ? skills.length > 0 : step === 2 ? slots.length > 0 && radius !== null : level !== null

  const meta = STEP_META[step - 1]

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* -------------------------------------------------------- progress */}
      <div
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 5,
        }}
      >
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>
              Step {step} of 3
              <span style={{ color: C.faint, fontWeight: 600, marginLeft: 10 }}>
                Building your student profile
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  style={{
                    width: n === step ? 26 : 9,
                    height: 9,
                    borderRadius: 999,
                    background: n <= step ? C.primary : C.border,
                    transition: 'width .25s ease, background .25s ease',
                  }}
                />
              ))}
            </div>
          </div>
          <Progress value={(step / 3) * 100} height={6} animate={false} />
        </div>
      </div>

      <Shell width={1180} style={{ paddingTop: 34 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {/* ------------------------------------------------------ main col */}
          <div style={{ gridColumn: 'span 1', minWidth: 0 }}>
            <Card pad={30} style={{ boxShadow: SHADOW.md }}>
              <div key={step} className="sl-rise">
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 1.4,
                    textTransform: 'uppercase',
                    color: C.primary,
                    marginBottom: 10,
                  }}
                >
                  Step {step}
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: -1,
                    color: C.text,
                  }}
                >
                  {meta.title}
                </h1>
                <p style={{ margin: '10px 0 26px', fontSize: 14.5, color: C.muted, lineHeight: 1.65 }}>
                  {meta.sub}
                </p>

                {/* ---------------------------------------------------- step 1 */}
                {step === 1 && (
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 26 }}>
                      {allSkills.map((s) => (
                        <SkillChip
                          key={s}
                          label={s}
                          active={skills.includes(s)}
                          onClick={() => toggle(skills, setSkills, s)}
                        />
                      ))}
                    </div>
                    <Field
                      label="Add a skill we missed"
                      hint="Press Enter or tap Add. Custom skills are reviewed for demand matching."
                    >
                      <div style={{ display: 'flex', gap: 10 }}>
                        <Input
                          value={custom}
                          onChange={(e) => setCustom(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addCustom()
                            }
                          }}
                          placeholder="e.g. 3D Modelling, Sinhala Voiceover"
                        />
                        <Btn variant="secondary" onClick={addCustom}>
                          Add
                        </Btn>
                      </div>
                    </Field>
                    <AICallout title="Skills shape your radar" compact>
                      Students with 3 or more skills receive an average of 4.2x more matched
                      opportunities near Peradeniya.
                    </AICallout>
                  </div>
                )}

                {/* ---------------------------------------------------- step 2 */}
                {step === 2 && (
                  <div>
                    <SectionTitle
                      title="Availability"
                      subtitle="Select every window that works for you."
                    />
                    <Grid min={220} gap={12} style={{ marginBottom: 30 }}>
                      {AVAILABILITY.map((a) => (
                        <SelectCard
                          key={a.key}
                          active={slots.includes(a.key)}
                          onClick={() => toggle(slots, setSlots, a.key)}
                          icon={a.icon}
                          title={a.key}
                          sub={a.sub}
                        />
                      ))}
                    </Grid>
                    <SectionTitle
                      title="Location radius"
                      subtitle="How far are you willing to travel for a job?"
                    />
                    <Grid min={220} gap={12}>
                      {RADII.map((r) => (
                        <SelectCard
                          key={r.km}
                          active={radius === r.km}
                          onClick={() => setRadius(r.km)}
                          icon="📍"
                          title={r.label}
                          sub={r.sub}
                          right={`${r.jobs} open now`}
                        />
                      ))}
                    </Grid>
                  </div>
                )}

                {/* ---------------------------------------------------- step 3 */}
                {step === 3 && (
                  <div>
                    <Grid min={250} gap={12} style={{ marginBottom: 28 }}>
                      {LEVELS.map((l) => (
                        <SelectCard
                          key={l.key}
                          active={level === l.key}
                          onClick={() => setLevel(l.key)}
                          icon={l.icon}
                          title={l.key}
                          sub={l.desc}
                        />
                      ))}
                    </Grid>
                    <Field
                      label="Portfolio link (optional)"
                      hint="Behance, GitHub, Drive folder or personal site — anything that shows your work."
                    >
                      <Input
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        placeholder="https://behance.net/kasunperera"
                      />
                    </Field>
                    <AICallout title="Almost there" compact>
                      Your profile will be scored against live local demand the moment you finish.
                    </AICallout>
                  </div>
                )}
              </div>

              {/* -------------------------------------------------- controls */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 30,
                  paddingTop: 22,
                  borderTop: `1px solid ${C.border}`,
                  flexWrap: 'wrap',
                }}
              >
                <Btn
                  variant="ghost"
                  onClick={() => (step === 1 ? onNavigate('signup') : setStep((s) => s - 1))}
                >
                  ← {step === 1 ? 'Back to signup' : 'Back'}
                </Btn>
                {step < 3 ? (
                  <Btn size="lg" disabled={!stepValid} onClick={() => setStep((s) => s + 1)}>
                    Continue →
                  </Btn>
                ) : (
                  <Btn size="lg" disabled={!stepValid} onClick={() => onNavigate('dashboard')}>
                    Build My Profile ✨
                  </Btn>
                )}
              </div>
            </Card>
          </div>

          {/* ---------------------------------------------------- summary col */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
            <Card pad={0} style={{ overflow: 'hidden' }}>
              <div style={{ background: BRAND_GRADIENT, padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <Avatar name={USER.name} size={48} ring />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 800, color: '#fff' }}>{USER.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                      {USER.role}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    padding: '9px 12px',
                    borderRadius: 11,
                    background: 'rgba(255,255,255,0.16)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  Profile completeness · {Math.round((step / 3) * 100)}%
                </div>
              </div>
              <div style={{ padding: 22 }}>
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: C.faint,
                    marginBottom: 10,
                  }}
                >
                  Skills ({skills.length})
                </div>
                {skills.length === 0 ? (
                  <p style={{ margin: 0, fontSize: 13, color: C.faint }}>Nothing selected yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {skills.map((s) => (
                      <Badge key={s} color={C.primary}>
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: C.faint,
                    margin: '20px 0 10px',
                  }}
                >
                  Availability
                </div>
                {slots.length === 0 ? (
                  <p style={{ margin: 0, fontSize: 13, color: C.faint }}>Not set.</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {slots.map((s) => (
                      <Badge key={s} color={C.accent}>
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    padding: '16px 0 0',
                    marginTop: 16,
                    borderTop: `1px dashed ${C.border}`,
                  }}
                >
                  <span style={{ color: C.muted, fontWeight: 600 }}>Travel radius</span>
                  <span style={{ color: C.text, fontWeight: 800 }}>
                    {radius ? `${radius} km` : '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 10 }}>
                  <span style={{ color: C.muted, fontWeight: 600 }}>Experience</span>
                  <span style={{ color: C.text, fontWeight: 800 }}>{level ?? '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 10 }}>
                  <span style={{ color: C.muted, fontWeight: 600 }}>Portfolio</span>
                  <span
                    style={{
                      color: portfolio ? C.text : C.faint,
                      fontWeight: 800,
                      maxWidth: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {portfolio || 'Not added'}
                  </span>
                </div>
              </div>
            </Card>

            <Card pad={20}>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, marginBottom: 6 }}>
                Estimated matches near you
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1, color: C.primary }}>
                {skills.length * (radius ?? 1) + slots.length * 2}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
                Live estimate based on unmet demand in Peradeniya, Kandy and Colombo.
              </p>
            </Card>
          </aside>
        </div>
      </Shell>
    </div>
  )
}
