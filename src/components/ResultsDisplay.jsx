import React, { useState } from 'react';
import WordOfTheDay from './WordOfTheDay';
import { searchService } from '../services/searchService';

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

// Error Component with AI fallback
const ErrorState = ({ error, onSearchWithAI }) => {
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('gemini_api_key') || ''
  );
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleSearchWithAI = async () => {
    if (!apiKey.trim()) {
      setShowApiKeyInput(true);
      return;
    }

    setIsSearchingAI(true);
    try {
      // Save API key to localStorage
      localStorage.setItem('gemini_api_key', apiKey.trim());

      const result = await searchService.searchWithAI(
        error.word,
        apiKey.trim()
      );
      onSearchWithAI(result);
    } catch (err) {
      console.error('AI search failed:', err);
      // Handle AI search error
      onSearchWithAI({
        type: 'ai_error',
        message: err.message,
        word: error.word,
      });
    } finally {
      setIsSearchingAI(false);
    }
  };

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

        {showApiKeyInput ? (
          <div className='space-y-2'>
            <div className='bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-md p-2'>
              <label className='block text-xs text-slate-300 mb-1'>
                Gemini API Key:
              </label>
              <input
                type='password'
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder='Enter your Gemini API key...'
                className='w-full bg-slate-700/50 border border-slate-600/30 rounded text-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/50'
              />
              <p className='text-xs text-slate-400 mt-1'>
                Get your free API key from{' '}
                <a
                  href='https://aistudio.google.com/app/apikey'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-cyan-400 hover:text-cyan-300'
                >
                  Google AI Studio
                </a>
              </p>
            </div>
            <div className='flex space-x-2'>
              <button
                onClick={handleSearchWithAI}
                disabled={!apiKey.trim() || isSearchingAI}
                className='flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-gray-500 disabled:to-gray-500 text-white px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 flex items-center justify-center space-x-1'
              >
                {isSearchingAI ? (
                  <>
                    <div className='w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className='w-3 h-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                      ></path>
                    </svg>
                    <span>Search with AI</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowApiKeyInput(false)}
                className='px-3 py-2 text-slate-400 hover:text-slate-300 text-xs'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowApiKeyInput(true)}
            className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2'
          >
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
                d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
              ></path>
            </svg>
            <span>Search with AI</span>
          </button>
        )}
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

