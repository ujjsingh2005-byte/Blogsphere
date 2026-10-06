import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MessageSquare, ArrowUpRight } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import { formatDate } from '../../utils/dateUtils';

const BlogCard = ({ post }) => {
  const snippet = post.content
    ? post.content
        .replace(/#+\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\n+/g, ' ')
        .substring(0, 130) + '...'
    : '';

  const commentsCount =
    typeof post.commentsCount === 'number'
      ? post.commentsCount
      : Array.isArray(post.comments)
      ? post.comments.length
      : 0;

  return (
    <article className="group bg-white dark:bg-navy-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl dark:hover:shadow-brand-950/40 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5 relative">
      {/* Cover Image with Zoom Effect */}
      <Link to={`/posts/${post._id}`} className="relative h-52 sm:h-56 overflow-hidden block">
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3.5 left-3.5">
          <CategoryBadge category={post.category} />
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <Link to={`/posts/${post._id}`} className="block group/link">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover/link:text-brand-600 dark:group-hover/link:text-brand-400 transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
            {snippet}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {/* Author Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={
                post.author?.profileImage ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  post.authorName || 'Author'
                )}`
              }
              alt={post.authorName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
            />
            <div className="truncate">
              <p className="font-bold text-slate-700 dark:text-slate-200 truncate">{post.authorName}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {/* Read Time & Comments */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500" title="Estimated reading time">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime || 3}m</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500" title="Comments">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{commentsCount}</span>
            </div>

            <div className="text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
