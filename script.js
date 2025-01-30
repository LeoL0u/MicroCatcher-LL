// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = null;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('three-container');
renderer.setSize(container.clientWidth, container.clientHeight);
document.getElementById("three-container").appendChild(renderer.domElement);

// 2. Load the texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://raw.githubusercontent.com/Leo00rou/MicroCatcher-LL/refs/heads/main/AgarCircleTexture.JPG');

// 3. Create a base sphere geometry
const geometry = new THREE.SphereGeometry(5, 64, 64); // Higher detail sphere

// 4. Modify the vertices to create bumps
const vertices = geometry.attributes.position.array;
for (let i = 0; i < vertices.length; i += 3) {
    let x = vertices[i];
    let y = vertices[i + 1];
    let z = vertices[i + 2];

    let noise = (Math.sin(x * 3) + Math.cos(y * 3) + Math.sin(z * 3)) * 0.3;
    vertices[i] += x * noise * 0.1;
    vertices[i + 1] += y * noise * 0.1;
    vertices[i + 2] += z * noise * 0.1;
}
geometry.attributes.position.needsUpdate = true;

// 5. Create the material and mesh
const material = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.3,
    metalness: 0.1,
    roughness: 0.4,
    transparent: true,
    opacity: 0.8  // Adjust transparency level
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 6. Add lighting
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// 7. Position the camera
camera.position.z = 10;

// 8. Animation loop with rotation
function animate() {
    requestAnimationFrame(animate);

    console.log("Animating..."); // Debugging

    if (sphere) {
        sphere.rotation.y += 0.002;
        sphere.rotation.x += 0.001;
        console.log("Rotating Sphere:", sphere.rotation);
    } else {
        console.error("Sphere is not defined!");
    }

    renderer.render(scene, camera);
}

// 9. Start animation
console.log("Starting animation...");
animate();

// Store original positions of the sphere's vertices to revert to them
let originalVertices = geometry.attributes.position.array.slice();

// 10. Function to deform the sphere based on mouse position
function deformSphere(mouseX, mouseY) {
    const vertices = geometry.attributes.position.array;
    const intensity = 0.1; // Deformation intensity factor

    // Reset the geometry to original shape (without permanent changes)
    geometry.attributes.position.array.set(originalVertices);

    // Apply temporary deformation based on mouse position
    for (let i = 0; i < vertices.length; i += 3) {
        let x = vertices[i];
        let y = vertices[i + 1];
        let z = vertices[i + 2];

        // Apply deformation based on mouse position but with some intensity
        vertices[i] += x * mouseX * intensity;  // Deform along X-axis based on mouseX
        vertices[i + 1] += y * mouseY * intensity;  // Deform along Y-axis based on mouseY
    }

    // Update geometry after modification
    geometry.attributes.position.needsUpdate = true;
}

// Mouse move interaction to control deformation
window.addEventListener("mousemove", (event) => {
    let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Deform the sphere with mouse movement
    deformSphere(mouseX, mouseY);
});

// 10. Handle window resizing
window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Function to check if the screen is in portrait mode
function checkOrientation() {
    const rotationMessage = document.getElementById("rotation-message");

    if (window.innerHeight > window.innerWidth) {
        // Show the message if in portrait mode
        rotationMessage.style.display = "flex";
    } else {
        // Hide the message if in landscape mode
        rotationMessage.style.display = "none";
    }
}

// Run the function when the page loads
checkOrientation();

// Run the function whenever the screen is resized (e.g., when rotated)
window.addEventListener("resize", checkOrientation);
