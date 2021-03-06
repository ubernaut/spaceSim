import FlyControls from './fly-controls'
import { createGamepadControls } from './gamepad-controls'

export const createFlyControls = ({ ship, camera, el, scene }, handlers) => {
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

  const controls = new FlyControls(ship, el, scene, camera, handlers)

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
const createControls = (
  { type = 'fly', ship, camera, el, scene },
  handlers
) => {
  el = el || document.getElementById('root')
  if (type === 'gamepad') {
    return createGamepadControls(ship, el, null)
  }
  return createFlyControls(
    {
      ship,
      camera,
      el,
      scene
    },
    handlers
  )
}

export { createControls }
