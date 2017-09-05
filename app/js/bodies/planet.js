import { randomUniform } from '-/utils'

import earth from 'app/assets/images/planets/earth.jpg'
import jupiter from 'app/assets/images/planets/jupiter.jpg'
import mars from 'app/assets/images/planets/mars.jpg'
import mercury from 'app/assets/images/planets/mercury.jpg'
import neptune from 'app/assets/images/planets/neptune.jpg'
import pluto from 'app/assets/images/planets/pluto.jpg'
import saturn from 'app/assets/images/planets/saturn.jpg'
import uranus from 'app/assets/images/planets/uranus.jpg'
import venus from 'app/assets/images/planets/venus.jpg'

const planetTextures = [
  earth,
  jupiter,
  mars,
  mercury,
  neptune,
  pluto,
  saturn,
  uranus,
  venus
]

const planetMaterials = planetTextures.map(t => {
  return new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture(t)
  })
})

const randomMaterial = () => planetMaterials[Math.floor(Math.random() * planetMaterials.length)]

const createPlanet = ({ radius, position }) => {
  const geometry = new THREE.SphereGeometry(radius, 16, 16)

  const material = randomMaterial().clone()
  // material.color.set(randomUniform(0.5, 1) * 0xffffff)
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
