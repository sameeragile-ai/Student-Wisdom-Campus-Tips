import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Home,
  BookOpen,
  Coffee,
  Sparkles,
  ArrowRight,
  Eye,
  PenTool,
  AlertCircle,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategorySlug, Tip } from '../types';
import {
  STUDY_PROGRAMS,
  HOUSING_SUBTOPICS,
  COURSE_SUBTOPICS,
  DAILY_LIFE_SUBTOPICS,
  HOUSING_NEIGHBORHOODS,
} from '../data/programs';
import { TipCard } from '../components/TipCard';
import { fireCelebrationConfetti } from '../utils/confetti';

export function PostTipPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, createTip, showToast } = useApp();

  // URL query params pre-population (e.g. ?category=courses&courseCode=CS101)
  const queryCategory = searchParams.get('category') as CategorySlug | null;
  const queryCourseCode = searchParams.get('courseCode') || '';

  const initialCat: CategorySlug =
    queryCategory === 'housing' || queryCategory === 'courses' || queryCategory === 'daily-life'
      ? queryCategory
      : 'courses';

  // Form Fields
  const [category, setCategory] = useState<CategorySlug>(initialCat);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [studyProgram, setStudyProgram] = useState(
    currentUser?.studyProgram || 'Computer Science'
  );
  const [courseCode, setCourseCode] = useState(queryCourseCode);
  const [courseName, setCourseName] = useState('');
  const [price, setPrice] = useState('');
  const [neighborhood, setNeighborhood] = useState(HOUSING_NEIGHBORHOODS[0]);
  const [difficulty, setDifficulty] = useState(3);
  const [workload, setWorkload] = useState('8 hrs/week');

  const [coverImageSeed, setCoverImageSeed] = useState(`campus-tip-${Date.now() % 1000}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Subtopics based on category
  const subtopicOptions = {
    housing: HOUSING_SUBTOPICS.filter((s) => !s.startsWith('All')),
    courses: COURSE_SUBTOPICS.filter((s) => !s.startsWith('All')),
    'daily-life': DAILY_LIFE_SUBTOPICS.filter((s) => !s.startsWith('All')),
  }[category];

  useEffect(() => {
    setSubtopic(subtopicOptions[0]);
  }, [category]);

  // Live preview Tip mock object
  const previewTip: Tip = {
    id: 'preview-tip',
    title: title.trim() || 'Your Tip Headline Will Appear Here...',
    text:
      text.trim() ||
      'Write your specific, practical advice here. Mention concrete tips, times, links, or numbers that fellow students can rely on.',
    category,
    subtopic: subtopic || subtopicOptions[0],
    studyProgram,
    courseCode: category === 'courses' && courseCode ? courseCode.toUpperCase() : undefined,
    courseName: category === 'courses' && courseName ? courseName : undefined,
    authorId: currentUser?.id || 'guest',
    authorName: currentUser?.name || 'You (Verified Student)',
    authorAvatar: currentUser?.avatar || 'https://i.pravatar.cc/150?img=47',
    authorProgram: studyProgram,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    upvotes: 1,
    coverImage: `https://picsum.photos/seed/${coverImageSeed}/800/500`,
    price: price.trim() || undefined,
    neighborhood: category === 'housing' ? neighborhood : undefined,
    difficulty: category === 'courses' ? difficulty : undefined,
    workload: category === 'courses' ? workload : undefined,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Please log in with your university account to post.', 'error');
      navigate('/auth');
      return;
    }

    if (!title.trim() || title.trim().length < 10) {
      showToast('Title must be at least 10 characters long.', 'warning');
      return;
    }

    if (!text.trim() || text.trim().length < 30) {
      showToast('Please provide at least 30 characters of practical advice.', 'warning');
      return;
    }

    setIsSubmitting(true);

    // Realistic submit delay
    setTimeout(() => {
      const newTipId = createTip({
        title: title.trim(),
        text: text.trim(),
        category,
        subtopic: subtopic || subtopicOptions[0],
        studyProgram,
        courseCode: category === 'courses' && courseCode ? courseCode.trim().toUpperCase() : undefined,
        courseName: category === 'courses' && courseName ? courseName.trim() : undefined,
        price: price.trim() || undefined,
        neighborhood: category === 'housing' ? neighborhood : undefined,
        difficulty: category === 'courses' ? difficulty : undefined,
        workload: category === 'courses' ? workload : undefined,
        coverImage: `https://picsum.photos/seed/${coverImageSeed}/800/500`,
      });

      setIsSubmitting(false);

      // Fire festive celebration confetti!
      fireCelebrationConfetti();

      // Navigate to the newly published tip
      navigate(`/tip/${newTipId}`);
    }, 600);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#ECE6DC] text-[#FF5F45] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Wisdom Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-[#0E1A2B] tracking-tight">
            Share a practical campus tip
          </h1>
          <p className="text-sm text-[#7A8699] mt-1.5">
            Help freshmen and peers avoid pitfalls. Keep advice specific, accurate, and actionable.
          </p>
        </div>

        {/* Not Logged In Warning Banner */}
        {!currentUser && (
          <div className="mb-8 p-4 rounded-2xl bg-[#FAF7F2] border border-[#FF6B4A]/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#FF6B4A] shrink-0" />
              <p className="text-xs sm:text-sm text-[#0E1A2B]">
                <strong>Student login required:</strong> You can draft your tip below, but you'll need to log in with an authorized <code className="text-[#FF5F45]">@student.uni.edu</code> email to publish.
              </p>
            </div>
            <Link
              to="/auth"
              className="px-4 py-2 rounded-xl bg-[#0E1A2B] text-white text-xs font-bold hover:bg-[#3B4A5E] transition-colors shrink-0"
            >
              Log in now
            </Link>
          </div>
        )}

        {/* Mobile Tab Switcher (Editor vs Live Preview) */}
        <div className="lg:hidden flex items-center gap-2 p-1 bg-white rounded-2xl border border-[#ECE6DC] mb-6 shadow-xs">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mobileTab === 'editor'
                ? 'bg-[#0E1A2B] text-white shadow-xs'
                : 'text-[#7A8699] hover:text-[#0E1A2B]'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Write Tip</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mobileTab === 'preview'
                ? 'bg-sunrise text-white shadow-xs'
                : 'text-[#7A8699] hover:text-[#0E1A2B]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Grid: Editor (Left) & Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ===================================================
              FORM EDITOR (7 cols)
              =================================================== */}
          <div
            className={`lg:col-span-7 bg-white rounded-3xl border border-[#ECE6DC] p-6 sm:p-8 shadow-sm ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Segmented Control */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A8699] mb-2">
                  Select Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('housing')}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      category === 'housing'
                        ? 'bg-[#FF6B4A]/10 border-[#FF6B4A] text-[#FF6B4A] shadow-xs'
                        : 'border-[#ECE6DC] bg-[#FAF7F2] text-[#3B4A5E] hover:border-[#D9D0C3]'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span>Housing</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('courses')}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      category === 'courses'
                        ? 'bg-[#0E8F8A]/10 border-[#0E8F8A] text-[#0E8F8A] shadow-xs'
                        : 'border-[#ECE6DC] bg-[#FAF7F2] text-[#3B4A5E] hover:border-[#D9D0C3]'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Courses</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('daily-life')}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      category === 'daily-life'
                        ? 'bg-[#F2A93B]/10 border-[#F2A93B] text-[#D98200] shadow-xs'
                        : 'border-[#ECE6DC] bg-[#FAF7F2] text-[#3B4A5E] hover:border-[#D9D0C3]'
                    }`}
                  >
                    <Coffee className="w-5 h-5" />
                    <span>Daily Life</span>
                  </button>
                </div>
              </div>

              {/* Subtopic & Study Program */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1A2B] mb-1.5">
                    Subtopic Area
                  </label>
                  <select
                    value={subtopic}
                    onChange={(e) => setSubtopic(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs font-semibold rounded-xl border border-[#ECE6DC] bg-white focus:outline-none focus:border-[#0E1A2B]"
                  >
                    {subtopicOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1A2B] mb-1.5">
                    Your Study Program
                  </label>
                  <select
                    value={studyProgram}
                    onChange={(e) => setStudyProgram(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs font-semibold rounded-xl border border-[#ECE6DC] bg-white focus:outline-none focus:border-[#0E1A2B]"
                  >
                    {STUDY_PROGRAMS.map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category-Specific fields */}
              {category === 'courses' && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0E1A2B] mb-1">
                        Course Code (e.g. CS101, ECO210):
                      </label>
                      <input
                        type="text"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        placeholder="CS101"
                        className="w-full p-2.5 text-xs font-semibold uppercase rounded-xl border border-[#ECE6DC] bg-white focus:outline-none focus:border-[#0E8F8A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0E1A2B] mb-1">
                        Weekly Workload:
                      </label>
                      <input
                        type="text"
                        value={workload}
                        onChange={(e) => setWorkload(e.target.value)}
                        placeholder="e.g. 10 hrs/week"
                        className="w-full p-2.5 text-xs rounded-xl border border-[#ECE6DC] bg-white focus:outline-none focus:border-[#0E8F8A]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'housing' && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0E1A2B] mb-1">
                        Neighborhood:
                      </label>
                      <select
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full p-2.5 text-xs font-semibold rounded-xl border border-[#ECE6DC] bg-white focus:outline-none focus:border-[#FF6B4A]"
                      >
                        {HOUSING_NEIGHBORHOODS.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0E1A2B] mb-1">
                        Price or Deposit Mock Tag:
                      </label>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. Shared flat · €420/mo"
                        className="w-full p-2.5 text-xs rounded-xl border border-[#ECE6DC] bg-white focus:outline-none focus:border-[#FF6B4A]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'daily-life' && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC]">
                  <label className="block text-[11px] font-bold text-[#0E1A2B] mb-1">
                    Price Tag or Savings Figure (optional):
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. Canteen lunch · €1.50 or Semester pass · €189"
                    className="w-full p-2.5 text-xs rounded-xl border border-[#ECE6DC] bg-white focus:outline-none focus:border-[#F2A93B]"
                  />
                </div>
              )}

              {/* Title input with character counter (max 100) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#0E1A2B]">
                    Tip Title / Summary <span className="text-[#FF5F45]">*</span>
                  </label>
                  <span
                    className={`text-[11px] tabular-nums font-semibold ${
                      title.length > 90 ? 'text-[#FF5F45]' : 'text-[#7A8699]'
                    }`}
                  >
                    {title.length} / 100
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apply for the student dorm waitlist BEFORE your acceptance letter"
                  className="w-full p-3 text-sm rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#FF5F45] text-[#0E1A2B] font-editorial"
                  required
                />
              </div>

              {/* Description textarea with character counter (max 1000) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#0E1A2B]">
                    The Advice Details <span className="text-[#FF5F45]">*</span>
                  </label>
                  <span
                    className={`text-[11px] tabular-nums font-semibold ${
                      text.length > 900 ? 'text-[#FF5F45]' : 'text-[#7A8699]'
                    }`}
                  >
                    {text.length} / 1000
                  </span>
                </div>
                <textarea
                  rows={5}
                  maxLength={1000}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Provide concrete steps: where to go, what time to arrive, which links or rooms to look for, and why this saves time or money..."
                  className="w-full p-3 text-sm rounded-xl border border-[#ECE6DC] focus:outline-none focus:border-[#FF5F45] text-[#0E1A2B] leading-relaxed"
                  required
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[#ECE6DC] flex items-center justify-between gap-4">
                <span className="text-xs text-[#7A8699]">
                  Tip will be posted under your verified account.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-full bg-sunrise text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <span>Post Campus Tip</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ===================================================
              LIVE PREVIEW CARD (5 cols)
              =================================================== */}
          <div
            className={`lg:col-span-5 sticky top-28 space-y-4 ${
              mobileTab === 'editor' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A8699] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#0EA5A0]" />
                Live Card Preview
              </span>
              <span className="text-[11px] text-[#7A8699]">Updates as you type</span>
            </div>

            {/* Live rendered TipCard */}
            <div className="pointer-events-none select-none">
              <TipCard tip={previewTip} />
            </div>

            {/* Quality Advice Tip Card */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DC] space-y-2 text-xs text-[#3B4A5E]">
              <p className="font-bold text-[#0E1A2B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5F45]" />
                <span>Tips that get the most upvotes:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#7A8699] leading-relaxed">
                <li>Include exact prices, office hours, or room numbers</li>
                <li>Avoid vague generalities like "study hard"</li>
                <li>Share hacks discovered after making an initial mistake</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
