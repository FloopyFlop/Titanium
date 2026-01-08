import type { CSSProperties } from 'react'
import { Panel } from '../components/Panel'

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

type ViewControlsProps = {
  disabled?: boolean
  showTimeControls: boolean
  showUtilityPanels: boolean
  onToggleTimeControls: () => void
  onToggleUtilityPanels: () => void
  className?: string
  style?: CSSProperties
}

export function ViewControls({
  disabled,
  showTimeControls,
  showUtilityPanels,
  onToggleTimeControls,
  onToggleUtilityPanels,
  className,
  style,
}: ViewControlsProps) {
  const buttonClass = (active: boolean) => cn('ti-segment', active && 'ti-segment--active')

  return (
    <Panel className={cn('flex items-center justify-between gap-3 px-4 py-3', className)} style={style}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={buttonClass(showTimeControls)}
          onClick={onToggleTimeControls}
          disabled={disabled}
          aria-pressed={showTimeControls}
        >
          Time
        </button>
        <button
          type="button"
          className={buttonClass(showUtilityPanels)}
          onClick={onToggleUtilityPanels}
          disabled={disabled}
          aria-pressed={showUtilityPanels}
        >
          Panels
        </button>
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">View</span>
    </Panel>
  )
}
