import React, { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';

const SearchHistory = ({ onWordClick }) => {
  const [history, setHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadHistory = () => {
      const searchHistory = searchService.getSearchHistory();
      setHistory(searchHistory.slice(0, 10)); // Show only last 10 searches
    };

    loadHistory();
  }, []);

  if (history.length === 0) return null;

  const recentSearches = isExpanded ? history : history.slice(0, 3);

  return (
    <div className='bg-glass-gradient backdrop-blur-md border border-slate-500/30 rounded-lg shadow-glass p-3 mb-3'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center space-x-2'>
          <div className='w-5 h-5 bg-gradient-to-r from-slate-500 to-slate-400 rounded-md flex items-center justify-center'>
            <svg
              className='w-3 h-3 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
          </div>
          <span className='text-xs font-bold bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent tracking-wide'>
            RECENT SEARCHES
          </span>
        </div>
        {history.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='text-xs text-slate-400 hover:text-slate-300 transition-colors'
          >
            {isExpanded ? 'Show less' : `+${history.length - 3} more`}
          </button>
        )}
      </div>

      <div className='space-y-1'>
        {recentSearches.map((item, index) => (
          <div key={index} className='flex items-center justify-between group'>
            <button
              onClick={() => onWordClick && onWordClick(item.displayWord)}
              className='flex-1 text-left px-2 py-1 rounded text-xs text-slate-300 hover:text-cyan-300 hover:bg-slate-700/30 transition-all duration-200 truncate'
            >
              {item.displayWord}
            </button>
            <div className='flex items-center space-x-1'>
              {item.found ? (
                <div
                  className='w-1.5 h-1.5 bg-green-400 rounded-full'
                  title='Found in dictionary'
                ></div>
              ) : (
                <div
                  className='w-1.5 h-1.5 bg-orange-400 rounded-full'
                  title='Not found - tried AI'
                ></div>
              )}
              <span className='text-xs text-slate-500 font-mono'>
                {new Date(item.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
