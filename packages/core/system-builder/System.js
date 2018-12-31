import uuid from 'uuid/v4'

import Star from './Star'
import Body from './Body'
import soPhysics from './soPhysics'
import { evaluate } from './utils'
import { randomUniform } from '-/utils'

class System {
  constructor (
    seed = 1,
    starcount = 1,
    bodycount = 1,
    abodyDistance = 2,
    abodySpeed = 0.05
  ) {
    this.seed = seed
    this.star = new Star()
    this.starCount = starcount
    this.bodyCount = bodycount
    if (bodycount > 1) {
      var here = 'pewp'
    }
    this.bodies = []
    this.bodyDistance = abodyDistance
    this.bodySpeed = abodySpeed
    if (seed != 0) {
      this.build()
    } else {
      this.buildSol()
    }
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
    body_data.push(randomUniform(0.6, 4))
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
  // getSymPlanets () {
  //   let body_data = []
  //
  //   // body name
  //   body_data.push(`body ${uuid()}`)
  //   body_data.push(randomUniform(0.0, 0.1))
  //   if (quadrantconst > 0) {
  //     body_data.push(randomUniform(0, this.bodyDistance))
  //     body_data.push(randomUniform(0, this.bodyDistance))
  //     body_data.push(0.0)
  //     body_data.push(randomUniform(0, this.bodySpeed))
  //     body_data.push(randomUniform(-this.bodySpeed, 0))
  //     body_data.push(0.0)
  //   }
  //   if (quadrantconst < 0) {
  //     body_data.push(randomUniform(-this.bodyDistance, 0))
  //     body_data.push(randomUniform(-this.bodyDistance, 0))
  //     body_data.push(0.0)
  //     body_data.push(randomUniform(-this.bodySpeed, 0))
  //     body_data.push(randomUniform(0, this.bodySpeed))
  //     body_data.push(0.0)
  //   }
  // }
  getDirectedPlanet (quadrantconst = 1) {
    let body_data = []

    // body name
    body_data.push(`body ${uuid()}`)
    let min = 8 * Math.pow(10, -10)
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
      body_data.push(randomUniform(0, this.bodyDistance / 128))
    }
    if (quadrantconst < 0) {
      body_data.push(randomUniform(-this.bodyDistance, 0))
      body_data.push(randomUniform(-this.bodyDistance, 0))
      body_data.push(randomUniform(-this.bodyDistance / 128))
    }
    if (quadrantconst > 0) {
      body_data.push(randomUniform(0, this.bodySpeed))
      body_data.push(randomUniform(-this.bodySpeed, 0))
      body_data.push(randomUniform(0, this.bodySpeed / 128))
    }
    if (quadrantconst < 0) {
      body_data.push(randomUniform(-this.bodySpeed, 0))
      body_data.push(randomUniform(0, this.bodySpeed))
      body_data.push(randomUniform(-this.bodySpeed / 128))
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
    let body_data = [ 'Sol', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    this.bodies.push(Body(body_data))
    body_data = [ 'Earth', 0.000003, 0, 1, 0, 0.04, 0, 0, 0, 0, 0 ]
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
  rotateBody (adata) {
    let bdata = adata
    bdata[2] = adata[3]
    bdata[3] = 0 - adata[2]
    bdata[4] = 0 // adata[4]

    bdata[5] = adata[6]
    bdata[6] = 0 - adata[5]
    bdata[7] = adata[7]
    return bdata
  }

  invertXbody (adata) {
    let bdata = [] // adata
    bdata[0] = `body ${uuid()}`
    bdata[1] = adata[1]
    bdata[2] = -1 * adata[2]
    bdata[3] = adata[3]
    bdata[4] = adata[4]

    bdata[5] = adata[5]
    bdata[6] = -1 * adata[6]
    bdata[7] = adata[7]
    return bdata
  }
  invertYbody (adata) {
    let bdata = [] // adata
    bdata[0] = `body ${uuid()}`
    bdata[1] = adata[1]
    bdata[2] = adata[2]
    bdata[3] = -1 * adata[3]
    bdata[4] = adata[4]

    bdata[5] = -1 * adata[5]
    bdata[6] = adata[6]
    bdata[7] = adata[7]
    return bdata
  }

  addSinglePlanet () {
    let body_data = this.getDirectedPlanet()
    let aBody = new Body(body_data)
    let bBody = new Body(this.reverseBody(body_data))
    let cBody = new Body(this.invertYbody(body_data))
    let dBody = new Body(this.invertXbody(body_data))
    let otherBodies = []
    otherBodies.push(this.bodies[0])
    otherBodies.push(aBody)
    otherBodies.push(bBody)
    otherBodies.push(cBody)
    otherBodies.push(dBody)
    let fitness = this.evaluateN(otherBodies)

    while (fitness < 0.1 || fitness > 1) {
      body_data = this.getDirectedPlanet()
      aBody = new Body(body_data)
      bBody = new Body(this.reverseBody(body_data))
      cBody = new Body(this.invertYbody(body_data))
      dBody = new Body(this.invertXbody(body_data))

      let otherBodies = []
      otherBodies.push(this.bodies[0])
      otherBodies.push(aBody)
      otherBodies.push(bBody)
      otherBodies.push(cBody)
      otherBodies.push(dBody)
      fitness = this.evaluateN(otherBodies)
    }
    this.bodies.push(aBody)
    this.bodies.push(bBody)
    this.bodies.push(cBody)
    this.bodies.push(dBody)
    return aBody
  }

  addPlanet () {
    let body_data = []
    body_data.push(guid())
    body_data = this.getPlanet(body_data)
    let aBody = new Body(body_data)
    this.bodies.push(aBody)
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

export default System
