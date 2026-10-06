import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, LogIn, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DEMO_ACCOUNTS } from '../utils/constants';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickFill = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toastError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const user = await login(formData.email, formData.password);
      toastSuccess(`Welcome back, ${user?.name || 'User'}!`);
      
      // If admin, go to /admin by default unless navigating from a specific page
      if (user?.role === 'admin' && from === '/dashboard') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toastError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8 sm:py-12 bg-slate-50/50 dark:bg-navy-950">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-navy-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl animate-fade-in my-auto">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-accent-purple to-accent-pink flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display tracking-tight">
            Sign In to BlogSphere
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a quick demo role or enter your credentials.
          </p>
        </div>

        {/* 1-Click Demo Accounts Grid */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-800/70 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
            🚀 1-Click Instant Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => {
              const isAdmin = acc.email === 'admin@blogsphere.com';
              const isSelected = formData.email === acc.email;
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className={`py-2 px-2.5 rounded-xl border text-left flex flex-col justify-center transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 ring-1 ring-brand-500'
                      : isAdmin
                      ? 'border-amber-300/80 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/30 hover:border-amber-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-850 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className={`text-[11px] font-extrabold truncate flex items-center gap-1 ${
                    isAdmin ? 'text-amber-700 dark:text-amber-300' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {isAdmin ? '👑 Chief Admin' : acc.role.split('(')[0].trim()}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate">
                    {isAdmin ? 'Full Platform Control' : acc.role.split('(')[1]?.replace(')', '') || 'Author'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 via-accent-purple to-accent-pink hover:from-brand-700 hover:to-purple-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 pt-3"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to BlogSphere</span>
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
