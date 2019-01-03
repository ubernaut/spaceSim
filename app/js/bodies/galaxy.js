import Point from '@void/core/system-builder/Point'

import { createRandomDistantStar } from '-/bodies/star'
import { randomUniform } from '-/utils'

class Galaxy {
  constructor () {
    this.stars = []
    this.theta = 0
    this.dTheta = 0.02
    this.maxTheta = 8
    this.alpha = 5 * Math.pow(10, 19)
    this.beta = 0.25
    this.e = 2.71828182845904523536
    this.starDensity = 10
    while (this.theta < this.maxTheta) {
      this.theta += this.dTheta
      let randMax = this.alpha / (1 + this.theta)
      let randMin = 0 - randMax
      this.starDensity = 10 / (1 + this.theta)
      for (let i = 0; i <= this.starDensity; i++) {
        let xPos =
          this.alpha *
          Math.pow(this.e, this.beta * this.theta) *
          Math.cos(this.theta)
        let yPos =
          this.alpha *
          Math.pow(this.e, this.beta * this.theta) *
          Math.sin(this.theta)
        xPos = xPos + Math.random() * (randMax - randMin) + randMin
        yPos = yPos + Math.random() * (randMax - randMin) + randMin
        let zPos = Math.random() * (randMax - randMin) + randMin
        // let newStar = new Star(xPos, yPos, zPos, 'star', 'cos')
        let randColor = randomUniform(0.5, 1) * 0xffffff
        const material = new THREE.MeshBasicMaterial({ color: randColor })
        let starRadius = 1.9 * Math.pow(10, 16)
        let starPosition = new Point([ xPos, yPos, zPos ])
        const newStar = createRandomDistantStar({
          radius: starRadius,
          position: starPosition
        })
        this.stars.push(newStar)
        starPosition = new Point([ -xPos, -yPos, -zPos ])
        const oppositeStar = createRandomDistantStar({
          radius: starRadius,
          position: starPosition
        })
        this.stars.push(oppositeStar)
      }
    }
  }
}

const createGalaxy = scene => {
  const galaxy = new Galaxy()
  for (let i = 0; i < galaxy.stars.length; i++) {
    scene.add(galaxy.stars[i].object)
  }
  return galaxy
}

const addStars = scene => {
  const radius = 5 * Math.pow(10, 20)
  let i = 0
  let r = radius

  let starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ]
  for (i = 0; i < 5000; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = Math.random() * (2 - 1)
    vertex.y = (Math.random() * (2 - 1)) / 3
    vertex.z = Math.random() * (2 - 1)
    vertex.multiplyScalar(r)

    starsGeometry[0].vertices.push(vertex)
  }
  for (i = 0; i < 5000; i++) {
    const vertex = new THREE.Vector3()
    vertex.x = Math.random() * (2 - 1)
    vertex.y = (Math.random() * (2 - 1)) / 3
    vertex.z = Math.random() * (2 - 1)
    vertex.multiplyScalar(r)
    starsGeometry[1].vertices.push(vertex)
  }

  let stars
  const starsMaterials = [
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 10000000000000000,
      sizeAttenuation: true,
      fog: false
    }),
    new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 10000000000000000,
      sizeAttenuation: true,
      fog: false
    }),
    new THREE.PointsMaterial({
      color: 0x555555,
      size: 10000000000000000,
      sizeAttenuation: true,
      fog: false
    }),
    new THREE.PointsMaterial({
      color: 0xff0000,
      size: 10000000000000000,
      sizeAttenuation: true,
      fog: false
    }),
    new THREE.PointsMaterial({
      color: 0xffdddd,
      size: 10000000000000000,
      sizeAttenuation: true,
      fog: false
    }),
    new THREE.PointsMaterial({
      color: 0xddddff,
      size: 10000000000000000,
      sizeAttenuation: true,
      fog: false
    })
  ]
  for (i = 10; i < 30; i++) {
    stars = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6])
    // stars.rotation.x = Math.random() * 6;
    // stars.rotation.y = Math.random() * 6;
    // stars.rotation.z = Math.random() * 6;
    //  stars.scale.setScalar( i * 10 );
    stars.position.x -= radius / 2
    stars.position.y -= radius / 6
    stars.position.z -= radius / 2
    stars.matrixAutoUpdate = false
    stars.updateMatrix()
    scene.add(stars)
  }
}
export { addStars, createGalaxy }
