import uuid from 'uuid/v4'

import { randomUniform, guid } from '-/utils'

class Body {
  constructor (body_data = []) {
    if (body_data == []) {
      body_data = [
        'body',
        1,
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
      ]
    }
    this.name = body_data[0]
    this.mass = body_data[1]
    this.position = new Point([ body_data[2], body_data[3], body_data[4] ])
    this.velocity = new Point([ body_data[5], body_data[6], body_data[7] ])
    this.acceleration = new Point([ body_data[8], body_data[9], body_data[10] ])
    this.orientation = new Point()
    this.angVelocity = new Point()
    this.acceleration.reset()
    this.radius = 0.03
  }
};
class Point {
  constructor (position_data = [ 0, 0, 0 ]) {
    this.x = position_data[0]
    this.y = position_data[1]
    this.z = position_data[2]
  }
  reset () {
    this.x = 0
    this.y = 0
    this.z = 0
  }
};

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

class Star {
  constructor (xPos = 30000, yPos = 0, zPos = 0, player = 'duh', aName = 'default') {
    this.body = new Body([
      'body',
      1,
      xPos,
      yPos,
      zPos,
      0,
      0,
      0,
      0,
      0,
      0
    ])
    this.color = [ 0.0, 0.0, 1.0 ]
    this.mass = 16
    this.radius = 6.6
    this.temp = 33000
    this.buildrandom()
  }
  buildrandom () {
    let starrand = Math.random() * 10000
    if (starrand < 7600) {
      this.mtype()
    }
    if (starrand < 8800 && starrand > 7600) {
      this.ktype()
    }
    if (starrand < 9400 && starrand > 8800) {
      this.gtype()
    }
    if (starrand < 9700 && starrand > 9400) {
      this.ftype()
    }
    if (starrand < 9800 && starrand > 9900) {
      this.atype()
    }
    if (starrand < 9900 && starrand > 9950) {
      this.btype()
    }
    if (starrand < 9950) {
      this.otype()
    }
  }
  otype () {
    this.color = [ 1.0, 0.0, 0.0 ]
    this.mass = 16
    this.radius = 6.6
    this.temp = 33000
  }
  btype () {
    this.color = [ 0.5, 0.5, 0.8, 1.0 ]
    this.mass = 2.1
    this.radius = 1.8
    this.temp = 10000
  }
  atype () {
    this.color = [ 1.0, 1.0, 1.0, 1.0 ]
    this.mass = 1.4
    this.radius = 1.4
    this.temp = 7500
  }
  ftype () {
    this.color = [ 1.0, 1.0, 0.8, 1.0 ]
    this.color = [ 1.0, 0.0, 0.0 ]
    this.mass = 1
    this.radius = 1
    this.temp = 6000
  }
  gtype () {
    this.color = [ 1.0, 1.0, 0.0, 1.0 ]
    this.mass = 0.8
    this.radius = 0.9
    this.temp = 5200
  }
  ktype () {
    this.color = [ 1.0, 0.2, 0.2, 1.0 ]
    this.mass = 0.7
    this.radius = 0.5
    this.temp = 3700
  }
  mtype () {
    this.color = [ 1.0, 0.0, 0.0, 1.0 ]
    this.mass = 0.2
    this.radius = 0.2
    this.temp = 2000
  }
}

