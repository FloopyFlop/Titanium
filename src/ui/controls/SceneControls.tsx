import type { CSSProperties } from 'react'
import type { SceneMode } from '../../cesium'
import { Panel } from '../components/Panel'

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

type SceneControlsProps = {
  disabled?: boolean
  mode: SceneMode
  onModeChange: (mode: SceneMode) => void
  className?: string
  style?: CSSProperties
}

export function SceneControls({
  disabled,
  mode,
  onModeChange,
  className,
  style,
}: SceneControlsProps) {
  const makeButton = (value: SceneMode, label: string) => (
    <button
      type="button"
      className={cn('ti-segment', mode === value && 'ti-segment--active')}
      onClick={() => onModeChange(value)}
      disabled={disabled}
      aria-pressed={mode === value}
    >
      {label}
    </button>
  )

  return (
    <Panel className={cn('flex items-center justify-between gap-3 px-4 py-3', className)} style={style}>
      <div className="flex items-center gap-2">
        {makeButton('3D', '3D')}
        {makeButton('2D', '2D')}
        {makeButton('COLUMBUS', '2.5D')}
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Scene</span>
    </Panel>
  )
}
