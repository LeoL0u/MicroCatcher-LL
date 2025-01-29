// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);  // Dark background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Create an organic "Agar sheet" (circle shape)
const geometry = new THREE.CircleGeometry(5, 64);  // Radius of 5, 64 segments for smoothness
const material = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,  // White color
  transparent: true,
  opacity: 0.5,  // Semi-transparent
  wireframe: false  // Without wireframe
});
const agarSheet = new THREE.Mesh(geometry, material);
scene.add(agarSheet);

// 3. Add lighting for visibility
const light = new THREE.PointLight(0xffffff, 0.5, 100);  // Dim point light
light.position.set(10, 10, 10);
scene.add(light);

// 4. Position the camera to view the agar sheet
camera.position.set(0, 0, 10);  // Camera further away
camera.lookAt(0, 0, 0);  // Ensure camera faces the center

// 5. Set up animation (organic shape movement)
let time = 0;

function animate() {
  requestAnimationFrame(animate);

  // Distort the geometry to create an organic movement effect
  const vertices = agarSheet.geometry.attributes.position.array;

  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    
    // Apply sine wave distortion to the vertices to create fluid movement
    vertices[i] += Math.sin(time * 0.002 + x * 2) * 0.1; // Distort x coordinates
    vertices[i + 1] += Math.cos(time * 0.002 + y * 2) * 0.1; // Distort y coordinates
  }

  agarSheet.geometry.attributes.position.needsUpdate = true;  // Update the geometry

  // Make the shape rotate a little for a more fluid look
  agarSheet.rotation.z += 0.01;  // Slow rotation for fluid movement

  time += 1;  // Increment time for smooth animation

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation
animate();

// 6. Handle window resizing
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
