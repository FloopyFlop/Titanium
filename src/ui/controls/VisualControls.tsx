import type { CSSProperties } from 'react'
import type { StylizationConfig } from '../../cesium'
import { Panel } from '../components/Panel'

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

type VisualControlsProps = {
  disabled?: boolean
  config: StylizationConfig
  onChange: (config: StylizationConfig) => void
  className?: string
  style?: CSSProperties
}

type ToggleButtonProps = {
  label: string
  checked: boolean
  disabled?: boolean
  onToggle: () => void
}

function ToggleButton({ label, checked, disabled, onToggle }: ToggleButtonProps) {
  return (
    <button
      type="button"
      className={cn('ti-toggle-btn', checked && 'ti-toggle-btn--on', disabled && 'ti-toggle-btn--off')}
      onClick={onToggle}
      aria-pressed={checked}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export function VisualControls({ disabled, config, onChange, className, style }: VisualControlsProps) {
  const edgeDisabled = disabled || !config.enabled
  const toonDisabled = disabled || !config.enabled

  return (
    <Panel className={cn('flex flex-col gap-3 px-4 py-3', className)} style={style}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Visuals</span>
        <ToggleButton
          label={config.enabled ? 'Stylize' : 'Neutral'}
          checked={config.enabled}
          disabled={disabled}
          onToggle={() => onChange({ ...config, enabled: !config.enabled })}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <ToggleButton
          label="Edges"
          checked={config.edge.enabled}
          disabled={edgeDisabled}
          onToggle={() =>
            onChange({
              ...config,
              edge: { ...config.edge, enabled: !config.edge.enabled },
            })
          }
        />
        <ToggleButton
          label="Toon"
          checked={config.toon.enabled}
          disabled={toonDisabled}
          onToggle={() =>
            onChange({
              ...config,
              toon: { ...config.toon, enabled: !config.toon.enabled },
            })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Edge threshold</span>
          <span>{Math.round(config.edge.threshold * 100)}</span>
        </div>
        <input
          className="ti-range"
          type="range"
          min={0.05}
          max={0.5}
          step={0.01}
          value={config.edge.threshold}
          onChange={(event) =>
            onChange({
              ...config,
              edge: { ...config.edge, threshold: Number(event.target.value) },
            })
          }
          disabled={edgeDisabled || !config.edge.enabled}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Toon intensity</span>
          <span>{Math.round(config.toon.intensity * 100)}</span>
        </div>
        <input
          className="ti-range"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={config.toon.intensity}
          onChange={(event) =>
            onChange({
              ...config,
              toon: { ...config.toon, intensity: Number(event.target.value) },
            })
          }
          disabled={toonDisabled || !config.toon.enabled}
        />
      </div>
    </Panel>
  )
}
