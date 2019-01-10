const createApp = async options => {
  /**
   * Preload assets, data, etc.
   */
  let preload
  if (options.scene.preload) {
    preload = options.scene.preload()
  }

  /**
   * Create the app, scene, objects, etc.
   */
  const create = await options.scene.create({
    preload
  })

  /**
   * Set up animations and the update/render loop
   */
  const clock = new THREE.Clock()
  const animate = animateOptions => {
    requestAnimationFrame(() => animate(animateOptions))

    const delta = clock.getDelta()
    animateOptions.animateCallbacks.map(x => x(delta))

    if (options.scene.update) {
      options.scene.update({ preload, create, delta })
    }
  }
  animate({ animateCallbacks: create.animateCallbacks })
}

export default createApp
