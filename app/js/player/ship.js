import { PolarGridHelper, Vector3, Color } from 'three'
import GLTFLoader from 'three/examples/js/loaders/GLTFLoader'
import { GPUParticleSystem } from 'app/js/webgl/gpu-particle-system'
import { onProgress, onError } from 'app/js/utils'
import state from '-/state'
import sceneState from '-/state/branches/scene'

const loader = new THREE.GLTFLoader()

const shipPolarGrid = ship => {
  const helper = new PolarGridHelper(2000, 1, 6, 36, 0xfffff, 0xfffff)
  helper.geometry.rotateY(Math.PI)
  return helper
}

/**
 * deploy a small drone object next to the player
 */
const deployDrone = ship => createDroneOpts => {
  const drone = createDrone(createDroneOpts)
  ship.add(drone.mesh)
  drone.mesh.position.set(5, 5, 5)
}

const particleOptions = {
  position: new Vector3(0, 0, 0),
  positionRandomness: 0.3,
  velocity: new Vector3(0, 0, 10),
  velocityRandomness: 0,
  color: 0xff5500,
  turbulence: 0,
  lifetime: 1,
  // size: 1,
  sizeRandomness: 1
}

const particleEmitterOptions = {
  spawnRate: 600
}

const animateShip = (ship, emitter) => (delta, tick) => {
  const movementSpeed = sceneState.get([ 'player', 'ship', 'movementSpeed' ])
  const { color: bodyColor } = sceneState.get([ 'player', 'ship', 'hull' ])
  const { color: thrustColor } = sceneState.get([ 'player', 'ship', 'thrust' ])

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

  // ship.children[1].material.color = new Color(bodyColor)
}

// kinda above things, looking towards the sun
const defaults = {
  position: new Vector3(0, -1e9, 1e9),
  scale: new Vector3(20, 20, 20),
  rotation: new Vector3(1, -0.25, -0.25)
}

const createShip = ({ position, scale, rotation } = defaults) => {
  position = position || defaults.position
  scale = scale || defaults.scale
  rotation = rotation || defaults.rotation

  return new Promise(resolve => {
    loader.load(
      'app/assets/models/ship.glb',
      ship => {
        ship.scene.position.set(position.x, position.y, position.z)
        ship.scene.scale.set(scale.x, scale.y, scale.z)
        ship.scene.rotation.set(rotation.x, rotation.y, rotation.z)
        ship.scene.name = 'spaceShip'

        let emitter
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
            animate: animateShip(ship.scene, emitter)
          })
        } catch (err) {
          console.error('error creating emitter', err)
        }
      },
      onProgress,
      onError
    )
    // })
  })
}

export { createShip, deployDrone }
