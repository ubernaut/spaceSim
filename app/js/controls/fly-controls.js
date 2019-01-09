import Keyboard from 'syncinput/Keyboard'
import Mouse from 'syncinput/Mouse'
import state from '-/state'
import { setSelected } from '-/state'
import { calcObjectDistance, calcDistances } from './utils'

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
    toggleConsole: {
      keys: [ Keyboard.CTRL, Keyboard.SHIFT, Keyboard.K ]
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
    state.set([ 'scene', 'player', 'movementSpeed' ], newSpeed)
  }

  update (delta) {
    this.keyboard.update()
    this.mouse.update()

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

    if (state.get([ 'gui', 'console', 'hidden' ]) === true) {
      Object.keys(this.keymap.moveState).map(key => {
        if (this.keyboard.keyPressed(key)) {
          this.moveState[this.keymap.moveState[key]] = 1
        }
      })
    }

    Object.keys(this.keymap.guiState).map(funcName => {
      if (
        this.keymap.guiState[funcName].keys.every(key =>
          this.keyboard.keyPressed(key)
        )
      ) {
        this.handlers[funcName]()
      }
    })

    if (
      this.mouse.buttonPressed(Mouse.LEFT) &&
      this.testingIntersections === false
    ) {
      this.testingIntersections = true
      const mouse = new THREE.Vector2()
      mouse.x = (this.mouse.position.x / window.innerWidth) * 2 - 1
      mouse.y = -(this.mouse.position.y / window.innerHeight) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, this.camera)

      const groups = this.scene.children.filter(x => x.type === 'Group')

      // TODO clean this up
      let intersects = []
      for (const g of groups) {
        const intersections = raycaster.intersectObjects(
          g.children.filter(x => x.type === 'Mesh')
        )
        if (intersections.length > 0) {
          intersects.push([ { object: g } ])
        }
      }
      intersects.push(
        raycaster.intersectObjects(
          this.scene.children.filter(
            x => x.name !== 'PolarGridHelper' && x.type !== 'Points'
          )
        )
      )
      const obj = intersects[0][0]

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
        console.log(obj)
        if (this.selection !== null) {
          const markers = this.selection.object.children.filter(
            c => c.name === 'selection'
          )
          markers.map(m => this.selection.object.remove(m))
          setSelected(null)
          this.selection = null
        }
        const sprite = new THREE.TextureLoader().load(
          'app/assets/images/corona.png'
        )
        const geometry = new THREE.BufferGeometry()
        geometry.addAttribute(
          'position',
          new THREE.Float32BufferAttribute([ 0, 0, 0 ], 3)
        )
        const material = new THREE.PointsMaterial({
          size: obj.object.scale.x * 4,
          sizeAttenuation: true,
          map: sprite,
          alphaTest: 0.05,
          transparent: true,
          blending: THREE.AdditiveBlending
        })
        // const uniforms = getUniforms(radius, rgb, time)
        material.color.setRGB(0, 0, 1)

        const mesh = new THREE.Points(geometry, material)
        mesh.frustumCulled = false
        mesh.name = 'selection'

        this.selectionMarker = mesh
        obj.object.add(mesh)

        const pointLight = new THREE.PointLight(0x0000ff, 1.25, 0, 2)
        pointLight.name = 'selection'
        obj.object.add(pointLight)

        this.selection = obj
        this.lastSelected = new Date().valueOf()
      }

      this.testingIntersections = false
    }

    if (this.mouse.buttonPressed(Mouse.RIGHT)) {
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
