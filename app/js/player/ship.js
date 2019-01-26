import { GPUParticleSystem } from 'app/js/webgl/gpu-particle-system'
import { onProgress, onError } from 'app/js/utils'
import state from '-/state'
import sceneState from '-/state/branches/scene'

const assetPath = state.get([ 'config', 'threejs', 'assetPath' ])

const mtlLoader = new THREE.MTLLoader()
const objLoader = new THREE.OBJLoader()
mtlLoader.setPath(assetPath)
objLoader.setPath(assetPath)

const shipPolarGrid = ship => {
  const helper = new THREE.PolarGridHelper(2000, 1, 6, 36, 0xfffff, 0xfffff)
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
  position: new THREE.Vector3(0, 0, 0),
  positionRandomness: 0.3,
  velocity: new THREE.Vector3(0, 0, 10),
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
    velocity: new THREE.Vector3(
      0,
      0,
      Math.max(1, Math.min(1e3, movementSpeed * 1e-5))
    ),
    size: Math.max(5, Math.min(50, movementSpeed * 1e-4)),
    color: thrustColor
  })
  for (var x = 0; x < particleEmitterOptions.spawnRate * delta; x++) {
    emitter.spawnParticle(options)
  }
  emitter.update(tick)

  ship.children[1].material.color = new THREE.Color(bodyColor)
}

// kinda above things, looking towards the sun
const defaults = {
  position: new THREE.Vector3(0, -1e9, 1e9),
  scale: new THREE.Vector3(20, 20, 20),
  rotation: new THREE.Vector3(1, -0.25, -0.25)
}

const createShip = ({ position, scale, rotation } = defaults) => {
  position = position || defaults.position
  scale = scale || defaults.scale
  rotation = rotation || defaults.rotation

  return new Promise(resolve => {
    mtlLoader.load('ship.mtl', materials => {
      materials.preload()
      objLoader.setMaterials(materials)
      objLoader.load(
        'ship.obj',
        ship => {
          ship.position.set(position.x, position.y, position.z)
          ship.scale.set(scale.x, scale.y, scale.z)
          ship.rotation.set(rotation.x, rotation.y, rotation.z)
          ship.name = 'spaceShip'

          const emitter = new GPUParticleSystem({
            maxParticles: 250000
          })
          ship.add(emitter)
          emitter.rotation.set(0, 0, 0)
          emitter.position.set(0, 0.5, 3)

          resolve({
            ship,
            animate: animateShip(ship, emitter)
          })
        },
        onProgress,
        onError
      )
    })
  })
}

export { createShip, deployDrone }
