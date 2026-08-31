import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = ''
}) {
  const variants = {
    default: 'bg-slate-800/80 text-slate-300 border-white/10',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-glow-emerald',
    primary: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-bold',
    info: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-glow-cyan',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-glow-purple',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    danger: 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-glow-rose',
    dark: 'bg-slate-950 text-slate-300 border-white/10'
  };

  const dotColors = {
    default: 'bg-slate-400',
    success: 'bg-emerald-400',
    primary: 'bg-emerald-400',
    info: 'bg-cyan-400',
    purple: 'bg-purple-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    dark: 'bg-emerald-400'
  };

  const sizes = {
    sm: 'text-[10px] sm:text-[11px] px-2.5 py-0.5 font-bold rounded-lg gap-1 tracking-wide uppercase',
    md: 'text-xs px-3 py-1 font-bold rounded-xl gap-1.5',
    lg: 'text-xs sm:text-sm px-3.5 py-1.5 font-bold rounded-xl gap-2'
  };

  return (
    <span
      className={`inline-flex items-center border font-sans select-none backdrop-blur-md ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || 'bg-slate-400'} animate-pulse`} />
      )}
      {children}
    </span>
  );
}
