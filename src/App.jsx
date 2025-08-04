import { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultsDisplay from './components/ResultsDisplay';
import SearchHistory from './components/SearchHistory';
import CacheStats from './components/CacheStats';
import WordOfTheDay from './components/WordOfTheDay';
import { searchService } from './services/searchService';
import './style.css';

function App() {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle search from history
  const handleHistoryWordClick = async (result, type) => {
    if (type === 'dictionary') {
      setSearchResult(result);
      setError(null);
    } else if (type === 'search') {
      // Trigger new search
      setIsLoading(true);
      setError(null);
      setSearchResult(null);

      try {
        const searchResult = await searchService.searchDictionary(result);
        setSearchResult(searchResult);
      } catch (err) {
        if (err.name === 'NotFoundError') {
          setError({
            type: 'not_found',
            message: err.message,
            word: result,
          });
        } else {
          setError({
            type: 'network',
            message: err.message,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Word of the Day click
  const handleWordOfTheDayClick = async (word) => {
    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const result = await searchService.searchDictionary(word);
      setSearchResult(result);
    } catch (err) {
      if (err.name === 'NotFoundError') {
        setError({
          type: 'not_found',
          message: err.message,
          word: word,
        });
      } else {
        setError({
          type: 'network',
          message: err.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-96 min-h-[500px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'>
      <div className='relative z-10 p-4'>
        {/* Header with Logo, History, and Settings */}
        <Header onHistoryWordSelect={handleHistoryWordClick} />

        {/* Search Form */}
        <SearchForm
          onSearch={setSearchResult}
          onLoading={setIsLoading}
          onError={setError}
        />

        <ResultsDisplay
          result={searchResult}
          isLoading={isLoading}
          error={error}
          onSearch={setSearchResult}
          onLoading={setIsLoading}
          onError={setError}
        />

        {/* Word of the Day - Always visible */}
        <div className='mb-3'>
          <WordOfTheDay onWordClick={handleWordOfTheDayClick} />
        </div>

        {/* Show search history only when no current search result or error */}
        {!searchResult && !error && !isLoading && (
          <SearchHistory onWordClick={handleHistoryWordClick} />
        )}
      </div>
    </div>
  );
}

export default App;
