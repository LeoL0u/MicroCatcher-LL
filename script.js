// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);  // Darker background color
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Create a circular agar sheet
const geometry = new THREE.CircleGeometry(5, 64);  // The radius is 5, and 64 segments for smoothness
const material = new THREE.MeshBasicMaterial({ 
  color: 0xFFFFFF,  // Set the color to white or any desired color
  transparent: true, 
  opacity: 0.5,  // Adjust opacity to make it translucent
  wireframe: false  // Optional: remove the wireframe
});
const agarSheet = new THREE.Mesh(geometry, material);
scene.add(agarSheet);

// 3. Adjust lighting (remove ambient light or make it darker)
const light = new THREE.PointLight(0xffffff, 0.5, 100);  // Dim point light for visibility
light.position.set(10, 10, 10);
scene.add(light);

// 4. Position the camera
camera.position.set(0, 0, 10);  // Position the camera farther away
camera.lookAt(0, 0, 0);         // Make sure the camera is facing the center

// 5. Set up Web Audio API for sound input
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const microphone = navigator.mediaDevices.getUserMedia({ audio: true });

microphone.then(function(stream) {
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  analyser.fftSize = 256;  // Number of frequency bins for the analyser
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // 6. Animate the agar sheet based on sound input
  let rotationSpeed = 0.01;
  let movementSpeed = 0.002;

  function animate() {
    requestAnimationFrame(animate);

    analyser.getByteFrequencyData(dataArray);

    // Map the sound data to movement
    const averageFrequency = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const movementFactor = averageFrequency / 256;  // Normalize the sound data

    // Add organic movement to the agar sheet (rotate and move based on sound)
    agarSheet.rotation.x += rotationSpeed * movementFactor;
    agarSheet.rotation.y += rotationSpeed * movementFactor;

    // Use sine wave oscillation for fluid movement
    agarSheet.position.x = Math.sin(Date.now() * movementSpeed) * movementFactor;
    agarSheet.position.y = Math.cos(Date.now() * movementSpeed) * movementFactor;

    // Create a subtle feedback interaction (size change based on sound)
    agarSheet.scale.set(1 + movementFactor * 0.5, 1 + movementFactor * 0.5, 1);

    // Render the scene
    renderer.render(scene, camera);
  }

  animate();
}).catch(function(error) {
  console.log('Error accessing microphone:', error);
});

// 7. Handle window resizing
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
