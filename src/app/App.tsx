import { useCallback, useEffect, useRef, useState } from 'react'
import { AppShell } from './layout/AppShell'
import {
  addTimelineMarker,
  destroyViewer,
  flyHome,
  getClockState,
  getTimelineMarkers,
  initializeViewer,
  loadDemoTrack,
  nudgeTime,
  seekTime,
  setEnemyPalette,
  setPlaybackState,
  setSceneMode,
  setSpeed,
  setStylizationConfig,
  setTimelineMarkers,
  setTrackEntity,
  resetNorth,
} from '../cesium'
import type {
  ClockState,
  EnemyPaletteKey,
  SceneMode,
  StylizationConfig,
  TimelineMarkerRecord,
  TimelineMarkerSeed,
  ViewerHandle,
} from '../cesium'
import { CameraControls } from '../ui/controls/CameraControls'
import { LayoutControls } from '../ui/controls/LayoutControls'
import { PlaybackControls } from '../ui/controls/PlaybackControls'
import { SceneControls } from '../ui/controls/SceneControls'
import { Timeline, type TimelineDock, type TimelineMarker, type TimelineMarkerIcon } from '../ui/controls/Timeline'
import { ViewControls } from '../ui/controls/ViewControls'
import { VisualControls } from '../ui/controls/VisualControls'

const TIME_NUDGE_SECONDS = 12
const UI_EDGE = 24
const TIMELINE_BAR_HEIGHT = 72
const TIMELINE_SIDE_WIDTH = 140
const TIMELINE_GUTTER = 16

type MarkerSpec = {
  label: string
  ratio: number
  icon: TimelineMarkerIcon
  color: string
}

const DEFAULT_MARKER_SPECS: MarkerSpec[] = [
  { label: 'LAUNCH', ratio: 0.12, icon: 'missile', color: '#ff7a59' },
  { label: 'RADAR', ratio: 0.24, icon: 'radar', color: '#6bdcff' },
  { label: 'INTERCEPT', ratio: 0.46, icon: 'burst', color: '#ffd166' },
  { label: 'FLEET', ratio: 0.64, icon: 'ship', color: '#9ad1ff' },
  { label: 'IMPACT', ratio: 0.82, icon: 'flag', color: '#ff4d66' },
]

const MARKER_PALETTE: Array<Pick<MarkerSpec, 'icon' | 'color'>> = [
  { icon: 'missile', color: '#ff7a59' },
  { icon: 'radar', color: '#6bdcff' },
  { icon: 'burst', color: '#ffd166' },
  { icon: 'ship', color: '#9ad1ff' },
  { icon: 'flag', color: '#ff4d66' },
]

const createDefaultMarkerSeeds = (totalSeconds: number): TimelineMarkerSeed[] => {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return []
  }

  return DEFAULT_MARKER_SPECS.map((spec, index) => {
    const clampedRatio = Math.min(Math.max(spec.ratio, 0), 1)
    const secondsFromStart = Math.min(totalSeconds, Math.round(totalSeconds * clampedRatio))
    return {
      id: `default-${index}`,
      secondsFromStart,
      label: spec.label,
      color: spec.color,
      icon: spec.icon,
    }
  })
}

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
    intensity: 0,
  },
}

