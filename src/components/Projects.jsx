import { useEffect } from 'react';
import AOS from 'aos';
import SectionHeader from './SectionHeader';
import Badge from './Badge';
import CardLayout from './CardLayout';
import { LuGlobe, LuArrowUpRight } from 'react-icons/lu';

const projectsData = [
  {
    id: 1,
    title: "Portfolio Website",
    image: "/assets/portfolio-website.png",
    description: "A personal portfolio focused on responsive layout, clean sections, and clear storytelling.",
    github: "https://github.com/Nashaf-engr/Portfolio",
    demo: "https://github.com/Nashaf-engr/Portfolio",
    tags: ["React", "TailwindCSS", "HTML", "JavaScript"]
  },
  {
    id: 2,
    title: "Smart Plant Monitoring System",
    image: "/assets/smart-plantation.png",
    description: "An Arduino-based monitoring concept for temperature, humidity, and soil moisture with a practical hardware focus.",
    github: "https://smart-plant-monitoring-a-v2npbp4.gamma.site/",
    demo: "https://smart-plant-monitoring-a-v2npbp4.gamma.site/",
    tags: ["Arduino", "Sensors", "IoT", "C++"]
  },
  {
    id: 3,
    title: "BMI Calculator",
    image: "/assets/bmi web.png",
    description: "A modern calculator UI for quick health metric checks with responsive design.",
    github: "https://github.com/Nashaf-engr/BMI-Calculator",
    demo: "https://github.com/Nashaf-engr/BMI-Calculator",
    tags: ["HTML", "CSS", "JavaScript"]
  },
  {
    id: 4,
    title: "Restaurant Website",
    image: "/assets/resturant-website.png",
    description: "A concept site designed to present food, atmosphere, and menu-driven content.",
    github: "https://github.com/Nashaf-engr/Sample-website-for-resturant",
    demo: "https://github.com/Nashaf-engr/Sample-website-for-resturant",
    tags: ["HTML", "CSS", "Responsive Design"]
  },
  {
    id: 5,
    title: "Travel Agency Website",
    image: "/assets/travel agency.png",
    description: "A tourism-focused web design with destination-led presentation and booking intent.",
    github: "https://github.com/Nashaf-engr/Travel-agency-website",
    demo: "https://github.com/Nashaf-engr/Travel-agency-website",
    tags: ["HTML", "CSS", "UX Design"]
  }
];

export default function Projects({ onSelectProject }) {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section id="work" className="relative w-full py-6 sm:py-8">
      <SectionHeader title="Portfolio & Selected Projects" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4"
          data-aos="fade-up"
        >
          {projectsData.map((project) => (
            <CardLayout key={project.id}>
              <div className="card-base overflow-hidden h-full flex flex-col justify-between border border-white/5 group">
                {/* Project Image Preview */}
                <div
                  className="w-full h-48 sm:h-56 md:h-64 overflow-hidden relative bg-black/40 cursor-pointer"
                  onClick={() => onSelectProject && onSelectProject(project)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-evening via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Details Panel */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h3
                        onClick={() => onSelectProject && onSelectProject(project)}
                        className="text-lg sm:text-xl font-bold font-display text-snow hover:text-accent transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="text-light-gray hover:text-accent hover:scale-110 transition-all p-1"
                            title="Live Demo / Website"
                          >
                            <LuGlobe className="text-lg" />
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-light-gray hover:text-accent hover:scale-110 transition-all p-1"
                            title="Repository / Source"
                          >
                            <LuArrowUpRight className="text-lg" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-light-gray font-normal leading-relaxed mt-2 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Technology Badges */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <Badge key={idx} title={tag} className="border border-white/5" />
                    ))}
                  </div>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
      </div>
    </section>
  );
}
