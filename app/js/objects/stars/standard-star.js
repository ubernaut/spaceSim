import {
  Mesh,
  Points,
  PointLight,
  BufferGeometry,
  Float32BufferAttribute,
  SphereGeometry
} from 'three'

import * as lavaMaterial from '-/materials/lava'
import createCoronaMaterial from '-/materials/corona'
import { rgb2hex } from '-/utils'
import { getRandomStarType } from './utils'
import constants from '-/constants'

export const createStar = ({ radius, position, starType, time = 0 }) => {
  const rgb = constants.starTypes[starType]
  const chromosphere = createChromosphere(radius, rgb, time)
  const corona = createCorona(radius, rgb, time)
  const pointLight = new PointLight(rgb2hex(rgb), 1.7, 0, 2)

  ;[ chromosphere, corona, pointLight ].map(s => {
    s.position.x = position.x
    s.position.y = position.y
    s.position.z = position.z
  })

  return {
    chromosphere,
    corona,
    pointLight,
    animate: (delta, tick) => {
      chromosphere.rotation.z -= 0.025 * delta
    }
  }
}

const createCorona = (radius, rgb, time) => {
  const geometry = new BufferGeometry()
  geometry.addAttribute('position', new Float32BufferAttribute([ 0, 0, 0 ], 3))
  const material = createCoronaMaterial({ radius })
  material.uniforms = lavaMaterial.getUniforms({ radius, rgb, time })
  const mesh = new Points(geometry, material)
  mesh.frustumCulled = false
  mesh.name = 'Corona'
  return mesh
}

const createChromosphere = (radius, rgb, time) => {
  const geometry = new SphereGeometry(radius, 64, 64)
  const material = lavaMaterial.material.clone()
  material.uniforms = lavaMaterial.getUniforms({ radius, rgb, time })
  const mesh = new Mesh(geometry, material)
  mesh.name = 'Chromosphere'
  return mesh
}

export const createRandomStar = ({ radius, position, time = 0 }) =>
  createStar({
    radius: radius,
    position: position,
    starType: getRandomStarType(),
    time
  })
