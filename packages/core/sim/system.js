import soPhysics from '@void/core/system-builder/soPhysics'
import {
  convertSystemToMeters,
  computeRadiusStellarToMetric
} from '@void/core/system-builder/utils'

import { randomUniform } from '-/utils'
import SystemBuilderWorker from '-/workers/systemBuilder.worker'

let system = null

const loadSystem = ({
  bodyCount = 0,
  bodyDistance = 1,
  bodySpeed = 0.05,
  deltaT = 0.005,
  useCuda = true,
  gpuCollisions
}) => {
  let systemWorker = new SystemBuilderWorker()

  systemWorker.postMessage([
    'init',
    Math.round(bodyCount / 4),
    bodyDistance,
    bodySpeed
  ])
  return new Promise((resolve, reject) => {
    systemWorker.onmessage = async e => {
      system = e.data

      const systemBodies = convertSystemToMeters(system)
      system.bodies = systemBodies

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

      resolve({ systemWorker, systemBodies })
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

export { updateSystemCPU, loadSystem }
