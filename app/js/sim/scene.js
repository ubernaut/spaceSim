import { EffectComposer, BloomPass, RenderPass } from 'postprocessing'

import * as weapons from '-/player/weapons'
import { updateSystemCPU, updateSystemGPU } from './system'
import { createDrone } from '-/player/drone'

/**
 * add default lights to a scene
 */
const addLights = scene => {
  const ambient = new THREE.AmbientLight(0x888888)
  scene.add(ambient)
}

/**
 * create a square grid for visualizing distances
 */
const squareGrid = () => {
  const size = 100000000
  const divisions = 1000
  const gridHelper1 = new THREE.GridHelper(size, divisions, 0xffffff, 0xfffff)
}

/**
 * deploy a small drone object next to the player
 */
const deployDrone = ship => createDroneOpts => {
  const drone = createDrone(createDroneOpts)
  ship.add(drone.mesh)
  drone.mesh.position.set(5, 5, 5)
}

/**
 * add post processing effects, e.g., bloom filter
 */
const addPostprocessing = ({ renderer, scene, camera }) => {
  // postprocessing
  Void.composer = new EffectComposer(renderer)
  Void.composer.addPass(new RenderPass(scene, camera))

  const bloomPass = new BloomPass({
    resolutionScale: 0.05,
    kernelSize: 3.0,
    intensity: 0.3,
    distinction: 1
  })
  bloomPass.renderToScreen = true
  bloomPass.combineMaterial.defines.SCREEN_MODE = '1'
  bloomPass.combineMaterial.needsUpdate = true
  Void.composer.addPass(bloomPass)
}

/**
 * add the universe object to the scene
 */
const addUniverse = scene => {
  const oortGeometry = new THREE.SphereGeometry(7.5 * Math.pow(10, 15), 32, 32)
  const oortMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 })
  const oort = new THREE.Mesh(oortGeometry, oortMaterial)
  // scene.add(oort)

  const galaxyGeometry = new THREE.SphereGeometry(5 * Math.pow(10, 20), 32, 32)
  const galaxyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial)
  // scene.add(galaxy)

  const universeGeometry = new THREE.SphereGeometry(
    4.4 * Math.pow(10, 26),
    32,
    32
  )
  const universeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const universe = new THREE.Mesh(universeGeometry, universeMaterial)
  // scene.add(universe)

  return [ oort, galaxy, universe ]
}

/**
 * animate/update the objects in the scene
 */
const animate = () => {
  requestAnimationFrame(animate)

  const delta = Void.clock.getDelta()

  if (Void.controls) {
    Void.controls.update(delta)
  }

  Void.time.value = Void.clock.getElapsedTime()

  weapons.animate(delta, Void.time.value)

  if (Void.soPhysics && Void.systemLoaded) {
    if (Void.urlConfigs.hasOwnProperty('CPU')) {
      Void.soPhysics.accelerateCuda()
      updateSystemCPU()
    } else {
      Void.soPhysics.GPUAccelerate()
      let GPUcollisions = true
      if (Void.urlConfigs.hasOwnProperty('GPUcollisions')) {
        GPUcollisions = Void.urlConfigs.GPUcollisions
      }
      if (GPUcollisions === true) {
        updateSystemCPU()
      } else {
        updateSystemGPU()
      }
      //
    }
    // updateOimoPhysics()

    Void.animateCallbacks.map(x => x(delta, Void.time.value))
  }

  Void.composer.render(delta)
}

export {
  animate,
  deployDrone,
  addUniverse,
  squareGrid,
  addLights,
  addPostprocessing
}
