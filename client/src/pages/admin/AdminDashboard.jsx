import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Loading from '../../components/common/Loading';
import {
  Users,
  FileText,
  MessageSquare,
  ShieldAlert,
  UserCheck,
  UserX,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load administrative statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 flex justify-center">
        <Loading text="Compiling platform metrics & analytics..." />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 text-center text-rose-500">
        <p className="font-bold">{error || 'Failed to retrieve stats'}</p>
      </div>
    );
  }

  const { summary, categoryStats, recentActivity } = stats;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Pending Reports Alert Banner */}
      {summary.pendingReports > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-amber-500/30 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {summary.pendingReports} Pending Moderation {summary.pendingReports === 1 ? 'Report' : 'Reports'} Awaiting Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Community members have flagged content that requires administrative action.
              </p>
            </div>
          </div>
          <Link
            to="/admin/reports"
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-all shrink-0"
          >
            Review Reports Now →
          </Link>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {summary.totalUsers}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> {summary.activeUsers} active
            </span>
            <span>•</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
              <UserX className="w-3.5 h-3.5" /> {summary.blockedUsers} suspended
            </span>
          </div>
        </div>

        {/* Total Posts */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Posts</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {summary.totalPosts}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-500" /> Across {categoryStats.length} active categories
          </p>
        </div>

        {/* Total Comments */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Comments</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {summary.totalComments}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Real-time engagement
          </p>
        </div>

        {/* Total Reports */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Reports</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {summary.totalReports}
          </p>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {summary.pendingReports} awaiting resolution
          </p>
        </div>
      </div>

      {/* Category Breakdown & Platform Health */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Tag className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Content Distribution by Category</h2>
          </div>
          <Link
            to="/admin/categories"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Manage Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryStats.map((c) => (
            <div
              key={c._id}
              className="bg-slate-50 dark:bg-navy-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-center hover:scale-105 transition-transform"
            >
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{c.count}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 truncate">{c._id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Recent Users & Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registered Users */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Users</h2>
            </div>
            <Link
              to="/admin/users"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.users.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-navy-800/50 border border-slate-100 dark:border-slate-800/50"
              >
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={
                      u.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`
                    }
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-lg uppercase ${
                      u.role === 'admin'
                        ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-600'
                        : 'bg-blue-100 dark:bg-blue-950/50 text-blue-600'
                    }`}
                  >
                    {u.role}
                  </span>
                  {u.isBlocked && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-600 rounded-lg">
                      Blocked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Published Posts */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Blog Posts</h2>
            </div>
            <Link
              to="/admin/posts"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Moderate Posts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.posts.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-navy-800/50 border border-slate-100 dark:border-slate-800/50"
              >
                <div className="truncate pr-3">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.title}</p>
                  <p className="text-[11px] text-slate-500">
                    By {p.author?.name || 'Unknown'} • {p.category}
                  </p>
                </div>
                <Link
                  to={`/blogs/${p._id}`}
                  className="px-3 py-1 text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 rounded-xl hover:bg-brand-100 transition-colors shrink-0"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