// AI Results Component
const AIResultsDisplay = ({ result }) => {
  return (
    <div className='animate-slide-up'>
      <div className='bg-glass-gradient backdrop-blur-md border border-purple-500/30 rounded-lg shadow-glass p-3 mb-3'>
        {/* AI Header */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-2'>
            <div className='w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
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
                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                ></path>
              </svg>
            </div>
            <h3 className='text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent tracking-wide'>
              {result.word.toUpperCase()}
            </h3>
          </div>
          <span className='bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider'>
            AI POWERED
          </span>
        </div>

        {/* AI Definition */}
        <div className='bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg p-3'>
          <div className='prose prose-sm prose-invert max-w-none'>
            <div className='text-slate-200 leading-relaxed text-sm whitespace-pre-wrap'>
              {result.aiDefinition}
            </div>
          </div>
        </div>

        <div className='mt-3 pt-2 border-t border-white/10'>
          <p className='text-xs text-slate-400 text-center font-mono flex items-center justify-center space-x-1'>
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <span>Definition provided by Gemini AI</span>
          </p>
        </div>
      </div>
    </div>
  );
};
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
      const result = await searchService.searchDictionary(word);
      onSearch(result);
    } catch (err) {
      if (err.name === 'NotFoundError') {
        onError({
          type: 'not_found',
          message: err.message,
          word: word,
        });
      } else {
        onError({
          type: 'network',
          message: err.message,
        });
      }
    } finally {
      onLoading(false);
    }
  };

  // Handle AI search results
  const handleSearchWithAI = (aiResult) => {
    if (aiResult.type === 'ai_error') {
      onError(aiResult);
    } else {
      onSearch(aiResult);
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onSearchWithAI={handleSearchWithAI} />;
  }

  // Show empty state - only Word of the Day
  if (!result) {
    return <WordOfTheDay onWordClick={handleWordOfTheDayClick} />;
  }

  // Show AI results
  if (result.isAIResult) {
    return (
      <div>
        <AIResultsDisplay result={result} />
        {/* Word of the Day - shown after AI results */}
        <div className='mt-3'>
          <WordOfTheDay onWordClick={handleWordOfTheDayClick} />
        </div>
      </div>
    );
  }

  // Show regular dictionary results
  const wordData = result[0];
  const audioUrl = findAudioUrl(wordData.phonetics);

  return (
    <div className='animate-slide-up'>
      {/* Compact Results Card */}
      <div className='bg-glass-gradient backdrop-blur-md border border-white/20 rounded-lg shadow-glass p-3 mb-3'>
        {/* Word Header */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-3'>
            <h3 className='text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-wide'>
              {wordData.word.toUpperCase()}
            </h3>
            {/* Always visible pronunciation button */}
            <button
              onClick={() => (audioUrl ? playAudio(audioUrl) : null)}
              className={`group backdrop-blur-sm border rounded-lg p-1.5 transition-all duration-300 ${
                audioUrl
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400/50 hover:shadow-md cursor-pointer'
                  : 'bg-slate-500/20 border-slate-600/30 cursor-not-allowed opacity-50'
              }`}
              title={audioUrl ? 'Play pronunciation' : 'No audio available'}
              disabled={!audioUrl}
            >
              <svg
                className={`w-3 h-3 transition-all duration-300 ${
                  audioUrl
                    ? 'text-emerald-300 group-hover:scale-110 group-hover:text-emerald-200'
                    : 'text-slate-400'
                }`}
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
          </div>
          {wordData.phonetic && (
            <span className='text-xs text-slate-400 font-mono bg-slate-800/30 px-2 py-1 rounded-md border border-slate-600/30'>
              {wordData.phonetic}
            </span>
          )}
        </div>

        {/* Subtle Parts of Speech Tags */}
        <div className='flex flex-wrap gap-1.5 mb-3'>
          {wordData.meanings.map((meaning, index) => (
            <span
              key={index}
              className='bg-slate-700/40 text-slate-400 text-xs font-medium px-2 py-0.5 rounded-md border border-slate-600/30 uppercase tracking-wide'
            >
              {meaning.partOfSpeech}
            </span>
          ))}
        </div>

        {/* Unified Meanings Card */}
        <div className='bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg p-3 space-y-3'>
          {wordData.meanings.map((meaning, index) => (
            <div key={index} className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <span className='text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-700/40 px-2 py-0.5 rounded'>
                  {meaning.partOfSpeech}
                </span>
                <div className='flex-1 h-px bg-slate-600/30'></div>
                <span className='text-xs text-slate-500 font-mono'>
                  {meaning.definitions.length}
                </span>
              </div>

              {/* First Definition */}
              {meaning.definitions.slice(0, 1).map((def, defIndex) => (
                <div key={defIndex} className='space-y-2 ml-2'>
                  <div className='bg-slate-700/30 border border-slate-600/20 rounded-md p-2.5'>
                    <p className='text-slate-200 leading-relaxed text-sm'>
                      {def.definition}
                    </p>
                  </div>
                  {def.example && (
                    <div className='bg-blue-900/20 border border-blue-500/20 rounded-md p-2 ml-2'>
                      <p className='text-blue-300 italic text-xs'>
                        "{def.example}"
                      </p>
                    </div>
                  )}
                  {def.synonyms && def.synonyms.length > 0 && (
                    <div className='ml-2'>
                      <span className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                        Synonyms:
                      </span>
                      <div className='mt-1 flex flex-wrap gap-1'>
                        {def.synonyms.slice(0, 4).map((synonym, synIndex) => (
                          <span
                            key={synIndex}
                            className='bg-slate-700/40 text-slate-300 text-xs px-2 py-0.5 rounded border border-slate-600/30 hover:bg-slate-600/40 transition-colors duration-200'
                          >
                            {synonym}
                          </span>
                        ))}
                        {def.synonyms.length > 4 && (
                          <span className='text-xs text-slate-500 px-2 py-0.5'>
                            +{def.synonyms.length - 4} more
                          </span>
                        )}
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
                    <div className='space-y-2 ml-2 animate-slide-up'>
                      {meaning.definitions.slice(1).map((def, defIndex) => (
                        <div key={defIndex} className='space-y-1.5'>
                          <div className='bg-slate-700/30 border border-slate-600/20 rounded-md p-2.5'>
                            <p className='text-slate-200 leading-relaxed text-sm'>
                              {def.definition}
                            </p>
                          </div>
                          {def.example && (
                            <div className='bg-blue-900/20 border border-blue-500/20 rounded-md p-2 ml-2'>
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
                <div className='border-t border-slate-600/20 pt-2'></div>
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
