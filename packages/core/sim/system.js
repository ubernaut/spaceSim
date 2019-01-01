import Promise from 'bluebird'

import soPhysics from '@void/core/system-builder/soPhysics'
import { convertSystemToMeters } from '@void/core/system-builder/utils'

import { createRandomStar } from '-/bodies/star'
import { createPlanet } from '-/bodies/planet'
import { randomUniform } from '-/utils'
import SystemBuilderWorker from '-/workers/systemBuilder.worker'

const loadSystem = ({ gpuCollisions }) => {
  let bodyCount = 1024
  if (Void.urlConfigs.hasOwnProperty('bodyCount')) {
    if (Number.isInteger(parseInt(Void.urlConfigs.bodyCount))) {
      bodyCount = Void.urlConfigs.bodyCount
    }
  }
  let bodyDistance = 1
  if (Void.urlConfigs.hasOwnProperty('bodyDistance')) {
    if (Number.isInteger(parseInt(Void.urlConfigs.bodyDistance))) {
      bodyDistance = Void.urlConfigs.bodyDistance
    }
  }
  let bodySpeed = 0.05
  if (Void.urlConfigs.hasOwnProperty('bodySpeed')) {
    if (Number.isInteger(parseInt(Void.urlConfigs.bodySpeed))) {
      bodySpeed = Void.urlConfigs.bodySpeed
    }
  }
  let deltaT = 0.005
  if (Void.urlConfigs.hasOwnProperty('deltaT')) {
    if (Number.isInteger(parseInt(Void.urlConfigs.deltaT))) {
      deltaT = Void.urlConfigs.deltaT
    }
  }

  const systemWorker = new SystemBuilderWorker()

  systemWorker.postMessage([ Math.round(bodyCount / 4), bodyDistance, bodySpeed ])
  systemWorker.onmessage = e => {
    Void.thisSystem = e.data

    const metersBodies = convertSystemToMeters(Void.thisSystem)
    Void.thisSystem.bodies = metersBodies

    Void.soPhysics = new soPhysics(
      Void.thisSystem,
      0,
      deltaT,
      true,
      true,
      gpuCollisions
    )

    for (var i = 0; i < Void.soPhysics.gridSystem.rad.length; i++) {
      Void.soPhysics.gridSystem.rad[
        i
      ] = Void.soPhysics.computeRadiusStellarToMetric(
        Void.soPhysics.gridSystem.mass[i]
      )
    }

    if (Void.urlConfigs.hasOwnProperty('CPU')) {
      Void.soPhysics.initGPUStuff()
    }

    const mkBody = body => {
      body.radius = Void.soPhysics.computeRadiusStellarToMetric(body.mass)
      if (body.name === 'star') {
        let scaleGrid = []

        scaleGrid.push(
          new THREE.PolarGridHelper(58000000000, 1, 1, 128, 0x000000, 0x999999)
        )
        scaleGrid.push(
          new THREE.PolarGridHelper(108000000000, 1, 1, 128, 0x000000, 0xff5555)
        )
        scaleGrid.push(
          new THREE.PolarGridHelper(150000000000, 1, 1, 128, 0x000000, 0x9999ff)
        )
        scaleGrid.push(
          new THREE.PolarGridHelper(
            227000000000,
            1,
            1,
            128,
            0x000000,
            0xff9900f
          )
        )
        scaleGrid.push(
          new THREE.PolarGridHelper(778000000000, 1, 1, 128, 0x000000, 0xff9999)
        )
        scaleGrid.push(
          new THREE.PolarGridHelper(
            1427000000000,
            1,
            1,
            128,
            0x000000,
            0xffff99
          )
        )
        scaleGrid.push(
          new THREE.PolarGridHelper(
            2871000000000,
            1,
            1,
            128,
            0x000000,
            0x99ffff
          )
        )
        scaleGrid.push(
          new THREE.PolarGridHelper(
            4497000000000,
            1,
            1,
            128,
            0x000000,
            0x0000ff
          )
        )
        scaleGrid.push(
          new THREE.PolarGridHelper(
            5913000000000,
            1,
            1,
            128,
            0x000000,
            0xffffff
          )
        )

        for (var grid of scaleGrid) {
          grid.rotation.x = Math.PI / 2
          Void.scene.add(grid)
        }

        // const star = createRandomStar({ radius: 6*body.radius, position: body.position, time: Void.time })
        const star = createRandomStar({
          radius: 1,
          position: body.position,
          time: Void.time
        })
        star.chromosphere.scale.set(body.radius, body.radius, body.radius)

        body.object = star.chromosphere
        star.chromosphere.add(star.pointLight)
        // Void.scene.add(star.photosphere)
        Void.scene.add(star.chromosphere)
        // Void.scene.add()
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
    Promise.map(
      Void.thisSystem.bodies,
      body => Promise.resolve(mkBody(body)).delay(Math.random() * 2),
      { concurrency: 12 }
    )
  }
  Void.systemLoaded = true
  Void.biggestBody = 0
}

const updateSystemCPU = () => {
  let i = 0
  var biggestBody = ''
  for (const body of Void.thisSystem.bodies) {
    body.velocity = Void.soPhysics.gridSystem.vel[i]
    body.mass = Void.soPhysics.gridSystem.mass[i]
    body.position.x = Void.soPhysics.gridSystem.pos[i][0]
    body.position.y = Void.soPhysics.gridSystem.pos[i][1]
    body.position.z = Void.soPhysics.gridSystem.pos[i][2]
    body.radius = Void.soPhysics.gridSystem.rad[i]
    body.name = Void.soPhysics.gridSystem.names[i]
    if (Void.soPhysics.gridSystem.names[i] === 'DELETED') {
      Void.scene.remove(body.object)
      // console.log('removed body')
      body.object = ''
    } else if (body.object) {
      let collidedIndex = Void.soPhysics.collisions.indexOf(body.name)
      if (collidedIndex !== -1) {
        Void.soPhysics.collisions.splice(collidedIndex, 1)
        if (body.name !== 'star') {
          Void.scene.remove(body.object)
          body.radius = Void.soPhysics.gridSystem.rad[i]
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
          Void.scene.add(planet)

          body.object.position.x = Void.soPhysics.gridSystem.pos[i][0]
          body.object.position.y = Void.soPhysics.gridSystem.pos[i][1]
          body.object.position.z = Void.soPhysics.gridSystem.pos[i][2]
        } else {
          // console.log(body.object.scale.x)
          body.radius = Void.soPhysics.gridSystem.rad[i]
          Void.thisSystem.bodies[0].radius = body.radius
          Void.thisSystem.bodies[0].object.scale.set(
            body.radius,
            body.radius,
            body.radius
          )
          body.object.scale.set(body.radius, body.radius, body.radius)
          // console.log(body.object.scale.x)
        }
      } else {
        body.object.position.x = Void.soPhysics.gridSystem.pos[i][0]
        body.object.position.y = Void.soPhysics.gridSystem.pos[i][1]
        body.object.position.z = Void.soPhysics.gridSystem.pos[i][2]
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

const updateSystemGPU = () => {
  let i = 0

  for (const body of Void.thisSystem.bodies) {
    // if (Void.soPhysics.gridSystem.names[i] === 'DELETED') {
    //   Void.scene.remove(body.object)
    //   // console.log('removed body')
    //   body.object = ''
    // }
    // else
    if (body.object) {
      body.object.position.x = Void.soPhysics.gridSystem.pos[i][0]
      body.object.position.y = Void.soPhysics.gridSystem.pos[i][1]
      body.object.position.z = Void.soPhysics.gridSystem.pos[i][2]
    }
    i++
  }
}

export { updateSystemCPU, updateSystemGPU, loadSystem }
