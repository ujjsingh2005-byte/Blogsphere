import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PenSquare, Eye, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { postService } from '../services/postService';
import CategoryBadge from '../components/blog/CategoryBadge';
import ConfirmModal from '../components/common/ConfirmModal';
import { TableRowSkeleton } from '../components/common/SkeletonLoader';
import { formatDate } from '../utils/dateUtils';

const MyPosts = () => {
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const res = await postService.getMyPosts();
      if (res.success) {
        setPosts(res.data);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const triggerDelete = (postId) => {
    setDeleteTargetId(postId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setDeleting(true);
      const res = await postService.deletePost(deleteTargetId);
      if (res.success) {
        toastSuccess('Article deleted successfully');
        setPosts((prev) => prev.filter((p) => p._id !== deleteTargetId));
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            My Published Stories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage, edit, or remove all your publications on BlogSphere.
          </p>
        </div>

        <Link
          to="/create-post"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <PenSquare className="w-4 h-4" />
          <span>New Story</span>
        </Link>
      </div>

      {/* Posts Table */}
      <div className="bg-white dark:bg-navy-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        {loading ? (
          <div className="space-y-4">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">No stories published yet</p>
            <p className="text-xs text-slate-400">Share your expertise and build your digital voice today.</p>
            <Link
              to="/create-post"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md"
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
                {posts.map((post) => {
                  const commentsCount =
                    typeof post.commentsCount === 'number'
                      ? post.commentsCount
                      : Array.isArray(post.comments)
                      ? post.comments.length
                      : 0;

                  return (
                    <tr key={post._id} className="hover:bg-slate-50/80 dark:hover:bg-navy-900/60 transition-colors group">
                      <td className="py-4 px-2 max-w-sm">
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

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Article"
        message="Are you sure you want to delete this story? This action cannot be undone."
        confirmText="Delete Article"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default MyPosts;
