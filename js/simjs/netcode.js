
function getData(data){
  var dataObject = JSON.parse(data.message);
  dataObject.playerId = data.playerId;
  checkLoadedPlayers(dataObject);
}

var socket = io('http://thedagda.co:1137');
socket.on('keypress', function (data) {
getData(data);
});

function broadcastUpdate(){
  var datagram = new Object();
  datagram.position = ship.position;
  datagram.quaternion = ship.quaternion;
  socket.emit("keypress", JSON.stringify(datagram));
}

window.addEventListener('keydown', event => {
  broadcastUpdate();
});
window.addEventListener('keyup', event => {
  broadcastUpdate();
});
document.body.addEventListener('mousedown', broadcastUpdate,false);
document.body.addEventListener('mouseup',  broadcastUpdate,false);

function checkLoadedPlayers(dataObject){
  var newPlayer=true;
  for(var player of loadedPlayers){
    if(player.playerId == dataObject.playerId){
        player.ship.position.x = dataObject.position.x;
        player.ship.position.y = dataObject.position.y;
        player.ship.position.z = dataObject.position.z;
        player.ship.quaternion._w = dataObject.quaternion._w;
        player.ship.quaternion._x = dataObject.quaternion._x;
        player.ship.quaternion._y = dataObject.quaternion._y;
        player.ship.quaternion._z = dataObject.quaternion._z;
        newPlayer=false;
    }
  }
  if(newPlayer==true){
    LoadNewPlayer(dataObject);
  }

}
function LoadNewPlayer(dataObject){
  console.log("loading new player");
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath( '../js/three/' );
  mtlLoader.load( 'ship.mtl', function( materials ) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.setPath( '../js/three/' );
    objLoader.load( 'ship.obj', function ( object ) {
      object.position.x = dataObject.position.x;
      object.position.y = dataObject.position.y;
      object.position.z = dataObject.position.z;
      object.quaternion._w = dataObject.quaternion._w;
      object.quaternion._x = dataObject.quaternion._x;
      object.quaternion._y = dataObject.quaternion._y;
      object.quaternion._z = dataObject.quaternion._z;
      object.scale.set(20,20,20);
      object.rotation.set(0,0,0);
      object.name=dataObject.playerId;
      var hudElementX = new THREE.PolarGridHelper( 2000, 4, 1, 36,0xff0000,0xff0000 );
      hudElementX.geometry.rotateY( Math.PI/2 );
      object.add(hudElementX);

      var hudElementY = new THREE.PolarGridHelper( 2000, 4, 1, 36,0xff0000,0xff0000 );
      hudElementY.geometry.rotateX( Math.PI/2 );
      object.add(hudElementY);

      var hudElementZ = new THREE.PolarGridHelper( 2000, 4, 1, 36,0xff0000,0xff0000 );
      hudElementZ.geometry.rotateZ( Math.PI/2 );
      object.add(hudElementZ);

      dataObject.ship=object;
      scene.add( object );
      loadedPlayers.push(dataObject);
    }, onProgress, onError );
  });
}
