import 'babel-polyfill'
import '../styles/app.css'

import bunyan from 'browser-bunyan'

import * as net from '-/net/net'
import sim from '-/sim'
import { createBasicUI } from '-/ui/ui'
import { getAllConfigVars } from '-/utils'

/**
 * App State
 */

const Void = (window.Void = {
  urlConfigs: getAllConfigVars(),
  server: {
    host: 'http://thedagda.co',
    // host: 'http://localhost',
    port: '1137'
  },
  config: {
    threejs: {
      assetPath: 'app/assets/models/'
    }
  },
  players: [],
  player: {
    ship: null
  },
  clock: new THREE.Clock(),
  time: { value: 100000000 },
  socket: null,
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
 * Void Services
 */

// Logging service
Void.log = bunyan.createLogger({
  name: 'myLogger',
  streams: [
    {
      level: 'debug',
      stream: new bunyan.ConsoleFormattedStream()
    }
  ],
  serializers: bunyan.stdSerializers,
  src: true
})
Void.log.debug('starting up...')

/**
 * Event Listeners
 */
const registerEventListeners = () => {
  const canvas = document.querySelector('#root canvas')
  canvas.addEventListener(
    'mousedown',
    e => net.broadcastUpdate(Void.socket, Void.ship),
    false
  )
  canvas.addEventListener(
    'mouseup',
    e => net.broadcastUpdate(Void.socket, Void.ship),
    false
  )

  setInterval(() => {
    const { quaternion, position } = Void.ship
    const payload = { quaternion, position }
    net.broadcastUpdate(Void.socket, { type: 'playerMove', payload })
  }, 150)
}

/**
 * Init
 */
createBasicUI(Void.gui.values, color => {
  const split = color.split(',')
  Void.uniforms.sun.color.red.value = (split[0] / 255.0) * 0.75
  Void.uniforms.sun.color.green.value = (split[1] / 255.0) * 0.75
  Void.uniforms.sun.color.blue.value = (split[2] / 255.0) * 0.75
})

sim(document.getElementById('root'))

registerEventListeners()

// Websocket connection
Void.log.debug('opening websocket')
Void.socket = net.init(Void.server)

window.location =
  "javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()"
