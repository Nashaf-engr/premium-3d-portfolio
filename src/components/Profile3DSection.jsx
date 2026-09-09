import { useEffect, useRef, useState, useCallback } from 'react';
import { FaPlay, FaPause, FaSyncAlt, FaCompass, FaVideo, FaInfoCircle } from 'react-icons/fa';

export default function Profile3DSection({ theme = 'dark' }) {
  const sectionRef = useRef(null);
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

  // ── Smooth Scroll-Scrubbing Loop ──
  useEffect(() => {
    let animationFrameId;

    const smoothScrub = () => {
      const video = videoRef.current;
      if (video && videoLoaded && !isPlaying && !isDraggingRef.current && duration > 0) {
        const diff = targetTimeRef.current - video.currentTime;
        if (Math.abs(diff) > 0.02) {
          video.currentTime += diff * 0.18;
          setCurrentTime(video.currentTime);
        }
      }
      animationFrameId = requestAnimationFrame(smoothScrub);
    };

    animationFrameId = requestAnimationFrame(smoothScrub);
    return () => cancelAnimationFrame(animationFrameId);
  }, [videoLoaded, isPlaying, duration]);

  // ── Scroll Listener: Updates Target Video Time ──
  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section || isPlaying || !duration) return;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Trigger when section is in viewport
    if (rect.top <= windowHeight && rect.bottom >= 0) {
      const totalDistance = windowHeight + rect.height;
      const currentDistance = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

      setScrollProgress(progress);
      targetTimeRef.current = progress * duration;
    }
  }, [isPlaying, duration]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ── Direct Drag / Swipe Scrubbing on Video ──
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startTimeRef.current = videoRef.current ? videoRef.current.currentTime : 0;
    if (isPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !duration || !videoRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startXRef.current;

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
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
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
          <p
            className={`text-xs sm:text-sm max-w-lg font-mono ${
              isDark ? 'text-gray-400' : 'text-slate-600'
            }`}
          >
            Scroll the webpage or drag across the video to rotate the character in full 360 degrees.
          </p>
        </div>

        {/* ── Main Video Container with Drag Support ── */}
        <div
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="relative w-full max-w-xl h-[420px] sm:h-[500px] md:h-[560px] rounded-3xl overflow-hidden border shadow-2xl flex items-center justify-center backdrop-blur-xl group transition-all cursor-ew-resize active:cursor-grabbing"
          style={{
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(248, 250, 252, 0.6)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.8)',
          }}
          title="Drag horizontally to spin 360°"
        >
          {/* Active Video Element */}
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
            className={`w-full h-full object-contain pointer-events-none transition-opacity duration-500 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Placeholder when video is not loaded */}
          {(!videoLoaded || videoError) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 pointer-events-none">
              <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-accent/60 shadow-[0_0_30px_rgba(31,223,100,0.25)] relative group-hover:scale-105 transition-transform">
                <img
                  src="/assets/profile.png"
                  alt="MFA Naseef Sharaf"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center pb-2">
                  <span className="text-[11px] font-mono text-accent font-bold">Loading Video...</span>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border backdrop-blur-md max-w-md text-xs font-mono space-y-1.5 ${
                  isDark
                    ? 'bg-black/70 border-white/10 text-gray-300'
                    : 'bg-white/90 border-slate-200 text-slate-700 shadow-md'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-accent font-bold">
                  <FaVideo className="text-sm" />
                  <span>Google Flow Turnaround Video</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Video loaded from <code className="text-accent bg-black/40 px-1.5 py-0.5 rounded">public/assets/character-360.mp4</code>.
                </p>
              </div>
            </div>
          )}
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
