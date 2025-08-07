import { useWordOfTheDay } from '../hooks/useWordOfTheDay';

const WordOfTheDay = ({ onWordClick }) => {
  const { wordOfTheDay, isLoading } = useWordOfTheDay();

  if (isLoading) {
    return (
      <div className='bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg p-4'>
        <div className='flex items-center justify-center py-3'>
          <div className='flex items-center space-x-2'>
            <div className='w-1.5 h-1.5 bg-indigo-400 rounded-full animate-gentle-pulse'></div>
            <div
              className='w-1.5 h-1.5 bg-indigo-400 rounded-full animate-gentle-pulse'
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className='w-1.5 h-1.5 bg-indigo-400 rounded-full animate-gentle-pulse'
              style={{ animationDelay: '0.4s' }}
            ></div>
            <span className='ml-2 text-sm text-indigo-700'>
              Loading word of the day...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!wordOfTheDay) return null;

  return (
    <div className='bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg p-4 shadow-sm'>
      <div className='flex items-center justify-between mb-3'>
        <span className='text-sm font-semibold text-indigo-600'>
          Word of the Day
        </span>
        <span className='text-xs text-indigo-500'>
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
            className='text-lg font-semibold text-indigo-900 hover:text-indigo-700 transition-colors duration-200 cursor-pointer'
          >
            {wordOfTheDay.word}
          </button>
          <span className='bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded font-medium'>
            {wordOfTheDay.partOfSpeech}
          </span>
        </div>

        <div className='bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg p-3'>
          <p className='text-indigo-900 text-sm leading-relaxed font-medium'>
            {wordOfTheDay.definition}
          </p>
        </div>

        {wordOfTheDay.example && (
          <div className='border-l-3 border-indigo-400 pl-3 bg-white/50 rounded-r-md py-2'>
            <p className='text-indigo-800 italic text-sm font-medium'>
              {wordOfTheDay.example}
            </p>
          </div>
        )}
      </div>

      <div className='mt-3 pt-2 border-t border-indigo-200'>
        <p className='text-xs text-indigo-700 text-center font-medium'>
          Click the word to search for more details
        </p>
      </div>
    </div>
  );
};

export default WordOfTheDay;
