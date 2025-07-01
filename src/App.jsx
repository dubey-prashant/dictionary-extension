import { useState, useEffect, useRef } from 'react';

// Loading Component
const LoadingState = () => (
  <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-2xl shadow-glass p-6 animate-fade-in'>
    <div className='flex items-center justify-center py-6'>
      <div className='flex items-center space-x-2'>
        <div className='w-2 h-2 bg-cyan-400 rounded-full animate-pulse'></div>
        <div
          className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className='w-2 h-2 bg-purple-400 rounded-full animate-pulse'
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className='w-2 h-2 bg-pink-400 rounded-full animate-pulse'
          style={{ animationDelay: '0.3s' }}
        ></div>
      </div>
      <span className='ml-4 text-cyan-300 font-medium tracking-wide'>
        PROCESSING QUERY...
      </span>
    </div>
  </div>
);

// Error Component
const ErrorState = ({ message }) => (
  <div className='bg-glass-gradient backdrop-blur-md border border-red-500/30 rounded-2xl shadow-glass p-6 animate-slide-up'>
    <div className='flex items-center'>
      <div className='w-12 h-12 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl flex items-center justify-center mr-4 shadow-neon text-red-400'>
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
          ></path>
        </svg>
      </div>
      <div>
        <h4 className='text-red-300 font-bold text-lg tracking-wide'>
          QUERY FAILED
        </h4>
        <p className='text-red-400/80 text-sm mt-1 font-mono'>{message}</p>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-2xl shadow-glass p-8 text-center'>
    <div className='w-20 h-20 bg-glass-gradient backdrop-blur-sm border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-cyber animate-float'>
      <svg
        className='w-10 h-10 text-cyan-300'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5'
          d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        ></path>
      </svg>
    </div>
    <p className='text-slate-300 font-medium tracking-wide mb-2'>
      SYSTEM READY
    </p>
    <p className='text-slate-400 text-sm font-mono'>
      Awaiting input parameters...
    </p>
  </div>
);

