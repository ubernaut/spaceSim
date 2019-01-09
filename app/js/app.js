import '@babel/polyfill'
import '../styles/app.css'
import { debounce } from 'throttle-debounce'

import { createViewer } from '@void/core/viewer'
import * as net from '-/net/net'
import * as weapons from '-/player/weapons'
import { createShip } from '-/player/ship'
import { createBasicUI } from '-/ui/ui'
import { createControls } from '-/controls/controls'
import logger from './logger'
import { addMessage } from '-/state'
import state from '-/state'

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
  animateCallbacks: []
}

const getAnimateCallbacks = () => Void.animateCallbacks
const addAnimateCallback = cb => Void.animateCallbacks.push(cb)

const defaultViewerOptions = {
  system: {
    bodyCount: 512,
    bodyDistance: 0.2,
    bodySpeed: 0.05,
    deltaT: 0.005,
    gpuCollisions: true
  }
}

const main = async () => {
  logger.debug('init: creating viewer...')
  const { scene, camera, physics } = await createViewer(
    'root',
    {
      getAnimateCallbacks,
      addAnimateCallback
    },
    defaultViewerOptions
  )

  logger.debug(addMessage('init: creating player ship...'))
  const { ship, animate: animateShip } = await createShip()
  state.set([ 'scene', 'player', 'id' ], ship.uuid)

  logger.debug(addMessage('init: adding ship and camera to scene...'))
  ship.add(camera)
  camera.position.set(...[ 0, 10, 30 ])
  scene.add(ship)

  logger.debug(addMessage('init: registering controls...'))
  const controls = createControls(
    { type: 'fly', ship, camera, scene },
    {
      toggleConsole: debounce(100, () => {
        const consoleState = state.select([ 'gui', 'console' ])
        consoleState.set('hidden', !consoleState.get('hidden'))
      }),
      toggleHelp: debounce(100, () => {
        const helpState = state.select([ 'gui', 'help' ])
        helpState.set('hidden', !helpState.get('hidden'))
      })
    }
  )

  logger.debug(addMessage('init: registering system animations...'))
  addAnimateCallback(animateShip)
  addAnimateCallback(delta => controls.update(delta))
  addAnimateCallback(() => {
    state.set([ 'scene', 'bodyCount' ], physics.system.bodies.length)
  })

  logger.debug(addMessage('init: creating dat.gui elements...'))
  createBasicUI()

  logger.debug(addMessage('init: opening websocket...'))
  await net.init({ ship, scene })
}

main()
