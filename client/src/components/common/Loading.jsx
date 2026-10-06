import React from 'react';

export const Loading = ({ text = 'Loading...', size = 'md' }) => {
  const sizeClass = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }[size] || 'w-8 h-8 border-3';

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className={`${sizeClass} border-brand-200 border-t-brand-600 rounded-full animate-spin`}></div>
      {text && <p className="text-xs font-semibold text-slate-500 tracking-wide">{text}</p>}
    </div>
  );
};

export default Loading;
