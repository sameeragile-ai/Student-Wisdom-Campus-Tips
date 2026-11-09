import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Share2,
  Flag,
  Edit3,
  Trash2,
  Calendar,
  AlertTriangle,
  Check,
  MapPin,
  GraduationCap,
  Sparkles,
  X,
  AlertCircle,
  Home,
  BookOpen,
  Coffee,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, formatRelativeTime } from '../utils/date';
import { SafeImage } from '../components/SafeImage';
import { UpvoteButton } from '../components/UpvoteButton';
import { TipCard } from '../components/TipCard';
import { ReportReason } from '../types';

export function TipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    tips,
    currentUser,
    userVotes,
    toggleUpvote,
    updateTip,
    deleteTip,
    reportTip,
    hasOpenReport,
    showToast,
  } = useApp();

  const tip = tips.find((t) => t.id === id);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason>('outdated');
  const [reportComment, setReportComment] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!tip) {
    return (
      <div className="min-h-screen pt-32 pb-20 text-center px-4">
        <h2 className="text-3xl font-bold font-editorial text-[#0E1A2B]">
          Tip Not Found
        </h2>
        <p className="text-sm text-[#7A8699] mt-2">
          This tip may have been removed or the link is incorrect.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 rounded-full bg-sunrise text-white font-bold text-xs"
        >
          Return to campus home
        </Link>
      </div>
    );
  }

  const isAuthor = currentUser?.id === tip.authorId;
  const isAdmin = currentUser?.role === 'admin';
  const canModify = isAuthor || isAdmin;
  const hasVoted = userVotes.includes(tip.id);
  const isFlagged = hasOpenReport(tip.id);

  // Related tips (from same category, excluding current tip)
  const relatedTips = tips
    .filter((t) => t.category === tip.category && t.id !== tip.id)
    .slice(0, 3);

  // Category Accent
  const categoryConfig = {
    housing: {
      name: 'Housing',
      color: '#FF6B4A',
      icon: <Home className="w-4 h-4 text-[#FF6B4A]" />,
    },
    courses: {
      name: 'Courses',
      color: '#0E8F8A',
      icon: <BookOpen className="w-4 h-4 text-[#0E8F8A]" />,
    },
    'daily-life': {
      name: 'Daily Life',
      color: '#F2A93B',
      icon: <Coffee className="w-4 h-4 text-[#F2A93B]" />,
    },
  }[tip.category];

  // Share handler
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard! Share it with your study group.', 'success');
    } else {
      showToast('Share link: ' + window.location.href, 'info');
    }
  };

  // Submit report
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportTip(tip.id, reportReason, reportComment);
    setIsReportModalOpen(false);
    setReportComment('');
  };

  // Open edit modal
  const handleOpenEdit = () => {
    setEditTitle(tip.title);
    setEditText(tip.text);
    setEditPrice(tip.price || '');
    setIsEditModalOpen(true);
  };

  // Save edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editText.trim()) {
      showToast('Title and description cannot be empty.', 'error');
      return;
    }
    updateTip(tip.id, {
      title: editTitle.trim(),
      text: editText.trim(),
      price: editPrice.trim() || undefined,
    });
    setIsEditModalOpen(false);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    deleteTip(tip.id);
    navigate(`/category/${tip.category}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to={`/category/${tip.category}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A8699] hover:text-[#0E1A2B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {categoryConfig.name}</span>
          </Link>
        </div>

        {/* Subtle Alert if Open Reports */}
        {isFlagged && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFF4E5] border border-[#F2A93B]/40 flex items-start gap-3 text-xs sm:text-sm text-[#B76E00]">
            <AlertCircle className="w-5 h-5 text-[#F2A93B] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Student Community Notice</p>
              <p className="text-xs text-[#8A5200] mt-0.5 leading-relaxed">
                Some students have flagged this tip as possibly outdated or in need of verification. A campus moderator is reviewing it.
              </p>
            </div>
          </div>
        )}

        {/* Main Article Container */}
        <article className="bg-white rounded-3xl border border-[#ECE6DC] shadow-sm overflow-hidden">
          {/* Cover Media */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FAF7F2]">
            <SafeImage
              src={tip.coverImage}
              alt={tip.title}
              aspectRatio="aspect-[16/9]"
            />
            {/* Top Category Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-white/95 text-[#0E1A2B] shadow-sm border border-[#ECE6DC]">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryConfig.color }}
                />
                {categoryConfig.name}
              </span>
              {tip.price && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0E1A2B]/90 text-white shadow-sm tabular-nums">
                  {tip.price}
                </span>
              )}
            </div>
          </div>

          {/* Article Header & Metadata */}
          <div className="p-6 sm:p-10 border-b border-[#ECE6DC]">
            {/* Subtopic and Program tag */}
            <div className="flex items-center gap-2 text-xs text-[#7A8699] font-medium mb-3 flex-wrap">
              <span className="font-semibold text-[#3B4A5E]">{tip.subtopic}</span>
              <span>·</span>
              {tip.courseCode && (
                <>
                  <span className="font-bold text-[#0E8F8A]">{tip.courseCode}</span>
                  <span>·</span>
                </>
              )}
              {tip.neighborhood && (
                <>
                  <span className="inline-flex items-center gap-1 text-[#3B4A5E]">
                    <MapPin className="w-3 h-3 text-[#7A8699]" />
                    {tip.neighborhood}
                  </span>
                  <span>·</span>
                </>
              )}
              <span>Posted {formatDate(tip.createdAt)}</span>
              {tip.updatedAt !== tip.createdAt && (
                <>
                  <span>·</span>
                  <span className="text-[#FF5F45] font-semibold">
                    Updated {formatRelativeTime(tip.updatedAt)}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-bold font-editorial text-[#0E1A2B] tracking-tight leading-snug">
              {tip.title}
            </h1>

            {/* Author Card Row */}
            <div className="mt-6 pt-6 border-t border-[#ECE6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link
                to={`/profile/${tip.authorId}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden border border-[#ECE6DC] shrink-0">
                  <SafeImage
                    src={tip.authorAvatar}
                    alt={tip.authorName}
                    aspectRatio="aspect-square"
                    fallbackInitials={tip.authorName}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0E1A2B] group-hover:text-[#FF5F45] transition-colors">
                    {tip.authorName}
                  </h4>
                  <p className="text-xs text-[#7A8699] flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{tip.authorProgram}</span>
                  </p>
                </div>
              </Link>

              {/* Large Upvote Button */}
              <div className="flex items-center gap-3">
                <UpvoteButton
                  tipId={tip.id}
                  count={tip.upvotes}
                  hasVoted={hasVoted}
                  onToggle={() => toggleUpvote(tip.id)}
                  size="lg"
                  showLabel
                />
              </div>
            </div>
          </div>

          {/* Full Content Body */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="prose prose-slate max-w-none text-[#0E1A2B] text-base sm:text-lg leading-relaxed font-body">
              <p className="whitespace-pre-line">{tip.text}</p>
            </div>

            {/* Course details card if course metadata */}
            {tip.difficulty && (
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A8699] block">
                    Course Difficulty
                  </span>
                  <span className="text-sm font-bold text-[#FF5F45] tabular-nums mt-0.5 block">
                    {tip.difficulty} / 5
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A8699] block">
                    Reported Workload
                  </span>
                  <span className="text-sm font-bold text-[#0E1A2B] mt-0.5 block">
                    {tip.workload || '8-10 hrs/week'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions Bar */}
          <div className="p-6 bg-[#FAF7F2] border-t border-[#ECE6DC] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2 rounded-xl bg-white border border-[#ECE6DC] hover:border-[#D9D0C3] text-xs font-bold text-[#3B4A5E] hover:text-[#0E1A2B] flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share tip</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white border border-[#ECE6DC] hover:border-[#E5484D]/40 text-xs font-bold text-[#7A8699] hover:text-[#E5484D] flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report outdated / incorrect</span>
              </button>
            </div>

            {/* Author / Admin Edit and Delete */}
            {canModify && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="px-4 py-2 rounded-xl bg-white border border-[#ECE6DC] hover:border-[#FF5F45] text-xs font-bold text-[#3B4A5E] hover:text-[#FF5F45] flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit tip</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#ECE6DC] hover:border-[#E5484D] text-xs font-bold text-[#E5484D] flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </article>

        {/* ========================================================
            RELATED TIPS
            ======================================================== */}
        {relatedTips.length > 0 && (
          <section className="mt-14">
            <h3 className="text-xl sm:text-2xl font-bold font-editorial text-[#0E1A2B] mb-6">
              More {categoryConfig.name} tips you might need
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTips.map((rTip) => (
                <TipCard key={rTip.id} tip={rTip} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ========================================================
          REPORT MODAL
          ======================================================== */}
      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReportModalOpen(false)}
              className="fixed inset-0 bg-[#0E1A2B]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#ECE6DC] p-6 z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DC]">
                <h3 className="text-lg font-bold font-editorial text-[#0E1A2B] flex items-center gap-2">
                  <Flag className="w-4 h-4 text-[#E5484D]" />
                  <span>Report this tip</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="p-1 text-[#7A8699] hover:text-[#0E1A2B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-4">
                <p className="text-xs text-[#3B4A5E]">
                  Help keep TipJar reliable. What issue did you spot with this tip?
                </p>

                {/* Radio reasons */}
                <div className="space-y-2">
                  {[
                    { id: 'outdated', label: 'Outdated information (fees, rules, or dates changed)' },
                    { id: 'wrong', label: 'Factually incorrect or misleading advice' },
                    { id: 'other', label: 'Other concern (spam, inappropriate content)' },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        reportReason === option.id
                          ? 'border-[#0E1A2B] bg-[#FAF7F2] font-semibold text-[#0E1A2B]'
                          : 'border-[#ECE6DC] hover:border-[#D9D0C3] text-[#3B4A5E]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        checked={reportReason === option.id}
                        onChange={() => setReportReason(option.id as ReportReason)}
                        className="mt-0.5 text-[#0E1A2B] focus:ring-0"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>

                {/* Optional comment */}
                <div>
                  <label className="block text-xs font-semibold text-[#0E1A2B] mb-1">
                    Details for moderators (optional):
                  </label>
                  <textarea
                    value={reportComment}
                    onChange={(e) => setReportComment(e.target.value)}
                    rows={3}
                    placeholder="e.g. As of 2026, the Mensa only offers this on Thursdays..."
                    className="w-full p-2.5 text-xs rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#0E1A2B] text-[#0E1A2B]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A8699] hover:bg-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#E5484D] text-white text-xs font-bold shadow-xs hover:bg-[#c93b40] transition-colors"
                  >
                    Send Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          EDIT MODAL
          ======================================================== */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-[#0E1A2B]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#ECE6DC] p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DC]">
                <h3 className="text-lg font-bold font-editorial text-[#0E1A2B] flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#FF5F45]" />
                  <span>Edit your tip</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 text-[#7A8699] hover:text-[#0E1A2B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                    Tip Title (Max 100 characters):
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#FF5F45] text-[#0E1A2B]"
                    required
                  />
                  <span className="text-[10px] text-[#7A8699] block mt-0.5 text-right tabular-nums">
                    {editTitle.length} / 100
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                    Tip Advice Text (Max 1000 characters):
                  </label>
                  <textarea
                    maxLength={1000}
                    rows={5}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#FF5F45] text-[#0E1A2B]"
                    required
                  />
                  <span className="text-[10px] text-[#7A8699] block mt-0.5 text-right tabular-nums">
                    {editText.length} / 1000
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                    Price or Key Figure (optional):
                  </label>
                  <input
                    type="text"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="e.g. Canteen lunch · €1.50"
                    className="w-full p-2.5 text-xs rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#FF5F45] text-[#0E1A2B]"
                  />
                </div>

                <p className="text-[11px] text-[#7A8699] italic">
                  Note: Saving changes automatically updates the "Last updated" timestamp on this tip.
                </p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ECE6DC]">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A8699] hover:bg-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sunrise text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          DELETE CONFIRMATION MODAL
          ======================================================== */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="fixed inset-0 bg-[#0E1A2B]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#ECE6DC] p-6 z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#E5484D]/10 text-[#E5484D] flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold font-editorial text-[#0E1A2B]">
                  Delete this campus tip?
                </h3>
                <p className="text-xs text-[#7A8699] mt-1.5 leading-relaxed">
                  This action is permanent and will remove this tip from student search results and faculty rankings.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#ECE6DC] text-xs font-semibold text-[#3B4A5E] hover:bg-[#FAF7F2]"
                >
                  Keep Tip
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-[#E5484D] text-white text-xs font-bold shadow-xs hover:bg-[#c93b40] transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
