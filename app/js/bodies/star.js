import fragmentShader from 'app/shaders/star.fs.glsl'
import vertexShader from 'app/shaders/star.vs.glsl'

const starColors = {
  O5: [ 157, 180, 255 ],
  B1: [ 162, 185, 255 ],
  B3: [ 167, 188, 255 ],
  B5: [ 170, 191, 255 ],
  B8: [ 175, 195, 255 ],
  A1: [ 186, 204, 255 ],
  A3: [ 192, 209, 255 ],
  A5: [ 202, 216, 255 ],
  F0: [ 228, 232, 255 ],
  F2: [ 237, 238, 255 ],
  F5: [ 251, 248, 255 ],
  F8: [ 255, 249, 249 ],
  G2: [ 255, 245, 236 ],
  G5: [ 255, 244, 232 ],
  G8: [ 255, 241, 223 ],
  K0: [ 255, 235, 209 ],
  K4: [ 255, 215, 174 ],
  K7: [ 255, 198, 144 ],
  M2: [ 255, 190, 127 ],
  M4: [ 255, 187, 123 ],
  M6: [ 255, 187, 123 ]
}

const createStar = ({ radius, position, color, time = 0 }) => {
  let rgb
  if (typeof color === 'string') {
    rgb = starColors[color]
  }
  if (!color || !rgb) {
    rgb = starColors.K7
  }

  const coreGeometry = new THREE.SphereGeometry(radius * 0.999, 16, 16)
  const coreMaterial = new THREE.MeshPhongMaterial({
    color: 0 * 0xffffff
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)

  const surfaceGeometry = new THREE.SphereGeometry(radius, 64, 64)
  const surfaceMaterial = new THREE.ShaderMaterial({
    uniforms: getUniforms(radius, rgb, time),
    vertexShader,
    fragmentShader,
    depthTest: false
  })
  const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial)

  ;[ core, surface ].map(s => {
    s.position.x = position.x
    s.position.y = position.y
    s.position.z = position.z
  })

  return {
    core,
    surface
  }
}

const getUniforms = (radius, rgb, time = 0) => {
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
      value: rgb[0] / 255.0
    },
    baseColorGreen: {
      value: rgb[1] / 255.0
    },
    baseColorBlue: {
      value: rgb[2] / 255.0
    },
    time
  }
}

export {
  createStar
}
