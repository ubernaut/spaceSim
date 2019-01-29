import { Vector3, Object3D } from 'three'
import 'three/examples/js/loaders/GLTFLoader'
import { doTimesP } from '-/utils'
import Promise from 'bluebird'
import { createRandomStar } from '-/objects/stars/standard-star'

class Emitter extends Object3D {
  constructor () {
    super()
    // this.position = new Vector3(0, 0, 0)
    this.maxParticles = 20
    // this.rotation = new Vector3(0, 0, 0)
    this.objects = []
  }
  spawnObject ({ scene, position }) {
    const newObject = createRandomStar({
      radius: 25,
      position: position.clone()
    })
    scene.add(newObject.chromosphere)
  }
  update (tick) {
    console.log('in update', tick)
  }
}

export const create = () => {
  try {
    const emitter = new Emitter()
    // emitter.rotation.set(0, 0, 0)
    // emitter.position.set(0, 0, 0)
    return {
      emitter
    }
  } catch (err) {
    console.error('error creating emitter', err)
  }
}

export const shoot = ({ emitter, scene, position }) => {
  emitter.spawnObject({ scene, position })
}

export const animate = ({ emitter, tick }) => {
  emitter.update(tick)
}
