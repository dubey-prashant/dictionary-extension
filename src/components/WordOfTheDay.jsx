import { useWordOfTheDay } from '../hooks/useWordOfTheDay';

const WordOfTheDay = ({ onWordClick }) => {
  const { wordOfTheDay, isLoading } = useWordOfTheDay();

  if (isLoading) {
    return (
      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <div className='flex items-center justify-center py-3'>
          <div className='flex items-center space-x-2'>
            <div className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-gentle-pulse'></div>
            <div
              className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-gentle-pulse'
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-gentle-pulse'
              style={{ animationDelay: '0.4s' }}
            ></div>
            <span className='ml-2 text-sm text-gray-600'>
              Loading word of the day...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!wordOfTheDay) return null;

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4'>
      <div className='flex items-center justify-between mb-3'>
        <span className='text-sm font-semibold text-indigo-600'>
          Word of the Day
        </span>
        <span className='text-xs text-gray-500'>
          {new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <button
            onClick={() => onWordClick && onWordClick(wordOfTheDay.word)}
            className='text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200 cursor-pointer'
          >
            {wordOfTheDay.word}
          </button>
          <span className='bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded'>
            {wordOfTheDay.partOfSpeech}
          </span>
        </div>

        <div className='bg-gray-50 border border-gray-200 rounded-lg p-3'>
          <p className='text-gray-800 text-sm leading-relaxed'>
            {wordOfTheDay.definition}
          </p>
        </div>

        {wordOfTheDay.example && (
          <div className='border-l-3 border-gray-300 pl-3'>
            <p className='text-gray-600 italic text-sm'>
              {wordOfTheDay.example}
            </p>
          </div>
        )}
      </div>

      <div className='mt-3 pt-2 border-t border-gray-100'>
        <p className='text-xs text-gray-500 text-center'>
          Click the word to search for more details
        </p>
      </div>
    </div>
  );
};

export default WordOfTheDay;
