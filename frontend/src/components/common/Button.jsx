import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-glow-emerald border border-emerald-400/40 focus:ring-emerald-500',
    purple: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black shadow-glow-purple border border-purple-400/40 focus:ring-purple-500',
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-glow-cyan border border-cyan-400/40 focus:ring-cyan-500',
    secondary: 'bg-slate-900/80 hover:bg-slate-800 text-slate-100 border border-white/15 shadow-glass-card hover:border-white/30 focus:ring-slate-500',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-glow-rose focus:ring-rose-500',
    ghost: 'bg-transparent hover:bg-white/10 text-slate-300 hover:text-white',
    outline: 'bg-transparent border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 focus:ring-emerald-500',
    dark: 'bg-slate-950 hover:bg-slate-900 text-white border border-white/10 shadow-glass-card focus:ring-slate-800'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5',
    icon: 'p-2.5'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
      ) : null}
      {children}
    </button>
  );
}
