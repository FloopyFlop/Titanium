import * as Cesium from 'cesium'
import { createDefaultImageryProvider } from './imagery'
import type { ViewerHandle } from './types'

export function initializeViewer(container: HTMLElement): ViewerHandle {
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
    imageryProvider: createDefaultImageryProvider(),
  })

  viewer.scene.postProcessStages.fxaa.enabled = true
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0a0f16')

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
