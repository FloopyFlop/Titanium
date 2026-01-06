import type { CSSProperties } from 'react'
import { IconButton } from '../components/IconButton'
import { Panel } from '../components/Panel'
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon, SkipEndIcon, SkipStartIcon } from '../icons'

const SPEED_OPTIONS = [0.5, 1, 2, 5, 10, 20]

type PlaybackControlsProps = {
  disabled?: boolean
  isPlaying: boolean
  speed: number
  onTogglePlay: () => void
  onJumpStart: () => void
  onJumpEnd: () => void
  onNudgeBackward: () => void
  onNudgeForward: () => void
  onSpeedChange: (value: number) => void
  className?: string
  style?: CSSProperties
}

export function PlaybackControls({
  disabled,
  isPlaying,
  speed,
  onTogglePlay,
  onJumpStart,
  onJumpEnd,
  onNudgeBackward,
  onNudgeForward,
  onSpeedChange,
  className,
  style,
}: PlaybackControlsProps) {
  return (
    <Panel className={`flex flex-wrap items-center gap-3 px-4 py-3 ${className ?? ''}`} style={style}>
      <div className="flex items-center gap-2">
        <IconButton
          icon={<SkipStartIcon />}
          label="Jump to start"
          onClick={onJumpStart}
          disabled={disabled}
        />
        <IconButton
          icon={<RewindIcon />}
          label="Rewind"
          onClick={onNudgeBackward}
          disabled={disabled}
        />
        <IconButton
          icon={isPlaying ? <PauseIcon /> : <PlayIcon />}
          label={isPlaying ? 'Pause' : 'Play'}
          onClick={onTogglePlay}
          tone="primary"
          disabled={disabled}
        />
        <IconButton
          icon={<FastForwardIcon />}
          label="Fast-forward"
          onClick={onNudgeForward}
          disabled={disabled}
        />
        <IconButton
          icon={<SkipEndIcon />}
          label="Jump to end"
          onClick={onJumpEnd}
          disabled={disabled}
        />
      </div>

      <div className="h-6 w-px bg-white/10" />

      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Speed</span>
        <select
          className="ti-select"
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          disabled={disabled}
        >
          {SPEED_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}x
            </option>
          ))}
        </select>
      </div>
    </Panel>
  )
}
