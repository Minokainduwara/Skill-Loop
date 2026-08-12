import { useState } from 'react'
import type { PageProps } from '../types'
import {
  AICallout,
  Avatar,
  Badge,
  Btn,
  C,
  Card,
  CircleProgress,
  Divider,
  Grid,
  HERO_GRADIENT,
  InfoTile,
  MatchBadge,
  Progress,
  SectionTitle,
  Shell,
  StatusBadge,
  rupees,
} from '../components/ui'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const REQUESTS = [
  { title: 'Robotics Exhibition Poster', budget: 2000, status: 'Open', replies: 7, match: 96, deadline: 'Due in 2 days', category: 'Design' },
  { title: 'Café Menu Redesign', budget: 1500, status: 'In Progress', replies: 5, match: 92, deadline: 'Due in 5 days', category: 'Design' },
  { title: 'Physics Tuition - Grade 12', budget: 3000, status: 'Awaiting Review', replies: 4, match: 89, deadline: 'Due Saturday', category: 'Tutoring' },
]

const MATCHES = [
  { name: 'Kasun Perera', skill: 'Graphic Design', location: 'Peradeniya', match: 96, rating: 4.9 },
  { name: 'Nimali Jayasuriya', skill: 'Branding', location: 'Kandy', match: 92, rating: 4.8 },
  { name: 'Sahan Fernando', skill: 'Video Editing', location: 'Gatambe', match: 88, rating: 4.7 },
]

const QUICK_ACTIONS = [
  { icon: '➕', label: 'Post a Need', sub: 'Create a new job', page: 'post-need' as const },
  { icon: '💬', label: 'Messages', sub: '4 new replies', page: 'messages' as const },
  { icon: '📊', label: 'Impact', sub: 'See local value', page: 'economic-impact' as const },
  { icon: '🔔', label: 'Updates', sub: '2 unread', page: 'notifications' as const },
  { icon: '👤', label: 'Profile', sub: 'Community profile', page: 'profile' as const },
]

