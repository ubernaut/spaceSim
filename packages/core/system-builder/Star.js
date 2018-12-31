import Body from './Body'

class Star {
  constructor (
    xPos = 30000,
    yPos = 0,
    zPos = 0,
    player = 'duh',
    aName = 'default'
  ) {
    this.body = new Body([ 'body', 1, xPos, yPos, zPos, 0, 0, 0, 0, 0, 0 ])
    this.color = [ 0.0, 0.0, 1.0 ]
    this.mass = 16
    this.radius = 6.6
    this.temp = 33000
    this.buildrandom()
  }
  buildrandom () {
    let starrand = Math.random() * 10000
    if (starrand < 7600) {
      this.mtype()
    }
    if (starrand < 8800 && starrand > 7600) {
      this.ktype()
    }
    if (starrand < 9400 && starrand > 8800) {
      this.gtype()
    }
    if (starrand < 9700 && starrand > 9400) {
      this.ftype()
    }
    if (starrand < 9800 && starrand > 9900) {
      this.atype()
    }
    if (starrand < 9900 && starrand > 9950) {
      this.btype()
    }
    if (starrand < 9950) {
      this.otype()
    }
  }
  otype () {
    this.color = [ 1.0, 0.0, 0.0 ]
    this.mass = 16
    this.radius = 6.6
    this.temp = 33000
  }
  btype () {
    this.color = [ 0.5, 0.5, 0.8, 1.0 ]
    this.mass = 2.1
    this.radius = 1.8
    this.temp = 10000
  }
  atype () {
    this.color = [ 1.0, 1.0, 1.0, 1.0 ]
    this.mass = 1.4
    this.radius = 1.4
    this.temp = 7500
  }
  ftype () {
    this.color = [ 1.0, 1.0, 0.8, 1.0 ]
    this.color = [ 1.0, 0.0, 0.0 ]
    this.mass = 1
    this.radius = 1
    this.temp = 6000
  }
  gtype () {
    this.color = [ 1.0, 1.0, 0.0, 1.0 ]
    this.mass = 0.8
    this.radius = 0.9
    this.temp = 5200
  }
  ktype () {
    this.color = [ 1.0, 0.2, 0.2, 1.0 ]
    this.mass = 0.7
    this.radius = 0.5
    this.temp = 3700
  }
  mtype () {
    this.color = [ 1.0, 0.0, 0.0, 1.0 ]
    this.mass = 0.2
    this.radius = 0.2
    this.temp = 2000
  }
}

export default Star
