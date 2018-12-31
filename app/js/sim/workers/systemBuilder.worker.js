import { System, GridSystem, SoPhysics } from '-/sim/systemBuilder'

self.onmessage = function (e) {
  const system = new System(1, 1, e.data[0], e.data[1], e.data[2])
  postMessage(system)
}
