var clock = new THREE.Clock();
var container, stats;
var camera, scene, renderer,controls;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var world = null;
var bodys = [];
var fps = [0,0,0,0];
var ToRad = 0.0174532925199432957;
var type = 1;
var infos;
var ship;
var galaxyRadius;
var onProgress = function ( xhr ) {
  if ( xhr.lengthComputable ) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log( Math.round(percentComplete, 2) + '% downloaded' );
  }
};
var onError = function ( xhr ) { };
loadedPlayers=[];
init();
animate();

function initOimoPhysics(){

    // world setting:( TimeStep, BroadPhaseType, Iterations )
    // BroadPhaseType can be
    // 1 : BruteForce
    // 2 : Sweep and prune , the default
    // 3 : dynamic bounding volume tree

    world =  world = new OIMO.World({
  timestep: 1/60,
  iterations: 8,
  broadphase: 2,
  worldscale: 1,
  random: true,
  info:false,
  gravity: [0,0,0]
});
    //populate(1);
    //setInterval(updateOimoPhysics, 1000/60);

}
function bindship(){

}
function setControls(ship){

  if(checkMobile()){
    controls = new THREE.DeviceOrientationControls(ship, true);
  }else{
  controls = new THREE.FlyControls( ship );
  controls.movementSpeed = 100;
  controls.domElement = container;
  controls.rollSpeed = Math.PI / 3;
  controls.autoForward = false;
  controls.dragToLook = true;
}

}
function checkMobile(){
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
function onDocumentMouseWheel( event ) {

var deltay = event.wheelDeltaY;
//fov -= event.wheelDeltaY * 0.05;
//camera.projectionMatrix = THREE.Matrix4.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
if(deltay<0){
camera.position.y *=1.1;
camera.position.z *=1.1;
controls.movementSpeed*=1.1;
}else{
camera.position.y *=.9;
camera.position.z *=.9;
controls.movementSpeed*=.9;
}

}


function wireframeLoader(){


}
function objectLoader(){

}

function init() {
  window.addEventListener('mousewheel', onDocumentMouseWheel, false);

  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 4.4*Math.pow(10,26) );
  camera.position.y = 30;
  camera.position.z = 100;
  camera.lookAt(new THREE.Vector3(0,0,-1000000000000000000));
  // scene
  scene = new THREE.Scene();
  var ambient = new THREE.AmbientLight( 0x888888 );
  scene.add( ambient );
  var directionalLight = new THREE.DirectionalLight( 0xffeedd );
  directionalLight.position.set( 0, 0, 1 ).normalize();
  var size = 100000000;
  var divisions = 1000;



  var gridHelper1 = new THREE.GridHelper( size, divisions,0xffffff,0xfffff);

  scene.add( gridHelper1 );



  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
  var mtlLoader = new THREE.MTLLoader();
  //mtlLoader.setPath( 'obj/male02/' );
  mtlLoader.setPath( 'js/models/' );
  mtlLoader.load( 'ship.mtl', function( materials ) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();

    objLoader.setMaterials( materials );
    objLoader.setPath( 'js/models/' );
    objLoader.load( 'ship.obj', function ( object ) {
      object.position.x = 0;
      object.position.y = 0;
      object.scale.set(20,20,20);
      object.rotation.set(0,0,0);
      object.name="spaceShip";
      ship = object;
      ship.add(camera);
      camera.position.set( 0, 10, 30 );
      scene.add( object );
      setControls(ship);

      var helper = new THREE.PolarGridHelper( 2000, 1, 6, 36,0xfffff,0xfffff );
      helper.geometry.rotateY( Math.PI );
      scene.add( helper );
      ship.add(helper);

    }, onProgress, onError );
  });



  //wireframeLoader
  // var Loader = new THREE.OBJMTLLoader();
  // Loader.load( 'ship.obj', 'ship.mtl', function ( object ) {
  // 										  object.scale.set(23,23,23);
  //                     object.traverse( function ( child ) {
  //
  //                     if ( child instanceof THREE.Mesh )
  //                     {
  //                     //child.geometry.computeFaceNormals();
  //                     var  geometry = child.geometry;
  //                     //console.log(geometry);
  //                     //geometry.dynamic = true;
  //                     material = child.material;
  //                      mesh = new THREE.Mesh(geometry, material);
  //                         scene.add(mesh);
  //
  //                     var useWireFrame = true;
  //                         if (useWireFrame) {
  //                             mesh.traverse(function (child) {
  //                                 if (child instanceof THREE.Mesh)
  //                                 {
  //                                 child.material.wireframe = true;
  //                                 child.material.color = new THREE.Color( 0x6893DE  );
  //                                 }
  //                             });
  //                         }
  //
  //                     }
  //
  //                     //object.position.y = - 80;
  //                     scene.add( object );
  //
  // 									});});

  //

  //scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
  var pointlight = new THREE.PointLight();
  pointlight.position.set(0, 0, 0);
  pointlight.castShadow = true;
  scene.add(pointlight);


  // var earthGeometry = new THREE.SphereGeometry( 6371000, 32, 32 );
  // var earthMaterial = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
  // var earth = new THREE.Mesh( earthGeometry, earthMaterial );
  // scene.add( earth );
  //
  // var sunGeometry = new THREE.SphereGeometry( 695700000, 32, 32 );
  // var sunMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  // var sun = new THREE.Mesh( sunGeometry, sunMaterial );
  // scene.add( sun );

  var oortGeometry = new THREE.SphereGeometry(7.5*Math.pow(10,15), 32, 32 );
  var oortMaterial = new THREE.MeshBasicMaterial( {color:0x555555} );
  var oort = new THREE.Mesh( oortGeometry, oortMaterial );
  scene.add( oort );


  galaxyRadius=5*Math.pow(10,20);
  var galaxyGeometry = new THREE.SphereGeometry(5*Math.pow(10,20), 32, 32 );
  var galaxyMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
  var galaxy = new THREE.Mesh( galaxyGeometry, galaxyMaterial );
  scene.add( galaxy );

  var universeGeometry = new THREE.SphereGeometry(4.4*Math.pow(10,26), 32, 32 );
  var universeMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
  var universe = new THREE.Mesh( universeGeometry, universeMaterial );
  scene.add( universe );


  renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  var radius = galaxyRadius;
  var i, r = radius, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
  for ( i = 0; i < 15000; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = (Math.random()*(2-1)) ;
    vertex.y = (Math.random()*(2-1))/3 ;
    vertex.z = (Math.random()*(2-1)) ;
    vertex.multiplyScalar( r );


    starsGeometry[ 0 ].vertices.push( vertex );
  }
  for ( i = 0; i < 15000; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = (Math.random()*(2-1)) ;
    vertex.y = (Math.random()*(2-1))/3 ;
    vertex.z = (Math.random()*(2-1)) ;
    vertex.multiplyScalar( r );
    starsGeometry[ 1 ].vertices.push( vertex );
  }

  var stars;
  var starsMaterials = [
    new THREE.PointsMaterial( { color: 0xffffff, size: 2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0xaaaaaa, size: 2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0xff0000, size: 2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0xffdddd, size: 2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0xddddff, size: 2, sizeAttenuation: false } )
  ];
  for ( i = 10; i < 30; i ++ ) {
    stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
    // stars.rotation.x = Math.random() * 6;
    // stars.rotation.y = Math.random() * 6;
    // stars.rotation.z = Math.random() * 6;
    //  stars.scale.setScalar( i * 10 );
    stars.position.x -= radius/2;
    stars.position.y -= radius/6;
    stars.position.z -= radius/2;
    stars.matrixAutoUpdate = false;
    stars.updateMatrix();
    scene.add( stars );
  }


  var spheregeometry = new THREE.SphereGeometry(10000000000, 36, 30);
  var spherematerial = new THREE.MeshBasicMaterial({wireframe: true, color: 0xa807b7});
  var sphere = new THREE.Mesh(spheregeometry, spherematerial);

  sphere.position.set(-2.0, 0, 0);

  //scene.add(sphere);
  window.addEventListener( 'resize', onWindowResize, false );
  initOimoPhysics();

}
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function updateOimoPhysics() {
    if(world==null) return;
    world.step();
    var x, y, z, mesh, body, i = bodys.length;
    while (i--){
        body = bodys[i];
        mesh = meshs[i];
        if(!body.sleeping){
            mesh.position.copy(body.getPosition());
            mesh.quaternion.copy(body.getQuaternion());
            // change material
            if(mesh.material.name === 'sbox') mesh.material = mats.box;
            if(mesh.material.name === 'ssph') mesh.material = mats.sph;
            if(mesh.material.name === 'scyl') mesh.material = mats.cyl;
            // reset position
            if(mesh.position.y<-100){
                x = -100 + Math.random()*200;
                z = -100 + Math.random()*200;
                y = 100 + Math.random()*1000;
                body.resetPosition(x,y,z);
            }
        } else {
            if(mesh.material.name === 'box') mesh.material = mats.sbox;
            if(mesh.material.name === 'sph') mesh.material = mats.ssph;
            if(mesh.material.name === 'cyl') mesh.material = mats.scyl;
        }
    }

    //infos.innerHTML = world.getInfo();
}

