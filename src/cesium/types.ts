import type { Entity, JulianDate, PostProcessStageComposite, Viewer } from 'cesium'

export type ViewerHandle = {
  viewer: Viewer
  entities: {
    demoEntity?: Entity
  }
  stages: {
    stylize?: PostProcessStageComposite | null
  }
  config: {
    clock: {
      start?: JulianDate
      stop?: JulianDate
    }
  }
}

export type ClockState = {
  totalSeconds: number
  currentSeconds: number
  isPlaying: boolean
  multiplier: number
}

export type ClockConfig = {
  start: JulianDate
  stop: JulianDate
  current?: JulianDate
  multiplier?: number
  shouldAnimate?: boolean
}

export type SceneMode = '3D' | '2D' | 'COLUMBUS'

export type StylizationConfig = {
  enabled: boolean
}
