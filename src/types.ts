export type Page =
  | 'landing'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'dashboard'
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
  | 'requester-dashboard'
  | 'requester-applications'

export type Navigate = (page: Page, data?: any) => void

export interface PageProps {
  onNavigate: Navigate
  data?: any
}

export interface NavProps {
  onNavigate: Navigate
  currentPage: Page
}
