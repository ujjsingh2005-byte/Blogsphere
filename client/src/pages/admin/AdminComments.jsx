import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import {
  MessageSquare,
  Search,
  Trash2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const AdminComments = () => {
  const { toastSuccess, toastError } = useToast();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalComments: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  // Deletion modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComments = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getComments({
        page,
        limit: 10,
        search: searchTerm
      });
      if (res.success) {
        setComments(res.data.comments);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, toastError]);

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      setActionLoading(true);
      const res = await adminService.deleteComment(commentToDelete._id);
      toastSuccess(res.message || 'Comment deleted by administrator.');
      setDeleteModalOpen(false);
      setCommentToDelete(null);
      fetchComments(pagination.currentPage);
    } catch (err) {
      toastError(err.message || 'Failed to delete comment');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filter */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              Comments Moderation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Oversee and moderate discussions across all published stories.
            </p>
          </div>

          {/* Search */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search comment content..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Comments Table */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex justify-center">
            <Loading text="Loading comments stream..." />
          </div>
        ) : comments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="font-bold">No comments found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-navy-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Comment</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Article</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {comments.map((comment) => (
                  <tr key={comment._id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40 transition-colors">
                    <td className="py-4 px-6 max-w-sm">
                      <p className="text-slate-800 dark:text-slate-200 line-clamp-2 text-xs leading-relaxed">
                        "{comment.content}"
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            comment.author?.profileImage ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                              comment.author?.name || 'User'
                            )}`
                          }
                          alt={comment.author?.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {comment.author?.name || 'Anonymous'}
                          </p>
                          <p className="text-slate-400 text-[10px]">{comment.author?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      {comment.postId ? (
                        <Link
                          to={`/blogs/${comment.postId._id || comment.postId}`}
                          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline line-clamp-1 flex items-center gap-1"
                        >
                          {comment.postId.title || 'View Article'}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Deleted Article</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500">
                      {formatDate(comment.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setCommentToDelete(comment);
                          setDeleteModalOpen(true);
                        }}
                        title="Delete comment"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={fetchComments}
            />
          </div>
        )}
      </div>

      {/* Delete Comment Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteComment}
        title="Delete User Comment"
        message={`Are you sure you want to permanently remove this comment by "${commentToDelete?.author?.name || 'User'}"?`}
        confirmText={actionLoading ? 'Deleting...' : 'Delete Comment'}
        type="danger"
      />
    </div>
  );
};

export default AdminComments;
