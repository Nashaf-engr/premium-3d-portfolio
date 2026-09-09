const ProgressBar = ({ label, percent }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-light-gray font-mono">{label}</span>
        <span className="text-accent font-mono font-semibold">{percent}</span>
      </div>
      <div className="w-full bg-deep rounded-full h-2 overflow-hidden border border-white/5">
        <div
          className="h-2 rounded-full bg-accent transition-all duration-700"
          style={{ width: percent }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
