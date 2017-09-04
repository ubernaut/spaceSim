import { randomUniform } from '-/utils'

const createPlanet = ({ radius, position }) => {
  const geometry = new THREE.SphereGeometry(radius, 16, 16)
  const material = new THREE.MeshPhongMaterial({
    color: randomUniform(0.5, 1) * 0xffffff
  })
  const planet = new THREE.Mesh(geometry, material)

  planet.position.x = position.x
  planet.position.y = position.y
  planet.position.z = position.z

  return planet
}

export {
  createPlanet
}
