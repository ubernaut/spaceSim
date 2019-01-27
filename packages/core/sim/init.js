import { updateSystemCPU, loadSystem } from './system'
import { createUniverse } from '-/objects/bodies/universe'
import { createGalaxy } from '-/objects/bodies/galaxy'
import { initOimoPhysics } from './physics'
import { addLights } from './scene'

const defaultConfig = {
  system: {
    bodyCount: 512,
    bodyDistance: 1,
    bodySpeed: 0.05,
    deltaT: 0.001,
    gpuCollisions: true
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

  const { systemWorker, systemAnimations } = await loadSystem({
    scene,
    bodyCount: config.system.bodyCount,
    bodyDistance: config.system.bodyDistance,
    bodySpeed: config.system.bodySpeed,
    deltaT: config.system.deltaT,
    gpuCollisions: config.system.gpuCollisions
  })

  systemWorker.onmessage = e => {
    systemWorker.physics.dt = e.data[0]
    systemWorker.physics.metric = e.data[2]
    systemWorker.physics.collisions = e.data[3]
    systemWorker.physics.gridSystem = e.data[4]
    systemWorker.physics.maxMark = e.data[5]
    systemWorker.physics.fitness = e.data[6]
    systemWorker.physics.sumFit = e.data[7]
    systemWorker.physics.t = e.data[8]
    systemWorker.physics.count = e.data[9]
    systemWorker.physics.tryCount = e.data[10]
    systemWorker.physics.gpuCollisions = e.data[11]
    systemWorker.physics.biggestBody = e.data[12]

    updateSystemCPU(scene, systemWorker.physics)
  }

  const animate = delta => {
    systemWorker.postMessage([ 'fetch' ])
    systemAnimations.map(a => a(delta))
  }

  return { systemWorker, animate }
}

export default init
