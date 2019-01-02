const evaluate = someBodies => {
  let kinetic = 0.0
  let potential = 0.0
  let G = 2.93558 * Math.pow(10, -4)

  for (let body of someBodies) {
    let vel = body.velocity
    let vel_sq = Math.pow(vel.x, 2) + Math.pow(vel.y, 2) + Math.pow(vel.z, 2)
    kinetic += 0.5 * body.mass * vel_sq
  }

  for (let i = 0; i < someBodies.length; i++) {
    let current_body = someBodies[i]
    let current_position = current_body.position
    for (let j = 0; j < i; j++) {
      let other_body = someBodies[j]
      let other_position = other_body.position
      let d_x = other_position.x - current_position.x
      let d_y = other_position.y - current_position.y
      let d_z = other_position.z - current_position.z
      let radius = Math.pow(
        Math.pow(d_x, 2) + Math.pow(d_y, 2) + Math.pow(d_z, 2),
        0.5
      )
      if (radius > 0) {
        potential -= (G * current_body.mass * other_body.mass) / radius
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

    //    body.radius *= 149600000000

    body.radius = 0.018 * Math.pow(body.mass * 2 * Math.pow(10, 30), 0.35)
    return body
  })
}

const computeRadius = bodyMass => {
  bodyMass *= 2 * Math.pow(10, 30) // convert to kg
  const rad = (0.018 * Math.pow(bodyMass, 0.35)) / 149600000000
  // const rad =(-2270951618.457 + 39745256.058*Math.log(bodyMass))/ 149600000000
  return rad
  // return (-426947259.19 + 7736028.341*Math.log(bodyMass*2*Math.pow(10,30)))/ 149600000000
  // return Math.pow(((3*bodyMass)/(4*3.14)), (1/3))/17
}

const computeRadiusStellarToMetric = bodyMass => {
  bodyMass *= 2 * Math.pow(10, 30) // convert to kg
  const rad = 0.018 * Math.pow(bodyMass, 0.35)
  // const rad = (-2270951618.457 + 39745256.058*Math.log(bodyMass))
  return rad
  // return (-426947259.19 + 7736028.341*Math.log(bodyMass*2*Math.pow(10,30)))/ 149600000000
  // return Math.pow(((3*bodyMass)/(4*3.14)), (1/3))/17
}

export {
  evaluate,
  convertSystemToMeters,
  computeRadiusStellarToMetric,
  computeRadius
}
