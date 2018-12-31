class GridSystem {
  constructor (bodies = []) {
    this.count = bodies.length
    this.player = 0
    this.names = [ '' ]
    this.mass = [ 0.0 ]
    this.rad = [ 0.0 ]
    this.pos = [ [ 0.0, 0.0, 0.0 ] ]
    this.ori = [ [ 0.0, 0.0, 0.0 ] ]
    this.vel = [ [ 0.0, 0.0, 0.0 ] ]
    this.acc = [ [ 0.0, 0.0, 0.0 ] ]
    this.allocated = 1
    this.collisions = []
    this.removed = []
    for (let i = 0; i < this.count; i++) {
      this.addSpace()
    }
    let i = 0
    for (let body of bodies) {
      if (body.name == 'player') {
        this.player = i
      }
      this.insertBody(body, i)
      i += 1
    }
    // Void.log.debug(bodies)
  }
  getPlayerIndex () {
    let i = 0
    let lasti = 0
    for (let name of this.names) {
      if (name == 'player') {
        this.player = i
        lasti = i
        return i
      } else {
        i += 1
      }
    }
    return i
  }

  insertBody (body, i) {
    this.names[i] = body.name
    this.mass[i] = body.mass
    this.rad[i] = body.radius
    this.pos[i][0] = body.position.x
    this.pos[i][1] = body.position.y
    this.pos[i][2] = body.position.z

    this.ori[i][0] = body.orientation.x
    this.ori[i][1] = body.orientation.y
    this.ori[i][2] = body.orientation.z

    this.vel[i][0] = body.velocity.x
    this.vel[i][1] = body.velocity.y
    this.vel[i][2] = body.velocity.z

    this.acc[i][0] = body.acceleration.x
    this.acc[i][1] = body.acceleration.y
    this.acc[i][2] = body.acceleration.z
  }

  moveBody (source, dest) {
    this.names[dest] = this.names[source]
    this.mass[dest] = this.mass[source]
    this.rad[dest] = this.rad[source]
    this.pos[dest] = this.pos[source]
    this.ori[dest] = this.ori[source]
    this.vel[dest] = this.vel[source]
    this.acc[dest] = this.acc[source]
    this.names[source] = 'OLD'
  }

  removeBody (i) {
    if (i != this.player) {
      if (i == this.count - 1) {
        // do nothing
      } else {
        this.moveBody(this.count - 1, i)
      }
      this.count -= 1
      this.getPlayerIndex()
    }
  }

  resetAcc () {
    for (let i = 0; i < this.count; i++) {
      this.acc[i] = [ 0.0, 0.0, 0.0 ]
    }
  }

  addSpace () {
    this.allocated += 1
    this.names.push('')
    this.mass.push(0.0)
    this.rad.push(0.0)
    this.pos.push([ 0.0, 0.0, 0.0 ])
    this.ori.push([ 0.0, 0.0, 0.0 ])
    this.vel.push([ 0.0, 0.0, 0.0 ])
    this.acc.push([ 0.0, 0.0, 0.0 ])
  }
}

export default GridSystem
