import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Minimalist Header */}
      <div className='flex items-center justify-between mb-4'>
        {/* Logo - Clean and Minimal */}
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-card'>
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
          <h1 className='text-lg font-bold text-gray-800 tracking-tight'>
            LEXICON
          </h1>
        </div>

        {/* Action Buttons - Clean Design */}
        <div className='flex items-center space-x-1'>
          {/* History Button */}
          <button
            onClick={() => navigate('/history')}
            className='bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 p-2 rounded-lg transition-all duration-200 group shadow-minimal hover:shadow-card focus-ring'
            title='Search History'
          >
            <svg
              className='w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors duration-200'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1.5'
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
