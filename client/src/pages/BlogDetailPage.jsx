import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  User as UserIcon,
  Edit,
  Trash2,
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  Heart,
  Twitter,
  Linkedin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import CategoryBadge from '../components/blog/CategoryBadge';
import CommentSection from '../components/comments/CommentSection';
import ConfirmModal from '../components/common/ConfirmModal';
import { BlogDetailSkeleton } from '../components/common/SkeletonLoader';
import ReadingProgressBar from '../components/common/ReadingProgressBar';
import BackToTop from '../components/common/BackToTop';
import { formatDate } from '../utils/dateUtils';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(14);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        if (res.data.success) {
          setPost(res.data.data);
        }
      } catch (err) {
        toastError(err.message || 'Failed to load blog post');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, navigate]);

  const authorId = post?.author?._id || post?.author;
  const isOwner = user && authorId && (user._id === authorId || user.id === authorId);

  const handleDeletePost = async () => {
    try {
      setDeleting(true);
      const res = await api.delete(`/posts/${id}`);
      if (res.data.success) {
        toastSuccess('Blog post deleted successfully');
        setShowDeleteModal(false);
        navigate('/');
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toastInfo('Article link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out "${post?.title}" on BlogSphere!`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const toggleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
      toastSuccess('Thank you for liking this story!');
    }
  };

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (!post) {
    return null;
  }

  const authorName = post.author?.name || post.authorName || 'Author';
  const authorImage =
    post.author?.profileImage ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`;
  const authorBio = post.author?.bio || 'Passionate writer and contributor on BlogSphere.';

  return (
    <>
      <ReadingProgressBar />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </button>

          {/* Owner Action Buttons */}
          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit-post/${post._id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 rounded-xl transition-all border border-brand-200 dark:border-brand-800"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Article</span>
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition-all border border-rose-200 dark:border-rose-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Header Info */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <CategoryBadge category={post.category} size="md" />
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
              Published {formatDate(post.createdAt)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight font-display">
            {post.title}
          </h1>

          {/* Author bar & Read time */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <img
                src={authorImage}
                alt={authorName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/30"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{authorName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{post.author?.email || 'Contributor'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{post.readTime || 3} min read</span>
              </div>

              {/* Share & Like Buttons */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <button
                  onClick={toggleLike}
                  className={`p-2 rounded-xl border transition-all inline-flex items-center gap-1.5 ${
                    liked
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                  }`}
                  title="Like article"
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="text-xs font-bold">{likeCount}</span>
                </button>

                <button
                  onClick={shareOnTwitter}
                  className="p-2 text-slate-500 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Share on X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>

                <button
                  onClick={shareOnLinkedIn}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center gap-1.5"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 h-72 sm:h-96 md:h-[500px]">
          <img
            src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content Body */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal space-y-5">
          {post.content}
        </div>

        {/* Author Bio Box */}
        <div className="bg-slate-50 dark:bg-navy-850 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left shadow-sm">
          <img
            src={authorImage}
            alt={authorName}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-navy-900 shadow-md shrink-0"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 font-display">{authorName}</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-lg bg-gradient-to-r from-brand-600 to-accent-purple text-white shadow-sm">
                Author
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              {authorBio}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection postId={post._id} />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete Blog Post"
          message="Are you sure you want to delete this blog post and all its associated comments? This action cannot be undone."
          confirmText="Delete Post"
          isLoading={deleting}
          onConfirm={handleDeletePost}
          onCancel={() => setShowDeleteModal(false)}
        />

        <BackToTop />
      </article>
    </>
  );
};

export default BlogDetailPage;
