import { useEffect, useMemo, useRef, useState } from 'react'
import type { PageProps } from '../types'
import {
  AICallout,
  Avatar,
  Badge,
  Btn,
  C,
  Card,
  Divider,
  Field,
  Grid,
  Input,
  MatchBadge,
  PageHead,
  Progress,
  SHADOW,
  SectionTitle,
  Select,
  SkillChip,
  Textarea,
} from '../components/ui'

type Phase = 'form' | 'analyzing' | 'result'

const CATEGORIES = [
  'Select category',
  'Design',
  'Video',
  'Development',
  'Tutoring',
  'Photography',
  'IT Support',
  'Writing',
]

const URGENCIES = ['Flexible', 'This week', 'Urgent (48 hrs)']

const KEYWORD_MAP: { keys: string[]; skills: string[] }[] = [
  { keys: ['poster', 'design', 'logo', 'flyer', 'banner'], skills: ['Graphic Design', 'Canva'] },
  { keys: ['video', 'reel', 'promo', 'edit'], skills: ['Video Editing', 'Premiere Pro'] },
  { keys: ['website', 'web', 'landing', 'app'], skills: ['Web Development', 'React'] },
  { keys: ['tutor', 'tuition', 'teach', 'maths', 'physics'], skills: ['Tutoring'] },
  { keys: ['photo', 'shoot', 'camera', 'product shot'], skills: ['Photography'] },
  { keys: ['social', 'instagram', 'facebook', 'tiktok'], skills: ['Social Media'] },
  { keys: ['translate', 'sinhala', 'tamil', 'write', 'article'], skills: ['Translation', 'Content Writing'] },
  { keys: ['laptop', 'computer', 'wifi', 'repair', 'install'], skills: ['IT Support'] },
  { keys: ['excel', 'data', 'python', 'analysis'], skills: ['Data Analysis', 'Python'] },
]

const STEPS = ['Understanding request', 'Finding skills', 'Checking availability', 'Ranking candidates']

const TOP_MATCHES = [
  { name: 'Lahiru methsara', match: 96, meta: 'ICT · Ruhuna · 18 jobs' },
  { name: 'Avishka Ishan', match: 89, meta: 'BST · Ruhuna · 12 jobs' },
  { name: 'Sithum Nimsara', match: 84, meta: 'ET Studies · Ruhuna · 9 jobs' },
]

const TIPS = [
  { icon: '🎯', title: 'Say what the outcome is', text: '"A poster for a 900-person exhibition" beats "some design work".' },
  { icon: '📐', title: 'Give sizes and formats', text: 'Print size, social dimensions, or file types remove a whole revision round.' },
  { icon: '💰', title: 'Post a realistic budget', text: 'Requests with a budget get matched 3× faster than open-ended ones.' },
  { icon: '🗓️', title: 'Be honest about the deadline', text: 'Availability is 25% of the match score, so accurate dates find better people.' },
  { icon: '📎', title: 'Attach what you already have', text: "Logos, colours or last year's version give the student a running start." },
]

