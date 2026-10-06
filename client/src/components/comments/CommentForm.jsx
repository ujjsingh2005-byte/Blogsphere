import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CommentForm = ({ onSubmit, isSubmitting = false }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    await onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-navy-850 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={
            user?.profileImage ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              user?.name || 'User'
            )}`
          }
          alt={user?.name}
          className="w-9 h-9 rounded-xl object-cover ring-2 ring-brand-500/30"
        />
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Commenting as {user?.name}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Share your constructive perspective with the author</p>
        </div>
      </div>

      <div className="relative">
        <textarea
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a thoughtful comment..."
          maxLength={1000}
          required
          className="w-full p-4 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all resize-none"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          {content.length}/1000 characters
        </span>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          {isSubmitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Posting...</span>
            </>
          ) : (
            <>
              <span>Post Comment</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