export default function App() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [viewerHandle, setViewerHandle] = useState<ViewerHandle | null>(null)
  const [clockState, setClockState] = useState<ClockState>(emptyClock)
  const [isTracking, setIsTracking] = useState(false)
  const [sceneMode, setSceneModeState] = useState<SceneMode>('3D')
  const [stylization, setStylization] = useState<StylizationConfig>(defaultStylization)
  const [enemyPalette, setEnemyPaletteState] = useState<EnemyPaletteKey>('red')
  const [showUtilityPanels, setShowUtilityPanels] = useState(true)
  const [showTimeControls, setShowTimeControls] = useState(true)
  const [timelineDock, setTimelineDock] = useState<TimelineDock>('bottom')
  const [timelineMarkers, setTimelineMarkersState] = useState<TimelineMarker[]>([])

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

  useEffect(() => {
    if (!viewerHandle) {
      return
    }
    setEnemyPalette(viewerHandle, enemyPalette)
  }, [viewerHandle, enemyPalette])

  const toUiMarkers = useCallback(
    (markers: TimelineMarkerRecord[]): TimelineMarker[] =>
      markers.map((marker) => ({
        id: marker.id,
        time: marker.secondsFromStart,
        label: marker.label ?? marker.id,
        color: marker.color ?? '#7ce7ff',
        icon: marker.icon as TimelineMarkerIcon | undefined,
      })),
    [],
  )

  const syncMarkersFromCesium = useCallback(() => {
    if (!viewerHandle) {
      return
    }
    setTimelineMarkersState(toUiMarkers(getTimelineMarkers(viewerHandle)))
  }, [toUiMarkers, viewerHandle])

  useEffect(() => {
    if (!viewerHandle) {
      return
    }
    const collection = viewerHandle.config.timeline.markers
    const handleChange = () => syncMarkersFromCesium()
    collection.changedEvent.addEventListener(handleChange)
    return () => {
      collection.changedEvent.removeEventListener(handleChange)
    }
  }, [syncMarkersFromCesium, viewerHandle])

  useEffect(() => {
    if (!viewerHandle || clockState.totalSeconds <= 0) {
      return
    }
    const existing = getTimelineMarkers(viewerHandle)
    if (existing.length === 0) {
      setTimelineMarkers(viewerHandle, createDefaultMarkerSeeds(clockState.totalSeconds))
    }
    syncMarkersFromCesium()
  }, [clockState.totalSeconds, syncMarkersFromCesium, viewerHandle])

  const handleAddMarker = useCallback(
    (time: number) => {
      if (!viewerHandle) {
        return
      }
      const nextIndex = timelineMarkers.length + 1
      const palette = MARKER_PALETTE[(nextIndex - 1) % MARKER_PALETTE.length]
      const label = `EVENT-${String(nextIndex).padStart(2, '0')}`
      addTimelineMarker(viewerHandle, {
        id: `marker-${nextIndex}`,
        secondsFromStart: time,
        label,
        color: palette.color,
        icon: palette.icon,
      })
      syncMarkersFromCesium()
    },
    [syncMarkersFromCesium, timelineMarkers.length, viewerHandle],
  )

  const controlsDisabled = !viewerHandle || clockState.totalSeconds === 0
  const leftOffset = UI_EDGE + (showTimeControls && timelineDock === 'left' ? TIMELINE_SIDE_WIDTH + TIMELINE_GUTTER : 0)
  const topOffset = UI_EDGE + (showTimeControls && timelineDock === 'top' ? TIMELINE_BAR_HEIGHT + TIMELINE_GUTTER : 0)
  const bottomOffset =
    UI_EDGE + (showTimeControls && timelineDock === 'bottom' ? TIMELINE_BAR_HEIGHT + TIMELINE_GUTTER : 0)

  return (
    <AppShell viewerRef={viewerRef}>
      <div className="pointer-events-auto absolute left-6 top-6" style={{ left: leftOffset, top: topOffset }}>
        <div className="ti-panel px-4 py-3 ti-animate-rise" style={{ animationDelay: '80ms' }}>
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Titanium</div>
          <div className="mt-1 text-lg font-display text-white">
            A sleek UI + visual layer for Cesium.js
          </div>
        </div>
      </div>

      {showTimeControls && (
        <Timeline
          disabled={controlsDisabled}
          currentSeconds={clockState.currentSeconds}
          totalSeconds={clockState.totalSeconds}
          onScrub={(seconds) => viewerHandle && seekTime(viewerHandle, seconds)}
          dock={timelineDock}
          markers={timelineMarkers}
          onAddMarker={handleAddMarker}
          className="ti-animate-rise"
          style={{ animationDelay: '140ms' }}
        />
      )}

      <div
        className="pointer-events-auto absolute bottom-6 left-6 right-6 flex flex-col gap-3 sm:right-auto sm:w-[360px]"
        style={{ left: leftOffset, bottom: bottomOffset }}
      >
        <ViewControls
          disabled={!viewerHandle}
          showTimeControls={showTimeControls}
          showUtilityPanels={showUtilityPanels}
          onToggleTimeControls={() => setShowTimeControls((prev) => !prev)}
          onToggleUtilityPanels={() => setShowUtilityPanels((prev) => !prev)}
          className="ti-animate-rise"
          style={{ animationDelay: '110ms' }}
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
          showSpeed={showTimeControls}
          className="ti-animate-rise"
          style={{ animationDelay: '210ms' }}
        />
        {showUtilityPanels && (
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
        )}
        {showUtilityPanels && (
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
        )}
        {showUtilityPanels && (
          <LayoutControls
            disabled={!viewerHandle}
            dock={timelineDock}
            onDockChange={setTimelineDock}
            className="ti-animate-rise"
            style={{ animationDelay: '390ms' }}
          />
        )}
        {showUtilityPanels && (
          <VisualControls
            disabled={controlsDisabled}
            config={stylization}
            onChange={setStylization}
            enemyPalette={enemyPalette}
            onEnemyPaletteChange={setEnemyPaletteState}
            className="ti-animate-rise"
            style={{ animationDelay: '430ms' }}
          />
        )}
      </div>
    </AppShell>
  )
}
