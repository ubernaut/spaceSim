import { Color } from 'three'
import msgpack from 'msgpack-lite'
import { validate } from 'superstruct'

import createSocket from '-/net/socket'
import { createShip } from '-/player/ship'
import {
  create as createCannon,
  shoot as shootCannon,
  animate as animateCannon,
} from '-/objects/weapons/cannon'
import state from '-/state'
import { addMessage } from '-/state/branches/scene'
import { Message, PlayerUpdate, Cannon, Chat, TYPES } from './message-schema'

const playerState = state.select(['scene', 'player'])
const playersState = state.select(['scene', 'players'])

const init = async ({ scene, ship, registerAnimateCallback }) => {
  const socket = await createSocket()
  socket.on('event', handleEvent(scene, registerAnimateCallback))

  // Send player state back to server
  setInterval(() => {
    const { quaternion, position } = ship
    const payload = { quaternion, position }
    broadcastUpdate(socket, TYPES.PLAYER_UPDATE, {
      player: playerState.get(),
      quaternion,
      position,
    })
  }, 75)

  // Load new players
  setInterval(() => {
    const nextPlayer = playersToLoad.pop()
    if (nextPlayer) {
      loadNewPlayer({ scene, player: nextPlayer }).then(() => {
        playersToLoad = playersToLoad.filter(
          (x) => x.userId !== nextPlayer.userId
        )
      })
    }
  }, 2000)

  return socket
}

const handleEvent = (scene, registerAnimateCallback) => (eventData) => {
  const msg = msgpack.decode(new Uint8Array(eventData))

  try {
    validate(msg, Message)
  } catch (err) {
    console.error(err)
    return
  }

  if (msg.type === TYPES.PLAYER_UPDATE) {
    try {
      validate(msg.body, PlayerUpdate)
    } catch (err) {
      console.error(err)
      return
    }
    const { player, quaternion, position } = msg.body
    updatePlayer({ scene, player, quaternion, position })
    return
  }

  if (msg.type === TYPES.CANNON) {
    try {
      validate(msg.body, Cannon)
    } catch (err) {
      console.error(err)
      return
    }

    const localUserId = playerState.get().userId
    const { player } = msg.body
    if (player.userId === localUserId) {
      return
    }

    const ship = scene.children.find((x) => x.uuid === player.ship.uuid)
    const cannon = ship.children.find((x) => x.name === 'cannon')

    shootCannon({
      emitter: cannon,
      scene,
      position: ship.position,
      quaternion: ship.quaternion,
      speed: 10,
    })

    registerAnimateCallback((delta, tick) =>
      animateCannon({ emitter: cannon, delta, tick })
    )
  }

  if (msg.type === TYPES.CHAT) {
    try {
      validate(msg.body, Chat)
    } catch (err) {
      console.err(err)
      return
    }
    const { to, from, message } = msg.body
    const localUserId = playerState.get().userId
    if (to === localUserId) {
      addMessage(`${from}: ${message}`)
    }
  }
}

const broadcastUpdate = (socket, type, body) => {
  socket.emit(
    'events',
    msgpack.encode({
      type,
      body,
      meta: {
        timestamp: new Date(),
      },
    })
  )
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

  const hull = ship.children.find((c) => c.name === 'Icosahedron_Standard')
  hull.material.color = new Color(player.ship.hull.color)
  ship.userData = Object.assign({}, player)
}

let playersToLoad = []

/**
 * Update an existing player based on a socket message
 */
const updatePlayer = ({ scene, player, quaternion, position }) => {
  const playerToUpdate = playersState
    .get()
    .find((p) => p.userId === player.userId)

  if (!playerToUpdate) {
    playersToLoad.push(player)
    return
  }

  const ship = scene.children.find((x) => x.uuid === player.ship.uuid)

  if (playerToUpdate && ship) {
    setShipProps({ ship, player, quaternion, position })
  }
}

const loadNewPlayer = async ({ scene, player }) => {
  addMessage(`loading player ${player.username}...`)

  const { ship, animate } = await createShip()
  ship.uuid = player.ship.uuid
  scene.add(ship)

  console.log(player)

  const { emitter: cannon } = createCannon({ scene })
  cannon.name = 'cannon'
  ship.add(cannon)

  const players = [
    ...playersState.get(),
    Object.assign({}, player, { isLocalPlayer: false }),
  ]
  playersState.set(players)
}

export { init, handleEvent, broadcastUpdate }
