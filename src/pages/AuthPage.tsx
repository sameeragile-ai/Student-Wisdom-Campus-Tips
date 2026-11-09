import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  User as UserIcon,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STUDY_PROGRAMS } from '../data/programs';

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studyProgram, setStudyProgram] = useState('Computer Science');
  const [error, setError] = useState<string | null>(null);

  // Email validation check
  const isUniDomain = email.trim().toLowerCase().endsWith('@student.uni.edu');
  const showDomainWarning = email.length > 5 && !isUniDomain;

  // Handle Demo Quick Logins
  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setError(null);
    setEmail(demoEmail);
    setPassword(demoPass);
    const result = login(demoEmail, demoPass);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const res = login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error || 'Invalid login details');
      }
    } else {
      const res = signup(name, email, password, studyProgram);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error || 'Failed to create student account');
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#ECE6DC] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* ===================================================
            LEFT INK PANEL (Desktop only, 5 cols)
            =================================================== */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#0E1A2B] text-white p-10 flex-col justify-between relative overflow-hidden">
          {/* Radial Sunrise Glow in corner */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-25 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #FF5F45 0%, #FF8A3D 50%, transparent 80%)',
            }}
          />
          <div className="absolute inset-0 bg-grain-dark opacity-30 pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10 space-y-3">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold font-editorial tracking-tight text-white">
                Tip<span className="text-sunrise">Jar</span>
              </span>
            </Link>
            <p className="text-xs text-[#7A8699] leading-relaxed">
              Real tips from students who've been there. Peer-reviewed, verified, and strictly protected for campus members.
            </p>
          </div>

          {/* Testimonial Quote */}
          <div className="relative z-10 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-1 text-[#FF8A3D]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xs">★</span>
              ))}
            </div>
            <p className="text-xs text-[#ECE6DC] leading-relaxed italic">
              "TipJar is the first thing I open during syllabus week. The course difficulty tips helped me avoid a terrible exam schedule."
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <img
                src="https://i.pravatar.cc/150?img=47"
                alt="Maya Chen"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="text-[11px]">
                <strong className="text-white block font-sans">Maya Chen</strong>
                <span className="text-[#7A8699]">Computer Science · 3rd Year</span>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative z-10 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-xl font-bold font-editorial text-white tabular-nums block">
                2,400+
              </span>
              <span className="text-[10px] text-[#7A8699] uppercase font-bold">
                Active Students
              </span>
            </div>
            <div>
              <span className="text-xl font-bold font-editorial text-[#0EA5A0] tabular-nums block">
                100%
              </span>
              <span className="text-[10px] text-[#7A8699] uppercase font-bold">
                Verified Domains
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT FORM PANEL (7 cols)
            =================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`text-lg font-bold font-editorial pb-1 transition-all ${
                  mode === 'login'
                    ? 'text-[#0E1A2B] border-b-2 border-[#FF5F45]'
                    : 'text-[#7A8699] hover:text-[#0E1A2B]'
                }`}
              >
                Log In
              </button>
              <span className="text-[#ECE6DC]">|</span>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`text-lg font-bold font-editorial pb-1 transition-all ${
                  mode === 'signup'
                    ? 'text-[#0E1A2B] border-b-2 border-[#FF5F45]'
                    : 'text-[#7A8699] hover:text-[#0E1A2B]'
                }`}
              >
                Create Account
              </button>
            </div>

            <span className="text-[11px] text-[#7A8699] font-medium hidden sm:inline">
              University Domain Required
            </span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FFF0F0] border border-[#E5484D]/30 flex items-start gap-2.5 text-xs text-[#E5484D]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Chips (Client Reviewer Helper) */}
          <div className="mb-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8699] flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-[#FF5F45]" />
                Tappable Quick Demo Logins
              </span>
              <span className="text-[10px] text-[#7A8699]">One-tap test</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('maya@student.uni.edu', 'demo123')}
                className="p-2.5 rounded-xl bg-white border border-[#ECE6DC] hover:border-[#FF5F45] text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0E1A2B] group-hover:text-[#FF5F45]">
                    Maya Chen (Student)
                  </span>
                  <span className="text-[10px] text-[#7A8699]">demo123</span>
                </div>
                <span className="text-[10px] text-[#7A8699] block truncate">
                  maya@student.uni.edu
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@student.uni.edu', 'admin123')}
                className="p-2.5 rounded-xl bg-[#0E1A2B] text-white text-left transition-all group hover:bg-[#3B4A5E]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-[#FF8A3D]">
                    Admin Team (Moderator)
                  </span>
                  <span className="text-[10px] text-white/70">admin123</span>
                </div>
                <span className="text-[10px] text-white/70 block truncate">
                  admin@student.uni.edu
                </span>
              </button>
            </div>
          </div>

          {/* The Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#7A8699] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#0E1A2B] text-[#0E1A2B]"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                University Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7A8699] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@student.uni.edu"
                  className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none text-[#0E1A2B] ${
                    showDomainWarning
                      ? 'border-[#FF6B4A] bg-[#FFF8F6]'
                      : 'border-[#ECE6DC] focus:border-[#0E1A2B]'
                  }`}
                  required
                />
              </div>

              {/* Inline Domain Restriction message */}
              {showDomainWarning ? (
                <p className="text-[11px] text-[#FF6B4A] mt-1.5 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Must end with @student.uni.edu (e.g. yourname@student.uni.edu)</span>
                </p>
              ) : (
                <p className="text-[10px] text-[#7A8699] mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#0EA5A0]" />
                  <span>Only verified university emails can join.</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A8699] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#0E1A2B] text-[#0E1A2B]"
                  required
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#0E1A2B] mb-1">
                  Academic Major / Study Program
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#7A8699] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={studyProgram}
                    onChange={(e) => setStudyProgram(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#ECE6DC] bg-white focus:outline-none focus:border-[#0E1A2B] text-[#0E1A2B]"
                  >
                    {STUDY_PROGRAMS.map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-sunrise text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'login' ? 'Log in to TipJar' : 'Create Student Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-[#7A8699] text-center mt-6">
            By logging in, you agree to the University Student Honor Code and Community Guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
