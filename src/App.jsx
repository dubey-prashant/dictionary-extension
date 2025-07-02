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

      <div className='relative z-10 p-5'>
        {/* Header */}
        <div className='text-center mb-5'>
          <div className='flex items-center justify-center mb-3'>
            <div className='w-12 h-12 bg-glass-gradient backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center mr-3 shadow-glass animate-float'>
              <svg
                className='w-6 h-6 text-cyan-300'
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
            <h1 className='text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent animate-pulse-glow'>
              LEXICON
            </h1>
          </div>
          <p className='text-xs text-slate-300 font-medium tracking-wide'>
            Advanced Definition Interface • v2.0
          </p>
        </div>

        <SearchForm
          onSearch={setSearchResult}
          onLoading={setIsLoading}
          onError={setError}
        />

        <ResultsDisplay
          result={searchResult}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;
