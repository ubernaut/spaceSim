import {
  IcosahedronBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  Geometry,
  PointsMaterial,
  Points,
  PointLight,
  BufferGeometry,
  Float32BufferAttribute,
  SphereGeometry
} from 'three'

import lavaMaterial from '-/materials/lava'
import createCoronaMaterial from '-/materials/corona'
import { randomUniform } from '-/utils'

import uniforms from '-/uniforms'

const starTypes = {
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

const getRandomStarType = () => {
  let starColor = 'F8'

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
  return starColor
}

const createRandomStar = ({ radius, position, time = 0 }) => {
  const starColor = getRandomStarType()

  return createStar({
    radius: radius,
    position: position,
    color: starColor,
    time
  })
}

const createRandomDistantStar = ({ radius, position, simple = true }) => {
  let star = {}

  star.type = getRandomStarType()
  star.color = starTypes[star.type]
  if (simple) {
    const geometry = new Geometry()
    const vertex = new Vector3()
    vertex.x = position.x
    vertex.y = position.y
    vertex.z = position.z
    geometry.vertices.push(vertex)
    const material = new PointsMaterial({
      color: rgb2hex(star.color),
      size: 2,
      sizeAttenuation: false,
      fog: false
    })
    star.object = new Points(geometry, material)
    star.object.matrixAutoUpdate = false
    star.object.updateMatrix()
  } else {
    const geometry = new IcosahedronBufferGeometry(radius, 0)
    const material = new MeshBasicMaterial({
      color: rgb2hex(star.color),
      emissive: rgb2hex(star.color)
    })
    star.object = new Mesh(geometry, material)
    star.object.position.x = position.x
    star.object.position.y = position.y
    star.object.position.z = position.z
  }

  return star
}

const createStar = ({ radius, position, color, time = 0 }) => {
  const rgb = starTypes.K7

  // const photosphere = createPhotosphere(radius, rgb, time)
  const chromosphere = createChromosphere(radius, rgb, time)
  const corona = createCorona(radius, rgb, time)

  const pointLight = new PointLight(rgb2hex(starTypes[color]), 1.7, 0, 2)
  pointLight.castShadow = true
  ;[ chromosphere, corona, pointLight ].map(s => {
    s.position.x = position.x
    s.position.y = position.y
    s.position.z = position.z
  })

  const animate = (delta, tick) => {
    ;[ chromosphere ].map(mesh => {
      mesh.rotation.z -= 0.0005
    })
  }

  return {
    chromosphere,
    corona,
    pointLight,
    animate
  }
}

const rgb2hex = rgb => {
  return parseInt('0x' + rgb.map(x => parseInt(x).toString(16)).join(''), 16)
}

const createCorona = (radius, rgb, time) => {
  const geometry = new BufferGeometry()
  geometry.addAttribute('position', new Float32BufferAttribute([ 0, 0, 0 ], 3))

  const material = createCoronaMaterial({ radius })
  material.uniforms = getUniforms(radius, rgb, time)
  // material.color.setRGB(0.9, 0.7, 0.7)

  const mesh = new Points(geometry, material)
  mesh.frustumCulled = false
  mesh.name = 'Corona'

  return mesh
}

const createChromosphere = (radius, rgb, time) => {
  const geometry = new SphereGeometry(radius, 64, 64)

  const material = lavaMaterial.clone()
  material.uniforms = getUniforms(radius, rgb, time)

  const mesh = new Mesh(geometry, material)
  mesh.name = 'Chromosphere'
  mesh.renderOrder = 0
  return mesh
}

// const createPhotosphere = (radius, rgb, time) => {
//   const geometry = new THREE.SphereGeometry(radius * 0.99, 16, 16)
//   const material = new THREE.ShaderMaterial({
//     uniforms: getUniforms(radius, rgb, time),
//     vertexShader,
//     fragmentShader,
//     transparent: true,
//     depthTest: false,
//     opacity: 0.5
//   })
//   material.side = THREE.DoubleSide
//   const mesh = new THREE.Mesh(geometry, material)
//   mesh.name = 'Photosphere'
//   return mesh
// }

const getUniforms = (radius, rgb, time = 0) => {
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

export { createStar, createRandomStar, starTypes, createRandomDistantStar }
