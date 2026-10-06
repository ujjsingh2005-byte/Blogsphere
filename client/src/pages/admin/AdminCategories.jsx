import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loading from '../../components/common/Loading';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Sparkles,
  Palette,
  X
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Blue & Cyan', value: 'from-blue-500 to-cyan-500' },
  { name: 'Purple & Violet', value: 'from-violet-500 to-purple-600' },
  { name: 'Emerald & Teal', value: 'from-emerald-500 to-teal-600' },
  { name: 'Amber & Orange', value: 'from-amber-500 to-orange-600' },
  { name: 'Rose & Pink', value: 'from-rose-500 to-pink-600' },
  { name: 'Indigo & Blue', value: 'from-indigo-500 to-blue-600' },
  { name: 'Slate & Gray', value: 'from-slate-600 to-gray-700' }
];

const AdminCategories = () => {
  const { toastSuccess, toastError } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: COLOR_PRESETS[0].value
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: COLOR_PRESETS[0].value });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      color: cat.color || COLOR_PRESETS[0].value
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toastError('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingCategory) {
        const res = await adminService.updateCategory(editingCategory._id, formData);
        toastSuccess(res.message || 'Category updated');
      } else {
        const res = await adminService.createCategory(formData);
        toastSuccess(res.message || 'Category created');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toastError(err.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setSubmitting(true);
      const res = await adminService.deleteCategory(categoryToDelete._id);
      toastSuccess(res.message || 'Category deleted');
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      toastError(err.message || 'Failed to delete category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-brand-600" />
            Category Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize platform topics, curate tags, and track article distributions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-700 hover:to-purple-700 rounded-2xl shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-16 flex justify-center">
          <Loading text="Loading platform categories..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 text-xs font-bold text-white rounded-xl bg-gradient-to-r ${
                      cat.color || 'from-blue-500 to-indigo-600'
                    } shadow-sm`}
                  >
                    {cat.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {cat.postCount || 0} {cat.postCount === 1 ? 'post' : 'posts'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[32px]">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCategoryToDelete(cat);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-brand-600" />
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Cloud Computing"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe what belongs in this category..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Gradient Color Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: preset.value })}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all ${
                        formData.color === preset.value
                          ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${preset.value}`} />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md"
                >
                  {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"? Any articles currently assigned to this category will automatically be reassigned to "General".`}
        confirmText={submitting ? 'Deleting...' : 'Delete Category'}
        type="danger"
      />
    </div>
  );
};

export default AdminCategories;
