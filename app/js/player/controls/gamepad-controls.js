import * as net from '-/net/net'

const xbox = {
  left_stick_v: 1,
  left_stick_h: 0,
  right_stick_v: 0,
  right_stick_h: 0,
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  left_bumper: 4,
  right_bumper: 5,
  left_trigger: 6,
  right_trigger: 7,
  back: 8,
  start: 9,
  left_click: 10,
  right_click: 11,
  dpad_up: 12,
  dpad_down: 13,
  dpad_left: 14,
  dpad_right: 15
}

const registerGamepads = () => {
  if (navigator.getGamepads) {
    return navigator.getGamepads()
  }
  if (navigator.webkitGetGamepads) {
    return navigator.webkitGetGamepads()
  }
  return []
}

const onScroll = ({ camera, controls, event }) => {
  const deltaY = event.wheelDeltaY
  if (deltaY < 0) {
    camera.position.y *= 1.1
    camera.position.z *= 1.1
  } else {
    camera.position.y *= 0.9
    camera.position.z *= 0.9
  }
}

const createGamepadControls = (object, domElement, shoot, createDrone) => {
  const controls = {
    movementSpeed: 0,
    movementState: {
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
    },
    movementVector: new THREE.Vector3(0, 0, 0),
    rotationVector: new THREE.Vector3(0, 0, 0),
    object
  }

  controls.update = (delta, time) => {
    const p1 = registerGamepads()[0]

    if (!p1) {
      return
    }

    // adjust thrust
    if (p1.buttons[xbox.Y].pressed) {
      controls.movementSpeed += Math.max(
        1,
        Math.pow(Math.abs(controls.movementSpeed), 0.85)
      )
    } else if (p1.buttons[xbox.B].pressed) {
      controls.movementSpeed -= Math.max(
        1,
        Math.pow(Math.abs(controls.movementSpeed), 0.85)
      )
    }

    // configure deadzone and apply yaw + pitch
    const yaw = p1.axes[xbox.left_stick_v]
    if (Math.abs(yaw) > 0.2) {
      controls.rotationVector.x = 1.0 * yaw
    } else {
      controls.rotationVector.x = 0
    }
    const pitch = p1.axes[xbox.left_stick_h]
    if (Math.abs(pitch) > 0.2) {
      controls.rotationVector.y = -1.0 * pitch
    } else {
      controls.rotationVector.y = 0
    }

    // roll
    const rotMult = 0.015
    if (p1.buttons[xbox.left_trigger].pressed) {
      controls.rotationVector.z = 1.75 * p1.buttons[xbox.left_trigger].value
    } else if (p1.buttons[xbox.right_trigger].pressed) {
      controls.rotationVector.z = -1.75 * p1.buttons[xbox.right_trigger].value
    } else {
      if (controls.rotationVector.z > 0) {
        controls.rotationVector.z -= 0.1
      } else if (controls.rotationVector.z < 0) {
        controls.rotationVector.z += 0.1
      }
    }

    // move the ship
    const moveMult = delta * controls.movementSpeed
    controls.movementVector.x =
      -controls.movementState.left + controls.movementState.right
    controls.movementVector.y =
      -controls.movementState.down + controls.movementState.up
    controls.movementVector.z = -1.0 + controls.movementState.back
    controls.object.translateX(controls.movementVector.x * moveMult)
    controls.object.translateY(controls.movementVector.y * moveMult)
    controls.object.translateZ(controls.movementVector.z * moveMult)

    // rotate the ship
    const q = new THREE.Quaternion()
    q.set(
      controls.rotationVector.x * rotMult,
      controls.rotationVector.y * rotMult,
      controls.rotationVector.z * rotMult,
      1
    ).normalize()
    controls.object.quaternion.multiply(q)
    controls.object.rotation.setFromQuaternion(
      controls.object.quaternion,
      controls.object.rotation.order
    )

    // shoot!
    if (p1.buttons[xbox.X].pressed) {
      const { quaternion, position } = Void.ship
      const { color, velocity } = shoot({
        quaternion,
        position,
        weaponType: 'planetCannon'
      })
      const payload = {
        quaternion,
        position,
        color,
        velocity,
        weaponType: 'planetCannon'
      }
      net.broadcastUpdate(Void.socket, { type: 'shotFired', payload })
    }

    // deploy drone
    if (p1.buttons[xbox.left_bumper].pressed) {
      const { quaternion, position } = Void.ship
      createDrone({ quaternion, position })
    }
  }

  domElement.addEventListener(
    'mousewheel',
    event => onScroll({ camera: Void.camera, controls, event }),
    false
  )

  return controls
}

export { createGamepadControls }
