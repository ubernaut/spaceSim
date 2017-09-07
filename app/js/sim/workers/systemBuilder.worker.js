import { System } from '-/sim/systemBuilder'

self.onmessage = e => {
  const system = new System(1, 1, 4096, 0.5, 0.03)
  postMessage(system)
}
