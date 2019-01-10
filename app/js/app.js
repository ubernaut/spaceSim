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
import sceneState, { addMessage } from '-/state/branches/scene'
import { toggleConsole, toggleHelp } from '-/state/branches/gui'

/**
 * Global App State
 */
const Void = {
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
  sceneState.set([ 'player', 'id' ], ship.uuid)

  logger.debug(addMessage('init: adding ship and camera to scene...'))
  ship.add(camera)
  camera.position.set(...[ 0, 10, 30 ])
  scene.add(ship)

  logger.debug(addMessage('init: registering controls...'))
  const controls = createControls(
    { type: 'fly', ship, camera, scene },
    {
      toggleConsole: debounce(100, toggleConsole),
      toggleHelp: debounce(100, toggleHelp)
    }
  )

  logger.debug(addMessage('init: registering system animations...'))
  addAnimateCallback(animateShip)
  addAnimateCallback(delta => controls.update(delta))
  addAnimateCallback(() => {
    sceneState.set('bodyCount', physics.system.bodies.length)
  })

  logger.debug(addMessage('init: creating dat.gui elements...'))
  createBasicUI()

  logger.debug(addMessage('init: opening websocket...'))
  await net.init({ ship, scene })
}

main()
