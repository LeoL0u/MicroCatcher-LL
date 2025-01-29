// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Set up texture loader and load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://raw.githubusercontent.com/Leo00rou/MicroCatcher-LL/refs/heads/main/AgarCircleTexture.JPG');

// 3. Create a sphere geometry and material
const geometry = new THREE.SphereGeometry(5, 64, 64); // Sphere with segments
const material = new THREE.MeshBasicMaterial({
  map: texture,
  wireframe: false // Turn off wireframe for solid texture appearance
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

// 6. Animate the scene
function animate() {
  requestAnimationFrame(animate);

  // Deform the sphere based on mouse position
  sphere.scale.x = 1 + mouseX * 0.5;  // Stretch or compress in X axis
  sphere.scale.y = 1 + mouseY * 0.5;  // Stretch or compress in Y axis
  sphere.scale.z = 1 + (mouseX + mouseY) * 0.25; // Slight Z-axis deformation

  // Rotate the sphere slightly to give some dynamic effect
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
}

// 7. Start animation
animate();

// 8. Handle window resizing
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
