import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Calendar,
  GraduationCap,
  ThumbsUp,
  BookOpen,
  Edit3,
  X,
  Sparkles,
  Bookmark,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/date';
import { SafeImage } from '../components/SafeImage';
import { TipCard } from '../components/TipCard';
import { STUDY_PROGRAMS } from '../data/programs';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { users, currentUser, tips, userVotes, updateProfile, showToast } = useApp();

  const user = users.find((u) => u.id === id) || (currentUser?.id === id ? currentUser : null);

  // Tabs: 'tips' or 'upvoted'
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'tips' | 'upvoted'>(
    tabParam === 'upvoted' ? 'upvoted' : 'tips'
  );

  // Edit Profile modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editProgram, setEditProgram] = useState(user?.studyProgram || 'Computer Science');
  const [editBio, setEditBio] = useState(user?.bio || '');

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 text-center px-4">
        <h2 className="text-3xl font-bold font-editorial text-[#0E1A2B]">Student Not Found</h2>
        <p className="text-sm text-[#7A8699] mt-2">This student profile does not exist.</p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 rounded-full bg-sunrise text-white font-bold text-xs"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  // Tips authored by this user
  const authoredTips = tips.filter((t) => t.authorId === user.id);

  // Total upvotes received on their tips
  const totalUpvotesReceived = authoredTips.reduce((acc, t) => acc + t.upvotes, 0);

  // Tips upvoted by this user (only displayed on own profile)
  const upvotedTips = tips.filter((t) => userVotes.includes(t.id));

  const isTopContributor = totalUpvotesReceived >= 100;

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditProgram(user.studyProgram);
    setEditBio(user.bio || '');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }
    updateProfile(user.id, {
      name: editName.trim(),
      studyProgram: editProgram,
      bio: editBio.trim() || undefined,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Cover Gradient Banner with Sunrise & Lagoon hues */}
      <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-[#FF5F45] via-[#FF8A3D] to-[#0EA5A0] overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-30" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="relative -mt-20 sm:-mt-24 mb-10 bg-white rounded-3xl border border-[#ECE6DC] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            {/* Avatar & Main Identifiers */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl shrink-0 bg-[#FAF7F2]">
                <SafeImage
                  src={user.avatar}
                  alt={user.name}
                  aspectRatio="aspect-square"
                  fallbackInitials={user.name}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-[#0E1A2B] tracking-tight">
                    {user.name}
                  </h1>
                  {user.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0E1A2B] text-white">
                      <Shield className="w-3 h-3 text-[#FF5F45]" />
                      <span>Campus Admin</span>
                    </span>
                  )}
                  {isTopContributor && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sunrise text-white shadow-xs">
                      <Award className="w-3 h-3" />
                      <span>Top Contributor</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-[#0E8F8A] flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>{user.studyProgram}</span>
                </p>

                <p className="text-xs text-[#7A8699] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Student Member since {formatDate(user.joinedAt)}</span>
                </p>
              </div>
            </div>

            {/* Edit Profile CTA (if own profile) */}
            {isOwnProfile && (
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="px-5 py-2.5 rounded-xl border border-[#ECE6DC] hover:border-[#FF5F45] text-xs font-bold text-[#0E1A2B] hover:text-[#FF5F45] bg-[#FAF7F2] hover:bg-white transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit profile</span>
                </button>
              </div>
            )}
          </div>

          {/* Bio statement */}
          {user.bio && (
            <p className="mt-6 pt-6 border-t border-[#ECE6DC] text-xs sm:text-sm text-[#3B4A5E] leading-relaxed max-w-3xl">
              {user.bio}
            </p>
          )}

          {/* Stats KPI Strip */}
          <div className="mt-6 pt-6 border-t border-[#ECE6DC] grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-2xl bg-[#FAF7F2]">
              <span className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#FF5F45] tabular-nums block">
                {totalUpvotesReceived}
              </span>
              <span className="text-[11px] font-semibold text-[#7A8699] uppercase tracking-wider">
                Upvotes Received
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2]">
              <span className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#0E1A2B] tabular-nums block">
                {authoredTips.length}
              </span>
              <span className="text-[11px] font-semibold text-[#7A8699] uppercase tracking-wider">
                Tips Published
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] col-span-2 sm:col-span-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-editorial text-[#0EA5A0] tabular-nums block">
                {isTopContributor ? 'Tier 1' : 'Active'}
              </span>
              <span className="text-[11px] font-semibold text-[#7A8699] uppercase tracking-wider">
                Peer Reputation
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            TABS: TIPS vs UPVOTED
            ======================================================== */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#ECE6DC] pb-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('tips');
                setSearchParams({});
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'tips'
                  ? 'bg-[#0E1A2B] text-white shadow-xs'
                  : 'text-[#7A8699] hover:text-[#0E1A2B]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Published Tips ({authoredTips.length})</span>
            </button>

            {isOwnProfile && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('upvoted');
                  setSearchParams({ tab: 'upvoted' });
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                  activeTab === 'upvoted'
                    ? 'bg-[#0E1A2B] text-white shadow-xs'
                    : 'text-[#7A8699] hover:text-[#0E1A2B]'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Tips You Upvoted ({upvotedTips.length})</span>
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'tips' && (
            <div>
              {authoredTips.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-[#ECE6DC] p-6 max-w-md mx-auto">
                  <p className="text-sm font-bold font-editorial text-[#0E1A2B]">
                    No tips published yet
                  </p>
                  <p className="text-xs text-[#7A8699] mt-1">
                    {isOwnProfile
                      ? 'Share your first exam hack or housing tip to start earning upvotes.'
                      : 'This student has not submitted any public campus tips yet.'}
                  </p>
                  {isOwnProfile && (
                    <Link
                      to="/post"
                      className="inline-block mt-4 px-5 py-2.5 rounded-full bg-sunrise text-white text-xs font-bold shadow-md"
                    >
                      Post a tip
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {authoredTips.map((tip) => (
                    <TipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upvoted' && isOwnProfile && (
            <div>
              {upvotedTips.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-[#ECE6DC] p-6 max-w-md mx-auto">
                  <p className="text-sm font-bold font-editorial text-[#0E1A2B]">
                    No upvoted tips yet
                  </p>
                  <p className="text-xs text-[#7A8699] mt-1">
                    When you upvote useful tips across campus, they will be saved here for quick reference.
                  </p>
                  <Link
                    to="/category/courses"
                    className="inline-block mt-4 px-5 py-2.5 rounded-full bg-[#0E1A2B] text-white text-xs font-bold"
                  >
                    Browse campus tips
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upvotedTips.map((tip) => (
                    <TipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          EDIT PROFILE MODAL
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#ECE6DC] p-6 z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DC]">
                <h3 className="text-lg font-bold font-editorial text-[#0E1A2B]">
                  Edit Student Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 text-[#7A8699] hover:text-[#0E1A2B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#0E1A2B] text-[#0E1A2B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                    Study Program:
                  </label>
                  <select
                    value={editProgram}
                    onChange={(e) => setEditProgram(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#0E1A2B] text-[#0E1A2B] bg-white"
                  >
                    {STUDY_PROGRAMS.map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                    Short Bio (optional):
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell other students your major, interests, or favorite study hacks..."
                    className="w-full p-2.5 text-xs rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#0E1A2B] text-[#0E1A2B]"
                  />
                </div>

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
                    Save Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
