import React from 'react';

export default function Button({ children, className = '', ...props }) {
  return (
    <button 
      className={`bg-[#00B2FF] hover:bg-[#009AE5] text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
