// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);  // Dark background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Create an organic shape (not a circle, but more of a freeform shape)
const geometry = new THREE.PlaneGeometry(5, 5, 64, 64); // A plane with segments for flexibility
const material = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,  // White color
  transparent: true,
  opacity: 0.5,  // Semi-transparent
  wireframe: true  // Wireframe for visibility
});
const agarSheet = new THREE.Mesh(geometry, material);
scene.add(agarSheet);

// 3. Add lighting to the scene
const light = new THREE.PointLight(0xffffff, 0.5, 100);
light.position.set(10, 10, 10);
scene.add(light);

// 4. Position the camera to view the agar sheet
camera.position.set(0, 0, 10);  // Camera further away
camera.lookAt(0, 0, 0);  // Ensure camera faces the center

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

  // 6. Set up animation with sound reactivity
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);

    analyser.getByteFrequencyData(dataArray);  // Get frequency data from the microphone

    // Calculate the average frequency intensity
    const averageFrequency = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const soundFactor = averageFrequency / 255;  // Normalize the sound data (0-1 range)

    // Distort the vertices of the shape to create an organic movement effect
    const vertices = agarSheet.geometry.attributes.position.array;

    // Apply sine wave distortion to the vertices, using sound intensity (soundFactor) to influence the movement
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];

      // Distort the vertices based on sound factor, and use sine/cosine for organic movement
      vertices[i] += Math.sin(time * 0.01 + x * 2) * 0.1 * soundFactor; // Distort x coordinates
      vertices[i + 1] += Math.cos(time * 0.01 + y * 2) * 0.1 * soundFactor; // Distort y coordinates
    }

    agarSheet.geometry.attributes.position.needsUpdate = true;  // Update the geometry

    // Rotate the shape slightly to make the animation more fluid
    agarSheet.rotation.z += 0.01;

    time += 1;  // Increment time for smooth animation

    // Render the scene
    renderer.render(scene, camera);
  }

  // Start the animation
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
