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
  },
  oimo: false
}

const init = (rootEl, animateCallbackHelpers, config) => {
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

  return new Promise((resolve, reject) => {
    loadSystem({
      scene,
      bodyCount: config.system.bodyCount,
      bodyDistance: config.system.bodyDistance,
      bodySpeed: config.system.bodySpeed,
      deltaT: config.system.deltaT,
      gpuCollisions: config.system.gpuCollisions,
      addAnimateCallback: animateCallbackHelpers.addAnimateCallback
    }).then(physics => {
      animate({
        scene,
        physics,
        composer,
        clock: new THREE.Clock(),
        getAnimateCallbacks: animateCallbackHelpers.getAnimateCallbacks
      })

      rootEl.appendChild(renderer.domElement)
      window.addEventListener(
        'resize',
        onWindowResize({ renderer, camera }),
        false
      )

      resolve({ scene, camera, physics })
    })
  })
}

export default init
