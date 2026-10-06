import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, ArrowLeft, Send } from 'lucide-react';
import { CATEGORIES, SAMPLE_COVER_PRESETS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    coverImage: '',
    content: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        if (res.data.success) {
          const post = res.data.data;
          
          const authorId = post.author?._id || post.author;
          if (user && authorId && user._id !== authorId && user.id !== authorId) {
            toastError('You do not have permission to edit this article');
            navigate(`/posts/${id}`);
            return;
          }

          setFormData({
            title: post.title,
            category: post.category,
            coverImage: post.coverImage,
            content: post.content
          });
        }
      } catch (err) {
        toastError(err.message || 'Failed to load post');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchPost();
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPreset = (url) => {
    setFormData((prev) => ({ ...prev, coverImage: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.trim().length < 5) {
      toastError('Title must be at least 5 characters long');
      return;
    }

    if (formData.content.trim().length < 20) {
      toastError('Content must be at least 20 characters long');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.put(`/posts/${id}`, formData);
      if (res.data.success) {
        toastSuccess('Article updated successfully!');
        navigate(`/posts/${id}`);
      }
    } catch (err) {
      toastError(err.message || 'Failed to update article');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading article editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/posts/${id}`)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & View Post</span>
        </button>
      </div>

      <div className="bg-white dark:bg-navy-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-display flex items-center gap-3">
            <Edit3 className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            <span>Edit Article</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Make modifications to your published story and save revisions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Article Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={150}
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-base text-slate-900 dark:text-slate-100 font-bold placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                  className={`py-2.5 px-3.5 text-xs font-bold rounded-2xl border text-center transition-all ${
                    formData.category === cat
                      ? 'bg-gradient-to-r from-brand-600 to-accent-purple text-white border-brand-600 shadow-md scale-105'
                      : 'bg-slate-50 dark:bg-navy-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-navy-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all"
            />

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {SAMPLE_COVER_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`px-3 py-1.5 text-xs rounded-xl border font-semibold transition-all ${
                    formData.coverImage === preset.url
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900'
                      : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-navy-800'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {formData.coverImage && (
              <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 mt-2 shadow-sm">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Article Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="content"
              rows="12"
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full p-5 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all font-normal leading-relaxed"
            />
          </div>

          {/* Update Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-9 py-4 bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
