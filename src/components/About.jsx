import { useEffect } from 'react';
import AOS from 'aos';
import SectionHeader from './SectionHeader';
import CardLayout from './CardLayout';
import { FaDownload, FaMapMarkerAlt, FaUniversity, FaGraduationCap, FaCodeBranch } from 'react-icons/fa';

export default function About() {
  useEffect(() => {
    AOS.init();
  }, []);

  const personalInfo = [
    { label: 'Residence', value: 'Sri Lanka', icon: FaMapMarkerAlt },
    { label: 'University', value: 'University of Peradeniya', icon: FaUniversity },
    { label: 'Faculty', value: 'Faculty of Engineering', icon: FaGraduationCap },
    { label: 'Degree', value: 'BSc Eng Undergraduate', icon: FaCodeBranch },
  ];

  const focusCards = [
    {
      title: 'Modern Front-End',
      desc: 'Building responsive, accessible, and fluid user interfaces with React, Tailwind CSS, and component-driven architecture.',
    },
    {
      title: 'Engineering Logic',
      desc: 'Applying core computer engineering principles to write clean, modular, scalable, and maintainable software systems.',
    },
    {
      title: 'Visual & UI/UX Design',
      desc: 'Crafting expressive graphic layouts, typography hierarchies, and interaction design using Photoshop, Illustrator, and Canva.',
    },
  ];

  return (
    <section id="about" className="relative w-full py-8 sm:py-12">
      <SectionHeader title="About Me" subtitle="Engineering Discipline with a Designer's Eye" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        {/* Top Storytelling & Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Profile Portrait & Personal Details */}
          <div className="lg:col-span-5" data-aos="fade-up">
            <CardLayout>
              <div className="card-base p-6 md:p-8 h-full flex flex-col justify-between space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent/50 shadow-xl bg-evening p-0.5 shrink-0">
                    <img
                      src="/assets/profile.png"
                      alt="MFA Naseef Sharaf"
                      className="w-full h-full rounded-full object-cover object-top"
                      onError={(e) => {
                        e.target.src = '/assets/icon.png';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-snow">
                      MFA Naseef Sharaf
                    </h3>
                    <span className="text-xs text-accent font-mono block">
                      Creative Developer & Student
                    </span>
                  </div>
                </div>

                {/* Personal Information Rows */}
                <div className="space-y-3">
                  {personalInfo.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0 font-mono">
                        <span className="text-light-gray flex items-center gap-2">
                          <Icon className="text-accent text-[11px]" />
                          <span>{item.label}</span>
                        </span>
                        <span className="text-snow font-medium text-right">{item.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Resume Download Action */}
                <div className="pt-2">
                  <a
                    href="/assets/Resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-evening hover:bg-white/10 border border-white/10 hover:border-accent/40 text-snow text-xs font-mono font-medium py-3 rounded-xl transition-all"
                  >
                    <FaDownload className="text-accent text-xs" />
                    <span>Download Full Resume (PDF)</span>
                  </a>
                </div>
              </div>
            </CardLayout>
          </div>

          {/* Right Column: Storytelling Description */}
          <div className="lg:col-span-7" data-aos="fade-up" data-aos-delay="100">
            <CardLayout>
              <div className="card-base p-6 md:p-8 h-full flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <span className="text-xs font-mono text-accent uppercase tracking-widest block">
                    Biography & Vision
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-snow leading-snug">
                    Bridging structural code with{' '}
                    <span className="text-gradient-accent">human-centered aesthetics</span>.
                  </h3>
                  <p className="text-light-gray text-xs sm:text-sm leading-relaxed">
                    I enjoy turning concepts into polished, impactful digital products. My background in Computer Engineering at the University of Peradeniya equips me with structural thinking and algorithmic rigor, while my ongoing creative design practice helps me shape interfaces that feel intuitive, expressive, and human.
                  </p>
                  <p className="text-light-gray text-xs sm:text-sm leading-relaxed">
                    I am particularly enthusiastic about high-performance responsive web applications, visual narrative systems, interactive animations, and multidisciplinary projects combining software and hardware engineering.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-light-gray">
                  <span>Faculty of Engineering, UoP</span>
                  <span className="text-accent font-semibold">● Open for Opportunities</span>
                </div>
              </div>
            </CardLayout>
          </div>
        </div>

        {/* Focus & Pillars Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2" data-aos="fade-up" data-aos-delay="150">
          {focusCards.map((card, idx) => (
            <CardLayout key={idx}>
              <div className="card-base p-6 h-full flex flex-col justify-between space-y-2.5">
                <span className="text-[11px] font-mono text-accent uppercase tracking-widest">
                  0{idx + 1} / Core Pillar
                </span>
                <h4 className="font-display font-bold text-base text-snow">
                  {card.title}
                </h4>
                <p className="text-light-gray text-xs leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </CardLayout>
          ))}
        </div>
      </div>
    </section>
  );
}
