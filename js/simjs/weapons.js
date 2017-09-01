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

const shoot = ({ quaternion, position, weaponType, color }) => {
  color = color || Math.random() * 0xffffff

  const bullet = mkBullet(weaponType, color)

  bullet.mesh.position.copy(position)
  bullet.mesh.quaternion.copy(quaternion)
  Void.scene.add(bullet.mesh)

  const moveBullet = () => {
    bullet.mesh.translateZ(-1 * weapons[weaponType].velocity)
  }

  const flight = setInterval(moveBullet, 50)
  setTimeout(() => {
    clearInterval(flight)
    Void.scene.remove(bullet.mesh)
  }, weapons[weaponType].flightTime)

  return { color }
}

export {
  shoot
}
