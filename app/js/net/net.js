import { Color } from 'three'
import msgpack from 'msgpack-lite'

import createSocket from '-/net/socket'
import { createShip } from '-/player/ship'
import state from '-/state'
import { addMessage } from '-/state/branches/scene'

const playerState = state.select([ 'scene', 'player' ])
const playersState = state.select([ 'scene', 'players' ])

const init = async ({ scene, ship }) => {
  const socket = await createSocket()
  socket.on('event', handleEvent(scene, playerState.get().userId))

  // Send player state back to server
  setInterval(() => {
    const { quaternion, position } = ship
    const payload = { quaternion, position }
    broadcastUpdate(socket, {
      type: 'playerUpdate',
      player: playerState.get(),
      quaternion,
      position
    })
  }, 75)

  // Load new players
  setInterval(() => {
    const nextPlayer = playersToLoad.pop()
    if (nextPlayer) {
      loadNewPlayer({ scene, player: nextPlayer }).then(() => {
        playersToLoad = playersToLoad.filter(
          x => x.userId !== nextPlayer.userId
        )
      })
    }
  }, 2000)

  return socket
}

const handleEvent = scene => eventData => {
  const { type, player, quaternion, position } = msgpack.decode(
    new Uint8Array(eventData)
  )

  const localUserId = playerState.get().userId
  if (player.userId === localUserId) {
    return
  }

  if (type === 'playerUpdate') {
    updatePlayer({ scene, player, quaternion, position })
  }
}

const broadcastUpdate = (socket, payload) => {
  socket.emit('events', msgpack.encode(payload))
}

/**
 * Set position, orientation, etc
 */
const setShipProps = ({ ship, player, quaternion, position }) => {
  ship.position.x = position.x
  ship.position.y = position.y
  ship.position.z = position.z
  ship.quaternion._w = quaternion._w
  ship.quaternion._x = quaternion._x
  ship.quaternion._y = quaternion._y
  ship.quaternion._z = quaternion._z

  const hull = ship.children.find(c => c.name === 'Icosahedron_Standard')
  hull.material.color = new Color(
    player.ship.hull.color
  )
  ship.userData = Object.assign({}, player)
}

let playersToLoad = []

/**
 * Update an existing player based on a socket message
 */
const updatePlayer = ({ scene, player, quaternion, position }) => {
  const playerToUpdate = playersState
    .get()
    .find(p => p.userId === player.userId)

  if (!playerToUpdate) {
    playersToLoad.push(player)
    return
  }

  const ship = scene.children.find(x => x.uuid === player.ship.uuid)

  if (playerToUpdate && ship) {
    setShipProps({ ship, player, quaternion, position })
  }
}

const loadNewPlayer = async ({ scene, player }) => {
  addMessage(`loading player ${player.username}...`)

  const { ship, animate } = await createShip()
  ship.uuid = player.ship.uuid
  scene.add(ship)

  const players = [
    ...playersState.get(),
    Object.assign({}, player, { isLocalPlayer: false })
  ]
  playersState.set(players)
}

export { init, handleEvent, broadcastUpdate }
