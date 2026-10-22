import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  glassGlow = false,
  onClick,
  ...props
}) {
  const baseStyles = 'rounded-3xl transition-all duration-300 relative overflow-hidden backdrop-blur-xl border select-none';
  
  const glassStyle = glassGlow
    ? 'bg-[#FFFDF5]/95 border-purple-400/40 shadow-glow-purple text-stone-900'
    : 'bg-[#FFFDF5]/90 border-[#E8D5A0]/60 shadow-warm-card text-stone-900';

  const hoverStyle = hoverEffect
    ? 'hover:-translate-y-1.5 hover:scale-[1.01] hover:border-emerald-500/50 hover:shadow-warm-hover hover:shadow-glow-emerald cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${glassStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {/* Subtle top inner light highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-6 border-b border-[#E8D5A0]/40 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-6 border-t border-[#E8D5A0]/40 bg-[#FFF9E8]/60 ${className}`}>
      {children}
    </div>
  );
}
