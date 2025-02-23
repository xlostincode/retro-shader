uniform vec2 uFrequency;
uniform float uTime;
uniform float uTimeOffset;
uniform float uDisplacement;

attribute float aRandom;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation =  sin(modelPosition.x * uFrequency.x - (uTime * uTimeOffset)) * 0.1;
    elevation += cos(modelPosition.y * uFrequency.y - (uTime * uTimeOffset)) * 0.1;
    
    float wave = sin((position.x * uFrequency.x + position.y * uFrequency.y) + (uTime + uTimeOffset)) * uDisplacement;

    modelPosition.y += wave * aRandom;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vNormal = normal;
}