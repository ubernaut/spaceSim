import { ShaderMaterial, NormalBlending, FrontSide } from 'three'
import shader from 'app/shaders/lava'

const material = new ShaderMaterial({
  ...shader,
  blending: NormalBlending,
  depthTest: false,
  transparent: false,
  side: FrontSide
})

export default material
