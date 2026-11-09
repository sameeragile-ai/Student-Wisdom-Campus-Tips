import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle, Calendar, GraduationCap, MapPin, Tag } from 'lucide-react';
import { Tip } from '../types';
import { formatRelativeTime } from '../utils/date';
import { SafeImage } from './SafeImage';
import { UpvoteButton } from './UpvoteButton';
import { useApp } from '../context/AppContext';

interface TipCardProps {
  tip: Tip;
  viewMode?: 'standard' | 'compact';
}

export function TipCard({ tip, viewMode = 'standard' }: TipCardProps) {
  const { userVotes, toggleUpvote, hasOpenReport } = useApp();
  const hasVoted = userVotes.includes(tip.id);
  const isFlagged = hasOpenReport(tip.id);

  // Category styling
  const categoryConfig = {
    housing: {
      name: 'Housing',
      color: '#FF6B4A',
      bgColor: 'bg-[#FF6B4A]/10 text-[#FF6B4A]',
      borderColor: 'border-[#FF6B4A]/30',
    },
    courses: {
      name: 'Courses',
      color: '#0E8F8A',
      bgColor: 'bg-[#0E8F8A]/10 text-[#0E8F8A]',
      borderColor: 'border-[#0E8F8A]/30',
    },
    'daily-life': {
      name: 'Daily Life',
      color: '#F2A93B',
      bgColor: 'bg-[#F2A93B]/10 text-[#D98200]',
      borderColor: 'border-[#F2A93B]/30',
    },
  }[tip.category] || {
    name: 'General',
    color: '#0E8F8A',
    bgColor: 'bg-slate-100 text-slate-700',
    borderColor: 'border-slate-200',
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex flex-col justify-between bg-white rounded-[20px] border border-[#ECE6DC] shadow-[0_2px_8px_rgba(14,26,43,0.04)] hover:shadow-[0_12px_28px_rgba(14,26,43,0.08)] transition-all duration-300 overflow-hidden"
    >
      {/* Top Media slot with SafeImage */}
      <div className="relative">
        <Link to={`/tip/${tip.id}`} className="block overflow-hidden" tabIndex={-1}>
          <SafeImage
            src={tip.coverImage}
            alt={tip.title}
            aspectRatio="aspect-[16/9]"
            className="group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Floating Category and Price row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide backdrop-blur-md bg-white/95 shadow-sm border ${categoryConfig.borderColor} text-[#0E1A2B]`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full mr-1.5"
              style={{ backgroundColor: categoryConfig.color }}
            />
            {categoryConfig.name}
          </span>

          {tip.price && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md bg-[#0E1A2B]/90 text-white shadow-sm tabular-nums">
              {tip.price}
            </span>
          )}
        </div>
      </div>

      {/* Flagged report banner if under review */}
      {isFlagged && (
        <div className="px-4 py-1.5 bg-[#FFF4E5] border-b border-[#F2A93B]/30 flex items-center gap-1.5 text-[11px] font-medium text-[#B76E00]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#F2A93B]" />
          <span>Flagged by students for moderation</span>
        </div>
      )}

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line: subtopic & date */}
          <div className="flex items-center gap-2 text-xs text-[#7A8699] font-medium mb-2.5 flex-wrap">
            <span className="text-[#3B4A5E] font-medium">{tip.subtopic}</span>
            <span aria-hidden="true">·</span>
            <span>{formatRelativeTime(tip.updatedAt || tip.createdAt)}</span>
            {tip.neighborhood && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#7A8699]" />
                  {tip.neighborhood}
                </span>
              </>
            )}
            {tip.courseCode && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#0E8F8A]">{tip.courseCode}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold font-editorial text-[#0E1A2B] group-hover:text-[#FF5F45] transition-colors line-clamp-2 leading-snug tracking-tight mb-2">
            <Link to={`/tip/${tip.id}`} className="focus:outline-none focus:underline">
              {tip.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-[#3B4A5E] line-clamp-2 leading-relaxed mb-4">
            {tip.text}
          </p>
        </div>

        {/* Card Footer: Author & Upvote */}
        <div className="pt-4 border-t border-[#ECE6DC]/80 flex items-center justify-between gap-3 mt-auto">
          {/* Author avatar & info */}
          <Link
            to={`/profile/${tip.authorId}`}
            className="flex items-center gap-2.5 min-w-0 group/author"
            title={`View ${tip.authorName}'s profile`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#ECE6DC]">
              <SafeImage
                src={tip.authorAvatar}
                alt={tip.authorName}
                aspectRatio="aspect-square"
                fallbackInitials={tip.authorName}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#0E1A2B] truncate group-hover/author:text-[#FF5F45] transition-colors">
                {tip.authorName}
              </p>
              <p className="text-[11px] text-[#7A8699] truncate">
                {tip.authorProgram}
              </p>
            </div>
          </Link>

          {/* Upvote Button */}
          <div className="shrink-0">
            <UpvoteButton
              tipId={tip.id}
              count={tip.upvotes}
              hasVoted={hasVoted}
              onToggle={() => toggleUpvote(tip.id)}
              size="sm"
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
