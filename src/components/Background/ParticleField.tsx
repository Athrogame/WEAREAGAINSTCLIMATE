import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function usePrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export default function ParticleField() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = usePrefersReducedMotion();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    // Add subtle fog for depth
    scene.fog = new THREE.FogExp2(0x020408, 0.35);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 3.0;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    // Tone mapping for bloom-like glow
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ── Layer 1: Main nebula particles ──
    const mainCount = Math.min(8000, Math.max(3000, Math.floor((width * height) / 600)));
    const mainPositions = new Float32Array(mainCount * 3);
    const mainColors = new Float32Array(mainCount * 3);
    const mainSizes = new Float32Array(mainCount);

    const colorA = new THREE.Color(0x2ef2c2);
    const colorB = new THREE.Color(0x52a8ff);
    const colorC = new THREE.Color(0xa78bfa);

    for (let i = 0; i < mainCount; i++) {
      const u = Math.random();
      const r = Math.pow(u, 0.4) * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Add spiral arm structure
      const spiralAngle = theta + r * 1.5;

      mainPositions[i * 3] = r * Math.sin(phi) * Math.cos(spiralAngle);
      mainPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(spiralAngle) * 0.6;
      mainPositions[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      let c: THREE.Color;
      if (t < 0.4) c = colorA.clone().lerp(colorB, t / 0.4);
      else if (t < 0.75) c = colorB.clone().lerp(colorC, (t - 0.4) / 0.35);
      else c = colorC.clone().lerp(colorA, (t - 0.75) / 0.25);

      mainColors[i * 3] = c.r;
      mainColors[i * 3 + 1] = c.g;
      mainColors[i * 3 + 2] = c.b;

      mainSizes[i] = 0.008 + Math.random() * 0.02;
    }

    const mainGeometry = new THREE.BufferGeometry();
    mainGeometry.setAttribute('position', new THREE.BufferAttribute(mainPositions, 3));
    mainGeometry.setAttribute('color', new THREE.BufferAttribute(mainColors, 3));
    // Size attenuation through manual sizing
    const mainMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const mainPoints = new THREE.Points(mainGeometry, mainMaterial);
    scene.add(mainPoints);

    // ── Layer 2: Background dust (very small, many) ──
    const dustCount = Math.min(5000, Math.max(1500, Math.floor(mainCount * 0.5)));
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const r = 1.0 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPositions[i * 3 + 2] = r * Math.cos(phi);

      const brightness = 0.3 + Math.random() * 0.3;
      dustColors[i * 3] = brightness * 0.6;
      dustColors[i * 3 + 1] = brightness * 0.7;
      dustColors[i * 3 + 2] = brightness;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.006,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustPoints);

    // ── Layer 3: Bright accent stars ──
    const starCount = Math.min(200, Math.max(60, Math.floor(mainCount * 0.02)));
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 0.3 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const pick = Math.random();
      const c = pick < 0.5 ? colorA.clone() : pick < 0.8 ? colorB.clone() : colorC.clone();
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    let raf = 0;
    let running = true;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (e: PointerEvent) => {
      mouse.targetX = (e.clientX / width - 0.5) * 2;
      mouse.targetY = (e.clientY / height - 0.5) * 2;
    };

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    if (!reduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }
    window.addEventListener('resize', onResize);

    const renderOnce = () => {
      mainPoints.rotation.set(0.2, 0.5, 0);
      dustPoints.rotation.set(0.1, 0.3, 0);
      starPoints.rotation.set(0.15, 0.4, 0);
      renderer.render(scene, camera);
    };

    if (reduced) {
      renderOnce();
    } else {
      const start = performance.now();
      const animate = (now: number) => {
        if (!running) return;
        const t = (now - start) / 1000;

        // Smooth mouse tracking
        mouse.x += (mouse.targetX - mouse.x) * 0.03;
        mouse.y += (mouse.targetY - mouse.y) * 0.03;

        // Main nebula: gentle spiral rotation
        mainPoints.rotation.y = t * 0.06;
        mainPoints.rotation.x = Math.sin(t * 0.18) * 0.15;
        mainPoints.rotation.z = Math.sin(t * 0.25) * 0.08;
        mainPoints.position.y = Math.sin(t * 0.4) * 0.05;
        mainPoints.scale.setScalar(1.0 + Math.sin(t * 0.5) * 0.02);

        // Dust: slower counter-rotation for parallax depth
        dustPoints.rotation.y = -t * 0.02;
        dustPoints.rotation.x = Math.sin(t * 0.12) * 0.05;

        // Stars: very slow independent drift
        starPoints.rotation.y = t * 0.03;
        starPoints.rotation.z = Math.cos(t * 0.15) * 0.03;

        // Pulsing star brightness
        starMaterial.opacity = 0.6 + Math.sin(t * 1.2) * 0.3;

        // Smooth parallax camera
        camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.04;
        camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        // Subtle color temperature shift over time
        const hueShift = Math.sin(t * 0.1) * 0.1;
        mainMaterial.opacity = 0.75 + Math.sin(t * 0.8) * 0.1;
        dustMaterial.opacity = 0.3 + Math.sin(t * 0.6 + 1) * 0.1;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };

      raf = requestAnimationFrame(animate);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      mainGeometry.dispose();
      mainMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
