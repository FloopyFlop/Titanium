import * as Cesium from 'cesium'
import type { SceneMode, ViewerHandle } from './types'

export function setTrackEntity(handle: ViewerHandle, enabled: boolean) {
  const entity = handle.entities.demoEntity
  handle.viewer.trackedEntity = enabled && entity ? entity : undefined
}

export function flyHome(handle: ViewerHandle) {
  handle.viewer.camera.flyHome(1.2)
}

export function setSceneMode(handle: ViewerHandle, mode: SceneMode) {
  const duration = 0.6
  if (mode === '2D') {
    handle.viewer.scene.morphTo2D(duration)
    return
  }

  if (mode === 'COLUMBUS') {
    handle.viewer.scene.morphToColumbusView(duration)
    return
  }

  handle.viewer.scene.morphTo3D(duration)
}

export function resetNorth(handle: ViewerHandle) {
  const { camera } = handle.viewer
  const position = camera.positionWC.clone()
  camera.setView({
    destination: position,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: camera.pitch,
      roll: 0,
    },
  })
}
