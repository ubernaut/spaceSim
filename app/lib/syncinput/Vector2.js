export default function Vector2 (x, y) {
  this.x = x !== undefined ? x : 0
  this.y = y !== undefined ? y : 0
}

Vector2.prototype.set = function (x, y) {
  this.x = x
  this.y = y
}
