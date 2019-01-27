import { ShaderMaterial, NormalBlending, FrontSide } from 'three'
import shader from '-/shaders/lava'
import uniforms from '-/uniforms'

export const material = new ShaderMaterial({
  ...shader,
  blending: NormalBlending,
  depthTest: false,
  transparent: false,
  side: FrontSide
})

export const getUniforms = (radius, rgb, time = 0) => {
  uniforms.sun.color.red.value = (rgb[0] / 255.0) * 0.7
  uniforms.sun.color.green.value = (rgb[1] / 255.0) * 0.7
  uniforms.sun.color.blue.value = (rgb[2] / 255.0) * 0.7

  return {
    noiseScale: {
      value: 35 / radius
    },
    noiseJitter: {
      value: 2
    },
    manhattanDistance: {
      value: true
    },
    noiseStrength: {
      value: 1
    },
    baseColorRed: uniforms.sun.color.red,
    baseColorGreen: uniforms.sun.color.green,
    baseColorBlue: uniforms.sun.color.blue,
    time
  }
}
