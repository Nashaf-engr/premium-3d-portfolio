import { useEffect, useRef, useState, useCallback } from 'react';
import { FaPlay, FaPause, FaSyncAlt, FaCompass, FaVideo, FaInfoCircle, FaVolumeUp, FaVolumeMute, FaMicrophone } from 'react-icons/fa';

export default function Profile3DSection({ theme = 'dark' }) {
  const sectionRef = useRef(null);
  const boxRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [duration, setDuration] = useState(10);
  const [currentTime, setCurrentTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const targetTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);

  const isDark = theme === 'dark';

  // ── Video Metadata Loaded ──
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 10;
      setDuration(dur);
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.defaultPlaybackRate = playbackSpeed;
      videoRef.current.muted = isMuted;
      setVideoLoaded(true);
      setVideoError(false);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoaded(false);
  };

  const scrollTimeoutRef = useRef(null);
  const isSeekingRef = useRef(false);

  // ── High-Speed Non-Blocking Video Seek for Backward Scrubbing ──
  const performSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || !duration) return;

    if (isSeekingRef.current || video.seeking) return; // Prevent seek queue buildup

    const target = targetTimeRef.current;
    if (Math.abs(video.currentTime - target) > 0.015) {
      isSeekingRef.current = true;
      video.currentTime = target;
    }
  }, [duration]);

  // When browser decoder finishes current seek, catch up immediately to latest target
  const handleSeeked = () => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    if (!video || !duration) return;

    const target = targetTimeRef.current;
    if (video.paused && Math.abs(video.currentTime - target) > 0.02) {
      isSeekingRef.current = true;
      video.currentTime = target;
    }
  };

  // ── Continuous 60fps Sync Loop: Slider & Angle Progress Smoothly from 0 to End ──
  useEffect(() => {
    let animationFrameId;

    const syncLoop = () => {
      const video = videoRef.current;
      if (video && videoLoaded && duration > 0) {
        // Only sync from video.currentTime while playing forward natively
        if (!video.paused && !isDraggingRef.current) {
          if (video.currentTime >= duration - 0.06) {
            video.pause();
            video.currentTime = duration;
            targetTimeRef.current = duration;
            setCurrentTime(duration);
            setIsPlaying(false);
          } else {
            setCurrentTime(video.currentTime);
            targetTimeRef.current = video.currentTime;
          }
        }
      }
      animationFrameId = requestAnimationFrame(syncLoop);
    };

    animationFrameId = requestAnimationFrame(syncLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [videoLoaded, duration]);

  // ── 1. Scroll INSIDE the Box: Continuous Play & Instant Backward Rewind ──
  // Hands off natural page scroll once a full rotation (360°) or start (0°) is reached
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const handleWheelInsideBox = (e) => {
      const video = videoRef.current;
      if (!duration || !video) return;

      if (e.deltaY > 0) {
        // SCROLLING DOWN (FORWARD)
        // If full rotation complete (at or past 360° / duration), allow natural page scroll down
        if (targetTimeRef.current >= duration - 0.06 || video.currentTime >= duration - 0.06 || video.ended) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        // Play continuously from current time up to end
        const scrollSpeed = Math.min(Math.max((Math.abs(e.deltaY) / 60) * playbackSpeed, 1.0), 3.0);
        video.playbackRate = scrollSpeed;

        if (video.paused) {
          video.play().catch(() => {});
        }

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          if (!isPlaying && videoRef.current) {
            videoRef.current.pause();
          }
        }, 150);
      } else if (e.deltaY < 0) {
        // SCROLLING UP (BACKWARD)
        // If already at starting point (0s / 0°), allow natural page scroll up
        if (targetTimeRef.current <= 0.03 || video.currentTime <= 0.03) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        if (!video.paused) {
          video.pause();
        }

        // Responsive rewind without seek lag
        const rewindSpeed = Math.min(Math.max(Math.abs(e.deltaY) / 60, 1.0), 3.0);
        const rewindStep = (duration * 0.03) * rewindSpeed;

        let prevTime = Math.max(0, targetTimeRef.current - rewindStep);

        targetTimeRef.current = prevTime;
        setCurrentTime(prevTime);
        performSeek();
      }
    };

    box.addEventListener('wheel', handleWheelInsideBox, { passive: false });
    return () => {
      box.removeEventListener('wheel', handleWheelInsideBox);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [duration, isPlaying, performSeek]);

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

    // Smooth continuous scrub (fast 140px per 360° turnaround, clamped between 0 and duration)
    const timeDelta = (deltaX / 140) * duration;
    let newTime = Math.min(duration, Math.max(0, startTimeRef.current - timeDelta));

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
      // If already at end, restart from 0 for a fresh playthrough
      if (video.currentTime >= duration - 0.08) {
        video.currentTime = 0;
        targetTimeRef.current = 0;
        setCurrentTime(0);
      }
      video.playbackRate = playbackSpeed;
      video.muted = isMuted;
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        // Fallback to muted if browser blocks unmuted playback
        console.warn("Unmuted autoplay restricted, playing muted:", err);
        video.muted = true;
        setIsMuted(true);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
    }
  };

  // ── Toggle Audio / Voice Mute ──
  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
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
  const handleReset = (e) => {
    if (e) e.stopPropagation();
    setIsPlaying(false);
    targetTimeRef.current = 0;
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // ── Toggle Playback Speed ──
  const toggleSpeed = (e) => {
    if (e) e.stopPropagation();
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length] || 1;
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
          FOREGROUND CONTENT: INTERACTIVE BROADCAST INTRODUCTION VIDEO
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
            <FaVideo className="text-accent animate-pulse" />
            <span>Interactive Broadcast Introduction</span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Welcome to My Portfolio
          </h2>
        </div>

        {/* ── Main Video Container with Drag/Click Support (16:9 Landscape Frame) ── */}
        <div
          ref={boxRef}
          onClick={togglePlay}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="relative mx-auto w-full max-w-4xl lg:max-w-5xl rounded-3xl overflow-hidden border shadow-2xl flex items-center justify-center backdrop-blur-xl group transition-all cursor-pointer select-none"
          style={{
            aspectRatio: '16 / 9',
            backgroundColor: isDark ? 'rgba(5, 7, 10, 0.85)' : 'rgba(248, 250, 252, 0.95)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(226, 232, 240, 0.9)',
            boxShadow: isDark
              ? '0 30px 60px -15px rgba(0, 0, 0, 0.95), 0 0 50px rgba(31, 223, 100, 0.12)'
              : '0 25px 50px -15px rgba(0, 0, 0, 0.12), 0 0 30px rgba(16, 185, 129, 0.12)',
          }}
          title="Click to play or pause introduction with voice"
        >
          {/* Active Video Element: Native 16:9 Landscape, 100% uncropped */}
          <video
            ref={videoRef}
            src="/assets/intro-widescreen.mp4"
            poster="/assets/intro-poster.jpg"
            playsInline
            muted={isMuted}
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              if (duration > 0) {
                targetTimeRef.current = duration;
                setCurrentTime(duration);
              }
            }}
            onTimeUpdate={() => {
              if (videoRef.current && isPlaying) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onError={handleVideoError}
            onSeeked={handleSeeked}
            className={`w-full h-full object-contain object-center transition-opacity duration-500 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              aspectRatio: '16 / 9',
            }}
          />

          {/* Big Center Play Button Overlay when Paused */}
          {!isPlaying && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="absolute z-25 p-6 sm:p-7 rounded-full bg-black/70 border border-accent/50 text-accent hover:bg-accent hover:text-midnight hover:scale-110 shadow-[0_0_40px_rgba(31,223,100,0.5)] backdrop-blur-md transition-all duration-300 group cursor-pointer"
              title="Play Introduction with Voice"
              aria-label="Play Introduction with Voice"
            >
              <FaPlay className="text-2xl sm:text-3xl ml-1 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {/* Floating Unmute Helper Badge if Playing while Muted */}
          {isPlaying && isMuted && (
            <button
              onClick={toggleMute}
              className="absolute top-16 sm:top-20 z-25 px-4 py-2 rounded-full bg-accent text-midnight font-bold text-xs font-mono shadow-[0_0_25px_rgba(31,223,100,0.6)] animate-pulse hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              title="Click to hear voice"
            >
              <FaVolumeUp className="text-sm" />
              <span>Tap to Hear Voice</span>
            </button>
          )}

          {/* Placeholder when video is loading or fallback */}
          {(!videoLoaded || videoError) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <img
                src="/assets/intro-poster.jpg"
                alt="MFA Naseef Sharaf"
                className="w-full h-full object-contain object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                <div className="px-5 py-2.5 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-md text-xs font-mono text-accent flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span>Loading Introduction...</span>
                </div>
              </div>
            </div>
          )}

          {/* Top Indicators inside Glassy Frame */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 pointer-events-none flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase border border-white/15 bg-black/75 backdrop-blur-md text-white shadow-md flex items-center gap-2">
              <FaMicrophone className="text-accent animate-pulse" />
              <span>Broadcast Briefing • 16:9 HD</span>
            </span>
          </div>

          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-wider border backdrop-blur-md transition-all flex items-center gap-2 shadow-md cursor-pointer ${
                isMuted
                  ? 'bg-black/75 border-red-500/40 text-red-400 hover:bg-black/90'
                  : 'bg-black/75 border-accent/50 text-accent hover:bg-black/90'
              }`}
              title={isMuted ? "Click to Unmute Voice" : "Voice is Live (Click to Mute)"}
            >
              {isMuted ? <FaVolumeMute className="text-xs" /> : <FaVolumeUp className="text-xs animate-pulse" />}
              <span>{isMuted ? 'Muted' : 'Voice Live'}</span>
            </button>
          </div>

          {/* Inner Glass Rim Highlight */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/10 z-30" />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SCRUBBER TIMELINE BAR & VOICE CONTROLS (16:9 Widescreen Width)
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto mt-6 px-2 space-y-3 z-20">
          
          {/* Timeline Status Strip */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span
                className={`font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}
              >
                Introduction Timeline
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded border border-white/10 text-[10px] font-mono text-gray-400">
                1080P WIDESCREEN
              </span>
              <div
                className={`px-3 py-1 rounded-full font-bold border ${
                  isDark
                    ? 'bg-evening/80 border-white/10 text-accent'
                    : 'bg-slate-100 border-slate-200 text-emerald-700'
                }`}
              >
                {currentTime.toFixed(1)}s / {(duration || 10).toFixed(1)}s
              </div>
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
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-mono font-medium backdrop-blur-md transition-all ${
                  isPlaying
                    ? 'bg-accent text-midnight font-bold border-accent shadow-md shadow-accent/20'
                    : isDark
                    ? 'bg-evening border-white/10 text-white hover:border-accent'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:border-emerald-500'
                }`}
              >
                {isPlaying ? <FaPause className="text-[10px]" /> : <FaPlay className="text-[10px]" />}
                <span>{isPlaying ? 'Pause' : 'Play Briefing'}</span>
              </button>

              <button
                onClick={toggleMute}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-mono font-medium backdrop-blur-md transition-all ${
                  !isMuted
                    ? 'bg-accent/20 text-accent border-accent/40 shadow-sm'
                    : isDark
                    ? 'bg-evening border-white/10 text-gray-400 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
                title="Toggle Voice / Audio"
              >
                {isMuted ? <FaVolumeMute className="text-[11px]" /> : <FaVolumeUp className="text-[11px] text-accent animate-pulse" />}
                <span>{isMuted ? 'Unmute' : 'Voice On'}</span>
              </button>

              <button
                onClick={toggleSpeed}
                className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold backdrop-blur-md transition-all ${
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
                className={`p-2.5 rounded-xl border text-xs backdrop-blur-md transition-all ${
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

            <div className="flex items-center gap-2 text-[11px] font-mono text-light-gray">
              <FaInfoCircle className="text-accent text-[10px]" />
              <span>{currentTime.toFixed(1)}s / {(duration || 10).toFixed(1)}s</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
