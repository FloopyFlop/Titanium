import * as Cesium from 'cesium'
import type { ClockConfig, ClockState, ViewerHandle } from './types'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

type TimelineMarkerData = {
  id?: string
  label?: string
  color?: string
  icon?: string
}

export type TimelineMarkerSeed = {
  id: string
  secondsFromStart: number
  label?: string
  color?: string
  icon?: string
}

export type TimelineMarkerRecord = TimelineMarkerSeed

const getMarkerCollection = (handle: ViewerHandle) => handle.config.timeline.markers

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

export function setTimelineMarkers(handle: ViewerHandle, markers: TimelineMarkerSeed[]) {
  const collection = getMarkerCollection(handle)
  collection.removeAll()
  markers.forEach((marker) => {
    addTimelineMarker(handle, marker)
  })
}

export function addTimelineMarker(handle: ViewerHandle, marker: TimelineMarkerSeed) {
  const start = handle.config.clock.start
  const stop = handle.config.clock.stop
  if (!start) {
    return
  }

  const totalSeconds = stop ? Cesium.JulianDate.secondsDifference(stop, start) : undefined
  const clampedSeconds =
    typeof totalSeconds === 'number' ? clamp(marker.secondsFromStart, 0, totalSeconds) : marker.secondsFromStart

  const time = Cesium.JulianDate.addSeconds(start, clampedSeconds, new Cesium.JulianDate())
  const interval = new Cesium.TimeInterval({
    start: time,
    stop: Cesium.JulianDate.addSeconds(time, 0.001, new Cesium.JulianDate()),
    isStartIncluded: true,
    isStopIncluded: true,
    data: {
      id: marker.id,
      label: marker.label,
      color: marker.color,
      icon: marker.icon,
    } satisfies TimelineMarkerData,
  })

  getMarkerCollection(handle).addInterval(interval)
}

export function getTimelineMarkers(handle: ViewerHandle): TimelineMarkerRecord[] {
  const start = handle.config.clock.start
  if (!start) {
    return []
  }

  const collection = getMarkerCollection(handle)
  const markers: TimelineMarkerRecord[] = []

  for (let index = 0; index < collection.length; index += 1) {
    const interval = collection.get(index)
    if (!interval) {
      continue
    }
    const data = (interval.data ?? {}) as TimelineMarkerData
    markers.push({
      id: data.id ?? `marker-${index + 1}`,
      secondsFromStart: Cesium.JulianDate.secondsDifference(interval.start, start),
      label: data.label,
      color: data.color,
      icon: data.icon,
    })
  }

  return markers
}
