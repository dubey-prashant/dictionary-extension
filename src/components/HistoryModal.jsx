import React, { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';

const HistoryModal = ({ isOpen, onClose, onWordSelect }) => {
  const [history, setHistory] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (isOpen) {
      const loadHistory = () => {
        const searchHistory = searchService.getSearchHistory();
        setHistory(searchHistory);
      };
      loadHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) =>
    item.displayWord.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleWordClick = (item) => {
    // Return the stored result if available, otherwise just the word for new search
    if (item.dictionaryResult) {
      onWordSelect(item.dictionaryResult, 'dictionary');
    } else if (item.aiResult) {
      onWordSelect(item.aiResult, 'ai');
    } else {
      onWordSelect(item.displayWord, 'search');
    }
    onClose();
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your search history?')) {
      localStorage.removeItem('search_history');
      setHistory([]);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-lg shadow-glass w-full max-w-md max-h-[80vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-white/10'>
          <div className='flex items-center space-x-2'>
            <div className='w-6 h-6 bg-gradient-to-r from-slate-500 to-slate-400 rounded-md flex items-center justify-center'>
              <svg
                className='w-4 h-4 text-white'
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
            <h2 className='text-lg font-bold bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent tracking-wide'>
              Search History
            </h2>
          </div>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-200 transition-colors'
          >
            <svg
              className='w-5 h-5'
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

        {/* Search Filter */}
        <div className='p-3 border-b border-white/10'>
          <input
            type='text'
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder='Filter history...'
            className='w-full bg-slate-800/50 border border-slate-600/30 rounded-md px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-sm'
          />
        </div>

        {/* History List */}
        <div className='flex-1 overflow-y-auto max-h-96'>
          {filteredHistory.length === 0 ? (
            <div className='p-6 text-center'>
              <div className='w-16 h-16 mx-auto mb-3 bg-slate-800/50 rounded-full flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-slate-400'
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
              <p className='text-slate-400 text-sm'>
                {searchFilter
                  ? 'No matching words found'
                  : 'No search history yet'}
              </p>
            </div>
          ) : (
            <div className='p-2 space-y-1'>
              {filteredHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(item)}
                  className='w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 transition-all duration-200 group text-left'
                >
                  <div className='flex items-center space-x-3 flex-1 min-w-0'>
                    <div className='flex items-center space-x-2'>
                      {item.found ? (
                        <div
                          className='w-2 h-2 bg-green-400 rounded-full'
                          title='Definition available'
                        ></div>
                      ) : (
                        <div
                          className='w-2 h-2 bg-orange-400 rounded-full'
                          title='Not found'
                        ></div>
                      )}
                      {item.aiResult && (
                        <div
                          className='w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-sm'
                          title='AI Result'
                        >
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
                              d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-slate-200 font-medium truncate group-hover:text-cyan-300 transition-colors'>
                        {item.displayWord}
                      </p>
                      <p className='text-xs text-slate-400 mt-0.5'>
                        {new Date(item.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <svg
                    className='w-4 h-4 text-slate-400 group-hover:text-slate-300'
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
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className='p-3 border-t border-white/10 flex justify-between items-center'>
            <span className='text-xs text-slate-400'>
              {filteredHistory.length} of {history.length} words
            </span>
            <button
              onClick={clearHistory}
              className='text-xs text-red-400 hover:text-red-300 font-medium transition-colors'
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
