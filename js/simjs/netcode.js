
function getData(data){
  var dataObject = JSON.parse(data.message);
  console.log(dataObject);
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
  socket.emit('keypress', JSON.stringify(datagram));
}

window.addEventListener('keydown', event => {
  broadcastUpdate();
});
window.addEventListener('keyup', event => {
  broadcastUpdate();
});
window.addEventListener('mousedown', event => {
  broadcastUpdate();
});
window.addEventListener('mouseup', event => {
  broadcastUpdate();
});

function checkLoadedPlayers(dataObject){
  var newPlayer=true;
  console.log(loadedPlayers);
  for(var player of loadedPlayers){
    console.log("ids:");
    console.log(dataObject.playerId);
    console.log(player.playerId);
    console.log(player);

    if(player.playerId == dataObject.playerId){
        player.ship.position.x = dataObject.position.x;
        player.ship.position.y = dataObject.position.y;
        player.ship.position.z = dataObject.position.z;

        player.ship.quaternion._w = dataObject.quaternion._w;
        player.ship.quaternion._x = dataObject.quaternion._x;
        player.ship.quaternion._y = dataObject.quaternion._y;
        player.ship.quaternion._z = dataObject.quaternion._z;
        // player.ship.quaternion.y = dataObject.quaternion.y;
        // player.ship.quaternion.z = dataObject.quaternion.z;
        console.log("player found");
        newPlayer=false;
    }
  }
  if(newPlayer==true){
    LoadNewPlayer(dataObject);
  }

}
function LoadNewPlayer(dataObject){
  console.log("loading new player");
  console.log(dataObject);
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
      dataObject.ship=object;
      scene.add( object );
      loadedPlayers.push(dataObject);
    }, onProgress, onError );
  });
}
