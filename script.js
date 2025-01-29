// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Set up texture loader and load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://raw.githubusercontent.com/Leo00rou/MicroCatcher-LL/refs/heads/main/AgarCircleTexture.JPG');

// 3. Create a smooth sphere geometry (base)
const geometry = new THREE.SphereGeometry(5, 64, 64);
const material = new THREE.MeshPhongMaterial({
  map: texture, // Apply the texture
  wireframe: false, // To show the texture as a solid form
  bumpScale: 0.2, // Control the strength of the bump effect
});

// Create a mesh with the smooth sphere geometry
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 4. Create a morphed sphere with a bumpy surface as a morph target
const morphedGeometry = new THREE.SphereGeometry(5, 64, 64);

// Apply the "bumpy" effect on the morphed geometry
const positions = morphedGeometry.attributes.position.array;
for (let i = 0; i < positions.length; i += 3) {
  const x = positions[i];
  const y = positions[i + 1];
  const z = positions[i + 2];
  
  const distance = Math.sqrt(x * x + y * y + z * z); // Distance from the center

  // Apply bump by modifying the positions based on distance from the center
  positions[i] += Math.sin(distance * 2) * 0.5; // X-axis bump
  positions[i + 1] += Math.sin(distance * 2) * 0.5; // Y-axis bump
  positions[i + 2] += Math.cos(distance * 2) * 0.5; // Z-axis bump
}

morphedGeometry.attributes.position.needsUpdate = true;

// 5. Set the morph targets for the sphere mesh
sphere.geometry.morphAttributes.position = [morphedGeometry.attributes.position];

// 6. Set up basic lighting to see the texture and bump map effects
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// 7. Position the camera
camera.position.z = 10;

// 8. Set up mouse interaction to morph the sphere over time
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalized mouse position (X-axis)
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Normalized mouse position (Y-axis)
});

// 9. Animate the scene with morphing effect
let morphTargetInfluence = 0; // Control the morph target blending

function animate() {
  requestAnimationFrame(animate);

  // Calculate morph target influence based on mouse position
  morphTargetInfluence = Math.abs(mouseX); // Influence increases as you move the mouse on X-axis

  // Apply the morph target influence to the sphere mesh
  sphere.morphTargetInfluences[0] = morphTargetInfluence;

  // Rotate the sphere for dynamic effect
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
