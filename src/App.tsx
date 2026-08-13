import { useState } from 'react'
import type { Page, PageProps, Navigate } from './types'
import Nav from './components/Nav'
import MobileNav from './components/MobileNav'
import AdminNav from './components/AdminNav'
import { C, GlobalFX } from './components/ui'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import OpportunityRadar from './pages/OpportunityRadar'
import DemandCluster from './pages/DemandCluster'
import Opportunities from './pages/Opportunities'
import OpportunityDetail from './pages/OpportunityDetail'
import AIMatch from './pages/AIMatch'
import PostNeed from './pages/PostNeed'
import MyJobs from './pages/MyJobs'
import JobWorkspace from './pages/JobWorkspace'
import SubmitWork from './pages/SubmitWork'
import Completion from './pages/Completion'
import Earnings from './pages/Earnings'
import EconomicImpact from './pages/EconomicImpact'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Portfolio from './pages/Portfolio'
import SkillDemand from './pages/SkillDemand'
import Notifications from './pages/Notifications'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminJobs from './pages/admin/AdminJobs'
import AdminPayments from './pages/admin/AdminPayments'
import AdminAnalytics from './pages/admin/AdminAnalytics'

const FULLSCREEN: Page[] = ['login', 'signup', 'onboarding']
const ADMIN_PAGES: Page[] = ['admin-dashboard', 'admin-users', 'admin-jobs', 'admin-payments', 'admin-analytics']

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  const navigate: Navigate = (p, extra) => {
    if (extra?.opportunityId !== undefined) {
      setSelectedOpportunityId(extra.opportunityId)
    }
    if (extra?.jobId !== undefined) {
      setSelectedJobId(extra.jobId)
    }
    if (extra?.studentId !== undefined) {
      setSelectedStudentId(extra.studentId)
    }
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const render = () => {
    const props: PageProps = {
      onNavigate: navigate,
      selectedOpportunityId,
      selectedJobId,
      selectedStudentId,
    }

    switch (page) {
      case 'landing':            return <Landing {...props} />
      case 'login':              return <Login {...props} />
      case 'signup':             return <Signup {...props} />
      case 'onboarding':         return <Onboarding {...props} />
      case 'dashboard':          return <Dashboard {...props} />
      case 'radar':              return <OpportunityRadar {...props} />
      case 'demand-cluster':     return <DemandCluster {...props} />
      case 'opportunities':      return <Opportunities {...props} />
      case 'opportunity-detail': return <OpportunityDetail {...props} />
      case 'ai-match':           return <AIMatch {...props} />
      case 'post-need':          return <PostNeed {...props} />
      case 'my-jobs':            return <MyJobs {...props} />
      case 'job-workspace':      return <JobWorkspace {...props} />
      case 'submit-work':        return <SubmitWork {...props} />
      case 'completion':         return <Completion {...props} />
      case 'earnings':           return <Earnings {...props} />
      case 'economic-impact':    return <EconomicImpact {...props} />
      case 'messages':           return <Messages {...props} />
      case 'profile':            return <Profile {...props} />
      case 'portfolio':          return <Portfolio {...props} />
      case 'skill-demand':       return <SkillDemand {...props} />
      case 'notifications':      return <Notifications {...props} />
      case 'admin-dashboard':    return <AdminDashboard {...props} />
      case 'admin-users':        return <AdminUsers {...props} />
      case 'admin-jobs':         return <AdminJobs {...props} />
      case 'admin-payments':     return <AdminPayments {...props} />
      case 'admin-analytics':    return <AdminAnalytics {...props} />
    }
  }

  const fullscreen = FULLSCREEN.includes(page)
  const isAdmin = ADMIN_PAGES.includes(page)

  if (isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Manrope', system-ui, sans-serif", display: 'flex' }}>
        <GlobalFX />
        <AdminNav currentPage={page} onNavigate={navigate} />
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', minHeight: '100vh' }}>
          <main key={page} className="sl-rise">
            {render()}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <GlobalFX />
      {!fullscreen && <Nav onNavigate={navigate} currentPage={page} />}
      <main key={page} className="sl-rise">
        {render()}
      </main>
      <MobileNav onNavigate={navigate} currentPage={page} />
    </div>
  )
}
