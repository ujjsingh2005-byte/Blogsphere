import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import {
  ShieldAlert,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
  MessageSquare,
  FileText,
  User,
  AlertCircle,
  Edit3
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const AdminReports = () => {
  const { toastSuccess, toastError } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalReports: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Resolution modal
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusToSet, setStatusToSet] = useState('resolved');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const fetchReports = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminService.getReports({
        page,
        limit: 8,
        status: statusFilter,
        targetType: typeFilter
      });
      if (res.success) {
        setReports(res.data.reports);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load moderation reports');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, toastError]);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  const openActionModal = (report, defaultStatus) => {
    setSelectedReport(report);
    setStatusToSet(defaultStatus || report.status);
    setAdminNotes(report.adminNotes || '');
    setActionModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      setSubmitting(true);
      const res = await adminService.updateReportStatus(selectedReport._id, {
        status: statusToSet,
        adminNotes
      });
      toastSuccess(res.message || 'Report status updated.');
      setActionModalOpen(false);
      setSelectedReport(null);
      fetchReports(pagination.currentPage);
    } catch (err) {
      toastError(err.message || 'Failed to update report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    try {
      setSubmitting(true);
      const res = await adminService.deleteReport(reportToDelete._id);
      toastSuccess(res.message || 'Report deleted.');
      setDeleteModalOpen(false);
      setReportToDelete(null);
      fetchReports(pagination.currentPage);
    } catch (err) {
      toastError(err.message || 'Failed to delete report');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300/40';
      case 'resolved':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40';
      case 'dismissed':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/40';
      default:
        return 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-300/40';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filter */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
              Content Moderation Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Review reports submitted by community members and enforce safety guidelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Targets</option>
              <option value="post">Blog Posts</option>
              <option value="comment">Comments</option>
              <option value="user">User Profiles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex justify-center">
            <Loading text="Retrieving moderation queue..." />
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <p className="font-bold">No reports matching the selected filters. Great job!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {reports.map((report) => (
              <div
                key={report._id}
                className="p-6 hover:bg-slate-50/50 dark:hover:bg-navy-800/30 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
                      {report.reason}
                    </span>

                    <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                      Target: {report.targetType}
                    </span>

                    <span className={`px-2.5 py-1 text-xs font-bold rounded-xl capitalize ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>

                    <span className="text-xs text-slate-400">
                      Reported {formatDate(report.createdAt)}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Target: <span className="text-brand-600 dark:text-brand-400">{report.targetTitle || report.targetId}</span>
                    </h4>
                    {report.details && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-navy-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold">Reporter Note:</span> {report.details}
                      </p>
                    )}
                  </div>

                  {report.adminNotes && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <span className="font-bold">Admin Resolution Note:</span> {report.adminNotes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Reported by:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {report.reporter?.name || 'Anonymous User'} ({report.reporter?.email})
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start shrink-0">
                  {report.targetType === 'post' && (
                    <Link
                      to={`/blogs/${report.targetId}`}
                      target="_blank"
                      className="px-3 py-2 text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/50 rounded-xl hover:bg-brand-100 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Inspect Post
                    </Link>
                  )}

                  <button
                    onClick={() => openActionModal(report, 'resolved')}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() => openActionModal(report, 'dismissed')}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all"
                  >
                    Dismiss
                  </button>

                  <button
                    onClick={() => {
                      setReportToDelete(report);
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={fetchReports}
            />
          </div>
        )}
      </div>

      {/* Resolve / Status Update Modal */}
      {actionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Update Report Status
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Resolution Status
                </label>
                <select
                  value={statusToSet}
                  onChange={(e) => setStatusToSet(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-sm focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Under Review</option>
                  <option value="resolved">Resolved (Action Taken)</option>
                  <option value="dismissed">Dismissed (No Violation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Admin Resolution Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Notes explaining why this report was resolved or dismissed..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-sm focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md"
                >
                  {submitting ? 'Saving...' : 'Confirm Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Report Confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteReport}
        title="Delete Report Record"
        message="Are you sure you want to permanently delete this report log from the database?"
        confirmText={submitting ? 'Deleting...' : 'Delete Record'}
        type="danger"
      />
    </div>
  );
};

export default AdminReports;
