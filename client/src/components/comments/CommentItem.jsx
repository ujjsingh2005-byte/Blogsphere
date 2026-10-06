import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, Heart, Flag, ShieldAlert } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../common/ConfirmModal';
import ReportModal from '../common/ReportModal';

const CommentItem = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 4));

  const authorId = comment.author?._id || comment.author;
  const isOwner = user && authorId && (user._id === authorId || user.id === authorId);
  const isAdmin = user?.role === 'admin';

  const authorName = comment.author?.name || 'Anonymous User';
  const authorImage =
    comment.author?.profileImage ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`;

  const handleSaveEdit = async () => {
    if (!editContent.trim() || isUpdating) return;
    setIsUpdating(true);
    try {
      await onUpdate(comment._id, editContent);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(comment._id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleLike = () => {
    if (liked) {
      setLikeCount((prev) => Math.max(0, prev - 1));
      setLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-navy-850 border border-slate-200/70 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        {/* Author Details */}
        <div className="flex items-center gap-3.5">
          <img
            src={authorImage}
            alt={authorName}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{authorName}</span>
              {comment.author?.role === 'admin' && (
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                  Admin
                </span>
              )}
              {isOwner && (
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                  You
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {formatRelativeTime(comment.createdAt)}
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span className="italic ml-1">(edited)</span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {isOwner && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Edit comment"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {(isOwner || isAdmin) && !isEditing && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className={`p-1.5 rounded-xl transition-colors ${
                isAdmin && !isOwner
                  ? 'text-amber-600 dark:text-amber-400 hover:bg-rose-50 hover:text-rose-600'
                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
              }`}
              title={isAdmin && !isOwner ? 'Admin: Remove comment' : 'Delete comment'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {!isOwner && (
            <button
              onClick={() => setShowReportModal(true)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
              title="Report comment"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Comment Body / Inline Edit */}
      <div className="mt-3.5 pl-12 sm:pl-13">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              rows="3"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-navy-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              maxLength={1000}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || isUpdating}
                className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {isUpdating ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Save Edit</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
              {comment.content}
            </p>

            {/* Like & Reply Interaction */}
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={toggleLike}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  liked
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{likeCount > 0 ? likeCount : 'Like'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title={isAdmin && !isOwner ? 'Admin: Delete Comment' : 'Delete Comment'}
        message={
          isAdmin && !isOwner
            ? `Are you sure you want to remove this comment as an administrator?`
            : 'Are you sure you want to delete your comment? This cannot be undone.'
        }
        confirmText="Delete Comment"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="comment"
        targetId={comment._id}
        targetTitle={`Comment by ${authorName}`}
      />
    </div>
  );
};

export default CommentItem;
