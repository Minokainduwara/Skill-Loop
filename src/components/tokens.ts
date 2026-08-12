export const C = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  accent: '#14B8A6',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#EF4444',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  faint: '#94A3B8',
  border: '#E2E8F0',
  subtle: '#F1F5F9',
}

export const HERO_GRADIENT = 'linear-gradient(135deg, #1e1b4b 0%, #312e81 52%, #0f766e 100%)'
export const BRAND_GRADIENT = 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #14B8A6 100%)'

export const SHADOW = {
  sm: '0 1px 2px rgba(15,23,42,0.05)',
  card: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
  md: '0 6px 20px rgba(15,23,42,0.07)',
  lg: '0 18px 48px rgba(15,23,42,0.12)',
  glow: '0 12px 32px rgba(79,70,229,0.28)',
}

export const rupees = (n: number) => 'Rs. ' + n.toLocaleString('en-US')
