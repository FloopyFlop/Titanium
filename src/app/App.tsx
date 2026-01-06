import { useCallback, useEffect, useRef, useState } from 'react'
import { AppShell } from './layout/AppShell'
import {
  destroyViewer,
  flyHome,
  getClockState,
  initializeViewer,
  loadDemoTrack,
  nudgeTime,
  seekTime,
  setPlaybackState,
  setSceneMode,
  setSpeed,
  setStylizationConfig,
  setTrackEntity,
  resetNorth,
} from '../cesium'
import type { ClockState, SceneMode, StylizationConfig, ViewerHandle } from '../cesium'
import { CameraControls } from '../ui/controls/CameraControls'
import { PlaybackControls } from '../ui/controls/PlaybackControls'
import { SceneControls } from '../ui/controls/SceneControls'
import { Timeline } from '../ui/controls/Timeline'
import { VisualControls } from '../ui/controls/VisualControls'

const TIME_NUDGE_SECONDS = 12

const emptyClock: ClockState = {
  totalSeconds: 0,
  currentSeconds: 0,
  isPlaying: false,
  multiplier: 1,
}

const defaultStylization: StylizationConfig = {
  enabled: true,
  edge: {
    enabled: true,
    threshold: 0.18,
  },
  toon: {
    enabled: true,
    intensity: 0.75,
  },
}

export default function App() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [viewerHandle, setViewerHandle] = useState<ViewerHandle | null>(null)
  const [clockState, setClockState] = useState<ClockState>(emptyClock)
  const [isTracking, setIsTracking] = useState(false)
  const [sceneMode, setSceneModeState] = useState<SceneMode>('3D')
  const [stylization, setStylization] = useState<StylizationConfig>(defaultStylization)

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

  useEffect(() => {
    if (!viewerHandle) {
      return
    }
    setStylizationConfig(viewerHandle, stylization)
  }, [viewerHandle, stylization])

  const controlsDisabled = !viewerHandle || clockState.totalSeconds === 0

  return (
    <AppShell viewerRef={viewerRef}>
      <div className="pointer-events-auto absolute left-6 top-6">
        <div className="ti-panel px-4 py-3 ti-animate-rise" style={{ animationDelay: '80ms' }}>
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Titanium</div>
          <div className="mt-1 text-lg font-display text-white">
            A sleek UI + visual layer for Cesium.js
          </div>
        </div>
      </div>

      <div className="pointer-events-auto absolute bottom-6 left-6 right-6 flex flex-col gap-3 sm:right-auto sm:w-[360px]">
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
          onTogglePlay={() => {
            if (!viewerHandle) {
              return
            }
            setPlaybackState(viewerHandle, !clockState.isPlaying)
            syncClock()
          }}
          onJumpStart={() => viewerHandle && seekTime(viewerHandle, 0)}
          onJumpEnd={() => viewerHandle && seekTime(viewerHandle, clockState.totalSeconds || 0)}
          onNudgeBackward={() => viewerHandle && nudgeTime(viewerHandle, -TIME_NUDGE_SECONDS)}
          onNudgeForward={() => viewerHandle && nudgeTime(viewerHandle, TIME_NUDGE_SECONDS)}
          onSpeedChange={(value) => {
            if (!viewerHandle) {
              return
            }
            setSpeed(viewerHandle, value)
            syncClock()
          }}
          className="ti-animate-rise"
          style={{ animationDelay: '210ms' }}
        />
        <CameraControls
          disabled={controlsDisabled}
          isTracking={isTracking}
          onHome={() => viewerHandle && flyHome(viewerHandle)}
          onResetNorth={() => viewerHandle && resetNorth(viewerHandle)}
          onToggleTrack={() => {
            if (!viewerHandle) {
              return
            }
            const next = !isTracking
            setIsTracking(next)
            setTrackEntity(viewerHandle, next)
          }}
          className="ti-animate-rise"
          style={{ animationDelay: '280ms' }}
        />
        <SceneControls
          disabled={controlsDisabled}
          mode={sceneMode}
          onModeChange={(mode) => {
            if (!viewerHandle) {
              return
            }
            if (mode !== '3D' && isTracking) {
              setIsTracking(false)
              setTrackEntity(viewerHandle, false)
            }
            setSceneModeState(mode)
            setSceneMode(viewerHandle, mode)
          }}
          className="ti-animate-rise"
          style={{ animationDelay: '350ms' }}
        />
        <VisualControls
          disabled={controlsDisabled}
          config={stylization}
          onChange={setStylization}
          className="ti-animate-rise"
          style={{ animationDelay: '430ms' }}
        />
      </div>
    </AppShell>
  )
}
