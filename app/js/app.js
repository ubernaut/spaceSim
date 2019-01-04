import 'babel-polyfill'
import '../styles/app.css'

import { createViewer } from '@void/core/viewer'
import * as net from '-/net/net'
import * as weapons from '-/player/weapons'
import { createShip } from '-/player/ship'
import { createBasicUI } from '-/ui/ui'
import { createControls } from '-/controls/controls'
import logger from './logger'

/**
 * Global App State
 */
const Void = {
  players: [],
  player: {
    ship: null
  },
  time: { value: 100000000 },
  scene: null,
  world: null,
  controls: null,
  animateCallbacks: []
}

const getAnimateCallbacks = () => Void.animateCallbacks
const addAnimateCallback = cb => Void.animateCallbacks.push(cb)

const defaultViewerOptions = {
  system: {
    bodyCount: 256,
    bodyDistance: 0.2,
    bodySpeed: 0.05,
    deltaT: 0.005,
    gpuCollisions: true
  }
}

const main = async () => {
  logger.debug('init: creating viewer...')
  const { scene, camera } = await createViewer(
    'root',
    {
      getAnimateCallbacks,
      addAnimateCallback
    },
    defaultViewerOptions
  )

  logger.debug('init: creating player ship...')
  const { ship, animate } = await createShip()
  Void.ship = ship

  logger.debug('init: adding ship and camera to scene...')
  ship.add(camera)
  camera.position.set(...[ 0, 10, 30 ])
  scene.add(ship)

  logger.debug('init: opening websocket...')
  const socket = await net.init()

  logger.debug('init: registering controls...')
  const controls = createControls({ scene, ship, socket, camera })
  Void.controls = controls

  logger.debug('init: registering system animations...')
  addAnimateCallback(animate)
  addAnimateCallback(weapons.animate(scene))
  addAnimateCallback(delta => controls.update(delta))

  logger.debug('init: registering event listeners...')
  registerEventListeners({ socket, ship })

  logger.debug('init: creating dat.gui elements...')
  createBasicUI()
}
main()

/**
 * Add global event listeners, e.g., network updates
 */
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
