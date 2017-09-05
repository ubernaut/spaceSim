import { randomUniform } from '-/utils'
import earthTexture from 'app/assets/images/earthmoon.jpg'

const earthMaterial = new THREE.MeshPhongMaterial({
  color: randomUniform(0.5, 1) * 0xffffff,
  fog: true,
  map: THREE.ImageUtils.loadTexture(earthTexture)
})

const createPlanet = ({ radius, position }) => {
  const geometry = new THREE.SphereGeometry(radius, 16, 16)

  const material = earthMaterial.clone()
  material.color.set(randomUniform(0.5, 1) * 0xffffff)
  const planet = new THREE.Mesh(geometry, material, {
    castShadow: true
  })

  planet.position.x = position.x
  planet.position.y = position.y
  planet.position.z = position.z

  return planet
}

export {
  createPlanet
}
