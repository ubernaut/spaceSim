import { WebGLRenderer, PerspectiveCamera, Scene, Clock } from 'three'
import { EffectComposer, BloomEffect, RenderPass, EffectPass} from 'postprocessing'

const createApp = async options => {
  const root = document.querySelector(options.root)
  if (!root) {
    console.error('invalid root element')
    return
  }

  const scene = new Scene()
  const renderer = createRenderer()

  root.appendChild(renderer.domElement)

  const animateCallbacks = []
  const addAnimateCallback = animateCallback => {
    animateCallbacks.push(animateCallback)
  }
  const removeAnimateCallback = animateCallback => {
    animateCallbacks.remove(animateCallback)
  }

  /**
   * Preload assets, data, etc.
   */
  let preload
  if (options.scene.preload) {
    preload = await options.scene.preload()
  }

  /**
   * Create the app, scene, objects, etc.
   */
  const create = await options.scene.create({
    preload,
    scene,
    renderer,
    addAnimateCallback
  })

  window.addEventListener(
    'resize',
    onWindowResize({ renderer, camera: create.camera }),
    false
  )

  /**
   * Set up animations and the update/render loop
   */
  const clock = new Clock()
  const animate = animateOptions => {
    renderer.clear()
    requestAnimationFrame(() => animate(animateOptions))

    const delta = clock.getDelta()
    animateOptions.animateCallbacks.map(x => x(delta, clock.getElapsedTime()))

    if (options.scene.update) {
      options.scene.update({ preload, create, scene, renderer, delta })
    }
  }
  animate({ animateCallbacks: create.animateCallbacks })
}

const onWindowResize = ({ renderer, camera }) => () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

/**
 * add post processing effects, e.g., bloom filter
 */
export const createPostprocessing = ({ renderer, scene, camera }) => {
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  const bloomPass = new BloomEffect({
    mipmapBlur: true,
    intensity: 0.5
  })
  bloomPass.renderToScreen = true
  // bloomPass.combineMaterial.defines.SCREEN_MODE = '1'
  // bloomPass.combineMaterial.needsUpdate = true
  composer.addPass(new EffectPass(camera, bloomPass))

  return composer
}

export const createRenderer = () => {
  const renderer = new WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
    sortObjects: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  return renderer
}

export const createCamera = options => {
  const camera = new PerspectiveCamera(
    options.fov,
    window.innerWidth / window.innerHeight,
    options.nearClip,
    options.farClip
  )
  return camera
}

export default createApp
