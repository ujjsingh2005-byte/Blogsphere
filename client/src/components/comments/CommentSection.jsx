import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, LogIn, Sparkles, MessagesSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const CommentSection = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${postId}/comments`);
        if (res.data.success) {
          setComments(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleAddComment = async (content) => {
    try {
      setSubmitting(true);
      const res = await api.post(`/posts/${postId}/comments`, { content });
      if (res.data.success) {
        setComments((prev) => [res.data.data, ...prev]);
        toastSuccess('Your comment has been posted!');
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    try {
      const res = await api.put(`/comments/${commentId}`, { content: newContent });
      if (res.data.success) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? res.data.data : c))
        );
        toastSuccess('Comment updated successfully');
      }
    } catch (err) {
      toastError(err.message || 'Failed to update comment');
      throw err;
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await api.delete(`/comments/${commentId}`);
      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toastSuccess('Comment deleted');
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete comment');
      throw err;
    }
  };

  return (
    <section className="space-y-8 pt-10 border-t border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            Discussion ({comments.length})
          </h2>
        </div>
      </div>

      {/* Write Comment Box / Guest Prompt */}
      {isAuthenticated ? (
        <CommentForm onSubmit={handleAddComment} isSubmitting={submitting} />
      ) : (
        <div className="p-8 bg-gradient-to-r from-navy-900 via-indigo-950 to-navy-900 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-extrabold text-lg sm:text-xl flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Join the Conversation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Sign in to share your thoughts, exchange feedback, and connect with the author.
            </p>
          </div>
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-brand-500 to-accent-purple hover:from-brand-600 hover:to-purple-600 text-white text-xs font-bold rounded-2xl transition-all shadow-lg inline-flex items-center gap-2 shrink-0 active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Log In to Comment</span>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-5 rounded-3xl bg-white dark:bg-navy-850 border border-slate-100 dark:border-slate-800 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
                </div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full pl-12"></div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-navy-850 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <MessagesSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">No comments yet</p>
            <p className="text-xs text-slate-400">Be the first to share your thoughts on this story!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
