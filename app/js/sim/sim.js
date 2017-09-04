import Promise from 'bluebird'

import { createStar } from '-/bodies/star'
import { createPlanet } from '-/bodies/planet'
import * as controls from '-/player/controls'
import { onProgress, onError, randomUniform, getUrlParameter } from '-/utils'
import { soPhysics, convertSystemToMeters } from './systemBuilder'
import SystemBuilderWorker from './workers/systemBuilder.worker'

let container,
  camera,
  renderer
let world = null

let galaxyRadius
const loadSystem = () => {
  const systemWorker = new SystemBuilderWorker()

  systemWorker.postMessage('!')
  systemWorker.onmessage = e => {
    Void.thisSystem = e.data

    const metersBodies = convertSystemToMeters(Void.thisSystem)
    Void.thisSystem.bodies = metersBodies

    Void.soPhysics = new soPhysics(Void.thisSystem, 0, 0.001, true)

    const mkBody = body => {
      if (body.name === 'star') {
        const { core, surface } = createStar({ radius: body.radius, position: body.position, color: 'B1', time: Void.time })
        body.object = surface
        Void.scene.add(surface)
        Void.scene.add(core)
      } else {
        const planet = createPlanet({ radius: body.radius, position: body.position })
        body.object = planet
        Void.scene.add(planet)
      }
    }
    Promise.map(Void.thisSystem.bodies, body => Promise.resolve(mkBody(body)).delay(Math.random() * 300), { concurrency: 12 })
  }
  Void.systemLoaded = true
}

const updateSystem = () => {
  let i = 0
  for (const body of Void.thisSystem.bodies) {
    if (body.object) {
      let collidedIndex = Void.soPhysics.collisions.indexOf(body.name)
      if (collidedIndex !== -1) {
        Void.soPhysics.collisions.splice(collidedIndex, 1)
        if (body.name !== 'star') {
          Void.scene.remove(body.object)
          body.radius = Void.soPhysics.gridSystem.rad[i]
          let bodyGeometry = new THREE.SphereGeometry(body.radius, 32, 32)
          let bodyMaterial = new THREE.MeshPhongMaterial({
            color: randomUniform(0.5, 1) * 0xffffff
          })
          const planet = new THREE.Mesh(bodyGeometry, bodyMaterial)
          planet.position.x = body.position.x
          planet.position.y = body.position.y
          planet.position.z = body.position.z
          body.object = planet
          Void.scene.add(planet)

          body.object.position.x = Void.soPhysics.gridSystem.pos[i][0]
          body.object.position.y = Void.soPhysics.gridSystem.pos[i][1]
          body.object.position.z = Void.soPhysics.gridSystem.pos[i][2]
        }
      } else {
        body.object.position.x = Void.soPhysics.gridSystem.pos[i][0]
        body.object.position.y = Void.soPhysics.gridSystem.pos[i][1]
        body.object.position.z = Void.soPhysics.gridSystem.pos[i][2]
      }
      if (Void.soPhysics.gridSystem.names[i] === 'DELETED') {
        Void.scene.remove(body.object)
        // console.log('removed body')
        body.object = ''
      }
    }
    i++
  }
}

const initOimoPhysics = () => {
  // world setting:( TimeStep, BroadPhaseType, Iterations )
  // BroadPhaseType can be
  // 1 : BruteForce
  // 2 : Sweep and prune , the default
  // 3 : dynamic bounding volume tree
  world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2,
    worldscale: 1,
    random: true,
    info: false,
    gravity: [ 0, 0, 0 ]
  })
  // populate(1);
  // setInterval(updateOimoPhysics, 1000/60);
}

