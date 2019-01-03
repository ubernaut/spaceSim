import { createFlyControls } from './controls/flyControls'
import { createGamepadControls } from './controls/gamepad-controls'
import { deployDrone } from '-/player/ship'
import state from '-/state'

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

/**
 * Create the controls used to explore the scene
 */
const createControls = ({
  scene,
  ship,
  socket,
  camera,
  useGamepad = false
}) => {
  if (useGamepad) {
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
    scene,
    socket,
    onScroll,
    adjustThrust
  })
}

export { createControls }
