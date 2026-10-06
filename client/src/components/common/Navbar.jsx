import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ThemeToggle from './ThemeToggle';
import {
  PenSquare,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Sparkles,
  BookOpen,
  ChevronDown,
  Layers,
  ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toastInfo } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toastInfo('You have logged out successfully');
    setUserDropdownOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen(false);
  const isAdmin = user?.role === 'admin';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-navy-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm'
          : 'bg-white/70 dark:bg-navy-900/70 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={closeMobile}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-accent-purple to-accent-pink flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-brand-600 via-accent-purple to-accent-pink bg-clip-text text-transparent font-display tracking-tight">
                BLOGSPHERE
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold -mt-1">
                Write • Share • Connect
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors hover:text-brand-600 dark:hover:text-brand-400 ${
                location.pathname === '/'
                  ? 'text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Explore Blogs
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-semibold transition-colors hover:text-brand-600 dark:hover:text-brand-400 ${
                    location.pathname === '/dashboard'
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-posts"
                  className={`text-sm font-semibold transition-colors hover:text-brand-600 dark:hover:text-brand-400 ${
                    location.pathname === '/my-posts'
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  My Stories
                </Link>

                {/* Admin Quick Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                        : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Switcher */}
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-600 via-accent-purple to-accent-pink hover:from-brand-700 hover:to-accent-purple rounded-2xl shadow-md shadow-brand-500/20 hover:shadow-lg transition-all active:scale-95"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write Story</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                  >
                    <img
                      src={
                        user?.profileImage ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          user?.name || 'User'
                        )}`
                      }
                      alt={user?.name}
                      className={`w-9 h-9 rounded-xl object-cover ring-2 ${
                        isAdmin ? 'ring-amber-400' : 'ring-brand-500/40'
                      }`}
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 animate-fade-in z-50"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/60">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Signed in as</p>
                          {isAdmin && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-md uppercase">
                              👑 Admin
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-500" />
                          Admin Command Center
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-brand-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>

                      <Link
                        to="/my-posts"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-brand-600 transition-colors"
                      >
                        <Layers className="w-4 h-4 text-slate-400" />
                        My Stories
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-brand-600 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        Manage Profile
                      </Link>

                      <div className="border-t border-slate-100 dark:border-slate-700/60 my-1.5"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-700 hover:to-purple-700 rounded-2xl shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && (
              <Link
                to="/create-post"
                className="p-2 text-white bg-gradient-to-r from-brand-600 to-accent-purple rounded-xl shadow-sm"
              >
                <PenSquare className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl px-5 pt-4 pb-8 space-y-3 animate-fade-in shadow-2xl">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-navy-800 rounded-2xl mb-3 border border-slate-100 dark:border-slate-700">
                <img
                  src={
                    user?.profileImage ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      user?.name || 'User'
                    )}`
                  }
                  alt={user?.name}
                  className={`w-11 h-11 rounded-xl object-cover ring-2 ${
                    isAdmin ? 'ring-amber-400' : 'ring-brand-500/40'
                  }`}
                />
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-amber-100 text-amber-700 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMobile}
                  className="block px-4 py-2.5 rounded-xl text-sm font-extrabold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                >
                  👑 Admin Command Center
                </Link>
              )}

              <Link
                to="/"
                onClick={closeMobile}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Explore Blogs
              </Link>
              <Link
                to="/dashboard"
                onClick={closeMobile}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                My Dashboard
              </Link>
              <Link
                to="/my-posts"
                onClick={closeMobile}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                My Published Stories
              </Link>
              <Link
                to="/profile"
                onClick={closeMobile}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  closeMobile();
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <Link
                to="/"
                onClick={closeMobile}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Explore Blogs
              </Link>
              <Link
                to="/login"
                onClick={closeMobile}
                className="block w-full text-center px-4 py-3 rounded-2xl text-sm font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={closeMobile}
                className="block w-full text-center px-4 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-accent-purple shadow-lg"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
