const createUniverse = () => {
  const oortGeometry = new THREE.SphereGeometry(7.5 * Math.pow(10, 15), 32, 32)
  const oortMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 })
  const oort = new THREE.Mesh(oortGeometry, oortMaterial)

  const galaxyGeometry = new THREE.SphereGeometry(5 * Math.pow(10, 20), 32, 32)
  const galaxyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial)

  const universeGeometry = new THREE.SphereGeometry(4.4 * Math.pow(10, 26), 32, 32)
  const universeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const universe = new THREE.Mesh(universeGeometry, universeMaterial)

  return [
    oort,
    galaxy,
    universe
  ]
}

export {
  createUniverse
}


const createGalaxy = () =>{
  class Galaxy {
    constructor () {
      this.stars = []
      this.theta = 0
      this.dTheta = 0.05
      this.maxTheta = 10
      this.alpha = 2000
      this.beta = 0.25
      this.e = 2.71828182845904523536
      this.starDensity = 1
      while (this.theta < this.maxTheta) {
        this.theta += this.dTheta
        let randMax = 2000 / (1 + this.theta / 2)
        let randMin = 0 - randMax
        this.starDensity = 10 / (1 + this.theta / 2)
        for (let i = 0; i <= this.starDensity; i++) {
          let xPos = this.alpha * (Math.pow(this.e, (this.beta * this.theta))) * Math.cos(this.theta)
          let yPos = this.alpha * (Math.pow(this.e, (this.beta * this.theta))) * Math.sin(this.theta)
          xPos = xPos + Math.random() * (randMax - randMin) + randMin
          yPos = yPos + Math.random() * (randMax - randMin) + randMin
          let zPos = Math.random() * (randMax - randMin) + randMin
          let newStar = new Star(xPos, yPos, zPos, 'star', 'cos')
          this.stars.push(newStar)
        }
      }
    }
  }
}
