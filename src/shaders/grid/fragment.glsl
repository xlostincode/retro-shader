varying vec2 vUv;
varying vec3 vNormal;

void main() {
    gl_FragColor = vec4(1.0, vUv.x, vUv.y, 1.0);
}
