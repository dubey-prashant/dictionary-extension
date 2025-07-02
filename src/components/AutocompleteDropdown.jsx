import React from 'react';

const AutocompleteDropdown = ({
  suggestions,
  isVisible,
  selectedIndex,
  isLoading,
  onSelect,
}) => {
  if (!isVisible) return null;

  return (
    <div className='absolute z-50 w-full top-full left-0 bg-glass-gradient backdrop-blur-md border border-white/20 rounded-xl shadow-glass animate-fade-in'>
      {isLoading && (
        <div className='px-3 py-2 text-center'>
          <div className='flex items-center justify-center space-x-1'>
            <div className='w-1 h-1 bg-cyan-400 rounded-full animate-pulse'></div>
            <div
              className='w-1 h-1 bg-blue-400 rounded-full animate-pulse'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='w-1 h-1 bg-purple-400 rounded-full animate-pulse'
              style={{ animationDelay: '0.2s' }}
            ></div>
            <span className='ml-2 text-xs text-cyan-300 font-medium'>
              SCANNING...
            </span>
          </div>
        </div>
      )}

      {!isLoading && suggestions.length === 0 && (
        <div className='px-3 py-2 text-center text-slate-400 text-xs'>
          No suggestions found
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <div className='py-1'>
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              className={`w-full px-3 py-1.5 text-left text-sm transition-all duration-200 flex items-center justify-between ${
                index === selectedIndex
                  ? 'bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => onSelect(suggestion)}
            >
              <span className='font-medium'>{suggestion}</span>
              {index === selectedIndex && (
                <svg
                  className='w-3 h-3 text-cyan-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5l7 7-7 7'
                  ></path>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className='px-3 py-1.5 border-t border-white/10 bg-slate-800/30'>
          <div className='flex items-center justify-between text-xs text-slate-400'>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutocompleteDropdown;
