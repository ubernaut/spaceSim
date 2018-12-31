import { createAgent } from '-/ai/agent'

const createDrone = ({ quaternion, position }) => {
  const geometry = new THREE.IcosahedronGeometry(1, 2)
  const material = new THREE.MeshPhongMaterial({
    color: 0x222222
  })
  const mesh = new THREE.Mesh(geometry, material)

  mesh.quaternion.copy(quaternion)
  mesh.position.copy(position)

  const animate = (delta, time) => {
    // animate drone
  }

  return {
    mesh,
    animate
  }
}

export { createDrone }
