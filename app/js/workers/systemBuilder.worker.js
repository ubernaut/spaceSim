import System from '@void/core/system-builder/System'
import soPhysics from '@void/core/system-builder/soPhysics'
import {
  convertSystemToMeters,
  computeRadiusStellarToMetric
} from '@void/core/system-builder/utils'

// let system = null
let physics = null
let system = null
let ticks = 0
self.onmessage = function (e) {
  if (e.data[0] == 'init') {
    const bodyCount = e.data[1]
    const bodyDistance = e.data[2]
    const bodySpeed = e.data[3]
    const deltaT = e.data[4]
    system = new System(1, 1, bodyCount, bodyDistance, bodySpeed)
    physics = new soPhysics(system, 0, deltaT, false, true, true)
    init()

    postMessage(system)
  } else if (e.data[0] == 'fetch') {
    sendSystemState()
  }
}
const init = function () {
  console.log(physics)
  physics.gridSystem.rad.map((_, i) => {
    physics.gridSystem.rad[i] = computeRadiusStellarToMetric(
      physics.gridSystem.mass[i]
    )
  })
  physics.initGPUStuff()
  physicsLoop()
}

const physicsLoop = function () {
  // while (ticks < 10000) {
  physics.GPUAccelerate()
  // }
}

const stepPhysics = function (system, physics) {}

const sendSystemState = function () {
  postMessage([
    physics.dt,
    physics.system,
    physics.metric,
    physics.collisions,
    physics.gridSystem,
    physics.maxMark,
    physics.fitness,
    physics.sumFit,
    physics.t,
    physics.count,
    physics.tryCount,
    physics.gpuCollisions,
    physics.biggestBody
  ])
  physicsLoop()
}
