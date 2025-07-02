import React, { useState } from 'react';
import WordOfTheDay from './WordOfTheDay';

// Loading Component
const LoadingState = () => (
  <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-lg shadow-glass p-3 animate-fade-in'>
    <div className='flex items-center justify-center py-3'>
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
          QUERY FAILED
        </h4>
        <p className='text-red-400/80 text-xs mt-1 font-mono'>{message}</p>
      </div>
    </div>
  </div>
);

// Results Component
const ResultsDisplay = ({
  result,
  isLoading,
  error,
  onSearch,
  onLoading,
  onError,
}) => {
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

  // Handle Word of the Day click
  const handleWordOfTheDayClick = async (word) => {
    if (!onSearch || !onLoading || !onError) return;

    onLoading(true);
    onError(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          word
        )}`
      );
      const data = await response.json();

      if (data.title || !Array.isArray(data)) {
        onError(
          `"${word}" could not be found. Please check the spelling or try a different word.`
        );
        return;
      }

      onSearch(data);
    } catch (error) {
      onError(
        'Unable to fetch word definition. Please check your internet connection and try again.'
      );
      console.error('Fetch error:', error);
    } finally {
      onLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState message={error} />;
  }

  // Show empty state - only Word of the Day
  if (!result) {
    return <WordOfTheDay onWordClick={handleWordOfTheDayClick} />;
  }

  // Show results
  const wordData = result[0];
  const audioUrl = findAudioUrl(wordData.phonetics);

  return (
    <div className='animate-slide-up'>
      {/* Compact Results Card */}
      <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-lg shadow-glass p-3 mb-3'>
        {/* Word Header */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-2'>
            {audioUrl && (
              <button
                onClick={() => playAudio(audioUrl)}
                className='group bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400/50 p-1 rounded-md transition-all duration-300'
              >
                <svg
                  className='w-3 h-3 text-emerald-300 group-hover:scale-110 transition-transform duration-300'
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
            <h3 className='text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-wide'>
              {wordData.word.toUpperCase()}
            </h3>
          </div>
          {wordData.phonetic && (
            <span className='text-xs text-slate-300 font-mono bg-slate-800/50 px-2 py-0.5 rounded border border-slate-600/30'>
              {wordData.phonetic}
            </span>
          )}
        </div>

        {/* All Meanings in One Card */}
        <div className='space-y-3'>
          {wordData.meanings.map((meaning, index) => (
            <div key={index} className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <span className='bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wide'>
                  {meaning.partOfSpeech}
                </span>
                <span className='text-xs text-slate-400 font-mono'>
                  {meaning.definitions.length} def
                  {meaning.definitions.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* First Definition */}
              {meaning.definitions.slice(0, 1).map((def, defIndex) => (
                <div key={defIndex} className='space-y-1.5 ml-2'>
                  <div className='bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-md p-2'>
                    <p className='text-slate-200 leading-relaxed text-sm'>
                      {def.definition}
                    </p>
                  </div>
                  {def.example && (
                    <div className='bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-md p-1.5 ml-2'>
                      <p className='text-blue-300 italic text-xs'>
                        "{def.example}"
                      </p>
                    </div>
                  )}
                  {def.synonyms && def.synonyms.length > 0 && (
                    <div className='ml-2'>
                      <span className='text-xs font-medium text-slate-400 uppercase tracking-wide'>
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

              {/* Show More Button */}
              {meaning.definitions.length > 1 && (
                <>
                  <button
                    onClick={() => toggleDefinitions(index)}
                    className='ml-2 text-xs text-cyan-400 hover:text-cyan-300 font-medium tracking-wide transition-colors duration-200 flex items-center space-x-1'
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
                    <div className='space-y-1.5 ml-2 animate-slide-up'>
                      {meaning.definitions.slice(1).map((def, defIndex) => (
                        <div key={defIndex} className='space-y-1.5'>
                          <div className='bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-md p-2'>
                            <p className='text-slate-200 leading-relaxed text-sm'>
                              {def.definition}
                            </p>
                          </div>
                          {def.example && (
                            <div className='bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-md p-1.5 ml-2'>
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

              {/* Separator between meanings */}
              {index < wordData.meanings.length - 1 && (
                <div className='border-t border-slate-600/30 pt-2'></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Word of the Day - shown after search results */}
      <div className='mt-3'>
        <WordOfTheDay onWordClick={handleWordOfTheDayClick} />
      </div>
    </div>
  );
};

export default ResultsDisplay;
