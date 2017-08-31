const weapons = {
  machineGun: {
    mkBulletGeometry: () => new THREE.SphereGeometry(16, 4, 4),
    velocity: 100,
    flightTime: 10000
  }
}

const mkBullet = weapon => {
  const bulletGeometry = weapons[weapon].mkBulletGeometry()
  const bulletMaterial = new THREE.MeshPhongMaterial({
    color: (Math.random() * 0xffffff)
  })
  return {
    mesh: new THREE.Mesh(bulletGeometry, bulletMaterial)
  }
}

const shoot = (player, weapon) => {
  const bullet = mkBullet(weapon)
  bullet.mesh.position.copy(player.position)
  bullet.mesh.quaternion.copy(player.quaternion)
  Void.scene.add(bullet.mesh)

  const moveBullet = () => {
    bullet.mesh.translateZ(-1 * weapons[weapon].velocity)
  }

  const flight = setInterval(moveBullet, 50)
  setTimeout(() => {
    clearInterval(flight)
    Void.scene.remove(bullet.mesh)
  }, weapons[weapon].flightTime)
}

export {
  shoot
}
