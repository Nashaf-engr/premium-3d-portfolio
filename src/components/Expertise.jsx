import { useEffect } from 'react';
import AOS from 'aos';
import SectionHeader from './SectionHeader';
import CardLayout from './CardLayout';

const expertiseData = [
  {
    title: 'Business Website',
    desc: 'Corporate websites optimized for conversion, clear brand messaging, and seamless user experiences.',
    category: 'Corporate',
  },
  {
    title: 'Admin Dashboard',
    desc: 'Advanced dashboards with intuitive data visualization, metrics management, and structured layouts.',
    category: 'SaaS',
  },
  {
    title: 'E-Commerce Store',
    desc: 'Modern online shopping platforms with responsive design, product showcases, and friction-free flows.',
    category: 'Retail',
  },
  {
    title: 'Full Stack Web App',
    desc: 'Scalable web applications combining robust logic, API integrations, and intuitive front-ends.',
    category: 'App',
  },
  {
    title: 'Portfolio Website',
    desc: 'High-end portfolio experiences for creators, developers, and studios with refined aesthetic presentation.',
    category: 'Creative',
  },
  {
    title: 'Website Redesign',
    desc: 'Transforming existing sites into modern, high-performance interfaces with polished typography and responsive layouts.',
    category: 'Design',
  },
];

export default function Expertise() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section id="expertise" className="relative w-full py-6 sm:py-8">
      <SectionHeader title="My Expertise" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-aos="fade-up"
        >
          {expertiseData.map((item, key) => (
            <CardLayout key={key}>
              <div className="h-full space-y-3 p-6 md:p-8 card-base flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent bg-evening px-2.5 py-1 rounded-full border border-white/5">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-snow">
                    {item.title}
                  </h3>
                  <p className="text-sm text-light-gray font-normal leading-relaxed mt-2">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-light-gray font-mono">
                  <span>Custom Solution</span>
                  <span className="text-accent">● Active</span>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
      </div>
    </section>
  );
}
