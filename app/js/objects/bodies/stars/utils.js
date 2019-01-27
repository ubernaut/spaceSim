import { randomUniform, pickRand } from '-/utils'

export const getRandomStarType = () => {
  const t = randomUniform(1, 10000)
  if (t < 7600) {
    return pickRand([ 'M2', 'M4', 'M6' ])
  } else if (t < 8800 && t > 7600) {
    return pickRand([ 'K0', 'K4', 'K7' ])
  } else if (t < 9400 && t > 8800) {
    return pickRand([ 'G2', 'G5', 'G8' ])
  } else if (t < 9700 && t > 9400) {
    return pickRand([ 'F0', 'F2', 'F5', 'F8' ])
  } else if (t < 9800 && t > 9900) {
    return pickRand([ 'A1', 'A3', 'A5' ])
  } else if (t < 9900 && t > 9950) {
    return pickRand([ 'B1', 'B3', 'B5', 'B8' ])
  } else if (t < 9950) {
    return 'O5'
  }
  return 'F8'
}
