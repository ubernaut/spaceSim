import './globals'

import * as net from './simjs/netcode'
import * as sim from './simjs/sim'
import * as utils from './simjs/utils'

/**
 * App State
 */

const app = {
  server: {
    host: 'http://thedagda.co',
    port: '1137'
  },
  players: [],
  player: {
    ship: null
  },
  socket: null,
  scene: null
}

app.socket = net.init(app.server)

/**
 * Event Listeners
 */

window.addEventListener('keydown', event => {
  net.broadcastUpdate(app.socket, window.ship)
})
window.addEventListener('keyup', event => {
  net.broadcastUpdate(app.socket, window.ship)
})
document.body.addEventListener('mousedown', e => net.broadcastUpdate(app.socket, ship), false)
document.body.addEventListener('mouseup', e => net.broadcastUpdate(app.socket, ship), false)

/**
 * Init
 */

sim.init()
sim.animate()
