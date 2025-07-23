import React, { useState, useRef, useEffect } from 'react';
import { useAutocomplete } from '../hooks/useAutocomplete';
import AutocompleteDropdown from './AutocompleteDropdown';
import HistoryModal from './HistoryModal';
import { searchService, NotFoundError } from '../services/searchService';

const SearchForm = ({ onSearch, onLoading, onError }) => {
  const [query, setQuery] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const inputRef = useRef(null);
  const formRef = useRef(null);

  const {
    suggestions,
    isVisible,
    selectedIndex,
    isLoading: suggestionsLoading,
    fetchSuggestions,
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
    fetchSuggestions(value.trim()); // Instant local suggestions, no debouncing needed
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
      const result = await searchService.searchDictionary(word);
      onSearch(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        // Pass the word and error to parent for handling "Search with AI" option
        onError({
          type: 'not_found',
          message: error.message,
          word: word,
        });
      } else {
        onError({
          type: 'network',
          message: error.message,
        });
      }
    } finally {
      onLoading(false);
    }
  };

  const handleHistoryWordSelect = (result, type) => {
    if (type === 'dictionary') {
      onSearch(result);
      onError(null);
    } else if (type === 'ai') {
      onSearch(result);
      onError(null);
    } else if (type === 'search') {
      // Trigger new search
      setQuery(result);
      performSearch(result);
    }
  };

  return (
    <div ref={formRef} className='relative mb-3'>
      {/* Header with Logo and History */}
      <div className='flex items-center justify-between mb-3'>
        {/* Logo */}
        <div className='flex items-center space-x-2.5'>
          <div className='w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg'>
            <svg
              className='w-5 h-5 text-white'
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
          <h1 className='text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-wide'>
            LEXICON
          </h1>
        </div>

        {/* History Button */}
        <button
          onClick={() => setIsHistoryOpen(true)}
          className='bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/50 p-2 rounded-lg transition-all duration-300 group hover:shadow-lg'
          title='Search History'
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
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            ></path>
          </svg>
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit}>
        <div className='group bg-glass-gradient backdrop-blur-md border border-white/20 focus-within:border-purple-300/80 rounded-xl shadow-glass p-1 flex items-center gap-2'>
          <div className='flex-1 relative flex items-center'>
            <input
              ref={inputRef}
              type='text'
              name='word'
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDownEvent}
              placeholder='Search any word...'
              className='w-full  pl-4 pr-12 py-2 text-slate-200 placeholder-slate-400 focus:outline-none text-sm'
              autoComplete='off'
              spellCheck='false'
            />

            {suggestionsLoading && (
              <div className='absolute right-0'>
                <div className='w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin'></div>
              </div>
            )}
          </div>

          <button
            type='submit'
            className='text-white/20 group-focus-within:text-purple-300 p-2.5 rounded-lg transition-all duration-300 hover:shadow-lg'
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
      </form>

      <AutocompleteDropdown
        suggestions={suggestions}
        isVisible={isVisible}
        selectedIndex={selectedIndex}
        isLoading={suggestionsLoading}
        onSelect={handleSuggestionSelect}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onWordSelect={handleHistoryWordSelect}
      />
    </div>
  );
};

export default SearchForm;
