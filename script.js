// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Load the texture properly (ensures rendering happens after it's fully loaded)
const textureLoader = new THREE.TextureLoader();
textureLoader.load('https://raw.githubusercontent.com/Leo00rou/MicroCatcher-LL/refs/heads/main/AgarCircleTexture.JPG', function(texture) {
    
    // 3. Create sphere geometry
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    
    // Convert to BufferGeometry for better performance
    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    
    // Save vertex positions for later modifications
    const positionAttribute = bufferGeometry.attributes.position;
    const originalVertices = new Float32Array(positionAttribute.array);

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.3,
        metalness: 0.2,
        roughness: 0.7
    });

    const sphere = new THREE.Mesh(bufferGeometry, material);
    scene.add(sphere);

    // 4. Add lighting
    const light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(10, 10, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    // 5. Position the camera
    camera.position.z = 10;

    // 6. Variables for rotation & bump intensity
    let rotationSpeed = 0.002;
    let bumpIntensity = 0.3;

    // 7. Function to update vertex positions for bump effect
    function applyBumpEffect(intensity) {
        const vertices = positionAttribute.array;
        for (let i = 0; i < vertices.length; i += 3) {
            let x = originalVertices[i];
            let y = originalVertices[i + 1];
            let z = originalVertices[i + 2];

            let noise = (Math.sin(x * 3) + Math.cos(y * 3) + Math.sin(z * 3)) * intensity;

            vertices[i] = x + noise * 0.2;
            vertices[i + 1] = y + noise * 0.2;
            vertices[i + 2] = z + noise * 0.2;
        }
        positionAttribute.needsUpdate = true;
    }

    // Apply initial bump effect
    applyBumpEffect(bumpIntensity);

    // 8. Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Slowly rotate sphere in all directions
        sphere.rotation.y += rotationSpeed;
        sphere.rotation.x += rotationSpeed * 0.5;
        sphere.rotation.z += rotationSpeed * 0.2; // Subtle wobble effect

        renderer.render(scene, camera);
    }

    // 9. Start animation
    animate();

    // 10. Mouse move interaction to control bumpiness
    window.addEventListener("mousemove", (event) => {
        let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        bumpIntensity = 0.3 + mouseX * 0.5; // Adjust bump intensity dynamically
        applyBumpEffect(bumpIntensity);
    });

    // 11. Handle window resizing
    window.addEventListener("resize", function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

});
