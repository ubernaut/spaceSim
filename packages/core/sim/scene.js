import { updateSystemCPU, updateSystemGPU } from './system'

/**
 * add default lights to a scene
 */
const addLights = scene => {
  const ambient = new THREE.AmbientLight(0x888888)
  scene.add(ambient)
}

/**
 * create a square grid for visualizing distances
 */
const squareGrid = () => {
  const size = 100000000
  const divisions = 1000
  const gridHelper1 = new THREE.GridHelper(size, divisions, 0xffffff, 0xfffff)
}

/**
 * add the universe object to the scene
 */
const createUniverse = scene => {
  const oortGeometry = new THREE.SphereGeometry(7.5 * Math.pow(10, 15), 32, 32)
  const oortMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 })
  const oort = new THREE.Mesh(oortGeometry, oortMaterial)

  const galaxyGeometry = new THREE.SphereGeometry(5 * Math.pow(10, 20), 32, 32)
  const galaxyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial)

  const universeGeometry = new THREE.SphereGeometry(
    4.4 * Math.pow(10, 26),
    32,
    32
  )
  const universeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const universe = new THREE.Mesh(universeGeometry, universeMaterial)

  return [ oort, galaxy, universe ]
}

/**
 * animate/update the objects in the scene
 */
const animate = ({
  delta,
  scene,
  physics,
  clock,
  composer,
  useCuda = false,
  useGpuCollisions = false,
  getAnimateCallbacks
}) => {
  if (!scene || !physics) {
    return
  }

  if (useCuda) {
    physics.accelerateCuda()
    updateSystemCPU()
  } else {
    physics.GPUAccelerate(useGpuCollisions)
    if (useGpuCollisions) {
      updateSystemGPU(scene, physics)
    } else {
      updateSystemCPU(scene, physics)
    }
  }

  // updateOimoPhysics()
}

export { addLights, animate, createUniverse, squareGrid }
