import React from 'react';

// Loading Component
const LoadingState = () => (
  <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-lg shadow-glass p-3 animate-fade-in'>
    <div className='flex items-center justify-center py-3'>
      <div className='flex items-center space-x-2'>
        <div className='w-2 h-2 bg-cyan-400 rounded-full animate-pulse'></div>
        <div className='w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-150'></div>
        <div className='w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-300'></div>
      </div>
    </div>
    <p className='text-center text-slate-400 text-xs mt-2 tracking-wide'>
      Searching dictionary...
    </p>
  </div>
);

// Error Component
const ErrorState = ({ error }) => {
  if (error.type === 'not_found') {
    return (
      <div className='bg-glass-gradient backdrop-blur-md border border-orange-500/30 rounded-lg shadow-glass p-3 animate-slide-up'>
        <div className='flex items-center mb-3'>
          <div className='w-8 h-8 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-md flex items-center justify-center mr-3 text-orange-400'>
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
          </div>
          <div>
            <h4 className='text-orange-300 font-bold text-sm tracking-wide'>
              NOT FOUND IN DICTIONARY
            </h4>
            <p className='text-orange-400/80 text-xs mt-1 font-mono'>
              {error.message}
            </p>
          </div>
        </div>

        <div className='space-y-2'>
          <p className='text-xs text-slate-400 text-center'>
            This word could not be found in the dictionary. Please check the
            spelling and try again.
          </p>
        </div>
      </div>
    );
  }

  // Regular error (network, etc.)
  return (
    <div className='bg-glass-gradient backdrop-blur-md border border-red-500/30 rounded-lg shadow-glass p-3 animate-slide-up'>
      <div className='flex items-center'>
        <div className='w-8 h-8 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-md flex items-center justify-center mr-3 text-red-400'>
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
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            ></path>
          </svg>
        </div>
        <div>
          <h4 className='text-red-300 font-bold text-sm tracking-wide'>
            ERROR
          </h4>
          <p className='text-red-400/80 text-xs mt-1 font-mono'>
            {error.message}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Results Display Component
const ResultsDisplay = ({ result, isLoading, error }) => {
  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // If no result, don't render anything
  if (!result) {
    return null;
  }

  // Show dictionary results
  if (!result || typeof result !== 'object') {
    return null;
  }

  // Words API returns a single object, not an array
  const wordData = result;
  if (!wordData || !wordData.word) {
    return null;
  }

  return (
    <div className='animate-slide-up'>
      {/* Results Card */}
      <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-lg shadow-glass p-3 mb-3'>
        {/* Header */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-3'>
            <div className='w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center'>
              <svg
                className='w-3 h-3 text-white'
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
            <h3 className='text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-wide'>
              {wordData.word.toUpperCase()}
            </h3>
          </div>
        </div>

        {/* Pronunciation */}
        {wordData.pronunciation?.all && (
          <div className='text-center mb-3'>
            <span className='text-cyan-300 font-mono text-sm bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/30'>
              /{wordData.pronunciation.all}/
            </span>
          </div>
        )}

        {/* Word Info */}
        {(wordData.frequency || wordData.syllables) && (
          <div className='flex flex-wrap gap-2 mb-3'>
            {wordData.frequency && (
              <span className='bg-purple-700/40 text-purple-200 text-xs font-medium px-2 py-0.5 rounded-md border border-purple-500/30'>
                Frequency: {wordData.frequency}
              </span>
            )}
            {wordData.syllables && (
              <span className='bg-green-700/40 text-green-200 text-xs font-medium px-2 py-0.5 rounded-md border border-green-500/30'>
                Syllables: {wordData.syllables.count} (
                {wordData.syllables.list?.join('-') || 'N/A'})
              </span>
            )}
          </div>
        )}

        {/* Parts of Speech Tags */}
        {wordData.results && wordData.results.length > 0 && (
          <div className='flex flex-wrap gap-1.5 mb-3'>
            {[
              ...new Set(
                wordData.results.map((r) => r.partOfSpeech).filter(Boolean)
              ),
            ].map((partOfSpeech, index) => (
              <span
                key={index}
                className='bg-cyan-700/40 text-cyan-200 text-xs font-medium px-2 py-0.5 rounded-md border border-cyan-500/30 uppercase tracking-wide'
              >
                {partOfSpeech}
              </span>
            ))}
          </div>
        )}

        {/* Results/Definitions */}
        {wordData.results && wordData.results.length > 0 && (
          <div className='bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-lg p-3 space-y-3'>
            {wordData.results.map((result, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  {result.partOfSpeech && (
                    <span className='text-xs font-semibold text-cyan-300 uppercase tracking-wider bg-cyan-700/40 px-2 py-0.5 rounded'>
                      {result.partOfSpeech}
                    </span>
                  )}
                  <div className='flex-1 h-px bg-white/10'></div>
                </div>

                {/* Definition */}
                <div className='space-y-2 ml-2'>
                  <div className='bg-slate-700/30 border border-white/10 rounded-md p-2.5'>
                    <p className='text-slate-200 leading-relaxed text-sm'>
                      {result.definition}
                    </p>
                  </div>

                  {/* Examples */}
                  {result.examples && result.examples.length > 0 && (
                    <div className='bg-blue-900/20 border border-blue-500/20 rounded-md p-2 ml-2'>
                      <p className='text-blue-300 italic text-xs'>
                        "{result.examples[0]}"
                      </p>
                      {result.examples.length > 1 && (
                        <div className='mt-1 space-y-1'>
                          {result.examples
                            .slice(1, 3)
                            .map((example, exIndex) => (
                              <p
                                key={exIndex}
                                className='text-blue-300 italic text-xs opacity-80'
                              >
                                "{example}"
                              </p>
                            ))}
                          {result.examples.length > 3 && (
                            <p className='text-blue-400 text-xs'>
                              +{result.examples.length - 3} more examples
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Synonyms */}
                  {result.synonyms && result.synonyms.length > 0 && (
                    <div className='ml-2'>
                      <span className='text-xs font-medium text-cyan-400 uppercase tracking-wide'>
                        Synonyms:
                      </span>
                      <div className='mt-1 flex flex-wrap gap-1'>
                        {result.synonyms
                          .slice(0, 4)
                          .map((synonym, synIndex) => (
                            <span
                              key={synIndex}
                              className='bg-cyan-700/40 text-cyan-200 text-xs px-2 py-0.5 rounded border border-cyan-500/30 hover:bg-cyan-600/40 transition-colors duration-200'
                            >
                              {synonym}
                            </span>
                          ))}
                        {result.synonyms.length > 4 && (
                          <span className='text-xs text-cyan-400 px-2 py-0.5'>
                            +{result.synonyms.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Antonyms */}
                  {result.antonyms && result.antonyms.length > 0 && (
                    <div className='ml-2'>
                      <span className='text-xs font-medium text-red-400 uppercase tracking-wide'>
                        Antonyms:
                      </span>
                      <div className='mt-1 flex flex-wrap gap-1'>
                        {result.antonyms
                          .slice(0, 4)
                          .map((antonym, antIndex) => (
                            <span
                              key={antIndex}
                              className='bg-red-700/40 text-red-200 text-xs px-2 py-0.5 rounded border border-red-500/30 hover:bg-red-600/40 transition-colors duration-200'
                            >
                              {antonym}
                            </span>
                          ))}
                        {result.antonyms.length > 4 && (
                          <span className='text-xs text-red-400 px-2 py-0.5'>
                            +{result.antonyms.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
