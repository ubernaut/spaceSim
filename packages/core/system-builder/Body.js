import Point from './Point'

class Body {
  constructor (body_data = []) {
    if (body_data == []) {
      body_data = [ 'body', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    }
    this.name = body_data[0]
    this.mass = body_data[1]
    this.position = new Point([ body_data[2], body_data[3], body_data[4] ])
    this.velocity = new Point([ body_data[5], body_data[6], body_data[7] ])
    this.acceleration = new Point([ body_data[8], body_data[9], body_data[10] ])
    this.orientation = new Point()
    this.angVelocity = new Point()
    this.acceleration.reset()
    this.radius = (0.018 * Math.pow(this.mass, 0.35)) / 149600000000
  }
}

export default Body
