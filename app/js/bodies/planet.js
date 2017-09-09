import Promise from 'bluebird'

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

const basicPlanetTextures = [
  jupiter,
  mars,
  mercury,
  neptune,
  pluto,
  saturn,
  uranus,
  venus
]

const loadTextures = textureUrls => {
  const loader = new THREE.TextureLoader()
  return textureUrls.map(url => new Promise(resolve => loader.load(url, resolve)))
}

const loadEarthMesh = () => {
  const loader = new THREE.TextureLoader()
  return new Promise(resolve => {
    loader.load(earth, map => {
      loader.load(earthBump, specularMap => {
        loader.load(earthSpec, normalMap => {
          const material = new THREE.MeshPhongMaterial({
            map,
            specularMap,
            normalMap,
            specular: 0xeeddaa,
            shininess: 1
          })
          const geometry = new THREE.IcosahedronBufferGeometry(1, 2)
          const mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [ material ])
          resolve(mesh)
        })
      })
    })
  })
}

/**
 * Get a random planet mesh to add the scene
 */
const randomMesh = meshes => meshes[Math.floor(Math.random() * meshes.length)]

/**
 * Pre-load the planets
 */
const planetsMeshes = []

const loadPlanets = () => {
  const geometry = new THREE.IcosahedronGeometry(1, 2)

  return Promise.all(loadTextures(basicPlanetTextures))
    .then(textures => textures.map(map => new THREE.MeshPhongMaterial({ map })))
    .then(materials => materials.map(mat => new THREE.Mesh(geometry.clone(), mat, { castShadow: false })))
    .then(meshes => [ ...meshes, loadEarthMesh() ])
}

Promise.all(loadPlanets()).then(meshes => {
  Void.log.debug('loaded planet meshes')
  planetsMeshes.push(...meshes)
})

/**
 * Main creation method
 */
const createPlanet = ({ radius, position }) => {
  const planetMesh = randomMesh(planetsMeshes)

  if (planetMesh) {
    const planet = planetMesh.clone()
    if (planet.type === 'Group') {
      planet.children.map(c => {
        c.scale.set(radius, radius, radius)
        c.position.set(position.x, position.y, position.z)
        c.rotation.set(115, 0, 0)
      })
    } else {
      planet.scale.set(radius, radius, radius)
      planet.position.set(position.x, position.y, position.z)
      planet.rotation.set(115, 0, 0)
    }

    return planet
  }
}

export {
  createPlanet
}
