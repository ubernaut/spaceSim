import fragmentShader from 'app/shaders/star.fs.glsl'
import vertexShader from 'app/shaders/corona.vs.glsl'
import { randomUniform } from '-/utils'

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
    let starColor = ""

    const starrand = randomUniform(1,10000)
    let subRand = 0
    if (starrand < 7600){

            //self.mtype()
            starColor= "M2"
            // subRand = Math.round(randomUniform(1,3))*2
            // color ="M"+subRand.toString()
    }else if (starrand < 8800 && starrand > 7600){
            //self.ktype()
            starColor = "K0"
    }else if (starrand < 9400 && starrand > 8800){
            //self.gtype()
            starColor = "G2"
    }else if (starrand < 9700 && starrand > 9400){
            //self.ftype()
            starColor = "F0"
    }else if (starrand < 9800 && starrand > 9900){
            //self.atype()
            starColor = "A1"
    }else if (starrand < 9900 && starrand > 9950){
            //self.btype()
            starColor = "B1"
    }else if (starrand < 9950){
            //self.otype()
            starColor = "O5"
    }

    return createStar({ radius: radius, position: position, color: starColor,  time: Void.time })
}

const createStar = ({ radius, position, color, time = 0 }) => {
  let rgb
  if (typeof color === 'string') {
    rgb = starColors[color]
  }
  if (!color || !rgb) {
    rgb = starColors.K7
  }

  const photosphereGeometry = new THREE.SphereGeometry(radius * 0.999, 16, 16)
  const photosphereMaterial = new THREE.ShaderMaterial({
    uniforms: getUniforms(radius, rgb, time),
    vertexShader,
    fragmentShader,
    depthTest: false
  })
  const photosphere = new THREE.Mesh(photosphereGeometry, photosphereMaterial)

  const surfaceGeometry = new THREE.SphereGeometry(radius, 64, 64)
  const surfaceMaterial = new THREE.ShaderMaterial({
    uniforms: getUniforms(radius, rgb, time),
    vertexShader,
    fragmentShader,
    depthTest: false
  })
  const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial)

  ;[ photosphere, surface ].map(s => {
    s.position.x = position.x
    s.position.y = position.y
    s.position.z = position.z
  })

  const pointlight = new THREE.PointLight(rgb2hex(starColors[color]), 1.2, 0, 2)
  pointlight.position.set(0, 0, 0)
  pointlight.castShadow = true

  return {
    photosphere,
    surface,
    pointlight
  }
}

const rgb2hex = rgb => {
  return parseInt('0x' + rgb.map(x => parseInt(x).toString(16)).join(''), 16)
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
  createStar, createRandomStar
}
