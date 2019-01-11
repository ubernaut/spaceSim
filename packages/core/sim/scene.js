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
const animate = ({ delta, scene, systemWorker, useGpuCollisions = false }) => {
  let physics = systemWorker.physics

  if (!scene || !physics) {
    return
  }

  systemWorker.postMessage([ 'fetch' ])

  systemWorker.onmessage = e => {
    physics.dt = e.data[0]
    physics.metric = e.data[2]
    physics.collisions = e.data[3]
    physics.gridSystem = e.data[4]
    physics.maxMark = e.data[5]
    physics.fitness = e.data[6]
    physics.sumFit = e.data[7]
    physics.t = e.data[8]
    physics.count = e.data[9]
    physics.tryCount = e.data[10]
    physics.gpuCollisions = e.data[11]
    physics.biggestBody = e.data[12]

    updateSystemCPU(scene, physics)
  }
}

export { addLights, animate, createUniverse, squareGrid }
