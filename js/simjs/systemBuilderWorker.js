import { System } from './systemBuilder'

self.onmessage = e => {
  console.log('in worker')
  const system = new System(1, 1, 128, 1, 0.02)
  postMessage(system)
}
