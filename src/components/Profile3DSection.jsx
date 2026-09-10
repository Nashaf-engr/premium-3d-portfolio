import { useEffect, useRef, useState, useCallback } from 'react';
import { FaPlay, FaPause, FaSyncAlt, FaCompass, FaVideo, FaInfoCircle } from 'react-icons/fa';

export default function Profile3DSection({ theme = 'dark' }) {
  const sectionRef = useRef(null);
  const boxRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const targetTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);

  const isDark = theme === 'dark';

  // ── Video Metadata Loaded ──
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 5;
      setDuration(dur);
      setVideoLoaded(true);
      setVideoError(false);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoaded(false);
  };

  const scrollTimeoutRef = useRef(null);

  // ── Continuous 60fps Sync Loop: Slider & Angle Progress Smoothly from 0 to End ──
  useEffect(() => {
    let animationFrameId;

    const syncLoop = () => {
      const video = videoRef.current;
      if (video && videoLoaded && duration > 0) {
        // Continuous 360 loop while scrolling
        if (!video.paused && video.currentTime >= duration - 0.04) {
          video.currentTime = 0;
        }

        if (!isDraggingRef.current) {
          setCurrentTime(video.currentTime);
          targetTimeRef.current = video.currentTime;
        }
      }
      animationFrameId = requestAnimationFrame(syncLoop);
    };

    animationFrameId = requestAnimationFrame(syncLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [videoLoaded, duration]);

  // ── 1. Scroll INSIDE the Box: Continuous Play & Continuous Rewind ──
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const handleWheelInsideBox = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const video = videoRef.current;
      if (!duration || !video) return;

      if (e.deltaY > 0) {
        // SCROLLING DOWN (FORWARD): Play continuously from 0 to end
        // Adjust speed dynamically to match scroll intensity
        const scrollSpeed = Math.min(Math.max(Math.abs(e.deltaY) / 65, 1.0), 3.0);
        video.playbackRate = scrollSpeed;

        if (video.paused) {
          video.play().catch(() => {});
        }

        // Pause smoothly as soon as scrolling stops
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          if (!isPlaying && videoRef.current) {
            videoRef.current.pause();
          }
        }, 160);
      } else if (e.deltaY < 0) {
        // SCROLLING UP (BACKWARD): Rewind continuously
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        if (!video.paused) {
          video.pause();
        }

        // Fine continuous rewind step
        const rewindStep = (Math.abs(e.deltaY) / 100) * 0.06;
        let prevTime = video.currentTime - rewindStep;
        if (prevTime < 0) prevTime = ((duration + prevTime) % duration);

        video.currentTime = prevTime;
        setCurrentTime(prevTime);
        targetTimeRef.current = prevTime;
      }
    };

    box.addEventListener('wheel', handleWheelInsideBox, { passive: false });
    return () => {
      box.removeEventListener('wheel', handleWheelInsideBox);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [duration, isPlaying]);

  // ── 2. Scroll OUTSIDE the Box: Video Remains at Starting Point (0s / 0°) ──
  useEffect(() => {
    const handleOutsideScroll = () => {
      if (!isPlaying) {
        const video = videoRef.current;
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
        targetTimeRef.current = 0;
        setCurrentTime(0);
      }
    };

    window.addEventListener('scroll', handleOutsideScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleOutsideScroll);
  }, [isPlaying]);

  // ── Direct Drag / Swipe Scrubbing on Video ──
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startTimeRef.current = videoRef.current ? videoRef.current.currentTime : 0;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !duration || !videoRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startXRef.current;

    // Smooth continuous scrub
    const timeDelta = (deltaX / 280) * duration;
    let newTime = (startTimeRef.current - timeDelta) % duration;
    if (newTime < 0) newTime += duration;

    videoRef.current.currentTime = newTime;
    targetTimeRef.current = newTime;
    setCurrentTime(newTime);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // ── Play / Pause Video ──
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.playbackRate = playbackSpeed;
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  // ── Scrub Slider Change ──
  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    targetTimeRef.current = val;
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
    setIsPlaying(false);
  };

  // ── Reset Video to Start ──
  const handleReset = () => {
    setIsPlaying(false);
    targetTimeRef.current = 0;
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // ── Toggle Playback Speed ──
  const toggleSpeed = () => {
    const nextSpeed = playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 0.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  // Compute rotation angle representation
  const angleDegrees = duration > 0 ? Math.round((currentTime / duration) * 360) : Math.round(scrollProgress * 360);

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
          FOREGROUND CONTENT: SCROLL-DRIVEN ROTATING CHARACTER VIDEO
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold border backdrop-blur-md ${
              isDark
                ? 'bg-black/60 border-accent/40 text-accent shadow-[0_0_20px_rgba(31,223,100,0.2)]'
                : 'bg-white/80 border-emerald-500/40 text-emerald-700 shadow-sm'
            }`}
          >
            <FaCompass className="text-accent animate-spin duration-3000" />
            <span>Scroll-Driven 360° Character Turnaround</span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Interactive Persona Scrub
          </h2>
        </div>

        {/* ── Main Video Container with Drag Support (Outer Glassy Frame) ── */}
        <div
          ref={boxRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="relative w-full max-w-lg sm:max-w-xl h-[500px] sm:h-[580px] md:h-[640px] rounded-3xl overflow-hidden border shadow-2xl flex items-center justify-center backdrop-blur-xl group transition-all cursor-ew-resize active:cursor-grabbing select-none"
          style={{
            backgroundColor: isDark ? 'rgba(5, 7, 10, 0.7)' : 'rgba(248, 250, 252, 0.8)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(226, 232, 240, 0.9)',
            boxShadow: isDark
              ? '0 30px 60px -15px rgba(0, 0, 0, 0.95), 0 0 45px rgba(31, 223, 100, 0.15)'
              : '0 25px 50px -15px rgba(0, 0, 0, 0.12), 0 0 30px rgba(16, 185, 129, 0.12)',
          }}
          title="Scroll or drag inside to spin 360°"
        >
          {/* Active Video Element: Fitted edge-to-edge, cropped from bottom, top preserved */}
          <video
            ref={videoRef}
            src="/assets/character-360.mp4"
            playsInline
            muted
            loop
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={() => {
              if (videoRef.current && isPlaying) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onError={handleVideoError}
            className={`w-full h-full object-cover object-top pointer-events-none transition-opacity duration-500 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Placeholder when video is loading or fallback */}
          {(!videoLoaded || videoError) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <img
                src="/assets/profile.png"
                alt="MFA Naseef Sharaf"
                className="w-full h-full object-cover object-top opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                <div className="px-5 py-2.5 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-md text-xs font-mono text-accent flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span>Loading 360° Persona...</span>
                </div>
              </div>
            </div>
          )}

          {/* Top Indicators inside Glassy Frame */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase border border-white/15 bg-black/60 backdrop-blur-md text-gray-300 shadow-md">
              Scroll Inside Box to Rotate
            </span>
          </div>

          <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider border border-accent/40 bg-black/60 backdrop-blur-md text-accent shadow-md">
              {angleDegrees}°
            </span>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              GLASS EFFECT NAME OVERLAY (In Front of Video)
             ══════════════════════════════════════════════════════════════ */}
          <div className="absolute inset-x-0 bottom-0 pt-28 pb-7 px-4 sm:px-6 flex flex-col items-center justify-end text-center pointer-events-none z-20 bg-gradient-to-t from-black/90 via-black/45 to-transparent">
            <div
              className="font-display font-extrabold uppercase tracking-[0.14em] sm:tracking-[0.2em] leading-tight select-none"
              style={{
                fontSize: 'clamp(1.85rem, 5.5vw, 3.25rem)',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.6) 45%, rgba(31, 223, 100, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 45%, rgba(52, 211, 153, 1) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 3px 12px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 28px rgba(31, 223, 100, 0.45))',
              }}
            >
              MFA NASEEF SHARAF
            </div>

            <div
              className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] uppercase border backdrop-blur-md shadow-2xl"
              style={{
                backgroundColor: isDark ? 'rgba(10, 12, 16, 0.75)' : 'rgba(15, 23, 42, 0.8)',
                borderColor: 'rgba(31, 223, 100, 0.4)',
                color: '#10b981',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>COMPUTER ENGINEER × CREATIVE DEVELOPER</span>
            </div>
          </div>

          {/* Inner Glass Rim Highlight */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/10 z-30" />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SCRUBBER TIMELINE BAR (Matching Reference Image)
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-xl mt-6 px-4 space-y-3 z-20">
          
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
              max={duration || 10}
              step="0.02"
              value={currentTime}
              onChange={handleSliderChange}
              onMouseDown={() => { isDraggingRef.current = true; }}
              onMouseUp={() => { isDraggingRef.current = false; }}
              onTouchStart={() => { isDraggingRef.current = true; }}
              onTouchEnd={() => { isDraggingRef.current = false; }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1fdf64]"
            />
          </div>

          {/* Controls Strip */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl border text-xs font-mono font-medium backdrop-blur-md transition-all ${
                  isPlaying
                    ? 'bg-accent text-midnight font-bold border-accent shadow-md shadow-accent/20'
                    : isDark
                    ? 'bg-evening border-white/10 text-white hover:border-accent'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:border-emerald-500'
                }`}
              >
                {isPlaying ? <FaPause className="text-[10px]" /> : <FaPlay className="text-[10px]" />}
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                onClick={toggleSpeed}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold backdrop-blur-md transition-all ${
                  playbackSpeed !== 1
                    ? 'bg-accent/20 text-accent border-accent/40'
                    : isDark
                    ? 'bg-evening border-white/10 text-gray-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              <button
                onClick={handleReset}
                className={`p-2 rounded-xl border text-xs backdrop-blur-md transition-all ${
                  isDark
                    ? 'bg-evening border-white/10 text-gray-400 hover:text-white hover:border-accent'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                title="Reset to Start"
                aria-label="Reset Video"
              >
                <FaSyncAlt className="text-[10px]" />
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-light-gray">
              <FaInfoCircle className="text-accent text-[10px]" />
              <span>{currentTime.toFixed(1)}s / {(duration || 0).toFixed(1)}s</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
