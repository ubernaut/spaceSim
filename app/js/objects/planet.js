import Promise from 'bluebird'
import {
  TextureLoader,
  MeshPhongMaterial,
  IcosahedronGeometry,
  IcosahedronBufferGeometry,
  Mesh
} from 'three'

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

import { pickRand } from '-/utils'

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

const loadTextures = async textureUrls => {
  const loader = new TextureLoader()
  const textures = []
  for (const url of textureUrls) {
    const texture = await new Promise(resolve => loader.load(url, resolve))
    textures.push(texture)
  }
  return textures
}

const loadEarthMesh = () => {
  const loader = new TextureLoader()
  return new Promise(resolve => {
    loader.load(earth, map => {
      loader.load(earthBump, specularMap => {
        loader.load(earthSpec, normalMap => {
          const material = new MeshPhongMaterial({
            map,
            specularMap,
            normalMap,
            specular: 0xeeddaa,
            shininess: 1
          })
          const geometry = new IcosahedronBufferGeometry(1, 2)
          const mesh = new Mesh(geometry, material, { castShadow: false })
          resolve(mesh)
        })
      })
    })
  })
}

/**
 * Pre-load the planets
 */
const planetsMeshes = []

export const loadPlanets = async () => {
  const geometry = new IcosahedronGeometry(1, 2)

  const textures = await loadTextures(basicPlanetTextures)
  const meshes = textures.map(texture => {
    const material = new MeshPhongMaterial({ map: texture })
    return new Mesh(geometry.clone(), material, { castShadow: false })
  })

  planetsMeshes.push(...meshes, await loadEarthMesh())

  return planetsMeshes
}

/**
 * Main creation method
 */
export const createPlanet = async ({ radius, position }) => {
  const planetMesh = pickRand(planetsMeshes)

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
      planet.name = 'Planet'
    }

    return planet
  }
}
