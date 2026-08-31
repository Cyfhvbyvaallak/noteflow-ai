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
    ? 'bg-slate-900/80 border-purple-500/30 shadow-glow-purple'
    : 'bg-slate-900/60 border-white/10 shadow-glass-card';

  const hoverStyle = hoverEffect
    ? 'hover:-translate-y-1.5 hover:scale-[1.01] hover:border-cyan-500/40 hover:shadow-glow-cyan cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${glassStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {/* Subtle top inner light border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-6 border-b border-white/5 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-6 border-t border-white/5 bg-white/[0.02] ${className}`}>
      {children}
    </div>
  );
}
