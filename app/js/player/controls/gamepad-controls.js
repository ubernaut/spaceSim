const registerGamepads = () => {
  return navigator.getGamepads() || navigator.webkitGetGamepads() || []
}

const createGamepadControls = (object, domElement) => {
  let gamepads = []

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
    gamepads = registerGamepads()

    const moveMult = delta * controls.movementSpeed

    const forward = 1
    controls.movementVector.x = -controls.movementState.left + controls.movementState.right
    controls.movementVector.y = -controls.movementState.down + controls.movementState.up
    controls.movementVector.z = -forward + controls.movementState.back

    const p1 = gamepads[0]
    if (p1.buttons[3].pressed) {
      // console.log('b0', controls.object.ship)
      controls.movementSpeed += Math.max(1, Math.pow(Math.abs(controls.movementSpeed), 0.85))
    } else if (p1.buttons[1].pressed) {
      controls.movementSpeed -= Math.max(1, Math.pow(Math.abs(controls.movementSpeed), 0.85))
    }

    const rotMult = 0.015
    if (p1.buttons[6].pressed) {
      // console.log('6')
      controls.rotationVector.z = 1.5 * p1.buttons[6].value
    } else if (p1.buttons[7].pressed) {
      // console.log('7')
      controls.rotationVector.z = -1.5 * p1.buttons[7].value
    } else {
      if (controls.rotationVector.z > 0) {
        controls.rotationVector.z -= 0.1
      } else if (controls.rotationVector.z < 0) {
        controls.rotationVector.z += 0.1
      }
    }

    controls.rotationVector.x = 1.0 * p1.axes[1]
    controls.rotationVector.y = -1.0 * p1.axes[0]
    // controls.rotationVector.z = p1.axes[2]

    controls.object.ship.translateX(controls.movementVector.x * moveMult)
    controls.object.ship.translateY(controls.movementVector.y * moveMult)
    controls.object.ship.translateZ(controls.movementVector.z * moveMult)

    const q = new THREE.Quaternion()
    q.set(controls.rotationVector.x * rotMult, controls.rotationVector.y * rotMult, controls.rotationVector.z * rotMult, 1).normalize()
    controls.object.ship.quaternion.multiply(q)
    controls.object.ship.rotation.setFromQuaternion(controls.object.ship.quaternion, controls.object.ship.rotation.order)

    p1.buttons.map((b, i) => {
      if (b.pressed) {
        console.log(b, i)
      }
    })

    // console.log(gamepads)
  }

  return controls
}

export {
  createGamepadControls
}
