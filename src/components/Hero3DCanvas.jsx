import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FaSyncAlt, FaPlay, FaPause, FaCompass } from 'react-icons/fa';

export default function Hero3DCanvas({ theme = 'dark' }) {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const autoRotateRef = useRef(true);
  const speedRef = useRef(1);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  const resetRotationRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 450;

    // ── 1. Scene, Camera, Renderer ──
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const isDark = theme === 'dark';

    // ── 2. Lights ──
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x0a2215 : 0xffffff,
      isDark ? 2.5 : 2.0
    );
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(isDark ? 0x10b981 : 0x059669, 3.5);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const secondaryLight = new THREE.DirectionalLight(isDark ? 0x06b6d4 : 0x0284c7, 3.0);
    secondaryLight.position.set(-5, -3, 3);
    scene.add(secondaryLight);

    const pointLight = new THREE.PointLight(isDark ? 0x34d399 : 0x10b981, 4.0, 15);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // ── 3. 3D Kinetic Holographic Core Group ──
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Master Rotatable Container (for 360° interactive rotation)
    const interactiveGroup = new THREE.Group();
    rootGroup.add(interactiveGroup);

    // (A) Inner Geodesic Core
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x052e16 : 0xecfdf5,
      emissive: isDark ? 0x10b981 : 0x059669,
      emissiveIntensity: isDark ? 0.35 : 0.2,
      roughness: 0.15,
      metalness: 0.85,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    interactiveGroup.add(coreMesh);

    // Inner Glowing Wireframe Accent
    const wireGeo = new THREE.IcosahedronGeometry(1.38, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x34d399 : 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.6,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    interactiveGroup.add(wireMesh);

    // Inner Nucleus
    const nucleusGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xffffff : 0x10b981,
      emissive: isDark ? 0x10b981 : 0x059669,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.9,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    interactiveGroup.add(nucleusMesh);

    // (B) Three Concentric Gyroscopic Gimbal Rings
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: isDark ? 0x10b981 : 0x059669,
      emissive: isDark ? 0x064e3b : 0x047857,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.035, 16, 100), ringMat1);
    interactiveGroup.add(ring1);

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: isDark ? 0x06b6d4 : 0x0284c7,
      emissive: isDark ? 0x164e63 : 0x0369a1,
      metalness: 0.85,
      roughness: 0.25,
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.032, 16, 100), ringMat2);
    ring2.rotation.x = Math.PI / 3;
    interactiveGroup.add(ring2);

    const ringMat3 = new THREE.MeshStandardMaterial({
      color: isDark ? 0xa7f3d0 : 0x0f766e,
      emissive: isDark ? 0x065f46 : 0x115e59,
      metalness: 0.8,
      roughness: 0.3,
    });
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.028, 16, 100), ringMat3);
    ring3.rotation.y = Math.PI / 4;
    interactiveGroup.add(ring3);

    // (C) Orbiting Celestial Dust Particles
    const particleCount = 260;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.6 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = radius * Math.cos(phi);

      if (i % 3 === 0) {
        colorArray[i * 3] = 0.12; colorArray[i * 3 + 1] = 0.87; colorArray[i * 3 + 2] = 0.39; // Green
      } else if (i % 3 === 1) {
        colorArray[i * 3] = 0.13; colorArray[i * 3 + 1] = 0.83; colorArray[i * 3 + 2] = 0.93; // Cyan
      } else {
        colorArray[i * 3] = 1.0; colorArray[i * 3 + 1] = 1.0; colorArray[i * 3 + 2] = 1.0; // White
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.85 : 0.7,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    interactiveGroup.add(particleSystem);

    // ── 4. 360° Drag / Swipe Rotation Physics with Inertia ──
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      previousPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      previousPointerY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const deltaX = clientX - previousPointerX;
      const deltaY = clientY - previousPointerY;

      velocityX = deltaX * 0.006;
      velocityY = deltaY * 0.006;

      interactiveGroup.rotation.y += velocityX;
      interactiveGroup.rotation.x += velocityY;

      previousPointerX = clientX;
      previousPointerY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onPointerDown);
    domEl.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domEl.addEventListener('touchstart', onPointerDown, { passive: true });
    domEl.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Reset Function
    resetRotationRef.current = () => {
      interactiveGroup.rotation.set(0, 0, 0);
      velocityX = 0;
      velocityY = 0;
    };

    // ── 5. Scroll-Driven Camera & Tilt Reaction ──
    let targetScrollRotY = 0;
    let currentScrollRotY = 0;

    const onScroll = () => {
      const scrollY = window.scrollY || 0;
      targetScrollRotY = scrollY * 0.0015;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── 6. Resize Handler ──
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 400;
      height = container.clientHeight || 450;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // ── 7. Animation Loop ──
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      clock.getDelta();
      const speed = speedRef.current;

      // Inertia decay when not dragging
      if (!isDragging) {
        interactiveGroup.rotation.y += velocityX;
        interactiveGroup.rotation.x += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;

        // Auto orbit when enabled
        if (autoRotateRef.current) {
          interactiveGroup.rotation.y += 0.008 * speed;
        }
      }

      // Smooth internal kinetic rotation of rings & core
      coreMesh.rotation.y += 0.005 * speed;
      wireMesh.rotation.y -= 0.006 * speed;
      nucleusMesh.rotation.y += 0.01 * speed;

      ring1.rotation.z += 0.007 * speed;
      ring2.rotation.x -= 0.006 * speed;
      ring3.rotation.y += 0.008 * speed;

      particleSystem.rotation.y += 0.003 * speed;
      particleSystem.rotation.x += 0.002 * speed;

      // Scroll interpolation
      currentScrollRotY += (targetScrollRotY - currentScrollRotY) * 0.08;
      rootGroup.rotation.y = currentScrollRotY;

      // Gentle floating levitation
      const elapsedTime = clock.getElapsedTime();
      rootGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onPointerDown);
      domEl.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domEl.removeEventListener('touchstart', onPointerDown);
      domEl.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      ringMat3.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] flex items-center justify-center select-none group">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        title="Click and drag to rotate 360°"
      />

      {/* Floating 360° Interactive HUD Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 pointer-events-auto">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold backdrop-blur-md border shadow-lg transition-all ${
            isDark
              ? 'bg-black/60 border-accent/40 text-accent shadow-accent/10'
              : 'bg-white/80 border-emerald-500/40 text-emerald-700 shadow-emerald-500/10'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>360° Interactive</span>
        </div>

        {/* Action Buttons Toolbar */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-xl backdrop-blur-md border shadow-lg ${
            isDark ? 'bg-black/50 border-white/10' : 'bg-white/80 border-slate-200'
          }`}
        >
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              autoRotate
                ? isDark
                  ? 'bg-accent/20 text-accent'
                  : 'bg-emerald-100 text-emerald-700'
                : isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title={autoRotate ? 'Pause Auto-Orbit' : 'Resume Auto-Orbit'}
            aria-label="Toggle Auto Orbit"
          >
            {autoRotate ? <FaPause /> : <FaPlay />}
          </button>

          <button
            onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : 1))}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
              speedMultiplier === 2
                ? isDark
                  ? 'bg-accent/20 text-accent'
                  : 'bg-emerald-100 text-emerald-700'
                : isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Toggle Orbit Speed (1x / 2x)"
          >
            {speedMultiplier}x
          </button>

          <button
            onClick={() => resetRotationRef.current && resetRotationRef.current()}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isDark
                ? 'text-gray-400 hover:text-accent'
                : 'text-slate-500 hover:text-emerald-700'
            }`}
            title="Reset 360° Rotation"
            aria-label="Reset Rotation"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {/* Floating Drag Hint Indicator (Disappears on hover/drag) */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3.5 py-1 rounded-full text-[11px] font-mono flex items-center gap-2 backdrop-blur-md border shadow-md transition-opacity duration-300 group-hover:opacity-40 ${
          isDark
            ? 'bg-black/60 border-white/10 text-gray-300'
            : 'bg-white/80 border-slate-200 text-slate-600'
        }`}
      >
        <FaCompass className="text-accent animate-spin duration-3000" />
        <span>Drag to rotate 360°</span>
      </div>
    </div>
  );
}
