import GridSystem from './GridSystem'
import { evaluate, computeRadius } from './utils'
import GPU from 'gpu.js'

const G = 2.93558 * Math.pow(10, -4)
const epsilon = 0.01

class soPhysics {
  constructor (
    system,
    maxMark = 100000,
    dt = 0.002,
    metric = false,
    GPGPU = false,
    gpuCollisions = true
  ) {
    this.dt = dt
    this.system = system
    this.metric = metric
    this.collisions = []
    this.gridSystem = new GridSystem(system.bodies)
    this.maxMark = maxMark
    this.fitness = evaluate(this.system.bodies)
    this.sumFit = this.fitness
    this.t = 0
    this.count = 1
    this.tryCount = 0
    this.gpuCollisions = gpuCollisions
    this.biggestBody = 0

    if (GPGPU) {
      try {
        this.initGPUStuff()
        // this.initGPU()
      } catch (except) {
        console.log(except)
      }
    }
  }

  initGPUStuff () {
    this.gpu = new GPU()
    this.GPUcomputeAcceleration = this.gpu.createKernel(
      function (pos, mass, acc, rad) {
        var result = 0
        for (var i = 0; i < this.constants.size; i++) {
          var d_x = pos[this.thread.x][0] - pos[i][0]
          var d_y = pos[this.thread.x][1] - pos[i][1]
          var d_z = pos[this.thread.x][2] - pos[i][2]
          var radius = Math.pow(d_x, 2) + Math.pow(d_y, 2) + Math.pow(d_z, 2)
          var rad2 = Math.sqrt(radius)
          var grav_mag = 0.0
          var grav = 0
          if (
            this.thread.x != 0 &&
            this.thread.x != i &&
            rad2 > 0.666 * (rad[i] + rad[this.thread.x])
          ) {
            grav_mag = this.constants.G / Math.pow(radius, 3.0 / 2.0)
            if (this.thread.y == 0) {
              grav = grav_mag * d_x
            } else if (this.thread.y == 1) {
              grav = grav_mag * d_y
            } else if (this.thread.y == 2) {
              grav = grav_mag * d_z
            } else {
              // this should never happen
            }
            result += 0 - (acc[this.thread.x][this.thread.y] + grav * mass[i])
          } else {
            // collision detected
          }
        }
        return result
      },
      {
        output: [ this.gridSystem.pos.length, 3 ],
        constants: { size: this.gridSystem.pos.length, G }
      }
    )

    this.GPUcomputeCollisions = this.gpu.createKernel(
      function (pos, mass, acc, rad) {
        var result = -1
        var i = 0
        for (var i = this.constants.size - 1; i >= 0; i--) {
          // this.constants.size
          var d_x = Math.abs(pos[this.thread.x][0] - pos[i][0])
          var d_y = Math.abs(pos[this.thread.x][1] - pos[i][1])
          var d_z = Math.abs(pos[this.thread.x][2] - pos[i][2])
          var radius = Math.pow(d_x, 2) + Math.pow(d_y, 2) + Math.pow(d_z, 2)
          var distance = Math.sqrt(radius)
          var bothRads = rad[i] + rad[this.thread.x]
          if (this.thread.x != i) {
            if (distance < 0.66 * bothRads) {
              // Collision Detected.
              result = i
            } else {
            }
          } else {
          }
        }
        return result
      },
      {
        output: [ this.gridSystem.pos.length ],
        constants: { size: this.gridSystem.pos.length }
      }
    )
  }

