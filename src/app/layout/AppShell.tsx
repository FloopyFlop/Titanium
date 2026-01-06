import type { ReactNode, RefObject } from 'react'

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

type AppShellProps = {
  viewerRef: RefObject<HTMLDivElement>
  children: ReactNode
  className?: string
}

export function AppShell({ viewerRef, children, className }: AppShellProps) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden bg-titanium-950 text-white', className)}>
      <div ref={viewerRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 flex flex-col">{children}</div>
    </div>
  )
}
