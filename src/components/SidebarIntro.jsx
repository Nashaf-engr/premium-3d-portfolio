import { useState, useEffect } from 'react';
import { FaDownload, FaGithub, FaLinkedin, FaWhatsapp, FaInstagram, FaTimes } from 'react-icons/fa';
import Badge from './Badge';

const DETAILS = {
  Residence: 'Sri Lanka',
  University: 'Univ. of Peradeniya',
  Faculty: 'Engineering',
  Year: 'Undergraduate',
};

const SKILLS = [
  { title: 'Frontend Development', level: '92%' },
  { title: 'UI/UX & Graphic Design', level: '85%' },
  { title: 'Python & C++', level: '78%' },
  { title: 'IoT & Embedded Systems', level: '72%' },
];

const TOOLS = [
  'JavaScript',
  'React',
  'Tailwind CSS',
  'Python',
  'C++',
  'Arduino',
  'Photoshop',
  'Illustrator',
  'Figma',
  'Canva',
  'Git',
  'GitHub',
  'Vite',
];

const SOCIAL_LINKS = [
  { icon: FaGithub, url: 'https://github.com/Nashaf-engr', label: 'GitHub' },
  { icon: FaLinkedin, url: 'https://www.linkedin.com/in/naseef-sharaf-mfa-291293346/', label: 'LinkedIn' },
  { icon: FaWhatsapp, url: 'https://wa.me/94720243581?text=Hello%20Naseef%2C%20I%20visited%20your%20portfolio.', label: 'WhatsApp' },
  { icon: FaInstagram, url: 'https://www.instagram.com/itz.ur.nx_shx_f', label: 'Instagram' },
];

export default function SidebarIntro({ setIsOpen }) {
  const [webDev, setWebDev] = useState(0);
  const [design, setDesign] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWebDev((prev) => (prev < 95 ? prev + 1 : 95));
      setDesign((prev) => (prev < 88 ? prev + 1 : 88));
    }, 25);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-deep text-white relative rounded-xl overflow-hidden border border-white/5 shadow-2xl">
      {/* ── Fixed Header ── */}
      <div className="h-44 bg-midnight flex flex-col items-center justify-center px-4 shrink-0 border-b border-white/5 relative">
        {setIsOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-3 right-3 text-light-gray hover:text-accent p-1"
            aria-label="Close Sidebar"
          >
            <FaTimes className="text-sm" />
          </button>
        )}
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent/40 shadow-xl bg-evening p-0.5">
          <img
            className="w-full h-full rounded-full object-cover object-top"
            src="/assets/profile.png"
            alt="MFA Naseef Sharaf"
            onError={(e) => {
              e.target.src = '/assets/icon.png';
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center mt-2">
          <span className="text-snow text-sm font-bold font-display">
            MFA Naseef Sharaf
          </span>
          <span className="text-[11px] text-light-gray text-center font-mono mt-0.5">
            Computer Engineer & Designer
          </span>
        </div>
      </div>

      {/* ── Middle Scrollable Content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 divide-y divide-white/5 no-scrollbar">
        {/* Details / Location */}
        <div className="space-y-1.5 pt-1">
          {Object.entries(DETAILS).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-snow font-mono font-medium">{key}</span>
              <span className="text-light-gray font-mono">{value}</span>
            </div>
          ))}
        </div>

        {/* Circular Progress Meters */}
        <div className="pt-4 space-y-3">
          <span className="text-snow text-xs font-bold font-display uppercase tracking-wider block">
            Core Capabilities
          </span>
          <div className="flex items-center justify-around py-1">
            {/* Circle 1 */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-gray-800 fill-none"
                    strokeWidth="3"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-accent fill-none transition-all duration-300"
                    strokeWidth="3"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - webDev / 100)}
                  />
                </svg>
                <span className="absolute text-xs font-bold font-mono text-snow">
                  {webDev}%
                </span>
              </div>
              <span className="text-[11px] font-mono text-light-gray">Web Dev</span>
            </div>

            {/* Circle 2 */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-gray-800 fill-none"
                    strokeWidth="3"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-accent fill-none transition-all duration-300"
                    strokeWidth="3"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - design / 100)}
                  />
                </svg>
                <span className="absolute text-xs font-bold font-mono text-snow">
                  {design}%
                </span>
              </div>
              <span className="text-[11px] font-mono text-light-gray">Design</span>
            </div>
          </div>
        </div>

        {/* Linear Skill Bars */}
        <div className="pt-4 space-y-3">
          <span className="text-snow text-xs font-bold font-display uppercase tracking-wider block">
            Skills & Competencies
          </span>
          <div className="space-y-3">
            {SKILLS.map((skill, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-light-gray">{skill.title}</span>
                  <span className="text-accent font-semibold">{skill.level}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-accent transition-all duration-700"
                    style={{ width: skill.level }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Badges */}
        <div className="pt-4 space-y-2.5">
          <span className="text-snow text-xs font-bold font-display uppercase tracking-wider block">
            Tools & Stack
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TOOLS.map((tool, idx) => (
              <Badge
                key={idx}
                title={tool}
                className="py-1 px-2.5 text-[10px] border border-white/5 bg-evening hover:border-accent/40 transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Download Resume Button */}
        <div className="pt-4 pb-2">
          <a
            href="/assets/Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-evening hover:bg-white/10 border border-white/10 hover:border-accent/40 text-snow text-xs font-mono font-medium py-2.5 rounded-lg transition-all"
          >
            <FaDownload className="text-accent text-xs" />
            <span>Download Resume</span>
          </a>
        </div>
      </div>

      {/* ── Fixed Footer ── */}
      <div className="h-11 bg-midnight flex justify-center items-center space-x-5 text-sm text-light-gray shrink-0 border-t border-white/5">
        {SOCIAL_LINKS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              className="hover:text-accent hover:scale-125 transition-all duration-300"
            >
              <Icon />
            </a>
          );
        })}
      </div>
    </div>
  );
}
