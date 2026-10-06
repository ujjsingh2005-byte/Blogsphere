import React from 'react';

export const BlogCardSkeleton = () => (
  <div className="bg-white dark:bg-navy-850 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 space-y-4 animate-pulse">
    <div className="h-52 bg-slate-200 dark:bg-slate-700/60 rounded-2xl w-full"></div>
    <div className="flex items-center gap-2">
      <div className="h-5 bg-slate-200 dark:bg-slate-700/60 rounded-full w-20"></div>
      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-12"></div>
    </div>
    <div className="h-6 bg-slate-200 dark:bg-slate-700/60 rounded-xl w-3/4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-5/6"></div>
    </div>
    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
      </div>
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div>
    </div>
  </div>
);

export const BlogDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-pulse px-4 py-10">
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/4"></div>
    <div className="h-12 bg-slate-300 dark:bg-slate-700 rounded-2xl w-3/4"></div>
    <div className="flex items-center gap-4 py-4 border-y border-slate-200 dark:border-slate-800">
      <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-32"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
      </div>
    </div>
    <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-3xl w-full"></div>
    <div className="space-y-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800">
    <td className="py-4 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div></td>
    <td className="py-4 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
    <td className="py-4 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div></td>
    <td className="py-4 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div></td>
    <td className="py-4 px-4"><div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div></td>
  </tr>
);
