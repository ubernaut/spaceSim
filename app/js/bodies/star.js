import fragmentShader from 'app/shaders/star.fs.glsl'
import vertexShader from 'app/shaders/corona.vs.glsl'
import { randomUniform } from '-/utils'

import { GPUParticleSystem } from 'app/js/webgl/gpu-particle-system'

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

const createRandomStar = ({ radius, position, time = 0 }) => {
  let starColor = ''

  const starrand = randomUniform(1, 10000)
  let subRand = 0
  if (starrand < 7600) {
    // self.mtype()
    subRand = Math.round(randomUniform(1, 3))
    if (subRand === 1) {
      starColor = 'M2'
    } else if (subRand === 2) {
      starColor = 'M4'
    } else if (subRand === 3) {
      starColor = 'M6'
    }
  } else if (starrand < 8800 && starrand > 7600) {
    // self.ktype()
    subRand = Math.round(randomUniform(1, 3))
    if (subRand === 1) {
      starColor = 'K0'
    } else if (subRand === 2) {
      starColor = 'K4'
    } else if (subRand === 3) {
      starColor = 'K7'
    }
  } else if (starrand < 9400 && starrand > 8800) {
    // self.gtype()
    subRand = Math.round(randomUniform(1, 3))
    if (subRand === 1) {
      starColor = 'G2'
    } else if (subRand === 2) {
      starColor = 'G5'
    } else if (subRand === 3) {
      starColor = 'G8'
    }
  } else if (starrand < 9700 && starrand > 9400) {
    // self.ftype()
    subRand = Math.round(randomUniform(1, 4))
    if (subRand === 1) {
      starColor = 'F0'
    } else if (subRand === 2) {
      starColor = 'F2'
    } else if (subRand === 3) {
      starColor = 'F5'
    } else if (subRand === 4) {
      starColor = 'F8'
    }
  } else if (starrand < 9800 && starrand > 9900) {
    // self.atype()
    subRand = Math.round(randomUniform(1, 3))
    if (subRand === 1) {
      starColor = 'A1'
    } else if (subRand === 2) {
      starColor = 'A3'
    } else if (subRand === 3) {
      starColor = 'A5'
    }
  } else if (starrand < 9900 && starrand > 9950) {
    // self.btype()
    subRand = Math.round(randomUniform(1, 4))
    if (subRand === 1) {
      starColor = 'B1'
    } else if (subRand === 2) {
      starColor = 'B3'
    } else if (subRand === 3) {
      starColor = 'B5'
    } else if (subRand === 4) {
      starColor = 'B8'
    }
  } else if (starrand < 9950) {
    // self.otype()
    starColor = 'O5'
  }
  console.log('star is type: ' + starColor)

  return createStar({ radius: radius, position: position, color: starColor, time: Void.time })
}

const particleOptions = {
  position: new THREE.Vector3(),
  positionRandomness: 0.3,
  velocity: new THREE.Vector3(1, 1, 1),
  velocityRandomness: 0.5,
  color: 0xffffff,
  turbulence: 0.5,
  lifetime: 2,
  size: 5,
  sizeRandomness: 1
}

const particleEmitterOptions = {
  spawnRate: 5,
  horizontalSpeed: 1.5,
  verticalSpeed: 1.5,
  timeScale: 1
}

const createStar = ({ radius, position, color, time = 0 }) => {
  let rgb
  if (typeof color === 'string') {
    rgb = starColors[color]
  }
  if (!color || !rgb) {
    rgb = starColors.K7
  }

  const photosphere = createPhotosphere(radius, rgb, time)
  const chromosphere = createChromosphere(radius, rgb, time)

  const emitter = new GPUParticleSystem({
    maxParticles: 100
  })
  emitter.position.set(0, 0, 0)

  const pointLight = new THREE.PointLight(rgb2hex(starColors[color]), 1.3, 0, 2)
  pointLight.castShadow = true

  ;[ emitter, photosphere, chromosphere, pointLight ].map(s => {
    s.position.x = position.x
    s.position.y = position.y
    s.position.z = position.z
  })

  const animate = (delta, tick) => {
    // console.log(time)a
    const position = {
      x: Math.sin(delta * particleEmitterOptions.horizontalSpeed) * 20,
      y: Math.sin(delta * particleEmitterOptions.horizontalSpeed) * 10,
      z: Math.sin(delta * particleEmitterOptions.horizontalSpeed + particleEmitterOptions.verticalSpeed) * 5
    }
    const options = Object.assign({}, particleOptions, { position })
    // console.log(options)wa
    for (var x = 0; x < particleEmitterOptions.spawnRate * delta; x++) {
      emitter.spawnParticle()
    }
    emitter.update(tick)
  }

  return {
    photosphere,
    chromosphere,
    pointLight,
    emitter,
    animate
  }
}

const rgb2hex = rgb => {
  return parseInt('0x' + rgb.map(x => parseInt(x).toString(16)).join(''), 16)
}

const createChromosphere = (radius, rgb, time) => {
  const chromosphereGeometry = new THREE.SphereGeometry(radius, 64, 64)
  const chromosphereMaterial = new THREE.ShaderMaterial({
    uniforms: getUniforms(radius, rgb, time),
    vertexShader,
    fragmentShader,
    depthTest: true,
    transparent: true,
    blending: THREE.AdditiveBlending
  })
  const chromosphere = new THREE.Mesh(chromosphereGeometry, chromosphereMaterial)
  return chromosphere
}

const createPhotosphere = (radius, rgb, time) => {
  const photosphereGeometry = new THREE.SphereGeometry(radius * 0.99, 16, 16)
  const photosphereMaterial = new THREE.ShaderMaterial({
    uniforms: getUniforms(radius, rgb, time),
    vertexShader,
    fragmentShader,
    depthTest: true,
    transparent: true,
    blending: THREE.AdditiveBlending
  })
  const photosphere = new THREE.Mesh(photosphereGeometry, photosphereMaterial)
  return photosphere
}

const getUniforms = (radius, rgb, time = 0) => {
  return {
    viewVector: {
      value: Void.camera
    },
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
      value: rgb[0] / 255.0 * 0.65
    },
    baseColorGreen: {
      value: rgb[1] / 255.0 * 0.55
    },
    baseColorBlue: {
      value: rgb[2] / 255.0 * 0.55
    },
    time
  }
}

export {
  createStar,
  createRandomStar
}
