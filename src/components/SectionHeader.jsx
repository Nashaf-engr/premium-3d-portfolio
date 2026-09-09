const SectionHeader = ({ title, subtitle = '', className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-8 pb-4 pt-2 ${className}`}>
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <h2 className="text-lg sm:text-xl font-bold text-snow font-display tracking-wide uppercase">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-xs text-light-gray mt-1 font-mono pl-4.5">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