// Results Component
const ResultsDisplay = ({ data }) => {
  const [expandedDefinitions, setExpandedDefinitions] = useState({});

  const toggleDefinitions = (meaningIndex) => {
    setExpandedDefinitions((prev) => ({
      ...prev,
      [meaningIndex]: !prev[meaningIndex],
    }));
  };

  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => console.log('Audio playback failed:', err));
  };

  if (!data || !data[0]) return null;

  const wordData = data[0];

  return (
    <div className='animate-slide-up'>
      {/* Word Header */}
      <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-2xl shadow-glass p-4 mb-4'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-3'>
            {wordData.phonetics &&
              wordData.phonetics[0] &&
              wordData.phonetics[0].audio && (
                <button
                  onClick={() => playAudio(wordData.phonetics[0].audio)}
                  className='group bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 p-2 rounded-lg transition-all duration-300 shadow-cyber hover:shadow-cyber-hover'
                >
                  <svg
                    className='w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform duration-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000-6H6a3 3 0 00-3 3v6a3 3 0 003 3h3a3 3 0 000-6z'
                    ></path>
                  </svg>
                </button>
              )}
            <h3 className='text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-wide'>
              {wordData.word.toUpperCase()}
            </h3>
          </div>
          {wordData.phonetic && (
            <span className='text-sm text-slate-300 font-mono bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-600/30'>
              {wordData.phonetic}
            </span>
          )}
        </div>
      </div>

      {/* Meanings */}
      <div className='space-y-3'>
        {wordData.meanings.map((meaning, index) => (
          <div
            key={index}
            className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-xl shadow-glass p-4 animate-slide-up'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className='flex items-center justify-between mb-3'>
              <span className='bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-neon'>
                {meaning.partOfSpeech}
              </span>
              <span className='text-xs text-slate-400 font-mono'>
                {meaning.definitions.length} def
                {meaning.definitions.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* First Definition */}
            {meaning.definitions.slice(0, 1).map((def, defIndex) => (
              <div key={defIndex} className='space-y-2'>
                <div className='bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg p-3'>
                  <p className='text-slate-200 leading-relaxed text-sm'>
                    {def.definition}
                  </p>
                </div>
                {def.example && (
                  <div className='bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-2 ml-2'>
                    <p className='text-blue-300 italic text-xs'>
                      "{def.example}"
                    </p>
                  </div>
                )}
                {def.synonyms && def.synonyms.length > 0 && (
                  <div className='ml-2'>
                    <span className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
                      Synonyms:
                    </span>
                    <div className='mt-1 flex flex-wrap gap-1'>
                      {def.synonyms.slice(0, 3).map((synonym, synIndex) => (
                        <span
                          key={synIndex}
                          className='bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 text-slate-300 text-xs px-2 py-1 rounded-full hover:bg-slate-600/50 transition-colors duration-200'
                        >
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Show More Button and Hidden Definitions */}
            {meaning.definitions.length > 1 && (
              <>
                <button
                  onClick={() => toggleDefinitions(index)}
                  className='mt-3 text-xs text-cyan-400 hover:text-cyan-300 font-medium tracking-wide transition-colors duration-200 flex items-center space-x-1'
                >
                  <span>
                    {expandedDefinitions[index]
                      ? 'Show less'
                      : `Show ${meaning.definitions.length - 1} more`}
                  </span>
                  <svg
                    className='w-3 h-3 transition-transform duration-200'
                    style={{
                      transform: expandedDefinitions[index]
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                    }}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M19 9l-7 7-7-7'
                    ></path>
                  </svg>
                </button>
                {expandedDefinitions[index] && (
                  <div className='space-y-2 mt-3 animate-slide-up'>
                    {meaning.definitions.slice(1).map((def, defIndex) => (
                      <div key={defIndex} className='space-y-2'>
                        <div className='bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg p-3'>
                          <p className='text-slate-200 leading-relaxed text-sm'>
                            {def.definition}
                          </p>
                        </div>
                        {def.example && (
                          <div className='bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-2 ml-2'>
                            <p className='text-blue-300 italic text-xs'>
                              "{def.example}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const word = query.trim();

    if (!word) {
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();

      if (data.title || !Array.isArray(data)) {
        setError(
          `"${word}" could not be found. Please check the spelling or try a different word.`
        );
        return;
      }

      setResults(data);
    } catch (error) {
      setError(
        'Unable to fetch word definition. Please check your internet connection and try again.'
      );
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (!e.target.value.trim()) {
      setResults(null);
      setError(null);
    }
  };

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

      <div className='relative z-10 p-6'>
        {/* Header */}
        <div className='text-center mb-6'>
          <div className='flex items-center justify-center mb-4'>
            <div className='w-14 h-14 bg-glass-gradient backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mr-4 shadow-glass animate-float'>
              <svg
                className='w-7 h-7 text-cyan-300'
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
            <h1 className='text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent animate-pulse-glow'>
              LEXICON
            </h1>
          </div>
          <p className='text-sm text-slate-300 font-medium tracking-wide'>
            Advanced Definition Interface • v2.0
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className='mb-6'>
          <div className='relative'>
            <div className='absolute inset-0 bg-glass-gradient backdrop-blur-md border border-white/20 rounded-2xl shadow-glass'></div>
            <div className='relative p-1'>
              <input
                ref={inputRef}
                name='word'
                type='text'
                value={query}
                onChange={handleInputChange}
                placeholder='Initialize query protocol...'
                className='w-full px-6 py-4 pr-16 text-white bg-transparent border-none rounded-2xl focus:outline-none placeholder-slate-400 font-medium tracking-wide'
                autoComplete='off'
                spellCheck='false'
              />
              <button
                type='submit'
                title='Execute search protocol'
                aria-label='Execute search protocol'
                className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white p-3 rounded-xl shadow-cyber hover:shadow-cyber-hover transition-all duration-300 focus:outline-none group'
              >
                <svg
                  className='w-5 h-5 group-hover:rotate-90 transition-transform duration-300'
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

        {/* Results Container */}
        <div className='min-h-[200px]'>
          {isLoading && <LoadingState />}
          {error && <ErrorState message={error} />}
          {results && <ResultsDisplay data={results} />}
          {!isLoading && !error && !results && <EmptyState />}
        </div>
      </div>
    </div>
  );
}

export default App;
