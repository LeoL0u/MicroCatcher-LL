// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Load the texture for the sphere
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://raw.githubusercontent.com/Leo00rou/MicroCatcher-LL/refs/heads/main/AgarCircleTexture.JPG');

// 3. Create a base sphere geometry
const geometry = new THREE.SphereGeometry(5, 64, 64); // Increased detail for a smoother bump effect

// 4. Modify the vertices to make the surface bumpy
const positionAttribute = geometry.attributes.position;
const vertex = new THREE.Vector3();

for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);
    
    // Add a random noise factor for an organic look
    const noise = (Math.sin(vertex.x * 2) + Math.cos(vertex.y * 2) + Math.sin(vertex.z * 2)) * 0.3;
    
    vertex.addScaledVector(vertex.clone().normalize(), noise); // Push outwards slightly
    
    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
}

geometry.attributes.position.needsUpdate = true;

// 5. Create the material and mesh
const material = new THREE.MeshPhongMaterial({
    map: texture, // Apply the texture
    bumpMap: texture, // Add bump mapping for extra surface detail
    bumpScale: 0.2, // Control the bump intensity
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 6. Add lighting to highlight the texture and bumps
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

// 7. Position the camera
camera.position.z = 10;

// 8. Animation loop
function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.01; // Rotate slowly for better visibility
    renderer.render(scene, camera);
}

// 9. Start animation
animate();

// 10. Handle window resizing
window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
