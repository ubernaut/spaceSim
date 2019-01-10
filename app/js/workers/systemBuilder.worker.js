import System from '@void/core/system-builder/System'
import soPhysics from '@void/core/system-builder/soPhysics'

// let system = null
let physics = null

let ticks = 0
self.onmessage = function (e) {
  if (e.data[0] == 'init') {
    const bodyCount = e.data[1]
    const bodyDistance = e.data[2]
    const bodySpeed = e.data[3]
    const deltaT = e.data[4]
    const system = new System(1, 1, e.data[1], e.data[2], e.data[3])
    physics = new soPhysics(system, 0, deltaT, true, true, true)
    // init(system)

    postMessage(system)
  } else if (e.data[0] == 'fetch') {
    sendSystemState()
  }
}
const init = function (system) {
  // physics = new soPhysics()
}

const physicsLoop = function () {
  while (ticks < 10000) {}
}

const stepPhysics = function (system, physics) {}

const sendSystemState = function () {
  postMessage(system)
}
