const createCorona = ({ radius }) => {
  const sprite = new THREE.TextureLoader().load('app/assets/images/corona.png')

  return new THREE.PointsMaterial({
    sizeAttenuation: true,
    size: radius * 1e9,
    map: sprite,
    alphaTest: 0.05,
    transparent: true,
    blending: THREE.AdditiveBlending
  })
}

export default createCorona
