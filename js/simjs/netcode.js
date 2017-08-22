var socket = io('http://thedagda.co:1137');
socket.on('keypress', function (data) {
  //console.log(data);

  var dataObject = JSON.parse(data.message);
  console.log(dataObject);
  dataObject.playerId = data.playerId;
  checkLoadedPlayers(dataObject);
  // document.body.innerHTML = `
  //   <pre>${JSON.stringify(data, null, 2)}</pre>
  //   <br/>
  // ` + document.body.innerHTML
});
window.addEventListener('keydown', event => {
  socket.emit('keypress', JSON.stringify(ship.position));
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
        player.ship.position.x = dataObject.x;
        player.ship.position.y = dataObject.y;
        player.ship.position.z = dataObject.z;
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
      object.position.x = dataObject.x;
      object.position.y = dataObject.y;
      object.position.z = dataObject.z;
      object.scale.set(20,20,20);
      object.rotation.set(0,0,0);
      object.name=dataObject.playerId;
      dataObject.ship=object;
      scene.add( object );
      loadedPlayers.push(dataObject);
    }, onProgress, onError );
  });
}
