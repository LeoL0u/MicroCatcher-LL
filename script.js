<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Point Cloud Landscape</title>
  <style>
    body { margin: 0; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>

<script src="https://cdn.jsdelivr.net/npm/three@0.130.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.130.0/examples/jsm/loaders/GLTFLoader.js"></script>

<script>
  // 1. Set up the scene, camera, and renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);  // Dark background

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 2. Set up the lighting (simple ambient light)
  const light = new THREE.AmbientLight(0x404040, 1);  // Ambient light
  scene.add(light);

  // 3. Load the 3D point cloud model (landscape)
  const loader = new THREE.GLTFLoader();
  loader.load('https://raw.githubusercontent.com/Leo00rou/MicroCatcher-LL/main/landscape.glb', (gltf) => {
    const model = gltf.scene;

    // Optionally, apply a point material to the model
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.PointsMaterial({ 
          color: 0x00ff00,  // Green color for the points
          size: 0.05,  // Point size
          opacity: 0.8,  // Transparency level
          transparent: true
        });
      }
    });

    scene.add(model);

    // 4. Rotate the model on the z-axis over time
    function animate() {
      requestAnimationFrame(animate);

      model.rotation.z += 0.001;  // Slowly rotate on z-axis

      // Render the scene from the camera's perspective
      renderer.render(scene, camera);
    }

    animate();
  });

  // 5. Position the camera
  camera.position.z = 5;

  // 6. Handle window resizing
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
</script>

</body>
</html>
