import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

const SearchFilterBar = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  totalResults
}) => {
  return (
    <div className="space-y-6">
      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, keywords, or author..."
            className="w-full pl-10 pr-10 py-3 bg-slate-50/80 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <div className="relative inline-block w-full sm:w-auto">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-slate-50/80 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-2xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm cursor-pointer transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title_asc">Title (A - Z)</option>
            </select>
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-accent-purple text-white shadow-md shadow-brand-500/25 scale-105'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-navy-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Subtitle */}
      {searchQuery && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <p>
            Showing results for <span className="font-bold text-slate-800 dark:text-slate-200">"{searchQuery}"</span>
            {selectedCategory !== 'All' && <span> in <span className="font-bold text-brand-600 dark:text-brand-400">{selectedCategory}</span></span>}
          </p>
          <p>{totalResults} post{totalResults === 1 ? '' : 's'} found</p>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
