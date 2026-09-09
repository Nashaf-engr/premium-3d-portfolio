import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import {
  FaHome,
  FaUser,
  FaFolderOpen,
  FaEnvelope,
  FaPlus,
  FaTimes,
  FaBars,
  FaSun,
  FaMoon,
  FaGraduationCap,
  FaCertificate,
  FaComments,
  FaThLarge,
  FaLaptopCode,
} from 'react-icons/fa';

const navLinks = [
  { label: 'Home', id: 'home', icon: FaHome },
  { label: 'About', id: 'about', icon: FaUser },
  { label: 'Expertise', id: 'expertise', icon: FaThLarge },
  { label: 'Skills', id: 'skills', icon: FaLaptopCode },
  { label: 'Portfolio', id: 'work', icon: FaFolderOpen },
  { label: 'Education', id: 'education', icon: FaGraduationCap },
  { label: 'Certificates', id: 'certifications', icon: FaCertificate },
  { label: 'Reviews', id: 'reviews', icon: FaComments },
  { label: 'Contact', id: 'contact', icon: FaEnvelope },
];

export default function Navbar({ theme, setTheme, onAddTestimonial }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showNavbar, setShowNavbar] = useState(true);

  const [formData, setFormData] = useState({ name: '', role: '', message: '' });

  const lastScrollY = useRef(0);
  const overlayRef = useRef(null);
  const drawerRef = useRef(null);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auto-hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY.current) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.id);
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Drawer animation
  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    requestAnimationFrame(() => {
      if (overlayRef.current && drawerRef.current) {
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        gsap.to(drawerRef.current, { x: 0, duration: 0.35, ease: 'power3.out' });
      }
    });
  }, []);

  const closeDrawer = useCallback(() => {
    if (drawerRef.current && overlayRef.current) {
      gsap.to(drawerRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => setIsDrawerOpen(false),
      });
    } else {
      setIsDrawerOpen(false);
    }
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    closeDrawer();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const yOffset = -70;
      const y = targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    onAddTestimonial({
      name: formData.name,
      role: formData.role || 'Client',
      message: formData.message,
      avatar: '/assets/icon.png',
    });

    setFormData({ name: '', role: '', message: '' });
    setIsModalOpen(false);
  };

  return (
    <>
      {/* ═══════════════ Top Fixed Navbar ═══════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-transform duration-300 ${
          showNavbar ? 'translate-y-0' : '-translate-y-full'
        } ${
          theme === 'dark'
            ? 'bg-midnight/90 backdrop-blur-md border-b border-white/10 text-white'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-9 h-9 rounded-full bg-accent text-midnight flex items-center justify-center font-display font-bold text-sm shadow-[0_0_15px_rgba(31,223,100,0.3)] group-hover:scale-105 transition-transform">
              NS
            </div>
            <div className="flex flex-col">
              <span
                className={`font-display font-bold text-sm sm:text-base tracking-tight transition-colors ${
                  theme === 'dark'
                    ? 'text-white group-hover:text-accent'
                    : 'text-slate-900 group-hover:text-green-600'
                }`}
              >
                Naseef Sharaf
              </span>
              <span
                className={`text-[10px] font-mono -mt-0.5 tracking-wider hidden sm:block ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'
                }`}
              >
                ENGINEER × DESIGNER
              </span>
            </div>
          </a>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    isActive
                      ? 'bg-accent text-midnight font-bold shadow-[0_0_12px_rgba(31,223,100,0.3)]'
                      : theme === 'dark'
                      ? 'text-zinc-300 hover:text-white hover:bg-white/10'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                theme === 'dark'
                  ? 'border-white/10 bg-evening text-zinc-300 hover:text-accent hover:border-accent/40'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:text-slate-950 hover:border-slate-400'
              }`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </button>

            {/* Add Review Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-accent hover:bg-accent/80 text-midnight font-display font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(31,223,100,0.2)]"
            >
              <FaPlus className="text-[10px]" />
              <span>Add Review</span>
            </button>

            {/* Hamburger Button for Drawer Menu */}
            <button
              onClick={openDrawer}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 ${
                theme === 'dark'
                  ? 'border-accent/40 hover:border-accent text-accent bg-midnight'
                  : 'border-green-500 text-green-600 bg-green-50 hover:bg-green-100'
              }`}
              aria-label="Open Navigation"
            >
              <FaBars className="text-sm" />
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════ Sliding Navigation Drawer ═══════════════ */}
      {isDrawerOpen && (
        <>
          {/* Overlay Backdrop */}
          <div
            ref={overlayRef}
            onClick={closeDrawer}
            className="fixed inset-0 z-[50000] bg-black/60 backdrop-blur-sm transition-opacity"
            style={{ opacity: 0 }}
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            className={`fixed right-0 top-0 h-screen w-72 sm:w-80 shadow-2xl z-[50001] flex flex-col border-l ${
              theme === 'dark'
                ? 'bg-deep border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            style={{ transform: 'translateX(100%)' }}
          >
            {/* Drawer Header */}
            <div
              className={`h-16 flex items-center justify-between px-6 shrink-0 border-b ${
                theme === 'dark'
                  ? 'bg-midnight border-white/5'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent text-midnight flex items-center justify-center font-bold text-xs">
                  NS
                </div>
                <span className="text-xs font-mono uppercase tracking-widest font-bold">
                  Navigation
                </span>
              </div>
              <button
                onClick={closeDrawer}
                className="text-light-gray hover:text-accent transition-colors p-1.5 rounded-lg border border-white/10 hover:border-accent/40"
                aria-label="Close Navigation"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1.5 px-4 py-6 flex-1 overflow-y-auto no-scrollbar">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`flex items-center gap-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent text-midnight font-bold tracking-wide shadow-[0_0_15px_rgba(31,223,100,0.3)]'
                        : theme === 'dark'
                        ? 'text-zinc-300 hover:bg-evening hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Icon className="text-base shrink-0" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div
              className={`p-4 border-t space-y-3 shrink-0 ${
                theme === 'dark'
                  ? 'bg-midnight border-white/5'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <button
                onClick={() => {
                  closeDrawer();
                  setTimeout(() => setIsModalOpen(true), 300);
                }}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-midnight font-semibold font-display text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all"
              >
                <FaPlus className="text-xs" />
                Add Review / Testimonial
              </button>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════ Testimonial Form Modal ═══════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div
            className={`border w-full max-w-md p-6 sm:p-8 rounded-2xl relative shadow-2xl ${
              theme === 'dark'
                ? 'bg-deep border-white/10 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 hover:border-accent/50 flex items-center justify-center transition-colors text-light-gray hover:text-accent"
            >
              <FaTimes className="text-sm" />
            </button>

            <h3 className="font-display font-bold text-xl mb-1">
              Add Recommendation
            </h3>
            <p className="text-xs text-light-gray mb-5">
              Submit your feedback to display on the live recommendations section.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-light-gray mb-1 font-mono">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-light-gray mb-1 font-mono">
                  Role / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Co-Founder, Tech Lead"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-light-gray mb-1 font-mono">
                  Message
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Your feedback or testimonial..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent/80 text-midnight font-display font-semibold py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(31,223,100,0.2)]"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
