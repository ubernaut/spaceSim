import * as controls from '-/player/controls'
import * as weapons from '-/player/weapons'
import { createGamepadControls } from '-/player/controls/gamepad-controls'

import { createUniverse } from '-/bodies/universe'
import { createGalaxy } from '-/bodies/galaxy'
import { createShip } from '-/player/ship'
import { initOimoPhysics } from './physics'
import { loadSystem } from './system'
import { addLights, deployDrone, addPostprocessing } from './scene'

const onWindowResize = () => {
  Void.camera.aspect = window.innerWidth / window.innerHeight
  Void.camera.updateProjectionMatrix()
  Void.renderer.setSize(window.innerWidth, window.innerHeight)
}

const init = rootEl => {
  // renderer
  Void.renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true
    // shadowMapEnabled: true
  })
  Void.renderer.setPixelRatio(window.devicePixelRatio)
  Void.renderer.setSize(window.innerWidth, window.innerHeight)

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

  // all other matter
  createUniverse(scene).map(body => scene.add(body))

  // postprocessing
  addPostprocessing({ renderer: Void.renderer, scene, camera })

  // attach to the dom
  rootEl.appendChild(Void.renderer.domElement)
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

export default init
