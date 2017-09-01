import { System } from './systemBuilder'

self.onmessage = e => {
  console.log('in worker')
  const system = new System(1, 1, 128, .5, 0.03)
  postMessage(system)
}
