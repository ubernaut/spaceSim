/**
 * Physical constants (meters)
 */
const distances = { au: 1.495978707e11, ly: 9.4607e15, pc: 3.0857e16 }

const misc = {
  // speed of light (m/s)
  c: 2.99792458e8
}

/**
 * Mathematical constants
 */
const math = { e: Math.E }

/**
 * Astronomical constants
 */
const starTypes = {
  O5: [ 157, 180, 255 ],

  B1: [ 162, 185, 255 ],
  B3: [ 167, 188, 255 ],
  B5: [ 170, 191, 255 ],
  B8: [ 175, 195, 255 ],

  A1: [ 186, 204, 255 ],
  A3: [ 192, 209, 255 ],
  A5: [ 202, 216, 255 ],

  F0: [ 228, 232, 255 ],
  F2: [ 237, 238, 255 ],
  F5: [ 251, 248, 255 ],
  F8: [ 255, 249, 249 ],

  G2: [ 255, 245, 236 ],
  G5: [ 255, 244, 232 ],
  G8: [ 255, 241, 223 ],

  K0: [ 255, 235, 209 ],
  K4: [ 255, 215, 174 ],
  K7: [ 255, 198, 144 ],

  M2: [ 255, 190, 127 ],
  M4: [ 255, 187, 123 ],
  M6: [ 255, 187, 123 ]
}

export default {
  ...distances,
  ...misc,
  ...math,
  starTypes
}
