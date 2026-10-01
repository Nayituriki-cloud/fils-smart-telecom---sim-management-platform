import React from 'react';

interface FilsLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  variant?: 'light' | 'dark';
}

export const FilsLogo: React.FC<FilsLogoProps> = ({
  size = 'md',
  showTagline = false,
  variant = 'dark',
}) => {
  const iconDimensions =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textClass =
    size === 'sm'
      ? 'text-lg tracking-wider'
      : size === 'lg'
      ? 'text-2xl md:text-3xl tracking-widest'
      : 'text-xl tracking-wider';

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className={`relative ${iconDimensions} rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center`}
      >
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Radio Waves */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5 text-emerald-400 relative z-10"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Tower Base */}
            <path d="M4 20h16" />
            <path d="M12 2v18" />
            {/* Radio Waves */}
            <path d="M8 8a6 6 0 0 1 8 0" />
            <path d="M6 5a9 9 0 0 1 12 0" />
            {/* Central Signal Core */}
            <circle cx="12" cy="11" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black font-mono ${textClass} ${
              variant === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            FILS
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        {showTagline && (
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
            Connect. Manage. Grow.
          </span>
        )}
      </div>
    </div>
  );
};
