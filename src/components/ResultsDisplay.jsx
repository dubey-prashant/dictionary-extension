import React, { useState } from 'react';

// Loading Component
const LoadingState = () => (
  <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-xl shadow-glass p-4 animate-fade-in'>
    <div className='flex items-center justify-center py-4'>
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
      <span className='ml-4 text-cyan-300 font-medium tracking-wide text-sm'>
        PROCESSING QUERY...
      </span>
    </div>
  </div>
);

// Error Component
const ErrorState = ({ message }) => (
  <div className='bg-glass-gradient backdrop-blur-md border border-red-500/30 rounded-xl shadow-glass p-4 animate-slide-up'>
    <div className='flex items-center'>
      <div className='w-10 h-10 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg flex items-center justify-center mr-3 shadow-neon text-red-400'>
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
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
          ></path>
        </svg>
      </div>
      <div>
        <h4 className='text-red-300 font-bold text-base tracking-wide'>
          QUERY FAILED
        </h4>
        <p className='text-red-400/80 text-xs mt-1 font-mono'>{message}</p>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-xl shadow-glass p-6 text-center'>
    <div className='w-16 h-16 bg-glass-gradient backdrop-blur-sm border border-cyan-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-cyber animate-float'>
      <svg
        className='w-8 h-8 text-cyan-300'
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
    <p className='text-slate-300 font-medium tracking-wide mb-1 text-sm'>
      SYSTEM READY
    </p>
    <p className='text-slate-400 text-xs font-mono'>
      Awaiting input parameters...
    </p>
  </div>
);

// Results Component
const ResultsDisplay = ({ result, isLoading, error }) => {
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

  // Find any available audio from phonetics array
  const findAudioUrl = (phonetics) => {
    if (!phonetics || !Array.isArray(phonetics)) return null;

    for (const phonetic of phonetics) {
      if (phonetic && phonetic.audio && phonetic.audio.trim() !== '') {
        return phonetic.audio;
      }
    }
    return null;
  };

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState message={error} />;
  }

  // Show empty state
  if (!result) {
    return <EmptyState />;
  }

  // Show results
  const wordData = result[0];
  const audioUrl = findAudioUrl(wordData.phonetics);

  return (
    <div className='animate-slide-up'>
      {/* Word Header */}
      <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-xl shadow-glass p-3 mb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            {audioUrl && (
              <button
                onClick={() => playAudio(audioUrl)}
                className='group bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 p-1.5 rounded-lg transition-all duration-300 shadow-cyber hover:shadow-cyber-hover'
              >
                <svg
                  className='w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform duration-300'
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
            <h3 className='text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-wide'>
              {wordData.word.toUpperCase()}
            </h3>
          </div>
          {wordData.phonetic && (
            <span className='text-xs text-slate-300 font-mono bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-600/30'>
              {wordData.phonetic}
            </span>
          )}
        </div>
      </div>

      {/* Meanings */}
      <div className='space-y-2'>
        {wordData.meanings.map((meaning, index) => (
          <div
            key={index}
            className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-lg shadow-glass p-3 animate-slide-up'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className='flex items-center justify-between mb-2'>
              <span className='bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-neon'>
                {meaning.partOfSpeech}
              </span>
              <span className='text-xs text-slate-400 font-mono'>
                {meaning.definitions.length} def
                {meaning.definitions.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* First Definition */}
            {meaning.definitions.slice(0, 1).map((def, defIndex) => (
              <div key={defIndex} className='space-y-1.5'>
                <div className='bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg p-2'>
                  <p className='text-slate-200 leading-relaxed text-sm'>
                    {def.definition}
                  </p>
                </div>
                {def.example && (
                  <div className='bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-1.5 ml-2'>
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
                          className='bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 text-slate-300 text-xs px-1.5 py-0.5 rounded-full hover:bg-slate-600/50 transition-colors duration-200'
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
                  className='mt-2 text-xs text-cyan-400 hover:text-cyan-300 font-medium tracking-wide transition-colors duration-200 flex items-center space-x-1'
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
                  <div className='space-y-1.5 mt-2 animate-slide-up'>
                    {meaning.definitions.slice(1).map((def, defIndex) => (
                      <div key={defIndex} className='space-y-1.5'>
                        <div className='bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg p-2'>
                          <p className='text-slate-200 leading-relaxed text-sm'>
                            {def.definition}
                          </p>
                        </div>
                        {def.example && (
                          <div className='bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-1.5 ml-2'>
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

export default ResultsDisplay;
