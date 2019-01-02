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
    gpuCollisions: false
  }
}

const init = (rootEl, config = defaultConfig) => {
  Void.renderer = createRenderer()
  Void.scene = new THREE.Scene()
  Void.camera = createCamera(config.camera)
  Void.composer = createPostprocessing({
    renderer: Void.renderer,
    scene: Void.scene,
    camera: Void.camera
  })
  Void.world = initOimoPhysics()
  Void.galaxy = createGalaxy(Void.scene)

  createUniverse(Void.scene).map(body => Void.scene.add(body))

  addLights(Void.scene)

  rootEl.appendChild(Void.renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)

  if (Void.urlConfigs.hasOwnProperty('GPUcollisions')) {
    config.gpuCollisions = Void.urlConfigs.GPUcollisions
  }

  loadSystem({
    gpuCollisions: config.gpuCollisions
  })

  animate()

  return { scene: Void.scene }
}

export default init
