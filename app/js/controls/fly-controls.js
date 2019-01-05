import keys from './keys'

const defaultMap = {
  moveState: {
    [keys.A]: 'left',
    [keys.R]: 'up',
    [keys.D]: 'right',
    [keys.F]: 'down',
    [keys.UP]: 'pitchUp',
    [keys.DOWN]: 'pitchDown',
    [keys.LEFT]: 'yawLeft',
    [keys.RIGHT]: 'yawRight',
    [keys.Q]: 'rollLeft',
    [keys.E]: 'rollRight'
  }
}

/**
 * Adapted from code by James Baicoianu / http://www.baicoianu.com/
 */
export default class FlyControls {
  constructor (object, domElement) {
    this.object = object
    this.domElement = domElement || document
    this.movementSpeed = 1.0
    this.rollSpeed = 0.005
    this.dragToLook = false
    this.autoForward = false
    this.tmpQuaternion = new THREE.Quaternion()
    this.mouseStatus = 0
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
    this.moveVector = new THREE.Vector3(0, 0, 0)
    this.rotationVector = new THREE.Vector3(0, 0, 0)

    if (domElement) {
      this.domElement.setAttribute('tabindex', -1)
    }

    // Bind event handlers
    this.getContainerDimensions = this.getContainerDimensions.bind(this)
    this.handleEvent = this.handleEvent.bind(this)
    this.keydown = this.keydown.bind(this)
    this.keyup = this.keyup.bind(this)
    this.mousedown = this.mousedown.bind(this)
    this.mousemove = this.mousemove.bind(this)
    this.mouseup = this.mouseup.bind(this)
    this.attach()

    this.updateMovementVector()
    this.updateRotationVector()
  }

  getContainerDimensions () {
    if (this.domElement !== document) {
      return {
        size: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
        offset: [ this.domElement.offsetLeft, this.domElement.offsetTop ]
      }
    } else {
      return {
        size: [ window.innerWidth, window.innerHeight ],
        offset: [ 0, 0 ]
      }
    }
  }

  handleEvent (event) {
    if (typeof this[event.type] === 'function') {
      this[event.type](event)
    }
  }

  keydown (event) {
    if (event.altKey) {
      return
    }
    event.preventDefault()
    if (defaultMap.moveState[event.keyCode]) {
      this.moveState[defaultMap.moveState[event.keyCode]] = 1
    }
    this.updateMovementVector()
    this.updateRotationVector()
  }

  keyup (event) {
    if (defaultMap.moveState[event.keyCode]) {
      this.moveState[defaultMap.moveState[event.keyCode]] = 0
    }
    this.updateMovementVector()
    this.updateRotationVector()
  }

  mousedown (event) {
    if (this.domElement !== document) {
      this.domElement.focus()
    }
    event.preventDefault()
    event.stopPropagation()

    if (this.dragToLook) {
      this.mouseStatus++
    } else {
      switch (event.button) {
        case 0:
          this.moveState.forward = 1
          break
        case 2:
          this.moveState.back = 1
          break
      }
      this.updateMovementVector()
    }
  }

  mousemove (event) {
    if (!this.dragToLook || this.mouseStatus > 0) {
      const container = this.getContainerDimensions()
      const halfWidth = container.size[0] / 2
      const halfHeight = container.size[1] / 2

      this.moveState.yawLeft =
        -(event.pageX - container.offset[0] - halfWidth) / halfWidth
      this.moveState.pitchDown =
        (event.pageY - container.offset[1] - halfHeight) / halfHeight

      this.updateRotationVector()
    }
  }

  mouseup (event) {
    event.preventDefault()
    event.stopPropagation()

    if (this.dragToLook) {
      this.mouseStatus--

      this.moveState.yawLeft = this.moveState.pitchDown = 0
    } else {
      switch (event.button) {
        case 0:
          this.moveState.forward = 0
          break
        case 2:
          this.moveState.back = 0
          break
      }
      this.updateMovementVector()
    }
    this.updateRotationVector()
  }

  update (delta) {
    const moveMult = delta * this.movementSpeed
    const rotMult = delta * this.rollSpeed

    this.object.translateX(this.moveVector.x * moveMult)
    this.object.translateY(this.moveVector.y * moveMult)
    this.object.translateZ(this.moveVector.z * moveMult)

    this.tmpQuaternion
      .set(
        this.rotationVector.x * rotMult,
        this.rotationVector.y * rotMult,
        this.rotationVector.z * rotMult,
        1
      )
      .normalize()

    this.object.quaternion.multiply(this.tmpQuaternion)

    // expose the rotation vector for convenience
    this.object.rotation.setFromQuaternion(
      this.object.quaternion,
      this.object.rotation.order
    )
  }

  updateMovementVector () {
    const forward =
      this.moveState.forward || (this.autoForward && !this.moveState.back)
        ? 1
        : 0

    this.moveVector.x = -this.moveState.left + this.moveState.right
    this.moveVector.y = -this.moveState.down + this.moveState.up
    this.moveVector.z = -forward + this.moveState.back
  }

  updateRotationVector () {
    this.rotationVector.x = -this.moveState.pitchDown + this.moveState.pitchUp
    this.rotationVector.y = -this.moveState.yawRight + this.moveState.yawLeft
    this.rotationVector.z = -this.moveState.rollRight + this.moveState.rollLeft
  }

  contextmenu (event) {
    event.preventDefault()
  }

  attach () {
    this.domElement.addEventListener('contextmenu', this.contextmenu, false)
    this.domElement.addEventListener('mousemove', this.mousemove, false)
    this.domElement.addEventListener('mousedown', this.mousedown, false)
    this.domElement.addEventListener('mouseup', this.mouseup, false)
    window.addEventListener('keydown', this.keydown, false)
    window.addEventListener('keyup', this.keyup, false)
  }

  dispose () {
    this.domElement.removeEventListener('contextmenu', this.contextmenu, false)
    this.domElement.removeEventListener('mousedown', this.mousedown, false)
    this.domElement.removeEventListener('mousemove', this.mousemove, false)
    this.domElement.removeEventListener('mouseup', this.mouseup, false)
    window.removeEventListener('keydown', this.keydown, false)
    window.removeEventListener('keyup', this.keyup, false)
  }
}
