import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = ''
}) {
  const variants = {
    default: 'bg-[#FBF1D5] text-stone-700 border-[#E8D5A0]',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm font-bold',
    primary: 'bg-emerald-100/70 text-emerald-900 border-emerald-400/60 font-bold',
    info: 'bg-teal-50 text-teal-800 border-teal-300 font-bold',
    purple: 'bg-purple-50 text-purple-800 border-purple-300 shadow-sm font-bold',
    warning: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
    danger: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
    dark: 'bg-stone-900 text-stone-100 border-stone-800'
  };

  const dotColors = {
    default: 'bg-stone-500',
    success: 'bg-emerald-600',
    primary: 'bg-emerald-600',
    info: 'bg-teal-600',
    purple: 'bg-purple-600',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    dark: 'bg-emerald-400'
  };

  const sizes = {
    sm: 'text-[10px] sm:text-[11px] px-2.5 py-0.5 font-bold rounded-lg gap-1 tracking-wide uppercase',
    md: 'text-xs px-3 py-1 font-bold rounded-xl gap-1.5',
    lg: 'text-xs sm:text-sm px-3.5 py-1.5 font-bold rounded-xl gap-2'
  };

  return (
    <span
      className={`inline-flex items-center border font-sans select-none ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || 'bg-stone-500'} animate-pulse`} />
      )}
      {children}
    </span>
  );
}
