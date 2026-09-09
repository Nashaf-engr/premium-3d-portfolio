import { FaRegCopyright, FaEnvelope, FaWhatsapp, FaLinkedinIn, FaGithub, FaInstagram, FaArrowUp } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Expertise', id: 'expertise' },
    { label: 'Skills', id: 'skills' },
    { label: 'Portfolio', id: 'work' },
    { label: 'Education', id: 'education' },
    { label: 'Certificates', id: 'certifications' },
    { label: 'Contact', id: 'contact' },
  ];

  const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/Nashaf-engr', label: 'GitHub' },
    { icon: <FaLinkedinIn />, url: 'https://www.linkedin.com/in/naseef-sharaf-mfa-291293346/', label: 'LinkedIn' },
    { icon: <FaWhatsapp />, url: 'https://wa.me/94720243581?text=Hello%20Naseef%2C%20I%20visited%20your%20portfolio.', label: 'WhatsApp' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/itz.ur.nx_shx_f', label: 'Instagram' },
  ];

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const y = targetElement.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="mt-16 border-t border-white/10 bg-midnight relative z-10 text-white">
      {/* ── Main Footer Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Monogram & Short Summary (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent text-midnight flex items-center justify-center font-display font-bold text-sm shadow-[0_0_15px_rgba(31,223,100,0.3)]">
                NS
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-snow tracking-tight">
                  MFA Naseef Sharaf
                </span>
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                  Computer Engineering × Design
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-light-gray leading-relaxed max-w-lg">
              Undergraduate in the Faculty of Engineering at the University of Peradeniya, Sri Lanka. Passionate about engineering high-performance responsive web applications, modular software logic, and clean UI/UX interaction systems.
            </p>

            {/* Social Channels */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg bg-evening hover:bg-accent hover:text-midnight border border-white/10 flex items-center justify-center text-xs text-light-gray transition-all duration-300 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-sm text-snow uppercase tracking-wider">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="text-light-gray hover:text-accent transition-colors py-1 block"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Direct Contact (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-sm text-snow uppercase tracking-wider">
              Contact & Inquiries
            </h4>
            <div className="space-y-2.5 text-xs font-mono text-light-gray">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-accent shrink-0" />
                <a
                  href="mailto:nashafeng32@gmail.com"
                  className="hover:text-snow transition-colors"
                >
                  nashafeng32@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-accent shrink-0" />
                <a
                  href="https://wa.me/94720243581"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-snow transition-colors"
                >
                  +94 72 024 3581
                </a>
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 bg-evening rounded-full border border-white/5 text-[11px] text-accent">
                  ● Open for Projects
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar: Copyright & Back-to-Top Strip ── */}
      <div className="border-t border-white/5 bg-black/60 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-light-gray">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <FaRegCopyright className="text-sm shrink-0" />
            <span>2026 MFA Naseef Sharaf. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline">
              University of Peradeniya • Faculty of Engineering
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-accent hover:underline cursor-pointer bg-evening px-3 py-1 rounded-lg border border-white/10 hover:border-accent/40 transition-all"
            >
              <span>Back to Top</span>
              <FaArrowUp className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
