import * as controls from '-/player/controls'
import * as weapons from '-/player/weapons'
import { createGamepadControls } from '-/player/controls/gamepad-controls'

import { createUniverse } from '-/bodies/universe'
import { createGalaxy } from '-/bodies/galaxy'
import { createShip } from '-/player/ship'
import { initOimoPhysics } from './physics'
import { loadSystem } from './system'
import {
  animate,
  addLights,
  deployDrone,
  createPostprocessing,
  createRenderer,
  createCamera
} from './scene'

const IAU = 9.4607 * Math.pow(10, 15)

const onWindowResize = () => {
  Void.camera.aspect = window.innerWidth / window.innerHeight
  Void.camera.updateProjectionMatrix()
  Void.renderer.setSize(window.innerWidth, window.innerHeight)
}

const defaultConfig = {
  camera: {
    fov: 65,
    nearClip: 0.1,
    farClip: 5 * IAU,
    initialPosition: [ 0, 10, 30 ]
  },
  system: {
    gpuCollisions: false
  }
}

const init = async (rootEl, config = defaultConfig) => {
  Void.renderer = createRenderer()
  Void.scene = new THREE.Scene()
  Void.camera = createCamera(config.camera)
  Void.composer = createPostprocessing({
    renderer: Void.renderer,
    scene: Void.scene,
    camera: Void.camera
  })
  Void.world = initOimoPhysics()
  Void.galaxy = createGalaxy(Void.scene)

  createUniverse(Void.scene).map(body => Void.scene.add(body))

  addLights(Void.scene)

  createShip({ controls }).then(({ ship, animate }) => {
    Void.ship = ship
    Void.ship.add(Void.camera)
    Void.camera.position.set(...config.camera.initialPosition)
    Void.scene.add(ship)
    Void.animateCallbacks.push(animate)

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

  rootEl.appendChild(Void.renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)

  if (Void.urlConfigs.hasOwnProperty('GPUcollisions')) {
    config.gpuCollisions = Void.urlConfigs.GPUcollisions
  }

  loadSystem({
    gpuCollisions: config.gpuCollisions
  })

  animate()
}

export default init
