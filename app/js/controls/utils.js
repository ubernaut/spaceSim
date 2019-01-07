export const calcObjectDistance = (obj1, obj2) => {
  const dx = obj1.position.x - obj2.position.x
  const dy = obj1.position.y - obj2.position.y
  const dz = obj1.position.z - obj2.position.z

  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

export const calcDistances = dist_m => {
  return {
    ly: (dist_m / 9460730472580800).toExponential(4),
    km: (dist_m / 1000).toExponential(4),
    mi: (dist_m / 1609.344).toExponential(4),
    au: (dist_m / 149597870700).toExponential(4),
    pc: (dist_m / 3.08567758149137e16).toExponential(4)
  }
}
