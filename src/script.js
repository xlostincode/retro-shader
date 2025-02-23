import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import gridVertexShader from "./shaders/grid/vertex.glsl"
import gridFragmentShader from "./shaders/grid/fragment.glsl"

import sunVertexShader from "./shaders/sun/vertex.glsl"
import sunFragmentShader from "./shaders/sun/fragment.glsl"

import textVertexShader from "./shaders/text/vertex.glsl"
import textFragmentShader from "./shaders/text/fragment.glsl"

import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js'

const isDebug = window.location.hash === '#debug'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const fontLoader = new FontLoader();

// Grid
const gridGeometry = new THREE.PlaneGeometry(2, 1, 64, 32)

const vertexCount = gridGeometry.attributes.position.count
const randoms = new Float32Array(vertexCount)

for (let index = 0; index < vertexCount; index++) {
    randoms[index] = Math.random()    
}

gridGeometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1))

const gridMaterial = new THREE.ShaderMaterial({
    vertexShader: gridVertexShader,
    fragmentShader: gridFragmentShader,
    wireframe: true,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(8, 5) },
        uTime: { value: 0 },
        uTimeOffset: { value: 0.5 },
        uDisplacement: {value: 0.025}
    }
})

const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial)
gridMesh.rotation.set(Math.PI / 2, 0, 0)
scene.add(gridMesh)

// Sun
const sunGeometry = new THREE.CircleGeometry(0.40, 16, 0, Math.PI)
const sunMaterial = new THREE.ShaderMaterial({
    vertexShader: sunVertexShader,
    fragmentShader: sunFragmentShader,
})
const sunMesh = new THREE.Mesh(
    sunGeometry,
    sunMaterial
)
sunMesh.position.set(0, -0.05, -1)
scene.add(sunMesh)

// Text
let textMesh = null
fontLoader.load( 'fonts/Streamster_Regular.json', function ( font ) {
	const textGeometry = new TextGeometry( "Shaders!", {
		font: font,
        size: 0.11,
        depth: 0.01,
        curveSegments: 12,
	} );

    const textMaterial = new THREE.ShaderMaterial({
        vertexShader: textVertexShader,
        fragmentShader: textFragmentShader,
        transparent: true,
    })

    textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.position.set(-0.25, 0.05, -0.10)
    scene.add(textMesh)
} );

// Octahedron
const octahedronGeometry = new THREE.OctahedronGeometry(0.1, 0)
const octahedronMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    color: "yellow"
})

const octahedronMesh = new THREE.Mesh(
    octahedronGeometry,
    octahedronMaterial
)
octahedronMesh.position.set(0, 0.09, -0.10)
octahedronMesh.rotation.z = Math.PI / 6
scene.add(octahedronMesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100)
camera.position.set(0, 0.05, 0.45)

window.cam = camera
scene.add(camera)

// Controls
let controls = null
if (isDebug) {
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
}

// Helpers
// scene.add(new THREE.AxesHelper())

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    gridMaterial.uniforms.uTime.value = elapsedTime

    octahedronMesh.rotation.y = elapsedTime
    octahedronMesh.rotation.z = elapsedTime

    controls?.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()