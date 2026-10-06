import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  PenSquare,
  BookOpen,
  MessageSquare,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  TrendingUp,
  UserCheck,
  Flame,
  ArrowRight,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import CategoryBadge from '../components/blog/CategoryBadge';
import ConfirmModal from '../components/common/ConfirmModal';
import { TableRowSkeleton } from '../components/common/SkeletonLoader';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';

const DashboardPage = () => {
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [stats, setStats] = useState({
    totalPosts: 0,
    totalCommentsReceived: 0,
    totalCommentsWritten: 0,
    totalReadTimeMinutes: 0,
    recentPosts: [],
    recentComments: []
  });

  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, postsRes] = await Promise.all([
        api.get('/stats/user'),
        api.get('/posts/user/me')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (postsRes.data.success) {
        setMyPosts(postsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data', err);
      toastError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const triggerDelete = (postId) => {
    setDeleteTargetId(postId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/posts/${deleteTargetId}`);
      if (res.data.success) {
        toastSuccess('Article deleted successfully');
        setMyPosts((prev) => prev.filter((p) => p._id !== deleteTargetId));
        setShowDeleteModal(false);
        setDeleteTargetId(null);
        fetchDashboardData();
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-950 via-indigo-950 to-navy-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-bold text-brand-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Author Analytics & Hub</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-light leading-relaxed">
              Here is what is happening with your publications, community comments, and readership metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/create-post"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 via-accent-purple to-accent-pink hover:from-brand-600 text-white text-xs sm:text-sm font-bold shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <PenSquare className="w-4 h-4" />
              <span>Create New Story</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid with Harmonious Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Posts */}
        <div className="bg-white dark:bg-navy-850 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 shadow-inner">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Articles</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display mt-0.5">
              {loading ? '...' : stats.totalPosts}
            </p>
          </div>
        </div>

        {/* Comments Received */}
        <div className="bg-white dark:bg-navy-850 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Comments Received</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display mt-0.5">
              {loading ? '...' : stats.totalCommentsReceived}
            </p>
          </div>
        </div>

        {/* Read Time Generated */}
        <div className="bg-white dark:bg-navy-850 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Reading Minutes</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display mt-0.5">
              {loading ? '...' : `${stats.totalReadTimeMinutes}m`}
            </p>
          </div>
        </div>

        {/* Comments Written */}
        <div className="bg-white dark:bg-navy-850 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Comments Written</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display mt-0.5">
              {loading ? '...' : stats.totalCommentsWritten}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: My Articles + Recent Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Articles Table (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-navy-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-display">Your Publications</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage, update, and review your published stories</p>
            </div>
            <Link
              to="/my-posts"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </div>
          ) : myPosts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-base font-bold text-slate-700 dark:text-slate-200">You haven't written any stories yet</p>
              <p className="text-xs text-slate-400">Publish your first article to share your expertise with the world.</p>
              <Link
                to="/create-post"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write First Story</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-[11px] uppercase font-extrabold tracking-wider">
                    <th className="pb-3 px-2">Article</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2">Comments</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myPosts.map((post) => {
                    const commentsCount =
                      typeof post.commentsCount === 'number'
                        ? post.commentsCount
                        : Array.isArray(post.comments)
                        ? post.comments.length
                        : 0;

                    return (
                      <tr key={post._id} className="hover:bg-slate-50/80 dark:hover:bg-navy-900/60 transition-colors group">
                        <td className="py-4 px-2 max-w-xs">
                          <Link
                            to={`/posts/${post._id}`}
                            className="font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 line-clamp-1 transition-colors"
                          >
                            {post.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                            {post.readTime || 3}m read
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <CategoryBadge category={post.category} size="xs" />
                        </td>
                        <td className="py-4 px-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="py-4 px-2 text-xs text-slate-600 dark:text-slate-300 font-bold">
                          {commentsCount}
                        </td>
                        <td className="py-4 px-2 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/posts/${post._id}`}
                              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                              title="View post"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/edit-post/${post._id}`}
                              className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 rounded-xl transition-colors"
                              title="Edit post"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => triggerDelete(post._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                              title="Delete post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Audience Feedback (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-navy-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-accent-purple" />
              <span>Recent Feedback</span>
            </h2>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
              </div>
            ) : !stats.recentComments || stats.recentComments.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">
                No recent comments on your stories yet.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentComments.map((comment) => (
                  <div
                    key={comment._id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {comment.author?.name || 'Reader'}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                      "{comment.content}"
                    </p>
                    {comment.postId?.title && (
                      <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold truncate pt-1">
                        on {comment.postId.title}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Article"
        message="Are you sure you want to delete this article and its comments? This action is permanent."
        confirmText="Delete Article"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default DashboardPage;
