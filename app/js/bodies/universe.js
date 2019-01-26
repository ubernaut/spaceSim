import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

const createUniverse = () => {
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

export { createUniverse }