class GridSystem {
  constructor (bodies = []) {
    this.count = bodies.length
    this.player = 0
    this.names = [ '' ]
    this.mass = [ 0.0 ]
    this.rad = [ 0.0 ]
    this.pos = [
      [ 0.0, 0.0, 0.0 ]
    ]
    this.ori = [
      [ 0.0, 0.0, 0.0 ]
    ]
    this.vel = [
      [ 0.0, 0.0, 0.0 ]
    ]
    this.acc = [
      [ 0.0, 0.0, 0.0 ]
    ]
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
        let foo = 1
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
const G = 2.93558 * Math.pow(10, -4)
const epsilon = 0.01

class soPhysics {
  constructor (aSystem, maxMark = 100000, dt = 0.02,metric=false, GPGPU = false) {
    this.dt = dt
    this.system = aSystem
    this.metric = metric
    this.collisions = []
    this.gridSystem = new GridSystem(aSystem.bodies)
    this.maxMark = maxMark
    this.fitness = evaluate(this.system.bodies)
    this.sumFit = this.fitness
    this.t = 0
    this.count = 1
    this.tryCount = 0

    if(GPGPU){
      try{
        this.initGPUStuff()
      }catch(except){
        console.log(except);
      }

      }
    }


    initGPUStuff(){
        this.gpu = new GPU()
        this.GPUcomputeAcceleration =  this.gpu.createKernel(function ( pos,mass, acc,rad,CurrentDimension,length){

          var G = 2.93558 * Math.pow(10, -4);
          var accx = 0;
          var accy = 0;
          var accz = 0;
          var result = 0;


          for(var i =0; i<1; i++){

            var d_x = pos[this.thread.x][0] - pos[this.thread.y][0];
            var d_y = pos[this.thread.x][1] - pos[this.thread.y][1];
            var d_z = pos[this.thread.x][2] - pos[this.thread.y][2];
            var radius = Math.pow(d_x, 2) + Math.pow(d_y, 2) + Math.pow(d_z, 2);
            var rad2 = Math.sqrt(radius);
            var grav_mag = 0.0;

            if (this.thread.x!=0 && this.thread.x != this.thread.y && rad2 > 0.333 * (rad[this.thread.y] + rad[this.thread.x])) {
              grav_mag = G / (Math.pow((radius ), (3.0 / 2.0)));
              if(CurrentDimension ==0){
                var grav_x = grav_mag * d_x;
                accx=accx+ (0-(acc[this.thread.x][0] + grav_x * mass[this.thread.y]));
              }else if(CurrentDimension ==1){
                var grav_y = grav_mag * d_y;
                accy=accy+ (0-(acc[this.thread.x][1] + grav_y * mass[this.thread.y]));
              }else{
                var grav_z = grav_mag * d_z;
                accz=accx+( 0-(acc[this.thread.x][2] + grav_z * mass[this.thread.y]));
              }
            } else {
              grav_mag = 0;
              //return 0;
              //collision detected
            }
        }
        if(CurrentDimension ==0){
          return accx;
        }else if(CurrentDimension ==1){
          return accy;
        }else{
          return accz;
        }

      },{dimensions:[this.gridSystem.pos.length],
        loopMaxIterations:this.gridSystem.pos.length});
}
      GPUAccelerate(){
        this.convertToStellar()
        var result =[];
        result.push(this.GPUcomputeAcceleration(
                            this.gridSystem.pos,
                            this.gridSystem.mass,
                            this.gridSystem.acc,
                            this.gridSystem.rad,
                          0,this.gridSystem.pos.length));
        result.push(this.GPUcomputeAcceleration(
                            this.gridSystem.pos,
                            this.gridSystem.mass,
                            this.gridSystem.acc,
                            this.gridSystem.rad,
                          1,this.gridSystem.pos.length));
        result.push(this.GPUcomputeAcceleration(
                            this.gridSystem.pos,
                            this.gridSystem.mass,
                            this.gridSystem.acc,
                            this.gridSystem.rad,
                          2,this.gridSystem.pos.length));


        //result.map(x => { bottom = bottom.concat(Array(3), Array(3), Array(3)) })
        let bottom = []
        for(let i =0;i<this.gridSystem.pos.length; i++)
        {bottom.push(
          [result[0][i],
          result[1][i],
          result[2][i]])}
        //this.calVelPosCuda()
        this.gridSystem.acc = bottom;
        this.calVelPosCuda()
        this.gridSystem.resetAcc()
        this.convertToMetric()
        //console.log("GPU:")
        //console.log(bottom)
        //this.gridSystem.resetAcc()

      }


  collisionDetected (player, names, mass, pos, vel, acc, rad, ith, jth) {
    if (names[jth] != 'player' && names[ith] != 'player') {
      this.combineBodies(player, names, mass, pos, vel, acc, rad, ith, jth)
    }
  }
  combineBodies (player, names, mass, pos, vel, acc, rad, ith, jth) {
    pos[jth][0] = (pos[ith][0] * mass[ith] + pos[jth][0] * mass[jth]) / ((mass[ith] + mass[jth]))
    pos[jth][1] = (pos[ith][1] * mass[ith] + pos[jth][1] * mass[jth]) / ((mass[ith] + mass[jth]))
    pos[jth][2] = (pos[ith][2] * mass[ith] + pos[jth][2] * mass[jth]) / ((mass[ith] + mass[jth]))
    vel[jth][0] = (((mass[ith] * vel[ith][0]) + (mass[jth] * vel[jth][0]) / ((mass[ith] + mass[jth]))))
    vel[jth][1] = (((mass[ith] * vel[ith][1]) + (mass[jth] * vel[jth][1]) / ((mass[ith] + mass[jth]))))
    vel[jth][2] = (((mass[ith] * vel[ith][2]) + (mass[jth] * vel[jth][2]) / ((mass[ith] + mass[jth]))))
    mass[jth] = mass[ith] + mass[jth]
    rad[jth] = ((Math.sqrt(mass[jth])) / 50) + 0.001
    mass[ith] = 0.00000000000000000000000000000000000000000000000001
    pos[ith][0] = 0
    pos[ith][1] = 0
    pos[ith][2] = 0
    vel[ith][0] = 0
    vel[ith][1] = 0
    vel[ith][2] = 0

    if (names[jth] == 'star') {
      pos[jth][0] = 0
      pos[jth][1] = 0
      pos[jth][2] = 0
      vel[jth][0] = 0
      vel[jth][1] = 0
      vel[jth][2] = 0
      acc[jth][0] = 0
      acc[jth][1] = 0
      acc[jth][2] = 0
    }
    if (names[ith] == 'star') {
      pos[ith][0] = 0
      pos[ith][1] = 0
      pos[ith][2] = 0
      vel[ith][0] = 0
      vel[ith][1] = 0
      vel[ith][2] = 0
      acc[ith][0] = 0
      acc[ith][1] = 0
      acc[ith][2] = 0
    }
    // console.log("ith "+names[ith])
    // console.log("jth "+names[jth])
    names[ith] = 'DELETED'
    this.collisions.push(names[jth])

    this.gridSystem.collisions.push(jth)
    this.gridSystem.removed.push(ith)
    this.gridSystem.getPlayerIndex()
  }
  evaluateStep () {
    this.accelerate()
    for (let body of this.system.bodies) {
      this.calculate_velocity(body, this.dt)
      this.calculate_position(body, this.dt)
      body.acceleration.reset()
      this.sumFit += evaluate(this.system.bodies)
      this.t += this.dt
    }
    this.count += 1
  }
  evaluate () {
    this.t = 0
    this.count = 1
    this.accelerate()
    this.sumFit = 0
    while (this.count < this.maxMark) {
      this.evaluateStep()
    }
    this.fitness = evaluate(this.bodies)
    this.avgStability = this.sumFit / this.count
    return this.avgStability
  }

  accGravSingle (player, names, mass, pos, vel, acc, rad, ith, jth) {
    let d_x = pos[jth][0] - pos[ith][0]
    let d_y = pos[jth][1] - pos[ith][1]
    let d_z = pos[jth][2] - pos[ith][2]
    let radius = Math.pow(d_x, 2) + Math.pow(d_y, 2) + Math.pow(d_z, 2)
    let rad2 = Math.sqrt(radius)
    let grav_mag = 0.0
    if (rad2 > 0.666 * (rad[ith] + rad[jth])) {
      grav_mag = G / (Math.pow((radius + epsilon), (3.0 / 2.0)))
      let grav_x = grav_mag * d_x
      let grav_y = grav_mag * d_y
      let grav_z = grav_mag * d_z
      if (names[ith] != 'star') {
        acc[ith][0] += grav_x * mass[jth]
        acc[ith][1] += grav_y * mass[jth]
        acc[ith][2] += grav_z * mass[jth]
      }
      if (names[jth] != 'star') {
        acc[jth][0] += grav_x * mass[ith]
        acc[jth][1] += grav_y * mass[ith]
        acc[jth][2] += grav_z * mass[ith]
      }
    } else {
      grav_mag = 0
      this.collisionDetected(player, names, mass, pos, vel, acc, rad, ith, jth)
    }
  }
  convertToMetric () {
    for (let i = 0; i < this.gridSystem.count; i++) {
      this.gridSystem.rad[i] *= 149600000000

      this.gridSystem.pos[i][0] *= 149600000000
      this.gridSystem.pos[i][1] *= 149600000000
      this.gridSystem.pos[i][2] *= 149600000000

      this.gridSystem.vel[i][0] *= 149600000000
      this.gridSystem.vel[i][1] *= 149600000000
      this.gridSystem.vel[i][2] *= 149600000000

      this.gridSystem.acc[i][0] *= 149600000000
      this.gridSystem.acc[i][1] *= 149600000000
      this.gridSystem.acc[i][2] *= 149600000000
    }
  }
  convertToStellar () {
    for (let i = 0; i < this.gridSystem.count; i++) {
      this.gridSystem.rad[i] /= 149600000000

      this.gridSystem.pos[i][0] /= 149600000000
      this.gridSystem.pos[i][1] /= 149600000000
      this.gridSystem.pos[i][2] /= 149600000000

      this.gridSystem.vel[i][0] /= 149600000000
      this.gridSystem.vel[i][1] /= 149600000000
      this.gridSystem.vel[i][2] /= 149600000000

      this.gridSystem.acc[i][0] /= 149600000000
      this.gridSystem.acc[i][1] /= 149600000000
      this.gridSystem.acc[i][2] /= 149600000000
    }
  }

  accelerateCuda () {
    let G = 2.93558 * Math.pow(10, -4)
    let epsilon = 0.01
    if (this.metric) { this.convertToStellar() }
    for (let i = 0; i < this.gridSystem.count; i++) {
      if (this.gridSystem.names[i] != 'DELETED') {
        for (let j = 0; j < i; j++) {
          if (this.gridSystem.names[j] != 'DELETED') {
            this.accGravSingle(this.gridSystem.player, this.gridSystem.names, this.gridSystem.mass, this.gridSystem.pos, this.gridSystem.vel, this.gridSystem.acc, this.gridSystem.rad, i, j)
          }
        }
      }
    }
    console.log("CPU")
    console.log(this.gridSystem.acc)
    this.calVelPosCuda()

    this.gridSystem.resetAcc()
    for (let i = 0; i < this.gridSystem.length; i++) {
      if (this.gridSystem.names[i] == 'DELETED') {
        this.gridSystem.removeBody(i)
      }
    }
    if (this.metric) { this.convertToMetric() }
    this.gridSystem.collisions = []
  }

  calVelPosCuda () {
    for (let i = 0; i < this.gridSystem.count; i++) {
      this.gridSystem.vel[i][0] += this.dt * this.gridSystem.acc[i][0]
      this.gridSystem.vel[i][1] += this.dt * this.gridSystem.acc[i][1]
      this.gridSystem.vel[i][2] += this.dt * this.gridSystem.acc[i][2]
      this.gridSystem.pos[i][0] += this.dt * this.gridSystem.vel[i][0]
      this.gridSystem.pos[i][1] += this.dt * this.gridSystem.vel[i][1]
      this.gridSystem.pos[i][2] += this.dt * this.gridSystem.vel[i][2]
    }
  }
}

class System {
  constructor (seed = 1, starcount = 1, bodycount = 1, abodyDistance = 2, abodySpeed = 0.05) {
    this.seed = seed
    this.star = new Star()
    this.starCount = starcount
    this.bodyCount = bodycount
    this.bodies = []
    this.bodyDistance = abodyDistance
    this.bodySpeed = abodySpeed
    if (seed != 0) {
      this.build()
    } else {
      this.buildSol()
    }
    // Void.log.debug('bodyCount: ' + this.bodies.length)
    this.stability = 0.5 - evaluate(this.bodies)

    this.avgStability = 0.5 - evaluate(this.bodies)
  }
  moveToStar () {
    for (let body of this.bodies) {
      body.position.x += this.star.body.position.x
      body.position.y += this.star.body.position.y
      body.position.z += this.star.body.position.z
    }
  }
  getStar (body_data) {
    body_data.push(randomUniform(0.4, 2))
    for (let j = 0; j <= 2; j++) {
      body_data.push(0.0)
    }
    body_data.push(0.0)
    for (let j = 0; j <= 2; j++) {
      body_data.push(0.0)
    }
    body_data.push(0.0)
    return body_data
  }
  getSymPlanets () {
    let body_data = []

    // body name
    body_data.push(`body ${uuid()}`)
    body_data.push(randomUniform(0.0, 0.1))
    if (quadrantconst > 0) {
      body_data.push(randomUniform(0, this.bodyDistance))
      body_data.push(randomUniform(0, this.bodyDistance))
      body_data.push(0.0)
      body_data.push(randomUniform(0, this.bodySpeed))
      body_data.push(randomUniform(-this.bodySpeed, 0))
      body_data.push(0.0)
    }
    if (quadrantconst < 0) {
      body_data.push(randomUniform(-this.bodyDistance, 0))
      body_data.push(randomUniform(-this.bodyDistance, 0))
      body_data.push(0.0)
      body_data.push(randomUniform(-this.bodySpeed, 0))
      body_data.push(randomUniform(0, this.bodySpeed))
      body_data.push(0.0)
    }
  }
  getDirectedPlanet () {
    let quadrantconst = 1
    let body_data = []

    // body name
    body_data.push(`body ${uuid()}`)
    let min = 8.6 * Math.pow(10, -11)
    let max = 0.00001

    let test = Math.random()
    if (test >= 0.8) {
      min = 0.00001
      max = 0.01
    }
    let mass = randomUniform(min, max)

    body_data.push(mass)
    if (quadrantconst > 0) {
      body_data.push(randomUniform(0, this.bodyDistance))
      body_data.push(randomUniform(0, this.bodyDistance))
      body_data.push(randomUniform(0, this.bodyDistance / 64))
    }
    if (quadrantconst < 0) {
      body_data.push(randomUniform(-this.bodyDistance, 0))
      body_data.push(randomUniform(-this.bodyDistance, 0))
      body_data.push(randomUniform(-this.bodyDistance / 64, 0))
    }
    if (quadrantconst > 0) {
      body_data.push(randomUniform(0, this.bodySpeed))
      body_data.push(randomUniform(-this.bodySpeed, 0))
      body_data.push(randomUniform(0, this.bodySpeed / 32))
    }
    if (quadrantconst < 0) {
      body_data.push(randomUniform(-this.bodySpeed, 0))
      body_data.push(randomUniform(0, this.bodySpeed))
      body_data.push(randomUniform(-this.bodySpeed / 32), 0)
    }
    return body_data
  }

  getPlanet (body_data) {
    body_data.push(randomUniform(0.00000000001, 0.01))
    for (let j of range(0, 2)) {
      body_data.push(randomUniform(-this.bodyDistance, this.bodyDistance))
    }
    body_data.push(0.0)
    for (let j of range(0, 2)) {
      body_data.push(randomUniform(-this.bodySpeed, this.bodySpeed))
    }
    body_data.push(0.0)
    return body_data
  }
  buildSol () {
    this.bodies = []
    let body_data = [
      'Sol',
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
    this.bodies.push(Body(body_data))
    body_data = [
      'Earth',
      0.000003,
      0,
      1,
      0,
      0.04,
      0,
      0,
      0,
      0,
      0
    ]
    this.bodies.push(Body(body_data))
  }
  build () {
    for (let i = 0; i < this.bodyCount; i++) {
      if (i < this.starCount) {
        this.addStar()
      } else {
        this.addSinglePlanet()
      }
    }
  }

  addStar () {
    let body_data = this.getStar([ 'star' ])
    let body = new Body(body_data)
    this.bodies.push(body)
  }
  reverseBody (adata) {
    let bdata = adata
    bdata[2] = 0 - adata[2]
    bdata[3] = 0 - adata[3]
    bdata[4] = 0 - adata[4]
    bdata[5] = 0 - adata[5]
    bdata[6] = 0 - adata[6]
    bdata[7] = 0 - adata[7]
    return bdata
  }
  addSinglePlanet () {
    // Void.log.debug('adding Body')
    let body_data = this.getDirectedPlanet()
    let aBody = new Body(body_data)
    let bBody = new Body(this.reverseBody(body_data))
    let otherBodies = []
    otherBodies.push(this.bodies[0])
    otherBodies.push(aBody)
    otherBodies.push(bBody)
    let fitness = this.evaluateN(otherBodies)
    while (fitness < 0.1 || fitness > 1) {
      // Void.log.debug('testing configuration')
      let adata = this.getDirectedPlanet()
      let aBody = new Body(adata)
      let bdata = this.reverseBody(adata)
      let bBody = new Body(bdata)
      let otherBodies = []
      otherBodies.push(this.bodies[0])
      otherBodies.push(aBody)
      otherBodies.push(bBody)
      fitness = this.evaluateN(otherBodies)
    }
    this.bodies.push(aBody)
    this.bodies.push(bBody)
    return aBody
  };
  addPlanet () {
    // Void.log.debug('adding body')
    let body_data = []
    body_data.push(guid())
    body_data = this.getPlanet(body_data)
    let aBody = new Body(body_data)
    this.bodies.push(aBody)
    // Void.log.debug('new stability')
    // Void.log.debug(this.evaluate(this.bodies))
    while (this.evaluate(this.bodies) > 1) {
      this.bodies.pop()
      this.addPlanet()
    }
  }

  //   evaluateBodies( someBodies) {
  //           kinetic=0.0;
  //           potential=0.0;
  //           G=2.93558*10**-4;
  //           for (body of someBodies) {
  //                   vel = body.velocity;
  //                   vel_sq = (vel.x**2 + vel.y**2 + vel.z**2);
  //                   kinetic += 0.5*body.mass*vel_sq;
  //                 }
  //           for (i of range(0,len(someBodies))) {
  //                   current_body=someBodies[i];
  //                   current_position=current_body.position;
  //                   for (j of range(0,i)) {
  //                           other_body=someBodies[j];
  //                           other_position=other_body.position;
  //                           d_x=(other_position.x-current_position.x);
  //                           d_y=(other_position.y-current_position.y);
  //                           d_z=(other_position.z-current_position.z);
  //                           radius = (d_x**2 + d_y**2 + d_z**2)**(0.5);
  //                           if (radius >0 ) {
  //                                   potential -= G*current_body.mass*other_body.mass/radius;}
  //                                 }
  //           }
  //           try {
  //                   return abs(kinetic/potential);
  //           } catch () {
  //                   return 100.0;
  //                 }
  // }

  evaluateN (somebodies) {
    let tempSys = new System()
    tempSys.bodies = somebodies
    let tempEval = new soPhysics(tempSys, 1000000, 0.01)
    return tempEval.sumFit
  }

  bodies () {
    return this.bodies
  }
}

const evaluate = someBodies => {
  // Void.log.debug('bodies')
  // Void.log.debug(someBodies)
  let kinetic = 0.0
  let potential = 0.0
  let G = 2.93558 * Math.pow(10, -4)
  for (let body of someBodies) {
    // Void.log.debug(body)
    let vel = body.velocity
    let vel_sq = (Math.pow(vel.x, 2) + Math.pow(vel.y, 2) + Math.pow(vel.z, 2))
    kinetic += 0.5 * body.mass * vel_sq
  }
  for (let i = 0; i < someBodies.length; i++) {
    let current_body = someBodies[i]
    let current_position = current_body.position
    for (let j = 0; j < i; j++) {
      let other_body = someBodies[j]
      let other_position = other_body.position
      let d_x = (other_position.x - current_position.x)
      let d_y = (other_position.y - current_position.y)
      let d_z = (other_position.z - current_position.z)
      let radius = Math.pow((Math.pow(d_x, 2) + Math.pow(d_y, 2) + Math.pow(d_z, 2)), (0.5))
      if (radius > 0) {
        potential -= G * current_body.mass * other_body.mass / radius
      }
    }
  }
  try {
    return Math.abs(kinetic / potential)
  } catch (err) {
    return 100
  }
}

const convertSystemToMeters = system => {
  return system.bodies.map(body => {
    body.position.x *= 149600000000
    body.position.y *= 149600000000
    body.position.z *= 149600000000

    body.velocity.x *= 149600000000
    body.velocity.y *= 149600000000
    body.velocity.z *= 149600000000

    body.radius = ((Math.sqrt(body.mass)) / 50) + 0.001
    body.radius *= 149600000000
    return body
  })
}

export {
  System,
  GridSystem,
  soPhysics,
  convertSystemToMeters,
  evaluate
}
