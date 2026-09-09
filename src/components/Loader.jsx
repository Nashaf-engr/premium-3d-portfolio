import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const obj = { value: 0 };
    const counterTween = gsap.to(obj, {
      value: 100,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(Math.floor(obj.value));
      },
      onComplete: () => {
        const tl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });

        tl.to(logoRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in'
        })
        .to(counterRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in'
        }, '<')
        .to(containerRef.current, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 0.6,
          ease: 'power4.inOut'
        }, '-=0.2');
      }
    });

    gsap.fromTo(logoRef.current, 
      { scale: 0.9, opacity: 0.7 },
      { scale: 1.05, opacity: 1, repeat: -1, yoyo: true, duration: 0.8, ease: 'sine.inOut' }
    );

    return () => {
      counterTween.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center gap-8 z-10">
        <div 
          ref={logoRef} 
          className="relative w-24 h-24 rounded-full flex items-center justify-center border border-white/10 bg-deep shadow-[0_0_30px_rgba(31,223,100,0.15)]"
        >
          <span className="font-display font-bold text-3xl tracking-wider text-accent">NS</span>
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="46"
              className="stroke-gray-800 fill-none"
              strokeWidth="2"
            />
            <circle
              cx="48"
              cy="48"
              r="46"
              className="stroke-accent fill-none transition-all duration-75"
              strokeWidth="2"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)}
            />
          </svg>
        </div>

        <div ref={counterRef} className="flex flex-col items-center gap-2">
          <span className="font-display font-bold text-6xl tracking-tight text-snow">
            {progress}%
          </span>
          <span className="font-display text-xs tracking-[0.25em] text-light-gray uppercase font-mono">
            MFA Naseef Sharaf
          </span>
        </div>
      </div>
    </div>
  );
}
