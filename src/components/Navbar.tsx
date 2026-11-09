import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  BookOpen,
  Home as HomeIcon,
  Coffee,
  Bookmark,
  Sparkles,
  ChevronDown,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SearchModal } from './SearchModal';
import { SafeImage } from './SafeImage';

export function Navbar() {
  const { currentUser, logout, switchUser, users } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  // Track window scroll for transparent-to-frosted glass transition & progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 24);

      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (winHeight > 0) {
        setScrollProgress((scrollY / winHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile full-screen menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Housing', path: '/category/housing', color: '#FF6B4A' },
    { name: 'Courses', path: '/category/courses', color: '#0E8F8A' },
    { name: 'Daily Life', path: '/category/daily-life', color: '#F2A93B' },
  ];

  const isActiveLink = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isHome && !isScrolled
            ? 'bg-transparent border-b border-transparent'
            : 'bg-[#FAF7F2]/85 backdrop-blur-md saturate-180 border-b border-[#ECE6DC] shadow-[0_4px_20px_rgba(14,26,43,0.03)]'
        } ${isScrolled ? 'h-16' : 'h-20'}`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo: custom SVG Jar mark + Fraunces wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
            aria-label="TipJar Home"
          >
            <div
              className={`relative transition-transform duration-300 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}
            >
              <svg
                width="32"
                height="34"
                viewBox="0 0 32 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm group-hover:rotate-[-6deg] transition-transform duration-300"
              >
                <defs>
                  <linearGradient id="navJarG" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF5F45" />
                    <stop offset="50%" stopColor="#FF8A3D" />
                    <stop offset="100%" stopColor="#FFC04D" />
                  </linearGradient>
                </defs>
                <rect x="8" y="2" width="16" height="4" rx="2" fill="#0E1A2B" />
                <path
                  d="M6 9 C6 7.5, 26 7.5, 26 9 L24 29 C24 31, 8 31, 8 29 Z"
                  fill="url(#navJarG)"
                  stroke="#0E1A2B"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="19" r="4" fill="#FAF7F2" />
                <path
                  d="M16 16.5 L16 21.5 M13.5 19 L18.5 19"
                  stroke="#0E1A2B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold font-editorial tracking-tight text-[#0E1A2B] select-none">
              Tip<span className="text-sunrise">Jar</span>
            </span>
          </Link>

          {/* Desktop Nav Links with animated layoutId sliding pill */}
          <nav className="hidden md:flex items-center gap-1 bg-[#ECE6DC]/40 p-1.5 rounded-full border border-[#ECE6DC]/60">
            {navLinks.map((link) => {
              const active = isActiveLink(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
                    active ? 'text-[#0E1A2B]' : 'text-[#3B4A5E] hover:text-[#0E1A2B]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm border border-[#ECE6DC]/70"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.color && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: link.color }}
                      />
                    )}
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Zone: Search, Post Tip CTA, and Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search tips (Cmd+K)"
              className="p-2 sm:px-3 sm:py-2 rounded-full border border-[#ECE6DC] bg-white/80 hover:bg-white text-[#3B4A5E] hover:text-[#0E1A2B] transition-all flex items-center gap-2 shadow-xs group"
            >
              <Search className="w-4 h-4 text-[#7A8699] group-hover:text-[#FF5F45] transition-colors" />
              <span className="hidden lg:inline text-xs font-medium text-[#7A8699]">
                Search tips...
              </span>
              <kbd className="hidden lg:inline text-[10px] bg-[#FAF7F2] border border-[#ECE6DC] rounded px-1.5 py-0.5 text-[#7A8699]">
                ⌘K
              </kbd>
            </button>

            {/* "Post a Tip" Gradient CTA (Desktop) */}
            <Link
              to="/post"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sunrise text-white text-xs font-bold tracking-wide shadow-md shadow-[#FF5F45]/20 hover:shadow-lg hover:shadow-[#FF5F45]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Post a tip</span>
            </Link>

            {/* Profile Menu Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-[#ECE6DC] bg-white hover:border-[#D9D0C3] transition-all focus:outline-none"
                  aria-label="User account menu"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <SafeImage
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      aspectRatio="aspect-square"
                      fallbackInitials={currentUser.name}
                    />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7A8699] mr-1 hidden sm:block" />
                </button>

                {/* Dropdown Card */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#ECE6DC] py-2 z-50 text-[#0E1A2B]"
                      >
                        {/* User Header */}
                        <div className="px-4 py-2.5 border-b border-[#ECE6DC]">
                          <p className="text-sm font-bold truncate text-[#0E1A2B]">
                            {currentUser.name}
                          </p>
                          <p className="text-xs text-[#7A8699] truncate">
                            {currentUser.email}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#ECE6DC] text-[#3B4A5E]">
                              {currentUser.studyProgram}
                            </span>
                            {currentUser.role === 'admin' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0E1A2B] text-white">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Navigation items */}
                        <div className="py-1">
                          <Link
                            to={`/profile/${currentUser.id}`}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#3B4A5E] hover:text-[#0E1A2B] hover:bg-[#FAF7F2] transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-[#7A8699]" />
                            <span>My Profile & Stats</span>
                          </Link>
                          <Link
                            to={`/profile/${currentUser.id}?tab=tips`}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#3B4A5E] hover:text-[#0E1A2B] hover:bg-[#FAF7F2] transition-colors"
                          >
                            <Bookmark className="w-4 h-4 text-[#7A8699]" />
                            <span>My Tips</span>
                          </Link>
                          {currentUser.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#FF5F45] hover:bg-[#FF5F45]/10 transition-colors"
                            >
                              <ShieldAlert className="w-4 h-4 text-[#FF5F45]" />
                              <span>Admin Moderation Panel</span>
                            </Link>
                          )}
                        </div>

                        {/* Quick switch demo users helper for client testing */}
                        <div className="border-t border-[#ECE6DC] px-4 py-2 bg-[#FAF7F2]/60">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8699] mb-1.5">
                            Demo Persona Switcher
                          </p>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                switchUser('user-maya');
                                setIsProfileMenuOpen(false);
                              }}
                              className={`flex-1 text-[11px] font-semibold py-1 px-2 rounded-lg border transition-all ${
                                currentUser.id === 'user-maya'
                                  ? 'bg-[#0E1A2B] text-white border-transparent'
                                  : 'bg-white text-[#3B4A5E] border-[#ECE6DC] hover:border-[#D9D0C3]'
                              }`}
                            >
                              Maya (Student)
                            </button>
                            <button
                              onClick={() => {
                                switchUser('user-admin');
                                setIsProfileMenuOpen(false);
                              }}
                              className={`flex-1 text-[11px] font-semibold py-1 px-2 rounded-lg border transition-all ${
                                currentUser.id === 'user-admin'
                                  ? 'bg-[#0E1A2B] text-white border-transparent'
                                  : 'bg-white text-[#3B4A5E] border-[#ECE6DC] hover:border-[#D9D0C3]'
                              }`}
                            >
                              Admin Team
                            </button>
                          </div>
                        </div>

                        {/* Log out */}
                        <div className="border-t border-[#ECE6DC] pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#E5484D] hover:bg-[#E5484D]/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Log out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-full border border-[#0E1A2B] bg-[#0E1A2B] text-white text-xs font-semibold hover:bg-[#3B4A5E] transition-all"
              >
                Log in
              </Link>
            )}

            {/* Mobile Post icon button */}
            <Link
              to="/post"
              className="sm:hidden p-2 rounded-full bg-sunrise text-white shadow-sm flex items-center justify-center"
              aria-label="Post a tip"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </Link>

            {/* Mobile Hamburger morphing into X */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#0E1A2B] hover:bg-[#ECE6DC]/50 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-[#0E1A2B] rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-[#0E1A2B] rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-[#0E1A2B] rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* 2px Sunrise scroll progress bar along bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden">
          <div
            className="h-full bg-sunrise transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-[#0E1A2B]/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 right-0 bottom-0 w-[82%] max-w-sm bg-[#FAF7F2] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Header: User Card or Login */}
                <div className="pb-5 border-b border-[#ECE6DC] mb-6">
                  {currentUser ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <SafeImage
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          aspectRatio="aspect-square"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-[#0E1A2B] truncate font-editorial">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-[#7A8699] truncate">
                          {currentUser.studyProgram}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0E1A2B] text-white">
                          {currentUser.role === 'admin' ? 'Campus Admin' : 'Verified Student'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      className="block w-full py-2.5 text-center rounded-xl bg-sunrise text-white font-bold text-sm shadow-md"
                    >
                      Student Log in
                    </Link>
                  )}
                </div>

                {/* Staggered Navigation Links */}
                <nav className="space-y-2">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between p-3 rounded-xl font-editorial text-xl font-semibold transition-colors ${
                          isActiveLink(link.path)
                            ? 'bg-white text-[#0E1A2B] shadow-xs'
                            : 'text-[#3B4A5E] hover:bg-white/60'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {link.color && (
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: link.color }}
                            />
                          )}
                          {link.name}
                        </span>
                        <span className="text-xs font-sans text-[#7A8699]">Explore</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Quick actions */}
                <div className="mt-6 pt-6 border-t border-[#ECE6DC] space-y-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white text-sm font-semibold text-[#0E1A2B] shadow-xs border border-[#ECE6DC]"
                  >
                    <Search className="w-4 h-4 text-[#7A8699]" />
                    <span>Search all campus tips</span>
                  </button>

                  {currentUser?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#0E1A2B] text-white text-sm font-semibold shadow-xs"
                    >
                      <ShieldAlert className="w-4 h-4 text-[#FF5F45]" />
                      <span>Admin Moderation Queue</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Bottom Footer in Menu */}
              <div className="pt-6 border-t border-[#ECE6DC]">
                {currentUser && (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E5484D]/30 text-[#E5484D] font-bold text-sm hover:bg-[#E5484D]/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                )}
                <p className="text-[11px] text-center text-[#7A8699] mt-3">
                  TipJar MVP Demo · University Student Union
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Bar (fixed under 768px) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-[#ECE6DC] shadow-lg pb-safe"
      >
        <div className="grid grid-cols-4 items-center h-16 px-2">
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 min-h-[44px] transition-colors ${
              location.pathname === '/' ? 'text-[#FF5F45]' : 'text-[#7A8699]'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Home</span>
          </Link>

          {/* Categories */}
          <Link
            to="/category/housing"
            className={`flex flex-col items-center justify-center py-1 min-h-[44px] transition-colors ${
              location.pathname.startsWith('/category') ? 'text-[#FF5F45]' : 'text-[#7A8699]'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Explore</span>
          </Link>

          {/* Post (+) Raised Gradient Button */}
          <Link
            to="/post"
            className="flex flex-col items-center justify-center -mt-5 min-h-[44px]"
            aria-label="Share a tip"
          >
            <div className="w-12 h-12 rounded-full bg-sunrise text-white flex items-center justify-center shadow-lg shadow-[#FF5F45]/30 active:scale-95 transition-transform">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-[#0E1A2B] mt-0.5">Post</span>
          </Link>

          {/* Profile */}
          <Link
            to={currentUser ? `/profile/${currentUser.id}` : '/auth'}
            className={`flex flex-col items-center justify-center py-1 min-h-[44px] transition-colors ${
              location.pathname.startsWith('/profile') || location.pathname === '/auth'
                ? 'text-[#FF5F45]'
                : 'text-[#7A8699]'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">
              {currentUser ? 'Profile' : 'Log in'}
            </span>
          </Link>
        </div>
      </nav>

      {/* Global Command Palette / Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
