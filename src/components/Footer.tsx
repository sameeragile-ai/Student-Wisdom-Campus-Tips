import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Heart, Shield, BookOpen, Home, Coffee, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Footer() {
  const { resetDemoData, currentUser } = useApp();

  return (
    <footer className="relative bg-[#0E1A2B] text-white pt-16 pb-28 md:pb-16 overflow-hidden border-t border-[#ECE6DC]/10">
      {/* Subtle radial Sunrise glow in corner */}
      <div
        className="absolute top-0 right-0 w-[420px] h-[420px] pointer-events-none opacity-20 blur-[90px] rounded-full"
        style={{
          background: 'radial-gradient(circle, #FF5F45 0%, #FF8A3D 50%, transparent 80%)',
        }}
      />
      {/* Grain overlay */}
      <div className="absolute inset-0 bg-grain-dark opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-editorial text-white tracking-tight">
                Tip<span className="text-sunrise">Jar</span>
              </span>
            </div>
            <p className="text-xs text-[#7A8699] leading-relaxed">
              Real tips from students who've been there. A community-governed directory of practical university wisdom for housing, courses, and daily student survival.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#7A8699]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#0EA5A0]" />
              <span>Campus Network Online</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4 font-sans">
              Campus Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-[#7A8699]">
              <li>
                <Link
                  to="/category/housing"
                  className="hover:text-[#FF6B4A] transition-colors flex items-center gap-2"
                >
                  <Home className="w-3.5 h-3.5 text-[#FF6B4A]" />
                  <span>Housing & Dorms</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/category/courses"
                  className="hover:text-[#0E8F8A] transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#0E8F8A]" />
                  <span>Course Tips & Exams</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/category/daily-life"
                  className="hover:text-[#F2A93B] transition-colors flex items-center gap-2"
                >
                  <Coffee className="w-3.5 h-3.5 text-[#F2A93B]" />
                  <span>Daily Life & Budgeting</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access & Moderation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4 font-sans">
              Platform & Governance
            </h4>
            <ul className="space-y-2.5 text-xs text-[#7A8699]">
              <li>
                <Link to="/post" className="hover:text-white transition-colors">
                  Submit a Campus Tip
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#FF5F45] transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#FF5F45]" />
                  <span>Admin Moderation Queue</span>
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-white transition-colors">
                  University Student Login
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={resetDemoData}
                  className="hover:text-[#FF8A3D] transition-colors flex items-center gap-1.5 text-left"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#FF8A3D]" />
                  <span>Reset Demo Local Data</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Verified University Community statement */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4 font-sans">
              Verified Student Guild
            </h4>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <p className="text-xs text-[#ECE6DC] leading-relaxed">
                TipJar is strictly restricted to verified <code className="text-[#FF8A3D] font-mono">@student.uni.edu</code> university emails to prevent spam and preserve genuine peer advice.
              </p>
              <p className="text-[11px] text-[#7A8699]">
                Active Session: <strong className="text-white">{currentUser ? currentUser.name : 'Guest'}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A8699]">
          <p>© 2026 TipJar. Crafted for student communities. All tips peer-reviewed.</p>
          <div className="flex items-center gap-6">
            <span>Student Privacy Protocol</span>
            <span>Honor Code</span>
            <span className="flex items-center gap-1 text-[#ECE6DC]">
              Built with <Heart className="w-3.5 h-3.5 text-[#FF5F45] fill-[#FF5F45]" /> for students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
