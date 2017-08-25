import { onProgress, onError } from './utils'

const getData = socket => data => {
  const dataObject = JSON.parse(data.message);
  dataObject.playerId = data.playerId;
  checkLoadedPlayers(dataObject);
}

const init = server => {
  const socket = io(`${server.host}:${server.port}`);
  socket.on('keypress', getData(socket));
  return socket;
}

function broadcastUpdate(socket, ship) {
  socket.emit("keypress", JSON.stringify({
    position: ship.position,
    quaternion: ship.quaternion
  }));
}

function checkLoadedPlayers(dataObject) {
  let newPlayer = true;
  for (const player of loadedPlayers) {
    if (player.playerId == dataObject.playerId) {
      player.ship.position.x = dataObject.position.x;
      player.ship.position.y = dataObject.position.y;
      player.ship.position.z = dataObject.position.z;
      player.ship.quaternion._w = dataObject.quaternion._w;
      player.ship.quaternion._x = dataObject.quaternion._x;
      player.ship.quaternion._y = dataObject.quaternion._y;
      player.ship.quaternion._z = dataObject.quaternion._z;
      newPlayer = false;
    }
  }
  if (newPlayer == true) {
    LoadNewPlayer(dataObject);
  }
}

function LoadNewPlayer(dataObject) {
  console.log("loading new player");
  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('../js/three/');
  mtlLoader.load('ship.mtl', function(materials) {
    materials.preload();
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('../js/three/');
    objLoader.load('ship.obj', function(object) {
      object.position.x = dataObject.position.x;
      object.position.y = dataObject.position.y;
      object.position.z = dataObject.position.z;
      object.quaternion._w = dataObject.quaternion._w;
      object.quaternion._x = dataObject.quaternion._x;
      object.quaternion._y = dataObject.quaternion._y;
      object.quaternion._z = dataObject.quaternion._z;
      object.scale.set(20, 20, 20);
      object.rotation.set(0, 0, 0);
      object.name = dataObject.playerId;
      const hudElementX = new THREE.PolarGridHelper(2000, 4, 1, 36, 0xff0000, 0xff0000);
      hudElementX.geometry.rotateY(Math.PI / 2);
      object.add(hudElementX);

      const hudElementY = new THREE.PolarGridHelper(2000, 4, 1, 36, 0xff0000, 0xff0000);
      hudElementY.geometry.rotateX(Math.PI / 2);
      object.add(hudElementY);

      const hudElementZ = new THREE.PolarGridHelper(2000, 4, 1, 36, 0xff0000, 0xff0000);
      hudElementZ.geometry.rotateZ(Math.PI / 2);
      object.add(hudElementZ);

      dataObject.ship = object;
      window.scene.add(object);
      loadedPlayers.push(dataObject);
    }, onProgress, onError);
  });
}

export { init, getData, broadcastUpdate }
