import * as Cesium from 'cesium'
import type { ClockConfig, ClockState, ViewerHandle } from './types'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function setClockConfig(handle: ViewerHandle, config: ClockConfig) {
  const { viewer } = handle
  viewer.clock.startTime = config.start.clone()
  viewer.clock.stopTime = config.stop.clone()
  viewer.clock.currentTime = (config.current ?? config.start).clone()
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP
  viewer.clock.multiplier = config.multiplier ?? viewer.clock.multiplier
  viewer.clock.shouldAnimate = config.shouldAnimate ?? viewer.clock.shouldAnimate

  handle.config.clock.start = config.start.clone()
  handle.config.clock.stop = config.stop.clone()
}

export function getClockState(handle: ViewerHandle): ClockState {
  const { viewer } = handle
  const start = handle.config.clock.start
  const stop = handle.config.clock.stop

  if (!start || !stop) {
    return {
      totalSeconds: 0,
      currentSeconds: 0,
      isPlaying: viewer.clock.shouldAnimate,
      multiplier: viewer.clock.multiplier,
    }
  }

  const totalSeconds = Cesium.JulianDate.secondsDifference(stop, start)
  const currentSeconds = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, start)

  return {
    totalSeconds,
    currentSeconds: clamp(currentSeconds, 0, totalSeconds),
    isPlaying: viewer.clock.shouldAnimate,
    multiplier: viewer.clock.multiplier,
  }
}

export function setPlaybackState(handle: ViewerHandle, isPlaying: boolean) {
  handle.viewer.clock.shouldAnimate = isPlaying
}

export function setSpeed(handle: ViewerHandle, multiplier: number) {
  handle.viewer.clock.multiplier = multiplier
}

export function seekTime(handle: ViewerHandle, secondsFromStart: number) {
  const start = handle.config.clock.start
  const stop = handle.config.clock.stop
  if (!start || !stop) {
    return
  }

  const totalSeconds = Cesium.JulianDate.secondsDifference(stop, start)
  const clampedSeconds = clamp(secondsFromStart, 0, totalSeconds)
  handle.viewer.clock.currentTime = Cesium.JulianDate.addSeconds(
    start,
    clampedSeconds,
    new Cesium.JulianDate(),
  )
  handle.viewer.scene.requestRender()
}

export function nudgeTime(handle: ViewerHandle, deltaSeconds: number) {
  const state = getClockState(handle)
  seekTime(handle, state.currentSeconds + deltaSeconds)
}
