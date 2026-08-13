import { useState } from 'react'
import type { Page } from './types'
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

const FULLSCREEN: Page[] = ['login', 'signup']
const ADMIN_PAGES: Page[] = ['admin-dashboard', 'admin-users', 'admin-jobs', 'admin-payments', 'admin-analytics']

export default function App() {
  const [page, setPage] = useState<Page>('landing')

  const navigate = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const render = () => {
    switch (page) {
      case 'landing':            return <Landing onNavigate={navigate} />
      case 'login':              return <Login onNavigate={navigate} />
      case 'signup':             return <Signup onNavigate={navigate} />
      case 'onboarding':         return <Onboarding onNavigate={navigate} />
      case 'dashboard':          return <Dashboard onNavigate={navigate} />
      case 'radar':              return <OpportunityRadar onNavigate={navigate} />
      case 'demand-cluster':     return <DemandCluster onNavigate={navigate} />
      case 'opportunities':      return <Opportunities onNavigate={navigate} />
      case 'opportunity-detail': return <OpportunityDetail onNavigate={navigate} />
      case 'ai-match':           return <AIMatch onNavigate={navigate} />
      case 'post-need':          return <PostNeed onNavigate={navigate} />
      case 'my-jobs':            return <MyJobs onNavigate={navigate} />
      case 'job-workspace':      return <JobWorkspace onNavigate={navigate} />
      case 'submit-work':        return <SubmitWork onNavigate={navigate} />
      case 'completion':         return <Completion onNavigate={navigate} />
      case 'earnings':           return <Earnings onNavigate={navigate} />
      case 'economic-impact':    return <EconomicImpact onNavigate={navigate} />
      case 'messages':           return <Messages onNavigate={navigate} />
      case 'profile':            return <Profile onNavigate={navigate} />
      case 'portfolio':          return <Portfolio onNavigate={navigate} />
      case 'skill-demand':       return <SkillDemand onNavigate={navigate} />
      case 'notifications':      return <Notifications onNavigate={navigate} />
      case 'admin-dashboard':    return <AdminDashboard onNavigate={navigate} />
      case 'admin-users':        return <AdminUsers onNavigate={navigate} />
      case 'admin-jobs':         return <AdminJobs onNavigate={navigate} />
      case 'admin-payments':     return <AdminPayments onNavigate={navigate} />
      case 'admin-analytics':    return <AdminAnalytics onNavigate={navigate} />
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
