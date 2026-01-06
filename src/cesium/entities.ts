import * as Cesium from 'cesium'
import type { ViewerHandle } from './types'
import { setClockConfig } from './timeline'

const DEMO_ROUTE = [
  { seconds: 0, lat: 37.7749, lon: -122.4194, alt: 1400 },
  { seconds: 60, lat: 37.8044, lon: -122.2711, alt: 1600 },
  { seconds: 120, lat: 37.6879, lon: -122.4702, alt: 1800 },
  { seconds: 180, lat: 37.6213, lon: -122.379, alt: 2000 },
  { seconds: 240, lat: 37.6391, lon: -122.4, alt: 1700 },
  { seconds: 300, lat: 37.7061, lon: -122.4547, alt: 1500 },
  { seconds: 360, lat: 37.7749, lon: -122.4194, alt: 1400 },
]

export function loadDemoTrack(handle: ViewerHandle) {
  const start = Cesium.JulianDate.now()
  const totalSeconds = DEMO_ROUTE[DEMO_ROUTE.length - 1]?.seconds ?? 0
  const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate())

  const position = new Cesium.SampledPositionProperty()

  DEMO_ROUTE.forEach((point) => {
    const time = Cesium.JulianDate.addSeconds(start, point.seconds, new Cesium.JulianDate())
    const cartesian = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.alt)
    position.addSample(time, cartesian)
  })

  position.setInterpolationOptions({
    interpolationDegree: 2,
    interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
  })

  const entity = handle.viewer.entities.add({
    id: 'titanium-demo',
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start,
        stop,
      }),
    ]),
    position,
    orientation: new Cesium.VelocityOrientationProperty(position),
    point: {
      pixelSize: 10,
      color: Cesium.Color.fromCssColorString('#7ce7ff'),
      outlineColor: Cesium.Color.fromCssColorString('#0b111b'),
      outlineWidth: 2,
    },
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.25,
        color: Cesium.Color.fromCssColorString('#4fd2ff'),
      }),
      width: 2,
    },
  })

  handle.entities.demoEntity = entity

  setClockConfig(handle, {
    start,
    stop,
    current: start,
    multiplier: 20,
    shouldAnimate: true,
  })

  handle.viewer.trackedEntity = undefined
  handle.viewer.zoomTo(entity)
}
