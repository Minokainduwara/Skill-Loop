import { useState } from 'react'
import type { PageProps } from '../../types'
import { Badge, Btn, C, Card, SearchInput, StatusBadge, rupees } from '../../components/ui'

const ALL_JOBS = [
  { id: 'J001', title: 'Robotics Exhibition Poster', student: 'Kasun Perera', requester: 'University Robotics Society', budget: 2000, status: 'In Progress', category: 'Design', created: '5 Aug', deadline: '12 Aug', flag: false },
  { id: 'J002', title: 'Café Menu Redesign', student: 'Nimali Jayasuriya', requester: 'Kandy Hills Café', budget: 1500, status: 'Awaiting Review', category: 'Design', created: '4 Aug', deadline: '14 Aug', flag: false },
  { id: 'J003', title: 'Physics Tuition Grade 12', student: 'Roshan Mendis', requester: 'Dinuka Bandara', budget: 3000, status: 'Completed', category: 'Tutoring', created: '1 Aug', deadline: '10 Aug', flag: false },
  { id: 'J004', title: 'Instagram Reel Editing', student: 'Priya Wickramasinghe', requester: 'Café Brown', budget: 2500, status: 'In Progress', category: 'Video', created: '7 Aug', deadline: '11 Aug', flag: true },
  { id: 'J005', title: 'CV & Cover Letter Design', student: 'Tharaka Silva', requester: 'Individual', budget: 1000, status: 'Pending', category: 'Design', created: '8 Aug', deadline: '16 Aug', flag: false },
  { id: 'J006', title: 'Club T-Shirt Design', student: 'Kasun Perera', requester: 'Kandy Arts Club', budget: 2500, status: 'Completed', category: 'Design', created: '28 Jul', deadline: '5 Aug', flag: false },
  { id: 'J007', title: 'Website Landing Page', student: 'Tharaka Silva', requester: 'StartupKandy', budget: 5000, status: 'In Progress', category: 'Web Dev', created: '3 Aug', deadline: '20 Aug', flag: true },
  { id: 'J008', title: 'Mathematics Tutoring', student: 'Roshan Mendis', requester: 'Harsha Perera', budget: 4000, status: 'Completed', category: 'Tutoring', created: '20 Jul', deadline: '1 Aug', flag: false },
]

const CATEGORIES = ['All', 'Design', 'Video', 'Tutoring', 'Web Dev']
const STATUSES = ['All', 'In Progress', 'Awaiting Review', 'Completed', 'Pending', 'Cancelled']

export default function AdminJobs({ onNavigate }: PageProps) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [flagOnly, setFlagOnly] = useState(false)

  const filtered = ALL_JOBS.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.student.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || j.category === cat
    const matchStatus = statusFilter === 'All' || j.status === statusFilter
    const matchFlag = !flagOnly || j.flag
    return matchSearch && matchCat && matchStatus && matchFlag
  })

  const stats = {
    total: ALL_JOBS.length,
    active: ALL_JOBS.filter(j => j.status === 'In Progress').length,
    review: ALL_JOBS.filter(j => j.status === 'Awaiting Review').length,
    completed: ALL_JOBS.filter(j => j.status === 'Completed').length,
    flagged: ALL_JOBS.filter(j => j.flag).length,
    volume: ALL_JOBS.reduce((s, j) => s + j.budget, 0),
  }

  return (
    <div style={{ padding: '28px 32px 80px', maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, letterSpacing: 0.5, marginBottom: 4 }}>Jobs · {ALL_JOBS.length} total</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -0.8 }}>Job Management</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {stats.flagged > 0 && (
            <Btn variant="danger" size="sm" onClick={() => setFlagOnly(f => !f)}>
              🚩 {stats.flagged} Flagged
            </Btn>
          )}
          <Btn size="sm" onClick={() => onNavigate('admin-payments')}>View Payments</Btn>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Jobs', value: stats.total, color: C.primary },
          { label: 'Active', value: stats.active, color: '#1D4ED8' },
          { label: 'Awaiting Review', value: stats.review, color: '#7C3AED' },
          { label: 'Completed', value: stats.completed, color: C.success },
          { label: 'Flagged', value: stats.flagged, color: C.error },
          { label: 'Total Volume', value: rupees(stats.volume), color: C.success },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 100px', padding: '13px 16px', borderRadius: 13, border: `1.5px solid ${C.border}`, background: C.surface }}>
            <div style={{ fontSize: typeof s.value === 'number' ? 22 : 16, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search jobs or students…" />
        <select
          value={cat}
          onChange={e => setCat(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 11, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.text, background: C.surface, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 11, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.text, background: C.surface, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
        >
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        {flagOnly && (
          <Badge color={C.error} dot style={{ cursor: 'pointer' }} onClick={() => setFlagOnly(false)}>
            Flagged only · ✕
          </Badge>
        )}
      </div>

      {/* Table */}
      <Card pad={0} style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.subtle }}>
                {['ID', 'Job', 'Student', 'Requester', 'Budget', 'Category', 'Deadline', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: C.faint, letterSpacing: 0.6, whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.id}
                  style={{ borderTop: `1px solid ${C.border}`, background: j.flag ? '#FFF5F5' : undefined, transition: 'background 0.1s' }}
                  onMouseEnter={e => { if (!j.flag) e.currentTarget.style.background = C.subtle }}
                  onMouseLeave={e => { e.currentTarget.style.background = j.flag ? '#FFF5F5' : 'transparent' }}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: C.faint, fontFamily: 'monospace' }}>{j.id}</span>
                    {j.flag && <span style={{ marginLeft: 6 }}>🚩</span>}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: C.text, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</td>
                  <td style={{ padding: '12px 14px', color: C.muted }}>{j.student}</td>
                  <td style={{ padding: '12px 14px', color: C.muted, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.requester}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: C.success }}>{rupees(j.budget)}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <Badge color={j.category === 'Design' ? C.primary : j.category === 'Video' ? '#7C3AED' : j.category === 'Web Dev' ? C.accent : C.warning}>
                      {j.category}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 14px', color: C.muted, whiteSpace: 'nowrap' }}>{j.deadline}</td>
                  <td style={{ padding: '12px 14px' }}><StatusBadge status={j.status} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <Btn variant="ghost" size="sm" onClick={() => onNavigate('job-workspace')}>View</Btn>
                      {j.flag && <Btn variant="danger" size="sm">Resolve</Btn>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: C.muted, fontSize: 14 }}>
              No jobs match your filters
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
