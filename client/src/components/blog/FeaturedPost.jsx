import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import { formatDate } from '../../utils/dateUtils';

const FeaturedPost = ({ post }) => {
  if (!post) return null;

  const snippet = post.content
    ? post.content
        .replace(/#+\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\n+/g, ' ')
        .substring(0, 180) + '...'
    : '';

  const commentsCount =
    typeof post.commentsCount === 'number'
      ? post.commentsCount
      : Array.isArray(post.comments)
      ? post.comments.length
      : 0;

  return (
    <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-navy-850 border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Cover Image Half */}
        <div className="lg:col-span-7 relative h-72 sm:h-80 lg:h-[440px] overflow-hidden">
          <img
            src={post.coverImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent lg:hidden"></div>

          {/* Featured Ribbon */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 dark:bg-navy-900/90 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Featured Editorial</span>
          </div>
        </div>

        {/* Content Half */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white dark:bg-navy-850 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CategoryBadge category={post.category} size="md" />
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                {formatDate(post.createdAt)}
              </span>
            </div>

            <Link to={`/posts/${post._id}`} className="block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                {post.title}
              </h2>
            </Link>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              {snippet}
            </p>
          </div>

          <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    post.author?.profileImage ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      post.authorName || 'Author'
                    )}`
                  }
                  alt={post.authorName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/30"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{post.authorName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Author</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {post.readTime || 3} min read
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  {commentsCount}
                </span>
              </div>
            </div>

            {/* Read Article CTA */}
            <Link
              to={`/posts/${post._id}`}
              className="inline-flex items-center justify-center w-full gap-2 px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white text-sm font-bold transition-all shadow-md group-hover:bg-brand-600 active:scale-95"
            >
              <span>Read Full Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
