import { PolarGridHelper, Vector3, Color } from 'three'

import * as basicShip from '-/objects/ships/basic'
import sceneState from '-/state/branches/scene'

const shipPolarGrid = ship => {
  const helper = new PolarGridHelper(2000, 1, 6, 36, 0xfffff, 0xfffff)
  helper.geometry.rotateY(Math.PI)
  return helper
}

const defaults = {
  position: new Vector3(0, -1e9, 1e9),
  scale: new Vector3(20, 20, 20),
  rotation: new Vector3(1, -0.25, -0.25)
}

const createShip = async options => {
  const { position, scale, rotation } = Object.assign({}, defaults, options)

  const { ship, emitter } = await basicShip.create({
    position,
    scale,
    rotation
  })
  ship.name = 'spaceShip'

  return {
    ship,
    animate: (delta, tick) => {
      const shipState = sceneState.get([ 'player', 'ship' ])
      basicShip.animate({
        ship,
        emitter,
        movementSpeed: shipState.movementSpeed,
        thrustColor: shipState.thrust.color,
        delta,
        tick
      })

      const hull = ship.children.find(c => c.name === 'Icosahedron_Standard')
      if (hull.children.length > 0) {
        hull.children[0].children[0].material.color = new Color(
          shipState.bodyColor
        )
      }
    }
  }
}

export { createShip }
