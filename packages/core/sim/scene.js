import { EffectComposer, BloomPass, RenderPass } from 'postprocessing'

import * as weapons from '-/player/weapons'
import { updateSystemCPU, updateSystemGPU } from './system'

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
 * add post processing effects, e.g., bloom filter
 */
const createPostprocessing = ({ renderer, scene, camera }) => {
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  const bloomPass = new BloomPass({
    resolutionScale: 0.05,
    kernelSize: 3.0,
    intensity: 0.3,
    distinction: 1
  })
  bloomPass.renderToScreen = true
  bloomPass.combineMaterial.defines.SCREEN_MODE = '1'
  bloomPass.combineMaterial.needsUpdate = true
  composer.addPass(bloomPass)

  return composer
}

/**
 * add the universe object to the scene
 */
const createUniverse = scene => {
  const oortGeometry = new THREE.SphereGeometry(7.5 * Math.pow(10, 15), 32, 32)
  const oortMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 })
  const oort = new THREE.Mesh(oortGeometry, oortMaterial)

  const galaxyGeometry = new THREE.SphereGeometry(5 * Math.pow(10, 20), 32, 32)
  const galaxyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial)

  const universeGeometry = new THREE.SphereGeometry(
    4.4 * Math.pow(10, 26),
    32,
    32
  )
  const universeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const universe = new THREE.Mesh(universeGeometry, universeMaterial)

  return [ oort, galaxy, universe ]
}

/**
 * animate/update the objects in the scene
 */
const animate = ({
  scene,
  systemWorker,
  clock,
  composer,
  useCuda = false,
  useGpuCollisions = false,
  getAnimateCallbacks
}) => {
  requestAnimationFrame(() =>
    animate({
      scene,
      systemWorker,
      clock,
      composer,
      useCuda,
      useGpuCollisions,
      getAnimateCallbacks
    })
  )

  let physics = systemWorker.physics
  if (!scene || !physics) {
    return
  }

  // if (useCuda) {
  // physics.accelerateCuda()
  // updateSystemCPU()
  // } else {

  // physics.GPUAccelerate(useGpuCollisions)
  // if (useGpuCollisions) {

  // physics.GPUAccelerate()
  // updateSystemCPU(scene, physics)

  systemWorker.postMessage([ 'fetch' ])
  // return new Promise((resolve, reject) => {
  systemWorker.onmessage = e => {
    // console.log(e.data)
    // physics.system = e.data[0]
    // physics.gridSystem = e.data[0]

    physics.dt = e.data[0]
    physics.system = e.data[1]
    physics.metric = e.data[2]
    physics.collisions = e.data[3]
    physics.gridSystem = e.data[4]
    physics.maxMark = e.data[5]
    physics.fitness = e.data[6]
    physics.sumFit = e.data[7]
    physics.t = e.data[8]
    physics.count = e.data[9]
    physics.tryCount = e.data[10]
    physics.gpuCollisions = e.data[11]
    physics.biggestBody = e.data[12]

    // resolve(systemWorker)
    updateSystemCPU(scene, physics)
  }

  // updateOimoPhysics()

  const delta = clock.getDelta()

  getAnimateCallbacks().map(x => x(delta, clock.getElapsedTime()))

  composer.render(delta)
}

const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  return renderer
}

const createCamera = options => {
  const camera = new THREE.PerspectiveCamera(
    options.fov,
    window.innerWidth / window.innerHeight,
    options.nearClip,
    options.farClip
  )
  return camera
}

export {
  addLights,
  animate,
  createCamera,
  createPostprocessing,
  createRenderer,
  createUniverse,
  squareGrid
}
