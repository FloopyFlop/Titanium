import * as Cesium from 'cesium'
import type { ViewerHandle } from './types'

export function createDefaultImageryProvider() {
  return new Cesium.OpenStreetMapImageryProvider({
    url: 'https://tile.openstreetmap.org/',
    credit: '© OpenStreetMap contributors',
    maximumLevel: 19,
  })
}

export function setBaseLayer(handle: ViewerHandle, provider: Cesium.ImageryProvider) {
  handle.viewer.imageryLayers.removeAll()
  handle.viewer.imageryLayers.addImageryProvider(provider)
}
