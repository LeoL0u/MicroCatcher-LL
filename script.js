// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Set up texture loader and load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://raw.githubusercontent.com/Leo00rou/MicroCatcher-LL/refs/heads/main/AgarCircleTexture.JPG');

// 3. Create a BufferGeometry for the sphere and a material
const geometry = new THREE.SphereBufferGeometry(5, 64, 64); // BufferGeometry version of the sphere
const material = new THREE.MeshBasicMaterial({
  map: texture,
  wireframe: false, // To show the texture as a solid form
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 4. Position the camera
camera.position.z = 10; // Move camera back to see the sphere

// 5. Set up mouse interaction for deformation
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalized mouse position (X-axis)
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Normalized mouse position (Y-axis)
});

// 6. Modify geometry using BufferGeometry
function applyDeformation() {
  const positions = sphere.geometry.attributes.position.array; // Access the position array of BufferGeometry
  
  for (let i = 0; i < positions.length; i += 3) {
    // Get the x, y, z coordinates of each vertex
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    
    // Calculate the distance from the center to apply some kind of deformation
    const distance = Math.sqrt(x * x + y * y + z * z);

    // Apply sine wave-based deformation based on distance and mouse position
    positions[i] += Math.sin(distance + mouseX * 2) * 0.1;
    positions[i + 1] += Math.sin(distance + mouseY * 2) * 0.1;
    positions[i + 2] += Math.cos(distance + mouseX * mouseY) * 0.1;
  }

  // Mark the geometry to update its position data
  sphere.geometry.attributes.position.needsUpdate = true;
}

// 7. Animate the scene
function animate() {
  requestAnimationFrame(animate);

  // Apply deformation based on mouse movement
  applyDeformation();

  // Rotate the sphere for some dynamic effect
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
}

// 8. Start animation
animate();

// 9. Handle window resizing
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
