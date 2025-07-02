import { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultsDisplay from './components/ResultsDisplay';
import './style.css';

function App() {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className='w-96 min-h-[500px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 bg-cyber-mesh opacity-30'></div>
      <div className='absolute top-0 left-0 w-full h-full'>
        <div className='absolute top-10 left-10 w-2 h-2 bg-cyber-cyan rounded-full animate-pulse'></div>
        <div
          className='absolute top-20 right-20 w-1 h-1 bg-cyber-pink rounded-full animate-pulse'
          style={{ animationDelay: '0.5s' }}
        ></div>
        <div
          className='absolute bottom-20 left-20 w-1.5 h-1.5 bg-cyber-blue rounded-full animate-pulse'
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className='absolute bottom-10 right-10 w-1 h-1 bg-cyber-purple rounded-full animate-pulse'
          style={{ animationDelay: '1.5s' }}
        ></div>
      </div>

      <div className='relative z-10 p-4'>
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
      </div>
    </div>
  );
}

export default App;
