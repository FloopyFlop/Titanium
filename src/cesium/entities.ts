import * as Cesium from 'cesium'
import type { EnemyPaletteKey, ViewerHandle } from './types'
import { setClockConfig } from './timeline'

type RoutePoint = {
  seconds: number
  lat: number
  lon: number
  alt: number
}

const BLUE_LEAD_ROUTE: RoutePoint[] = [
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

const BLUE_WING_ROUTE: RoutePoint[] = BLUE_LEAD_ROUTE.map((point, index) => ({
  seconds: point.seconds + 12,
  lat: point.lat - 0.032 + Math.sin(index) * 0.004,
  lon: point.lon + 0.028 + Math.cos(index) * 0.004,
  alt: Math.max(point.alt - 260, 1200),
}))

const RED_ALPHA_ROUTE: RoutePoint[] = [
  { seconds: 0, lat: 25.085, lon: 121.48, alt: 2200 },
  { seconds: 90, lat: 25.11, lon: 121.52, alt: 2400 },
  { seconds: 170, lat: 25.08, lon: 121.56, alt: 2300 },
  { seconds: 250, lat: 25.05, lon: 121.53, alt: 2100 },
  { seconds: 330, lat: 25.06, lon: 121.49, alt: 2000 },
  { seconds: 420, lat: 25.09, lon: 121.45, alt: 2200 },
  { seconds: 520, lat: 25.12, lon: 121.5, alt: 2400 },
  { seconds: 600, lat: 25.085, lon: 121.48, alt: 2200 },
]

const RED_BRAVO_ROUTE: RoutePoint[] = [
  { seconds: 20, lat: 25.07, lon: 121.44, alt: 1900 },
  { seconds: 120, lat: 25.04, lon: 121.47, alt: 2100 },
  { seconds: 210, lat: 25.025, lon: 121.52, alt: 2200 },
  { seconds: 300, lat: 25.035, lon: 121.56, alt: 2300 },
  { seconds: 390, lat: 25.065, lon: 121.55, alt: 2100 },
  { seconds: 480, lat: 25.09, lon: 121.5, alt: 2000 },
  { seconds: 570, lat: 25.07, lon: 121.46, alt: 1900 },
]

const BLUE_GROUND_ROUTE: RoutePoint[] = [
  { seconds: 0, lat: 25.024, lon: 121.545, alt: 0 },
  { seconds: 80, lat: 25.03, lon: 121.558, alt: 0 },
  { seconds: 160, lat: 25.038, lon: 121.568, alt: 0 },
  { seconds: 240, lat: 25.028, lon: 121.578, alt: 0 },
  { seconds: 320, lat: 25.02, lon: 121.562, alt: 0 },
]

const RED_GROUND_ROUTE: RoutePoint[] = [
  { seconds: 40, lat: 25.096, lon: 121.46, alt: 0 },
  { seconds: 120, lat: 25.09, lon: 121.48, alt: 0 },
  { seconds: 200, lat: 25.083, lon: 121.505, alt: 0 },
  { seconds: 280, lat: 25.076, lon: 121.49, alt: 0 },
  { seconds: 360, lat: 25.088, lon: 121.47, alt: 0 },
]

const MISSILE_ROUTE: RoutePoint[] = [
  { seconds: 150, lat: 25.091, lon: 121.49, alt: 0 },
  { seconds: 162, lat: 25.085, lon: 121.515, alt: 700 },
  { seconds: 175, lat: 25.072, lon: 121.545, alt: 1500 },
  { seconds: 188, lat: 25.054, lon: 121.56, alt: 1100 },
  { seconds: 200, lat: 25.033, lon: 121.5654, alt: 150 },
]

const MISSILE_ROUTE_2: RoutePoint[] = [
  { seconds: 240, lat: 25.145, lon: 121.35, alt: 0 },
  { seconds: 255, lat: 25.11, lon: 121.45, alt: 900 },
  { seconds: 265, lat: 25.08, lon: 121.54, alt: 1500 },
  { seconds: 270, lat: 25.06, lon: 121.6, alt: 1300 },
]

const INTERCEPT_ROUTE_1: RoutePoint[] = [
  { seconds: 258, lat: 25.02, lon: 121.72, alt: 0 },
  { seconds: 266, lat: 25.04, lon: 121.67, alt: 900 },
  { seconds: 270, lat: 25.06, lon: 121.6, alt: 1300 },
]

const MISSILE_ROUTE_3: RoutePoint[] = [
  { seconds: 330, lat: 25.091, lon: 121.49, alt: 0 },
  { seconds: 345, lat: 25.05, lon: 121.52, alt: 900 },
  { seconds: 360, lat: 25.02, lon: 121.54, alt: 1200 },
  { seconds: 380, lat: 24.99, lon: 121.55, alt: 600 },
  { seconds: 395, lat: 24.96, lon: 121.55, alt: 150 },
]

const SHIP_ROUTE_ALPHA: RoutePoint[] = [
  { seconds: 0, lat: 25.02, lon: 121.72, alt: 0 },
  { seconds: 180, lat: 25.05, lon: 121.78, alt: 0 },
  { seconds: 360, lat: 25.08, lon: 121.82, alt: 0 },
]

const SHIP_ROUTE_BRAVO: RoutePoint[] = [
  { seconds: 40, lat: 24.98, lon: 121.7, alt: 0 },
  { seconds: 220, lat: 25.0, lon: 121.76, alt: 0 },
  { seconds: 400, lat: 25.02, lon: 121.8, alt: 0 },
]

const SHIP_ROUTE_CHARLIE: RoutePoint[] = [
  { seconds: 80, lat: 25.11, lon: 121.68, alt: 0 },
  { seconds: 260, lat: 25.13, lon: 121.73, alt: 0 },
  { seconds: 440, lat: 25.15, lon: 121.78, alt: 0 },
]

const SCENARIO_ROUTES: RoutePoint[][] = [
  BLUE_LEAD_ROUTE,
  BLUE_WING_ROUTE,
  RED_ALPHA_ROUTE,
  RED_BRAVO_ROUTE,
  BLUE_GROUND_ROUTE,
  RED_GROUND_ROUTE,
  MISSILE_ROUTE,
  MISSILE_ROUTE_2,
  INTERCEPT_ROUTE_1,
  MISSILE_ROUTE_3,
  SHIP_ROUTE_ALPHA,
  SHIP_ROUTE_BRAVO,
  SHIP_ROUTE_CHARLIE,
]

const BLUE_BASE = {
  lat: 25.033,
  lon: 121.5654,
  alt: 0,
}

const RED_BASE = {
  lat: 25.091,
  lon: 121.49,
  alt: 0,
}

const BLUE_BASE_EAST = {
  lat: 25.02,
  lon: 121.72,
  alt: 0,
}

const BLUE_BASE_SOUTH = {
  lat: 24.96,
  lon: 121.55,
  alt: 0,
}

const RED_BASE_WEST = {
  lat: 25.145,
  lon: 121.35,
  alt: 0,
}

const BLUE_NODES = [
  { lat: 25.052, lon: 121.52, alt: 0, label: 'BLU-01' },
  { lat: 25.023, lon: 121.49, alt: 0, label: 'BLU-02' },
  { lat: 25.072, lon: 121.59, alt: 0, label: 'BLU-03' },
]

const RED_NODES = [
  { lat: 25.102, lon: 121.47, alt: 0, label: 'RED-01' },
  { lat: 25.095, lon: 121.53, alt: 0, label: 'RED-02' },
  { lat: 25.075, lon: 121.44, alt: 0, label: 'RED-03' },
]

const SCENARIO_ANCHORS = [
  BLUE_BASE,
  RED_BASE,
  BLUE_BASE_EAST,
  BLUE_BASE_SOUTH,
  RED_BASE_WEST,
  ...BLUE_NODES,
  ...RED_NODES,
  { lat: 25.045, lon: 121.552 },
  { lat: 25.058, lon: 121.58 },
  { lat: 25.098, lon: 121.474 },
  { lat: 25.082, lon: 121.46 },
  { lat: 25.032, lon: 121.705 },
  { lat: 24.975, lon: 121.545 },
  { lat: 25.15, lon: 121.355 },
  { lat: 25.12, lon: 121.33 },
  { lat: 25.088, lon: 121.482 },
  { lat: 25.095, lon: 121.498 },
  { lat: 25.02, lon: 121.548 },
  { lat: 25.015, lon: 121.715 },
  { lat: 24.95, lon: 121.55 },
  { lat: 25.14, lon: 121.36 },
]

const markerStroke = '#0b111b'
const labelStroke = Cesium.Color.fromCssColorString(markerStroke)

const blueLeadColor = Cesium.Color.fromCssColorString('#6bdcff')
const blueWingColor = Cesium.Color.fromCssColorString('#3ab4ff')
const blueNodeColor = Cesium.Color.fromCssColorString('#46c4ff')
const blueMissileColor = Cesium.Color.fromCssColorString('#5bb9ff')

type EnemyPalette = {
  primary: Cesium.Color
  secondary: Cesium.Color
  node: Cesium.Color
  missile: Cesium.Color
  impact: Cesium.Color
}

const ENEMY_PALETTES: Record<EnemyPaletteKey, EnemyPalette> = {
  red: {
    primary: Cesium.Color.fromCssColorString('#ff4d66'),
    secondary: Cesium.Color.fromCssColorString('#ff7a6b'),
    node: Cesium.Color.fromCssColorString('#ff5f57'),
    missile: Cesium.Color.fromCssColorString('#ff2d55'),
    impact: Cesium.Color.fromCssColorString('#ff8b5a'),
  },
  orange: {
    primary: Cesium.Color.fromCssColorString('#ff8a3d'),
    secondary: Cesium.Color.fromCssColorString('#ffb468'),
    node: Cesium.Color.fromCssColorString('#ff9b4a'),
    missile: Cesium.Color.fromCssColorString('#ff6a2d'),
    impact: Cesium.Color.fromCssColorString('#ffb25a'),
  },
}

let enemyPaletteKey: EnemyPaletteKey = 'red'

const getEnemyPalette = () => ENEMY_PALETTES[enemyPaletteKey]

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

const getRouteStart = (route: RoutePoint[]) => route[0]?.seconds ?? 0

const getRouteEnd = (route: RoutePoint[]) => route[route.length - 1]?.seconds ?? 0

const buildScenarioRectangle = () => {
  let minLon = Number.POSITIVE_INFINITY
  let maxLon = Number.NEGATIVE_INFINITY
  let minLat = Number.POSITIVE_INFINITY
  let maxLat = Number.NEGATIVE_INFINITY

  const pushPoint = (lat: number, lon: number) => {
    minLon = Math.min(minLon, lon)
    maxLon = Math.max(maxLon, lon)
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
  }

  SCENARIO_ROUTES.forEach((route) => {
    route.forEach((point) => pushPoint(point.lat, point.lon))
  })

  SCENARIO_ANCHORS.forEach((point) => pushPoint(point.lat, point.lon))

  if (!Number.isFinite(minLon) || !Number.isFinite(minLat)) {
    return null
  }

  const padding = 0.18
  return Cesium.Rectangle.fromDegrees(
    minLon - padding,
    minLat - padding,
    maxLon + padding,
    maxLat + padding,
  )
}

const createPoint = (color: Cesium.Color, size: number, distance: number) => ({
  pixelSize: size,
  color,
  outlineColor: labelStroke,
  outlineWidth: 1,
  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, distance),
})

