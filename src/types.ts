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

export type Navigate = (
  page: Page,
  extra?: { opportunityId?: string; jobId?: string; studentId?: string }
) => void

export interface PageProps {
  onNavigate: Navigate
  selectedOpportunityId?: string | null
  selectedJobId?: string | null
  selectedStudentId?: string | null
}

export interface NavProps {
  onNavigate: Navigate
  currentPage: Page
}

