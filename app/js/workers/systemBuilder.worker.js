import System from '@void/core/system-builder/System'
import soPhysics from '@void/core/system-builder/soPhysics'

let physics = null

let ticks = 0
self.onmessage = function (e) {
  if (e.data[0] == 'init') {
    const system = new System(1, 1, e.data[1], e.data[2], e.data[3])

    postMessage(system)
  } else if (e.data[0] == 'fetch') {
    sendSystemState()
  }
}
const physicsLoop = function () {
  while (ticks < 10000) {}
}

const stepPhysics = function (system, physics) {}

const sendSystemState = function () {
  postMessage(system)
}
