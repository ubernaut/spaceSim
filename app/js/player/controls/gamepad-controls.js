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
    controls.movementVector.x = (-controls.movementState.left + controls.movementState.right)
    controls.movementVector.y = (-controls.movementState.down + controls.movementState.up)
    controls.movementVector.z = (-forward + controls.movementState.back)

    const p1 = gamepads[0]
    if (p1.buttons[0].pressed) {
      console.log('b0', controls.object.ship)
      controls.movementSpeed += 100000
      controls.object.ship.translateX(controls.movementVector.x * moveMult)
      controls.object.ship.translateY(controls.movementVector.y * moveMult)
      controls.object.ship.translateZ(controls.movementVector.z * moveMult)
    }

    controls.rotationVector.x = p1.axes[0]
    controls.rotationVector.y = p1.axes[1]
    controls.rotationVector.z = p1.axes[2]

    p1.buttons.map(b => {
      if (b.pressed) {
        console.log(b)
      }
    })

    // console.log(gamepads)
  }

  return controls
}

export {
  createGamepadControls
}
