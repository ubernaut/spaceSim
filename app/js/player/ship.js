import { PolarGridHelper, Vector3, Color } from 'three'

import * as basicShip from '-/objects/ships/basic'
import sceneState from '-/state/branches/scene'

const shipPolarGrid = (ship) => {
  const helper = new PolarGridHelper(2000, 1, 6, 36, 0xfffff, 0xfffff)
  helper.geometry.rotateY(Math.PI)
  return helper
}

const defaults = {
  position: new Vector3(0, -1e9, 1e9),
  scale: new Vector3(20, 20, 20),
  rotation: new Vector3(1, -0.25, -0.25),
}
const accelerateShip = (delta, physics, ship, controls) => {

  const star = physics.system.bodies.find(item => item.name === 'star')
  console.log(ship)
  //console.log(star)
  //console.log(physics)
  console.log(controls)

  const distance = ship.position.distanceTo(star.position)
  const shipMass = 0.0000000000000000000000000228059635249
  const dt = physics.dt
  const G = 0.000000000066743
  const Fg=(G*(shipMass*star.mass))/(distance^2)
  const As = Fg/shipMass

  controls.moveVector.x -= 10000000001000000000*As
  controls.moveVector.y -= 10000000001000000000*As
  controls.moveVector.z -= 10000000001000000000*As
   //Vs = As +Vs
   //Ps = Vs + Ps

  // const Fg = G(shipMass+star.mass)/



  return controls
}

const createShip = async (options) => {
  const { position, scale, rotation } = Object.assign({}, defaults, options)

  const { ship, emitter } = await basicShip.create({
    position,
    scale,
    rotation,
  })
  ship.name = 'spaceShip'

  return {
    ship,
    animate: (delta, tick) => {
      const shipState = sceneState.get(['player', 'ship'])
      basicShip.animate({
        ship,
        emitter,
        movementSpeed: shipState.movementSpeed,
        thrustColor: shipState.thrust.color,
        delta,
        tick,
      })

      const hull = ship.children.find((c) => c.name === 'Icosahedron_Standard')
      hull.material.color = new Color(shipState.hull.color)
    },
  }
}

export { createShip, accelerateShip }
