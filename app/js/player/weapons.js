const weapons = {
  planetCannon: {
    mkBulletGeometry: () => new THREE.SphereGeometry(32, 4, 4),
    velocity: 250,
    flightTime: 7000
  }
}

const mkBullet = (weapon, color) => {
  const geometry = weapons[weapon].mkBulletGeometry()
  const material = new THREE.MeshPhongMaterial({ color })
  return {
    mesh: new THREE.Mesh(geometry, material)
  }
}

let bullets = []

const shoot = ({ quaternion, position, weaponType, color }) => {
  color = color || Math.random() * 0xffffff

  const bullet = mkBullet(weaponType, color)

  bullet.mesh.position.copy(position)
  bullet.mesh.quaternion.copy(quaternion)
  Void.scene.add(bullet.mesh)

  bullets.push({
    flightTime: weapons[weaponType].flightTime,
    velocity: weapons[weaponType].velocity + Void.controls.movementSpeed / 10,
    mesh: bullet.mesh
  })

  return { color }
}

const animate = (delta, time) => {
  bullets = bullets.map(b => {
    if (b.flightTime <= 0) {
      Void.scene.remove(b.mesh)
    } else {
      b.mesh.translateZ(-10 * b.velocity * delta)
      b.flightTime -= delta * 1000
      return b
    }
  }).filter(x => !!x)
}

export {
  shoot,
  animate
}
