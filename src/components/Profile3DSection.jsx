import { useEffect, useRef, useState, useCallback } from 'react';
import { FaPlay, FaPause, FaSyncAlt, FaCompass, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TOTAL_FRAMES = 24;
const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => 
  `/assets/turnaround/seq/frame_${String(i).padStart(2, '0')}.jpg`
);

export default function Profile3DSection({ theme = 'dark' }) {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startFrameRef = useRef(0);

  const isDark = theme === 'dark';

  // ── Preload Turnaround Frames ──
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages = [];

    FRAME_PATHS.forEach((path, index) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedCount += 1;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = loadedImages;
          setIsLoaded(true);
        }
      };
      loadedImages[index] = img;
    });

    return () => {
      imagesRef.current = [];
    };
  }, []);

  // ── Render Frame on Canvas ──
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete) return;

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Fit image properly inside canvas (contain)
    const imgRatio = img.width / img.height;
    const canvasRatio = displayWidth / displayHeight;
    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderH = displayHeight * 0.94;
      renderW = renderH * imgRatio;
      offsetX = (displayWidth - renderW) / 2;
      offsetY = displayHeight * 0.03;
    } else {
      renderW = displayWidth * 0.92;
      renderH = renderW / imgRatio;
      offsetX = (displayWidth - renderW) / 2;
      offsetY = (displayHeight - renderH) / 2;
    }

    // Draw soft shadow at feet
    const shadowY = offsetY + renderH - 15;
    const shadowRadiusX = renderW * 0.32;
    const shadowRadiusY = 12;
    const shadowGrad = ctx.createRadialGradient(
      displayWidth / 2, shadowY, 0,
      displayWidth / 2, shadowY, shadowRadiusX
    );
    shadowGrad.addColorStop(0, isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.25)');
    shadowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(displayWidth / 2, shadowY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw character frame
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }, [isDark]);

  // Redraw when currentFrame changes
  useEffect(() => {
    if (isLoaded) {
      drawFrame(currentFrame);
    }
  }, [currentFrame, isLoaded, drawFrame]);

  // ── Scroll-Driven Scrubbing (Matching Reference: "SCROLL TO SCRUB TIMELINE") ──
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section || isDraggingRef.current || isPlaying) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When section enters the viewport
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const totalDistance = windowHeight + rect.height;
        const currentDistance = windowHeight - rect.top;
        const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

        // Map scroll progress to 360-degree rotation frames
        const targetFrame = Math.floor(progress * TOTAL_FRAMES * 1.5) % TOTAL_FRAMES;
        setCurrentFrame(targetFrame);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlaying]);

  // ── Auto-Play Turntable Animation ──
  useEffect(() => {
    if (!isPlaying || !isLoaded) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES);
    }, 85);

    return () => clearInterval(interval);
  }, [isPlaying, isLoaded]);

  // ── Drag / Swipe to Rotate 360° ──
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startFrameRef.current = currentFrame;
    setIsPlaying(false);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startXRef.current;

    // Sensitivity: ~15px drag = 1 frame rotation
    const framesDiff = Math.floor(deltaX / 14);
    let newFrame = (startFrameRef.current - framesDiff) % TOTAL_FRAMES;
    if (newFrame < 0) newFrame += TOTAL_FRAMES;

    setCurrentFrame(newFrame);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (isLoaded) drawFrame(currentFrame);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, currentFrame, drawFrame]);

  // Compute angle in degrees
  const angleDegrees = Math.round((currentFrame / TOTAL_FRAMES) * 360);

  return (
    <section
      ref={sectionRef}
      id="profile-3d"
      className="relative w-full rounded-3xl overflow-hidden py-14 sm:py-20 my-10 border transition-all duration-500 backdrop-blur-2xl"
      style={{
        backgroundColor: isDark ? 'rgba(10, 12, 16, 0.8)' : 'rgba(255, 255, 255, 0.85)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.9)',
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          GLASS EFFECT NAME IN SECTION BACKGROUND
         ══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <div
          className="text-center font-display font-extrabold uppercase tracking-[0.14em] sm:tracking-[0.2em] leading-none opacity-40 sm:opacity-55 blur-[0.4px] transform scale-90 sm:scale-100"
          style={{
            fontSize: 'clamp(3rem, 9.5vw, 10.5rem)',
            background: isDark
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(31, 223, 100, 0.38) 100%)'
              : 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.06) 50%, rgba(16, 185, 129, 0.45) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: isDark
              ? 'drop-shadow(0 0 55px rgba(31, 223, 100, 0.3)) drop-shadow(0 20px 45px rgba(0, 0, 0, 0.7))'
              : 'drop-shadow(0 0 40px rgba(16, 185, 129, 0.25)) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.1))',
          }}
        >
          MFA NASEEF SHARAF
        </div>
        <div
          className="font-mono text-xs sm:text-sm tracking-[0.45em] uppercase font-bold mt-3 opacity-60"
          style={{ color: isDark ? '#10b981' : '#059669' }}
        >
          COMPUTER ENGINEER × CREATIVE DEVELOPER
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          FOREGROUND CONTENT: 360° ROTATING CHARACTER CANVAS
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold border backdrop-blur-md ${
              isDark
                ? 'bg-black/60 border-accent/40 text-accent shadow-[0_0_20px_rgba(31,223,100,0.2)]'
                : 'bg-white/80 border-emerald-500/40 text-emerald-700 shadow-sm'
            }`}
          >
            <FaCompass className="text-accent animate-spin duration-3000" />
            <span>360° Photorealistic Character Turnaround</span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Interactive Persona Scrub
          </h2>
          <p
            className={`text-xs sm:text-sm max-w-lg font-mono ${
              isDark ? 'text-gray-400' : 'text-slate-600'
            }`}
          >
            Scroll the webpage or drag the character to inspect full 360° rotational turnaround.
          </p>
        </div>

        {/* ── Main 360° Viewport Canvas ── */}
        <div className="relative w-full max-w-2xl h-[420px] sm:h-[500px] md:h-[560px] flex items-center justify-center select-none group">
          
          {/* Loading Indicator */}
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-30">
              <div className="w-12 h-12 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
              <span className="text-xs font-mono text-accent">
                Loading 360° Frames ({loadProgress}%)
              </span>
            </div>
          )}

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="w-full h-full cursor-ew-resize active:cursor-grabbing relative z-10 block"
            title="Click and drag horizontally to rotate 360°"
          />

          {/* Quick Step Buttons (Left & Right) */}
          <button
            onClick={() => setCurrentFrame((prev) => (prev - 1 + TOTAL_FRAMES) % TOTAL_FRAMES)}
            className={`absolute left-2 sm:left-4 z-20 p-3 rounded-full border backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${
              isDark
                ? 'bg-black/60 border-white/10 text-white hover:border-accent hover:text-accent'
                : 'bg-white/80 border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-700'
            }`}
            aria-label="Previous angle"
          >
            <FaChevronLeft className="text-sm" />
          </button>

          <button
            onClick={() => setCurrentFrame((prev) => (prev + 1) % TOTAL_FRAMES)}
            className={`absolute right-2 sm:right-4 z-20 p-3 rounded-full border backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${
              isDark
                ? 'bg-black/60 border-white/10 text-white hover:border-accent hover:text-accent'
                : 'bg-white/80 border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-700'
            }`}
            aria-label="Next angle"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SCRUBBER TIMELINE BAR (Matching Reference Image)
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-xl mt-4 px-4 space-y-3 z-20">
          
          {/* Timeline Status Strip (Matches "SCROLL TO SCRUB TIMELINE") */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span
                className={`font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}
              >
                Scroll to Scrub Timeline
              </span>
            </div>

            <div
              className={`px-3 py-1 rounded-full font-bold border ${
                isDark
                  ? 'bg-evening/80 border-white/10 text-accent'
                  : 'bg-slate-100 border-slate-200 text-emerald-700'
              }`}
            >
              {angleDegrees}° / 360°
            </div>
          </div>

          {/* Interactive Range Slider Scrubber */}
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max={TOTAL_FRAMES - 1}
              value={currentFrame}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentFrame(parseInt(e.target.value, 10));
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1fdf64]"
            />
          </div>

          {/* Controls Strip */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-medium backdrop-blur-md transition-all ${
                  isPlaying
                    ? 'bg-accent text-midnight font-bold border-accent shadow-md shadow-accent/20'
                    : isDark
                    ? 'bg-evening border-white/10 text-white hover:border-accent'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:border-emerald-500'
                }`}
              >
                {isPlaying ? <FaPause className="text-[10px]" /> : <FaPlay className="text-[10px]" />}
                <span>{isPlaying ? 'Pause' : 'Auto 360° Spin'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentFrame(0);
                }}
                className={`p-2 rounded-xl border text-xs backdrop-blur-md transition-all ${
                  isDark
                    ? 'bg-evening border-white/10 text-gray-400 hover:text-white hover:border-accent'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                title="Reset to 0° Front View"
              >
                <FaSyncAlt className="text-[10px]" />
              </button>
            </div>

            <span
              className={`text-[11px] font-mono ${
                isDark ? 'text-gray-400' : 'text-slate-500'
              }`}
            >
              Frame {currentFrame + 1} of {TOTAL_FRAMES}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