export default function CommunityDashboard({ onNavigate }: PageProps) {
  const [dismissed, setDismissed] = useState(false)

  return (
    <Shell>
      <div
        style={{
          background: HERO_GRADIENT,
          borderRadius: 24,
          padding: '26px 24px',
          marginBottom: 24,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(30,27,75,0.24)',
        }}
      >
        <div style={{ position: 'absolute', right: -70, top: -70, width: 220, height: 220, borderRadius: '50%', background: 'rgba(20,184,166,0.15)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                {getGreeting()}, Community Member 👋
              </div>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: -1, lineHeight: 1.12 }}>
                Manage local jobs, matches, and spending from one place.
              </h1>
              <p style={{ margin: '12px 0 0', maxWidth: 640, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)' }}>
                Your dashboard keeps requests, student responses, and community impact in one flow so you can post jobs without losing visibility.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
                <Badge color="#5EEAD4" bg="rgba(94,234,212,0.14)" dot>
                  Community member
                </Badge>
                <Badge color="#A5B4FC" bg="rgba(165,180,252,0.16)">
                  Escrow ready
                </Badge>
                <Badge color="#FDE68A" bg="rgba(253,230,138,0.16)">
                  3 active jobs
                </Badge>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Btn size="sm" onClick={() => onNavigate('post-need')}>
                + Post a Need
              </Btn>
              <Btn size="sm" variant="secondary" onClick={() => onNavigate('economic-impact')}>
                View Impact
              </Btn>
            </div>
          </div>
        </div>
      </div>

      <Grid min={180} gap={12} style={{ marginBottom: 24 }}>
        <InfoTile icon="📝" label="Open jobs" value="3" tone={C.primary} />
        <InfoTile icon="💬" label="Replies" value="16" tone={C.accent} />
        <InfoTile icon="⏱️" label="Avg response" value="42m" tone={C.warning} />
        <InfoTile icon="💰" label="Budget posted" value={rupees(6500)} tone={C.success} />
        <InfoTile icon="🛡️" label="Protected spend" value="96%" tone="#7C3AED" />
      </Grid>

      {!dismissed && (
        <Card style={{ marginBottom: 22, borderColor: '#C7D2FE', background: 'linear-gradient(135deg,#EEF2FF,#F8FAFF)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Two new matches are waiting for review</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                Keep the process moving by reviewing candidate responses and opening a chat with your best fit.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Btn size="sm" onClick={() => onNavigate('messages')}>
                Review matches
              </Btn>
              <Btn size="sm" variant="secondary" onClick={() => setDismissed(true)}>
                Dismiss
              </Btn>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginBottom: 24 }} className="scrollbar-hide">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => onNavigate(a.page)}
            className="sl-press"
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '14px 18px',
              borderRadius: 16,
              border: `1.5px solid ${C.border}`,
              background: C.surface,
              cursor: 'pointer',
              minWidth: 92,
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {a.icon}
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{a.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.faint, textAlign: 'center' }}>{a.sub}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <SectionTitle title="Your posted jobs" subtitle="Track status, replies, and current match quality" />
          <div style={{ display: 'grid', gap: 12 }}>
            {REQUESTS.map((r) => (
              <Card key={r.title} hover pad={18}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0, flex: '1 1 180px' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                      <StatusBadge status={r.status} />
                      <Badge color={C.muted} bg={C.subtle}>{r.category}</Badge>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{r.title}</div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>
                      {rupees(r.budget)} · {r.replies} replies · {r.deadline}
                    </div>
                  </div>
                  <MatchBadge pct={r.match} size="sm" />
                </div>
                <div style={{ marginTop: 14 }}>
                  <Progress value={r.match} height={6} gradient={`linear-gradient(90deg, ${C.primary}, ${C.accent})`} />
                </div>
              </Card>
            ))}
          </div>

          <Card pad={20}>
            <SectionTitle title="Recommended students" subtitle="Best fits for your latest request" />
            <div style={{ display: 'grid', gap: 12 }}>
              {MATCHES.map((m) => (
                <div key={m.name} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.subtle}` }}>
                  <Avatar name={m.name} size={42} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>{m.name}</div>
                    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>
                      {m.skill} · {m.location} · ⭐ {m.rating}
                    </div>
                  </div>
                  <MatchBadge pct={m.match} size="sm" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 16, minWidth: 0 }}>
          <Card style={{ boxShadow: '0 10px 28px rgba(15,23,42,0.08)' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
              <CircleProgress value={84} size={92} label="LOCAL" />
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 800, color: C.text }}>Spend retained locally</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, lineHeight: 1.6 }}>
                  Most of your spending stays inside the community when you choose nearby talent.
                </div>
              </div>
            </div>

            <Divider />

            <div style={{ display: 'grid', gap: 12 }}>
              <AICallout title="Why these jobs are important" compact>
                Requests posted from your area now have enough demand to form a stable local market. SkillLoop helps you keep the spend close to home while getting faster matches.
              </AICallout>
              <Btn full onClick={() => onNavigate('economic-impact')}>
                See community impact
              </Btn>
            </div>
          </Card>

          <Card pad={20}>
            <SectionTitle title="Need attention" subtitle="A quick summary of what to handle next" />
            <div style={{ display: 'grid', gap: 10 }}>
              <SummaryRow label="Reply review pending" value="2 jobs" />
              <SummaryRow label="Payment to fund" value={rupees(2000)} tone={C.warning} />
              <SummaryRow label="Unread messages" value="4" tone={C.accent} />
              <SummaryRow label="Saved by local matching" value={rupees(7200)} tone={C.success} />
            </div>
          </Card>

          <Card pad={20}>
            <SectionTitle title="Next steps" subtitle="Keep the workflow moving" />
            <div style={{ display: 'grid', gap: 10 }}>
              <Btn full onClick={() => onNavigate('post-need')}>
                Post another need
              </Btn>
              <Btn full variant="secondary" onClick={() => onNavigate('messages')}>
                Open messages
              </Btn>
              <Btn full variant="ghost" onClick={() => onNavigate('notifications')}>
                Check updates
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  )
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.subtle}` }}>
      <span style={{ fontSize: 13.5, color: C.muted, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13.5, color: tone ?? C.text, fontWeight: 800 }}>{value}</span>
    </div>
  )
}
