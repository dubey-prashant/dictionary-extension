import React, { useState } from 'react';

// Minimalist Loading Component
const LoadingState = () => (
  <div className='bg-white border border-gray-200 rounded-lg p-4 animate-fade-in'>
    <div className='flex items-center justify-center py-6'>
      <div className='relative'>
        <div className='w-8 h-8 border-2 border-gray-200 rounded-full animate-spin'>
          <div className='absolute top-0 left-0 w-8 h-8 border-2 border-transparent border-t-indigo-600 rounded-full animate-spin'></div>
        </div>
      </div>
    </div>
    <div className='text-center'>
      <p className='text-gray-600 text-sm font-medium'>
        Searching dictionary...
      </p>
      <div className='flex items-center justify-center space-x-1 mt-2'>
        <div className='w-1.5 h-1.5 bg-indigo-600 rounded-full animate-gentle-pulse'></div>
        <div
          className='w-1.5 h-1.5 bg-indigo-600 rounded-full animate-gentle-pulse'
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className='w-1.5 h-1.5 bg-indigo-600 rounded-full animate-gentle-pulse'
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
    </div>
  </div>
);

// Clean Error Component
const ErrorState = ({ error }) => {
  if (error.type === 'not_found') {
    return (
      <div className='bg-white border border-orange-200 rounded-lg p-4 animate-slide-up'>
        <div className='flex items-start space-x-3 mb-3'>
          <div className='w-10 h-10 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center text-orange-500 shrink-0'>
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
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <div className='flex-1'>
            <h4 className='text-orange-900 font-semibold text-base mb-1'>
              Word Not Found
            </h4>
            <p className='text-orange-700 mb-2 text-sm'>
              Sorry, we couldn't find "{error.word}" in our dictionary.
            </p>
            <div className='bg-orange-50 border border-orange-100 rounded-lg p-2'>
              <p className='text-orange-600 text-xs font-medium mb-1'>
                Suggestions:
              </p>
              <ul className='text-orange-600 text-xs space-y-0.5'>
                <li>• Check the spelling</li>
                <li>• Try a different word form</li>
                <li>• Search for synonyms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // General error
  return (
    <div className='bg-white border border-red-200 rounded-lg p-4 animate-slide-up'>
      <div className='flex items-start space-x-3'>
        <div className='w-10 h-10 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center text-red-500 shrink-0'>
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
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.081 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>
        <div className='flex-1'>
          <h4 className='text-red-900 font-semibold text-base mb-1'>
            Something went wrong
          </h4>
          <p className='text-red-700 mb-2 text-sm'>
            {error.message ||
              'Failed to fetch word definition. Please try again.'}
          </p>
          <div className='bg-red-50 border border-red-100 rounded-lg p-2'>
            <p className='text-red-600 text-xs'>
              If this problem persists, please check your internet connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Results Display Component - Handles both legacy and new schema formats
const ResultsDisplay = ({ result, isLoading, error }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Pronounce word using Web Speech API
  const pronounceWord = (word) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      setIsPlaying(true);

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.7; // Slightly slower for clarity
      utterance.pitch = 1.2;
      utterance.volume = 0.8;

      // Reset playing state when finished
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported');
    }
  };

  // Normalize data to ensure consistent rendering
  const normalizeWordData = (data) => {
    if (!data) return null;

    // Always expect new schema format now
    return {
      word: data.word,
      pronunciation: data.pronunciation,
      meanings: data.meanings || [],
      source: data.source || 'dictionaryapi',
    };
  };

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

  // Normalize the data to handle both old and new schemas
  const wordData = normalizeWordData(result);
  if (!wordData || !wordData.word) {
    return null;
  }

  return (
    <div className='animate-slide-up'>
      {/* Traditional Dictionary Layout */}
      <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
        {/* Word Header - Traditional Style */}
        <div className='border-b border-gray-100 px-4 py-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-baseline space-x-3'>
              <h1 className='text-2xl font-bold text-gray-800'>
                {wordData.word}
              </h1>

              {/* Pronunciation */}
              {wordData.pronunciation?.text && (
                <span className='text-gray-600 text-sm font-mono'>
                  /{wordData.pronunciation.text}/
                </span>
              )}
            </div>

            {/* Pronunciation Button */}
            <button
              onClick={() => pronounceWord(wordData.word)}
              className={`px-2 py-1.5 rounded-md transition-all duration-200 focus-ring ${
                isPlaying
                  ? 'bg-gray-100 border border-gray-300 text-gray-700'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-indigo-600'
              }`}
              title={isPlaying ? 'Playing...' : 'Pronounce word'}
              disabled={isPlaying}
            >
              {isPlaying ? (
                <svg
                  className='w-4 h-4 animate-pulse'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' />
                </svg>
              ) : (
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Definitions - Simplified Design */}
        <div className='px-4 py-4'>
          {wordData.meanings && wordData.meanings.length > 0 && (
            <div className='space-y-4'>
              {wordData.meanings.map((meaning, meaningIndex) => (
                <div key={meaningIndex} className='mb-4'>
                  {/* Part of Speech Header - Smaller */}
                  <h2 className='text-sm font-semibold text-gray-800 mb-3'>
                    {meaning.partOfSpeech}
                  </h2>

                  {/* Definitions for this part of speech */}
                  <div className='space-y-3'>
                    {meaning.definitions.map((definition, defIndex) => (
                      <div key={defIndex} className=''>
                        {/* Definition with left border */}
                        <div className='border-l-3 border-gray-300 pl-3'>
                          <p className='text-gray-900 text-sm leading-relaxed mb-1'>
                            {definition.definition}
                          </p>

                          {/* Example - just italic, no prefix */}
                          {definition.example && (
                            <p className='text-gray-600 italic text-xs leading-relaxed'>
                              {definition.example}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
