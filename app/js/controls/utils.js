export const calcObjectDistance = (obj1, obj2) => {
  const dx = obj1.position.x - obj2.position.x
  const dy = obj1.position.y - obj2.position.y
  const dz = obj1.position.z - obj2.position.z

  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

export const calcDistances = dist_m => {
  return {
    ly: (dist_m / 9460730472580800).toExponential(4),
    km: (dist_m / 1000).toExponential(4),
    mi: (dist_m / 1609.344).toExponential(4),
    au: (dist_m / 149597870700).toExponential(4),
    pc: (dist_m / 3.08567758149137e16).toExponential(4)
  }
}

/**
 * Take a mouse position X,Y where
 *   1 > X > 0,
 *   1 > Y > 0
 * and return a Vec2 position where
 *   1 > X > -1
 *   1 > Y > -1
 * based on window.innerWidth and window.innerHeight
 */
export const mouseToSceneCoords = (x, y) => {
  const xScene = (x / window.innerWidth) * 2 - 1
  const yScene = -(y / window.innerHeight) * 2 + 1
  return new THREE.Vector2(xScene, yScene)
}

export const testIntersections = ({ scene, raycaster }) => {
  const bodies = scene.children.filter(
    x => x.name === 'Planet' || x.name === 'Chromosphere'
  )

  const spaceShips = scene.children
    .filter(x => x.name === 'spaceShip')
    .map(
      ship =>
        ship.children.find(c => c.name === 'Icosahedron_Standard').children[0]
          .children[0]
    )

  return raycaster.intersectObjects([ ...bodies, ...spaceShips ])
}

export let highlightMesh = null

export const loadHighlightMesh = async () => {
  const sprite = await new Promise((resolve, reject) => {
    new THREE.TextureLoader().load('app/assets/images/corona.png', s =>
      resolve(s)
    )
  })
  const geometry = new THREE.BufferGeometry()
  geometry.addAttribute(
    'position',
    new THREE.Float32BufferAttribute([ 0, 0, 0 ], 3)
  )
  const material = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: true,
    map: sprite,
    alphaTest: 0.05,
    transparent: true,
    blending: THREE.AdditiveBlending
  })
  material.color.setRGB(0, 0, 1)
  highlightMesh = new THREE.Points(geometry, material)
  highlightMesh.frustumCulled = false
  highlightMesh.name = 'selection'

  const pointLight = new THREE.PointLight(0x0000ff, 1.25, 0, 2)
  pointLight.name = 'selection'
  highlightMesh.add(pointLight)
  return highlightMesh
}
