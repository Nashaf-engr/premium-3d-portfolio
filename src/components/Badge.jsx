const Badge = ({ title, className = '' }) => {
  return (
    <span className={`py-2 px-3 text-xs text-snow bg-evening rounded-full inline-block ${className}`}>
      {title}
    </span>
  );
};

export default Badge;