export default function PostNeed({ onNavigate }: PageProps) {
  const [phase, setPhase] = useState<Phase>('form')
  const [desc, setDesc] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [budget, setBudget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [location, setLocation] = useState('kaburupitiya town')
  const [urgency, setUrgency] = useState(URGENCIES[1])
  const [removed, setRemoved] = useState<string[]>([])
  const [custom, setCustom] = useState<string[]>([])
  const [customDraft, setCustomDraft] = useState('')
  const [step, setStep] = useState(0)

  const timers = useRef<number[]>([])

  const suggested = useMemo(() => {
    const text = desc.toLowerCase()
    const found: string[] = []
    for (const entry of KEYWORD_MAP) {
      if (entry.keys.some((k) => text.includes(k))) {
        for (const s of entry.skills) if (!found.includes(s)) found.push(s)
      }
    }
    return found
  }, [desc])

  const activeSkills = useMemo(
    () => [...suggested.filter((s) => !removed.includes(s)), ...custom],
    [suggested, removed, custom],
  )

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    }
  }, [])

  const start = () => {
    setPhase('analyzing')
    setStep(0)
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    STEPS.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStep(i + 1), 850 * (i + 1)))
    })
    timers.current.push(window.setTimeout(() => setPhase('result'), 850 * STEPS.length + 700))
  }

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    setPhase('form')
    setStep(0)
    setDesc('')
    setCategory(CATEGORIES[0])
    setBudget('')
    setDeadline('')
    setUrgency(URGENCIES[1])
    setRemoved([])
    setCustom([])
    setCustomDraft('')
  }

  const toggleSkill = (s: string) => {
    if (custom.includes(s)) {
      setCustom((prev) => prev.filter((x) => x !== s))
      return
    }
    setRemoved((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  const addCustom = () => {
    const v = customDraft.trim()
    if (!v || activeSkills.includes(v)) return
    setCustom((prev) => [...prev, v])
    setCustomDraft('')
  }

  const canSubmit = desc.trim().length > 12 && category !== CATEGORIES[0]

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 20px 120px' }}>
        <PageHead
          eyebrow="Post a need"
          title="What do you need help with?"
          subtitle="Describe it in plain words. SkillLoop extracts the skills, then finds verified students near you — no job ads, no bidding wars."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 22 }} className="sl-pn-grid">
          <style>{`@media (min-width: 980px) { .sl-pn-grid { grid-template-columns: minmax(0,1.6fr) minmax(280px,1fr) !important; align-items: start } }`}</style>

          <div style={{ minWidth: 0 }}>
            {phase === 'form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'sl-rise .45s both' }}>
                <Card>
                  <Field label="Describe what you need" hint="One or two sentences is enough — detail helps the match.">
                    <Textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      rows={5}
                      placeholder="I need a promotional video for our small restaurant."
                    />
                  </Field>

                  <Grid min={200} gap={14}>
                    <Field label="Category">
                      <Select value={category} onChange={setCategory} options={CATEGORIES} />
                    </Field>
                    <Field label="Budget (Rs.)">
                      <Input
                        value={budget}
                        onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="2000"
                        inputMode="numeric"
                      />
                    </Field>
                    <Field label="Deadline">
                      <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    </Field>
                    <Field label="Location">
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Kaburupitiya town"
                      />
                    </Field>
                  </Grid>

                  <Field label="How urgent is it?" style={{ marginBottom: 4 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {URGENCIES.map((u) => (
                        <SkillChip key={u} label={u} active={urgency === u} onClick={() => setUrgency(u)} />
                      ))}
                    </div>
                  </Field>
                </Card>

                <Card style={{ borderColor: activeSkills.length ? '#C7D2FE' : C.border }}>
                  <SectionTitle
                    title="AI skill extraction"
                    subtitle="Updates live as you type. Toggle anything the engine got wrong."
                    action={
                      <Badge color={activeSkills.length ? C.accent : C.muted} bg={activeSkills.length ? '#CCFBF1' : C.subtle} dot>
                        {activeSkills.length} skill{activeSkills.length === 1 ? '' : 's'}
                      </Badge>
                    }
                  />
                  {suggested.length === 0 && custom.length === 0 ? (
                    <div
                      style={{
                        padding: '22px 18px',
                        borderRadius: 14,
                        border: `1px dashed ${C.border}`,
                        textAlign: 'center',
                        fontSize: 13,
                        color: C.faint,
                      }}
                    >
                      Start typing your request — suggested skills will appear here.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {suggested.map((s) => (
                        <SkillChip
                          key={s}
                          label={s}
                          active={!removed.includes(s)}
                          onClick={() => toggleSkill(s)}
                        />
                      ))}
                      {custom.map((s) => (
                        <SkillChip key={s} label={s} active onClick={() => toggleSkill(s)} tone="accent" />
                      ))}
                    </div>
                  )}

                  <Divider />

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Input
                      value={customDraft}
                      onChange={(e) => setCustomDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustom()
                        }
                      }}
                      placeholder="Add a skill of your own"
                      style={{ flex: 1, minWidth: 200 }}
                    />
                    <Btn variant="secondary" onClick={addCustom}>
                      Add skill
                    </Btn>
                  </div>
                </Card>

                <Card pad={18}>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Btn size="lg" disabled={!canSubmit} onClick={start}>
                      Find the Best Match
                    </Btn>
                    <span style={{ fontSize: 12.5, color: C.faint }}>
                      {canSubmit
                        ? 'Free to post · you only pay when you accept a match'
                        : 'Add a short description and pick a category to continue'}
                    </span>
                  </div>
                </Card>
              </div>
            )}

            {phase === 'analyzing' && (
              <Card style={{ animation: 'sl-rise .45s both', boxShadow: SHADOW.md }}>
                <div style={{ textAlign: 'center', marginBottom: 26 }}>
                  <div
                    style={{
                      width: 66,
                      height: 66,
                      borderRadius: 22,
                      margin: '0 auto 16px',
                      background: 'linear-gradient(135deg, #EEF2FF, #F0FDFA)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 30,
                      animation: 'sl-float 2.4s ease-in-out infinite',
                    }}
                  >
                    🤖
                  </div>
                  <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: C.text }}>
                    AI is analyzing your request...
                  </h2>
                  <p style={{ margin: '8px 0 0', fontSize: 13.5, color: C.muted }}>
                    Scanning verified students within 5 km of {location || 'your area'}.
                  </p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <Progress value={(step / STEPS.length) * 100} height={10} />
                  <div style={{ fontSize: 12, color: C.faint, fontWeight: 700, marginTop: 8, textAlign: 'right' }}>
                    {Math.round((step / STEPS.length) * 100)}%
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {STEPS.map((label, i) => {
                    const done = step > i
                    const active = step === i
                    return (
                      <div
                        key={label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '14px 16px',
                          borderRadius: 14,
                          border: `1px solid ${done ? '#86EFAC' : active ? '#C7D2FE' : C.border}`,
                          background: done ? '#F0FDF4' : active ? '#FAFAFF' : C.surface,
                          transition: 'background .3s ease, border-color .3s ease',
                        }}
                      >
                        {done ? (
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              background: C.success,
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 13,
                              fontWeight: 800,
                              animation: 'sl-pop .35s both',
                            }}
                          >
                            ✓
                          </span>
                        ) : active ? (
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              border: `3px solid ${C.subtle}`,
                              borderTopColor: C.primary,
                              animation: 'sl-spin .8s linear infinite',
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              border: `2px dashed ${C.border}`,
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: done ? '#15803D' : active ? C.text : C.faint,
                          }}
                        >
                          {label}
                        </span>
                        {done && (
                          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#15803D' }}>
                            done
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {phase === 'result' && (
              <Card style={{ animation: 'sl-rise .45s both', boxShadow: SHADOW.md }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 24,
                      margin: '0 auto 16px',
                      background: '#DCFCE7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 34,
                      animation: 'sl-pop .5s both',
                    }}
                  >
                    🎉
                  </div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>
                    3 strong matches found
                  </h2>
                  <p style={{ margin: '8px auto 0', fontSize: 14, color: C.muted, maxWidth: 420, lineHeight: 1.6 }}>
                    47 verified students near {location || 'you'} were scanned against{' '}
                    {activeSkills.length || 4} skills. Here are the top three.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                  {TOP_MATCHES.map((m, i) => (
                    <div
                      key={m.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 16px',
                        borderRadius: 14,
                        border: `1px solid ${C.border}`,
                        background: C.bg,
                        animation: `sl-rise .45s ${0.1 + i * 0.1}s both`,
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 800, color: C.faint }}>#{i + 1}</span>
                      <Avatar name={m.name} size={40} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{m.meta}</div>
                      </div>
                      <MatchBadge pct={m.match} size="sm" />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Btn size="lg" onClick={() => onNavigate('ai-match')}>
                    View AI Matches
                  </Btn>
                  <Btn size="lg" variant="secondary" onClick={reset}>
                    Post another need
                  </Btn>
                </div>
              </Card>
            )}
          </div>

          {/* ------------------------------------------------------ sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AICallout title="You never write a job ad">
              Describe the outcome in your own words. SkillLoop turns it into structured skills, budget and timing —
              and only shows you people who can actually deliver it.
            </AICallout>

            <Card>
              <SectionTitle title="Tips for a strong request" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {TIPS.map((t) => (
                  <div key={t.title} style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 17, flexShrink: 0 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>{t.title}</div>
                      <p style={{ margin: '3px 0 0', fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>{t.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card pad={18} style={{ background: '#F0FDFA', borderColor: '#99F6E4' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F766E', marginBottom: 6 }}>
                🛡️ Escrow before work starts
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: '#0F766E', lineHeight: 1.6, opacity: 0.9 }}>
                Your budget is only held once you accept a match, and released after you approve the delivery.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
