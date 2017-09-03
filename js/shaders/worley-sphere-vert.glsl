precision mediump float;

attribute vec3 aPosition;

varying vec3 vPosition;

uniform mat4 uProjection;
uniform mat4 uView;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}
