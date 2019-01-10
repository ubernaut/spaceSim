import { createUniverse } from '-/bodies/universe'
import { createGalaxy } from '-/bodies/galaxy'
import { initOimoPhysics } from './physics'
import { loadSystem } from './system'
import { animate, addLights } from './scene'

const defaultConfig = {
  system: {
    bodyCount: 512,
    bodyDistance: 1,
    bodySpeed: 0.05,
    deltaT: 0.005,
    gpuCollisions: false
  },
  oimo: false
}

const init = async (scene, config) => {
  config = Object.assign({}, defaultConfig, config)

  if (config.oimo) {
    initOimoPhysics()
  }

  addLights(scene)
  createGalaxy(scene)
  createUniverse(scene).map(body => scene.add(body))

  const physics = await loadSystem({
    scene,
    bodyCount: config.system.bodyCount,
    bodyDistance: config.system.bodyDistance,
    bodySpeed: config.system.bodySpeed,
    deltaT: config.system.deltaT,
    gpuCollisions: config.system.gpuCollisions
  })

  const animateScene = delta =>
    animate({
      delta,
      scene,
      physics
    })

  return { physics, animate: animateScene }
}

export default init
