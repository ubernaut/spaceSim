import shader from 'app/shaders/lava'

const material = new THREE.ShaderMaterial({
  ...shader,
  blending: THREE.NormalBlending,
  depthTest: false,
  transparent: false,
  side: THREE.FrontSide
})

export default material
