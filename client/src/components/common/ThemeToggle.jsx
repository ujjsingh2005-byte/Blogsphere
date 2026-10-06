import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Dark/Light Mode"
      className={`relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-300 ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 animate-fade-in" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-500 animate-fade-in" />
      )}
    </button>
  );
};

export default ThemeToggle;
