import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, BookOpen, Home, Coffee, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tip } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { tips } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Escape to close, Cmd+K / Ctrl+K to toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered tips
  const filteredTips = tips.filter((tip) => {
    const matchesCategory =
      selectedCategory === 'all' || tip.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      tip.title.toLowerCase().includes(q) ||
      tip.text.toLowerCase().includes(q) ||
      tip.subtopic.toLowerCase().includes(q) ||
      (tip.courseCode && tip.courseCode.toLowerCase().includes(q)) ||
      (tip.courseName && tip.courseName.toLowerCase().includes(q)) ||
      (tip.neighborhood && tip.neighborhood.toLowerCase().includes(q)) ||
      (tip.studyProgram && tip.studyProgram.toLowerCase().includes(q))
    );
  });

  const handleSelectTip = (tipId: string) => {
    onClose();
    navigate(`/tip/${tipId}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0E1A2B]/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#ECE6DC] overflow-hidden z-10"
        >
          {/* Top Search Input */}
          <div className="p-4 border-b border-[#ECE6DC] flex items-center gap-3 bg-[#FAF7F2]/50">
            <Search className="w-5 h-5 text-[#7A8699] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tips, courses (e.g. CS101), dorms, budget hacks..."
              className="w-full bg-transparent text-base sm:text-lg text-[#0E1A2B] placeholder-[#7A8699] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-[#7A8699] hover:text-[#0E1A2B] hover:bg-[#ECE6DC]/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold px-2 py-1 rounded bg-[#ECE6DC] text-[#3B4A5E] hover:bg-[#D9D0C3] transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="px-4 py-2.5 border-b border-[#ECE6DC] flex items-center gap-1.5 overflow-x-auto text-xs bg-white">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#0E1A2B] text-white'
                  : 'bg-[#FAF7F2] text-[#3B4A5E] hover:bg-[#ECE6DC]'
              }`}
            >
              All ({tips.length})
            </button>
            <button
              onClick={() => setSelectedCategory('housing')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'housing'
                  ? 'bg-[#FF6B4A] text-white'
                  : 'bg-[#FAF7F2] text-[#3B4A5E] hover:bg-[#ECE6DC]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Housing
            </button>
            <button
              onClick={() => setSelectedCategory('courses')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'courses'
                  ? 'bg-[#0E8F8A] text-white'
                  : 'bg-[#FAF7F2] text-[#3B4A5E] hover:bg-[#ECE6DC]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Courses
            </button>
            <button
              onClick={() => setSelectedCategory('daily-life')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'daily-life'
                  ? 'bg-[#F2A93B] text-white'
                  : 'bg-[#FAF7F2] text-[#3B4A5E] hover:bg-[#ECE6DC]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              Daily Life
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-[#ECE6DC]/60">
            {filteredTips.length === 0 ? (
              <div className="py-12 text-center text-[#7A8699]">
                <p className="text-sm font-medium">No tips found matching "{query}"</p>
                <p className="text-xs text-[#7A8699] mt-1">
                  Try checking another category or sharing your own tip!
                </p>
              </div>
            ) : (
              filteredTips.map((tip) => (
                <button
                  key={tip.id}
                  onClick={() => handleSelectTip(tip.id)}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#FAF7F2] transition-colors flex items-start justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#7A8699] font-medium mb-1">
                      <span className="capitalize font-semibold text-[#FF5F45]">
                        {tip.category.replace('-', ' ')}
                      </span>
                      <span>·</span>
                      <span>{tip.subtopic}</span>
                      {tip.courseCode && (
                        <>
                          <span>·</span>
                          <span className="text-[#0E8F8A] font-bold">{tip.courseCode}</span>
                        </>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#0E1A2B] group-hover:text-[#FF5F45] transition-colors font-editorial line-clamp-1">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-[#3B4A5E] line-clamp-1 mt-0.5">
                      {tip.text}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-[#7A8699] mt-1">
                    <span className="tabular-nums">▲ {tip.upvotes}</span>
                    <ArrowRight className="w-4 h-4 text-[#7A8699] group-hover:text-[#FF5F45] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
