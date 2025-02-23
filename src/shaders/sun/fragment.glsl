varying vec2 vUv;

void main() {
    gl_FragColor = vec4(1.0, vUv.x * 0.25, vUv.y * 0.25, 1.0);
}
