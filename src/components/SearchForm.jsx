import React, { useState, useRef, useEffect } from 'react';
import { useAutocomplete } from '../hooks/useAutocomplete';
import AutocompleteDropdown from './AutocompleteDropdown';

const SearchForm = ({ onSearch, onLoading, onError }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const formRef = useRef(null);

  const {
    suggestions,
    isVisible,
    selectedIndex,
    isLoading: suggestionsLoading,
    debouncedFetch,
    handleKeyDown,
    selectSuggestion,
    hideSuggestions,
  } = useAutocomplete();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        hideSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hideSuggestions]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetch(value.trim());
  };

  const handleKeyDownEvent = (e) => {
    const handled = handleKeyDown(e, query, handleSuggestionSelect);
    if (!handled && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setQuery(suggestion);
    selectSuggestion(suggestion, (word) => {
      performSearch(word);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const word = query.trim();

    if (!word) {
      inputRef.current?.focus();
      return;
    }

    hideSuggestions();
    performSearch(word);
  };

  const performSearch = async (word) => {
    onLoading(true);
    onError(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          word
        )}`
      );
      const data = await response.json();

      if (data.title || !Array.isArray(data)) {
        onError(
          `"${word}" could not be found. Please check the spelling or try a different word.`
        );
        return;
      }

      onSearch(data);
    } catch (error) {
      onError(
        'Unable to fetch word definition. Please check your internet connection and try again.'
      );
      console.error('Fetch error:', error);
    } finally {
      onLoading(false);
    }
  };

  return (
    <div ref={formRef} className='relative mb-4'>
      <form onSubmit={handleSubmit}>
        <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-lg shadow-glass p-2'>
          <div className='flex items-center space-x-2'>
            <div className='flex-1 relative flex items-center'>
              {/* Icon inside input */}
              <div className='absolute left-2 z-10'>
                <svg
                  className='w-4 h-4 text-cyan-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  ></path>
                </svg>
              </div>

              <input
                ref={inputRef}
                type='text'
                name='word'
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDownEvent}
                placeholder='Search any word...'
                className='w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-md pl-8 pr-8 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 text-sm'
                autoComplete='off'
                spellCheck='false'
              />

              {suggestionsLoading && (
                <div className='absolute right-2'>
                  <div className='w-3 h-3 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin'></div>
                </div>
              )}
            </div>

            <button
              type='submit'
              className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white p-2 rounded-md transition-all duration-300 shadow-cyber hover:shadow-cyber-hover'
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
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </form>

      <AutocompleteDropdown
        suggestions={suggestions}
        isVisible={isVisible}
        selectedIndex={selectedIndex}
        isLoading={suggestionsLoading}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
};

export default SearchForm;
