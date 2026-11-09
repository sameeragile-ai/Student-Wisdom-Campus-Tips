import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Flag,
  FileText,
  Users as UsersIcon,
  RotateCcw,
  Trash2,
  Edit3,
  CheckCircle,
  AlertTriangle,
  Ban,
  Unlock,
  ExternalLink,
  Search,
  Filter,
  Shield,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, formatRelativeTime } from '../utils/date';
import { SafeImage } from '../components/SafeImage';
import { Tip, Report } from '../types';

export function AdminPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    tips,
    users,
    reports,
    blockedUserIds,
    dismissReport,
    deleteTip,
    updateTip,
    toggleBlockUser,
    resetDemoData,
    switchUser,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'tips' | 'users'>('overview');
  const [searchFilter, setSearchFilter] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Edit Tip Modal state
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');

  // Delete tip confirmation
  const [tipToDelete, setTipToDelete] = useState<Tip | null>(null);

  // Admin access guard
  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#ECE6DC] p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[#E5484D]/10 text-[#E5484D] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold font-editorial text-[#0E1A2B]">
            Admin Moderation Area
          </h2>
          <p className="text-xs text-[#7A8699] leading-relaxed">
            Access to reported tips and moderation controls is reserved for campus administrators.
          </p>

          <div className="pt-2 border-t border-[#ECE6DC] space-y-2">
            <button
              type="button"
              onClick={() => switchUser('user-admin')}
              className="w-full py-2.5 rounded-xl bg-[#0E1A2B] text-white text-xs font-bold shadow-md hover:bg-[#3B4A5E] transition-all"
            >
              Switch to Demo Admin Persona
            </button>
            <Link
              to="/"
              className="block w-full py-2 rounded-xl text-xs font-semibold text-[#7A8699] hover:bg-[#FAF7F2]"
            >
              Return to campus home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Metrics
  const openReports = reports.filter((r) => r.status === 'open');
  const totalTipsCount = tips.length;
  const totalUsersCount = users.length;
  const blockedUsersCount = blockedUserIds.length;

  // Filtered tips for "all tips" tab
  const filteredTips = tips.filter((t) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.authorName.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      (t.courseCode && t.courseCode.toLowerCase().includes(q))
    );
  });

  // Filtered users for "users" tab
  const filteredUsers = users.filter((u) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.studyProgram.toLowerCase().includes(q)
    );
  });

  // Open Edit Tip Modal
  const handleStartEditTip = (tip: Tip) => {
    setEditingTip(tip);
    setEditTitle(tip.title);
    setEditText(tip.text);
  };

  // Save Edit Tip
  const handleSaveEditTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTip) return;
    updateTip(editingTip.id, {
      title: editTitle.trim(),
      text: editText.trim(),
    });
    setEditingTip(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF5F45] uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Campus Governance & Safety</span>
            </div>
            <h1 className="text-3xl font-bold font-editorial text-[#0E1A2B] tracking-tight mt-1">
              Admin Moderation Center
            </h1>
            <p className="text-xs text-[#7A8699] mt-0.5">
              Review student flags, manage community tips, and inspect account standings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-full bg-white border border-[#ECE6DC] hover:border-[#FF5F45] text-xs font-bold text-[#0E1A2B] hover:text-[#FF5F45] flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4 text-[#FF5F45]" />
            <span>Reset Demo Local Data</span>
          </button>
        </div>

        {/* Dashboard Shell with Sidebar / Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar (Desktop) / Top Tabs (Mobile) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#ECE6DC] p-2 sm:p-3 shadow-xs">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-[#0E1A2B] text-white shadow-xs'
                    : 'text-[#3B4A5E] hover:bg-[#FAF7F2]'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Overview & KPIs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reports')}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'reports'
                    ? 'bg-[#0E1A2B] text-white shadow-xs'
                    : 'text-[#3B4A5E] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Flag className="w-4 h-4 text-[#FF5F45]" />
                  <span>Reported Tips</span>
                </div>
                {openReports.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#E5484D] text-white font-bold tabular-nums">
                    {openReports.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tips')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'tips'
                    ? 'bg-[#0E1A2B] text-white shadow-xs'
                    : 'text-[#3B4A5E] hover:bg-[#FAF7F2]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>All Tips ({tips.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'users'
                    ? 'bg-[#0E1A2B] text-white shadow-xs'
                    : 'text-[#3B4A5E] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UsersIcon className="w-4 h-4" />
                  <span>Students ({users.length})</span>
                </div>
                {blockedUsersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FF6B4A]/10 text-[#FF6B4A] font-bold">
                    {blockedUsersCount} blocked
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Main Dashboard Panel (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* ===================================================
                TAB 1: OVERVIEW & KPIS
                =================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 4 Overview Metric Cards with SVG mini sparkline trends */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Tips */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8699]">
                        Total Tips
                      </span>
                      <p className="text-3xl font-extrabold font-editorial text-[#0E1A2B] mt-1 tabular-nums">
                        {totalTipsCount}
                      </p>
                    </div>
                    {/* Mini sparkline */}
                    <svg className="w-full h-8 mt-3" viewBox="0 0 100 24">
                      <path
                        d="M0 20 L20 18 L40 14 L60 16 L80 8 L100 4"
                        fill="none"
                        stroke="#0EA5A0"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Total Users */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8699]">
                        Registered Students
                      </span>
                      <p className="text-3xl font-extrabold font-editorial text-[#0E1A2B] mt-1 tabular-nums">
                        {totalUsersCount}
                      </p>
                    </div>
                    {/* Mini sparkline */}
                    <svg className="w-full h-8 mt-3" viewBox="0 0 100 24">
                      <path
                        d="M0 22 L25 19 L50 12 L75 10 L100 5"
                        fill="none"
                        stroke="#FF8A3D"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Open Reports */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8699]">
                        Pending Flags
                      </span>
                      <p className="text-3xl font-extrabold font-editorial text-[#E5484D] mt-1 tabular-nums">
                        {openReports.length}
                      </p>
                    </div>
                    {/* Mini sparkline */}
                    <svg className="w-full h-8 mt-3" viewBox="0 0 100 24">
                      <path
                        d="M0 6 L30 8 L60 14 L85 10 L100 18"
                        fill="none"
                        stroke="#E5484D"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Blocked Users */}
                  <div className="p-5 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8699]">
                        Blocked Users
                      </span>
                      <p className="text-3xl font-extrabold font-editorial text-[#3B4A5E] mt-1 tabular-nums">
                        {blockedUsersCount}
                      </p>
                    </div>
                    {/* Mini sparkline */}
                    <svg className="w-full h-8 mt-3" viewBox="0 0 100 24">
                      <path
                        d="M0 20 L40 20 L70 14 L100 14"
                        fill="none"
                        stroke="#7A8699"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Open Reports Quick Action preview */}
                <div className="p-6 rounded-3xl bg-white border border-[#ECE6DC] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-editorial text-[#0E1A2B] flex items-center gap-2">
                      <Flag className="w-5 h-5 text-[#E5484D]" />
                      <span>Pending Community Reports</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reports')}
                      className="text-xs font-bold text-[#FF5F45] hover:underline"
                    >
                      View all ({openReports.length})
                    </button>
                  </div>

                  {openReports.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#7A8699]">
                      <CheckCircle className="w-8 h-8 text-[#0EA5A0] mx-auto mb-2" />
                      <span>Moderation queue is empty! No active flags.</span>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#ECE6DC]/60">
                      {openReports.slice(0, 3).map((rep) => (
                        <div
                          key={rep.id}
                          className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFF0F0] text-[#E5484D] mr-2">
                              {rep.reason}
                            </span>
                            <span className="text-xs font-bold text-[#0E1A2B]">
                              {rep.tipTitle}
                            </span>
                            {rep.comment && (
                              <p className="text-xs text-[#7A8699] mt-0.5 italic">
                                "{rep.comment}"
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Link
                              to={`/tip/${rep.tipId}`}
                              className="px-3 py-1.5 rounded-lg border border-[#ECE6DC] text-xs font-bold text-[#3B4A5E] hover:bg-[#FAF7F2]"
                            >
                              Inspect Tip
                            </Link>
                            <button
                              type="button"
                              onClick={() => dismissReport(rep.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#ECE6DC] text-xs font-bold text-[#0EA5A0]"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===================================================
                TAB 2: REPORTED TIPS QUEUE
                =================================================== */}
            {activeTab === 'reports' && (
              <div className="bg-white rounded-3xl border border-[#ECE6DC] p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-editorial text-[#0E1A2B]">
                    Reported Tips Queue
                  </h3>
                  <p className="text-xs text-[#7A8699] mt-0.5">
                    Action student flags: verify details, edit outdated values, or dismiss unfounded reports.
                  </p>
                </div>

                {reports.length === 0 ? (
                  <p className="py-12 text-center text-xs text-[#7A8699]">
                    No reports submitted yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reports.map((rep) => {
                      const targetTip = tips.find((t) => t.id === rep.tipId);
                      return (
                        <div
                          key={rep.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            rep.status === 'open'
                              ? 'bg-white border-[#E5484D]/30 shadow-xs'
                              : 'bg-[#FAF7F2]/60 border-[#ECE6DC] opacity-70'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    rep.status === 'open'
                                      ? 'bg-[#E5484D] text-white'
                                      : 'bg-[#ECE6DC] text-[#7A8699]'
                                  }`}
                                >
                                  {rep.status}
                                </span>
                                <span className="text-[11px] font-semibold text-[#FF5F45]">
                                  Flag: {rep.reason.toUpperCase()}
                                </span>
                                <span className="text-[#7A8699] text-[11px]">·</span>
                                <span className="text-[#7A8699] text-[11px]">
                                  Reported by {rep.reporterName} ({formatRelativeTime(rep.createdAt)})
                                </span>
                              </div>

                              <h4 className="text-sm font-bold font-editorial text-[#0E1A2B]">
                                {rep.tipTitle}
                              </h4>
                              {rep.comment && (
                                <p className="text-xs text-[#3B4A5E] mt-1 bg-[#FAF7F2] p-2 rounded-lg border border-[#ECE6DC]">
                                  <strong>Reporter Note:</strong> "{rep.comment}"
                                </p>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                              <Link
                                to={`/tip/${rep.tipId}`}
                                className="px-3 py-1.5 rounded-xl border border-[#ECE6DC] text-xs font-bold text-[#3B4A5E] hover:bg-[#FAF7F2]"
                              >
                                View
                              </Link>

                              {targetTip && (
                                <button
                                  type="button"
                                  onClick={() => handleStartEditTip(targetTip)}
                                  className="px-3 py-1.5 rounded-xl border border-[#ECE6DC] text-xs font-bold text-[#FF5F45] hover:bg-[#FF5F45]/10"
                                >
                                  Edit Tip
                                </button>
                              )}

                              {targetTip && (
                                <button
                                  type="button"
                                  onClick={() => setTipToDelete(targetTip)}
                                  className="px-3 py-1.5 rounded-xl border border-[#E5484D]/30 text-xs font-bold text-[#E5484D] hover:bg-[#E5484D]/10"
                                >
                                  Delete
                                </button>
                              )}

                              {rep.status === 'open' && (
                                <button
                                  type="button"
                                  onClick={() => dismissReport(rep.id)}
                                  className="px-3 py-1.5 rounded-xl bg-[#0EA5A0] text-white text-xs font-bold shadow-xs hover:bg-[#0c8e8a]"
                                >
                                  Dismiss
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================
                TAB 3: ALL TIPS REPOSITORY
                =================================================== */}
            {activeTab === 'tips' && (
              <div className="bg-white rounded-3xl border border-[#ECE6DC] p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold font-editorial text-[#0E1A2B]">
                      Campus Tips Directory
                    </h3>
                    <p className="text-xs text-[#7A8699] mt-0.5">
                      {tips.length} total tips currently live on the network.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-[#7A8699] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search title or author..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#0E1A2B]"
                    />
                  </div>
                </div>

                <div className="divide-y divide-[#ECE6DC]/60">
                  {filteredTips.map((tip) => (
                    <div
                      key={tip.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[11px] text-[#7A8699] mb-1">
                          <span className="capitalize font-semibold text-[#FF5F45]">
                            {tip.category}
                          </span>
                          <span>·</span>
                          <span>{tip.subtopic}</span>
                          <span>·</span>
                          <span className="tabular-nums font-bold text-[#0E1A2B]">
                            ▲ {tip.upvotes}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold font-editorial text-[#0E1A2B] truncate">
                          {tip.title}
                        </h4>
                        <p className="text-xs text-[#7A8699] mt-0.5">
                          By {tip.authorName} ({tip.authorProgram}) · Updated {formatRelativeTime(tip.updatedAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/tip/${tip.id}`}
                          className="px-3 py-1.5 rounded-xl border border-[#ECE6DC] text-xs font-bold text-[#3B4A5E] hover:bg-[#FAF7F2]"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleStartEditTip(tip)}
                          className="px-3 py-1.5 rounded-xl border border-[#ECE6DC] text-xs font-bold text-[#FF5F45] hover:bg-[#FF5F45]/10"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setTipToDelete(tip)}
                          className="px-3 py-1.5 rounded-xl border border-[#E5484D]/30 text-xs font-bold text-[#E5484D] hover:bg-[#E5484D]/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================================================
                TAB 4: STUDENTS & ACCOUNT STATUS
                =================================================== */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-3xl border border-[#ECE6DC] p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold font-editorial text-[#0E1A2B]">
                      Student Users
                    </h3>
                    <p className="text-xs text-[#7A8699] mt-0.5">
                      Inspect account permissions, block bad actors, or unblock appeals.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-[#7A8699] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search students..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#0E1A2B]"
                    />
                  </div>
                </div>

                <div className="divide-y divide-[#ECE6DC]/60">
                  {filteredUsers.map((u) => {
                    const isBlocked = blockedUserIds.includes(u.id);
                    const userTipsCount = tips.filter((t) => t.authorId === u.id).length;
                    const userUpvotes = tips
                      .filter((t) => t.authorId === u.id)
                      .reduce((sum, t) => sum + t.upvotes, 0);

                    return (
                      <div
                        key={u.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#ECE6DC] shrink-0">
                            <SafeImage
                              src={u.avatar}
                              alt={u.name}
                              aspectRatio="aspect-square"
                              fallbackInitials={u.name}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-[#0E1A2B]">{u.name}</h4>
                              {isBlocked && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5484D] text-white">
                                  Blocked
                                </span>
                              )}
                              {u.role === 'admin' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0E1A2B] text-white">
                                  Admin
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#7A8699]">{u.email}</p>
                            <p className="text-[11px] text-[#3B4A5E] mt-0.5">
                              {u.studyProgram} · {userTipsCount} tips · {userUpvotes} upvotes
                            </p>
                          </div>
                        </div>

                        {/* Action: Block / Unblock */}
                        {u.role !== 'admin' && (
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <Link
                              to={`/profile/${u.id}`}
                              className="px-3 py-1.5 rounded-xl border border-[#ECE6DC] text-xs font-semibold text-[#3B4A5E] hover:bg-[#FAF7F2]"
                            >
                              Profile
                            </Link>

                            <button
                              type="button"
                              onClick={() => toggleBlockUser(u.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                                isBlocked
                                  ? 'bg-[#0EA5A0] text-white hover:bg-[#0c8e8a]'
                                  : 'border border-[#E5484D]/40 text-[#E5484D] hover:bg-[#E5484D]/10'
                              }`}
                            >
                              {isBlocked ? (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>Unblock User</span>
                                </>
                              ) : (
                                <>
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Block User</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          EDIT TIP MODAL (ADMIN)
          ======================================================== */}
      <AnimatePresence>
        {editingTip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingTip(null)}
              className="fixed inset-0 bg-[#0E1A2B]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#ECE6DC] p-6 z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DC]">
                <h3 className="text-lg font-bold font-editorial text-[#0E1A2B]">
                  Admin Edit Tip
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingTip(null)}
                  className="p-1 text-[#7A8699] hover:text-[#0E1A2B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditTip} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                    Tip Title:
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#0E1A2B] text-[#0E1A2B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                    Tip Text Content:
                  </label>
                  <textarea
                    rows={5}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#0E1A2B] text-[#0E1A2B]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ECE6DC]">
                  <button
                    type="button"
                    onClick={() => setEditingTip(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A8699] hover:bg-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sunrise text-white text-xs font-bold shadow-xs"
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
          DELETE TIP CONFIRMATION (ADMIN)
          ======================================================== */}
      <AnimatePresence>
        {tipToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTipToDelete(null)}
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
                  Confirm Tip Deletion?
                </h3>
                <p className="text-xs text-[#7A8699] mt-1.5 leading-relaxed">
                  Permanently remove "<strong>{tipToDelete.title}</strong>"? Any associated reports will also be cleared.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTipToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#ECE6DC] text-xs font-semibold text-[#3B4A5E] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteTip(tipToDelete.id);
                    setTipToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#E5484D] text-white text-xs font-bold shadow-xs hover:bg-[#c93b40] transition-colors"
                >
                  Delete Tip
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          RESET DEMO DATA MODAL
          ======================================================== */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetConfirmOpen(false)}
              className="fixed inset-0 bg-[#0E1A2B]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#ECE6DC] p-6 z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF8A3D]/10 text-[#FF8A3D] flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold font-editorial text-[#0E1A2B]">
                  Reset Demo Data?
                </h3>
                <p className="text-xs text-[#7A8699] mt-1.5 leading-relaxed">
                  This restores the initial 36 student tips, clears user edits and local votes, unblocks accounts, and restores Maya Chen as the active persona.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#ECE6DC] text-xs font-semibold text-[#3B4A5E] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    setIsResetConfirmOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-sunrise text-white text-xs font-bold shadow-xs hover:opacity-90 transition-all"
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
