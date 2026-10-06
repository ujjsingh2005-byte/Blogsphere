import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldX,
  Trash2,
  Lock,
  Unlock,
  Filter,
  UserCog,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalUsers: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Confirmation modal state for deletion
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({
        page,
        limit: 8,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      });
      if (res.success) {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, roleFilter, statusFilter, toastError]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const handleToggleBlock = async (user) => {
    if (user._id === currentUser._id) {
      toastError('You cannot suspend your own admin account.');
      return;
    }

    try {
      const res = await adminService.toggleBlockUser(user._id);
      toastSuccess(res.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u))
      );
    } catch (err) {
      toastError(err.message || 'Failed to toggle user status');
    }
  };

  const handleRoleChange = async (user, newRole) => {
    if (user._id === currentUser._id && newRole !== 'admin') {
      toastError('You cannot demote yourself from admin role.');
      return;
    }

    try {
      const res = await adminService.updateUserRole(user._id, newRole);
      toastSuccess(res.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      toastError(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setActionLoading(true);
      const res = await adminService.deleteUser(userToDelete._id);
      toastSuccess(res.message);
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers(pagination.currentPage);
    } catch (err) {
      toastError(err.message || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search & Filter Header */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Users className="w-6 h-6 text-brand-600" />
              User Accounts Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage member permissions, toggle account suspension, and oversee roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name or email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="user">Users Only</option>
              <option value="admin">Admins Only</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="blocked">Suspended Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex justify-center">
            <Loading text="Loading user accounts..." />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="font-bold">No users match the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-navy-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {users.map((u) => {
                  const isSelf = u._id === currentUser._id;
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.profileImage ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`
                            }
                            alt={u.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {u.name}
                              {isSelf && (
                                <span className="px-1.5 py-0.5 text-[9px] font-black bg-brand-100 text-brand-700 rounded-md">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <select
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none ${
                            u.role === 'admin'
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-700 dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-navy-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          } ${isSelf ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <option value="user">👤 User</option>
                          <option value="admin">👑 Admin</option>
                        </select>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            u.isBlocked
                              ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                              : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.isBlocked ? 'bg-rose-600' : 'bg-emerald-600'
                            }`}
                          />
                          {u.isBlocked ? 'Suspended' : 'Active'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-500">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleBlock(u)}
                            disabled={isSelf}
                            title={u.isBlocked ? 'Unblock user' : 'Suspend user'}
                            className={`p-2 rounded-xl transition-colors ${
                              u.isBlocked
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600'
                            } ${isSelf ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            {u.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => {
                              setUserToDelete(u);
                              setDeleteModalOpen(true);
                            }}
                            disabled={isSelf}
                            title="Delete user"
                            className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-colors ${
                              isSelf ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={fetchUsers}
            />
          </div>
        )}
      </div>

      {/* Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete user account "${userToDelete?.name}" (${userToDelete?.email})? All posts and comments authored by this user will also be removed. This action is irreversible.`}
        confirmText={actionLoading ? 'Deleting...' : 'Delete User & Data'}
        type="danger"
      />
    </div>
  );
};

export default AdminUsers;
