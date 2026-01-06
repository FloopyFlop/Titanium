import * as Cesium from 'cesium'
import { createDefaultImageryProvider } from './imagery'
import type { ViewerHandle } from './types'

export function initializeViewer(container: HTMLElement): ViewerHandle {
  const imageryProvider = createDefaultImageryProvider()
  const baseLayer = new Cesium.ImageryLayer(imageryProvider, {
    show: true,
  })

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
  viewer.scene.globe.maximumScreenSpaceError = 1.5
  if (viewer.scene.context.msaaSupported) {
    viewer.scene.msaaSamples = 4
  }

  baseLayer.brightness = 0.78
  baseLayer.contrast = 1.32
  baseLayer.saturation = 0.55
  baseLayer.gamma = 1.08
  baseLayer.hue = -0.03

  const handle: ViewerHandle = {
    viewer,
    entities: {},
    stages: {
      stylize: null,
    },
    config: {
      clock: {},
    },
  }

  return handle
}

export function destroyViewer(handle: ViewerHandle) {
  if (!handle.viewer.isDestroyed()) {
    handle.viewer.destroy()
  }
}
