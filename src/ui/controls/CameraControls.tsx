import type { CSSProperties } from 'react'
import { IconButton } from '../components/IconButton'
import { Panel } from '../components/Panel'
import { HomeIcon, NorthIcon, TargetIcon } from '../icons'

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

type CameraControlsProps = {
  disabled?: boolean
  isTracking: boolean
  onHome: () => void
  onResetNorth: () => void
  onToggleTrack: () => void
  className?: string
  style?: CSSProperties
}

export function CameraControls({
  disabled,
  isTracking,
  onHome,
  onResetNorth,
  onToggleTrack,
  className,
  style,
}: CameraControlsProps) {
  return (
    <Panel className={cn('flex items-center justify-between gap-3 px-4 py-3', className)} style={style}>
      <div className="flex items-center gap-2">
        <IconButton icon={<HomeIcon />} label="Home" onClick={onHome} disabled={disabled} />
        <IconButton
          icon={<NorthIcon />}
          label="Reset north/up"
          onClick={onResetNorth}
          disabled={disabled}
        />
        <IconButton
          icon={<TargetIcon />}
          label={isTracking ? 'Disable tracking' : 'Track entity'}
          onClick={onToggleTrack}
          tone={isTracking ? 'primary' : 'ghost'}
          disabled={disabled}
        />
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Camera</span>
    </Panel>
  )
}
