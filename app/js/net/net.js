import io from 'socket.io-client'
import msgpack from 'msgpack-lite'

import { onProgress, onError } from '-/utils'
import { shoot } from '-/player/weapons'

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
    shoot({ quaternion: newQuaternion, position: newPosition, weaponType: 'planetCannon' })
  }
}

const broadcastUpdate = (socket, { type, payload }) => {
  socket.emit('events', msgpack.encode({
    type,
    payload
  }))
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
const loadOrUpdatePlayer = (playerId, playerData) => {
  const player = Void.players.find(p => p.playerId === playerId)
  if (player) {
    setShipProps(player.ship, playerData)
  } else {
    Void.log.debug('loading player')
    loadNewPlayer(playerId, playerData)
  }
}

const mtlLoader = new THREE.MTLLoader()
const objLoader = new THREE.OBJLoader()
mtlLoader.setPath('app/assets/models/')
objLoader.setPath('app/assets/models/')

// const createHudElement = () => {
//   const hudElementX = new THREE.PolarGridHelper(2000, 4, 1, 36, 0xff0000, 0xff0000)
//   hudElementX.geometry.rotateY(Math.PI / 2)
//
//   const hudElementY = new THREE.PolarGridHelper(2000, 4, 1, 36, 0xff0000, 0xff0000)
//   hudElementY.geometry.rotateX(Math.PI / 2)
//
//   const hudElementZ = new THREE.PolarGridHelper(2000, 4, 1, 36, 0xff0000, 0xff0000)
//   hudElementZ.geometry.rotateZ(Math.PI / 2)
//
//   return {
//     x: hudElementX,
//     y: hudElementY,
//     z: hudElementZ
//   }
// }

const loadNewPlayer = (playerId, playerData) => {
  Void.log.debug('loading new player...')

  const onShipObjLoaded = object => {
    // meta
    object.name = playerId
    // position, orientation
    setShipProps(object, playerData)
    object.scale.set(20, 20, 20)
    object.rotation.set(0, 0, 0)
    // hud element
    // const hudElement = createHudElement()
    // object.add(hudElement.x)
    // object.add(hudElement.y)
    // object.add(hudElement.z)

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

const init = server => {
  const socket = io(`${server.host}:${server.port}`)
  socket.on('connect', () => {
    Void.log.debug('websocket connected')
    socket.on('events', handleEvent)
  })
  return socket
}

export { init, handleEvent, broadcastUpdate }
