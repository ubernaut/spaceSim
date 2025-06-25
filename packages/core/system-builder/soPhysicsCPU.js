const G = 2.93558 * Math.pow(10, -4);

class soPhysicsCPU {
  constructor(system) {
    this.system = system;
  }

  computeAcceleration(pos, mass, acc, rad) {
    const size = pos.length;
    let result = acc.map(a => [...a]);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i === j) continue;

        const d_x = pos[i][0] - pos[j][0];
        const d_y = pos[i][1] - pos[j][1];
        const d_z = pos[i][2] - pos[j][2];

        const radius = Math.sqrt(d_x * d_x + d_y * d_y + d_z * d_z);

        if (radius > 0.666 * (rad[i] + rad[j])) {
          const grav_mag = G / Math.pow(radius, 3);
          result[i][0] -= grav_mag * d_x * mass[j];
          result[i][1] -= grav_mag * d_y * mass[j];
          result[i][2] -= grav_mag * d_z * mass[j];
        }
      }
    }
    return result;
  }

  computeCollisions(pos, mass, acc, rad) {
    const size = pos.length;
    let result = new Array(size).fill(-1);

    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        const d_x = Math.abs(pos[i][0] - pos[j][0]);
        const d_y = Math.abs(pos[i][1] - pos[j][1]);
        const d_z = Math.abs(pos[i][2] - pos[j][2]);

        const distance = Math.sqrt(d_x * d_x + d_y * d_y + d_z * d_z);
        const bothRads = rad[i] + rad[j];

        if (distance < 0.66 * bothRads) {
          result[i] = j;
        }
      }
    }
    return result;
  }
}

export default soPhysicsCPU;
