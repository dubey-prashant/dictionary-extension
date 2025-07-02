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
    hideSuggestions
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
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
      );
      const data = await response.json();

      if (data.title || !Array.isArray(data)) {
        onError(`"${word}" could not be found. Please check the spelling or try a different word.`);
        return;
      }

      onSearch(data);
    } catch (error) {
      onError('Unable to fetch word definition. Please check your internet connection and try again.');
      console.error('Fetch error:', error);
    } finally {
      onLoading(false);
    }
  };

  return (
    <div ref={formRef} className="relative mb-4">
      <form onSubmit={handleSubmit}>
        <div className="bg-glass-gradient backdrop-blur-md border border-white/20 rounded-xl shadow-glass p-3">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                name="word"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDownEvent}
                placeholder="Initialize query protocol..."
                className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 text-sm"
                autoComplete="off"
                spellCheck="false"
              />
              
              {suggestionsLoading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-cyber hover:shadow-cyber-hover"
            >
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
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
