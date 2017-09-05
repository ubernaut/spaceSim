import { randomUniform } from '-/utils'

import earth from 'app/assets/images/planets/earth/earth-512x512.jpg'
import earthBump from 'app/assets/images/planets/earth/earth-512x512.bump.jpg'
import earthSpec from 'app/assets/images/planets/earth/earth-512x512.spec.jpg'

import jupiter from 'app/assets/images/planets/jupiter.jpg'
import mars from 'app/assets/images/planets/mars.jpg'
import mercury from 'app/assets/images/planets/mercury.jpg'
import neptune from 'app/assets/images/planets/neptune.jpg'
import pluto from 'app/assets/images/planets/pluto.jpg'
import saturn from 'app/assets/images/planets/saturn.jpg'
import uranus from 'app/assets/images/planets/uranus.jpg'
import venus from 'app/assets/images/planets/venus.jpg'

const planetTextures = [
  jupiter,
  mars,
  mercury,
  neptune,
  pluto,
  saturn,
  uranus,
  venus
]

const textureLoader = new THREE.TextureLoader()

const planetMaterials = []

planetTextures.map(t => {
  textureLoader.load(t, map => {
    planetMaterials.push(new THREE.MeshPhongMaterial({ map }))
  })
})

// earth: texture, spec map, bump map
textureLoader.load(earth, map => {
  textureLoader.load(earthBump, specularMap => {
    textureLoader.load(earthSpec, normalMap => {
      const earthMaterial = new THREE.MeshPhongMaterial({
        map,
        specularMap,
        normalMap,
        specular: new THREE.Color(0xffffff),
        shininess: 2
      })
      planetMaterials.push(earthMaterial)
    })
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
