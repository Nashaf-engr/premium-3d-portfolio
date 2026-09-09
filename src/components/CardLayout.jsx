const CardLayout = ({ children, className = 'h-full w-full' }) => {
  return (
    <div className={`${className} card-glow rounded-xl`}>
      {children}
    </div>
  );
};

export default CardLayout;
