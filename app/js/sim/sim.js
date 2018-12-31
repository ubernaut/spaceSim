import Promise from 'bluebird'

import { createStar, createRandomStar } from '-/bodies/star'
import { createPlanet } from '-/bodies/planet'
import { createUniverse } from '-/bodies/universe'
import { createGalaxy, addStars } from '-/bodies/galaxy'
import * as controls from '-/player/controls'
import { createGamepadControls } from '-/player/controls/gamepad-controls'
import * as weapons from '-/player/weapons'
import { createShip } from '-/player/ship'
import { createDrone } from '-/player/drone'
import { getAllConfigVars, randomUniform } from '-/utils'
import { soPhysics, convertSystemToMeters } from './systemBuilder'
import SystemBuilderWorker from './workers/systemBuilder.worker'
// import {getConfig} from './systemBuilder'
// import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { EffectComposer, BloomPass, RenderPass } from 'postprocessing'

let renderer
// let world = null

const animateCallbacks = []

const loadSystem = () => {
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

    Void.soPhysics = new soPhysics(Void.thisSystem, 0, deltaT, true, true)

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
        animateCallbacks.push(star.animate)
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

const initOimoPhysics = () => {
  // world setting:( TimeStep, BroadPhaseType, Iterations )
  // BroadPhaseType can be
  // 1 : BruteForce
  // 2 : Sweep and prune , the default
  // 3 : dynamic bounding volume tree
  return new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2,
    worldscale: 1,
    random: true,
    info: false,
    gravity: [ 0, 0, 0 ]
  })
  // populate(1);
  // setInterval(updateOimoPhysics, 1000/60);
}

const addLights = scene => {
  const ambient = new THREE.AmbientLight(0x888888)
  scene.add(ambient)
}

const squareGrid = () => {
  const size = 100000000
  const divisions = 1000
  const gridHelper1 = new THREE.GridHelper(size, divisions, 0xffffff, 0xfffff)
}

const addPostprocessing = ({ renderer, scene, camera }) => {
  // postprocessing
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  const bloomPass = new BloomPass({
    resolutionScale: 0.05,
    kernelSize: 3.0,
    intensity: 0.3,
    distinction: 1
  })
  bloomPass.renderToScreen = true
  bloomPass.combineMaterial.defines.SCREEN_MODE = '1'
  bloomPass.combineMaterial.needsUpdate = true
  composer.addPass(bloomPass)
}

const addUniverse = scene => {
  const oortGeometry = new THREE.SphereGeometry(7.5 * Math.pow(10, 15), 32, 32)
  const oortMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 })
  const oort = new THREE.Mesh(oortGeometry, oortMaterial)
  // scene.add(oort)

  const galaxyGeometry = new THREE.SphereGeometry(5 * Math.pow(10, 20), 32, 32)
  const galaxyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial)
  // scene.add(galaxy)

  const universeGeometry = new THREE.SphereGeometry(
    4.4 * Math.pow(10, 26),
    32,
    32
  )
  const universeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const universe = new THREE.Mesh(universeGeometry, universeMaterial)
  // scene.add(universe)

  return [ oort, galaxy, universe ]
}

const deployDrone = ship => createDroneOpts => {
  const drone = createDrone(createDroneOpts)
  ship.add(drone.mesh)
  drone.mesh.position.set(5, 5, 5)
}

let composer
const init = rootEl => {
  // renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true
    // shadowMapEnabled: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  // camera
  const IAU = 9.4607 * Math.pow(10, 15)
  const farClip = 5 * IAU
  const camera = (Void.camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    farClip
  ))

  // scene
  const scene = (Void.scene = new THREE.Scene())
  addLights(scene)

  // ship
  createShip({ controls }).then(({ ship, animate }) => {
    // console.log(ship)
    Void.ship = ship
    Void.ship.add(Void.camera)
    Void.camera.position.set(0, 10, 30)
    scene.add(ship)
    animateCallbacks.push(animate)

    if (Void.urlConfigs.hasOwnProperty('gamepad')) {
      Void.controls = createGamepadControls(
        Void.ship,
        rootEl,
        weapons.shoot,
        deployDrone(ship)
      )
    } else {
      Void.controls = controls.setFlyControls({
        camera: Void.camera,
        ship: Void.ship,
        el: rootEl
      })
    }
  })

  // all other matter
  createUniverse(scene).map(body => scene.add(body))

  // postprocessing
  addPostprocessing({ renderer, scene, camera })

  // attach to the dom
  rootEl.appendChild(renderer.domElement)
  let starflag = true
  if (Void.urlConfigs.hasOwnProperty('stars')) {
    if (Void.urlConfigs.stars === 'false') {
      starflag = false
    }
  }
  if (starflag) {
    Void.galaxy = createGalaxy()
    // addStars()
  }

  window.addEventListener('resize', onWindowResize, false)

  // init physics
  Void.world = initOimoPhysics()

  loadSystem()
}

const onWindowResize = () => {
  Void.camera.aspect = window.innerWidth / window.innerHeight
  Void.camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const updateOimoPhysics = () => {
  if (Void.world == null) {
    return
  }
  Void.world.step()
}

const animate = () => {
  requestAnimationFrame(animate)

  const delta = Void.clock.getDelta()

  if (Void.controls) {
    Void.controls.update(delta)
  }

  Void.time.value = Void.clock.getElapsedTime()

  weapons.animate(delta, Void.time.value)

  if (Void.soPhysics && Void.systemLoaded) {
    if (Void.urlConfigs.hasOwnProperty('CPU')) {
      Void.soPhysics.accelerateCuda()
      updateSystemCPU()
    } else {
      Void.soPhysics.GPUAccelerate()
      let GPUcollisions = true
      if (Void.urlConfigs.hasOwnProperty('GPUcollisions')) {
        GPUcollisions = Void.urlConfigs.GPUcollisions
      }
      if (GPUcollisions == true) {
        updateSystemCPU()
      } else {
        updateSystemGPU()
      }
      //
    }
    // updateOimoPhysics()

    animateCallbacks.map(x => x(delta, Void.time.value))
  }

  composer.render(delta)
}

export { init, animate, loadSystem }
