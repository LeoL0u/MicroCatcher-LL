import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

let scene, camera, renderer, plane, clock;

function init() {
    // Create Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    // Plane Geometry (Agar Sheet)
    let geometry = new THREE.PlaneGeometry(5, 3, 100, 100); // More subdivisions for smooth deformation
    let material = new THREE.ShaderMaterial({
        vertexShader: `
            uniform float time;
            varying vec2 vUv;

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }

            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
                           mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
            }

            void main() {
                vUv = uv;
                vec3 pos = position;
                float n = noise(uv * 3.0 + time * 0.2);
                pos.z += sin(n * 10.0) * 0.2;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;

            void main() {
                vec3 color = mix(vec3(0.8, 0.3, 0.5), vec3(0.2, 0.8, 0.7), vUv.y);
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        uniforms: {
            time: { value: 0 }
        },
        wireframe: false
    });

    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    window.addEventListener("resize", onWindowResize, false);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    plane.material.uniforms.time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
