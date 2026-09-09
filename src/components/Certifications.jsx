import { useState } from 'react';
import SectionHeader from './SectionHeader';
import CardLayout from './CardLayout';
import { LuExternalLink } from 'react-icons/lu';

const certificationsData = [
  {
    provider: "Google via Coursera",
    title: "Introduction to AI",
    category: "ai",
    url: "https://www.coursera.org/account/accomplishments/verify/7IT9T9F4FSG1"
  },
  {
    provider: "Google via Coursera",
    title: "Maximize Productivity With AI Tools",
    category: "productivity",
    url: "https://www.coursera.org/account/accomplishments/verify/WLLSOTNRZLZX"
  },
  {
    provider: "Google via Coursera",
    title: "Discover the Art of Prompting",
    category: "ai",
    url: "https://www.coursera.org/account/accomplishments/verify/UAZDU6PM0CVF"
  },
  {
    provider: "Coursera",
    title: "Use Canva to Design Digital Course Collateral",
    category: "design",
    url: "https://www.coursera.org/account/accomplishments/verify/YOLIMSTGFCNV"
  },
  {
    provider: "Canva",
    title: "Canva Essentials",
    category: "design",
    url: "https://www.canva.com/design-school/certification-award/443c0855-46ad-4663-8080-4788524b044e"
  },
  {
    provider: "Alison",
    title: "Graphic Design - Visual and Graphic Design",
    category: "design",
    url: "https://alison.com/verify/d54a627364"
  },
  {
    provider: "LinkedIn Learning",
    title: "Introduction to Prompt Engineering for Generative AI",
    category: "ai",
    url: "https://www.linkedin.com/learning/certificates/713d8e25dbae9e47d16c06ece518b322a5902b2759fb89682e2b17d3027ce693"
  },
  {
    provider: "LinkedIn Learning",
    title: "Tips to Work with Difficult People",
    category: "professional",
    url: "https://www.linkedin.com/learning/certificates/3fb23e40ab005ed1cdaea9350672f877911a27aadc3f6e4a0b101cf69d6ad53c"
  }
];

export default function Certifications() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterChips = [
    { label: 'All', id: 'all' },
    { label: 'AI', id: 'ai' },
    { label: 'Design', id: 'design' },
    { label: 'Productivity', id: 'productivity' },
    { label: 'Professional', id: 'professional' }
  ];

  const filteredCerts = certificationsData.filter((cert) => {
    return activeFilter === 'all' || cert.category === activeFilter;
  });

  return (
    <section id="certifications" className="relative w-full py-6 sm:py-8">
      <SectionHeader title="Certifications & Continuous Learning" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Filter Chips Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`font-display text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-xl border transition-all duration-300 ${
                activeFilter === chip.id
                  ? 'bg-accent text-midnight border-accent font-bold'
                  : 'bg-evening text-light-gray border-white/5 hover:border-accent/30 hover:text-snow'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCerts.map((cert, idx) => (
            <CardLayout key={idx}>
              <a
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="card-base p-6 h-full flex flex-col justify-between border border-white/5 hover:border-accent/30 group transition-all"
              >
                <div>
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-2">
                    {cert.provider}
                  </span>
                  <h4 className="font-display font-bold text-snow text-sm leading-snug group-hover:text-accent transition-colors">
                    {cert.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-xs font-mono text-light-gray">
                  <span className="capitalize">{cert.category}</span>
                  <span className="flex items-center gap-1 text-accent group-hover:underline">
                    Verify <LuExternalLink className="text-xs" />
                  </span>
                </div>
              </a>
            </CardLayout>
          ))}
        </div>
      </div>
    </section>
  );
}
