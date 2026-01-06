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
  { seconds: 0, lat: 37.8085, lon: -122.475, alt: 2200 },
  { seconds: 70, lat: 37.832, lon: -122.356, alt: 2600 },
  { seconds: 140, lat: 37.803, lon: -122.271, alt: 2800 },
  { seconds: 210, lat: 37.742, lon: -122.214, alt: 2400 },
  { seconds: 280, lat: 37.621, lon: -122.379, alt: 2100 },
  { seconds: 350, lat: 37.64, lon: -122.45, alt: 2300 },
  { seconds: 430, lat: 37.707, lon: -122.52, alt: 2200 },
  { seconds: 520, lat: 37.79, lon: -122.52, alt: 2500 },
  { seconds: 600, lat: 37.8085, lon: -122.475, alt: 2200 },
]

const WING_ROUTE: RoutePoint[] = LEAD_ROUTE.map((point, index) => ({
  seconds: point.seconds + 12,
  lat: point.lat - 0.032 + Math.sin(index) * 0.004,
  lon: point.lon + 0.028 + Math.cos(index) * 0.004,
  alt: Math.max(point.alt - 260, 1200),
}))

const BASE_STATION = {
  lat: 37.7749,
  lon: -122.4194,
  alt: 0,
}

const SIGNAL_NODES = [
  { lat: 37.789, lon: -122.39, alt: 0, label: 'NODE-01' },
  { lat: 37.74, lon: -122.435, alt: 0, label: 'NODE-02' },
  { lat: 37.81, lon: -122.415, alt: 0, label: 'NODE-03' },
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
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
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