  initTransposeKernel () {
    this.gpu = new GPU()
    this.GPUcomputeAcceleration = this.gpu.createKernel(
      function (pos, mass, acc, rad) {
        var result = 0
        for (var i = 0; i < this.constants.size; i++) {
          var d_x = pos[this.thread.x][0] - pos[i][0]
          var d_y = pos[this.thread.x][1] - pos[i][1]
          var d_z = pos[this.thread.x][2] - pos[i][2]
          var radius = Math.pow(d_x, 2) + Math.pow(d_y, 2) + Math.pow(d_z, 2)
          var rad2 = Math.sqrt(radius)
          var grav_mag = 0.0
          var grav = 0
          if (
            this.thread.x != 0 &&
            this.thread.x != i &&
            rad2 > 0.333 * (rad[i] + rad[this.thread.x])
          ) {
            grav_mag = this.constants.G / Math.pow(radius, 3.0 / 2.0)
            if (this.thread.y == 0) {
              grav = grav_mag * d_x
            } else if (this.thread.y == 1) {
              grav = grav_mag * d_y
            } else if (this.thread.y == 2) {
              grav = grav_mag * d_z
            } else {
              // this should never happen
            }
            result += 0 - (acc[this.thread.x][this.thread.y] + grav * mass[i])
          } else {
            // collision detected
          }
        }
        return result
      },
      {
        output: [ 3, this.gridSystem.pos.length ],
        constants: { size: this.gridSystem.pos.length, G }
      }
    )
    // this.transposeX=this.gpu.createKernel(function(acc){
    //     result[0][i],
    //     result[1][i],
    //     result[2][i]
    //     return acc[this.thread.y][this.thread.x];
    // },{ output:[this.gridSystem.pos.length,3],
    //     constants: {size:this.gridSystem.pos.length, G:this.G}
    //     });
    // this.transposeY=this.gpu.createKernel(function(acc){
    //     result[0][i],
    //     result[1][i],
    //     result[2][i]
    //     return acc[this.thread.y][this.thread.x];
    // },{ output:[this.gridSystem.pos.length,3],
    //     constants: {size:this.gridSystem.pos.length, G:this.G}
    //     });
    // const GPUcombineAcceleration = this.gpu.combineKernels(this.transpose,this.GPUcomputeAcceleration,
    //       function (pos, mass, acc, rad){
    //           return transpose(this.GPUcomputeAcceleration(pos, mass, acc, rad));
    //       },{ output:[this.gridSystem.pos.length,3],
    //           constants: {size:this.gridSystem.pos.length, G:this.G}
    //           });
    // this.GPUcombineAcceleration=GPUcombineAcceleration;
  }

  // initSuperKernel () {
  //   this.gpu = new GPU()
  //   this.GPUcomputeAcceleration = this.gpu.createKernel(
  //     function (pos, mass, acc, rad) {
  //       var result = 0
  //       var d_x = pos[this.thread.x][0] - pos[this.thread.z][0]
  //       var d_y = pos[this.thread.x][1] - pos[this.thread.z][1]
  //       var d_z = pos[this.thread.x][2] - pos[this.thread.z][2]
  //       var radius = Math.pow(d_x, 2) + Math.pow(d_y, 2) + Math.pow(d_z, 2)
  //       var rad2 = Math.sqrt(radius)
  //       var grav_mag = 0.0
  //       var grav = 0
  //       if (
  //         this.thread.x != 0 &&
  //         this.thread.x != this.thread.z &&
  //         rad2 > 0.333 * (rad[this.thread.z] + rad[this.thread.x])
  //       ) {
  //         grav_mag = this.constants.G / Math.pow(radius, 3.0 / 2.0)
  //         if (this.thread.y == 0) {
  //           grav = grav_mag * d_x
  //         } else if (this.thread.y == 1) {
  //           grav = grav_mag * d_y
  //         } else if (this.thread.y == 2) {
  //           grav = grav_mag * d_z
  //         } else {
  //           return 999
  //           /* FOURTH DIMENSION this should never happen */
  //         }
  //         result +=
  //           0 - (acc[this.thread.x][this.thread.y] + grav * mass[this.thread.z])
  //       } else {
  //         // collision detected
  //       }
  //
  //       return result
  //     },
  //     {
  //       output: [ this.gridSystem.pos.length, 3, this.gridSystem.pos.length ],
  //       constants: { size: this.gridSystem.pos.length, G }
  //     }
  //   )
  //   const GPUcomputeAcceleration = this.GPUcomputeAcceleration
  //   this.sum = this.gpu.createKernel(
  //     function (acc) {
  //       var sumDim = 0
  //       for (var i = 0; i < this.constants.size; i++) {
  //         sumDim = sumDim + acc[this.thread.x][this.thread.y][i]
  //       }
  //       return sumDim
  //       // if(sumPosition==0){return runningSum;}
  //       // else{return runningSum+sum(pos, mass, acc, rad, sumPosition-1, runningSum)}
  //     },
  //     {
  //       output: [ this.gridSystem.pos.length, 3 ],
  //       constants: { size: this.gridSystem.pos.length, G }
  //     }
  //   )
  //   const sum = this.sum
  //   this.GPUcombineAcceleration = this.gpu.combineKernels(
  //     sum,
  //     GPUcomputeAcceleration,
  //     function (pos, mass, acc, rad) {
  //       return sum(GPUcomputeAcceleration(pos, mass, acc, rad)[this.thread.x])
  //     },
  //     {
  //       output: [ this.gridSystem.pos.length, 3 ],
  //       constants: { size: this.gridSystem.pos.length, G }
  //     }
  //   )
  //
  //   var shit = this.GPUcombineAcceleration
  // }