//
function animate() {
  requestAnimationFrame( animate );
  updateOimoPhysics();
  render();
  //camera.lookAt(ship.position);


}
function render() {
  var delta = clock.getDelta();
  controls.update( delta );

  renderer.render( scene, camera );
}

// function getTexture(body){
//
//   if (body.mass< 0.001)
//           body.texture = loader.loadTexture("models/earthmoon.jpg")
//   }else if( body.mass >= 0.001 and body.mass < .002){
//           body.texture = loader.loadTexture("models/mars.jpg")
//   }else if( body.mass >= .002 and body.mass < .003){
//           body.texture = loader.loadTexture("models/venus.jpg")
//   }else if( body.mass >= .003 and body.mass < .006){
//           body.texture = loader.loadTexture("models/mercury.jpg")
//   }else if( body.mass >= .006 and body.mass < .009){
//           body.texture = loader.loadTexture("models/pluto.jpg")
//   }else if( body.mass >= .009 and body.mass < .01){
//           body.texture = loader.loadTexture("models/uranus.jpg")
//   }else if( body.mass >= .01 and body.mass < .03){
//           body.texture = loader.loadTexture("models/saturn.jpg")
//   }else if( body.mass >= .03 and body.mass < .05){
//           body.texture = loader.loadTexture("models/neptune.jpg")
//   }else if( body.mass >= .05 and body.mass < .1){
//           body.texture = loader.loadTexture("models/saturn.jpg")
//   }else if( body.mass >= .1 and body.mass < .2){
//           body.texture = loader.loadTexture("models/jupiter.jpg")
//   }else{
//           if (body.mass >=.7 and body.mass < 1.0){    #M type
//                   body.texture = loader.loadTexture("models/Mstar.jpg")
//                   sunMaterial.setEmission(VBase4(1,.6,.6,1))
//           }else if(  body.mass >= 1.0 and body.mass < 1.5){  #K type
//                   body.texture = loader.loadTexture("models/Kstar.jpg")
//                   sunMaterial.setEmission(VBase4(1,.6,.6,1))
//           }else if(  body.mass >= 1.0 and body.mass < 1.5){  #G type
//                   body.texture = loader.loadTexture("models/GMstar.jpg")
//                   sunMaterial.setEmission(VBase4(1,.6,.6,1))
//
//           // #}else if(  body.mass >= 1.5 and body.mass < 1.5){  #G type
//           //         #body.texture = loader.loadTexture("models/Mstar.jpg")
//           //         #sunMaterial.setEmission(VBase4(1,.6,.6,1))
//           }else{
//                   body.texture = loader.loadTexture("models/Ostar.jpg")
//                   sunMaterial.setEmission(VBase4(.8,.8,1,1))
//                 }
//
//   }
// }
function loadSystem(){
  var thisSystem = new System(1,1,32,.5,.03);
  thisSystem.convertToMeters();
  var texLoader = new THREE.TextureLoader();
  for (var body of thisSystem.bodies){
    var bodyGeometry = new THREE.SphereGeometry( body.radius, 32, 32 );
    var bodyMaterial;
    // texLoader.load('js/models/Gstar.jpg',
    // function(texture){
    //    bodyMaterial = new THREE.MeshPhongMaterial({color: (Math.random() * 0xffffff)});
    // }
    // );
    bodyMaterial = new THREE.MeshPhongMaterial({color: (Math.random() * 0xffffff)});
    var planet = new THREE.Mesh( bodyGeometry, bodyMaterial );
    planet.position.x = body.position.x;
    planet.position.y = body.position.y;
    planet.position.z = body.position.z;
    scene.add( planet );
    //var bodyMaterial = new THREE.MeshPhongMaterial(   );
    //var bodyMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff} );


  }
}
