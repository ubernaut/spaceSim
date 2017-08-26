import { onProgress, onError } from './utils'

const getData = socket => data => {
  const dataObject = JSON.parse(data.message)
  dataObject.playerId = data.playerId
  loadOrUpdatePlayer(dataObject)
}

const broadcastUpdate = (socket, ship) => {
  socket.emit('keypress', JSON.stringify({
    position: ship.position,
    quaternion: ship.quaternion
  }))
}

/**
 * Set position, orientation, etc
 */
const setShipProps = (ship, dataObject) => {
  ship.position.x = dataObject.position.x
  ship.position.y = dataObject.position.y
  ship.position.z = dataObject.position.z
  ship.quaternion._w = dataObject.quaternion._w
  ship.quaternion._x = dataObject.quaternion._x
  ship.quaternion._y = dataObject.quaternion._y
  ship.quaternion._z = dataObject.quaternion._z
}

/**
 * Load a new player or update an existing one based on a socket message
 */
const loadOrUpdatePlayer = socketDataObject => {
  const player = Void.players.find(p => p.playerId === socketDataObject.playerId)

  if (player) {
    setShipProps(player.ship, socketDataObject)
  } else {
    loadNewPlayer(socketDataObject)
  }
}

const mtlLoader = new THREE.MTLLoader()
const objLoader = new THREE.OBJLoader()
mtlLoader.setPath('js/models/')
objLoader.setPath('js/models/')

const createHudElement = () => {
  const hudElementX = new THREE.PolarGridHelper(2000, 4, 1, 36, 0xff0000, 0xff0000)
  hudElementX.geometry.rotateY(Math.PI / 2)

  const hudElementY = new THREE.PolarGridHelper(2000, 4, 1, 36, 0xff0000, 0xff0000)
  hudElementY.geometry.rotateX(Math.PI / 2)

  const hudElementZ = new THREE.PolarGridHelper(2000, 4, 1, 36, 0xff0000, 0xff0000)
  hudElementZ.geometry.rotateZ(Math.PI / 2)

  return {
    x: hudElementX,
    y: hudElementY,
    z: hudElementZ
  }
}

const loadNewPlayer = dataObject => {
  console.log('loading new player...')

  const onShipObjLoaded = object => {
    // meta
    object.name = dataObject.playerId
    // position, orientation
    setShipProps(object, dataObject)
    object.scale.set(20, 20, 20)
    object.rotation.set(0, 0, 0)
    // hud element
    const hudElement = createHudElement()
    object.add(hudElement.x)
    object.add(hudElement.y)
    object.add(hudElement.z)

    dataObject.ship = object
    Void.scene.add(object)
    Void.players.push(dataObject)
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
  socket.on('keypress', getData(socket))
  return socket
}

export { init, getData, broadcastUpdate }