const createFlightLabel = (
  text: string,
  font: string,
  color: Cesium.Color,
  offset: Cesium.Cartesian2,
  backgroundAlpha: number,
  distance: number,
  scaleByDistance: Cesium.NearFarScalar,
) => ({
  text,
  font,
  fillColor: color,
  outlineColor: labelStroke,
  outlineWidth: 1,
  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  pixelOffset: offset,
  horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
  showBackground: true,
  backgroundColor: labelStroke.withAlpha(backgroundAlpha),
  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, distance),
  scaleByDistance,
  disableDepthTestDistance: Number.POSITIVE_INFINITY,
})

const createNodeLabel = (text: string, color: Cesium.Color, distance: number, backgroundAlpha: number) => ({
  text,
  font: '10px "Space Grotesk"',
  fillColor: color,
  outlineColor: labelStroke,
  outlineWidth: 1,
  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  pixelOffset: new Cesium.Cartesian2(0, -20),
  showBackground: true,
  backgroundColor: labelStroke.withAlpha(backgroundAlpha),
  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, distance),
})

const buildRadarSweepCanvas = (color: Cesium.Color, alpha: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return canvas
  }

  const r = Math.round(color.red * 255)
  const g = Math.round(color.green * 255)
  const b = Math.round(color.blue * 255)
  const sweep = Math.PI / 5

  ctx.translate(64, 64)
  ctx.clearRect(-64, -64, 128, 128)

  const gradient = ctx.createRadialGradient(0, 0, 6, 0, 0, 64)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
  gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.55})`)
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.arc(0, 0, 64, -sweep, sweep)
  ctx.closePath()
  ctx.fill()

  return canvas
}

const createRadarSweepMaterial = (color: Cesium.Color, alpha: number) =>
  new Cesium.ImageMaterialProperty({
    image: buildRadarSweepCanvas(color, alpha),
    transparent: true,
  })

const addBaseStation = (
  handle: ViewerHandle,
  start: Cesium.JulianDate,
  options: {
    id: string
    position: Cesium.Cartesian3
    label: string
    color: Cesium.Color
    ringColor: Cesium.Color
    pulseRate: number
    pulseBase: number
    pulseSpread: number
  },
) => {
  const pulseRadius = new Cesium.CallbackProperty((time) => {
    const seconds = Cesium.JulianDate.secondsDifference(time, start)
    const wave = 0.5 + 0.5 * Math.sin(seconds * options.pulseRate)
    return options.pulseBase + wave * options.pulseSpread
  }, false)

  const pulseColor = new Cesium.CallbackProperty((time, result) => {
    const seconds = Cesium.JulianDate.secondsDifference(time, start)
    const wave = 0.5 + 0.5 * Math.sin(seconds * options.pulseRate)
    return options.color.withAlpha(0.12 + wave * 0.18, result)
  }, false)

  const baseHeight = 180
  const baseCartographic = Cesium.Cartographic.fromCartesian(options.position)
  const baseCenter = Cesium.Cartesian3.fromRadians(
    baseCartographic.longitude,
    baseCartographic.latitude,
    baseCartographic.height + baseHeight / 2,
  )

  handle.viewer.entities.add({
    id: `${options.id}-pillar`,
    position: baseCenter,
    cylinder: {
      length: baseHeight,
      topRadius: 10,
      bottomRadius: 18,
      material: options.ringColor.withAlpha(0.7),
    },
  })

  handle.viewer.entities.add({
    id: options.id,
    position: options.position,
    point: createPoint(options.ringColor, 11, 3000000),
    label: {
      text: options.label,
      font: '11px "Space Grotesk"',
      fillColor: options.ringColor,
      outlineColor: labelStroke,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -26),
      showBackground: true,
      backgroundColor: labelStroke.withAlpha(0.6),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000),
    },
    ellipse: {
      semiMajorAxis: pulseRadius,
      semiMinorAxis: pulseRadius,
      material: new Cesium.ColorMaterialProperty(pulseColor),
      outline: true,
      outlineColor: options.ringColor.withAlpha(0.6),
      height: 0,
    },
  })
}

const addRadarTower = (
  handle: ViewerHandle,
  start: Cesium.JulianDate,
  options: {
    id: string
    position: Cesium.Cartesian3
    label: string
    color: Cesium.Color
    radius: number
    sweepRate: number
  },
) => {
  const sweepRotation = new Cesium.CallbackProperty((time) => {
    const seconds = Cesium.JulianDate.secondsDifference(time, start)
    return (seconds * options.sweepRate) % (Math.PI * 2)
  }, false)

  handle.viewer.entities.add({
    id: `${options.id}-tower`,
    position: options.position,
    cylinder: {
      length: 120,
      topRadius: 4,
      bottomRadius: 8,
      material: options.color.withAlpha(0.65),
    },
    label: {
      text: options.label,
      font: '10px "Space Grotesk"',
      fillColor: options.color,
      outlineColor: labelStroke,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -22),
      showBackground: true,
      backgroundColor: labelStroke.withAlpha(0.45),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000000),
    },
  })

  handle.viewer.entities.add({
    id: `${options.id}-sweep`,
    position: options.position,
    ellipse: {
      semiMajorAxis: options.radius,
      semiMinorAxis: options.radius,
      material: createRadarSweepMaterial(options.color, 0.5),
      stRotation: sweepRotation,
      height: 0,
    },
  })
}

const addLauncher = (
  handle: ViewerHandle,
  options: {
    id: string
    position: Cesium.Cartesian3
    label: string
    color: Cesium.Color
  },
) => {
  handle.viewer.entities.add({
    id: options.id,
    position: options.position,
    point: createPoint(options.color, 7, 1800000),
    label: {
      text: options.label,
      font: '10px "Space Grotesk"',
      fillColor: options.color,
      outlineColor: labelStroke,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -18),
      showBackground: true,
      backgroundColor: labelStroke.withAlpha(0.45),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1800000),
    },
  })
}

const addSignalNodes = (
  handle: ViewerHandle,
  nodes: Array<{ lat: number; lon: number; alt: number; label: string }>,
  color: Cesium.Color,
  backgroundAlpha: number,
) => {
  nodes.forEach((node) => {
    handle.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(node.lon, node.lat, node.alt),
      point: createPoint(color.withAlpha(0.9), 7, 1500000),
      label: createNodeLabel(node.label, color, 1500000, backgroundAlpha),
    })
  })
}

const addGroundConvoy = (
  handle: ViewerHandle,
  start: Cesium.JulianDate,
  route: RoutePoint[],
  options: {
    id: string
    label: string
    color: Cesium.Color
    dash: boolean
  },
) => {
  const position = buildPositionProperty(route, start)

  handle.viewer.entities.add({
    id: options.id,
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start,
        stop: Cesium.JulianDate.addSeconds(start, getRouteEnd(route), new Cesium.JulianDate()),
      }),
    ]),
    position,
    orientation: new Cesium.VelocityOrientationProperty(position),
    point: createPoint(options.color, 5, 1600000),
    label: {
      text: options.label,
      font: '10px "Space Grotesk"',
      fillColor: options.color,
      outlineColor: labelStroke,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(8, -12),
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      showBackground: true,
      backgroundColor: labelStroke.withAlpha(0.45),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1600000),
      scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 2000000, 0.6),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    path: {
      resolution: 1,
      material: options.dash
        ? new Cesium.PolylineDashMaterialProperty({
            color: options.color.withAlpha(0.8),
            dashLength: 12,
          })
        : new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.25,
            color: options.color.withAlpha(0.85),
          }),
      width: options.dash ? 2.0 : 2.5,
      leadTime: 0,
      trailTime: 120,
    },
  })
}

const addShip = (
  handle: ViewerHandle,
  start: Cesium.JulianDate,
  route: RoutePoint[],
  options: {
    id: string
    label: string
    color: Cesium.Color
  },
) => {
  const position = buildPositionProperty(route, start)
  const stop = Cesium.JulianDate.addSeconds(start, getRouteEnd(route), new Cesium.JulianDate())

  handle.viewer.entities.add({
    id: options.id,
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start,
        stop,
      }),
    ]),
    position,
    orientation: new Cesium.VelocityOrientationProperty(position),
    point: createPoint(options.color, 6, 5000000),
    label: {
      text: options.label,
      font: '10px "Space Grotesk"',
      fillColor: options.color,
      outlineColor: labelStroke,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(8, -12),
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      showBackground: true,
      backgroundColor: labelStroke.withAlpha(0.4),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000),
      scaleByDistance: new Cesium.NearFarScalar(1500, 1.0, 5000000, 0.5),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.2,
        color: options.color.withAlpha(0.7),
      }),
      width: 2,
      leadTime: 0,
      trailTime: 240,
    },
  })
}

const addExplosionEffect = (
  handle: ViewerHandle,
  start: Cesium.JulianDate,
  options: {
    id: string
    position: Cesium.Cartesian3
    impactSeconds: number
    color: Cesium.Color
  },
) => {
  const impactTime = Cesium.JulianDate.addSeconds(start, options.impactSeconds, new Cesium.JulianDate())
  const duration = 6
  const flashDuration = 1.4
  const baseTransform = Cesium.Transforms.eastNorthUpToFixedFrame(options.position)
  const rayAngles = Array.from({ length: 10 }, (_, index) => (index * 360) / 10).map((deg) =>
    Cesium.Math.toRadians(deg),
  )

  const getStrength = (time: Cesium.JulianDate) => {
    const dt = Cesium.JulianDate.secondsDifference(time, impactTime)
    if (dt < 0 || dt > duration) {
      return 0
    }
    return Math.max(0, 1 - dt / duration)
  }

  handle.viewer.entities.add({
    id: `${options.id}-flash`,
    position: options.position,
    point: {
      pixelSize: new Cesium.CallbackProperty((time) => {
        const dt = Cesium.JulianDate.secondsDifference(time, impactTime)
        if (dt < 0 || dt > flashDuration) {
          return 0
        }
        return 8 + dt * 18
      }, false),
      color: new Cesium.CallbackProperty((time, result) => {
        const dt = Cesium.JulianDate.secondsDifference(time, impactTime)
        if (dt < 0 || dt > flashDuration) {
          return Cesium.Color.TRANSPARENT.clone(result)
        }
        return options.color.withAlpha(0.9 * (1 - dt / flashDuration), result)
      }, false),
      outlineColor: labelStroke,
      outlineWidth: 1,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000),
    },
  })

  handle.viewer.entities.add({
    id: `${options.id}-ring`,
    position: options.position,
    ellipse: {
      semiMajorAxis: new Cesium.CallbackProperty((time) => {
        const dt = Cesium.JulianDate.secondsDifference(time, impactTime)
        if (dt < 0 || dt > duration) {
          return 0
        }
        return 140 + dt * 220
      }, false),
      semiMinorAxis: new Cesium.CallbackProperty((time) => {
        const dt = Cesium.JulianDate.secondsDifference(time, impactTime)
        if (dt < 0 || dt > duration) {
          return 0
        }
        return 140 + dt * 220
      }, false),
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty((time, result) => {
          const strength = getStrength(time)
          if (strength <= 0) {
            return Cesium.Color.TRANSPARENT.clone(result)
          }
          return options.color.withAlpha(0.5 * strength, result)
        }, false),
      ),
      height: 0,
    },
  })

  rayAngles.forEach((angle, index) => {
    handle.viewer.entities.add({
      id: `${options.id}-ray-${index}`,
      polyline: {
        positions: new Cesium.CallbackProperty((time) => {
          const dt = Cesium.JulianDate.secondsDifference(time, impactTime)
          if (dt < 0 || dt > duration) {
            return [options.position, options.position]
          }
          const radius = 80 + dt * 120
          const east = Math.cos(angle) * radius
          const north = Math.sin(angle) * radius
          const end = Cesium.Matrix4.multiplyByPoint(
            baseTransform,
            new Cesium.Cartesian3(east, north, 80),
            new Cesium.Cartesian3(),
          )
          return [options.position, end]
        }, false),
        width: 2,
        material: new Cesium.PolylineGlowMaterialProperty({
          color: new Cesium.CallbackProperty((time, result) => {
            const strength = getStrength(time)
            if (strength <= 0) {
              return Cesium.Color.TRANSPARENT.clone(result)
            }
            return options.color.withAlpha(0.55 * strength, result)
          }, false),
          glowPower: 0.2,
        }),
      },
    })
  })
}

export function loadDemoTrack(handle: ViewerHandle) {
  const start = Cesium.JulianDate.now()
  const enemyPalette = getEnemyPalette()
  const redAlphaColor = enemyPalette.primary
  const redBravoColor = enemyPalette.secondary
  const redNodeColor = enemyPalette.node
  const missileColor = enemyPalette.missile
  const impactColor = enemyPalette.impact
  const totalSeconds = Math.max(...SCENARIO_ROUTES.map(getRouteEnd))
  const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate())

  const blueLeadPosition = buildPositionProperty(BLUE_LEAD_ROUTE, start)
  const blueWingPosition = buildPositionProperty(BLUE_WING_ROUTE, start)
  const redAlphaPosition = buildPositionProperty(RED_ALPHA_ROUTE, start)
  const redBravoPosition = buildPositionProperty(RED_BRAVO_ROUTE, start)
  const missilePosition = buildPositionProperty(MISSILE_ROUTE, start)
  const missilePosition2 = buildPositionProperty(MISSILE_ROUTE_2, start)
  const interceptPosition1 = buildPositionProperty(INTERCEPT_ROUTE_1, start)
  const missilePosition3 = buildPositionProperty(MISSILE_ROUTE_3, start)

  const availability = new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({
      start,
      stop,
    }),
  ])

  const blueLead = handle.viewer.entities.add({
    id: 'titanium-blue-lead',
    availability,
    position: blueLeadPosition,
    orientation: new Cesium.VelocityOrientationProperty(blueLeadPosition),
    point: createPoint(blueLeadColor, 6, 4000000),
    label: createFlightLabel(
      'A1 | ATLAS-01',
      '13px "Space Grotesk"',
      blueLeadColor,
      new Cesium.Cartesian2(8, -14),
      0.55,
      4000000,
      new Cesium.NearFarScalar(1000, 1.0, 2000000, 0.7),
    ),
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.45,
        color: blueLeadColor,
      }),
      width: 4,
      leadTime: 0,
      trailTime: 220,
    },
  })

  handle.viewer.entities.add({
    id: 'titanium-blue-wing',
    availability,
    position: blueWingPosition,
    orientation: new Cesium.VelocityOrientationProperty(blueWingPosition),
    point: createPoint(blueWingColor, 5, 3500000),
    label: createFlightLabel(
      'E7 | ECHO-07',
      '12px "Space Grotesk"',
      blueWingColor,
      new Cesium.Cartesian2(8, -12),
      0.5,
      3000000,
      new Cesium.NearFarScalar(1000, 0.95, 2000000, 0.65),
    ),
    path: {
      resolution: 1,
      material: new Cesium.PolylineDashMaterialProperty({
        color: blueWingColor.withAlpha(0.9),
        dashLength: 16,
      }),
      width: 2.5,
      leadTime: 0,
      trailTime: 160,
    },
  })

  handle.viewer.entities.add({
    id: 'titanium-red-alpha',
    availability,
    position: redAlphaPosition,
    orientation: new Cesium.VelocityOrientationProperty(redAlphaPosition),
    point: createPoint(redAlphaColor, 6, 3500000),
    label: createFlightLabel(
      'R4 | RAZOR-04',
      '12px "Space Grotesk"',
      redAlphaColor,
      new Cesium.Cartesian2(8, -12),
      0.55,
      3500000,
      new Cesium.NearFarScalar(1000, 0.95, 2000000, 0.65),
    ),
    path: {
      resolution: 1,
      material: new Cesium.PolylineDashMaterialProperty({
        color: redAlphaColor.withAlpha(0.9),
        dashLength: 14,
      }),
      width: 2.5,
      leadTime: 0,
      trailTime: 180,
    },
  })

  handle.viewer.entities.add({
    id: 'titanium-red-bravo',
    availability,
    position: redBravoPosition,
    orientation: new Cesium.VelocityOrientationProperty(redBravoPosition),
    point: createPoint(redBravoColor, 5, 3200000),
    label: createFlightLabel(
      'V2 | VIPER-02',
      '12px "Space Grotesk"',
      redBravoColor,
      new Cesium.Cartesian2(8, -12),
      0.55,
      3200000,
      new Cesium.NearFarScalar(1000, 0.9, 2000000, 0.6),
    ),
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.3,
        color: redBravoColor,
      }),
      width: 3,
      leadTime: 0,
      trailTime: 160,
    },
  })

  const missileStart = Cesium.JulianDate.addSeconds(
    start,
    getRouteStart(MISSILE_ROUTE),
    new Cesium.JulianDate(),
  )
  const missileStop = Cesium.JulianDate.addSeconds(
    start,
    getRouteEnd(MISSILE_ROUTE),
    new Cesium.JulianDate(),
  )

  handle.viewer.entities.add({
    id: 'titanium-missile',
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: missileStart,
        stop: missileStop,
      }),
    ]),
    position: missilePosition,
    orientation: new Cesium.VelocityOrientationProperty(missilePosition),
    point: createPoint(missileColor, 6, 2500000),
    label: createFlightLabel(
      'M1 | LANCE',
      '11px "Space Grotesk"',
      missileColor,
      new Cesium.Cartesian2(10, -10),
      0.45,
      2500000,
      new Cesium.NearFarScalar(1000, 0.85, 2000000, 0.55),
    ),
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.6,
        color: missileColor,
      }),
      width: 2.5,
      leadTime: 0,
      trailTime: 50,
    },
  })

  const missileStart2 = Cesium.JulianDate.addSeconds(
    start,
    getRouteStart(MISSILE_ROUTE_2),
    new Cesium.JulianDate(),
  )
  const missileStop2 = Cesium.JulianDate.addSeconds(
    start,
    getRouteEnd(MISSILE_ROUTE_2),
    new Cesium.JulianDate(),
  )

  handle.viewer.entities.add({
    id: 'titanium-missile-2',
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: missileStart2,
        stop: missileStop2,
      }),
    ]),
    position: missilePosition2,
    orientation: new Cesium.VelocityOrientationProperty(missilePosition2),
    point: createPoint(missileColor, 6, 2500000),
    label: createFlightLabel(
      'M2 | SPARROW',
      '11px "Space Grotesk"',
      missileColor,
      new Cesium.Cartesian2(10, -10),
      0.45,
      2500000,
      new Cesium.NearFarScalar(1000, 0.85, 2000000, 0.55),
    ),
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.6,
        color: missileColor,
      }),
      width: 2.5,
      leadTime: 0,
      trailTime: 40,
    },
  })

  const interceptStart1 = Cesium.JulianDate.addSeconds(
    start,
    getRouteStart(INTERCEPT_ROUTE_1),
    new Cesium.JulianDate(),
  )
  const interceptStop1 = Cesium.JulianDate.addSeconds(
    start,
    getRouteEnd(INTERCEPT_ROUTE_1),
    new Cesium.JulianDate(),
  )

  handle.viewer.entities.add({
    id: 'titanium-interceptor-1',
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: interceptStart1,
        stop: interceptStop1,
      }),
    ]),
    position: interceptPosition1,
    orientation: new Cesium.VelocityOrientationProperty(interceptPosition1),
    point: createPoint(blueMissileColor, 6, 2500000),
    label: createFlightLabel(
      'I1 | GUARD',
      '11px "Space Grotesk"',
      blueMissileColor,
      new Cesium.Cartesian2(10, -10),
      0.45,
      2500000,
      new Cesium.NearFarScalar(1000, 0.85, 2000000, 0.55),
    ),
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.65,
        color: blueMissileColor,
      }),
      width: 2.5,
      leadTime: 0,
      trailTime: 36,
    },
  })

  const missileStart3 = Cesium.JulianDate.addSeconds(
    start,
    getRouteStart(MISSILE_ROUTE_3),
    new Cesium.JulianDate(),
  )
  const missileStop3 = Cesium.JulianDate.addSeconds(
    start,
    getRouteEnd(MISSILE_ROUTE_3),
    new Cesium.JulianDate(),
  )

  handle.viewer.entities.add({
    id: 'titanium-missile-3',
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: missileStart3,
        stop: missileStop3,
      }),
    ]),
    position: missilePosition3,
    orientation: new Cesium.VelocityOrientationProperty(missilePosition3),
    point: createPoint(missileColor, 6, 2500000),
    label: createFlightLabel(
      'M3 | LANCER',
      '11px "Space Grotesk"',
      missileColor,
      new Cesium.Cartesian2(10, -10),
      0.45,
      2500000,
      new Cesium.NearFarScalar(1000, 0.85, 2000000, 0.55),
    ),
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.6,
        color: missileColor,
      }),
      width: 2.5,
      leadTime: 0,
      trailTime: 45,
    },
  })

  const blueBasePosition = Cesium.Cartesian3.fromDegrees(BLUE_BASE.lon, BLUE_BASE.lat, BLUE_BASE.alt)
  const redBasePosition = Cesium.Cartesian3.fromDegrees(RED_BASE.lon, RED_BASE.lat, RED_BASE.alt)
  const blueEastBasePosition = Cesium.Cartesian3.fromDegrees(
    BLUE_BASE_EAST.lon,
    BLUE_BASE_EAST.lat,
    BLUE_BASE_EAST.alt,
  )
  const blueSouthBasePosition = Cesium.Cartesian3.fromDegrees(
    BLUE_BASE_SOUTH.lon,
    BLUE_BASE_SOUTH.lat,
    BLUE_BASE_SOUTH.alt,
  )
  const redWestBasePosition = Cesium.Cartesian3.fromDegrees(
    RED_BASE_WEST.lon,
    RED_BASE_WEST.lat,
    RED_BASE_WEST.alt,
  )
  const interceptPoint = MISSILE_ROUTE_2[MISSILE_ROUTE_2.length - 1]
  const interceptPosition = Cesium.Cartesian3.fromDegrees(
    interceptPoint.lon,
    interceptPoint.lat,
    interceptPoint.alt,
  )

  handle.entities.demoEntity = blueLead

  addBaseStation(handle, start, {
    id: 'titanium-blue-base',
    position: blueBasePosition,
    label: 'BAY CONTROL',
    color: blueNodeColor,
    ringColor: blueLeadColor,
    pulseRate: 1.6,
    pulseBase: 360,
    pulseSpread: 260,
  })

  addBaseStation(handle, start, {
    id: 'titanium-red-base',
    position: redBasePosition,
    label: 'RED FORGE',
    color: redNodeColor,
    ringColor: redAlphaColor,
    pulseRate: 1.25,
    pulseBase: 320,
    pulseSpread: 220,
  })

  addBaseStation(handle, start, {
    id: 'titanium-blue-east',
    position: blueEastBasePosition,
    label: 'COASTAL NODE',
    color: blueNodeColor,
    ringColor: blueWingColor,
    pulseRate: 1.35,
    pulseBase: 300,
    pulseSpread: 210,
  })

  addBaseStation(handle, start, {
    id: 'titanium-blue-south',
    position: blueSouthBasePosition,
    label: 'SOUTH RIDGE',
    color: blueNodeColor,
    ringColor: blueLeadColor,
    pulseRate: 1.2,
    pulseBase: 280,
    pulseSpread: 190,
  })

  addBaseStation(handle, start, {
    id: 'titanium-red-west',
    position: redWestBasePosition,
    label: 'IRON GATE',
    color: redNodeColor,
    ringColor: redAlphaColor,
    pulseRate: 1.05,
    pulseBase: 300,
    pulseSpread: 210,
  })

  addRadarTower(handle, start, {
    id: 'titanium-blue-radar-1',
    position: Cesium.Cartesian3.fromDegrees(121.552, 25.045, 40),
    label: 'RADAR-A1',
    color: blueNodeColor,
    radius: 900,
    sweepRate: 0.6,
  })

  addRadarTower(handle, start, {
    id: 'titanium-blue-radar-2',
    position: Cesium.Cartesian3.fromDegrees(121.58, 25.058, 40),
    label: 'RADAR-A2',
    color: blueLeadColor,
    radius: 800,
    sweepRate: 0.85,
  })

  addRadarTower(handle, start, {
    id: 'titanium-red-radar-1',
    position: Cesium.Cartesian3.fromDegrees(121.474, 25.098, 40),
    label: 'RADAR-R1',
    color: redNodeColor,
    radius: 850,
    sweepRate: 0.7,
  })

  addRadarTower(handle, start, {
    id: 'titanium-red-radar-2',
    position: Cesium.Cartesian3.fromDegrees(121.46, 25.082, 40),
    label: 'RADAR-R2',
    color: redAlphaColor,
    radius: 780,
    sweepRate: 0.9,
  })

  addRadarTower(handle, start, {
    id: 'titanium-blue-radar-3',
    position: Cesium.Cartesian3.fromDegrees(121.705, 25.032, 40),
    label: 'RADAR-B1',
    color: blueWingColor,
    radius: 760,
    sweepRate: 0.8,
  })

  addRadarTower(handle, start, {
    id: 'titanium-blue-radar-4',
    position: Cesium.Cartesian3.fromDegrees(121.545, 24.975, 40),
    label: 'RADAR-B2',
    color: blueNodeColor,
    radius: 720,
    sweepRate: 0.65,
  })

  addRadarTower(handle, start, {
    id: 'titanium-red-radar-3',
    position: Cesium.Cartesian3.fromDegrees(121.355, 25.15, 40),
    label: 'RADAR-R3',
    color: redAlphaColor,
    radius: 760,
    sweepRate: 0.7,
  })

  addRadarTower(handle, start, {
    id: 'titanium-red-radar-4',
    position: Cesium.Cartesian3.fromDegrees(121.33, 25.12, 40),
    label: 'RADAR-R4',
    color: redNodeColor,
    radius: 720,
    sweepRate: 0.6,
  })

  addLauncher(handle, {
    id: 'titanium-red-launcher-1',
    position: Cesium.Cartesian3.fromDegrees(121.482, 25.088, 0),
    label: 'LAUNCHER-01',
    color: redAlphaColor,
  })

  addLauncher(handle, {
    id: 'titanium-red-launcher-2',
    position: Cesium.Cartesian3.fromDegrees(121.498, 25.095, 0),
    label: 'LAUNCHER-02',
    color: redBravoColor,
  })

  addLauncher(handle, {
    id: 'titanium-blue-launcher-1',
    position: Cesium.Cartesian3.fromDegrees(121.548, 25.02, 0),
    label: 'DEFENSE-01',
    color: blueLeadColor,
  })

  addLauncher(handle, {
    id: 'titanium-blue-launcher-2',
    position: Cesium.Cartesian3.fromDegrees(121.715, 25.015, 0),
    label: 'DEFENSE-02',
    color: blueWingColor,
  })

  addLauncher(handle, {
    id: 'titanium-blue-launcher-3',
    position: Cesium.Cartesian3.fromDegrees(121.55, 24.95, 0),
    label: 'DEFENSE-03',
    color: blueLeadColor,
  })

  addLauncher(handle, {
    id: 'titanium-red-launcher-3',
    position: Cesium.Cartesian3.fromDegrees(121.36, 25.14, 0),
    label: 'LAUNCHER-03',
    color: redAlphaColor,
  })

  addSignalNodes(handle, BLUE_NODES, blueNodeColor, 0.5)
  addSignalNodes(handle, RED_NODES, redNodeColor, 0.45)

  addGroundConvoy(handle, start, BLUE_GROUND_ROUTE, {
    id: 'titanium-blue-ground',
    label: 'BLU-G1',
    color: blueNodeColor,
    dash: false,
  })

  addGroundConvoy(handle, start, RED_GROUND_ROUTE, {
    id: 'titanium-red-ground',
    label: 'RED-G1',
    color: redNodeColor,
    dash: true,
  })

  addShip(handle, start, SHIP_ROUTE_ALPHA, {
    id: 'titanium-ship-alpha',
    label: 'FLEET-01',
    color: blueNodeColor,
  })

  addShip(handle, start, SHIP_ROUTE_BRAVO, {
    id: 'titanium-ship-bravo',
    label: 'FLEET-02',
    color: blueLeadColor,
  })

  addShip(handle, start, SHIP_ROUTE_CHARLIE, {
    id: 'titanium-ship-charlie',
    label: 'FLEET-03',
    color: blueWingColor,
  })

  addExplosionEffect(handle, start, {
    id: 'titanium-impact',
    position: blueBasePosition,
    impactSeconds: getRouteEnd(MISSILE_ROUTE),
    color: impactColor,
  })

  addExplosionEffect(handle, start, {
    id: 'titanium-intercept',
    position: interceptPosition,
    impactSeconds: getRouteEnd(MISSILE_ROUTE_2),
    color: blueMissileColor,
  })

  addExplosionEffect(handle, start, {
    id: 'titanium-impact-south',
    position: blueSouthBasePosition,
    impactSeconds: getRouteEnd(MISSILE_ROUTE_3),
    color: impactColor,
  })

  setClockConfig(handle, {
    start,
    stop,
    current: start,
    multiplier: 24,
    shouldAnimate: true,
  })

  handle.viewer.trackedEntity = undefined
  handle.config.enemyPalette = enemyPaletteKey

  const scenarioRectangle = buildScenarioRectangle()
  if (scenarioRectangle) {
    handle.viewer.camera.flyTo({
      destination: scenarioRectangle,
      duration: 0,
    })
  } else {
    handle.viewer.zoomTo(handle.viewer.entities)
  }
}

export function setEnemyPalette(handle: ViewerHandle, palette: EnemyPaletteKey) {
  if (enemyPaletteKey === palette) {
    handle.config.enemyPalette = palette
    return
  }

  const start = handle.config.clock.start
  const currentSeconds = start ? Cesium.JulianDate.secondsDifference(handle.viewer.clock.currentTime, start) : 0
  const multiplier = handle.viewer.clock.multiplier
  const isPlaying = handle.viewer.clock.shouldAnimate
  const wasTracking = Boolean(handle.viewer.trackedEntity)

  enemyPaletteKey = palette
  handle.viewer.entities.removeAll()
  loadDemoTrack(handle)

  handle.viewer.clock.multiplier = multiplier
  handle.viewer.clock.shouldAnimate = isPlaying

  if (handle.config.clock.start && handle.config.clock.stop) {
    const totalSeconds = Cesium.JulianDate.secondsDifference(handle.config.clock.stop, handle.config.clock.start)
    const clampedSeconds = Math.min(Math.max(currentSeconds, 0), totalSeconds)
    handle.viewer.clock.currentTime = Cesium.JulianDate.addSeconds(
      handle.config.clock.start,
      clampedSeconds,
      new Cesium.JulianDate(),
    )
  }

  if (wasTracking && handle.entities.demoEntity) {
    handle.viewer.trackedEntity = handle.entities.demoEntity
  }

  handle.config.enemyPalette = palette
  handle.viewer.scene.requestRender()
}
