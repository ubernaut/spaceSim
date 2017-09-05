const onScroll = ({ camera, controls, event }) => {
  const deltaY = event.wheelDeltaY
  // fov -= event.wheelDeltaY * 0.05;
  // camera.projectionMatrix = THREE.Matrix4.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
  if (deltaY < 0) {
    camera.position.y *= 1.1
    camera.position.z *= 1.1
    controls.movementSpeed *= 1.1
  } else {
    camera.position.y *= 0.9
    camera.position.z *= 0.9
    controls.movementSpeed *= 0.9
  }
}

const setFlyControls = ({ ship, camera, el }) => {
  const controls = new THREE.FlyControls(ship, el)
  controls.movementSpeed = 100
  controls.domElement = el
  controls.rollSpeed = Math.PI / 3
  controls.autoForward = false
  controls.dragToLook = true
  window.addEventListener('mousewheel', (event) => onScroll({ camera, controls, event }), false)
  return controls
}

export {
  onScroll,
  setFlyControls
}
