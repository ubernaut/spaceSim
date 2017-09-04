precision mediump float;

uniform vec3 viewVector;
uniform float time;

varying vec3 vPosition;
varying float intensity;

void main() {
  vec3 vNormal = normalize( normalMatrix * normal );
	vec3 vNormel = normalize( normalMatrix * viewVector );
	intensity = pow( .5 - dot(vNormal, vNormel), .5 );

  vPosition = position;
  vPosition.x *= 1.0 + (pow(abs(sin(time / 100.0)), 1.5) * .4);
  vPosition.y *= 1.0 + (pow(abs(cos(time / 50.0)), 2.0) * .3);
  vPosition.z *= 1.0 + (pow(abs(sin(time / 200.0)), 2.5) * .45);

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

	gl_Position = projectionMatrix * mvPosition;
}
