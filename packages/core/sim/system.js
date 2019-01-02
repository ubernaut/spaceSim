import Promise from 'bluebird'

import soPhysics from '@void/core/system-builder/soPhysics'
import { convertSystemToMeters } from '@void/core/system-builder/utils'

import { createRandomStar } from '-/bodies/star'
import { createPlanet } from '-/bodies/planet'
import { randomUniform } from '-/utils'
import SystemBuilderWorker from '-/workers/systemBuilder.worker'

const createScaleGrid = () => {
  return [
    new THREE.PolarGridHelper(58000000000, 1, 1, 128, 0x000000, 0x999999),
    new THREE.PolarGridHelper(108000000000, 1, 1, 128, 0x000000, 0xff5555),
    new THREE.PolarGridHelper(150000000000, 1, 1, 128, 0x000000, 0x9999ff),
    new THREE.PolarGridHelper(227000000000, 1, 1, 128, 0x000000, 0xff9900f),
    new THREE.PolarGridHelper(778000000000, 1, 1, 128, 0x000000, 0xff9999),
    new THREE.PolarGridHelper(1427000000000, 1, 1, 128, 0x000000, 0xffff99),
    new THREE.PolarGridHelper(2871000000000, 1, 1, 128, 0x000000, 0x99ffff),
    new THREE.PolarGridHelper(4497000000000, 1, 1, 128, 0x000000, 0x0000ff),
    new THREE.PolarGridHelper(5913000000000, 1, 1, 128, 0x000000, 0xffffff)
  ].map(grid => {
    grid.rotation.x = Math.PI / 2
    return grid
  })
}

const createStar = ({ radius, position }) => {
  const star = createRandomStar({
    radius: 1,
    position,
    time: Void.time
  })
  star.chromosphere.scale.set(radius, radius, radius)
  star.chromosphere.add(star.pointLight)
  return star
}

const mkBody = body => {
  body.radius = Void.soPhysics.computeRadiusStellarToMetric(body.mass)

  if (body.name === 'star') {
    createScaleGrid().map(grid => Void.scene.add(grid))

    const star = createStar({ radius: body.radius, position: body.position })
    body.object = star.chromosphere
    Void.scene.add(star.chromosphere)
    Void.animateCallbacks.push(star.animate)
  } else {
    const planet = createPlanet({
      radius: body.radius,
      position: body.position
    })
    if (planet) {
      body.object = planet
      Void.scene.add(planet)
    }
  }
}

let system = null

const loadSystem = ({
  bodyCount = 256,
  bodyDistance = 1,
  bodySpeed = 0.05,
  deltaT = 0.005,
  useCuda = false,
  gpuCollisions,
  concurrency = 12
}) => {
  const systemWorker = new SystemBuilderWorker()

  systemWorker.postMessage([ bodyCount, bodyDistance, bodySpeed ])
  systemWorker.onmessage = e => {
    system = e.data

    const metersBodies = convertSystemToMeters(system)
    system.bodies = metersBodies

    const physics = new soPhysics(system, 0, deltaT, true, true, gpuCollisions)

    physics.gridSystem.rad.map((_, i) => {
      physics.gridSystem.rad[i] = physics.computeRadiusStellarToMetric(
        physics.gridSystem.mass[i]
      )
    })

    if (useCuda) {
      physics.initGPUStuff()
    }

    Promise.map(
      system.bodies,
      body => Promise.resolve(mkBody(body)).delay(Math.random() * 2),
      { concurrency }
    )

    Void.soPhysics = physics
  }
}

const updateSystemCPU = (scene, soPhysics) => {
  let i = 0
  var biggestBody = ''
  for (const body of system.bodies) {
    body.velocity = soPhysics.gridSystem.vel[i]
    body.mass = soPhysics.gridSystem.mass[i]
    body.position.x = soPhysics.gridSystem.pos[i][0]
    body.position.y = soPhysics.gridSystem.pos[i][1]
    body.position.z = soPhysics.gridSystem.pos[i][2]
    body.radius = soPhysics.gridSystem.rad[i]
    body.name = soPhysics.gridSystem.names[i]
    if (soPhysics.gridSystem.names[i] === 'DELETED') {
      scene.remove(body.object)
      // console.log('removed body')
      body.object = ''
    } else if (body.object) {
      let collidedIndex = soPhysics.collisions.indexOf(body.name)
      if (collidedIndex !== -1) {
        soPhysics.collisions.splice(collidedIndex, 1)
        if (body.name !== 'star') {
          scene.remove(body.object)
          body.radius = soPhysics.gridSystem.rad[i]
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

          body.object.position.x = soPhysics.gridSystem.pos[i][0]
          body.object.position.y = soPhysics.gridSystem.pos[i][1]
          body.object.position.z = soPhysics.gridSystem.pos[i][2]
        } else {
          // console.log(body.object.scale.x)
          body.radius = soPhysics.gridSystem.rad[i]
          system.bodies[0].radius = body.radius
          system.bodies[0].object.scale.set(
            body.radius,
            body.radius,
            body.radius
          )
          body.object.scale.set(body.radius, body.radius, body.radius)
          // console.log(body.object.scale.x)
        }
      } else {
        body.object.position.x = soPhysics.gridSystem.pos[i][0]
        body.object.position.y = soPhysics.gridSystem.pos[i][1]
        body.object.position.z = soPhysics.gridSystem.pos[i][2]
      }
    }
    i++
    if (biggestBody == '') {
      biggestBody = body
    } else {
      if (body.radius > biggestBody.radius) {
        biggestBody = body
        console.log(biggestBody)
        console.log(i)
        Void.biggestBody = i
      }
    }
  }
}

const updateSystemGPU = (scene, soPhysics) => {
  let i = 0

  for (const body of system.bodies) {
    // if (Void.soPhysics.gridSystem.names[i] === 'DELETED') {
    //   Void.scene.remove(body.object)
    //   // console.log('removed body')
    //   body.object = ''
    // }
    // else
    if (body.object) {
      body.object.position.x = soPhysics.gridSystem.pos[i][0]
      body.object.position.y = soPhysics.gridSystem.pos[i][1]
      body.object.position.z = soPhysics.gridSystem.pos[i][2]
    }
    i++
  }
}

export { updateSystemCPU, updateSystemGPU, loadSystem }
