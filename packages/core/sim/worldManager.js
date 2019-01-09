import System from '@void/core/system-builder/System'
import soPhysics from '@void/core/system-builder/soPhysics'

// this object is intended to coordinate and facilitate interoperation of the
// components that affect the simulation

// for example; this manager will handle adding and removing objects from the scene,
//

const renderLoop = function () {
  // collect physics state from worker
  // collect input from user
  // collect input from network
  // send input&network to physics sim and tell it to render the next frame
  // add/remove/move scene objects
  // call scene.animate
}
