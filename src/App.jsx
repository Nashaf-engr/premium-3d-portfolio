import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Components
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import BackgroundEffects from './components/BackgroundEffects';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';

// Floating action icons
import { FaWhatsapp } from 'react-icons/fa';
import { LuArrowUp } from 'react-icons/lu';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [toasts, setToasts] = useState([]);
  
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return preferredDark ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);
  
  const defaultTestimonials = [
    {
      name: "Peradeniya AgriTech",
      role: "Co-Founder",
      message: "Outstanding engineering and eye for detail. The smart plant monitoring system was integrated flawlessly!",
      avatar: "/assets/icon.png"
    },
    {
      name: "Bistro Cafe",
      role: "Owner",
      message: "Naseef brought our restaurant layout to life with smooth animations. Highly recommend his creative stack.",
      avatar: "/assets/icon.png"
    },
    {
      name: "UOP Engineering Faculty",
      role: "Coordinator",
      message: "A brilliant student and designer. His care for code logic is matched by his graphic layouts.",
      avatar: "/assets/icon.png"
    },
    {
      name: "Destino Travel",
      role: "Manager",
      message: "Very easy to work with, responsive, and produced a beautiful travel agency website theme.",
      avatar: "/assets/icon.png"
    }
  ];

  // Testimonials State
  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('portfolio-testimonials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing testimonials from localStorage:", e);
      }
    }
    return defaultTestimonials;
  });

  // Load reviews from public/reviews.json
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/reviews.json');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews from reviews.json:", error);
      }
    };
    fetchReviews();
  }, []);

  // Save testimonials to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio-testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Initialise Lenis smooth scroll & AOS
  useEffect(() => {
    if (loading) return;

    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic'
    });

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 2
    });

    lenis.on('scroll', ScrollTrigger.update);
    
    const ticker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, [loading]);

  // Toast handler
  const handleShowToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, leaving: true } : t));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 220);
    }, 3200);
  };

  const handleAddTestimonial = async (newReview) => {
    setTestimonials((prev) => [newReview, ...prev]);
    handleShowToast('success', 'Submitting Review', 'Sending your review to GitHub...');

    try {
      const response = await fetch('/api/add-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newReview.name,
          role: newReview.role,
          message: newReview.message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        handleShowToast('success', 'Review Saved', 'Your review was saved to GitHub! It will display for everyone in a few minutes.');
      } else {
        if (response.status === 404) {
          handleShowToast('success', 'Review Added (Local)', 'Review added locally! (GitHub sync active in deployment).');
        } else {
          const errorMsg = result.error || 'Server error';
          handleShowToast('error', 'Sync Failed', `Added locally, could not sync to GitHub: ${errorMsg}`);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      handleShowToast('success', 'Review Added (Local)', 'Review added locally.');
    }
  };

  return (
    <>
      {loading ? (
        <Loader onComplete={() => setLoading(false)} />
      ) : (
        <div className={`min-h-screen w-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'} select-none selection:bg-accent selection:text-midnight font-sans overflow-x-hidden relative transition-colors duration-500`}>
          
          {/* Custom Cursor */}
          <CustomCursor />

          {/* Background Glows & Particle Canvas */}
          <BackgroundEffects theme={theme} />

          {/* Fixed Top Navbar */}
          <Navbar
            theme={theme}
            setTheme={setTheme}
            onAddTestimonial={handleAddTestimonial}
          />

          {/* ═══════════════ Main Scrollable Page ═══════════════ */}
          <main className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 space-y-12">
            <Hero theme={theme} />
            <About />
            <Expertise />
            <Skills />
            <Projects onSelectProject={setActiveProject} />
            <Education />
            <Certifications />
            <Reviews testimonials={testimonials} />
            <Contact onShowToast={handleShowToast} />
          </main>

          {/* Footer */}
          <Footer />

          {/* Project Details Modal */}
          {activeProject && (
            <ProjectModal
              project={activeProject}
              onClose={() => setActiveProject(null)}
            />
          )}

          {/* Toast Notification Stack */}
          <div className="fixed bottom-6 left-6 z-[110] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`flex gap-3 bg-deep/95 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md pointer-events-auto transition-all duration-300 max-w-sm ${
                  toast.leaving ? 'opacity-0 -translate-x-10 scale-95' : 'opacity-100 translate-x-0 scale-100'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-midnight text-xs font-bold ${
                  toast.type === 'success' ? 'bg-accent' : 'bg-red-500 text-white'
                }`}>
                  {toast.type === 'success' ? '✓' : '!'}
                </div>
                <div>
                  <strong className="block text-xs font-bold font-display text-snow">{toast.title}</strong>
                  <p className="text-xs text-light-gray mt-0.5">{toast.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Actions (WhatsApp & Back to Top) */}
          <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-2.5">
            <a
              href="https://wa.me/94720243581?text=Hello%20Naseef%2C%20I%20visited%20your%20portfolio."
              target="_blank"
              rel="noreferrer"
              aria-label="Contact on WhatsApp"
              className="w-11 h-11 rounded-full bg-deep hover:bg-[#25D366] text-light-gray hover:text-white border border-white/10 hover:border-transparent flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
            >
              <FaWhatsapp className="text-lg" />
            </a>
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="w-11 h-11 rounded-full bg-deep hover:bg-accent text-light-gray hover:text-midnight border border-white/10 hover:border-transparent flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
            >
              <LuArrowUp className="text-lg" />
            </button>
          </div>

          {/* Vercel Speed Insights */}
          <SpeedInsights />

        </div>
      )}
    </>
  );
}
