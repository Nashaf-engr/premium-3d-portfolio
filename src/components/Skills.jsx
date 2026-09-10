import { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import SectionHeader from './SectionHeader';
import ProgressBar from './ProgressBar';
import Badge from './Badge';
import CardLayout from './CardLayout';

const linearSkills = [
  { label: 'Frontend Development (React, JavaScript, HTML5, CSS3)', percent: '92%' },
  { label: 'UI/UX & Graphic Design (Figma, Photoshop, Illustrator)', percent: '85%' },
  { label: 'Programming & Logic (Python, C++)', percent: '78%' },
  { label: 'IoT & Embedded Systems (Arduino, Sensors)', percent: '72%' },
];

const techStack = [
  'JavaScript',
  'React',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'Python',
  'C++',
  'Arduino',
  'IoT & Hardware Sensors',
  'GSAP',
  'Framer Motion',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Canva',
  'Figma',
  'Git',
  'GitHub',
  'Vite',
  'REST APIs',
  'Responsive UI',
];

export default function Skills() {
  const [webDev, setWebDev] = useState(0);
  const [design, setDesign] = useState(0);
  const [engLogic, setEngLogic] = useState(0);
  const metersRef = useRef(null);

  useEffect(() => {
    AOS.init();

    const handleScroll = () => {
      const el = metersRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start filling when card enters bottom (95% of viewport)
      // Fully complete when card reaches comfortable middle view (40% of viewport)
      const start = windowHeight * 0.95;
      const end = windowHeight * 0.40;

      let progress = 0;
      if (rect.top <= end) {
        progress = 1;
      } else if (rect.top < start) {
        const raw = (start - rect.top) / (start - end);
        const clamped = Math.max(0, Math.min(1, raw));
        // Smooth easeOut quad for natural filling feel
        progress = 1 - Math.pow(1 - clamped, 2);
      } else {
        progress = 0;
      }

      setWebDev(Math.round(progress * 95));
      setDesign(Math.round(progress * 88));
      setEngLogic(Math.round(progress * 82));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="skills" className="relative w-full py-8 sm:py-12">
      <SectionHeader title="Skills & Competencies" subtitle="Technical Capabilities & Software Ecosystem" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6" data-aos="fade-up">
        {/* Top Grid: Circular Capability Meters + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Circular Capability Meters Card */}
          <div className="lg:col-span-5" ref={metersRef}>
            <CardLayout>
              <div className="card-base p-6 md:p-8 h-full flex flex-col justify-between space-y-4">
                <h3 className="font-display font-bold text-base text-snow uppercase tracking-wider border-b border-white/5 pb-3">
                  Core Competencies
                </h3>

                <div className="flex items-center justify-around py-4">
                  {/* Circle 1 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          className="stroke-gray-800 fill-none"
                          strokeWidth="4"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          className="stroke-accent fill-none transition-all duration-300 ease-out"
                          strokeWidth="4"
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - webDev / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-sm font-bold font-mono text-snow">
                        {webDev}%
                      </span>
                    </div>
                    <span className="text-xs font-mono font-medium text-light-gray">Web Dev</span>
                  </div>

                  {/* Circle 2 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          className="stroke-gray-800 fill-none"
                          strokeWidth="4"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          className="stroke-accent fill-none transition-all duration-300 ease-out"
                          strokeWidth="4"
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - design / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-sm font-bold font-mono text-snow">
                        {design}%
                      </span>
                    </div>
                    <span className="text-xs font-mono font-medium text-light-gray">UI/UX</span>
                  </div>

                  {/* Circle 3 */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          className="stroke-gray-800 fill-none"
                          strokeWidth="4"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          className="stroke-accent fill-none transition-all duration-300 ease-out"
                          strokeWidth="4"
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - engLogic / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-sm font-bold font-mono text-snow">
                        {engLogic}%
                      </span>
                    </div>
                    <span className="text-xs font-mono font-medium text-light-gray">Engineering</span>
                  </div>
                </div>

                <p className="text-xs text-light-gray leading-relaxed border-t border-white/5 pt-3">
                  Combining algorithmic discipline from engineering studies with component-driven web frameworks and visual design tools.
                </p>
              </div>
            </CardLayout>
          </div>

          {/* Linear Skill Meters Card */}
          <div className="lg:col-span-7">
            <CardLayout>
              <div className="card-base p-6 md:p-8 h-full space-y-4">
                <h3 className="font-display font-bold text-base text-snow uppercase tracking-wider border-b border-white/5 pb-3">
                  Proficiency Breakdown
                </h3>
                <div className="space-y-4 pt-1">
                  {linearSkills.map((skill, idx) => (
                    <ProgressBar
                      key={idx}
                      label={skill.label}
                      percent={skill.percent}
                    />
                  ))}
                </div>
              </div>
            </CardLayout>
          </div>
        </div>

        {/* Tools & Tech Badges Cloud Card */}
        <CardLayout>
          <div className="card-base p-6 md:p-8 space-y-4">
            <h3 className="font-display font-bold text-base text-snow uppercase tracking-wider border-b border-white/5 pb-3">
              Tools, Libraries & Technologies
            </h3>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {techStack.map((tech, idx) => (
                <Badge
                  key={idx}
                  title={tech}
                  className="hover:border-accent/50 hover:text-accent transition-colors border border-white/5 py-2 px-3.5 text-xs font-mono"
                />
              ))}
            </div>
          </div>
        </CardLayout>
      </div>
    </section>
  );
}
