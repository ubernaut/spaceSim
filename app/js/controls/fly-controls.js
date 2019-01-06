import Keyboard from 'syncinput/Keyboard'
import Mouse from 'syncinput/Mouse'

const defaultMap = {
  moveState: {
    [Keyboard.W]: 'forward',
    [Keyboard.A]: 'left',
    [Keyboard.S]: 'back',
    [Keyboard.D]: 'right',
    [Keyboard.R]: 'up',
    [Keyboard.F]: 'down',
    [Keyboard.UP]: 'pitchUp',
    [Keyboard.DOWN]: 'pitchDown',
    [Keyboard.LEFT]: 'yawLeft',
    [Keyboard.RIGHT]: 'yawRight',
    [Keyboard.Q]: 'rollLeft',
    [Keyboard.E]: 'rollRight'
  }
}

export default class KeyboardControls {
  constructor (object, domElement) {
    this.object = object
    this.domElement = domElement
    this.keyboard = new Keyboard()
    this.mouse = new Mouse()
    this.keymap = Object.assign({}, defaultMap)
    this.acceleration = 0.65
    this.movementSpeed = 1.0
    this.rollSpeed = 0.3
    this.moveVector = new THREE.Vector3(0, 0, 0)
    this.rotationVector = new THREE.Vector3(0, 0, 0)
    this.resetMoveState()
  }

  updateMovementSpeed () {
    const dir = this.moveState.forward ? 1 : this.moveState.back ? -1 : 0
    const step = Math.max(
      1,
      Math.pow(Math.abs(this.movementSpeed), this.acceleration)
    )
    const newSpeed = this.movementSpeed + dir * step
    this.movementSpeed = newSpeed
  }

  update (delta) {
    this.keyboard.update()
    this.mouse.update()

    Object.keys(this.keymap.moveState).map(key => {
      if (this.keyboard.keyPressed(key)) {
        this.moveState[this.keymap.moveState[key]] = 1
      }
    })

    if (this.mouse.buttonPressed(Mouse.LEFT)) {
      this.mousemove(this.mouse.position.x, this.mouse.position.y)
    }

    this.updateMovementSpeed()
    this.updateMovementVector()
    this.updateRotationVector()

    const moveMult = delta * this.movementSpeed
    const rotMult = delta * this.rollSpeed

    this.translateObject(
      this.moveVector.x * Math.abs(moveMult),
      this.moveVector.y * Math.abs(moveMult),
      this.moveVector.z * Math.abs(moveMult)
    )
    this.rotateObject(
      this.rotationVector.x * rotMult,
      this.rotationVector.y * rotMult,
      this.rotationVector.z * rotMult
    )

    this.resetMoveState()
  }

  getContainerDimensions () {
    return this.domElement !== document
      ? {
        size: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
        offset: [ this.domElement.offsetLeft, this.domElement.offsetTop ]
      }
      : {
        size: [ window.innerWidth, window.innerHeight ],
        offset: [ 0, 0 ]
      }
  }

  translateObject (x, y, z) {
    this.object.translateX(x)
    this.object.translateY(y)
    this.object.translateZ(z)
  }

  rotateObject (x, y, z) {
    const quaternion = new THREE.Quaternion().set(x, y, z, 1).normalize()
    this.object.quaternion.multiply(quaternion)
    this.object.rotation.setFromQuaternion(
      this.object.quaternion,
      this.object.rotation.order
    )
  }

  mousemove (x, y) {
    const container = this.getContainerDimensions()
    const halfWidth = container.size[0] / 2
    const halfHeight = container.size[1] / 2

    this.moveState.yawLeft = -(x - container.offset[0] - halfWidth) / halfWidth
    this.moveState.pitchDown =
      (y - container.offset[1] - halfHeight) / halfHeight
  }

  resetMoveState () {
    this.moveState = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      forward: 0,
      back: 0,
      pitchUp: 0,
      pitchDown: 0,
      yawLeft: 0,
      yawRight: 0,
      rollLeft: 0,
      rollRight: 0
    }
  }

  updateMovementVector () {
    this.moveVector.x += -this.moveState.left + this.moveState.right
    this.moveVector.y += -this.moveState.down + this.moveState.up
    this.moveVector.z += -this.moveState.forward + this.moveState.back
  }

  updateRotationVector () {
    this.rotationVector.x = -this.moveState.pitchDown + this.moveState.pitchUp
    this.rotationVector.y = -this.moveState.yawRight + this.moveState.yawLeft
    this.rotationVector.z = -this.moveState.rollRight + this.moveState.rollLeft
  }
}
