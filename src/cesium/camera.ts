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
  const scene = handle.viewer.scene
  const controller = scene.screenSpaceCameraController
  const focusEntity = handle.entities.demoEntity

  const zoomToEntity = () => {
    if (focusEntity) {
      handle.viewer.zoomTo(focusEntity)
    }
    scene.morphComplete.removeEventListener(zoomToEntity)
  }

  if (mode === '2D') {
    controller.enableTilt = false
    controller.enableRotate = false
    controller.enableLook = false
  } else {
    controller.enableTilt = true
    controller.enableRotate = true
    controller.enableLook = true
  }

  if (mode === '2D') {
    if (scene.mode === Cesium.SceneMode.SCENE2D) {
      if (focusEntity) {
        handle.viewer.zoomTo(focusEntity)
      }
      return
    }
    scene.morphComplete.addEventListener(zoomToEntity)
    handle.viewer.scene.morphTo2D(duration)
    return
  }

  if (mode === 'COLUMBUS') {
    const camera = handle.viewer.camera
    const targetPitch = Cesium.Math.toRadians(-35)

    const tiltOnce = () => {
      if (scene.mode !== Cesium.SceneMode.COLUMBUS_VIEW) {
        scene.morphComplete.removeEventListener(tiltOnce)
        return
      }
      camera.setView({
        orientation: {
          heading: camera.heading,
          pitch: targetPitch,
          roll: 0,
        },
      })
      scene.morphComplete.removeEventListener(tiltOnce)
    }

    if (scene.mode === Cesium.SceneMode.COLUMBUS_VIEW) {
      tiltOnce()
      if (focusEntity) {
        handle.viewer.zoomTo(focusEntity)
      }
      return
    }

    scene.morphComplete.addEventListener(zoomToEntity)
    scene.morphComplete.addEventListener(tiltOnce)
    scene.morphToColumbusView(duration)
    return
  }

  if (scene.mode === Cesium.SceneMode.SCENE3D) {
    if (focusEntity) {
      handle.viewer.zoomTo(focusEntity)
    }
    return
  }

  scene.morphComplete.addEventListener(zoomToEntity)
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
