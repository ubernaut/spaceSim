import { GPUParticleSystem } from 'app/js/webgl/gpu-particle-system'
import { onProgress, onError } from 'app/js/utils'

const shipPolarGrid = ship => {
  const helper = new THREE.PolarGridHelper(2000, 1, 6, 36, 0xfffff, 0xfffff)
  helper.geometry.rotateY(Math.PI)
  return helper
}

const particleOptions = {
  position: new THREE.Vector3(0, 0, 0),
  positionRandomness: 0.3,
  velocity: new THREE.Vector3(0, 0, 1),
  velocityRandomness: 0.2,
  color: 0xff5500,
  turbulence: 0.1,
  lifetime: 7,
  size: 25,
  sizeRandomness: 0.5
}

const particleEmitterOptions = {
  spawnRate: 200
}

const animateShip = (emitter) => (delta, tick) => {
  const options = Object.assign({}, particleOptions, {
    position: {
      x: (Math.random() * 0.5) - 0.25,
      y: (Math.random() * 0.5) - 0.25,
      z: Math.random() * 0.5
    },
    size: Math.max(5, Math.min(20.0, 10.0 * Void.controls.movementSpeed * 0.000000001))
  })
  for (var x = 0; x < particleEmitterOptions.spawnRate * delta; x++) {
    emitter.spawnParticle(options)
  }
  emitter.update(tick)
}

// kinda above things, looking towards the sun
const defaults = {
  position: new THREE.Vector3(0, -5000000000, 3000000000),
  scale: new THREE.Vector3(20, 20, 20),
  rotation: new THREE.Vector3(1, -0.25, -0.25)
}

const createShip = ({ position, scale, rotation }) => {
  position = position || defaults.position
  scale = scale || defaults.scale
  rotation = rotation || defaults.rotation

  const mtlLoader = new THREE.MTLLoader()
  const objLoader = new THREE.OBJLoader()
  mtlLoader.setPath(Void.config.threejs.assetPath)
  objLoader.setPath(Void.config.threejs.assetPath)

  return new Promise(resolve => {
    mtlLoader.load('ship.mtl', materials => {
      materials.preload()
      objLoader.setMaterials(materials)
      objLoader.load('ship.obj', ship => {
        ship.position.set(position.x, position.y, position.z)
        ship.scale.set(scale.x, scale.y, scale.z)
        ship.rotation.set(rotation.x, rotation.y, rotation.z)
        ship.name = 'spaceShip'

        const emitter = new GPUParticleSystem({
          maxParticles: 25000
        })
        ship.add(emitter)
        emitter.rotation.set(0, 0, 0)
        emitter.position.set(0, 0.5, 3)

        resolve({
          ship,
          animate: animateShip(emitter)
        })
      }, onProgress, onError)
    })
  })
}

export {
  createShip
}
