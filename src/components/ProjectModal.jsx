import { LuX, LuGithub, LuGlobe } from 'react-icons/lu';
import Badge from './Badge';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-deep w-full max-w-2xl rounded-xl border border-white/10 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 hover:border-accent/50 flex items-center justify-center transition-colors bg-black/50 z-20"
        >
          <LuX className="text-light-gray hover:text-snow" />
        </button>

        {/* Left Side (Image) */}
        <div className="w-full md:w-1/2 h-48 md:h-auto overflow-hidden relative border-b md:border-b-0 md:border-r border-white/5 bg-black/40">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side (Details) */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-snow mb-2 leading-tight">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-light-gray leading-relaxed mb-4">
              {project.description}
            </p>

            {/* Tags list */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <Badge key={tag} title={tag} className="border border-white/5" />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-auto">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-evening hover:bg-white/10 text-snow font-display font-medium py-2.5 rounded-xl border border-white/10 transition-all text-xs sm:text-sm"
              >
                <LuGithub />
                GitHub
              </a>
            )}
            
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/60 text-midnight font-display font-medium py-2.5 rounded-xl transition-all text-xs sm:text-sm"
              >
                <LuGlobe />
                Live Demo
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
