// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Set up texture loader and load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://raw.githubusercontent.com/Leo00rou/MicroCatcher-LL/refs/heads/main/AgarCircleTexture.JPG');
const bumpMap = textureLoader.load('https://raw.githubusercontent.com/Leo00rou/MicroCatcher-LL/refs/heads/main/AgarCircleTexture.JPG'); // Bump map for texture shading

// 3. Create a BufferGeometry for the sphere and a material with bump mapping
const geometry = new THREE.SphereBufferGeometry(5, 64, 64); // BufferGeometry version of the sphere
const material = new THREE.MeshPhongMaterial({
  map: texture, // Apply the texture
  bumpMap: bumpMap, // Apply the bump map for texture shading
  bumpScale: 0.2, // Control the strength of the bump effect
  wireframe: false, // To show the texture as a solid form
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 4. Set up basic lighting to see the texture and bump map effects
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// 5. Position the camera
camera.position.z = 10; // Move camera back to see the sphere

// 6. Modify geometry to apply an initial wavy surface effect
function applyInitialDeformation() {
  const positions = sphere.geometry.attributes.position.array; // Access the position array of BufferGeometry
  const time = performance.now() * 0.001; // Time-based factor to animate the deformation
  
  // Iterate through each vertex and apply a wave effect
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    
    const distance = Math.sqrt(x * x + y * y + z * z); // Distance from the center for a more fluid effect
    
    // Apply a smooth sine-based deformation for the initial wavy look
    positions[i] += Math.sin(distance + time) * 0.5; // X-axis deformation
    positions[i + 1] += Math.sin(distance + time) * 0.5; // Y-axis deformation
    positions[i + 2] += Math.cos(distance + time) * 0.5; // Z-axis deformation
  }
  
  // Mark the geometry to update its position data
  sphere.geometry.attributes.position.needsUpdate = true;
}

// 7. Set up mouse interaction for further deformation
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalized mouse position (X-axis)
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Normalized mouse position (Y-axis)
});

// 8. Modify geometry dynamically based on mouse movement
function applyMouseDeformation() {
  const positions = sphere.geometry.attributes.position.array;
  const time = performance.now() * 0.001;
  
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    
    const distance = Math.sqrt(x * x + y * y + z * z);
    
    // Add mouse interaction to amplify the wave deformation based on mouse position
    positions[i] += Math.sin(distance + time + mouseX * 5) * 0.2; // X-axis deformation
    positions[i + 1] += Math.sin(distance + time + mouseY * 5) * 0.2; // Y-axis deformation
    positions[i + 2] += Math.cos(distance + time + mouseX * mouseY) * 0.2; // Z-axis deformation
  }

  // Mark the geometry to update its position data
  sphere.geometry.attributes.position.needsUpdate = true;
}

// 9. Animate the scene
function animate() {
  requestAnimationFrame(animate);

  // Apply initial wavy deformation
  applyInitialDeformation();

  // Apply mouse-based deformation (dynamic interaction)
  applyMouseDeformation();

  // Rotate the sphere for some dynamic effect
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
}

// 10. Start animation
animate();

// 11. Handle window resizing
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
