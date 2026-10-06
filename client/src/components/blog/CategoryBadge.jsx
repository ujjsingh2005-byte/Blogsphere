import React from 'react';

const CATEGORY_STYLES = {
  Technology: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60',
    dot: 'bg-blue-500 shadow-blue-500/50'
  },
  Programming: {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60',
    dot: 'bg-indigo-500 shadow-indigo-500/50'
  },
  AI: {
    bg: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60',
    dot: 'bg-purple-500 shadow-purple-500/50'
  },
  'Web Development': {
    bg: 'bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/60',
    dot: 'bg-cyan-500 shadow-cyan-500/50'
  },
  Education: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60',
    dot: 'bg-emerald-500 shadow-emerald-500/50'
  },
  Career: {
    bg: 'bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/60',
    dot: 'bg-orange-500 shadow-orange-500/50'
  },
  Lifestyle: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60',
    dot: 'bg-rose-500 shadow-rose-500/50'
  },
  Other: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/60',
    dot: 'bg-slate-500'
  }
};

const CategoryBadge = ({ category, size = 'sm', clickable = false, onClick }) => {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES['Other'];

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px] font-bold',
    sm: 'px-2.5 py-1 text-xs font-bold',
    md: 'px-3.5 py-1.5 text-sm font-bold'
  }[size] || 'px-2.5 py-1 text-xs font-bold';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm transition-all duration-200 ${sizeClasses} ${style.bg} ${
        clickable ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${style.dot}`}></span>
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
