import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Tag,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/posts', label: 'Blog Posts', icon: FileText },
    { to: '/admin/comments', label: 'Comments Moderation', icon: MessageSquare },
    { to: '/admin/categories', label: 'Categories', icon: Tag },
    { to: '/admin/reports', label: 'Reports Queue', icon: ShieldAlert }
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-navy-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                    Admin Command Center
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                    👑 Admin
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-1">
                  Full control over users, content moderation, dynamic categories, and platform analytics.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl backdrop-blur-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                User Dashboard
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-700 hover:to-purple-700 rounded-2xl shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                View Live Site
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Navigation Pills / Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-1.5 sticky top-28">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-4 py-2">
                Administration Menu
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 px-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user?.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        user?.name || 'Admin'
                      )}`
                    }
                    alt={user?.name}
                    className="w-9 h-9 rounded-xl ring-2 ring-amber-400"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Super Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Subpage Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
