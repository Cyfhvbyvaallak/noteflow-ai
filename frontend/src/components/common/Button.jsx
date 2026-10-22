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
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#FFF9E8] active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-glow-emerald border border-emerald-500/40 focus:ring-emerald-500',
    purple: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black shadow-glow-purple border border-purple-500/40 focus:ring-purple-500',
    cyan: 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-black shadow-glow-cyan border border-teal-400/40 focus:ring-teal-500',
    secondary: 'bg-[#FFFDF5] hover:bg-[#FFF9E8] text-stone-800 border border-[#E8D5A0] shadow-warm-sm hover:border-[#D1B878] focus:ring-[#E8D5A0]',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md focus:ring-rose-500',
    ghost: 'bg-transparent hover:bg-[#FBF1D5]/70 text-stone-700 hover:text-stone-950',
    outline: 'bg-transparent border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500',
    dark: 'bg-stone-900 hover:bg-stone-800 text-white border border-stone-700 shadow-warm-card focus:ring-stone-800'
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
