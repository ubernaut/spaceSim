import {
  IcosahedronBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  Geometry,
  PointsMaterial,
  Points
} from 'three'
import { rgb2hex } from '-/utils'
import constants from '-/constants'
import { getRandomStarType } from './utils'

export const createRandomDistantStar = ({
  radius,
  position,
  simple = true
}) => {
  const star = {
    type: getRandomStarType()
  }
  star.color = constants.starTypes[star.type]

  if (simple) {
    const geometry = new Geometry()
    geometry.vertices.push(new Vector3(...[ position.x, position.y, position.z ]))
    const material = new PointsMaterial({
      color: rgb2hex(star.color),
      size: 2,
      sizeAttenuation: false,
      fog: false
    })
    star.object = new Points(geometry, material)
    star.object.matrixAutoUpdate = false
    star.object.updateMatrix()
    return star
  }

  const geometry = new IcosahedronBufferGeometry(radius, 0)
  const material = new MeshBasicMaterial({
    color: rgb2hex(star.color)
  })
  star.object = new Mesh(geometry, material)
  star.object.position.x = position.x
  star.object.position.y = position.y
  star.object.position.z = position.z
  return star
}
