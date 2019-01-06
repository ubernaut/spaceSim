export const calcObjectDistance = (obj1, obj2) => {
  const dx = obj1.position.x - obj2.position.x
  const dy = obj1.position.y - obj2.position.y
  const dz = obj1.position.z - obj2.position.z

  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
