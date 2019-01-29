import Keyboard from 'syncinput/Keyboard'
import Mouse from 'syncinput/Mouse'
import sceneState, { setSelected } from '-/state/branches/scene'
import guiState from '-/state/branches/gui'
import { throttle } from 'throttle-debounce'
import {
  calcObjectDistance,
  calcDistances,
  mouseToSceneCoords,
  testIntersections,
  highlightMesh
} from './utils'

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
  },
  guiState: {
    toggleGui: {
      keys: [ Keyboard.TAB ]
    },
    toggleConsole: {
      keys: [ Keyboard.ESC ]
    }
  },
  misc: {
    laser: {
      keys: [ Keyboard.SPACEBAR ]
    },
    cannon: {
      keys: [ Keyboard.C ]
    }
  }
}

export default class KeyboardControls {
  constructor (object, domElement, scene, camera, handlers) {
    this.object = object
    this.domElement = domElement
    this.scene = scene
    this.camera = camera
    this.handlers = handlers
    this.testingIntersections = false
    this.selection = null
    this.selectionMarker = null
    this.keyboard = new Keyboard()
    this.mouse = new Mouse()
    this.keymap = Object.assign({}, defaultMap)
    this.acceleration = 0.65
    this.movementSpeed = 1.0
    this.rollSpeed = 0.4
    this.moveVector = new THREE.Vector3(0, 0, 0)
    this.rotationVector = new THREE.Vector3(0, 0, 0)
    this.resetMoveState()
    this.raycaster = new THREE.Raycaster()
    this.selectionHighlight = highlightMesh
    this.throttledTestIntersections = throttle(
      100,
      false,
      this.testIntersections
    )
    this.throttledUpdateSelection = throttle(100, true, this.updateSelection)
  }

  updateMovementSpeed () {
    const dir = this.moveState.forward ? 1 : this.moveState.back ? -1 : 0
    const step = Math.max(
      1,
      Math.pow(Math.abs(this.movementSpeed), this.acceleration)
    )
    const newSpeed = this.movementSpeed + dir * step
    this.movementSpeed = newSpeed
    sceneState.set([ 'player', 'ship', 'movementSpeed' ], newSpeed)
  }

  update (delta) {
    this.keyboard.update()
    this.mouse.update()
    this.movementSpeed = sceneState.get([ 'player', 'ship', 'movementSpeed' ])
    this.throttledTestIntersections()
    this.throttledUpdateSelection()

    // Only update moveState if the console is closed
    if (guiState.get([ 'console', 'isOpen' ]) !== true) {
      Object.keys(this.keymap.moveState).map(key => {
        if (this.keyboard.keyPressed(key)) {
          this.moveState[this.keymap.moveState[key]] = 1
        }
      })
    }

    // GUI handlers
    Object.keys(this.keymap.guiState).map(funcName => {
      if (
        this.keymap.guiState[funcName].keys.every(key =>
          this.keyboard.keyPressed(key)
        )
      ) {
        this.handlers[funcName]()
      }
    })

    // Misc handlers
    Object.keys(this.keymap.misc).map(funcName => {
      if (
        this.keymap.misc[funcName].keys.every(key =>
          this.keyboard.keyPressed(key)
        )
      ) {
        this.handlers[funcName]()
      }
    })

    if (this.mouse.buttonPressed(Mouse.RIGHT)) {
      this.mousemove(this.mouse.position.x, this.mouse.position.y)
    }

    this.updateMovementSpeed()
    this.updateMovementVector()
    this.updateRotationVector()

    const moveMult = delta * this.movementSpeed
    const rotMult = delta * this.rollSpeed

    this.translateObject(
      (this.moveVector.x === 0 ? 0 : this.moveVector.x > 1 ? 1 : -1) *
        Math.abs(moveMult),
      (this.moveVector.y === 0 ? 0 : this.moveVector.y > 1 ? 1 : -1) *
        Math.abs(moveMult),
      (this.moveVector.z === 0 ? 0 : this.moveVector.z > 1 ? 1 : -1) *
        Math.abs(moveMult)
    )
    this.rotateObject(
      this.rotationVector.x * rotMult,
      this.rotationVector.y * rotMult,
      this.rotationVector.z * rotMult
    )

    this.resetMoveState()
  }

  updateSelection () {
    if (this.selection) {
      setSelected({
        name: this.selection.object.name,
        id: this.selection.object.id,
        uuid: this.selection.object.uuid,
        type: this.selection.object.type,
        distance: calcDistances(
          calcObjectDistance(this.selection.object, this.object)
        ),
        position: {
          x: parseFloat(this.selection.object.position.x).toFixed(2),
          y: parseFloat(this.selection.object.position.y).toFixed(2),
          z: parseFloat(this.selection.object.position.z).toFixed(2)
        },
        userData: this.selection.object.userData
      })
    } else {
      setSelected(null)
    }
  }

  testIntersections () {
    if (!this.mouse.buttonPressed(Mouse.LEFT)) {
      return
    }

    this.raycaster.setFromCamera(
      mouseToSceneCoords(this.mouse.position.x, this.mouse.position.y),
      this.camera
    )
    const intersects = testIntersections({
      scene: this.scene,
      raycaster: this.raycaster
    })

    let obj = intersects[0]

    // The player's ship (the GLB gets loaded with some deep nesting)
    if (
      obj &&
      obj.object &&
      obj.object.name &&
      obj.object.name === 'Icosahedron_Standard_0'
    ) {
      obj = { object: obj.object.parent.parent.parent }
    }

    if (!obj) {
      if (this.selection !== null) {
        const markers = this.selection.object.children.filter(
          c => c.name === 'selection'
        )
        markers.map(m => this.selection.object.remove(m))
        setSelected(null)
        this.selection = null
      }
    } else {
      if (this.selection !== null) {
        const markers = this.selection.object.children.filter(
          c => c.name === 'selection'
        )
        markers.map(m => this.selection.object.remove(m))
        setSelected(null)
        this.selection = null
      }

      this.selectionHighlight.material.size = obj.object.scale.x * 4
      obj.object.add(this.selectionHighlight)

      this.selectionMarker = this.selectionHighlight
      this.selection = obj
      this.lastSelected = new Date().valueOf()
    }
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
