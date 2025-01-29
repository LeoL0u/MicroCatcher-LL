// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://raw.githubusercontent.com/Leo00rou/MicroCatcher-LL/refs/heads/main/AgarCircleTexture.JPG');

// 3. Create a base sphere geometry
const geometry = new THREE.SphereGeometry(5, 64, 64);
const vertices = geometry.attributes.position.array;

// 4. Function to update vertex positions for bump effect
function applyBumpEffect(intensity) {
    for (let i = 0; i < vertices.length; i += 3) {
        let x = vertices[i];
        let y = vertices[i + 1];
        let z = vertices[i + 2];

        let noise = (Math.sin(x * 3) + Math.cos(y * 3) + Math.sin(z * 3)) * intensity;

        vertices[i] = x + x * noise * 0.1;
        vertices[i + 1] = y + y * noise * 0.1;
        vertices[i + 2] = z + z * noise * 0.1;
    }
    geometry.attributes.position.needsUpdate = true;
}

// 5. Apply initial bumpiness
applyBumpEffect(0.3);

// 6. Create the material and mesh
const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.3,
    metalness: 0.2,
    roughness: 0.7
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 7. Add lighting
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// 8. Position the camera
camera.position.z = 10;

// 9. Variables for rotation & bump effect intensity
let rotationSpeed = 0.001; // Slow rotation speed
let bumpIntensity = 0.3;

// 10. Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Apply slow automatic rotation
    sphere.rotation.y += rotationSpeed;

    renderer.render(scene, camera);
}

// 11. Start animation
animate();

// 12. Mouse move interaction to control bumpiness
window.addEventListener("mousemove", (event) => {
    let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    bumpIntensity = 0.3 + mouseX * 0.5; // Adjust bump intensity
    applyBumpEffect(bumpIntensity);
});

// 13. Handle window resizing
window.addEventListener("resize", function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
