export type Page =
  | 'landing'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'dashboard'
  | 'community-dashboard'
  | 'radar'
  | 'demand-cluster'
  | 'opportunities'
  | 'opportunity-detail'
  | 'ai-match'
  | 'post-need'
  | 'my-jobs'
  | 'job-workspace'
  | 'submit-work'
  | 'completion'
  | 'earnings'
  | 'economic-impact'
  | 'messages'
  | 'profile'
  | 'portfolio'
  | 'skill-demand'
  | 'notifications'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-jobs'
  | 'admin-payments'
  | 'admin-analytics'

export type Navigate = (page: Page) => void

export type UserRole = 'student' | 'community'

export interface PageProps {
  onNavigate: Navigate
}

export interface NavProps {
  onNavigate: Navigate
  currentPage: Page
  currentRole: UserRole
}
