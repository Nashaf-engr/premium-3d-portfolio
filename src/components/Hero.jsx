import { useState, useEffect } from 'react';
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { LuArrowUpRight } from 'react-icons/lu';
import Hero3DCanvas from './Hero3DCanvas';

const roles = [
  'Creative Developer',
  'UI/UX Designer',
  'Computer Engineer',
  'Front-End Specialist',
];

export default function Hero({ theme = 'dark' }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let typingSpeed = isDeleting ? 35 : 75;

    if (!isDeleting && text === currentRole) {
      const pauseTimeout = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(pauseTimeout);
    } else if (isDeleting && text === '') {
      const switchTimeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, 250);
      return () => clearTimeout(switchTimeout);
    }

    const timer = setTimeout(() => {
      setText((prev) =>
        isDeleting
          ? currentRole.substring(0, prev.length - 1)
          : currentRole.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex]);

  const socialLinks = [
    { icon: <FaWhatsapp />, url: 'https://wa.me/94720243581?text=Hello%20Naseef%2C%20I%20visited%20your%20portfolio.', label: 'WhatsApp' },
    { icon: <FaLinkedinIn />, url: 'https://www.linkedin.com/in/naseef-sharaf-mfa-291293346/', label: 'LinkedIn' },
    { icon: <FaGithub />, url: 'https://github.com/Nashaf-engr', label: 'GitHub' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/itz.ur.nx_shx_f', label: 'Instagram' },
  ];

  const stats = [
    { value: '5+', label: 'Completed Projects' },
    { value: '8+', label: 'Certifications' },
    { value: '3+', label: 'Design Tools Mastered' },
    { value: '1st', label: 'Engineering Undergraduate' },
  ];

  const isDark = theme === 'dark';

  return (
    <section id="home" className="relative w-full rounded-3xl overflow-hidden mb-6 pt-2">
      {/* ── Outer Hero Card Container ── */}
      <div
        className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 backdrop-blur-xl ${
          isDark
            ? 'bg-midnight/70 border-white/10 text-white shadow-black/40'
            : 'bg-white/80 border-slate-200/90 text-slate-900 shadow-slate-200/50'
        }`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className={`absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none blur-3xl ${
            isDark ? 'bg-accent/10' : 'bg-emerald-400/15'
          }`}
        />

        {/* ── Main Split-Screen Grid: Content + 360° 3D Interactive Presentation ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 md:p-12">
          
          {/* Left Column: Typography, Story, Badges & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Status Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border backdrop-blur-md ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-accent'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>Faculty of Engineering • UoP</span>
              </div>

              <span
                className={`text-xs font-mono hidden sm:inline ${
                  isDark ? 'text-gray-400' : 'text-slate-500'
                }`}
              >
                ● Available for High-Impact Projects
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <span
                className={`text-xs uppercase tracking-[0.25em] font-mono font-bold block ${
                  isDark ? 'text-gray-400' : 'text-slate-500'
                }`}
              >
                Creative Developer & Engineer
              </span>
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.1] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                MFA Naseef Sharaf
              </h1>
            </div>

            {/* Code-style Tagline with Typewriter */}
            <div
              className={`py-2 px-3.5 rounded-xl font-mono text-sm sm:text-base md:text-lg inline-flex items-center flex-wrap gap-1.5 border backdrop-blur-sm ${
                isDark
                  ? 'bg-evening/70 border-white/10 text-white'
                  : 'bg-slate-100/80 border-slate-200 text-slate-800'
              }`}
            >
              <span>
                &lt;<span className="text-accent font-bold">div</span>&gt;
              </span>
              <span className="font-medium">I am a </span>
              <span className="font-bold inline-block">
                {text}
                <span className="text-accent animate-pulse font-bold ml-0.5">|</span>
              </span>
              <span>
                &lt;/<span className="text-accent font-bold">div</span>&gt;
              </span>
            </div>

            {/* Brief Positioning Narrative */}
            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-xl ${
                isDark ? 'text-gray-300' : 'text-slate-600'
              }`}
            >
              Undergraduate in Computer Engineering at the University of Peradeniya. Blending structural software logic and algorithmic rigor with 3D immersive web experiences, motion storytelling, and human-centered design.
            </p>

            {/* Call to Actions & Profile Badge */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('about');
                  if (target) {
                    const y = target.getBoundingClientRect().top + window.scrollY - 70;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="bg-accent hover:bg-accent/80 !text-midnight text-sm sm:text-base font-bold px-8 py-3 rounded-2xl transition-all shadow-[0_0_25px_rgba(31,223,100,0.35)] hover:scale-105 active:scale-95"
              >
                Explore Portfolio
              </a>

              <a
                href="/assets/Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className={`text-sm sm:text-base font-medium px-6 py-3 rounded-2xl transition-all flex items-center gap-2 border ${
                  isDark
                    ? 'border-white/20 hover:border-accent bg-white/5 hover:bg-white/10 text-white'
                    : 'border-slate-300 hover:border-emerald-500 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
                }`}
              >
                <span>Full Resume</span>
                <LuArrowUpRight className="text-accent text-base" />
              </a>

              {/* Mini Profile Badge */}
              <div
                className={`flex items-center gap-3 px-3.5 py-1.5 rounded-2xl border backdrop-blur-md ${
                  isDark ? 'bg-evening/60 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-accent/60 shrink-0">
                  <img
                    src="/assets/profile.png"
                    alt="MFA Naseef Sharaf"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.src = '/assets/profile.jpg';
                    }}
                  />
                </div>
                <div className="text-[11px] font-mono leading-tight">
                  <span className={`block font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Naseef Sharaf
                  </span>
                  <span className="text-accent">Sri Lanka</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 360° Interactive 3D Presentation Canvas (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Hero3DCanvas theme={theme} />
          </div>
        </div>

        {/* ── Stats Strip Across Bottom ── */}
        <div
          className={`relative z-10 border-t py-4 px-6 sm:px-8 md:px-12 backdrop-blur-md transition-colors ${
            isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100/80 border-slate-200'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-between">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <span className="text-lg sm:text-xl md:text-2xl text-accent font-bold font-display">
                  {stat.value}
                </span>
                <span
                  className={`text-xs font-mono ${
                    isDark ? 'text-gray-300' : 'text-slate-600'
                  }`}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Social Links Toolbar ── */}
      <div
        className={`border rounded-2xl mt-3 p-3 px-5 flex flex-wrap items-center justify-between gap-3 shadow-md backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-midnight/70 border-white/10 text-white'
            : 'bg-white/80 border-slate-200 text-slate-800'
        }`}
      >
        <span
          className={`text-xs font-mono ${
            isDark ? 'text-gray-400' : 'text-slate-500'
          }`}
        >
          Connect directly with MFA Naseef:
        </span>
        <div className="flex items-center gap-2.5">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all text-xs ${
                isDark
                  ? 'bg-evening border-white/10 text-gray-300 hover:text-accent hover:border-accent/40'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-green-600 hover:border-green-400'
              }`}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
