import {
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  GridHelper,
  AmbientLight,
  PolarGridHelper
} from 'three'

import { computeRadiusStellarToMetric } from '@void/core/system-builder/utils'
import { createRandomStar } from '-/objects/stars/standard-star'
import { createPlanet } from '-/objects/planet'

const createScaleGrid = () => {
  return [
    new PolarGridHelper(58000000000, 1, 1, 128, 0x000000, 0x999999),
    new PolarGridHelper(108000000000, 1, 1, 128, 0x000000, 0xff5555),
    new PolarGridHelper(150000000000, 1, 1, 128, 0x000000, 0x9999ff),
    new PolarGridHelper(227000000000, 1, 1, 128, 0x000000, 0xff9900f),
    new PolarGridHelper(778000000000, 1, 1, 128, 0x000000, 0xff9999),
    new PolarGridHelper(1427000000000, 1, 1, 128, 0x000000, 0xffff99),
    new PolarGridHelper(2871000000000, 1, 1, 128, 0x000000, 0x99ffff),
    new PolarGridHelper(4497000000000, 1, 1, 128, 0x000000, 0x0000ff),
    new PolarGridHelper(5913000000000, 1, 1, 128, 0x000000, 0xffffff)
  ].map(grid => {
    grid.name = 'PolarGridHelper'
    grid.rotation.x = Math.PI / 2
    return grid
  })
}

const createStar = ({ radius, position }) => {
  const star = createRandomStar({
    radius: 1,
    position,
    time: { value: 0 }
  })
  star.chromosphere.scale.set(radius, radius, radius)
  star.chromosphere.add(star.pointLight)
  star.corona.scale.set(radius, radius, radius)
  return star
}

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

const mkBody = async systemBody => {
  const bodies = []
  const animations = []

  systemBody.radius = computeRadiusStellarToMetric(systemBody.mass)

  if (systemBody.name === 'star') {
    const gridObjects = createScaleGrid()
    bodies.push(...gridObjects)

    const star = createStar({
      radius: systemBody.radius,
      position: systemBody.position
    })
    systemBody.object = star.chromosphere
    bodies.push(star.chromosphere)

    if (star.corona) {
      bodies.push(star.corona)
    }
    animations.push(star.animate)
    return { bodies, animations }
  }

  if (systemBody.name) {
    const planet = await createPlanet({
      radius: systemBody.radius,
      position: systemBody.position
    })
    if (planet) {
      systemBody.object = planet
      bodies.push(planet)
    }
    return { bodies, animations }
  }

  return {
    bodies,
    animations
  }
}

export { addLights, createUniverse, squareGrid, mkBody }
