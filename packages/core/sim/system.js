import { PolarGridHelper } from 'three'
import Promise from 'bluebird'

import soPhysics from '@void/core/system-builder/soPhysics'
import {
  convertSystemToMeters,
  computeRadiusStellarToMetric
} from '@void/core/system-builder/utils'

import { createRandomStar } from '-/bodies/star'
import { createPlanet } from '-/bodies/planet'
import { randomUniform } from '-/utils'
import SystemBuilderWorker from '-/workers/systemBuilder.worker'

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

const mkBody = systemBody => {
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
    const planet = createPlanet({
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

let system = null

const loadSystem = ({
  scene,
  bodyCount = 0,
  bodyDistance = 1,
  bodySpeed = 0.05,
  deltaT = 0.005,
  useCuda = true,
  gpuCollisions,
  concurrency = 24,
  addAnimateCallback
}) => {
  let systemWorker = new SystemBuilderWorker()

  systemWorker.postMessage([
    'init',
    Math.round(bodyCount / 4),
    bodyDistance,
    bodySpeed
  ])
  return new Promise((resolve, reject) => {
    systemWorker.onmessage = e => {
      system = e.data

      const metersBodies = convertSystemToMeters(system)
      system.bodies = metersBodies

      systemWorker.physics = new soPhysics(
        system,
        0,
        deltaT,
        true,
        true,
        gpuCollisions
      )

      systemWorker.physics.gridSystem.rad.map((_, i) => {
        systemWorker.physics.gridSystem.rad[i] = computeRadiusStellarToMetric(
          systemWorker.physics.gridSystem.mass[i]
        )
      })

      if (useCuda) {
        systemWorker.physics.initGPUStuff()
      }

      const systemAnimations = []
      Promise.map(
        system.bodies,
        systemBody => {
          const { bodies, animations } = mkBody(systemBody)
          bodies.map(b => scene.add(b))
          systemAnimations.push(...animations)
        },
        { concurrency }
      )

      resolve({ systemWorker, systemAnimations })
    }
  })
}

const updateSystemCPU = (scene, physics) => {
  let i = 0
  var biggestBody = ''
  // physics.convertToMetric()
  for (const body of system.bodies) {
    body.velocity = physics.gridSystem.vel[i]
    body.mass = physics.gridSystem.mass[i]
    body.position.x = physics.gridSystem.pos[i][0]
    body.position.y = physics.gridSystem.pos[i][1]
    body.position.z = physics.gridSystem.pos[i][2]
    body.radius = physics.gridSystem.rad[i]
    body.name = physics.gridSystem.names[i]
    if (physics.gridSystem.names[i] === 'DELETED') {
      scene.remove(body.object)
      // console.log('found deleted planet' + i)
      body.object = ''
    } else if (body.object) {
      let collidedIndex = physics.collisions.indexOf(body.name)
      if (collidedIndex !== -1) {
        physics.collisions.splice(collidedIndex, 1)
        if (body.name !== 'star') {
          scene.remove(body.object)
          body.radius = physics.gridSystem.rad[i]
          const bodyGeometry = new THREE.IcosahedronBufferGeometry(1, 2)
          let bodyMaterial = new THREE.MeshPhongMaterial({
            color: randomUniform(0.5, 1) * 0xffffff
          })
          const planet = new THREE.Mesh(bodyGeometry, bodyMaterial)
          planet.scale.set(body.radius, body.radius, body.radius)
          planet.position.x = body.position.x
          planet.position.y = body.position.y
          planet.position.z = body.position.z
          body.object = planet
          scene.add(planet)

          body.object.position.x = physics.gridSystem.pos[i][0]
          body.object.position.y = physics.gridSystem.pos[i][1]
          body.object.position.z = physics.gridSystem.pos[i][2]
        } else {
          body.radius = physics.gridSystem.rad[i]
          system.bodies[0].radius = body.radius
          system.bodies[0].object.scale.set(
            body.radius,
            body.radius,
            body.radius
          )
          body.object.scale.set(body.radius, body.radius, body.radius)
        }
      } else {
        body.object.position.x = physics.gridSystem.pos[i][0]
        body.object.position.y = physics.gridSystem.pos[i][1]
        body.object.position.z = physics.gridSystem.pos[i][2]
      }
    }

    i += 1

    if (biggestBody === '') {
      biggestBody = body
    } else {
      if (body.radius > biggestBody.radius) {
        biggestBody = body
        console.log(biggestBody)
        console.log(i)
        physics.biggestBody = i
      }
    }
  }
}

export { updateSystemCPU, updateSystemGPU, loadSystem }
