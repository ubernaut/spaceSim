import { System } from '-/sim/systemBuilder'


self.onmessage = function(e) {

  const system = new System(1, 1, e.data, 0.5, 0.03)
  postMessage(system)
}
