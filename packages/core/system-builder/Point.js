class Point {
  constructor (position_data = [ 0, 0, 0 ]) {
    this.x = position_data[0]
    this.y = position_data[1]
    this.z = position_data[2]
  }
  reset () {
    this.x = 0
    this.y = 0
    this.z = 0
  }
}

export default Point
