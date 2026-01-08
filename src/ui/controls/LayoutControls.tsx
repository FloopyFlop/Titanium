import type { CSSProperties } from 'react'
import type { TimelineDock } from './Timeline'
import { Panel } from '../components/Panel'

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const DOCK_OPTIONS: Array<{ value: TimelineDock; label: string }> = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'top', label: 'Top' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
]

type LayoutControlsProps = {
  disabled?: boolean
  dock: TimelineDock
  onDockChange: (dock: TimelineDock) => void
  className?: string
  style?: CSSProperties
}

export function LayoutControls({
  disabled,
  dock,
  onDockChange,
  className,
  style,
}: LayoutControlsProps) {
  return (
    <Panel className={cn('flex items-center justify-between gap-3 px-4 py-3', className)} style={style}>
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Dock</span>
        <select
          className="ti-select text-xs"
          value={dock}
          onChange={(event) => onDockChange(event.target.value as TimelineDock)}
          disabled={disabled}
        >
          {DOCK_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </Panel>
  )
}
