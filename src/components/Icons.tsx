import type { SVGProps } from 'react'

export type IconName =
  | 'check'
  | 'checkCircle'
  | 'arrowRight'
  | 'arrowLeft'
  | 'home'
  | 'map'
  | 'bulb'
  | 'warning'
  | 'book'
  | 'star'
  | 'trophy'
  | 'target'
  | 'sparkle'
  | 'refresh'
  | 'volume'
  | 'close'
  | 'menu'
  | 'print'
  | 'flame'
  | 'user'
  | 'logout'
  | 'login'
  | 'eye'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
}

export function Icon({ name, className = 'h-5 w-5', ...rest }: IconProps) {
  const common: SVGProps<SVGSVGElement> = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...rest,
  }

  switch (name) {
    case 'check':
      return (
        <svg {...common}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )
    case 'checkCircle':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
      )
    case 'arrowRight':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      )
    case 'arrowLeft':
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="M11 18l-6-6 6-6" />
        </svg>
      )
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
      )
    case 'map':
      return (
        <svg {...common}>
          <path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z" />
          <path d="M9 4v13M15 6.5v13" />
        </svg>
      )
    case 'bulb':
      return (
        <svg {...common}>
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M12 3a6 6 0 00-4 10.5c.8.7 1 1.3 1 2.5h6c0-1.2.2-1.8 1-2.5A6 6 0 0012 3z" />
        </svg>
      )
    case 'warning':
      return (
        <svg {...common}>
          <path d="M10.3 3.9L2.5 17a2 2 0 001.7 3h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      )
    case 'book':
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5V5.5z" />
          <path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5A2.5 2.5 0 014 20.5z" />
        </svg>
      )
    case 'star':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.44 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95L12 2.6z" />
        </svg>
      )
    case 'trophy':
      return (
        <svg {...common}>
          <path d="M8 4h8v4a4 4 0 01-8 0V4z" />
          <path d="M8 5H5v1a3 3 0 003 3M16 5h3v1a3 3 0 01-3 3" />
          <path d="M12 12v4M9 20h6M10 20v-2h4v2" />
        </svg>
      )
    case 'target':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 2l1.6 5.2L18.8 9l-5.2 1.8L12 16l-1.6-5.2L5.2 9l5.2-1.8L12 2zM19 14l.9 2.6L22 17.5l-2.1.9L19 21l-.9-2.6L16 17.5l2.1-.9L19 14z" />
        </svg>
      )
    case 'refresh':
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 11-2.6-6.4" />
          <path d="M21 4v4h-4" />
        </svg>
      )
    case 'volume':
      return (
        <svg {...common}>
          <path d="M11 5L6 9H3v6h3l5 4V5z" />
          <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
        </svg>
      )
    case 'close':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      )
    case 'menu':
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      )
    case 'print':
      return (
        <svg {...common}>
          <path d="M6 9V3h12v6" />
          <path d="M6 18H4v-5a2 2 0 012-2h12a2 2 0 012 2v5h-2" />
          <rect x="6" y="14" width="12" height="7" rx="1" />
        </svg>
      )
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 3c.5 3.5-2.5 5-2.5 8a3.5 3.5 0 007 0c0-2.5-1.5-4.5-1.5-4.5s3 1.5 3 5.5a6 6 0 11-12 0c0-4 3-7 6-9z" />
        </svg>
      )
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
        </svg>
      )
    case 'logout':
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <path d="M16 17l5-5-5-5M21 12H9" />
        </svg>
      )
    case 'login':
      return (
        <svg {...common}>
          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
          <path d="M10 17l5-5-5-5M15 12H3" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...common}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      )
    default:
      return null
  }
}
