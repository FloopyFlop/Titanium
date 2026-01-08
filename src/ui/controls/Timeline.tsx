import type { CSSProperties } from 'react'
import { IconButton } from '../components/IconButton'
import { Panel } from '../components/Panel'
import { PlusIcon } from '../icons'

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export type TimelineDock = 'top' | 'bottom' | 'left' | 'right'

export type TimelineMarkerIcon = 'burst' | 'missile' | 'radar' | 'ship' | 'flag'

export type TimelineMarker = {
  id: string
  time: number
  label: string
  color: string
  icon?: TimelineMarkerIcon
}

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

const markerIcons: Record<TimelineMarkerIcon, JSX.Element> = {
  burst: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" fill="currentColor" />
    </svg>
  ),
  missile: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 19l5-5" />
      <path d="M13 3l8 8-6 2-4 4-2 6-8-8 4-2 4-4 2-6z" fill="currentColor" />
    </svg>
  ),
  radar: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <path d="M12 6a6 6 0 0 1 6 6" />
      <path d="M12 12l6-6" />
    </svg>
  ),
  ship: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 17l9 4 9-4" />
      <path d="M5 15l7 3 7-3" />
      <path d="M7 8h10l2 6H5l2-6z" fill="currentColor" />
    </svg>
  ),
  flag: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 21V4" />
      <path d="M5 4h11l-2.5 3L16 10H5" fill="currentColor" />
    </svg>
  ),
}

type TimelineProps = {
  disabled?: boolean
  currentSeconds: number
  totalSeconds: number
  onScrub: (seconds: number) => void
  dock?: TimelineDock
  markers?: TimelineMarker[]
  onAddMarker?: (time: number) => void
  className?: string
  style?: CSSProperties
}

export function Timeline({
  disabled,
  currentSeconds,
  totalSeconds,
  onScrub,
  dock = 'bottom',
  markers = [],
  onAddMarker,
  className,
  style,
}: TimelineProps) {
  const safeTotal = Number.isFinite(totalSeconds) && totalSeconds > 0 ? totalSeconds : 0
  const safeCurrent = Number.isFinite(currentSeconds) ? currentSeconds : 0
  const isVertical = dock === 'left' || dock === 'right'

  const wrapperClass = cn(
    'pointer-events-auto absolute',
    dock === 'bottom' && 'bottom-6 left-6 right-6',
    dock === 'top' && 'top-6 left-6 right-6',
    dock === 'left' && 'left-6 top-1/2 h-[320px] w-[140px] -translate-y-1/2',
    dock === 'right' && 'right-6 top-1/2 h-[320px] w-[140px] -translate-y-1/2',
    className,
  )

  return (
    <div className={wrapperClass} style={style}>
      <Panel
        className={cn(
          'flex items-center gap-3 px-3 py-2',
          isVertical && 'h-full flex-col items-center justify-between gap-2 px-3 py-3',
        )}
      >
        {!isVertical && (
          <span className="text-[10px] text-white/50 tabular-nums">
            {formatTime(safeCurrent)} / {formatTime(safeTotal)}
          </span>
        )}

        <div className={cn('relative flex-1', isVertical ? 'w-6' : 'h-6')}>
          <div className="absolute inset-0 flex items-center justify-center">
            <input
              className={cn('ti-range', isVertical && 'ti-range-vertical')}
              type="range"
              min={0}
              max={safeTotal}
              step={0.5}
              value={Math.min(safeCurrent, safeTotal)}
              onChange={(event) => onScrub(Number(event.target.value))}
              disabled={disabled || safeTotal === 0}
            />
          </div>
          {markers.map((marker) => {
            const ratio = safeTotal > 0 ? Math.min(Math.max(marker.time / safeTotal, 0), 1) : 0
            const positionStyle = isVertical
              ? { bottom: `${ratio * 100}%`, left: '50%' }
              : { left: `${ratio * 100}%`, top: '50%' }
            const icon = marker.icon ? markerIcons[marker.icon] : null

            return (
              <div
                key={marker.id}
                className="group absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(124,231,255,0.5)] bg-[rgba(124,231,255,0.2)] shadow-panel"
                style={positionStyle}
                aria-label={marker.label}
              >
                <span className="text-[9px] text-white/90">{icon}</span>
                <span
                  className={cn(
                    'pointer-events-none absolute whitespace-nowrap rounded-md border border-white/10 bg-titanium-950/90 px-2 py-1 text-[10px] text-white/70 opacity-0 shadow-panel transition',
                    isVertical
                      ? 'left-full top-1/2 ml-2 -translate-y-1/2 group-hover:opacity-100'
                      : 'bottom-full left-1/2 mb-2 -translate-x-1/2 group-hover:opacity-100',
                  )}
                >
                  {marker.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className={cn('flex items-center gap-2', isVertical && 'flex-col')}>
          {isVertical && (
            <span className="text-[10px] text-white/50 tabular-nums">
              {formatTime(safeCurrent)}
            </span>
          )}
          <IconButton
            icon={<PlusIcon />}
            label="Add marker"
            onClick={() => onAddMarker?.(safeCurrent)}
            disabled={disabled || safeTotal === 0 || !onAddMarker}
            className="h-7 w-7"
          />
          {isVertical && (
            <span className="text-[10px] text-white/40 tabular-nums">
              {formatTime(safeTotal)}
            </span>
          )}
        </div>
      </Panel>
    </div>
  )
}
