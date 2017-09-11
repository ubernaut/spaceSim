import { System } from '-/sim/systemBuilder'


self.onmessage = function(e) {

  const system = new System(1, 1, e.data, 1, 0.05)
  postMessage(system)
}
