import type { CSSProperties, ReactNode } from 'react'

export type IconName =
  | 'pin'
  | 'brain'
  | 'target'
  | 'graduation'
  | 'coin'
  | 'radar'
  | 'trend'
  | 'shield'
  | 'check'
  | 'message'
  | 'post'
  | 'chart'
  | 'folder'
  | 'attachment'
  | 'star'
  | 'cap'
  | 'people'
  | 'job'
  | 'clock'
  | 'spark'
  | 'brief'
  | 'calendar'
  | 'tag'

export function Icon({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.8,
  style,
  title,
}: {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
  style?: CSSProperties
  title?: string
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    role: title ? 'img' : 'presentation',
    'aria-hidden': title ? undefined : true,
    'aria-label': title,
    style,
  } as const

  const props = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (name) {
    case 'pin':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M12 21s5-4.35 5-10a5 5 0 1 0-10 0c0 5.65 5 10 5 10Z" />
          <circle {...props} cx="12" cy="11" r="1.8" />
        </svg>
      )
    case 'brain':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M9.5 7.5a2.5 2.5 0 0 1 4.2-1.8A2.5 2.5 0 0 1 18 7.8a2.5 2.5 0 0 1-.8 4.8v.4A2.5 2.5 0 0 1 14.7 16H9.3A2.5 2.5 0 0 1 7 13v-.4A2.5 2.5 0 0 1 6.2 7.8a2.5 2.5 0 0 1 3.3-.3Z" />
          <path {...props} d="M9 7.5v9M15 7.5v9M12 4.8v14.4" />
        </svg>
      )
    case 'target':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <circle {...props} cx="12" cy="12" r="8.5" />
          <circle {...props} cx="12" cy="12" r="4" />
          <path {...props} d="M12 2.8v3.4M21.2 12h-3.4M12 21.2v-3.4M2.8 12h3.4" />
        </svg>
      )
    case 'graduation':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M4 9.5 12 5l8 4.5-8 4.5-8-4.5Z" />
          <path {...props} d="M7 11v4.2c0 1.1 2.2 2.4 5 2.4s5-1.3 5-2.4V11" />
          <path {...props} d="m20 10.5 1 5.5" />
        </svg>
      )
    case 'coin':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <circle {...props} cx="12" cy="12" r="8.5" />
          <path {...props} d="M10 9.5c0-1.2.9-2 2-2s2 .8 2 1.8-.8 1.6-2 1.9-2 1-2 2.1.9 2 2 2 2-.8 2-2" />
          <path {...props} d="M12 6v12" />
        </svg>
      )
    case 'radar':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <circle {...props} cx="12" cy="12" r="8.5" />
          <circle {...props} cx="12" cy="12" r="4.5" />
          <path {...props} d="M12 3.5v3.3M20.5 12h-3.3M12 20.5v-3.3M3.5 12h3.3" />
          <path {...props} d="M12 12l5.2-5.2" />
        </svg>
      )
    case 'trend':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M4.5 16.5h15" />
          <path {...props} d="M5.5 16.5V8.5" />
          <path {...props} d="M9.5 16.5v-5" />
          <path {...props} d="M13.5 16.5v-8" />
          <path {...props} d="M17.5 16.5v-3.8" />
          <path {...props} d="m16 8 1.5-1.5L19 8" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M12 3.2 19 6v5c0 4.6-3.1 7.8-7 9.8-3.9-2-7-5.2-7-9.8V6l7-2.8Z" />
          <path {...props} d="m9.3 12 1.9 1.9 3.6-4" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <circle {...props} cx="12" cy="12" r="8.5" />
          <path {...props} d="m8.2 12.2 2.6 2.6 4.8-5.3" />
        </svg>
      )
    case 'message':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M5 5.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H11l-4.5 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
          <path {...props} d="M8 10h8M8 13h5" />
        </svg>
      )
    case 'post':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M12 5v14M5 12h14" />
          <path {...props} d="M6.5 6.5 17.5 17.5" opacity="0.35" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M4.5 19.5h15" />
          <path {...props} d="M7 15.5v-4" />
          <path {...props} d="M12 15.5v-7" />
          <path {...props} d="M17 15.5v-2.8" />
          <path {...props} d="M7 10.5 12 8l5 2.5" />
        </svg>
      )
    case 'folder':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M3.5 7.5h5l2 2h9a1 1 0 0 1 1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 18V7.5Z" />
        </svg>
      )
    case 'attachment':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M9.5 12.5 13 9a3 3 0 0 1 4.2 4.2l-5.8 5.8a4.5 4.5 0 0 1-6.4-6.4l7-7" />
        </svg>
      )
    case 'star':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="m12 3.8 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18.7l.9-5.4-3.9-3.8 5.4-.8L12 3.8Z" />
        </svg>
      )
    case 'cap':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M4 9.5 12 5l8 4.5-8 4.5-8-4.5Z" />
          <path {...props} d="M7 11v3.5c0 1.1 2.2 2.5 5 2.5s5-1.4 5-2.5V11" />
        </svg>
      )
    case 'people':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <circle {...props} cx="9" cy="9" r="2.8" />
          <circle {...props} cx="16.5" cy="10.5" r="2.3" />
          <path {...props} d="M4.8 18c.6-2.6 2.6-4 4.2-4s3.6 1.4 4.2 4" />
          <path {...props} d="M13.8 18c.4-1.8 1.8-2.8 3-2.8 1.4 0 2.6 1 3 2.8" />
        </svg>
      )
    case 'job':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <rect {...props} x="4" y="7" width="16" height="12" rx="2" />
          <path {...props} d="M9 7V5.7A1.7 1.7 0 0 1 10.7 4h2.6A1.7 1.7 0 0 1 15 5.7V7" />
          <path {...props} d="M4 12h16" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <circle {...props} cx="12" cy="12" r="8.5" />
          <path {...props} d="M12 7.5V12l3 2" />
        </svg>
      )
    case 'spark':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M12 3.8 13.8 9l5.2 1.8-5.2 1.8L12 17.8 10.2 12.6 5 10.8l5.2-1.8L12 3.8Z" />
        </svg>
      )
    case 'brief':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M4.5 7.5h15A1.5 1.5 0 0 1 21 9v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5V9a1.5 1.5 0 0 1 1.5-1.5Z" />
          <path {...props} d="M9 7.5V6A1.5 1.5 0 0 1 10.5 4.5h3A1.5 1.5 0 0 1 15 6v1.5" />
          <path {...props} d="M3 12h18" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <rect {...props} x="4" y="5.5" width="16" height="14" rx="2" />
          <path {...props} d="M8 3.8v3.4M16 3.8v3.4M4 9h16" />
        </svg>
      )
    case 'tag':
      return (
        <svg {...common}>
          {title ? <title>{title}</title> : null}
          <path {...props} d="M4.5 12.2V6.5A2.5 2.5 0 0 1 7 4h5.7a2.5 2.5 0 0 1 1.8.7l5.8 5.8a2.5 2.5 0 0 1 0 3.6l-5.1 5.1a2.5 2.5 0 0 1-3.6 0l-7.1-7.1a2.5 2.5 0 0 1-.7-1.8Z" />
          <circle {...props} cx="9" cy="9" r="1.2" />
        </svg>
      )
    default:
      return <svg {...common} />
  }
}

export function IconWrap({ children }: { children: ReactNode }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{children}</span>
}
