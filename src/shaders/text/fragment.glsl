varying vec2 vUv;
varying vec3 vNormal;

void main() {
    gl_FragColor = vec4(1.0, 1.0 - (vUv.x - 0.1), vUv.y, 1.0);
}
