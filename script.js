// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);  // Set a light gray background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Load the texture (agar bioplastic)
const textureLoader = new THREE.TextureLoader();
const agarTexture = textureLoader.load(
  'https://github.com/Leo00rou/MicroCatcher-LL/raw/main/DSC09421.JPG',  // Use raw URL of the image
  () => {
    console.log('Texture loaded successfully');
  },
  (error) => {
    console.error('Error loading texture', error);
  }
);

// 3. Create the agar sheet geometry and apply the texture
const geometry = new THREE.PlaneGeometry(5, 5, 32, 32); // A plane instead of a sphere for more control
const material = new THREE.MeshBasicMaterial({
  map: agarTexture,  // Apply the agar texture
  transparent: true,
  opacity: 0.8,  // Adjust the opacity if needed
  side: THREE.DoubleSide  // Make sure both sides of the plane are visible
});
const agarSheet = new THREE.Mesh(geometry, material);
scene.add(agarSheet);

// 4. Position the camera
camera.position.set(0, 0, 10);  // Position the camera on the z-axis
camera.lookAt(0, 0, 0);         // Make sure the camera is facing the center

// 5. Animate the agar sheet
function animate() {
  requestAnimationFrame(animate);

  const positions = agarSheet.geometry.attributes.position.array;
  
  // Apply a wave-like distortion to simulate the movement of the agar
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] = Math.sin(positions[i] * 0.5 + Date.now() * 0.001) * 0.5 + Math.cos(positions[i + 1] * 0.5 + Date.now() * 0.001) * 0.5;
  }

  // Update the geometry
  agarSheet.geometry.attributes.position.needsUpdate = true;

  // Render the scene
  renderer.render(scene, camera);
}

animate();

// 6. Handle window resizing
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
