const weapons = {
  planetCannon: {
    mkBulletGeometry: () => new THREE.SphereGeometry(32, 4, 4),
    velocity: 100,
    flightTime: 10000
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
    velocity: weapons[weaponType].velocity,
    mesh: bullet.mesh
  })

  return { color }
}

const animate = (delta, time) => {
  bullets.map(b => {
    if (b.flightTime <= 0) {
      Void.scene.remove(b.mesh)
      bullets.remove(b)
    } else {
      b.mesh.translateZ(-10 * b.velocity * delta)
      b.flightTime -= delta
    }
  })
}

export {
  shoot,
  animate
}
