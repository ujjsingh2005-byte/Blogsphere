import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenSquare, Image, Sparkles, Eye, ArrowLeft, Send } from 'lucide-react';
import { CATEGORIES, SAMPLE_COVER_PRESETS } from '../utils/constants';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import CategoryBadge from '../components/blog/CategoryBadge';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    content: ''
  });

  const [isPreview, setIsPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const wordCount = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

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
      const res = await api.post('/posts', formData);
      if (res.data.success) {
        toastSuccess('Your article was published successfully!');
        navigate(`/posts/${res.data.data._id}`);
      }
    } catch (err) {
      toastError(err.message || 'Failed to publish post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl border transition-all ${
              isPreview
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900'
                : 'bg-white dark:bg-navy-850 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-navy-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreview ? 'Edit Editor' : 'Live Preview'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-display flex items-center gap-3">
            <PenSquare className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            <span>Create Something Amazing</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Compose and publish your story to the global BlogSphere community.
          </p>
        </div>

        {isPreview ? (
          /* Live Preview View */
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <CategoryBadge category={formData.category} size="md" />
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                {estimatedReadTime} min read
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
              {formData.title || 'Untitled Article'}
            </h1>
            {formData.coverImage && (
              <div className="h-64 sm:h-80 rounded-3xl overflow-hidden shadow-md">
                <img
                  src={formData.coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-base leading-relaxed whitespace-pre-line">
              {formData.content || 'Your article content will appear here...'}
            </div>
          </div>
        ) : (
          /* Form View */
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
                placeholder="e.g., Designing Scalable Multi-Tenant Architectures in 2026"
                required
                maxLength={150}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-base text-slate-900 dark:text-slate-100 font-bold placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all"
              />
              <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                <span>Catchy titles attract 4x more readers</span>
                <span>{formData.title.length}/150</span>
              </div>
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

            {/* Cover Image Input & Presets */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Cover Image URL
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all"
              />

              {/* Preset Selector */}
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mb-2">Or choose a curated preset visual:</p>
                <div className="flex flex-wrap gap-2">
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
              </div>

              {/* Image Preview */}
              {formData.coverImage && (
                <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 mt-2 shadow-sm">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/80 text-white text-[10px] font-bold rounded-lg backdrop-blur">
                    Cover Preview
                  </div>
                </div>
              )}
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Article Content <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  {wordCount} words (~{estimatedReadTime} min read)
                </span>
              </div>
              <textarea
                name="content"
                rows="12"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your article story, technical insights, and thoughts here..."
                required
                className="w-full p-5 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all font-normal leading-relaxed"
              />
            </div>

            {/* Publish CTA */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2.5 px-9 py-4 bg-gradient-to-r from-brand-600 via-accent-purple to-accent-pink hover:from-brand-700 hover:to-accent-pink text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>Publish Article ✨</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePostPage;
