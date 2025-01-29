// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('DSC09421.JPG'); // Change to the correct path of your image

// 3. Create a sphere geometry (this will represent the agar plastic sheet)
const geometry = new THREE.SphereGeometry(5, 32, 32); // A sphere with radius 5

// Apply the texture to the material (using MeshStandardMaterial for realistic shading)
const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7, metalness: 0.3 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 4. Position the camera
camera.position.z = 10; // Position the camera to look at the sphere

// 5. Function to animate the sphere based on mouse movement
function animate(event) {
    requestAnimationFrame(animate);

    // Get mouse position in normalized space (-1 to 1)
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Deform the sphere by modifying its vertices
    const positions = sphere.geometry.attributes.position.array;  // Get the sphere's vertex positions

    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        // Apply some deformation based on mouse position
        // Adjust these numbers for different effects
        positions[i] += (mouseX * 0.1); // X deformation
        positions[i + 1] += (mouseY * 0.1); // Y deformation
        positions[i + 2] += (Math.sin(mouseX * 10) * 0.1); // Z deformation for depth (creates a more organic feel)
    }

    // After modifying the vertex positions, notify Three.js that the geometry has changed
    sphere.geometry.attributes.position.needsUpdate = true;

    // Render the scene
    renderer.render(scene, camera);
}

// 6. Add event listener for mouse movement
window.addEventListener('mousemove', (event) => {
    animate(event);
});

// 7. Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
