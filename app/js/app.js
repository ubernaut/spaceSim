import 'babel-polyfill'

import '../styles/app.css'

import { createViewer } from '@void/core/viewer'

import * as net from '-/net/net'
import * as controls from '-/player/controls'
import * as weapons from '-/player/weapons'
import { createShip, deployDrone } from '-/player/ship'
import { createBasicUI } from '-/ui/ui'
import { createGamepadControls } from '-/player/controls/gamepad-controls'
import logger from './logger'

/**
 * App State
 */

const Void = (window.Void = {
  players: [],
  player: {
    ship: null
  },
  time: { value: 100000000 },
  scene: null,
  world: null,
  controls: null
})

/**
 * Create a dat GUI elements with a callback
 */
createBasicUI()

const animateCallbacks = []
const getAnimateCallbacks = () => animateCallbacks
const addAnimateCallback = cb => animateCallbacks.push(cb)

let voidControls = null

const registerControls = ({
  scene,
  controls,
  ship,
  socket,
  camera,
  physics
}) => {
  const useGamepad = false
  if (useGamepad) {
    voidControls = createGamepadControls(
      ship,
      document.getElementById('root'),
      deployDrone(ship)
    )
  } else {
    voidControls = controls.setFlyControls({
      ship,
      camera,
      el: document.getElementById('root'),
      scene,
      socket,
      physics
    })
  }
}

const registerEventListeners = ({ socket, ship }) => {
  const canvas = document.querySelector('#root canvas')
  canvas.addEventListener(
    'mousedown',
    e => net.broadcastUpdate(socket, ship),
    false
  )
  canvas.addEventListener(
    'mouseup',
    e => net.broadcastUpdate(socket, ship),
    false
  )

  setInterval(() => {
    const { quaternion, position } = ship
    const payload = { quaternion, position }
    net.broadcastUpdate(socket, { type: 'playerMove', payload })
  }, 150)
}

logger.debug('init: creating viewer...')
createViewer(
  'root',
  {
    getAnimateCallbacks,
    addAnimateCallback
  },
  {
    system: {
      bodyCount: 256,
      bodyDistance: 1,
      bodySpeed: 0.05,
      deltaT: 0.005,
      gpuCollisions: false
    }
  }
).then(({ scene, camera, physics }) => {
  logger.debug('init: creating player ship...')
  createShip().then(({ ship, animate }) => {
    Void.ship = ship
    ship.add(camera)
    camera.position.set(...[ 0, 10, 30 ])
    scene.add(ship)

    logger.debug('init: opening websocket...')
    net.init().then(socket => {
      logger.debug('init: registering event listeners...')
      registerEventListeners({ socket, ship })
      logger.debug('init: registering controls...')
      registerControls({ scene, controls, ship, socket, camera, physics })
      logger.debug('init: registering system animations...')
      animateCallbacks.push(animate)
      animateCallbacks.push(weapons.animate(scene))
      animateCallbacks.push(delta => voidControls.update(delta))
    })
  })
})

// Add FPS stats widget
window.location =
  "javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()"
