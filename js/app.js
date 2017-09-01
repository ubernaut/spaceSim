import bunyan from 'browser-bunyan'

import * as net from './simjs/netcode'
import * as sim from './simjs/sim'
import { shoot } from './simjs/weapons'

/**
 * App State
 */

const Void = window.Void = {
  server: {
    // host: 'http://thedagda.co',
    host: 'http://localhost',
    port: '1137'
  },
  players: [],
  player: {
    ship: null
  },
  socket: null,
  scene: null,
  world: null
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
    shoot(Void.ship, 'machineGun')
  }
  net.broadcastUpdate(Void.socket, Void.ship)
})
window.addEventListener('keyup', event => {
  net.broadcastUpdate(Void.socket, Void.ship)
})
document.body.addEventListener('mousedown', e => net.broadcastUpdate(Void.socket, Void.ship), false)
document.body.addEventListener('mouseup', e => net.broadcastUpdate(Void.socket, Void.ship), false)

/**
 * Init
 */

sim.init(Void.world)
sim.animate()

// Websocket connection
Void.log.debug('opening websocket')
Void.socket = net.init(Void.server)
