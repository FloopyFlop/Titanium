import * as Cesium from 'cesium'
import type { ViewerHandle } from './types'
import { setClockConfig } from './timeline'

type RoutePoint = {
  seconds: number
  lat: number
  lon: number
  alt: number
}

const LEAD_ROUTE: RoutePoint[] = [
  { seconds: 0, lat: 25.033, lon: 121.5654, alt: 2300 },
  { seconds: 70, lat: 25.061, lon: 121.57, alt: 2600 },
  { seconds: 140, lat: 25.076, lon: 121.52, alt: 2500 },
  { seconds: 210, lat: 25.046, lon: 121.48, alt: 2400 },
  { seconds: 280, lat: 25.012, lon: 121.505, alt: 2200 },
  { seconds: 350, lat: 25.015, lon: 121.58, alt: 2400 },
  { seconds: 430, lat: 25.06, lon: 121.62, alt: 2700 },
  { seconds: 520, lat: 25.075, lon: 121.59, alt: 2500 },
  { seconds: 600, lat: 25.033, lon: 121.5654, alt: 2300 },
]

const WING_ROUTE: RoutePoint[] = LEAD_ROUTE.map((point, index) => ({
  seconds: point.seconds + 12,
  lat: point.lat - 0.032 + Math.sin(index) * 0.004,
  lon: point.lon + 0.028 + Math.cos(index) * 0.004,
  alt: Math.max(point.alt - 260, 1200),
}))

const BASE_STATION = {
  lat: 25.033,
  lon: 121.5654,
  alt: 0,
}

const SIGNAL_NODES = [
  { lat: 25.052, lon: 121.52, alt: 0, label: 'NODE-01' },
  { lat: 25.023, lon: 121.49, alt: 0, label: 'NODE-02' },
  { lat: 25.072, lon: 121.59, alt: 0, label: 'NODE-03' },
]

const leadMarkerColor = '#7ce7ff'
const wingMarkerColor = '#7a5cff'
const leadColor = Cesium.Color.fromCssColorString(leadMarkerColor)
const wingColor = Cesium.Color.fromCssColorString(wingMarkerColor)
const nodeColor = Cesium.Color.fromCssColorString('#f6d365')
const markerStroke = '#0b111b'

const buildPositionProperty = (route: RoutePoint[], start: Cesium.JulianDate) => {
  const position = new Cesium.SampledPositionProperty()

  route.forEach((point) => {
    const time = Cesium.JulianDate.addSeconds(start, point.seconds, new Cesium.JulianDate())
    const cartesian = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.alt)
    position.addSample(time, cartesian)
  })

  position.setInterpolationOptions({
    interpolationDegree: 2,
    interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
  })

  return position
}

const getRouteEnd = (route: RoutePoint[]) => route[route.length - 1]?.seconds ?? 0

export function loadDemoTrack(handle: ViewerHandle) {
  const start = Cesium.JulianDate.now()
  const totalSeconds = Math.max(getRouteEnd(LEAD_ROUTE), getRouteEnd(WING_ROUTE))
  const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate())

  const leadPosition = buildPositionProperty(LEAD_ROUTE, start)
  const wingPosition = buildPositionProperty(WING_ROUTE, start)

  const availability = new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({
      start,
      stop,
    }),
  ])

  const lead = handle.viewer.entities.add({
    id: 'titanium-lead',
    availability,
    position: leadPosition,
    orientation: new Cesium.VelocityOrientationProperty(leadPosition),
    label: {
      text: 'A1 | ATLAS-01',
      font: '13px "Space Grotesk"',
      fillColor: leadColor,
      outlineColor: Cesium.Color.fromCssColorString('#0b111b'),
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(8, -14),
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      showBackground: true,
      backgroundColor: Cesium.Color.fromCssColorString('#0b111b').withAlpha(0.55),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000000),
      scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 2000000, 0.7),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.45,
        color: leadColor,
      }),
      width: 4,
      leadTime: 0,
      trailTime: 220,
    },
  })

  handle.viewer.entities.add({
    id: 'titanium-wing',
    availability,
    position: wingPosition,
    orientation: new Cesium.VelocityOrientationProperty(wingPosition),
    label: {
      text: 'E7 | ECHO-07',
      font: '12px "Space Grotesk"',
      fillColor: wingColor,
      outlineColor: Cesium.Color.fromCssColorString('#0b111b'),
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(8, -12),
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      showBackground: true,
      backgroundColor: Cesium.Color.fromCssColorString('#0b111b').withAlpha(0.5),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000),
      scaleByDistance: new Cesium.NearFarScalar(1000, 0.95, 2000000, 0.65),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    path: {
      resolution: 1,
      material: new Cesium.PolylineDashMaterialProperty({
        color: wingColor.withAlpha(0.9),
        dashLength: 16,
      }),
      width: 2.5,
      leadTime: 0,
      trailTime: 160,
    },
  })

  handle.entities.demoEntity = lead

  const basePosition = Cesium.Cartesian3.fromDegrees(BASE_STATION.lon, BASE_STATION.lat, BASE_STATION.alt)
  const baseColor = Cesium.Color.fromCssColorString('#4fd2ff')
  const ringColor = Cesium.Color.fromCssColorString('#7ce7ff')

  const pulseRadius = new Cesium.CallbackProperty((time) => {
    const seconds = Cesium.JulianDate.secondsDifference(time, start)
    const wave = 0.5 + 0.5 * Math.sin(seconds * 1.6)
    return 360 + wave * 260
  }, false)

  const pulseColor = new Cesium.CallbackProperty((time, result) => {
    const seconds = Cesium.JulianDate.secondsDifference(time, start)
    const wave = 0.5 + 0.5 * Math.sin(seconds * 1.6)
    return baseColor.withAlpha(0.12 + wave * 0.18, result)
  }, false)

  handle.viewer.entities.add({
    id: 'titanium-base',
    position: basePosition,
    point: {
      pixelSize: 10,
      color: ringColor,
      outlineColor: Cesium.Color.fromCssColorString(markerStroke),
      outlineWidth: 1,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000),
    },
    label: {
      text: 'BAY CONTROL',
      font: '11px "Space Grotesk"',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.fromCssColorString('#0b111b'),
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -26),
      showBackground: true,
      backgroundColor: Cesium.Color.fromCssColorString('#0b111b').withAlpha(0.6),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000),
    },
    ellipse: {
      semiMajorAxis: pulseRadius,
      semiMinorAxis: pulseRadius,
      material: new Cesium.ColorMaterialProperty(pulseColor),
      outline: true,
      outlineColor: ringColor.withAlpha(0.6),
      height: 0,
    },
  })

  SIGNAL_NODES.forEach((node) => {
    handle.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(node.lon, node.lat, node.alt),
      point: {
        pixelSize: 7,
        color: nodeColor.withAlpha(0.9),
        outlineColor: Cesium.Color.fromCssColorString('#0b111b'),
        outlineWidth: 1,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500000),
      },
      label: {
        text: node.label,
        font: '10px "Space Grotesk"',
        fillColor: nodeColor,
        outlineColor: Cesium.Color.fromCssColorString('#0b111b'),
        outlineWidth: 1,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -20),
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString('#0b111b').withAlpha(0.5),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500000),
      },
    })
  })

  setClockConfig(handle, {
    start,
    stop,
    current: start,
    multiplier: 24,
    shouldAnimate: true,
  })

  handle.viewer.trackedEntity = undefined
  handle.viewer.zoomTo(lead)
}
