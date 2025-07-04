import React, { useState, useEffect } from 'react';

const CacheStats = () => {
  const [stats, setStats] = useState({
    totalWords: 0,
    totalHistory: 0,
    cacheSize: 0,
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const calculateStats = () => {
      try {
        const dictionaryCache = JSON.parse(
          localStorage.getItem('dictionary_cache') || '{}'
        );
        const searchHistory = JSON.parse(
          localStorage.getItem('search_history') || '[]'
        );
        const wotdCache = JSON.parse(
          localStorage.getItem('wotd_cache') || '{}'
        );

        const cacheSize =
          JSON.stringify(dictionaryCache).length +
          JSON.stringify(wotdCache).length;

        setStats({
          totalWords: Object.keys(dictionaryCache).length,
          totalHistory: searchHistory.length,
          cacheSize: Math.round(cacheSize / 1024), // Size in KB
        });
      } catch (error) {
        console.error('Error calculating cache stats:', error);
      }
    };

    calculateStats();
  }, []);

  const clearCache = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all cached data? This will remove your search history and cached definitions.'
      )
    ) {
      localStorage.removeItem('dictionary_cache');
      localStorage.removeItem('search_history');
      localStorage.removeItem('wotd_cache');
      setStats({ totalWords: 0, totalHistory: 0, cacheSize: 0 });
    }
  };

  if (!showDetails) {
    return (
      <button
        onClick={() => setShowDetails(true)}
        className='fixed bottom-4 right-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 text-slate-400 hover:text-slate-300 p-2 rounded-full transition-all duration-300 z-20'
        title='Cache Statistics'
      >
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          ></path>
        </svg>
      </button>
    );
  }

  return (
    <div className='fixed bottom-4 right-4 bg-glass-gradient backdrop-blur-md border border-slate-500/30 rounded-lg shadow-glass p-3 z-20 w-64'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center space-x-2'>
          <div className='w-4 h-4 bg-gradient-to-r from-slate-500 to-slate-400 rounded-sm flex items-center justify-center'>
            <svg
              className='w-2.5 h-2.5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              ></path>
            </svg>
          </div>
          <span className='text-xs font-bold text-slate-300 tracking-wide'>
            CACHE
          </span>
        </div>
        <button
          onClick={() => setShowDetails(false)}
          className='text-slate-400 hover:text-slate-300'
        >
          <svg
            className='w-3 h-3'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            ></path>
          </svg>
        </button>
      </div>

      <div className='space-y-2 text-xs'>
        <div className='flex justify-between'>
          <span className='text-slate-400'>Cached Words:</span>
          <span className='text-slate-200 font-mono'>{stats.totalWords}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-slate-400'>Search History:</span>
          <span className='text-slate-200 font-mono'>{stats.totalHistory}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-slate-400'>Cache Size:</span>
          <span className='text-slate-200 font-mono'>{stats.cacheSize}KB</span>
        </div>

        <div className='pt-2 border-t border-slate-600/30'>
          <button
            onClick={clearCache}
            className='w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 py-1 px-2 rounded text-xs font-medium transition-all duration-300'
          >
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
};

export default CacheStats;
