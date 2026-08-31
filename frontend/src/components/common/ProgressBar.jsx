import React from 'react';

export function ProgressBar({
  progress = 0,
  max = 100,
  variant = 'brand',
  showLabel = false,
  height = 'h-2',
  className = ''
}) {
  const percentage = Math.min(Math.max(Math.round((progress / max) * 100), 0), 100);

  const colors = {
    brand: 'bg-emerald-500',
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${colors[variant] || colors.brand} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
