import { useEffect } from 'react';
import AOS from 'aos';
import SectionHeader from './SectionHeader';
import CardLayout from './CardLayout';
import { FaQuoteLeft } from 'react-icons/fa';

export default function Reviews({ testimonials = [] }) {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section id="reviews" className="relative w-full py-6 sm:py-8">
      <SectionHeader title="Recommendations & Client Feedback" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 pt-4"
          data-aos="fade-up"
        >
          {testimonials.map((t, key) => (
            <CardLayout key={key}>
              <div className="card-base p-6 md:p-8 h-full relative border border-white/5 flex flex-col justify-between">
                {/* Floating Avatar */}
                <div className="absolute z-10 right-6 -top-5 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-accent overflow-hidden bg-evening shadow-lg">
                  <img
                    src={t.avatar || '/assets/icon.png'}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/icon.png';
                    }}
                  />
                </div>

                <div>
                  <FaQuoteLeft className="text-accent/30 text-xl mb-3" />
                  <p className="text-sm text-light-gray font-normal leading-relaxed italic pr-10">
                    "{t.message}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4">
                  <h4 className="text-base font-bold font-display text-snow">
                    {t.name}
                  </h4>
                  <span className="text-xs text-accent font-mono block mt-0.5">
                    {t.role || 'Client'}
                  </span>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
      </div>
    </section>
  );
}
