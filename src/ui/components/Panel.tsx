import type { CSSProperties, ReactNode } from 'react'

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

type PanelProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Panel({ children, className, style }: PanelProps) {
  return (
    <div className={cn('ti-panel', className)} style={style}>
      {children}
    </div>
  )
}
