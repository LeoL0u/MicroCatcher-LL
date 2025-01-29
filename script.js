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
const geometry = new THREE.SphereGeometry(5, 64, 64); // Higher detail sphere

// 4. Modify the vertices to create bumps
const vertices = geometry.attributes.position.array;
for (let i = 0; i < vertices.length; i += 3) {
    let x = vertices[i];
    let y = vertices[i + 1];
    let z = vertices[i + 2];

    // Apply a noise function for an organic feel
    let noise = (Math.sin(x * 3) + Math.cos(y * 3) + Math.sin(z * 3)) * 0.3;

    // Push outward to create bumps
    vertices[i] += x * noise * 0.1;
    vertices[i + 1] += y * noise * 0.1;
    vertices[i + 2] += z * noise * 0.1;
}
geometry.attributes.position.needsUpdate = true;

// 5. Create the material and mesh
const material = new THREE.MeshStandardMaterial({
    map: texture, // Apply the texture
    bumpMap: texture, // Use bump mapping for more details
    bumpScale: 0.3, // Increase bump intensity
    metalness: 0.2,
    roughness: 0.7
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 6. Add lighting to enhance visibility
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// 7. Position the camera
camera.position.z = 10;

// 8. Set up mouse interaction for deformation
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalized mouse position (X-axis)
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Normalized mouse position (Y-axis)
});

// 9. Animation loop (removes unnecessary errors)
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// 10. Start animation
animate();

// 11. Handle window resizing
window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
