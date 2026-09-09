import { useEffect, useRef } from 'react';

export default function BackgroundEffects({ theme = 'dark' }) {
  const canvasRef = useRef(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Mouse tilt tracking with smooth damping
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Scroll tracking with velocity & momentum
    let scrollY = window.scrollY || 0;
    let targetScrollY = scrollY;
    let scrollVelocity = 0;
    let lastScrollY = scrollY;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Configuration for the Astra Luminous Spiral & Starfield
    const isMobile = width < 768;
    const PARTICLE_COUNT = isMobile ? 320 : 650;
    const AMBIENT_STAR_COUNT = isMobile ? 80 : 180;
    const NUM_SPIRAL_ARMS = 3;
    const FOV = 480;

    // Dark Palette: Luminous neon green, cyan, starlight violet, white
    const DARK_PALETTES = [
      { r: 31, g: 223, b: 100 },  // Accent Neon Green (#1fdf64)
      { r: 45, g: 212, b: 191 },  // Electric Cyan / Teal
      { r: 129, g: 140, b: 248 }, // Starlight Violet
      { r: 255, g: 255, b: 255 }, // Pure White Starlight
      { r: 52, g: 211, b: 153 },  // Emerald Light
    ];

    // Light Palette: High-contrast rich emerald, vibrant azure, deep indigo, slate nodes
    const LIGHT_PALETTES = [
      { r: 5, g: 150, b: 105 },   // Deep Emerald Green (#059669)
      { r: 2, g: 132, b: 199 },   // Azure Blue (#0284c7)
      { r: 79, g: 70, b: 229 },   // Royal Indigo (#4f46e5)
      { r: 51, g: 65, b: 85 },    // Crisp Slate-700 (#334155)
      { r: 13, g: 148, b: 136 },  // Teal (#0d9488)
    ];

    class SpiralParticle {
      constructor(index) {
        this.index = index;
        this.init();
      }

      init() {
        const arm = this.index % NUM_SPIRAL_ARMS;
        const armOffset = (arm * 2 * Math.PI) / NUM_SPIRAL_ARMS;
        
        const t = Math.pow(Math.random(), 0.65);
        this.distance = 40 + t * 580;
        this.spiralAngle = t * 7.5 + armOffset;
        
        const spread = (Math.random() - 0.5) * (18 + t * 45);
        this.baseX = Math.cos(this.spiralAngle) * this.distance + Math.sin(this.spiralAngle) * spread;
        this.baseY = Math.sin(this.spiralAngle) * this.distance - Math.cos(this.spiralAngle) * spread;
        
        this.baseZ = (t - 0.5) * 600 + (Math.random() - 0.5) * 120;

        this.size = Math.random() * 1.8 + 0.9;
        this.paletteIndex = Math.floor(Math.random() * DARK_PALETTES.length);
        this.baseAlpha = Math.random() * 0.55 + 0.35;
        this.twinkleSpeed = 0.02 + Math.random() * 0.03;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.orbitSpeed = (0.0015 + (1 - t) * 0.0025);
      }

      update(time, scrollRot, scrollShiftZ, camPitch, camYaw, isDark) {
        this.twinklePhase += this.twinkleSpeed;
        
        const currentAngle = this.spiralAngle + time * this.orbitSpeed + scrollRot;
        const currentDist = this.distance;

        const wx = Math.cos(currentAngle) * currentDist;
        const wy = Math.sin(currentAngle) * currentDist;
        let wz = this.baseZ - (scrollShiftZ % 600);
        if (wz < -300) wz += 600;
        if (wz > 300) wz -= 600;

        // 3D Camera Tilt
        const cosX = Math.cos(camPitch);
        const sinX = Math.sin(camPitch);
        const y1 = wy * cosX - wz * sinX;
        const z1 = wy * sinX + wz * cosX;

        const cosY = Math.cos(camYaw);
        const sinY = Math.sin(camYaw);
        const x2 = wx * cosY + z1 * sinY;
        const z2 = -wx * sinY + z1 * cosY;

        const depth = z2 + FOV;
        if (depth <= 10) return;

        const projection = FOV / depth;
        const screenX = width * 0.5 + x2 * projection;
        const screenY = height * 0.5 + y1 * projection;

        if (screenX < -50 || screenX > width + 50 || screenY < -50 || screenY > height + 50) {
          return;
        }

        const depthFade = Math.max(0.12, Math.min(1, (600 - z2) / 600));
        const twinkle = 0.7 + 0.3 * Math.sin(this.twinklePhase);
        const alpha = Math.min(1, this.baseAlpha * depthFade * twinkle * (isDark ? 1 : 1.25));
        const renderSize = Math.max(0.8, this.size * projection * (isDark ? 1 : 1.15));

        const palette = isDark ? DARK_PALETTES : LIGHT_PALETTES;
        const { r, g, b } = palette[this.paletteIndex];
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, renderSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        ctx.fill();

        // Extra soft glow for prominent particles
        if (renderSize > 1.3 && alpha > 0.35) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, renderSize * (isDark ? 2.8 : 2.2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * (isDark ? 0.28 : 0.18)).toFixed(3)})`;
          ctx.fill();
        }
      }
    }

    class AmbientStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = (Math.random() - 0.5) * width * 1.8;
        this.y = (Math.random() - 0.5) * height * 1.8;
        this.z = Math.random() * 400 + 100;
        this.size = Math.random() * 1.3 + 0.5;
        this.alpha = Math.random() * 0.45 + 0.15;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.015 + Math.random() * 0.02;
      }

      update(camPitch, camYaw, scrollOffset, isDark) {
        this.twinkle += this.twinkleSpeed;
        
        const px = this.x + camYaw * 60;
        const py = this.y + camPitch * 60 - scrollOffset * 0.08;

        const screenX = width * 0.5 + px;
        const screenY = height * 0.5 + (py % (height * 1.2));

        if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) return;

        const alpha = Math.min(1, this.alpha * (0.6 + 0.4 * Math.sin(this.twinkle)) * (isDark ? 1 : 1.2));
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(220, 245, 230, ${alpha.toFixed(3)})`
          : `rgba(71, 85, 105, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    const spiralParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => new SpiralParticle(i));
    const ambientStars = Array.from({ length: AMBIENT_STAR_COUNT }, () => new AmbientStar());

    let time = 0;
    let currentScrollRot = 0;
    let currentScrollZ = 0;
    let camPitch = 0.35;
    let camYaw = 0;

    const render = () => {
      const isDark = themeRef.current === 'dark';

      scrollY += (targetScrollY - scrollY) * 0.08;
      scrollVelocity = (scrollY - lastScrollY) * 0.05;
      lastScrollY = scrollY;

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const targetRot = scrollY * 0.0018;
      currentScrollRot += (targetRot - currentScrollRot) * 0.08;
      currentScrollZ = scrollY * 0.45;

      const targetPitch = 0.38 - mouseY * 0.25 - scrollVelocity * 0.03;
      const targetYaw = mouseX * 0.32;
      camPitch += (targetPitch - camPitch) * 0.06;
      camYaw += (targetYaw - camYaw) * 0.06;

      time += 1;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw background stars
      for (let i = 0; i < ambientStars.length; i++) {
        ambientStars[i].update(camPitch, camYaw, scrollY, isDark);
      }

      // 2. Draw 3D Luminous Astra Spiral Vortex
      for (let i = 0; i < spiralParticles.length; i++) {
        spiralParticles[i].update(time, currentScrollRot, currentScrollZ, camPitch, camYaw, isDark);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none transition-colors duration-500 ${
        isDark ? 'bg-black' : 'bg-slate-50'
      }`}
    >
      {/* ── Atmospheric Ambient Light Blooms ── */}
      {isDark ? (
        <>
          <div className="absolute top-[5%] left-[20%] w-[55vw] h-[55vw] max-w-[650px] rounded-full bg-accent/[0.045] blur-[150px] pointer-events-none" />
          <div className="absolute bottom-[15%] right-[10%] w-[50vw] h-[50vw] max-w-[550px] rounded-full bg-indigo-600/[0.035] blur-[160px] pointer-events-none" />
          <div className="absolute top-[45%] left-[-10%] w-[45vw] h-[45vw] max-w-[480px] rounded-full bg-teal-500/[0.03] blur-[140px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-[5%] left-[15%] w-[55vw] h-[55vw] max-w-[650px] rounded-full bg-emerald-400/[0.12] blur-[140px] pointer-events-none" />
          <div className="absolute bottom-[15%] right-[10%] w-[50vw] h-[50vw] max-w-[550px] rounded-full bg-sky-400/[0.10] blur-[150px] pointer-events-none" />
          <div className="absolute top-[45%] left-[-5%] w-[45vw] h-[45vw] max-w-[480px] rounded-full bg-indigo-400/[0.08] blur-[130px] pointer-events-none" />
        </>
      )}

      {/* ── 3D Luminous Astra Spiral Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-0"
        style={{ mixBlendMode: isDark ? 'screen' : 'normal' }}
      />

      {/* ── Radial Vignette Overlay for Content Legibility ── */}
      <div
        className="absolute inset-0 z-1 pointer-events-none transition-all duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.4) 85%, rgba(0, 0, 0, 0.75) 100%)'
            : 'radial-gradient(ellipse at center, transparent 55%, rgba(248, 250, 252, 0.45) 85%, rgba(241, 245, 249, 0.8) 100%)',
        }}
      />
    </div>
  );
}
