// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);  // Dark background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Create a sphere geometry with a higher level of detail
const geometry = new THREE.SphereGeometry(3, 32, 32);  // Higher segments for smoothness
const material = new THREE.MeshStandardMaterial({
  color: 0xffc0c0,  // Flesh-like color
  emissive: 0x3b3b3b,  // Slight glow effect to simulate life
  roughness: 0.6,
  metalness: 0.2,
  wireframe: false  // No wireframe
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 3. Lighting for better visibility of the deformations
const light = new THREE.AmbientLight(0x404040, 1);  // Ambient light
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 4. Position the camera
camera.position.set(0, 0, 8);  // Position the camera a bit further
camera.lookAt(0, 0, 0);         // Make sure the camera is facing the center

// 5. Set up the Web Audio API for sound input
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const microphone = navigator.mediaDevices.getUserMedia({ audio: true });

microphone.then(function(stream) {
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  analyser.fftSize = 512;  // Increase resolution for more precise frequency data
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // 6. Function to apply sound-based deformation
  function applySoundDeformation() {
    analyser.getByteFrequencyData(dataArray);
    
    const averageFrequency = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const movementFactor = averageFrequency / 256;  // Normalize to a reasonable range

    // Apply the deformation in a smooth, organic way
    const vertices = sphere.geometry.vertices;
    for (let i = 0; i < vertices.length; i++) {
      const vertex = vertices[i];
      const displacement = Math.sin(vertex.x * 0.5 + performance.now() * 0.001) * movementFactor;

      // Gently push the vertices based on the sound's frequency
      vertex.x += displacement * 0.02;
      vertex.y += displacement * 0.02;
      vertex.z += displacement * 0.02;
    }
    
    sphere.geometry.verticesNeedUpdate = true;  // Update the geometry after deformation
  }

  // 7. Animation loop
  function animate() {
    requestAnimationFrame(animate);

    applySoundDeformation();  // Apply deformation based on sound input

    // Render the scene
    renderer.render(scene, camera);
  }

  animate();
}).catch(function(error) {
  console.log('Error accessing microphone:', error);
});

// 8. Resize handling
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
