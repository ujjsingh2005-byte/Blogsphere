import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Shield,
  Sparkles,
  Check,
  RefreshCw,
  Trash2,
  GraduationCap,
  Briefcase,
  Code2,
  MapPin,
  ExternalLink,
  Layers,
  Award,
  Upload,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/dateUtils';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    password: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle direct file upload from user's computer / phone
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toastError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastError('Image size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      setFormData((prev) => ({ ...prev, profileImage: base64String }));
      toastSuccess('Photo loaded! Click "Save Changes" below to apply.');
    };
    reader.onerror = () => {
      toastError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    setFormData((prev) => ({ ...prev, profileImage: newAvatar }));
    toastInfo('Generated new random avatar!');
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, profileImage: '' }));
    toastInfo('Photo cleared (will use default avatar)');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toastError('Name is required');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toastError('New password must be at least 6 characters long');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        bio: formData.bio,
        profileImage: formData.profileImage
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      await updateProfile(payload);
      toastSuccess('Profile updated successfully!');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const currentAvatar =
    formData.profileImage ||
    user?.profileImage ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`;

  const isUjjwal = user?.email === 'ujjsingh203@gmail.com' || user?.name?.toLowerCase().includes('ujjwal');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-display flex items-center gap-3">
          <User className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          <span>Account & Developer Profile</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload your personal photo, update your biography, and manage account credentials.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        className="hidden"
      />

      {/* Profile Settings Card */}
      <div className="bg-white dark:bg-navy-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Profile Header Canvas */}
        <div className="h-36 bg-gradient-to-r from-brand-600 via-accent-purple to-accent-pink relative"></div>

        <div className="px-6 sm:px-10 pb-10 relative">
          {/* Avatar & Photo Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-8 gap-4">
            <div className="relative group">
              <img
                src={currentAvatar}
                alt={user?.name}
                className="w-28 h-28 rounded-3xl object-cover ring-4 ring-white dark:ring-navy-850 shadow-2xl bg-slate-100 dark:bg-navy-900"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload photo from device"
                className="absolute -bottom-2 -right-2 p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
              {/* Direct Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-700 hover:to-purple-700 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>

              {/* Random Avatar */}
              <button
                type="button"
                onClick={handleGenerateRandomAvatar}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                title="Generate illustration avatar"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Random Avatar</span>
              </button>

              {/* Remove Photo */}
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3.5 bg-slate-100 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Email cannot be changed directly.</p>
              </div>
            </div>

            {/* Profile Image URL / Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Profile Image URL (or use Upload button above)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage.startsWith('data:') ? '(Uploaded Image Data Selected)' : formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/... or paste image link"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all"
                />
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Author Biography
                </label>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  {formData.bio.length}/250
                </span>
              </div>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                maxLength={250}
                placeholder="Share a short summary about your background, interests, or engineering focus..."
                className="w-full p-4 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all resize-none"
              />
            </div>

            {/* Password Update (Optional) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Change Password (Optional)</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep your current password"
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-navy-950 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-9 py-4 bg-gradient-to-r from-brand-600 via-accent-purple to-accent-pink hover:from-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Developer Resume & Portfolio Showcase Card */}
      {isUjjwal && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-purple text-white flex items-center justify-center shadow-md">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  Developer Portfolio Highlights
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" /> Lucknow, Uttar Pradesh, India
                </p>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Verified Developer
            </span>
          </div>

          {/* Education & Core Focus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-brand-500" />
                Education
              </div>
              <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                B.Tech in Computer Science & Engineering
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dr. A.P.J. Abdul Kalam Technical University (Sep 2023 – May 2027)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-purple-500" />
                Primary Engineering Focus
              </div>
              <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                Full-Stack MERN, System Architecture & AI
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scalable APIs, JWT RBAC, Cloud Integration & Realtime Vision
              </p>
            </div>
          </div>

          {/* Flagship Projects */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" />
              Flagship Built Projects
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Project 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">CourseHub</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Scalable online learning platform with JWT RBAC, Cloudinary streaming & payment gateway.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['React', 'Node.js', 'MongoDB', 'Cloudinary'].map(t => (
                    <span key={t} className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-300">{t}</span>
                  ))}
                </div>
              </div>

              {/* Project 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">Bharat Sign AI</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Multimodal Indian Sign Language translation connecting spoken text, voice & gestures.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['React', 'FastAPI', 'MediaPipe', 'Supabase'].map(t => (
                    <span key={t} className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-300">{t}</span>
                  ))}
                </div>
              </div>

              {/* Project 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">Smart Parking</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Real-time slot allocation, booking and parking analytics management system.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['React', 'Node.js', 'Express', 'MongoDB'].map(t => (
                    <span key={t} className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-300">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
