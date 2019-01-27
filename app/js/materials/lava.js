import { ShaderMaterial, NormalBlending, FrontSide } from 'three'
import shader from '-/shaders/lava'

export const material = new ShaderMaterial({
  ...shader,
  blending: NormalBlending,
  depthTest: false,
  transparent: false,
  side: FrontSide
})

export const getUniforms = ({ radius, rgb, time = 0 }) => {
  const sunColor = [
    (rgb[0] / 255.0) * 0.7,
    (rgb[1] / 255.0) * 0.7,
    (rgb[2] / 255.0) * 0.7
  ]

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
    baseColorRed: {
      value: sunColor[0]
    },
    baseColorGreen: {
      value: sunColor[1]
    },
    baseColorBlue: {
      value: sunColor[2]
    },
    time
  }
}
