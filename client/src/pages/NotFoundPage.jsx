import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-navy-850 p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-display">
            404
          </h1>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            The page or story you are looking for doesn't exist, was deleted, or the URL is incorrect.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-600 to-accent-purple text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