  GPUAccelerate (useGpuCollisions) {
    this.convertToStellar()

    var result = this.GPUcomputeAcceleration(
      this.gridSystem.pos,
      this.gridSystem.mass,
      this.gridSystem.acc,
      this.gridSystem.rad
    )

    if (useGpuCollisions) {
      var GPUcollisionList = this.GPUcomputeCollisions(
        this.gridSystem.pos,
        this.gridSystem.mass,
        this.gridSystem.acc,
        this.gridSystem.rad
      )
      for (var i = 0; i < GPUcollisionList.length; i++) {
        if (GPUcollisionList[i] !== -1) {
          if (
            this.gridSystem.names[i] !== 'DELETED' &&
            this.gridSystem.names[GPUcollisionList[i]] !== 'DELETED'
          ) {
            this.collisionDetected(
              this.gridSystem.player,
              this.gridSystem.names,
              this.gridSystem.mass,
              this.gridSystem.pos,
              this.gridSystem.vel,
              this.gridSystem.acc,
              this.gridSystem.rad,
              i,
              GPUcollisionList[i]
            )
          }
        }
        if (this.biggestBody !== 0) {
          this.detectCollision(0, this.biggestBody)
        }
      }
    }
    // result.map(x => { bottom = bottom.concat(Array(3), Array(3), Array(3)) })
    let bottom = []
    for (let i = 0; i < this.gridSystem.pos.length; i++) {
      bottom.push([ result[0][i], result[1][i], result[2][i] ])
    }
    // this.calVelPosCuda()

    this.gridSystem.acc = bottom
    this.calVelPosCuda()

    this.gridSystem.resetAcc()
    this.convertToMetric()

    // console.log("GPU:")
    // console.log(bottom)
    // this.gridSystem.resetAcc()
  }

  collisionDetected (player, names, mass, pos, vel, acc, rad, ith, jth) {
    if (names[jth] != 'player' && names[ith] != 'player') {
      this.combineBodies(player, names, mass, pos, vel, acc, rad, ith, jth)
    }
  }

  detectCollision (ith, jth) {
    let posj = this.gridSystem.pos[jth]
    let posi = this.gridSystem.pos[ith]
    let radi = this.gridSystem.rad[ith]
    let radj = this.gridSystem.rad[jth]

    let d_x = this.gridSystem.pos[jth][0] - this.gridSystem.pos[ith][0]
    let d_y = this.gridSystem.pos[jth][1] - this.gridSystem.pos[ith][1]
    let d_z = this.gridSystem.pos[jth][2] - this.gridSystem.pos[ith][2]

    if (ith == 3997 || jth == 3997) {
      var GOTHIM = ''
    }

    let radius = Math.pow(d_x, 2) + Math.pow(d_y, 2) + Math.pow(d_z, 2)
    let rad2 = Math.sqrt(radius)

    let bodyRadii = this.gridSystem.rad[ith] + this.gridSystem.rad[jth]
    let diff = rad2 - bodyRadii
    if (rad2 < this.gridSystem.rad[ith] + this.gridSystem.rad[jth]) {
      return true
    } else {
      return false
    }
  }

