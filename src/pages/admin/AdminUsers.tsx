import { useState } from 'react'
import type { PageProps } from '../../types'
import { Badge, Btn, C, Card, SearchInput, StatusBadge, rupees } from '../../components/ui'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

function AvatarCell({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const colors = [['#EEF2FF', '#4338CA'], ['#CCFBF1', '#0F766E'], ['#FEF3C7', '#B45309'], ['#FCE7F3', '#BE185D'], ['#DCFCE7', '#15803D']]
  const [bg, fg] = colors[name.charCodeAt(0) % colors.length]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 800, flexShrink: 0 }}>{initials}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{name}</div>
      </div>
    </div>
  )
}

function TrustBadge({ score }: { score: number }) {
  const color = score >= 80 ? C.success : score >= 60 ? C.warning : score > 0 ? C.error : C.faint
  return <span style={{ fontSize: 12.5, fontWeight: 800, color }}>{score > 0 ? score : '—'}</span>
}

type Tab = 'students' | 'requesters'

export default function AdminUsers({ onNavigate }: PageProps) {
  const usersData = useQuery(api.admin.getUsers)
  const STUDENTS = usersData?.students || []
  const REQUESTERS = usersData?.requesters || []

  const [tab, setTab] = useState<Tab>('students')
  const [search, setSearch] = useState('')

  const filteredStudents = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )
  const filteredRequesters = REQUESTERS.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '28px 32px 80px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, letterSpacing: 0.5, marginBottom: 4 }}>People · {STUDENTS.length + REQUESTERS.length} total</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.8 }}>User Management</h1>
        </div>
        <Btn size="sm">+ Invite Student</Btn>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Students', value: '1,284', color: C.primary },
          { label: 'Active', value: '1,241', color: C.success },
          { label: 'Suspended', value: '8', color: C.error },
          { label: 'Pending Verify', value: '35', color: C.warning },
          { label: 'Requesters', value: '342', color: '#7C3AED' },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 120px', padding: '14px 18px', borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.surface }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: -0.8 }}>{s.value}</div>
            <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: C.subtle, borderRadius: 12 }}>
          {(['students', 'requesters'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className="sl-press"
              style={{ padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, background: tab === t ? C.surface : 'transparent', color: tab === t ? C.text : C.muted, boxShadow: tab === t ? '0 1px 4px rgba(15,23,42,0.07)' : 'none' }}>
              {t === 'students' ? 'Students' : 'Requesters'}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder={`Search ${tab}…`} />
      </div>

      {/* Students table */}
      {tab === 'students' && (
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.subtle }}>
                  {['Student', 'Location', 'Trust', 'Jobs', 'Earned', 'Rating', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.6, whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.name} style={{ borderTop: `1px solid ${C.border}`, transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.subtle)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 14px', minWidth: 180 }}>
                      <AvatarCell name={s.name} />
                      <div style={{ fontSize: 11.5, color: C.faint, marginTop: 2, marginLeft: 44 }}>{s.email}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: C.muted }}>{s.location}</td>
                    <td style={{ padding: '12px 14px' }}><TrustBadge score={s.trust} /></td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: C.text }}>{s.jobs}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: C.success }}>{s.earned > 0 ? rupees(s.earned) : '—'}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: C.text }}>{s.rating > 0 ? `⭐ ${s.rating}` : '—'}</td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={s.status} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn variant="ghost" size="sm" onClick={() => onNavigate('profile')}>View</Btn>
                        {s.status === 'Active' ? (
                          <Btn variant="danger" size="sm">Suspend</Btn>
                        ) : s.status === 'Pending' ? (
                          <Btn size="sm">Verify</Btn>
                        ) : (
                          <Btn variant="secondary" size="sm">Reinstate</Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Requesters table */}
      {tab === 'requesters' && (
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.subtle }}>
                  {['Requester', 'Type', 'Location', 'Jobs Posted', 'Total Spent', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.6, whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRequesters.map((r) => (
                  <tr key={r.name} style={{ borderTop: `1px solid ${C.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.subtle)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 14px' }}><AvatarCell name={r.name} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <Badge color={r.type === 'Organization' ? '#7C3AED' : r.type === 'Small Business' ? C.accent : C.muted}>
                        {r.type}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 14px', color: C.muted }}>{r.location}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: C.text }}>{r.posted}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: C.success }}>{r.spent > 0 ? rupees(r.spent) : '—'}</td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={r.status} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn variant="ghost" size="sm">View</Btn>
                        {r.status === 'Active' ? (
                          <Btn variant="danger" size="sm">Suspend</Btn>
                        ) : (
                          <Btn variant="secondary" size="sm">Reinstate</Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
