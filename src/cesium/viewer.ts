import * as Cesium from 'cesium'
import { createDefaultImageryProvider, createFallbackImageryProvider, setBaseLayer } from './imagery'
import type { ViewerHandle } from './types'

type BaseLayerStyle = {
  brightness: number
  contrast: number
  saturation: number
  gamma: number
  hue: number
}

const TITANIUM_DARK_STYLE: BaseLayerStyle = {
  brightness: 0.95,
  contrast: 1.15,
  saturation: 0.4,
  gamma: 1.02,
  hue: 0,
}

const OSM_FALLBACK_STYLE: BaseLayerStyle = {
  brightness: 0.72,
  contrast: 1.25,
  saturation: 0.5,
  gamma: 1.05,
  hue: -0.02,
}

function applyBaseLayerStyle(layer: Cesium.ImageryLayer, style: BaseLayerStyle) {
  layer.brightness = style.brightness
  layer.contrast = style.contrast
  layer.saturation = style.saturation
  layer.gamma = style.gamma
  layer.hue = style.hue
}

export function initializeViewer(container: HTMLElement): ViewerHandle {
  const imageryProvider = createDefaultImageryProvider()
  const baseLayer = new Cesium.ImageryLayer(imageryProvider, {
    show: true,
  })
  applyBaseLayerStyle(baseLayer, TITANIUM_DARK_STYLE)

  const viewer = new Cesium.Viewer(container, {
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    vrButton: false,
    infoBox: false,
    selectionIndicator: false,
    baseLayer,
  })

  viewer.scene.postProcessStages.fxaa.enabled = true
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0a0f16')
  viewer.scene.useBrowserRecommendedResolution = false
  viewer.resolutionScale = Math.min(2, Math.max(1, window.devicePixelRatio * 1.5))
  viewer.scene.globe.maximumScreenSpaceError = 0.9
  if (viewer.scene.context.msaaSupported) {
    viewer.scene.msaaSamples = 4
  }

  const handle: ViewerHandle = {
    viewer,
    entities: {},
    stages: {
      stylize: null,
    },
    config: {
      clock: {},
      timeline: {
        markers: new Cesium.TimeIntervalCollection(),
      },
    },
  }

  let fallbackApplied = false
  imageryProvider.errorEvent.addEventListener((error) => {
    if (fallbackApplied) {
      return
    }
    fallbackApplied = true
    console.warn('[Titanium] Base layer failed, falling back to OSM tiles.', error)
    const fallbackLayer = setBaseLayer(handle, createFallbackImageryProvider())
    applyBaseLayerStyle(fallbackLayer, OSM_FALLBACK_STYLE)
  })

  return handle
}

export function destroyViewer(handle: ViewerHandle) {
  if (!handle.viewer.isDestroyed()) {
    handle.viewer.destroy()
  }
}
