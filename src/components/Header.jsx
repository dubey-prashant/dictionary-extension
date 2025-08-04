import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header with Logo, History, and Settings */}
      <div className='flex items-center justify-between mb-3'>
        {/* Logo */}
        <div className='flex items-center space-x-2.5'>
          <div className='w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg'>
            <svg
              className='w-5 h-5 text-white'
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
          <h1 className='text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent tracking-wide'>
            LEXICON
          </h1>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center space-x-2'>
          {/* History Button */}
          <button
            onClick={() => navigate('/history')}
            className='bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/50 p-2 rounded-lg transition-all duration-300 group hover:shadow-lg'
            title='Search History'
          >
            <svg
              className='w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors duration-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
