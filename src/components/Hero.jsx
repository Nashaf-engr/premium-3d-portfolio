import { useState, useEffect } from 'react';
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { LuArrowUpRight } from 'react-icons/lu';

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
    <section id="home" className="relative w-full rounded-2xl overflow-hidden mb-4">
      {/* ── Banner Container ── */}
      <div
        className={`relative min-h-[22rem] sm:min-h-[24rem] md:min-h-[26rem] w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-colors duration-300 ${
          isDark
            ? 'bg-fixed bg-cover bg-center'
            : 'bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 border border-slate-200'
        }`}
        style={
          isDark
            ? {
                backgroundImage: "url('/assets/background.png')",
                backgroundRepeat: 'no-repeat',
              }
            : {}
        }
      >
        {/* Dark Gradient Overlay (Only in dark mode) */}
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-black/60 to-black/30 pointer-events-none z-0" />
        )}

        {/* ── Translucent Hero Card ── */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 flex-1 flex items-center">
          <div
            className={`w-full p-6 sm:p-8 md:p-10 rounded-2xl flex items-center justify-between gap-6 shadow-2xl transition-all duration-300 ${
              isDark
                ? 'bg-black/45 backdrop-blur-md border border-white/10 text-white'
                : 'bg-white/80 backdrop-blur-md border border-slate-200/90 text-slate-900 shadow-sm'
            }`}
          >
            {/* Left Content */}
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent font-bold block">
                Portfolio Showcase
              </span>

              <h1
                className={`text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight leading-tight ${
                  isDark ? '!text-white' : 'text-slate-900'
                }`}
              >
                Hello, Check This Out!
              </h1>

              {/* Code-style Tagline with Typewriter */}
              <div
                className={`py-2 font-mono text-sm sm:text-base md:text-lg flex items-center flex-wrap gap-1 ${
                  isDark ? '!text-white' : 'text-slate-800'
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

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
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
                  className="bg-accent hover:bg-accent/80 !text-midnight text-sm sm:text-base font-bold px-7 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(31,223,100,0.35)] hover:scale-105"
                >
                  Explore
                </a>
                <a
                  href="/assets/Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className={`text-sm sm:text-base font-medium px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    isDark
                      ? 'border border-white/20 hover:border-accent/50 bg-white/5 hover:bg-white/10 !text-white'
                      : 'border border-slate-300 hover:border-accent bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Resume</span>
                  <LuArrowUpRight className="text-accent text-base" />
                </a>
              </div>
            </div>

            {/* Right Profile Portrait Frame */}
            <div className="w-36 h-40 sm:w-44 sm:h-48 md:w-52 md:h-56 relative hidden md:block shrink-0">
              <div
                className={`w-full h-full rounded-2xl overflow-hidden border-2 p-1 backdrop-blur-sm group transition-all duration-300 ${
                  isDark
                    ? 'border-accent/60 shadow-[0_0_30px_rgba(31,223,100,0.25)] bg-evening/80 hover:border-accent'
                    : 'border-emerald-500/60 shadow-lg bg-white/80 hover:border-emerald-500'
                }`}
              >
                <img
                  src="/assets/profile.png"
                  alt="MFA Naseef Sharaf"
                  className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/assets/profile.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Strip Across Bottom ── */}
        <div
          className={`relative z-10 border-t backdrop-blur-md py-4 px-6 sm:px-8 transition-colors duration-300 ${
            isDark
              ? 'bg-midnight/90 border-white/10'
              : 'bg-slate-100/90 border-slate-200'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-between">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-base sm:text-lg md:text-xl text-accent font-bold font-display">
                  {stat.value}
                </span>
                <span
                  className={`text-xs font-mono ${
                    isDark ? '!text-gray-300' : 'text-slate-600'
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
        className={`border rounded-xl mt-3 p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-md transition-colors duration-300 ${
          isDark
            ? 'bg-deep border-white/5'
            : 'bg-white border-slate-200'
        }`}
      >
        <span
          className={`text-xs font-mono ${
            isDark ? 'text-light-gray' : 'text-slate-500'
          }`}
        >
          Connect with MFA Naseef:
        </span>
        <div className="flex items-center gap-2.5">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all text-xs ${
                isDark
                  ? 'bg-evening border-white/10 text-light-gray hover:text-accent hover:border-accent/40'
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
