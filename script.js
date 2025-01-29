// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);  // Light gray background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Create the 3D object (a sphere for now)
const geometry = new THREE.SphereGeometry(5, 32, 32);  // Sphere with 32 segments
const material = new THREE.MeshBasicMaterial({
  color: 0xcccccc,  // Gray color for the material
  wireframe: true    // Wireframe view to show structure (can be turned off for solid view)
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 3. Position the camera
camera.position.z = 15;

// 4. Mouse movement handling
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;

// Update mouse position when the user moves the mouse
window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;  // Normalized between -1 and 1
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;  // Normalized between -1 and 1
});

// 5. Animate the sphere (based on mouse movement)
function animate() {
  requestAnimationFrame(animate);

  // Get the vertices from the sphere geometry
  const positions = sphere.geometry.attributes.position.array;

  // Calculate how much the sphere should deform based on mouse position
  const deformationFactor = mouseX * 2;  // This will control the amount of deformation

  // Deform the sphere based on mouseX
  for (let i = 0; i < positions.length; i += 3) {
    const dist = Math.sqrt(positions[i] * positions[i] + positions[i + 1] * positions[i + 1] + positions[i + 2] * positions[i + 2]);
    const scaleFactor = 1 + Math.sin(dist * 2 + Date.now() * 0.001) * 0.2;  // Make it more organic
    positions[i] *= scaleFactor * deformationFactor;  // Adjust x-coordinate
    positions[i + 1] *= scaleFactor * deformationFactor;  // Adjust y-coordinate
    positions[i + 2] *= scaleFactor * deformationFactor;  // Adjust z-coordinate
  }

  // Mark the position attribute as needing an update
  sphere.geometry.attributes.position.needsUpdate = true;

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();

// 6. Handle window resizing
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
