import * as Cesium from 'cesium'
import type { ViewerHandle } from './types'

export function createDefaultImageryProvider() {
  return new Cesium.UrlTemplateImageryProvider({
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    credit: '© OpenStreetMap contributors, © CARTO',
    maximumLevel: 20,
  })
}

export function createFallbackImageryProvider() {
  return new Cesium.OpenStreetMapImageryProvider({
    url: 'https://tile.openstreetmap.org/',
    credit: '© OpenStreetMap contributors',
    maximumLevel: 19,
  })
}

export function setBaseLayer(handle: ViewerHandle, provider: Cesium.ImageryProvider) {
  handle.viewer.imageryLayers.removeAll()
  return handle.viewer.imageryLayers.addImageryProvider(provider)
}
