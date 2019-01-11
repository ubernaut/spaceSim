import msgpack from 'msgpack-lite'

import createSocket from '-/net/socket'
import { onProgress, onError } from '-/utils'
import { shoot } from '-/player/weapons'
import state from '-/state'
import logger from '-/logger'

const playersState = state.select([ 'scene', 'players' ])
const assetPath = state.get([ 'config', 'threejs', 'assetPath' ])

const mtlLoader = new THREE.MTLLoader()
const objLoader = new THREE.OBJLoader()
mtlLoader.setPath(assetPath)
objLoader.setPath(assetPath)

const handleEvent = (scene, playerId) => eventData => {
  const decoded = msgpack.decode(new Uint8Array(eventData))
  const event = decoded.message
  // console.log(decoded)

  if (event.type === 'playerMove' || event.type === 'playerJoin') {
    loadOrUpdatePlayer(decoded.message.id, event.payload, scene, playerId)
  } else if (event.type === 'shotFired') {
    const { quaternion, position, color, weaponType } = event.payload
  }
}

const broadcastUpdate = (socket, payload) => {
  socket.emit('events', msgpack.encode(payload))
}

/**
 * Set position, orientation, etc
 */
const setShipProps = (ship, propsData) => {
  ship.position.x = propsData.position.x
  ship.position.y = propsData.position.y
  ship.position.z = propsData.position.z
  ship.quaternion._w = propsData.quaternion._w
  ship.quaternion._x = propsData.quaternion._x
  ship.quaternion._y = propsData.quaternion._y
  ship.quaternion._z = propsData.quaternion._z
}

let playersToLoad = []

/**
 * Load a new player or update an existing one based on a socket message
 */
const loadOrUpdatePlayer = (playerId, playerData, scene, localPlayerId) => {
  if (playerId === localPlayerId) {
    return
  }
  const player = scene.children.find(
    x => x.name === playerId && x.uuid !== localPlayerId
  )

  if (player) {
    setShipProps(player, playerData)
  } else {
    playersToLoad.push({ playerId, playerData, scene })
  }
}

const loadNewPlayer = scene => ({ playerId, playerData }) => {
  logger.debug('loading new player...', playerId)

  return new Promise((resolve, reject) => {
    const onShipObjLoaded = object => {
      // meta
      object.name = playerId
      // position, orientation
      setShipProps(object, playerData)
      object.scale.set(20, 20, 20)
      object.rotation.set(0, 0, 0)

      playerData.ship = object
      scene.add(object)

      const players = [ ...playersState.get(), { playerId } ]
      playersState.set(players)

      resolve()
    }

    const onShipMaterialsLoaded = materials => {
      materials.preload()
      objLoader.setMaterials(materials)
      objLoader.load('ship.obj', onShipObjLoaded)
    }

    mtlLoader.load('ship.mtl', onShipMaterialsLoaded, onProgress, onError)
  })
}

const init = async ({ scene, ship }) => {
  const socket = await createSocket()
  socket.on('event', handleEvent(scene, ship.uuid))
  setInterval(() => {
    const { quaternion, position } = ship
    const payload = { quaternion, position }
    broadcastUpdate(socket, { type: 'playerMove', id: ship.uuid, payload })
  }, 150)
  setInterval(() => {
    const nextPlayer = playersToLoad[0]
    if (nextPlayer) {
      loadNewPlayer(scene)(nextPlayer).then(() => {
        playersToLoad = playersToLoad.filter(
          x => x.playerId !== nextPlayer.playerId
        )
      })
    }
  }, 2000)
  return socket
}

export { init, handleEvent, broadcastUpdate }
