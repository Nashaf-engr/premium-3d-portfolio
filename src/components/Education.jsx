import { useEffect } from 'react';
import AOS from 'aos';
import SectionHeader from './SectionHeader';
import CardLayout from './CardLayout';

const educationData = [
  {
    institution: 'University of Peradeniya',
    degree: 'Bachelor of the Science of Engineering (Honours)',
    detail: 'Undergraduate study in the Faculty of Engineering, combining foundational scientific theories with computer engineering architectures, algorithm design, hardware logic synthesis, and modern software development.',
    year: '2024 - Present',
    location: 'Peradeniya, Sri Lanka',
  },
];

export default function Education() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section id="education" className="relative w-full py-6 sm:py-8">
      <SectionHeader title="Education & Academic Path" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="space-y-4" data-aos="fade-up">
          {educationData.map((edu, index) => (
            <CardLayout key={index}>
              <div className="card-base p-6 md:p-8 space-y-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-snow">
                      {edu.institution}
                    </h3>
                    <p className="text-xs sm:text-sm text-light-gray italic mt-0.5">
                      {edu.degree}
                    </p>
                  </div>

                  {/* Year Badge */}
                  <span className="self-start sm:self-auto bg-deep text-light-gray text-xs rounded-full px-4 py-2 opacity-80 border border-white/5 font-mono">
                    {edu.year}
                  </span>
                </div>

                {/* Description */}
                <p className="text-light-gray text-xs sm:text-sm leading-relaxed text-justify">
                  {edu.detail}
                </p>

                {/* Location / Status Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-light-gray font-mono">
                  <span>{edu.location}</span>
                  <span className="text-accent">● Full-Time Student</span>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
      </div>
    </section>
  );
}
