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

    // Camera setup - optimized for mobile
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0.3, 1.2);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(300, 300); // Fixed size for mobile
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
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

    // Load the BAG model
    const loadModel = async () => {
      try {
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const loader = new GLTFLoader();
        
        const modelUrl = 'https://raw.githubusercontent.com/jaxnalia/bag-ventures/main/src/lib/images/BAG.glb';
        const gltf = await loader.loadAsync(modelUrl);
        
        model = gltf.scene;
        model.scale.setScalar(8); // Smaller scale for mobile
        model.position.set(0, -0.2, 0);
        model.rotation.y = (160 * Math.PI) / 180; // Start rotated 160 degrees
        
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        scene.add(model);
      } catch (error) {
        // Fallback: create a simple geometry
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x8b5cf6,
          transparent: true,
          opacity: 0.9
        });
        model = new THREE.Mesh(geometry, material);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
      }
    };
    
    loadModel();

    // Animation loop
    function animate() {
      animationId = requestAnimationFrame(animate);
      
      if (model) {
        model.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  });
</script>

<canvas bind:this={canvas} class="w-full h-full flex justify-center items-center rounded-2xl"></canvas>

<style>
  canvas {
    background: transparent;
    width: 300px;
    height: 300px;
  }
</style>
