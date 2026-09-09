import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FaSyncAlt, FaPlay, FaPause, FaCompass, FaCube } from 'react-icons/fa';

export default function Profile3DSection({ theme = 'dark' }) {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const autoRotateRef = useRef(true);
  const speedRef = useRef(1);
  const resetRotationRef = useRef(null);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 550;

    // ── 1. Scene, Camera, Renderer ──
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const isDark = theme === 'dark';

    // ── 2. Atmospheric Lights ──
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x0f291e : 0xffffff,
      isDark ? 2.6 : 2.2
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(isDark ? 0x10b981 : 0x059669, 3.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(isDark ? 0x06b6d4 : 0x0284c7, 3.5);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const bottomUpLight = new THREE.PointLight(isDark ? 0x34d399 : 0x10b981, 4.0, 10);
    bottomUpLight.position.set(0, -2.5, 1);
    scene.add(bottomUpLight);

    // ── 3. Rotatable Character Anchor Group ──
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const characterGroup = new THREE.Group();
    rootGroup.add(characterGroup);

    // Load Profile Image Texture
    const textureLoader = new THREE.TextureLoader();
    const profileTexture = textureLoader.load('/assets/profile.png');
    profileTexture.colorSpace = THREE.SRGBColorSpace;
    profileTexture.generateMipmaps = true;

    // Create Back Cover Canvas (Holographic Tech Badge)
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 512;
    backCanvas.height = 640;
    const backCtx = backCanvas.getContext('2d');
    if (backCtx) {
      backCtx.fillStyle = isDark ? '#091510' : '#f0fdf4';
      backCtx.fillRect(0, 0, 512, 640);

      // Cybernetic grid lines
      backCtx.strokeStyle = isDark ? 'rgba(31, 223, 100, 0.25)' : 'rgba(5, 150, 105, 0.25)';
      backCtx.lineWidth = 2;
      for (let i = 40; i < 512; i += 40) {
        backCtx.beginPath();
        backCtx.moveTo(i, 0);
        backCtx.lineTo(i, 640);
        backCtx.stroke();
      }
      for (let j = 40; j < 640; j += 40) {
        backCtx.beginPath();
        backCtx.moveTo(0, j);
        backCtx.lineTo(512, j);
        backCtx.stroke();
      }

      // Center Holographic Monogram
      backCtx.fillStyle = isDark ? '#10b981' : '#059669';
      backCtx.beginPath();
      backCtx.arc(256, 260, 90, 0, Math.PI * 2);
      backCtx.fill();

      backCtx.fillStyle = isDark ? '#052e16' : '#ffffff';
      backCtx.font = 'bold 72px sans-serif';
      backCtx.textAlign = 'center';
      backCtx.textBaseline = 'middle';
      backCtx.fillText('NS', 256, 265);

      backCtx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
      backCtx.font = 'bold 26px monospace';
      backCtx.fillText('MFA NASEEF SHARAF', 256, 400);

      backCtx.fillStyle = isDark ? '#34d399' : '#059669';
      backCtx.font = '20px monospace';
      backCtx.fillText('COMPUTER ENGINEER', 256, 440);
      backCtx.fillText('UNIV. OF PERADENIYA', 256, 475);
    }
    const backTexture = new THREE.CanvasTexture(backCanvas);

    // Front Material with Profile Photo
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: profileTexture,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });

    // Back Material with Cybernetic Monogram
    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.3,
      metalness: 0.5,
    });

    // Bezel / Edge Material
    const edgeMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x10b981 : 0x059669,
      emissive: isDark ? 0x047857 : 0x065f46,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Materials array for BoxGeometry: [right, left, top, bottom, front, back]
    const avatarMaterials = [
      edgeMat,
      edgeMat,
      edgeMat,
      edgeMat,
      frontMat,
      backMat,
    ];

    // 3D Dimensional Character Card
    const avatarGeo = new THREE.BoxGeometry(2.3, 2.9, 0.14);
    const avatarMesh = new THREE.Mesh(avatarGeo, avatarMaterials);
    characterGroup.add(avatarMesh);

    // Glowing Holographic Frame Border
    const frameGeo = new THREE.BoxGeometry(2.42, 3.02, 0.16);
    const frameMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x34d399 : 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.6 : 0.45,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    characterGroup.add(frameMesh);

    // Orbiting Ethereal Halo Ring Behind Character
    const haloGeo = new THREE.TorusGeometry(1.85, 0.025, 16, 80);
    const haloMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x06b6d4 : 0x0284c7,
      emissive: isDark ? 0x0891b2 : 0x0369a1,
      metalness: 0.85,
      roughness: 0.2,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.z = -0.15;
    characterGroup.add(haloMesh);

    // Concentric Gyro Ring
    const haloGeo2 = new THREE.TorusGeometry(2.25, 0.018, 16, 80);
    const haloMat2 = new THREE.MeshStandardMaterial({
      color: isDark ? 0x10b981 : 0x059669,
      emissive: isDark ? 0x047857 : 0x065f46,
      metalness: 0.9,
      roughness: 0.2,
    });
    const haloMesh2 = new THREE.Mesh(haloGeo2, haloMat2);
    haloMesh2.rotation.x = Math.PI / 4;
    characterGroup.add(haloMesh2);

    // ── 4. Holographic Pedestal / Emitter Platform Below Character ──
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.y = -2.1;
    rootGroup.add(pedestalGroup);

    // Base Cylinder
    const baseCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.8, 0.15, 32),
      new THREE.MeshStandardMaterial({
        color: isDark ? 0x111827 : 0xe2e8f0,
        metalness: 0.85,
        roughness: 0.25,
      })
    );
    pedestalGroup.add(baseCylinder);

    // Glowing Emitter Ring
    const emitterRing = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 1.55, 32),
      new THREE.MeshBasicMaterial({
        color: isDark ? 0x10b981 : 0x059669,
        side: THREE.DoubleSide,
      })
    );
    emitterRing.rotation.x = -Math.PI / 2;
    emitterRing.position.y = 0.08;
    pedestalGroup.add(emitterRing);

    // Rising Holographic Particle Dust
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 2.8;
      posArray[i * 3 + 1] = Math.random() * 4.0 - 2.0;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: isDark ? 0x34d399 : 0x059669,
      transparent: true,
      opacity: isDark ? 0.75 : 0.6,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleField);

    // ── 5. Full 360° Drag & Swipe Physics with Momentum ──
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      previousX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      previousY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const deltaX = clientX - previousX;
      const deltaY = clientY - previousY;

      velocityX = deltaX * 0.006;
      velocityY = deltaY * 0.006;

      characterGroup.rotation.y += velocityX;
      characterGroup.rotation.x += velocityY;

      previousX = clientX;
      previousY = clientY;
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

    resetRotationRef.current = () => {
      characterGroup.rotation.set(0, 0, 0);
      velocityX = 0;
      velocityY = 0;
    };

    // ── 6. Resize Handler ──
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 500;
      height = container.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // ── 7. Animation Loop ──
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      clock.getDelta();
      const speed = speedRef.current;
      const elapsedTime = clock.getElapsedTime();

      // Inertia decay
      if (!isDragging) {
        characterGroup.rotation.y += velocityX;
        characterGroup.rotation.x += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;

        if (autoRotateRef.current) {
          characterGroup.rotation.y += 0.01 * speed;
        }
      }

      // Smooth Halo rotations
      haloMesh.rotation.z += 0.008 * speed;
      haloMesh2.rotation.z -= 0.006 * speed;

      // Gentle levitation float
      characterGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.12;

      // Particle floating drift
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.006 * speed;
        if (positions[i * 3 + 1] > 2.0) {
          positions[i * 3 + 1] = -2.0;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

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
      window.removeEventListener('resize', onResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      avatarGeo.dispose();
      frameGeo.dispose();
      frameMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      haloGeo2.dispose();
      haloMat2.dispose();
      baseCylinder.geometry.dispose();
      baseCylinder.material.dispose();
      emitterRing.geometry.dispose();
      emitterRing.material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      profileTexture.dispose();
      backTexture.dispose();
    };
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <section
      id="profile-3d"
      className="relative w-full rounded-3xl overflow-hidden py-12 sm:py-16 my-8 border transition-all duration-500 backdrop-blur-2xl"
      style={{
        backgroundColor: isDark ? 'rgba(18, 18, 18, 0.75)' : 'rgba(255, 255, 255, 0.85)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.9)',
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          GLASS EFFECT NAME IN SECTION BACKGROUND
         ══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <div
          className="text-center font-display font-extrabold uppercase tracking-[0.12em] sm:tracking-[0.18em] leading-none opacity-40 sm:opacity-50 blur-[0.6px] transform scale-90 sm:scale-100"
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 9.5rem)',
            background: isDark
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 45%, rgba(31, 223, 100, 0.35) 100%)'
              : 'linear-gradient(135deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.06) 45%, rgba(16, 185, 129, 0.4) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: isDark
              ? 'drop-shadow(0 0 45px rgba(31, 223, 100, 0.25)) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.6))'
              : 'drop-shadow(0 0 35px rgba(16, 185, 129, 0.2)) drop-shadow(0 10px 25px rgba(0, 0, 0, 0.08))',
          }}
        >
          MFA NASEEF SHARAF
        </div>
        <div
          className="font-mono text-xs sm:text-sm tracking-[0.4em] uppercase font-bold mt-2 opacity-50"
          style={{ color: isDark ? '#10b981' : '#059669' }}
        >
          COMPUTER ENGINEER × CREATIVE DEVELOPER
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          FOREGROUND CONTENT & 3D 360° CHARACTER CANVAS
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold border backdrop-blur-md ${
              isDark
                ? 'bg-black/60 border-accent/40 text-accent shadow-[0_0_20px_rgba(31,223,100,0.15)]'
                : 'bg-white/80 border-emerald-500/40 text-emerald-700 shadow-sm'
            }`}
          >
            <FaCube className="text-accent text-xs" />
            <span>3D 360° Rotatable Character</span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Interactive Persona Showcase
          </h2>
          <p
            className={`text-xs sm:text-sm max-w-lg font-mono ${
              isDark ? 'text-gray-400' : 'text-slate-600'
            }`}
          >
            Click and drag (or swipe) in any direction to inspect the 3D character in full 360 degrees.
          </p>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] flex items-center justify-center select-none group">
          <div
            ref={mountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
            title="Click and drag to rotate 360°"
          />

          {/* Floating Controls Toolbar */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
            <div
              className={`flex items-center gap-1.5 p-1 rounded-xl backdrop-blur-md border shadow-xl ${
                isDark ? 'bg-black/60 border-white/10' : 'bg-white/85 border-slate-200'
              }`}
            >
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-2 rounded-lg text-xs transition-colors ${
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
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  speedMultiplier === 2
                    ? isDark
                      ? 'bg-accent/20 text-accent'
                      : 'bg-emerald-100 text-emerald-700'
                    : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Toggle Speed"
              >
                {speedMultiplier}x
              </button>

              <button
                onClick={() => resetRotationRef.current && resetRotationRef.current()}
                className={`p-2 rounded-lg text-xs transition-colors ${
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

          {/* Drag Hint at Bottom */}
          <div
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 backdrop-blur-md border shadow-md transition-opacity duration-300 group-hover:opacity-40 ${
              isDark
                ? 'bg-black/70 border-white/10 text-gray-300'
                : 'bg-white/80 border-slate-200 text-slate-700'
            }`}
          >
            <FaCompass className="text-accent animate-spin duration-3000" />
            <span>Drag horizontally or vertically to rotate 360°</span>
          </div>
        </div>
      </div>
    </section>
  );
}
