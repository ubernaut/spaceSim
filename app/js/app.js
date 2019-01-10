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
import createApp from '-/utils/create-app'

const create = async () => {
  logger.debug('init: creating viewer...')
  const { scene, camera, physics, animate: animateSystem } = await createViewer(
    'root',
    {
      system: {
        bodyCount: 512,
        bodyDistance: 0.2,
        bodySpeed: 0.05,
        deltaT: 0.005,
        gpuCollisions: true
      }
    }
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

  logger.debug(addMessage('init: creating dat.gui elements...'))
  createBasicUI()

  logger.debug(addMessage('init: opening websocket...'))
  await net.init({ ship, scene })

  return {
    scene,
    physics,
    controls,
    animateCallbacks: [
      animateSystem,
      animateShip,
      delta => controls.update(delta)
    ]
  }
}

createApp({
  scene: {
    preload: null,
    create,
    update: null
  }
})
