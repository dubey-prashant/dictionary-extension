import { useState, useCallback, useRef } from 'react';

export const useAutocomplete = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef(new Map());
  const debounceRef = useRef(null);

  // Fetch suggestions from Datamuse API
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setIsVisible(false);
      return;
    }

    // Check cache first
    const cacheKey = query.toLowerCase();
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      setSuggestions(cached);
      setIsVisible(cached.length > 0);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.datamuse.com/sug?s=${encodeURIComponent(query)}&max=6`
      );
      const data = await response.json();

      const suggestionList = data.map((item) => item.word);

      // Cache the results
      cacheRef.current.set(cacheKey, suggestionList);

      // Limit cache size
      if (cacheRef.current.size > 100) {
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }

      setSuggestions(suggestionList);
      setIsVisible(suggestionList.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setIsVisible(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  const debouncedFetch = useCallback(
    (query) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 250);
    },
    [fetchSuggestions]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e, query, onSelect) => {
      if (!isVisible || suggestions.length === 0) return false;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          return true;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          return true;

        case 'Enter':
          if (selectedIndex >= 0) {
            e.preventDefault();
            onSelect(suggestions[selectedIndex]);
            setIsVisible(false);
            return true;
          }
          return false;

        case 'Escape':
          setIsVisible(false);
          setSelectedIndex(-1);
          return true;

        default:
          return false;
      }
    },
    [isVisible, suggestions, selectedIndex]
  );

  // Select suggestion
  const selectSuggestion = useCallback((suggestion, onSelect) => {
    onSelect(suggestion);
    setIsVisible(false);
    setSelectedIndex(-1);
  }, []);

  // Hide suggestions
  const hideSuggestions = useCallback(() => {
    setIsVisible(false);
    setSelectedIndex(-1);
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    suggestions,
    isVisible,
    selectedIndex,
    isLoading,
    debouncedFetch,
    handleKeyDown,
    selectSuggestion,
    hideSuggestions,
    clearCache,
  };
};
