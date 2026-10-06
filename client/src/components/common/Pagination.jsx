import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages.push('...');
    }
  }

  const deduplicatedPages = pages.filter((item, index) => {
    return item !== '...' || pages[index - 1] !== '...';
  });

  return (
    <div className="flex items-center justify-center gap-2 pt-8 pb-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-850 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Number Buttons */}
      {deduplicatedPages.map((page, idx) => {
        if (page === '...') {
          return (
            <span
              key={`dots-${idx}`}
              className="px-3 py-2 text-sm font-bold text-slate-400 dark:text-slate-600"
            >
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 text-xs sm:text-sm font-extrabold rounded-2xl transition-all ${
              isCurrent
                ? 'bg-gradient-to-r from-brand-600 to-accent-purple text-white shadow-md shadow-brand-500/25 scale-105'
                : 'bg-white dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-850 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        aria-label="Next Page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
