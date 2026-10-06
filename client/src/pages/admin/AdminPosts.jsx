import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  MessageSquare,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const AdminPosts = () => {
  const { toastSuccess, toastError } = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalPosts: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState([]);

  // Deletion modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch categories for filter
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await adminService.getCategories();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getPosts({
        page,
        limit: 8,
        search: searchTerm,
        category: categoryFilter
      });
      if (res.success) {
        setPosts(res.data.posts);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, toastError]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      setActionLoading(true);
      const res = await adminService.deletePost(postToDelete._id);
      toastSuccess(res.message || 'Post deleted by administrator.');
      setDeleteModalOpen(false);
      setPostToDelete(null);
      fetchPosts(pagination.currentPage);
    } catch (err) {
      toastError(err.message || 'Failed to delete post');
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
              <FileText className="w-6 h-6 text-purple-600" />
              Blog Posts Moderation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Review, edit, or delete any article published across the platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search title or author..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex justify-center">
            <Loading text="Loading blog articles..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="font-bold">No articles match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-navy-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Article Details</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Comments</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40 transition-colors">
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643'}
                          alt={post.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="truncate">
                          <Link
                            to={`/blogs/${post._id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 line-clamp-1 block"
                          >
                            {post.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {post.readTime || 3} min read
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-xs">
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {post.author?.name || post.authorName || 'Unknown'}
                        </p>
                        <p className="text-slate-400 text-[11px]">{post.author?.email}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                        {post.category}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        {post.commentsCount || 0}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500">
                      {formatDate(post.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/blogs/${post._id}`}
                          title="View live article"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/edit-post/${post._id}`}
                          title="Edit article"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => {
                            setPostToDelete(post);
                            setDeleteModalOpen(true);
                          }}
                          title="Delete article"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
              onPageChange={fetchPosts}
            />
          </div>
        )}
      </div>

      {/* Delete Post Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeletePost}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? All associated comments and discussions will be permanently deleted.`}
        confirmText={actionLoading ? 'Deleting...' : 'Delete Post'}
        type="danger"
      />
    </div>
  );
};

export default AdminPosts;