const init = rootEl => {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 4.4 * Math.pow(10, 26))
  camera.lookAt(new THREE.Vector3(0, 0, -1000000000000000000))
  Void.camera = camera

  // scene
  Void.scene = new THREE.Scene()
  const ambient = new THREE.AmbientLight(0x888888)
  Void.scene.add(ambient)

  const directionalLight = new THREE.DirectionalLight(0xffeedd)
  directionalLight.position.set(0, 0, 1).normalize()

  const size = 100000000
  const divisions = 1000

  const gridHelper1 = new THREE.GridHelper(size, divisions, 0xffffff, 0xfffff)

  Void.scene.add(gridHelper1)

  THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader())
  const mtlLoader = new THREE.MTLLoader()
  // mtlLoader.setPath( 'obj/male02/' );
  mtlLoader.setPath('app/assets/models/')
  mtlLoader.load('ship.mtl', (materials) => {
    materials.preload()
    const objLoader = new THREE.OBJLoader()

    objLoader.setMaterials(materials)
    objLoader.setPath('app/assets/models/')
    objLoader.load('ship.obj', (object) => {
      object.position.x = 0
      object.position.y = 0
      object.scale.set(20, 20, 20)
      object.rotation.set(0, 0, 0)
      object.name = 'spaceShip'

      Void.ship = object
      Void.ship.add(camera)
      camera.position.set(0, 10, 30)
      Void.scene.add(object)

      Void.controls = controls.setFlyControls({ camera: Void.camera, ship: Void.ship, el: document })

      const helper = new THREE.PolarGridHelper(2000, 1, 6, 36, 0xfffff, 0xfffff)
      helper.geometry.rotateY(Math.PI)
      Void.scene.add(helper)
      Void.ship.add(helper)
    }, onProgress, onError)
  })

  // scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
  const pointlight = new THREE.PointLight()
  pointlight.position.set(0, 0, 0)
  pointlight.castShadow = true
  Void.scene.add(pointlight)

  const oortGeometry = new THREE.SphereGeometry(7.5 * Math.pow(10, 15), 32, 32)
  const oortMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 })
  const oort = new THREE.Mesh(oortGeometry, oortMaterial)
  Void.scene.add(oort)

  galaxyRadius = 5 * Math.pow(10, 20)
  const galaxyGeometry = new THREE.SphereGeometry(5 * Math.pow(10, 20), 32, 32)
  const galaxyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial)
  Void.scene.add(galaxy)

  const universeGeometry = new THREE.SphereGeometry(4.4 * Math.pow(10, 26), 32, 32)
  const universeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const universe = new THREE.Mesh(universeGeometry, universeMaterial)
  Void.scene.add(universe)

  renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  rootEl.appendChild(renderer.domElement)

  let stars = getUrlParameter('nostars')
  if (stars === 'true') {
    // don't add stars
  } else {
    addStars()
  }

  window.addEventListener('resize', onWindowResize, false)

  initOimoPhysics()
  Void.world = world
  loadSystem()
}

const addStars = () => {
  const radius = galaxyRadius
  let i,
    r = radius,
    starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ]
  for (i = 0; i < 5000; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = (Math.random() * (2 - 1))
    vertex.y = (Math.random() * (2 - 1)) / 3
    vertex.z = (Math.random() * (2 - 1))
    vertex.multiplyScalar(r)

    starsGeometry[0].vertices.push(vertex)
  }
  for (i = 0; i < 5000; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = (Math.random() * (2 - 1))
    vertex.y = (Math.random() * (2 - 1)) / 3
    vertex.z = (Math.random() * (2 - 1))
    vertex.multiplyScalar(r)
    starsGeometry[1].vertices.push(vertex)
  }

  let stars
  const starsMaterials = [
    new THREE.PointsMaterial({ color: 0xffffff, size: 10000000000000000, sizeAttenuation: true }),
    new THREE.PointsMaterial({ color: 0xaaaaaa, size: 10000000000000000, sizeAttenuation: true }),
    new THREE.PointsMaterial({ color: 0x555555, size: 10000000000000000, sizeAttenuation: true }),
    new THREE.PointsMaterial({ color: 0xff0000, size: 10000000000000000, sizeAttenuation: true }),
    new THREE.PointsMaterial({ color: 0xffdddd, size: 10000000000000000, sizeAttenuation: true }),
    new THREE.PointsMaterial({ color: 0xddddff, size: 10000000000000000, sizeAttenuation: true })
  ]
  for (i = 10; i < 30; i++) {
    stars = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6])
      // stars.rotation.x = Math.random() * 6;
      // stars.rotation.y = Math.random() * 6;
      // stars.rotation.z = Math.random() * 6;
      //  stars.scale.setScalar( i * 10 );
    stars.position.x -= radius / 2
    stars.position.y -= radius / 6
    stars.position.z -= radius / 2
    stars.matrixAutoUpdate = false
    stars.updateMatrix()
    Void.scene.add(stars)
  }
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const updateOimoPhysics = () => {
  if (world == null) {
    return
  }
  world.step()
    // let x,
    //   y,
    //   z,
    //   mesh,
    //   body,
    //   i = bodys.length
    // while (i--) {
    //   body = bodys[i]
    //   mesh = meshs[i]
    //   if (!body.sleeping) {
    //     mesh.position.copy(body.getPosition())
    //     mesh.quaternion.copy(body.getQuaternion())
    //         // change material
    //     if (mesh.material.name === 'sbox') {
    //       mesh.material = mats.box
    //     }
    //     if (mesh.material.name === 'ssph') {
    //       mesh.material = mats.sph
    //     }
    //     if (mesh.material.name === 'scyl') {
    //       mesh.material = mats.cyl
    //     }
    //     // reset position
    //     if (mesh.position.y < -100) {
    //       x = -100 + Math.random() * 200
    //       z = -100 + Math.random() * 200
    //       y = 100 + Math.random() * 1000
    //       body.resetPosition(x, y, z)
    //     }
    //   } else {
    //     if (mesh.material.name === 'box') {
    //       mesh.material = mats.sbox
    //     }
    //     if (mesh.material.name === 'sph') {
    //       mesh.material = mats.ssph
    //     }
    //     if (mesh.material.name === 'cyl') {
    //       mesh.material = mats.scyl
    //     }
    //   }
    // }
}

