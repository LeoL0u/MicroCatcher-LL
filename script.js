// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('path_to_your_image/DSC09421.JPG'); // Change to the correct path of your image

// 3. Create a sphere geometry (this will represent the agar plastic sheet)
const geometry = new THREE.SphereGeometry(5, 32, 32); // A sphere with radius 5

// Apply the texture to the material
const material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 4. Position the camera
camera.position.z = 10; // Position the camera to look at the sphere

// 5. Function to animate the sphere based on mouse movement
function animate() {
    requestAnimationFrame(animate);

    // Deform the sphere based on mouse movement
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Get mouse position in normalized space (-1 to 1)
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Get mouse position in normalized space (-1 to 1)

    // Map mouse position to deformation
    sphere.scale.x = 1 + mouseX * 0.5;
    sphere.scale.y = 1 + mouseY * 0.5;

    // Render the scene
    renderer.render(scene, camera);
}

// 6. Add event listener for mouse movement
window.addEventListener('mousemove', (event) => {
    animate();
});

// 7. Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
