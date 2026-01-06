import type { SVGProps } from 'react'

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function RewindIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <polygon points="11 6 3 12 11 18 11 6" fill="currentColor" stroke="none" />
      <polygon points="21 6 13 12 21 18 21 6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FastForwardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <polygon points="3 6 11 12 3 18 3 6" fill="currentColor" stroke="none" />
      <polygon points="13 6 21 12 13 18 13 6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function SkipStartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="5" width="2" height="14" rx="1" fill="currentColor" stroke="none" />
      <polygon points="19 6 9 12 19 18 19 6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function SkipEndIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="17" y="5" width="2" height="14" rx="1" fill="currentColor" stroke="none" />
      <polygon points="5 6 15 12 5 18 5 6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M6.5 10.5v7.5h11v-7.5" />
    </svg>
  )
}

export function NorthIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4l4 8h-8l4-8z" fill="currentColor" stroke="none" />
      <line x1="12" y1="12" x2="12" y2="20" />
      <path d="M9.5 20h5" />
    </svg>
  )
}

export function TargetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <line x1="12" y1="3" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21" />
      <line x1="3" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21" y2="12" />
    </svg>
  )
}
