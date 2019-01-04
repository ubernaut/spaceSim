import FlyControls from './fly-controls'
import { createGamepadControls } from './gamepad-controls'
import { deployDrone } from '-/player/ship'
import state from '-/state'

export const createFlyControls = ({ ship, camera, el }) => {
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

  const adjustThrust = (val, controls) => {
    const movementSpeed = state.get([ 'scene', 'player', 'movementSpeed' ])
    const newSpeed =
      movementSpeed + val * Math.max(1, Math.pow(Math.abs(movementSpeed), 0.85))
    state.set([ 'scene', 'player', 'movementSpeed' ], newSpeed)
    controls.movementSpeed = newSpeed
  }

  const controls = new FlyControls(ship, el)
  controls.movementSpeed = 0
  controls.domElement = el
  controls.rollSpeed = 0.35
  controls.autoForward = true
  controls.dragToLook = true

  el.addEventListener(
    'mousewheel',
    event => onScroll({ camera, controls, event }),
    false
  )
  el.addEventListener('keydown', event => {
    if (event.key === 'w') {
      adjustThrust(2, controls)
    } else if (event.key === 's') {
      adjustThrust(-2, controls)
    }
  })

  return controls
}

/**
 * Create the controls used to explore the scene
 */
const createControls = ({ type = 'fly', scene, ship, socket, camera }) => {
  if (type === 'gamepad') {
    return createGamepadControls(
      ship,
      document.getElementById('root'),
      deployDrone(ship)
    )
  }
  return createFlyControls({
    ship,
    camera,
    el: document.getElementById('root'),
    scene
  })
}

export { createControls }
