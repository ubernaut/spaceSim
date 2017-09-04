import bunyan from 'browser-bunyan'

import * as net from '-/net/net'
import * as sim from '-/sim/sim'
import { shoot } from '-/player/weapons'

/**
 * App State
 */

const Void = window.Void = {
  server: {
    host: 'http://thedagda.co',
    // host: 'http://localhost',
    port: '1137'
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
  controls: null
}

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
const keys = {
  SPACE: 32
}
window.addEventListener('keydown', event => {
  if (event.keyCode === keys.SPACE) {
    const { quaternion, position } = Void.ship
    const { color, velocity } = shoot({ quaternion, position, weaponType: 'planetCannon' })
    const payload = { quaternion, position, color, velocity, weaponType: 'planetCannon' }
    net.broadcastUpdate(Void.socket, { type: 'shotFired', payload })
  } else {
    const { quaternion, position } = Void.ship
    const payload = { quaternion, position }
    net.broadcastUpdate(Void.socket, { type: 'playerMove', payload })
  }
})
document.body.addEventListener('mousedown', e => net.broadcastUpdate(Void.socket, Void.ship), false)
document.body.addEventListener('mouseup', e => net.broadcastUpdate(Void.socket, Void.ship), false)

/**
 * Init
 */

sim.init(document.getElementById('root'))
sim.animate()

// Websocket connection
Void.log.debug('opening websocket')
Void.socket = net.init(Void.server)
