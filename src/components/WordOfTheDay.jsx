import { useWordOfTheDay } from '../hooks/useWordOfTheDay';

const WordOfTheDay = ({ onWordClick }) => {
  const { wordOfTheDay, isLoading } = useWordOfTheDay();

  if (isLoading) {
    return (
      <div className='bg-glass-gradient backdrop-blur-md border border-purple-500/30 rounded-xl shadow-glass p-4'>
        <div className='flex items-center justify-center py-4'>
          <div className='flex items-center space-x-2'>
            <div className='w-1 h-1 bg-purple-400 rounded-full animate-pulse'></div>
            <div
              className='w-1 h-1 bg-pink-400 rounded-full animate-pulse'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='w-1 h-1 bg-purple-400 rounded-full animate-pulse'
              style={{ animationDelay: '0.2s' }}
            ></div>
            <span className='ml-2 text-xs text-purple-300 font-medium'>
              Loading word of the day...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!wordOfTheDay) return null;

  return (
    <div className='bg-glass-gradient backdrop-blur-md border border-purple-500/30 rounded-xl shadow-glass p-4 animate-slide-up'>
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
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              ></path>
            </svg>
          </div>
          <span className='text-sm font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent tracking-wide'>
            WORD OF THE DAY
          </span>
        </div>
        <span className='text-xs text-slate-400 font-mono'>
          {new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <button
            onClick={() => onWordClick && onWordClick(wordOfTheDay.word)}
            className='text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-wide hover:from-cyan-200 hover:to-blue-200 transition-all duration-300 cursor-pointer'
          >
            {wordOfTheDay.word.toUpperCase()}
          </button>
          <span className='bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider'>
            {wordOfTheDay.partOfSpeech}
          </span>
        </div>

        <div className='bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg p-3'>
          <p className='text-slate-200 leading-relaxed text-sm'>
            {wordOfTheDay.definition}
          </p>
        </div>

        {wordOfTheDay.example && (
          <div className='bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-2 ml-2'>
            <p className='text-blue-300 italic text-xs'>
              "{wordOfTheDay.example}"
            </p>
          </div>
        )}
      </div>

      <div className='mt-3 pt-2 border-t border-white/10'>
        <p className='text-xs text-slate-400 text-center font-mono'>
          Click the word to search for more details
        </p>
      </div>
    </div>
  );
};

export default WordOfTheDay;
