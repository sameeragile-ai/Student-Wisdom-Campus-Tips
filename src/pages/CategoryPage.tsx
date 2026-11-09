import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  Home,
  BookOpen,
  Coffee,
  Filter,
  ArrowUpDown,
  Star,
  Clock,
  Flame,
  X,
  AlertCircle,
  Plus,
  BookMarked,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategorySlug, CourseSpotlight, Tip } from '../types';
import { TipCard } from '../components/TipCard';
import { COURSE_SPOTLIGHTS } from '../data/courses';
import {
  STUDY_PROGRAMS,
  COURSE_SUBTOPICS,
  HOUSING_SUBTOPICS,
  DAILY_LIFE_SUBTOPICS,
  HOUSING_NEIGHBORHOODS,
} from '../data/programs';
import { SafeImage } from '../components/SafeImage';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { tips } = useApp();

  const currentCategory: CategorySlug =
    slug === 'courses' || slug === 'daily-life' ? slug : 'housing';

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('All');
  const [selectedProgram, setSelectedProgram] = useState<string>('All Programs');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('All Neighborhoods');
  const [sortBy, setSortBy] = useState<'helpful' | 'newest' | 'updated'>('helpful');
  const [isLoading, setIsLoading] = useState(false);

  // Selected course spotlight drawer/modal
  const [activeCourseDrawer, setActiveCourseDrawer] = useState<CourseSpotlight | null>(null);

  // Category Configuration
  const metaConfig = {
    housing: {
      title: 'Housing & Dorms',
      subtitle: 'Shared flats, dorm waitlists, deposit rights & neighborhood guides.',
      color: '#FF6B4A',
      subtopics: HOUSING_SUBTOPICS,
      bannerImage: 'https://picsum.photos/seed/housing-category-banner/1200/400',
      icon: <Home className="w-6 h-6 text-[#FF6B4A]" />,
    },
    courses: {
      title: 'Courses & Academics',
      subtitle: 'Past exam patterns, syllabus breakdowns, study materials & professor secrets.',
      color: '#0E8F8A',
      subtopics: COURSE_SUBTOPICS,
      bannerImage: 'https://picsum.photos/seed/courses-category-banner/1200/400',
      icon: <BookOpen className="w-6 h-6 text-[#0E8F8A]" />,
    },
    'daily-life': {
      title: 'Daily Life & Budgeting',
      subtitle: 'Mensa food hacks, transit tickets, gym passes & student survival tips.',
      color: '#F2A93B',
      subtopics: DAILY_LIFE_SUBTOPICS,
      bannerImage: 'https://picsum.photos/seed/daily-category-banner/1200/400',
      icon: <Coffee className="w-6 h-6 text-[#F2A93B]" />,
    },
  }[currentCategory];

  // Simulate 450ms skeleton loader when changing category or subtopic
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [currentCategory, selectedSubtopic, sortBy, selectedProgram, selectedNeighborhood]);

  // Reset filters when switching main category
  useEffect(() => {
    setSearchQuery('');
    setSelectedSubtopic('All');
    setSelectedProgram('All Programs');
    setSelectedNeighborhood('All Neighborhoods');
    setActiveCourseDrawer(null);
  }, [currentCategory]);

  // Filter tips
  const categoryTips = tips.filter((tip) => tip.category === currentCategory);

  const filteredTips = categoryTips.filter((tip) => {
    // Subtopic filter
    if (selectedSubtopic !== 'All' && !selectedSubtopic.startsWith('All')) {
      if (tip.subtopic !== selectedSubtopic) return false;
    }

    // Program filter (Courses)
    if (currentCategory === 'courses' && selectedProgram !== 'All Programs') {
      if (tip.studyProgram !== selectedProgram) return false;
    }

    // Neighborhood filter (Housing)
    if (currentCategory === 'housing' && selectedNeighborhood !== 'All Neighborhoods') {
      if (tip.neighborhood !== selectedNeighborhood) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        tip.title.toLowerCase().includes(q) ||
        tip.text.toLowerCase().includes(q) ||
        (tip.courseCode && tip.courseCode.toLowerCase().includes(q)) ||
        (tip.neighborhood && tip.neighborhood.toLowerCase().includes(q)) ||
        tip.authorName.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Sorting
  const sortedTips = [...filteredTips].sort((a, b) => {
    if (sortBy === 'helpful') {
      return b.upvotes - a.upvotes;
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'updated') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return 0;
  });

  // Tips for the active course drawer
  const courseTips = activeCourseDrawer
    ? tips.filter(
        (t) =>
          t.category === 'courses' &&
          (t.courseCode === activeCourseDrawer.code ||
            t.title.includes(activeCourseDrawer.code) ||
            t.text.includes(activeCourseDrawer.code))
      )
    : [];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Category Banner Hero */}
      <section className="relative overflow-hidden bg-white border-b border-[#ECE6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] border border-[#ECE6DC]">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: metaConfig.color }}
                />
                <span className="capitalize">{currentCategory.replace('-', ' ')} Directory</span>
                <span className="text-[#7A8699]">·</span>
                <span className="tabular-nums font-bold text-[#0E1A2B]">
                  {categoryTips.length} tips
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-[#0E1A2B] tracking-tight">
                {metaConfig.title}
              </h1>

              <p className="text-base sm:text-lg text-[#3B4A5E] max-w-2xl leading-relaxed">
                {metaConfig.subtitle}
              </p>
            </div>

            {/* Quick Share Tip CTA for this category */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                to={`/post?category=${currentCategory}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-sunrise text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Post in {metaConfig.title.split(' ')[0]}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          COURSES SPECIAL: COURSE SPOTLIGHT ROW
          ======================================================== */}
      {currentCategory === 'courses' && (
        <section className="bg-[#FAF7F2] py-8 border-b border-[#ECE6DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold font-editorial text-[#0E1A2B] flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-[#0E8F8A]" />
                  <span>Course Spotlight: Key Modules</span>
                </h2>
                <p className="text-xs text-[#7A8699] mt-0.5">
                  Tap any course to inspect student difficulty, workload, and linked tips.
                </p>
              </div>
            </div>

            {/* Horizontal Course Spotlight Scroller */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
              {COURSE_SPOTLIGHTS.map((course) => (
                <button
                  key={course.code}
                  type="button"
                  onClick={() => setActiveCourseDrawer(course)}
                  className="w-72 shrink-0 p-4 rounded-2xl bg-white border border-[#ECE6DC] hover:border-[#0E8F8A] shadow-xs hover:shadow-md transition-all text-left snap-start group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#0E8F8A] px-2 py-0.5 rounded-md bg-[#0E8F8A]/10">
                      {course.code}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#F2A93B]">
                      <Star className="w-3.5 h-3.5 fill-[#F2A93B]" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold font-editorial text-[#0E1A2B] group-hover:text-[#0E8F8A] transition-colors line-clamp-1">
                    {course.name}
                  </h3>
                  <p className="text-[11px] text-[#7A8699] mt-0.5 line-clamp-1">
                    {course.studyProgram}
                  </p>

                  {/* Difficulty & Workload metrics */}
                  <div className="mt-3 pt-3 border-t border-[#ECE6DC]/60 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#7A8699] block text-[10px]">Difficulty</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <span
                            key={level}
                            className={`w-2.5 h-1.5 rounded-xs ${
                              level <= course.difficulty
                                ? 'bg-[#FF5F45]'
                                : 'bg-[#ECE6DC]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#7A8699] block text-[10px]">Workload</span>
                      <span className="font-semibold text-[#0E1A2B] tabular-nums">
                        {course.workload} hrs/wk
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-[#0E8F8A] font-semibold flex items-center justify-between">
                    <span>{course.tipsCount} tips posted</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          SEARCH & FILTER TOOLBAR
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl border border-[#ECE6DC] p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7A8699] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search within ${metaConfig.title}...`}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#ECE6DC] bg-[#FAF7F2]/60 focus:bg-white focus:outline-none focus:border-[#FF5F45] text-[#0E1A2B]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7A8699] hover:text-[#0E1A2B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Courses specific: Study Program Dropdown Filter */}
            {currentCategory === 'courses' && (
              <div className="w-full md:w-56 shrink-0">
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-[#ECE6DC] bg-white text-[#0E1A2B] focus:outline-none focus:border-[#0E8F8A]"
                >
                  <option value="All Programs">All Study Programs</option>
                  {STUDY_PROGRAMS.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Housing specific: Neighborhood filter */}
            {currentCategory === 'housing' && (
              <div className="w-full md:w-56 shrink-0">
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-[#ECE6DC] bg-white text-[#0E1A2B] focus:outline-none focus:border-[#FF6B4A]"
                >
                  <option value="All Neighborhoods">All Neighborhoods</option>
                  {HOUSING_NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Toggle (Most Helpful / Newest / Recently Updated) */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#ECE6DC] shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setSortBy('helpful')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  sortBy === 'helpful'
                    ? 'bg-white text-[#0E1A2B] shadow-xs'
                    : 'text-[#7A8699] hover:text-[#0E1A2B]'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#FF5F45]" />
                <span>Most Helpful</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  sortBy === 'newest'
                    ? 'bg-white text-[#0E1A2B] shadow-xs'
                    : 'text-[#7A8699] hover:text-[#0E1A2B]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Newest</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('updated')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  sortBy === 'updated'
                    ? 'bg-white text-[#0E1A2B] shadow-xs'
                    : 'text-[#7A8699] hover:text-[#0E1A2B]'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Updated</span>
              </button>
            </div>
          </div>

          {/* Subtopics Filter Chips */}
          <div className="pt-2 border-t border-[#ECE6DC]/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-[#7A8699] uppercase shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Subtopic:
            </span>
            {metaConfig.subtopics.map((sub) => {
              const isActive =
                selectedSubtopic === sub ||
                (selectedSubtopic === 'All' && sub.startsWith('All'));
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubtopic(sub.startsWith('All') ? 'All' : sub)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#0E1A2B] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#3B4A5E] hover:bg-[#ECE6DC]'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          TIPS LIST / GRID
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Results summary counter */}
        <div className="flex items-center justify-between text-xs text-[#7A8699] mb-6">
          <p>
            Showing <strong className="text-[#0E1A2B]">{sortedTips.length}</strong> tips in{' '}
            <span className="capitalize">{currentCategory.replace('-', ' ')}</span>
          </p>
          {(selectedSubtopic !== 'All' ||
            selectedProgram !== 'All Programs' ||
            selectedNeighborhood !== 'All Neighborhoods' ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedSubtopic('All');
                setSelectedProgram('All Programs');
                setSelectedNeighborhood('All Neighborhoods');
                setSearchQuery('');
              }}
              className="text-[#FF5F45] hover:underline font-semibold"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Shimmer Skeleton or Real Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-[20px] bg-white border border-[#ECE6DC] p-5 space-y-4 overflow-hidden"
              >
                <div className="aspect-[16/9] w-full rounded-xl animate-shimmer" />
                <div className="h-4 w-3/4 rounded-md animate-shimmer" />
                <div className="h-3 w-full rounded-md animate-shimmer" />
                <div className="h-3 w-5/6 rounded-md animate-shimmer" />
                <div className="pt-4 border-t border-[#ECE6DC] flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full animate-shimmer" />
                  <div className="w-16 h-8 rounded-full animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedTips.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center bg-white rounded-3xl border border-[#ECE6DC] p-8 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center mx-auto text-[#7A8699] mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-editorial text-[#0E1A2B]">
              No student tips found
            </h3>
            <p className="text-sm text-[#7A8699] mt-2 leading-relaxed">
              We couldn’t find tips matching your current filter criteria. Be the first to share advice for this topic!
            </p>
            <div className="mt-6">
              <Link
                to={`/post?category=${currentCategory}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunrise text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Submit first tip</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Staggered cards grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          COURSE DETAIL DRAWER (When course spotlight card clicked)
          ======================================================== */}
      <AnimatePresence>
        {activeCourseDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCourseDrawer(null)}
              className="fixed inset-0 bg-[#0E1A2B]/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#ECE6DC] flex flex-col overflow-hidden z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#ECE6DC] bg-[#FAF7F2] flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0E8F8A] mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#0E8F8A]/10">
                      {activeCourseDrawer.code}
                    </span>
                    <span>·</span>
                    <span className="text-[#3B4A5E]">{activeCourseDrawer.studyProgram}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-editorial text-[#0E1A2B]">
                    {activeCourseDrawer.name}
                  </h3>
                  <p className="text-xs text-[#3B4A5E] mt-1.5 leading-relaxed">
                    {activeCourseDrawer.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCourseDrawer(null)}
                  className="p-2 text-[#7A8699] hover:text-[#0E1A2B] rounded-full hover:bg-[#ECE6DC]/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Course Stats Metrics */}
              <div className="px-6 py-3 bg-white border-b border-[#ECE6DC] grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#7A8699] uppercase font-bold block">
                    Difficulty
                  </span>
                  <span className="text-base font-bold text-[#FF5F45] tabular-nums">
                    {activeCourseDrawer.difficulty} / 5
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A8699] uppercase font-bold block">
                    Workload
                  </span>
                  <span className="text-base font-bold text-[#0E1A2B] tabular-nums">
                    {activeCourseDrawer.workload} hrs/wk
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A8699] uppercase font-bold block">
                    Rating
                  </span>
                  <span className="text-base font-bold text-[#F2A93B] tabular-nums">
                    ★ {activeCourseDrawer.rating}
                  </span>
                </div>
              </div>

              {/* Linked Tips for this course */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <h4 className="text-sm font-bold text-[#0E1A2B] font-editorial flex items-center justify-between">
                  <span>Student Tips for {activeCourseDrawer.code}</span>
                  <span className="text-xs font-sans text-[#7A8699]">
                    {courseTips.length} tips
                  </span>
                </h4>

                {courseTips.length === 0 ? (
                  <p className="text-xs text-[#7A8699] py-8 text-center">
                    No specific tips logged yet for {activeCourseDrawer.code}. Be the first to share advice!
                  </p>
                ) : (
                  courseTips.map((tip) => (
                    <div
                      key={tip.id}
                      className="p-4 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs text-[#7A8699] mb-1">
                        <span className="font-semibold text-[#0E8F8A]">{tip.subtopic}</span>
                        <span className="tabular-nums font-bold text-[#FF5F45]">
                          ▲ {tip.upvotes}
                        </span>
                      </div>
                      <Link
                        to={`/tip/${tip.id}`}
                        onClick={() => setActiveCourseDrawer(null)}
                        className="text-base font-bold text-[#0E1A2B] hover:text-[#FF5F45] transition-colors font-editorial block"
                      >
                        {tip.title}
                      </Link>
                      <p className="text-xs text-[#3B4A5E] mt-1 line-clamp-2">
                        {tip.text}
                      </p>
                      <div className="mt-2 text-[10px] text-[#7A8699] flex items-center gap-1.5">
                        <span>By {tip.authorName}</span> · <span>{tip.authorProgram}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-[#FAF7F2] border-t border-[#ECE6DC] flex items-center justify-between">
                <span className="text-xs text-[#7A8699]">
                  Have a syllabus hint for {activeCourseDrawer.code}?
                </span>
                <Link
                  to={`/post?category=courses&courseCode=${activeCourseDrawer.code}`}
                  onClick={() => setActiveCourseDrawer(null)}
                  className="px-4 py-2 rounded-full bg-sunrise text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
                >
                  Post Tip for {activeCourseDrawer.code}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
