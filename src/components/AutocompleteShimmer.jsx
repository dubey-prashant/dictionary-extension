import React from 'react';

const SkeletonSuggestion = ({ delay = 0 }) => (
  <div
    className='px-3 py-1.5 animate-pulse'
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className='flex items-center space-x-3'>
      {/* Word skeleton */}
      <div
        className='h-4 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded animate-shimmer bg-[length:200%_100%]'
        style={{ width: `${60 + Math.random() * 40}px` }}
      ></div>

      {/* Optional icon placeholder */}
      <div className='w-3 h-3 bg-slate-700/30 rounded-full animate-shimmer'></div>
    </div>
  </div>
);

const AutocompleteShimmer = ({ minimal = false }) => {
  if (minimal) {
    // Minimal shimmer for when we have suggestions but API is loading
    return (
      <div className='px-3 py-1 border-t border-white/10'>
        <div className='flex items-center justify-center space-x-2'>
          <div className='w-2 h-2 bg-cyan-400/50 rounded-full animate-pulse'></div>
          <div className='w-16 h-2 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded animate-shimmer bg-[length:200%_100%]'></div>
          <div
            className='w-2 h-2 bg-cyan-400/50 rounded-full animate-pulse'
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className='py-1'>
      {/* Generate 3-4 skeleton suggestions with different widths and delays */}
      {[0, 100, 200, 300].map((delay, index) => (
        <SkeletonSuggestion key={index} delay={delay} />
      ))}
    </div>
  );
};

export default AutocompleteShimmer;
