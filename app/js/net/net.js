import msgpack from 'msgpack-lite'

import createSocket from '-/net/socket'
import { onProgress, onError } from '-/utils'
import { shoot } from '-/player/weapons'
import state from '-/state'
import logger from '-/logger'

const handleEvent = eventData => {
  const decoded = msgpack.decode(new Uint8Array(eventData))
  const event = decoded.message
  // console.log(decoded)

  if (event.type === 'playerMove' || event.type === 'playerJoin') {
    loadOrUpdatePlayer(decoded.playerId, event.payload)
  } else if (event.type === 'shotFired') {
    const { quaternion, position, color, weaponType } = event.payload

    const newQuaternion = new THREE.Quaternion()
    newQuaternion._w = quaternion._w
    newQuaternion._x = quaternion._x
    newQuaternion._y = quaternion._y
    newQuaternion._z = quaternion._z

    const newPosition = new THREE.Vector3()
    newPosition.x = position.x
    newPosition.y = position.y
    newPosition.z = position.z

    // console.log('shooting', quaternion, position, weaponType)
    shoot({
      quaternion: newQuaternion,
      position: newPosition,
      weaponType: 'planetCannon'
    })
  }
}

const broadcastUpdate = (socket, { type, payload }) => {
  socket.emit(
    'events',
    msgpack.encode({
      type,
      payload
    })
  )
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

/**
 * Load a new player or update an existing one based on a socket message
 */
const loadOrUpdatePlayer = (players, playerId, playerData) => {
  const player = players.find(p => p.playerId === playerId)
  if (player) {
    setShipProps(player.ship, playerData)
  } else {
    loadNewPlayer(playerId, playerData)
  }
}

const assetPath = state.get([ 'config', 'threejs', 'assetPath' ])

const mtlLoader = new THREE.MTLLoader()
const objLoader = new THREE.OBJLoader()
mtlLoader.setPath(assetPath)
objLoader.setPath(assetPath)

const loadNewPlayer = (playerId, playerData) => {
  logger.debug('loading new player...')

  const onShipObjLoaded = object => {
    // meta
    object.name = playerId
    // position, orientation
    setShipProps(object, playerData)
    object.scale.set(20, 20, 20)
    object.rotation.set(0, 0, 0)

    playerData.ship = object
    Void.scene.add(object)
    Void.players.push(Object.assign({}, playerData, { playerId }))
  }

  const onShipMaterialsLoaded = materials => {
    materials.preload()
    objLoader.setMaterials(materials)
    objLoader.load('ship.obj', onShipObjLoaded)
  }

  mtlLoader.load('ship.mtl', onShipMaterialsLoaded, onProgress, onError)
}

const init = () =>
  new Promise((resolve, reject) => {
    createSocket(socket => {
      socket.on('event', handleEvent)
      resolve(socket)
    })
  })

export { init, handleEvent, broadcastUpdate }
