import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  TrendingUp,
  Compass,
  CheckCircle,
  ThumbsUp,
  Share2,
  Users,
  Award,
  Sparkles,
  Home,
  BookOpen,
  Coffee,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TipCard } from '../components/TipCard';
import { SafeImage } from '../components/SafeImage';

export function LandingPage() {
  const { tips } = useApp();

  // Top 6 trending tips by upvotes
  const trendingTips = [...tips].sort((a, b) => b.upvotes - a.upvotes).slice(0, 6);

  // Category counts
  const housingCount = tips.filter((t) => t.category === 'housing').length;
  const coursesCount = tips.filter((t) => t.category === 'courses').length;
  const dailyLifeCount = tips.filter((t) => t.category === 'daily-life').length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* ========================================================
          1. HERO SECTION
          ======================================================== */}
      <section className="relative overflow-hidden pt-6 pb-20 lg:pt-12 lg:pb-32">
        {/* Ambient blurred backdrop blobs */}
        <div
          className="absolute -top-24 -left-20 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #FF5F45 0%, #FFC04D 70%, transparent 100%)',
          }}
        />
        <div
          className="absolute top-1/3 -right-20 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #0EA5A0 0%, #22C3B5 70%, transparent 100%)',
          }}
        />
        <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy Column (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Pill kicker */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#ECE6DC] shadow-xs text-xs font-semibold text-[#0E1A2B]">
                <span className="w-2 h-2 rounded-full bg-sunrise" />
                <span>The Community Student Handbook</span>
                <span className="text-[#7A8699]">·</span>
                <span className="text-[#0EA5A0] font-bold">100% Peer Verified</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-editorial text-[#0E1A2B] tracking-tight leading-[1.12] text-balance">
                The campus wisdom you wish you had on{' '}
                <span className="text-sunrise font-extrabold italic">day one.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-[#3B4A5E] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Real tips from university students who’ve already navigated the housing crunch, tough exam formats, and daily student survival. Upvoted by usefulness, updated constantly.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  to="/category/housing"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-sunrise text-white font-bold text-sm shadow-lg shadow-[#FF5F45]/25 hover:shadow-xl hover:shadow-[#FF5F45]/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Browse campus tips</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <Link
                  to="/post"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white border border-[#ECE6DC] hover:border-[#D9D0C3] text-[#0E1A2B] font-bold text-sm shadow-xs hover:bg-[#FAF7F2] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Share a tip</span>
                </Link>
              </div>

              {/* Social Proof Row: 5 overlapping avatars + Trusted by 2,400+ students */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2.5 overflow-hidden">
                  {[47, 12, 32, 15, 49].map((id) => (
                    <img
                      key={id}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-[#FAF7F2] object-cover"
                      src={`https://i.pravatar.cc/150?img=${id}`}
                      alt="Student contributor"
                      loading="lazy"
                    />
                  ))}
                </div>
                <div className="text-xs text-[#3B4A5E]">
                  <span className="font-bold text-[#0E1A2B]">Trusted by 2,400+ students</span>
                  <span className="text-[#7A8699] block text-[11px]">across 42 study programs</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual: Floating Layered Composition (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                {/* Background Campus Photo Frame */}
                <div className="absolute inset-4 rounded-[28px] overflow-hidden shadow-xl border-4 border-white rotate-2 transition-transform duration-700 hover:rotate-0">
                  <SafeImage
                    src="https://picsum.photos/seed/campus-library-hero/800/800"
                    alt="University Campus Library"
                    aspectRatio="aspect-square"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/70 via-transparent to-transparent" />
                </div>

                {/* Floating Card 1: CS101 Tip (Rotated top-left) */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
                  className="absolute -top-3 -left-4 sm:-left-6 w-64 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#ECE6DC] -rotate-3 hover:rotate-0 transition-transform"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold">
                    <span className="text-[#0E8F8A]">Courses · CS101</span>
                    <span className="tabular-nums text-[#FF5F45] font-bold">▲ 240 upvotes</span>
                  </div>
                  <p className="text-xs font-bold text-[#0E1A2B] font-editorial line-clamp-2 leading-snug">
                    "Old exams in the library archive are 80% similar to the final."
                  </p>
                  <p className="text-[10px] text-[#7A8699] mt-1.5 flex items-center gap-1">
                    <span>By Maya Chen</span> · <span>3rd yr CS</span>
                  </p>
                </motion.div>

                {/* Floating Card 2: Dorm Waitlist Tip (Rotated bottom-right) */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 0.8 }}
                  className="absolute -bottom-4 -right-3 sm:-right-6 w-68 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#ECE6DC] rotate-3 hover:rotate-0 transition-transform"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold">
                    <span className="text-[#FF6B4A]">Housing · €350/mo</span>
                    <span className="tabular-nums text-[#FF5F45] font-bold">▲ 214 upvotes</span>
                  </div>
                  <p className="text-xs font-bold text-[#0E1A2B] font-editorial line-clamp-2 leading-snug">
                    "Apply for the student dorm waitlist BEFORE your final admission."
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A] font-semibold">
                      Verified Tip
                    </span>
                    <span className="text-[10px] text-[#7A8699]">Munich & Berlin</span>
                  </div>
                </motion.div>

                {/* Floating Bubble: "+128 upvotes this week" */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="absolute top-1/2 -right-4 bg-[#0E1A2B] text-white px-3.5 py-2 rounded-full shadow-lg border border-white/20 text-xs font-bold flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0EA5A0] animate-pulse" />
                  <span className="tabular-nums">+128</span>
                  <span className="text-[#ECE6DC] font-normal text-[11px]">votes today</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. ANIMATED COUNT-UP STATS STRIP
          ======================================================== */}
      <section className="border-y border-[#ECE6DC] bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-editorial text-[#0E1A2B] tabular-nums tracking-tight">
                1,280+
              </p>
              <p className="text-xs sm:text-sm font-medium text-[#7A8699]">
                Practical tips shared
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-editorial text-[#FF5F45] tabular-nums tracking-tight">
                18,400+
              </p>
              <p className="text-xs sm:text-sm font-medium text-[#7A8699]">
                Helpful upvotes cast
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-editorial text-[#0E8F8A] tabular-nums tracking-tight">
                42
              </p>
              <p className="text-xs sm:text-sm font-medium text-[#7A8699]">
                Faculty study programs
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-editorial text-[#0E1A2B] tabular-nums tracking-tight">
                96%
              </p>
              <p className="text-xs sm:text-sm font-medium text-[#7A8699]">
                Find tips high value
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. BIG THREE CATEGORY CARDS
          ======================================================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#0E1A2B] tracking-tight">
              Explore by campus pillar
            </h2>
            <p className="text-sm sm:text-base text-[#7A8699] mt-2">
              Three essential categories where real senior advice makes all the difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Housing Card */}
            <Link
              to="/category/housing"
              className="group relative rounded-[24px] bg-white border border-[#ECE6DC] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SafeImage
                  src="https://picsum.photos/seed/student-apartment-warm/800/500"
                  alt="Student housing & shared flats"
                  aspectRatio="aspect-[16/10]"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF6B4A] text-white shadow-md">
                    Housing
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-editorial text-[#0E1A2B] group-hover:text-[#FF6B4A] transition-colors">
                    Dorms & Shared Flats
                  </h3>
                  <p className="text-sm text-[#3B4A5E] mt-2 line-clamp-3 leading-relaxed">
                    Avoid deposit scams, win WG interviews, bypass waitlists, and locate budget-friendly student neighborhoods.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#ECE6DC] flex items-center justify-between text-xs font-semibold text-[#7A8699]">
                  <span className="tabular-nums">{housingCount} verified tips</span>
                  <span className="text-[#FF6B4A] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* 2. Courses Card */}
            <Link
              to="/category/courses"
              className="group relative rounded-[24px] bg-white border border-[#ECE6DC] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SafeImage
                  src="https://picsum.photos/seed/lecture-hall-notes/800/500"
                  alt="University lecture and exams"
                  aspectRatio="aspect-[16/10]"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0E8F8A] text-white shadow-md">
                    Courses
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-editorial text-[#0E1A2B] group-hover:text-[#0E8F8A] transition-colors">
                    Courses & Exam Prep
                  </h3>
                  <p className="text-sm text-[#3B4A5E] mt-2 line-clamp-3 leading-relaxed">
                    Unwritten syllabus secrets, past exam archives, workload pacing, professor habits, and course selection guides.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#ECE6DC] flex items-center justify-between text-xs font-semibold text-[#7A8699]">
                  <span className="tabular-nums">{coursesCount} verified tips</span>
                  <span className="text-[#0E8F8A] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* 3. Daily Life Card */}
            <Link
              to="/category/daily-life"
              className="group relative rounded-[24px] bg-white border border-[#ECE6DC] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SafeImage
                  src="https://picsum.photos/seed/campus-coffee-lifestyle/800/500"
                  alt="Student daily life & budgeting"
                  aspectRatio="aspect-[16/10]"
                  className="group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F2A93B] text-white shadow-md">
                    Daily Life
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-editorial text-[#0E1A2B] group-hover:text-[#F2A93B] transition-colors">
                    Daily Life & Budgeting
                  </h3>
                  <p className="text-sm text-[#3B4A5E] mt-2 line-clamp-3 leading-relaxed">
                    Mensa canteen hacks, cheap transit passes, student bank accounts, gym memberships, and mental health resources.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#ECE6DC] flex items-center justify-between text-xs font-semibold text-[#7A8699]">
                  <span className="tabular-nums">{dailyLifeCount} verified tips</span>
                  <span className="text-[#F2A93B] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. TRENDING THIS WEEK (Top 6 Tips)
          ======================================================== */}
      <section className="py-16 bg-[#FAF7F2] border-t border-[#ECE6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF5F45]">
                <TrendingUp className="w-4 h-4" />
                <span>Ranked by student upvotes</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#0E1A2B] tracking-tight mt-1">
                Trending this week
              </h2>
            </div>
            <Link
              to="/category/housing"
              className="text-xs sm:text-sm font-bold text-[#FF5F45] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View all tips</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tips Grid (Responsive: horizontal scroll on mobile, 3-col grid on desktop) */}
          <div className="flex overflow-x-auto pb-4 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x">
            {trendingTips.map((tip) => (
              <div
                key={tip.id}
                className="w-[290px] sm:w-[340px] md:w-auto shrink-0 snap-start flex flex-col"
              >
                <TipCard tip={tip} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. HOW IT WORKS (3 Steps)
          ======================================================== */}
      <section className="py-20 bg-white border-t border-[#ECE6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0EA5A0]">
              The Campus Cycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#0E1A2B] tracking-tight mt-1">
              How TipJar works
            </h2>
            <p className="text-sm text-[#7A8699] mt-2">
              Three simple steps to keep practical student knowledge alive and vetted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="p-8 rounded-[24px] bg-[#FAF7F2] border border-[#ECE6DC] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#ECE6DC] flex items-center justify-center text-[#FF5F45] shadow-xs">
                <Compass className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#7A8699] uppercase tracking-wider">
                01. Discover
              </span>
              <h3 className="text-xl font-bold font-editorial text-[#0E1A2B]">
                Browse real student tips
              </h3>
              <p className="text-sm text-[#3B4A5E] leading-relaxed">
                Filter by course code, faculty, neighborhood, or topic. Read verified advice without paywalls, sponsored fluff, or marketing spin.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-[24px] bg-[#FAF7F2] border border-[#ECE6DC] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#ECE6DC] flex items-center justify-center text-[#0EA5A0] shadow-xs">
                <ThumbsUp className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#7A8699] uppercase tracking-wider">
                02. Vote
              </span>
              <h3 className="text-xl font-bold font-editorial text-[#0E1A2B]">
                Upvote what helped you
              </h3>
              <p className="text-sm text-[#3B4A5E] leading-relaxed">
                One vote per student per tip. Upvotes push the most accurate, life-saving advice to the top of your faculty feed.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-[24px] bg-[#FAF7F2] border border-[#ECE6DC] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#ECE6DC] flex items-center justify-center text-[#F2A93B] shadow-xs">
                <Share2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-[#7A8699] uppercase tracking-wider">
                03. Contribute
              </span>
              <h3 className="text-xl font-bold font-editorial text-[#0E1A2B]">
                Pass on your wisdom
              </h3>
              <p className="text-sm text-[#3B4A5E] leading-relaxed">
                Just learned a professor’s grading quirk or found a secret study room? Share it in 2 minutes and earn peer contributor status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. TESTIMONIALS SECTION
          ======================================================== */}
      <section className="py-20 bg-[#FAF7F2] border-t border-[#ECE6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5F45]">
              Real Student Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#0E1A2B] tracking-tight mt-1">
              "Saved me hundreds of euros and weeks of stress"
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-[22px] bg-white border border-[#ECE6DC] shadow-sm flex flex-col justify-between">
              <p className="text-sm text-[#0E1A2B] leading-relaxed italic">
                "The tip about registering for the student dorm waitlist before final admission is the only reason I have a room for €350 instead of renting a €900 studio."
              </p>
              <div className="mt-6 pt-4 border-t border-[#ECE6DC] flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Lucas Moreau"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#0E1A2B]">Lucas Moreau</h4>
                  <p className="text-[11px] text-[#7A8699]">Business Administration · 2nd Year</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-[22px] bg-white border border-[#ECE6DC] shadow-sm flex flex-col justify-between">
              <p className="text-sm text-[#0E1A2B] leading-relaxed italic">
                "Prof. Martins' exam hint tip in BUS220 was 100% accurate. Saved me during revision week when I was drowning in 5 midterms."
              </p>
              <div className="mt-6 pt-4 border-t border-[#ECE6DC] flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/150?img=47"
                  alt="Maya Chen"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#0E1A2B]">Maya Chen</h4>
                  <p className="text-[11px] text-[#7A8699]">Computer Science · 3rd Year</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-[22px] bg-white border border-[#ECE6DC] shadow-sm flex flex-col justify-between">
              <p className="text-sm text-[#0E1A2B] leading-relaxed italic">
                "The Mensa €1.50 late lunch hack has cut my monthly grocery spending in half. TipJar is the first thing I recommend to international freshers."
              </p>
              <div className="mt-6 pt-4 border-t border-[#ECE6DC] flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/150?img=45"
                  alt="Priya Sharma"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#0E1A2B]">Priya Sharma</h4>
                  <p className="text-[11px] text-[#7A8699]">International Relations · Master</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FINAL GRADIENT CTA BAND
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-6">
        <div className="relative rounded-[32px] bg-sunrise p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
          {/* Subtle decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white">
              Join the student collective
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial tracking-tight text-white leading-tight">
              Got a tip that saved your semester? Put it in the jar.
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Every tip you contribute helps hundreds of fellow students save money, study smarter, and avoid painful mistakes.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/post"
                className="px-7 py-3.5 rounded-full bg-[#0E1A2B] text-white text-center font-bold text-sm shadow-lg hover:bg-[#3B4A5E] transition-all"
              >
                Post your tip in 2 minutes
              </Link>
              <Link
                to="/auth"
                className="px-7 py-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-center font-bold text-sm backdrop-blur-md transition-all border border-white/30"
              >
                Login with student email
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
