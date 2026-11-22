/**
 * Lab: Three.js JP 3D particle system.
 * Lazy-loaded when the Lab frame is near the viewport or on poster click.
 * Monochrome wireframe aesthetic matching the site design.
 *
 * Performance: pixel ratio capped at 2, no postprocessing, disposed on leave.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface LabConfig {
  container: HTMLElement;
  poster: HTMLElement;
}

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: OrbitControls | null = null;
let particles: THREE.Points | null = null;
let animationId = 0;
let isActive = false;

function getThemeColors(): { bg: string; fg: string; fgFloat: number[] } {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    bg: isDark ? '#111111' : '#fafafa',
    fg: isDark ? '#f0f0f0' : '#111111',
    fgFloat: isDark ? [0.94, 0.94, 0.94] : [0.067, 0.067, 0.067],
  };
}

function sampleJP3D(count: number): Float32Array {
  const canvas2d = document.createElement('canvas');
  const size = 256;
  canvas2d.width = size;
  canvas2d.height = size;
  const ctx = canvas2d.getContext('2d');
  if (!ctx) return new Float32Array(0);

  ctx.fillStyle = '#000';
  ctx.font = `bold ${size * 0.6}px 'Space Grotesk', system-ui`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JP', size / 2, size / 2);

  const imageData = ctx.getImageData(0, 0, size, size);
  const pixels = imageData.data;
  const positions: number[] = [];

  const step = Math.max(1, Math.floor(size / Math.sqrt(count)));

  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const idx = (y * size + x) * 4;
      if (pixels[idx + 3] > 128) {
        const nx = (x / size - 0.5) * 10;
        const ny = -(y / size - 0.5) * 10;
        const nz = (Math.random() - 0.5) * 2;
        positions.push(nx, ny, nz);
      }
    }
  }

  // Pad to desired count with scattered particles around the shape
  while (positions.length / 3 < count) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 4;
    positions.push(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 8,
      Math.sin(angle) * radius,
    );
  }

  return new Float32Array(positions.slice(0, count * 3));
}

function createParticleSystem(colors: { fgFloat: number[] }): THREE.Points {
  const count = 2000;
  const positions = sampleJP3D(count);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Create sizes for variation
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    sizes[i] = 1 + Math.random() * 2;
  }
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: new THREE.Color(colors.fgFloat[0], colors.fgFloat[1], colors.fgFloat[2]),
    size: 0.08,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

function createWireframeAccents(colors: { fgFloat: number[] }): THREE.Group {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(colors.fgFloat[0], colors.fgFloat[1], colors.fgFloat[2]),
    transparent: true,
    opacity: 0.15,
  });

  // Enclosing box wireframe
  const boxGeometry = new THREE.BoxGeometry(12, 8, 4);
  const edges = new THREE.EdgesGeometry(boxGeometry);
  const wireframe = new THREE.LineSegments(edges, material);
  group.add(wireframe);

  // Orbital ring
  const ringGeometry = new THREE.RingGeometry(6, 6.05, 64);
  const ringEdges = new THREE.EdgesGeometry(ringGeometry);
  const ring = new THREE.LineSegments(ringEdges, material.clone());
  ring.rotation.x = Math.PI * 0.4;
  group.add(ring);

  return group;
}

function animate(): void {
  if (!isActive || !renderer || !scene || !camera || !controls) return;

  controls.update();

  // Gentle auto-rotation
  if (particles) {
    particles.rotation.y += 0.001;
  }

  renderer.render(scene, camera);
  animationId = requestAnimationFrame(animate);
}

function updateColors(): void {
  if (!scene || !renderer || !particles) return;
  const colors = getThemeColors();

  renderer.setClearColor(new THREE.Color(colors.bg));
  (particles.material as THREE.PointsMaterial).color.setRGB(
    colors.fgFloat[0],
    colors.fgFloat[1],
    colors.fgFloat[2],
  );
}

function handleResize(container: HTMLElement): void {
  if (!camera || !renderer) return;
  const rect = container.getBoundingClientRect();
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  renderer.setSize(rect.width, rect.height);
}

function dispose(): void {
  isActive = false;
  cancelAnimationFrame(animationId);

  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
    renderer = null;
  }

  if (scene) {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    scene = null;
  }

  controls?.dispose();
  controls = null;
  camera = null;
  particles = null;
}

export function initLab(config: LabConfig): void {
  dispose();

  const { container, poster } = config;
  const rect = container.getBoundingClientRect();
  const colors = getThemeColors();

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(new THREE.Color(colors.bg).getHex(), 0.06);

  // Camera
  camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 100);
  camera.position.set(0, 2, 12);

  // Renderer
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch {
    return; // WebGL not supported
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(rect.width, rect.height);
  renderer.setClearColor(new THREE.Color(colors.bg));
  container.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 5;
  controls.maxDistance = 25;
  controls.autoRotate = false;
  controls.enablePan = false;

  // Particles
  particles = createParticleSystem(colors);
  scene.add(particles);

  // Wireframe accents
  const accents = createWireframeAccents(colors);
  scene.add(accents);

  // Ambient light (subtle)
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  // Hide poster
  poster.classList.add('is-hidden');

  // Start
  isActive = true;
  animate();

  // Resize handling
  const resizeObserver = new ResizeObserver(() => handleResize(container));
  resizeObserver.observe(container);

  // Theme change handling
  const observer = new MutationObserver(updateColors);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}

// Lazy loading: triggered by IntersectionObserver or poster click
function setupLazyLoad(): void {
  const mount = document.querySelector<HTMLElement>('[data-lab-mount]');
  const poster = document.querySelector<HTMLElement>('[data-lab-poster]');
  if (!mount || !poster) return;

  let loaded = false;

  const load = (): void => {
    if (loaded) return;

    // Check if reduced motion or no WebGL
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) return;

    loaded = true;
    initLab({ container: mount, poster });
  };

  // Click trigger
  poster.addEventListener('click', load);

  // Intersection observer trigger
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        load();
        observer.disconnect();
      }
    },
    { rootMargin: '200px' },
  );
  observer.observe(mount);
}

setupLazyLoad();
document.addEventListener('astro:after-swap', setupLazyLoad);
