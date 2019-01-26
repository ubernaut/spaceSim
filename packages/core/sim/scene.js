import {
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  GridHelper,
  AmbientLight
} from 'three'

/**
 * add default lights to a scene
 */
const addLights = scene => {
  const ambient = new AmbientLight(0x888888)
  scene.add(ambient)
}

/**
 * create a square grid for visualizing distances
 */
const squareGrid = () => {
  const size = 100000000
  const divisions = 1000
  const gridHelper1 = new GridHelper(size, divisions, 0xffffff, 0xfffff)
}

/**
 * add the universe object to the scene
 */
const createUniverse = scene => {
  const oortGeometry = new SphereGeometry(7.5 * Math.pow(10, 15), 32, 32)
  const oortMaterial = new MeshBasicMaterial({ color: 0x555555 })
  const oort = new Mesh(oortGeometry, oortMaterial)

  const galaxyGeometry = new SphereGeometry(5 * Math.pow(10, 20), 32, 32)
  const galaxyMaterial = new MeshBasicMaterial({ color: 0xffffff })
  const galaxy = new Mesh(galaxyGeometry, galaxyMaterial)

  const universeGeometry = new SphereGeometry(4.4 * Math.pow(10, 26), 32, 32)
  const universeMaterial = new MeshBasicMaterial({ color: 0xff0000 })
  const universe = new Mesh(universeGeometry, universeMaterial)

  return [ oort, galaxy, universe ]
}

export { addLights, createUniverse, squareGrid }
