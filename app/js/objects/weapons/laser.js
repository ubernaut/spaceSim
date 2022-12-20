import { Vector3, Object3D } from 'three'
import { GPUParticleSystem } from '-/objects/gpu-particle-system'
import { doTimesP } from '-/utils'
import Promise from 'bluebird'

export const createLaser = () => {
  try {
    const laser = new Object3D()
    const emitter = new GPUParticleSystem({
      maxParticles: 2000
    })
    emitter.init()
    laser.add(emitter)
    emitter.rotation.set(0, 0, 0)
    emitter.position.set(0, 0, 0)
    return {
      laser,
      emitter
    }
  } catch (err) {
    console.error('error creating emitter', err)
  }
}

const particleOptions = {
  position: new Vector3(0, 0, 10),
  positionRandomness: 0,
  velocity: new Vector3(0, 0, -5e3),
  velocityRandomness: 0,
  color: 0x00ff00,
  turbulence: 0,
  lifetime: 0.1,
  size: 30,
  sizeRandomness: 0
}

export const shootLaser = ({ emitter }) => {
  return new Promise(() => {
    doTimesP(
      50,
      () => Promise.resolve(emitter.spawnParticle(particleOptions)),
      {
        concurrency: 7
      }
    )
  })
}

export const animateLaser = ({ emitter, tick }) => {
  emitter.update(tick)
}
