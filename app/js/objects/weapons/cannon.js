import { Vector3, Object3D } from 'three'
import 'three/examples/js/loaders/GLTFLoader'
import { doTimesP } from '-/utils'
import Promise from 'bluebird'
import { createRandomStar } from '-/objects/stars/standard-star'

class Emitter extends Object3D {
  constructor ({ scene }) {
    super()
    this.scene = scene
    this.maxParticles = 40
    this.objects = []
  }
  spawnObject ({ position, speed, quaternion }) {
    const newObject = createRandomStar({
      radius: Math.max(10, Math.random() * 35),
      position: position.clone()
    })
    newObject.chromosphere.quaternion.copy(quaternion)
    const velocity = new Vector3(0, 0, -1)
    const obj = {
      object: newObject,
      mesh: newObject.chromosphere,
      speed: speed + 1e4,
      velocity,
      maxFlightTime: 10000,
      flightTime: 0,
      animate: newObject.animate
    }
    this.objects.push(obj)
    this.scene.add(newObject.chromosphere)
    const delta = 0.02
    const moveMult = Math.abs(obj.speed) * delta
    this.translateObject(
      obj.mesh,
      obj.velocity.x * moveMult,
      obj.velocity.y * moveMult,
      obj.velocity.z * moveMult
    )
  }
  update ({ delta, tick }) {
    this.objects.map(o => {
      if (o.mesh) {
        const moveMult = Math.abs(o.speed) * delta
        this.translateObject(
          o.mesh,
          o.velocity.x * moveMult,
          o.velocity.y * moveMult,
          o.velocity.z * moveMult
        )
        o.flightTime += delta * 1000
        o.animate(delta)
        if (o.flightTime > o.maxFlightTime) {
          this.scene.remove(o.mesh)
        }
      }
    })
  }
  translateObject (object, x, y, z) {
    object.translateX(x)
    object.translateY(y)
    object.translateZ(z)
  }
}

export const create = ({ scene }) => {
  try {
    const emitter = new Emitter({ scene })
    return {
      emitter
    }
  } catch (err) {
    console.error('error creating emitter', err)
  }
}

export const shoot = ({ emitter, position, speed, quaternion }) => {
  emitter.spawnObject({ position, speed, quaternion })
}

export const animate = ({ emitter, delta, tick }) => {
  emitter.update({ delta, tick })
}
