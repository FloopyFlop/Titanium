import { useCallback, useEffect, useRef, useState } from 'react'
import { AppShell } from './layout/AppShell'
import {
  destroyViewer,
  getClockState,
  initializeViewer,
  loadDemoTrack,
  nudgeTime,
  seekTime,
  setPlaybackState,
  setSpeed,
  setTrackEntity,
} from '../cesium'
import type { ClockState, ViewerHandle } from '../cesium'
import { PlaybackControls } from '../ui/controls/PlaybackControls'
import { Timeline } from '../ui/controls/Timeline'

const TIME_NUDGE_SECONDS = 12

const emptyClock: ClockState = {
  totalSeconds: 0,
  currentSeconds: 0,
  isPlaying: false,
  multiplier: 1,
}

export default function App() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [viewerHandle, setViewerHandle] = useState<ViewerHandle | null>(null)
  const [clockState, setClockState] = useState<ClockState>(emptyClock)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if (!viewerRef.current) {
      return
    }

    const handle = initializeViewer(viewerRef.current)
    loadDemoTrack(handle)
    setClockState(getClockState(handle))
    setViewerHandle(handle)

    return () => {
      destroyViewer(handle)
    }
  }, [])

  const syncClock = useCallback(() => {
    if (!viewerHandle) {
      return
    }
    setClockState(getClockState(viewerHandle))
  }, [viewerHandle])

  useEffect(() => {
    if (!viewerHandle) {
      return
    }

    syncClock()
    const interval = window.setInterval(syncClock, 200)
    return () => window.clearInterval(interval)
  }, [viewerHandle, syncClock])

  const controlsDisabled = !viewerHandle || clockState.totalSeconds === 0

  return (
    <AppShell viewerRef={viewerRef}>
      <div className="flex items-start justify-between p-6">
        <div className="pointer-events-auto">
          <div className="ti-panel px-4 py-3 ti-animate-rise" style={{ animationDelay: '80ms' }}>
            <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Titanium</div>
            <div className="mt-1 text-lg font-display text-white">
              A sleek UI + visual layer for Cesium.js
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="pointer-events-auto w-full px-6 pb-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          <Timeline
            disabled={controlsDisabled}
            currentSeconds={clockState.currentSeconds}
            totalSeconds={clockState.totalSeconds}
            onScrub={(seconds) => viewerHandle && seekTime(viewerHandle, seconds)}
            className="ti-animate-rise"
            style={{ animationDelay: '140ms' }}
          />
          <PlaybackControls
            disabled={controlsDisabled}
            isPlaying={clockState.isPlaying}
            speed={clockState.multiplier}
            isTracking={isTracking}
            onTogglePlay={() => {
              if (!viewerHandle) {
                return
              }
              setPlaybackState(viewerHandle, !clockState.isPlaying)
              syncClock()
            }}
            onJumpStart={() => viewerHandle && seekTime(viewerHandle, 0)}
            onJumpEnd={() =>
              viewerHandle && seekTime(viewerHandle, clockState.totalSeconds || 0)
            }
            onNudgeBackward={() => viewerHandle && nudgeTime(viewerHandle, -TIME_NUDGE_SECONDS)}
            onNudgeForward={() => viewerHandle && nudgeTime(viewerHandle, TIME_NUDGE_SECONDS)}
            onSpeedChange={(value) => {
              if (!viewerHandle) {
                return
              }
              setSpeed(viewerHandle, value)
              syncClock()
            }}
            onToggleTrack={() => {
              if (!viewerHandle) {
                return
              }
              const next = !isTracking
              setIsTracking(next)
              setTrackEntity(viewerHandle, next)
            }}
            className="ti-animate-rise"
            style={{ animationDelay: '220ms' }}
          />
        </div>
      </div>
    </AppShell>
  )
}
