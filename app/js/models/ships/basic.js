import { Vector3 } from 'three'
import { GPUParticleSystem } from 'app/js/webgl/gpu-particle-system'
import 'three/examples/js/loaders/GLTFLoader'

export const create = ({ position, scale, rotation, loader }) => {
  loader = loader || new THREE.GLTFLoader()
  return new Promise(resolve => {
    loader.load('app/assets/models/ship.glb', ship => {
      ship.scene.position.set(position.x, position.y, position.z)
      ship.scene.scale.set(scale.x, scale.y, scale.z)
      ship.scene.rotation.set(rotation.x, rotation.y, rotation.z)

      try {
        const emitter = new GPUParticleSystem({
          maxParticles: 25000
        })
        emitter.init()
        ship.scene.add(emitter)
        emitter.rotation.set(0, 0, 0)
        emitter.position.set(0, 0.5, 3)
        resolve({
          ship: ship.scene,
          emitter
        })
      } catch (err) {
        console.error('error creating emitter', err)
      }
    })
  })
}

const particleOptions = {
  position: new Vector3(0, 0, 0),
  positionRandomness: 0.3,
  velocity: new Vector3(0, 0, 10),
  velocityRandomness: 0,
  color: 0xff5500,
  turbulence: 0,
  lifetime: 1,
  sizeRandomness: 1
}

const particleEmitterOptions = {
  spawnRate: 600
}

export const animate = ({
  ship,
  emitter,
  movementSpeed,
  thrustColor,
  delta,
  tick
}) => {
  const options = Object.assign({}, particleOptions, {
    position: {
      x: Math.random() * 0.5 - 0.25,
      y: Math.random() * 0.5 - 0.25,
      z: Math.random() * 0.5
    },
    velocity: new Vector3(
      0,
      0,
      Math.max(1, Math.min(1e3, movementSpeed * 1e-5))
    ),
    size: Math.max(5, Math.min(50, movementSpeed * 1e-4)),
    color: thrustColor
  })

  if (emitter) {
    for (var x = 0; x < particleEmitterOptions.spawnRate * delta; x++) {
      emitter.spawnParticle(options)
    }
    emitter.update(tick)
  }
}
