import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchService } from '../services/searchService';

const History = () => {
  const [history, setHistory] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = () => {
      const searchHistory = searchService.getSearchHistory();
      setHistory(searchHistory);
    };
    loadHistory();
  }, []);

  const filteredHistory = history.filter((item) =>
    item.displayWord.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleWordClick = async (item) => {
    setIsLoading(true);

    try {
      let result;
      if (item.dictionaryResult) {
        // Use cached result
        result = item.dictionaryResult;
      } else {
        // Search for the word
        result = await searchService.searchDictionary(item.displayWord);
      }

      // Navigate back to main page with the result
      navigate('/', { state: { searchResult: result } });
    } catch (err) {
      // Navigate back even if there's an error
      const errorState =
        err.name === 'NotFoundError'
          ? {
              type: 'not_found',
              message: err.message,
              word: item.displayWord,
            }
          : {
              type: 'network',
              message: err.message,
            };

      navigate('/', { state: { error: errorState } });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your search history?')) {
      localStorage.removeItem('search_history');
      setHistory([]);
    }
  };

  return (
    <div className='w-96 min-h-[500px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 z-10 relative overflow-hidden'>
      {/* Header with Back Button */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-3'>
          <button
            onClick={() => navigate('/')}
            className='bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/50 p-2 rounded-lg transition-all duration-300 group hover:shadow-lg'
            title='Back to Search'
          >
            <svg
              className='w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors duration-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <h1 className='text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-wide'>
            SEARCH HISTORY
          </h1>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className='bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 px-3 py-1 rounded text-xs transition-all duration-300'
          >
            Clear All
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search history...'
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className='w-full px-3 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm'
          />
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className='text-center py-4'>
          <div className='inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400'></div>
          <p className='text-slate-400 text-sm mt-2'>Loading...</p>
        </div>
      )}

      <div className='space-y-2 max-h-[400px] overflow-y-auto'>
        {history.length === 0 ? (
          <div className='text-center py-8'>
            <div className='w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3'>
              <svg
                className='w-6 h-6 text-slate-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <p className='text-slate-400 text-sm'>No search history found</p>
            <p className='text-slate-500 text-xs mt-1'>
              Start searching for words to see them here
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-slate-400 text-sm'>No matches found</p>
            <p className='text-slate-500 text-xs mt-1'>
              Try a different search term
            </p>
          </div>
        ) : (
          filteredHistory.map((item, index) => (
            <div
              key={index}
              className='bg-glass-gradient backdrop-blur-md border border-slate-500/30 rounded-lg shadow-glass p-3 hover:border-slate-400/50 transition-all duration-200 group cursor-pointer'
              onClick={() => handleWordClick(item)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2 mb-1'>
                    <span className='text-slate-200 font-medium group-hover:text-cyan-300 transition-colors'>
                      {item.displayWord}
                    </span>
                    {item.found ? (
                      <div
                        className='w-2 h-2 bg-green-400 rounded-full'
                        title='Found in dictionary'
                      />
                    ) : (
                      <div
                        className='w-2 h-2 bg-orange-400 rounded-full'
                        title='Not found'
                      />
                    )}
                  </div>
                  <div className='flex items-center space-x-3 text-xs text-slate-400'>
                    <span>
                      {new Date(item.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {item.dictionaryResult && (
                      <span className='text-green-400'>Cached</span>
                    )}
                  </div>
                </div>
                <svg
                  className='w-4 h-4 text-slate-500 group-hover:text-cyan-300 transition-colors'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
