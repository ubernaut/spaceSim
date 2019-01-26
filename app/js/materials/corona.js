import { PointsMaterial, AdditiveBlending, TextureLoader } from 'three'

const createCorona = ({ radius }) => {
  const sprite = new TextureLoader().load('app/assets/images/corona.png')

  return new PointsMaterial({
    sizeAttenuation: true,
    size: radius * 1e9,
    map: sprite,
    alphaTest: 0.05,
    transparent: true,
    blending: AdditiveBlending
  })
}

export default createCorona
