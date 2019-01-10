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

const onWindowResize = ({ renderer, camera }) => () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const defaultConfig = {
  camera: {
    fov: 70,
    nearClip: 0.1,
    farClip: 5 * IAU
  },
  system: {
    bodyCount: 512,
    bodyDistance: 1,
    bodySpeed: 0.05,
    deltaT: 0.005,
    gpuCollisions: false
  },
  oimo: false
}

const init = async (rootEl, animateCallbackHelpers, config) => {
  config = Object.assign({}, defaultConfig, config)
  const renderer = createRenderer()
  const scene = new THREE.Scene()
  const camera = createCamera(config.camera)
  const composer = createPostprocessing({
    renderer,
    scene,
    camera
  })

  if (config.oimo) {
    initOimoPhysics()
  }

  addLights(scene)
  createGalaxy(scene)
  createUniverse(scene).map(body => scene.add(body))

  let systemWorker = await loadSystem({
    scene,
    bodyCount: config.system.bodyCount,
    bodyDistance: config.system.bodyDistance,
    bodySpeed: config.system.bodySpeed,
    deltaT: config.system.deltaT,
    gpuCollisions: config.system.gpuCollisions,
    addAnimateCallback: animateCallbackHelpers.addAnimateCallback
  })
  // console.log(systemWorker)
  animate({
    scene,
    systemWorker,
    composer,
    clock: new THREE.Clock(),
    getAnimateCallbacks: animateCallbackHelpers.getAnimateCallbacks
  })

  rootEl.appendChild(renderer.domElement)
  window.addEventListener('resize', onWindowResize({ renderer, camera }), false)

  return { scene, camera, systemWorker }
}

export default init
