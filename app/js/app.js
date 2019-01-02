import 'babel-polyfill'

import '../styles/app.css'

import { createViewer } from '@void/core/viewer'

import * as net from '-/net/net'
import * as controls from '-/player/controls'
import * as weapons from '-/player/weapons'
import { createShip, deployDrone } from '-/player/ship'
import { createBasicUI } from '-/ui/ui'
import { getAllConfigVars } from '-/utils'
import { createGamepadControls } from '-/player/controls/gamepad-controls'
import logger from './logger'

/**
 * App State
 */

const Void = (window.Void = {
  urlConfigs: getAllConfigVars(),
  players: [],
  player: {
    ship: null
  },
  time: { value: 100000000 },
  scene: null,
  world: null,
  controls: null,
  renderer: null,
  composer: null,
  animateCallbacks: [],
  gui: {
    values: {
      starType: 'O5'
    }
  },

  uniforms: {
    sun: {
      color: {
        red: {
          value: 255
        },
        green: {
          value: 255
        },
        blue: {
          value: 255
        }
      }
    }
  }
})

/**
 * Event Listeners
 */

/**
 * Init
 */
createBasicUI(Void.gui.values, color => {
  const split = color.split(',')
  Void.uniforms.sun.color.red.value = (split[0] / 255.0) * 0.75
  Void.uniforms.sun.color.green.value = (split[1] / 255.0) * 0.75
  Void.uniforms.sun.color.blue.value = (split[2] / 255.0) * 0.75
})

const { scene } = createViewer('root')

createShip({ controls }).then(({ ship, animate }) => {
  Void.ship = ship
  Void.ship.add(Void.camera)
  Void.camera.position.set(...[ 0, 10, 30 ])
  scene.add(ship)
  Void.animateCallbacks.push(animate)

  if (Void.urlConfigs.hasOwnProperty('gamepad')) {
    Void.controls = createGamepadControls(
      ship,
      document.getElementById('root'),
      weapons.shoot,
      deployDrone(ship)
    )
  } else {
    Void.controls = controls.setFlyControls({
      ship,
      camera: Void.camera,
      el: document.getElementById('root')
    })
  }

  Void.animateCallbacks.push(weapons.animate)
  Void.animateCallbacks.push(delta => Void.controls.update(delta))
})

// Websocket connection
const registerEventListeners = socket => {
  const canvas = document.querySelector('#root canvas')
  canvas.addEventListener(
    'mousedown',
    e => net.broadcastUpdate(socket, Void.ship),
    false
  )
  canvas.addEventListener(
    'mouseup',
    e => net.broadcastUpdate(socket, Void.ship),
    false
  )

  setInterval(() => {
    const { quaternion, position } = Void.ship
    const payload = { quaternion, position }
    net.broadcastUpdate(socket, { type: 'playerMove', payload })
  }, 150)
}

logger.debug('opening websocket')
net.init().then(socket => registerEventListeners(socket))

// Add FPS stats widget
window.location =
  "javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()"
