// 1. Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);  // Dark background for better visibility
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Create a 3D organic "fleshy" form (not a perfect sphere)
const geometry = new THREE.SphereGeometry(5, 64, 64);  // Sphere geometry with enough segments for flexibility
const material = new THREE.MeshPhongMaterial({
  color: 0xF1C27D,  // Flesh-like color (light peach)
  shininess: 10,  // Soft shiny effect for a fleshy look
  emissive: 0x111111,  // Slight emissive glow for the "living" look
  specular: 0x333333,
  transparent: true,
  opacity: 0.8
});
const agarSheet = new THREE.Mesh(geometry, material);
scene.add(agarSheet);

// 3. Add lighting for the fleshy material to look realistic
const ambientLight = new THREE.AmbientLight(0x555555);  // Soft ambient light
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);  // Point light to illuminate the form
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 4. Position the camera to view the "fleshy" form
camera.position.set(0, 0, 10);  // Camera is far enough to view the form
camera.lookAt(0, 0, 0);  // Make sure the camera is facing the center of the form

// 5. Set up Web Audio API for sound input (ambient soundscape)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const microphone = navigator.mediaDevices.getUserMedia({ audio: true });

microphone.then(function(stream) {
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  analyser.fftSize = 256;  // Number of frequency bins for the analyser
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Create some ambient noise generator when the user enters the site
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate); // 2 seconds of sound
  const noiseData = buffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1; // White noise
  }
  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;
  noiseSource.connect(audioContext.destination);
  noiseSource.start();

  // 6. Animate the organic shape based on sound input
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
