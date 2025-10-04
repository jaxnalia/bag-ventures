<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let canvas: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let model: THREE.Object3D;
  let animationId: number;

  onMount(() => {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = null; // Transparent background

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0.3, 1);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 0.8, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xec4899, 0.8, 100);
    pointLight2.position.set(5, -5, -5);
    scene.add(pointLight2);

    // Create a simple rotating geometry as placeholder
    // This avoids the GLTFLoader import issues in production builds
    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.8
    });
    model = new THREE.Mesh(geometry, material);
    model.castShadow = true;
    model.receiveShadow = true;
    scene.add(model);
    console.log('Using 3D placeholder geometry');

    // Animation loop
    function animate() {
      animationId = requestAnimationFrame(animate);
      
      // Rotate the model slowly - only horizontally (Y-axis)
      if (model) {
        model.rotation.y += 0.005;
        // Remove X-axis rotation to keep it horizontal only
      }
      
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const handleResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  });
</script>

<canvas bind:this={canvas} class="w-full h-full rounded-2xl"></canvas>

<style>
  canvas {
    background: transparent;
  }
</style>