const animate = () => {
  requestAnimationFrame(animate)
  updateOimoPhysics()
  if (Void.soPhysics) {
    if (Void.systemLoaded) {
      Void.soPhysics.accelerateCuda()
      updateSystem()
    }
  }
  render()
}

const initialTime = 100
const render = () => {
  const delta = Void.clock.getDelta()
  if (Void.controls) {
    Void.time.value = initialTime + Void.clock.getElapsedTime()
    Void.controls.update(delta)
  }
  renderer.render(Void.scene, camera)
}
//   function getTexture(body) {
//
//     if (body.mass < 0.001)
//       body.texture = loader.loadTexture("models/earthmoon.jpg")
//   } else if (body.mass >= 0.001 and body.mass < .002) {
//     body.texture = loader.loadTexture("models/mars.jpg")
//   } else if (body.mass >= .002 and body.mass < .003) {
//     body.texture = loader.loadTexture("models/venus.jpg")
//   } else if (body.mass >= .003 and body.mass < .006) {
//     body.texture = loader.loadTexture("models/mercury.jpg")
//   } else if (body.mass >= .006 and body.mass < .009) {
//     body.texture = loader.loadTexture("models/pluto.jpg")
//   } else if (body.mass >= .009 and body.mass < .01) {
//     body.texture = loader.loadTexture("models/uranus.jpg")
//   } else if (body.mass >= .01 and body.mass < .03) {
//     body.texture = loader.loadTexture("models/saturn.jpg")
//   } else if (body.mass >= .03 and body.mass < .05) {
//     body.texture = loader.loadTexture("models/neptune.jpg")
//   } else if (body.mass >= .05 and body.mass < .1) {
//     body.texture = loader.loadTexture("models/saturn.jpg")
//   } else if (body.mass >= .1 and body.mass < .2) {
//     body.texture = loader.loadTexture("models/jupiter.jpg")
//   } else {
//     if (body.mass >= .7 and body.mass < 1.0) {
//       // #M type
//       body.texture = loader.loadTexture("models/Mstar.jpg")
//       sunMaterial.setEmission(VBase4(1, .6, .6, 1))
//     } else if (body.mass >= 1.0 and body.mass < 1.5) {
//       // #K type
//       body.texture = loader.loadTexture("models/Kstar.jpg")
//       sunMaterial.setEmission(VBase4(1, .6, .6, 1))
//     } else if (body.mass >= 1.0 and body.mass < 1.5) {
//       // #G type
//       body.texture = loader.loadTexture("models/GMstar.jpg")
//       sunMaterial.setEmission(VBase4(1, .6, .6, 1))
//
//       // #}else if(  body.mass >= 1.5 and body.mass < 1.5){  #G type
//       //         #body.texture = loader.loadTexture("models/Mstar.jpg")
//       //         #sunMaterial.setEmission(VBase4(1,.6,.6,1))
//     } else {
//       body.texture = loader.loadTexture("models/Ostar.jpg")
//       sunMaterial.setEmission(VBase4(.8, .8, 1, 1))
//     }
//   }
// }

export { init, animate, loadSystem, world }
