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
    camera.position.set(0, 0.5, 1.5);

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
    
    console.log('Canvas size:', canvas.clientWidth, 'x', canvas.clientHeight);
    console.log('Camera position:', camera.position);

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

    // Load the BAG model
    const loadModel = async () => {
      try {
        // Use a more compatible import method
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const loader = new GLTFLoader();
        
        // Load the BAG model from public directory
        const gltf = await loader.loadAsync('/BAG.glb');
        model = gltf.scene;
        
        // Scale and position the model
        model.scale.setScalar(10);
        model.position.set(0, -0.15, 0);
        
        // Enable shadows
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        scene.add(model);
        console.log('BAG model loaded successfully');
      } catch (error) {
        console.error('Error loading BAG model:', error);
        // Fallback: create a simple geometry
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x8b5cf6,
          transparent: true,
          opacity: 0.9
        });
        model = new THREE.Mesh(geometry, material);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        console.log('Using fallback geometry');
      }
    };
    
    loadModel();

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
