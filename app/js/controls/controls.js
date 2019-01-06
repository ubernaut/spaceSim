import FlyControls from './fly-controls'
import { createGamepadControls } from './gamepad-controls'
import { deployDrone } from '-/player/ship'

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

  const controls = new FlyControls(ship, el)

  el.addEventListener(
    'mousewheel',
    event => onScroll({ camera, controls, event }),
    false
  )

  return controls
}

/**
 * Create the controls used to explore the scene
 */
const createControls = ({ type = 'fly', ship, camera, el }) => {
  el = el || document.getElementById('root')
  if (type === 'gamepad') {
    return createGamepadControls(ship, el, deployDrone(ship))
  }
  return createFlyControls({
    ship,
    camera,
    el
  })
}

export { createControls }
