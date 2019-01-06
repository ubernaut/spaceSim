import Key from './Key'

export default function Gamepad () {
  this.setGamepad(navigator.getGamepads()[Gamepad.gamepads.length])

  Gamepad.gamepads.push(this)
}

// Set gamepad
Gamepad.prototype.setGamepad = function (gamepad) {
  if (gamepad !== undefined) {
    // Store gamepad and its index
    this.index = gamepad.index
    this.gamepad = gamepad

    // Create and initialize buttons
    this.buttons = []
    for (var i = 0; i < gamepad.buttons.length; i++) {
      this.buttons.push(new Key())
    }

    // Try to get the device vendor and product id
    this.setProductVendor(gamepad)
    this.connected = true
  } else {
    console.warn('SyncInput: No Gamepad found')
    this.disconnect()
  }
}

// Disconnect from gamepad
Gamepad.prototype.disconnect = function () {
  this.vendor = -1
  this.product = -1
  this.connected = false

  this.gamepad = null
  this.buttons = []
}

// Set vendor and product id
Gamepad.prototype.setProductVendor = function (gamepad) {
  // Chrome
  try {
    var temp = gamepad.id.split(':')

    this.vendor = temp[1].split(' ')[1]
    this.product = temp[2].replace(' ', '').replace(')', '')

    return
  } catch (e) {}

  // Firefox
  try {
    var temp = gamepad.id.split('-')

    this.vendor = temp[0]
    this.product = temp[1]
  } catch (e) {}
}

// Update key flags
Gamepad.prototype.update = function () {
  this.gamepad = navigator.getGamepads()[this.index]

  if (this.gamepad !== undefined) {
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].update(
        this.gamepad.buttons[i].pressed ? Key.DOWN : Key.UP
      )
    }
  }
}

// Get analog button value [0...1]
Gamepad.prototype.getAnalogueButton = function (button) {
  return button > this.buttons.length || button < 0
    ? 0
    : this.gamepad.buttons[button].value
}

// Get axis value [-1...1]
Gamepad.prototype.getAxis = function (axis) {
  return axis > this.gamepad.axes.length || axis < 0
    ? 0
    : this.gamepad.axes[button].value
}

// Check if a button is pressed
Gamepad.prototype.buttonPressed = function (button) {
  return button > this.buttons.length ? false : this.buttons[button].pressed
}

// Check if a button was just pressed
Gamepad.prototype.buttonJustPressed = function (button) {
  return button > this.buttons.length || button < 0
    ? false
    : this.buttons[button].justPressed
}

// Check if a button was just released
Gamepad.prototype.buttonJustReleased = function (button) {
  return button > this.buttons.length || button < 0
    ? false
    : this.buttons[button].justReleased
}

// Dispose gamepad (remove from gamepads list)
Gamepad.prototype.dispose = function () {
  var index = Gamepad.gamepads.indexOf(this)

  if (index !== -1) {
    Gamepad.gamepads.splice(index, 1)
  }
}

// Keep track of every gamepad object to disconnect and reconnect them on the fly
Gamepad.gamepads = []

// Get all available gamepads
Gamepad.getGamepads = function () {
  return navigator.getGamepads()
}

// Create and start gamepad listener
Gamepad.startListener = function () {
  // Gamepad connected
  window.addEventListener('gamepadconnected', event => {
    var gamepad = event.gamepad

    // console.warn("SyncInput: Gamepad " + gamepad.id + " connected");

    for (var i = 0; i < Gamepad.gamepads.length; i++) {
      if (Gamepad.gamepads[i].index === gamepad.index) {
        Gamepad.gamepads[i].setGamepad(gamepad)
      }
    }
  })

  // Gamepad disconnected
  window.addEventListener('gamepaddisconnected', event => {
    var gamepad = event.gamepad

    console.warn('SyncInput: Gamepad ' + gamepad.id + ' disconnected')

    for (var i = 0; i < Gamepad.gamepads.length; i++) {
      if (Gamepad.gamepads[i].index === gamepad.index) {
        Gamepad.gamepads[i].disconnect()
      }
    }
  })
}

Gamepad.startListener()

// Standart button mapping
Gamepad.LEFT = 14
Gamepad.RIGHT = 15
Gamepad.DOWN = 13
Gamepad.UP = 12

Gamepad.SELECT = 8
Gamepad.START = 9
Gamepad.HOME = 16

Gamepad.LEFT_TRIGGER_A = 4
Gamepad.LEFT_TRIGGER_B = 6

Gamepad.RIGHT_TRIGGER_A = 5
Gamepad.RIGHT_TRIGGER_B = 7

Gamepad.A = 0
Gamepad.B = 1
Gamepad.C = 2
Gamepad.D = 3

// Standard axis
Gamepad.LEFT_ANALOGUE_HOR = 0
Gamepad.LEFT_ANALOGUE_VERT = 1
Gamepad.RIGHT_ANALOGUE_HOR = 2
Gamepad.RIGHT_ANALOGUE_VERT = 3