  combineBodies (player, names, mass, pos, vel, acc, rad, ith, jth) {
    let posj = pos[jth]
    let posi = pos[ith]
    let radi = rad[ith]
    let radj = rad[jth]

    let d_x = pos[jth][0] - pos[ith][0]
    let d_y = pos[jth][1] - pos[ith][1]
    let d_z = pos[jth][2] - pos[ith][2]

    if (ith == 3997 || jth == 3997) {
      var GOTHIM = ''
    }

    let radius = Math.pow(d_x, 2) + Math.pow(d_y, 2) + Math.pow(d_z, 2)
    let rad2 = Math.sqrt(radius)

    // if ( rad2 <  (rad[ith] + rad[jth])) {
    if (ith == 0) {
      // swap so star isn't deleted
      var holder = jth
      jth = ith
      ith = holder
    }
    pos[jth][0] =
      (pos[ith][0] * mass[ith] + pos[jth][0] * mass[jth]) /
      (mass[ith] + mass[jth])
    pos[jth][1] =
      (pos[ith][1] * mass[ith] + pos[jth][1] * mass[jth]) /
      (mass[ith] + mass[jth])
    pos[jth][2] =
      (pos[ith][2] * mass[ith] + pos[jth][2] * mass[jth]) /
      (mass[ith] + mass[jth])
    vel[jth][0] =
      mass[ith] * vel[ith][0] +
      (mass[jth] * vel[jth][0]) / (mass[ith] + mass[jth])
    vel[jth][1] =
      mass[ith] * vel[ith][1] +
      (mass[jth] * vel[jth][1]) / (mass[ith] + mass[jth])
    vel[jth][2] =
      mass[ith] * vel[ith][2] +
      (mass[jth] * vel[jth][2]) / (mass[ith] + mass[jth])
    mass[jth] = mass[ith] + mass[jth]

    // if(jth!=0){
    rad[jth] = computeRadius(mass[jth]) // ((Math.sqrt(mass[jth]+ 0.000001)) / 50)}
    // }
    if (names[ith] !== 'star') {
      names[ith] = 'DELETED'
      mass[ith] = 0
      rad[ith] = 0
      pos[ith] = [ 0, 0, 0 ]
      this.gridSystem.removed.push(ith)
    }

    pos[ith][0] = 0
    pos[ith][1] = 0
    pos[ith][2] = 0
    vel[ith][0] = 0
    vel[ith][1] = 0
    vel[ith][2] = 0

    if (names[jth] === 'star') {
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
    if (names[ith] === 'star') {
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

    this.collisions.push(names[jth])
    this.gridSystem.collisions.push(jth)
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
      grav_mag = G / Math.pow(radius + epsilon, 3.0 / 2.0)
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
    this.metric = true
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
    this.metric = false
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

  // accelerateCuda () {
  //   let G = 2.93558 * Math.pow(10, -4)
  //   let epsilon = 0.01
  //   if (this.metric) {
  //     this.convertToStellar()
  //   }
  //   for (let i = 0; i < this.gridSystem.count; i++) {
  //     if (this.gridSystem.names[i] != 'DELETED') {
  //       for (let j = 0; j < i; j++) {
  //         if (this.gridSystem.names[j] != 'DELETED') {
  //           this.accGravSingle(
  //             this.gridSystem.player,
  //             this.gridSystem.names,
  //             this.gridSystem.mass,
  //             this.gridSystem.pos,
  //             this.gridSystem.vel,
  //             this.gridSystem.acc,
  //             this.gridSystem.rad,
  //             i,
  //             j
  //           )
  //         }
  //       }
  //     }
  //   }
  //   // console.log("CPU")
  //   // console.log(this.gridSystem.acc)
  //   this.calVelPosCuda()
  //
  //   this.gridSystem.resetAcc()
  //   for (let i = 0; i < this.gridSystem.length; i++) {
  //     if (this.gridSystem.names[i] == 'DELETED') {
  //       this.gridSystem.removeBody(i)
  //     }
  //   }
  //   if (!this.metric) {
  //     this.convertToMetric()
  //   }
  //   this.gridSystem.collisions = []
  // }
  //
  calVelPosCuda () {
    for (let i = 0; i < this.gridSystem.count; i++) {
      this.gridSystem.vel[i][0] += this.dt * this.gridSystem.acc[i][0]
      this.gridSystem.vel[i][1] += this.dt * this.gridSystem.acc[i][1]
      this.gridSystem.vel[i][2] += this.dt * this.gridSystem.acc[i][2]
      this.gridSystem.pos[i][0] += this.dt * this.gridSystem.vel[i][0]
      this.gridSystem.pos[i][1] += this.dt * this.gridSystem.vel[i][1]
      this.gridSystem.pos[i][2] += this.dt * this.gridSystem.vel[i][2]
    }
    // console.log(this.gridSystem.vel)
  }
}

export default soPhysics
