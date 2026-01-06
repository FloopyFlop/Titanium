import type { CSSProperties } from 'react'
import { Panel } from '../components/Panel'

const formatTime = (seconds: number) => {
  const total = Math.max(0, Math.floor(seconds))
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const pad = (value: number) => value.toString().padStart(2, '0')

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`
  }

  return `${pad(mins)}:${pad(secs)}`
}

type TimelineProps = {
  disabled?: boolean
  currentSeconds: number
  totalSeconds: number
  onScrub: (seconds: number) => void
  className?: string
  style?: CSSProperties
}

export function Timeline({
  disabled,
  currentSeconds,
  totalSeconds,
  onScrub,
  className,
  style,
}: TimelineProps) {
  const safeTotal = Number.isFinite(totalSeconds) && totalSeconds > 0 ? totalSeconds : 0
  const safeCurrent = Number.isFinite(currentSeconds) ? currentSeconds : 0

  return (
    <Panel className={`flex flex-col gap-2 px-4 py-3 ${className ?? ''}`} style={style}>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
        <span>Timeline</span>
        <span className="font-medium text-white/70">
          {formatTime(safeCurrent)} / {formatTime(safeTotal)}
        </span>
      </div>
      <input
        className="ti-range"
        type="range"
        min={0}
        max={safeTotal}
        step={0.5}
        value={Math.min(safeCurrent, safeTotal)}
        onChange={(event) => onScrub(Number(event.target.value))}
        disabled={disabled || safeTotal === 0}
      />
    </Panel>
  )
}
