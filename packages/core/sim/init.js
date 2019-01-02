import { createUniverse } from '-/bodies/universe'
import { createGalaxy } from '-/bodies/galaxy'
import { initOimoPhysics } from './physics'
import { loadSystem } from './system'
import {
  animate,
  addLights,
  createPostprocessing,
  createRenderer,
  createCamera
} from './scene'

const IAU = 9.4607 * Math.pow(10, 15)

const onWindowResize = () => {
  Void.camera.aspect = window.innerWidth / window.innerHeight
  Void.camera.updateProjectionMatrix()
  Void.renderer.setSize(window.innerWidth, window.innerHeight)
}

const defaultConfig = {
  camera: {
    fov: 65,
    nearClip: 0.1,
    farClip: 5 * IAU
  },
  system: {
    bodyCount: 1024,
    bodyDistance: 1,
    bodySpeed: 0.05,
    deltaT: 0.005,
    gpuCollisions: false
  }
}
// let bodyCount = 1024
// if (Void.urlConfigs.hasOwnProperty('bodyCount')) {
//   if (Number.isInteger(parseInt(Void.urlConfigs.bodyCount))) {
//     bodyCount = Void.urlConfigs.bodyCount
//   }
// }
// let bodyDistance = 1
// if (Void.urlConfigs.hasOwnProperty('bodyDistance')) {
//   if (Number.isInteger(parseInt(Void.urlConfigs.bodyDistance))) {
//     bodyDistance = Void.urlConfigs.bodyDistance
//   }
// }
// let bodySpeed = 0.05
// if (Void.urlConfigs.hasOwnProperty('bodySpeed')) {
//   if (Number.isInteger(parseInt(Void.urlConfigs.bodySpeed))) {
//     bodySpeed = Void.urlConfigs.bodySpeed
//   }
// }
// let deltaT = 0.005
// if (Void.urlConfigs.hasOwnProperty('deltaT')) {
//   if (Number.isInteger(parseInt(Void.urlConfigs.deltaT))) {
//     deltaT = Void.urlConfigs.deltaT
//   }
// }

const init = (rootEl, config = defaultConfig) => {
  const renderer = (Void.renderer = createRenderer())
  const scene = (Void.scene = new THREE.Scene())
  const camera = (Void.camera = createCamera(config.camera))
  const composer = (Void.composer = createPostprocessing({
    renderer,
    scene,
    camera
  }))
  Void.world = initOimoPhysics()
  Void.galaxy = createGalaxy(scene)

  createUniverse(scene).map(body => scene.add(body))
  loadSystem({
    gpuCollisions: config.system.gpuCollisions
  })

  addLights(scene)
  animate({
    scene,
    composer,
    clock: new THREE.Clock()
  })

  rootEl.appendChild(Void.renderer.domElement)
  window.addEventListener('resize', onWindowResize, false)

  return { scene: Void.scene }
}

export default init
