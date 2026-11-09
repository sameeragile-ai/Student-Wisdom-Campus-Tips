import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

interface UpvoteButtonProps {
  tipId: string;
  count: number;
  hasVoted: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function UpvoteButton({
  tipId,
  count,
  hasVoted,
  onToggle,
  size = 'md',
  showLabel = false,
}: UpvoteButtonProps) {
  const [isPopping, setIsPopping] = useState(false);
  const [particles, setParticles] = useState<{ id: number; angle: number; distance: number }[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!hasVoted) {
      // Trigger arrow pop and 6 Sunrise particles
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 400);

      const newParticles = [0, 60, 120, 180, 240, 300].map((angle, i) => ({
        id: Date.now() + i,
        angle,
        distance: 26 + Math.random() * 8,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 700);
    }

    onToggle();
  };

  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <div className="relative inline-flex items-center">
      {/* 6 Sunrise Particles burst */}
      <AnimatePresence>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const x = Math.cos(rad) * p.distance;
          const y = Math.sin(rad) * p.distance;

          return (
            <motion.span
              key={p.id}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{ scale: [0, 1.2, 0.4], x, y, opacity: [1, 0.8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none z-30"
              style={{
                background: p.id % 2 === 0 ? '#FF5F45' : '#FFC04D',
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </AnimatePresence>

      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={handleClick}
        aria-label={hasVoted ? `Remove upvote (${count} upvotes)` : `Upvote this tip (${count} upvotes)`}
        className={`group relative flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 select-none border font-medium ${
          isLg
            ? 'h-12 px-5 min-w-[96px] text-base'
            : isSm
            ? 'h-9 px-3 min-w-[64px] text-xs'
            : 'h-10 px-3.5 min-w-[76px] text-sm'
        } ${
          hasVoted
            ? 'bg-sunrise text-white border-transparent shadow-md shadow-[#FF5F45]/20'
            : 'bg-white hover:bg-[#FAF7F2] text-[#0E1A2B] border-[#ECE6DC] hover:border-[#D9D0C3] shadow-sm'
        }`}
      >
        {/* Animated Chevron Arrow */}
        <motion.div
          animate={isPopping ? { scale: [1, 1.45, 1], y: [0, -3, 0] } : { scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'backOut' }}
          className="shrink-0"
        >
          <ChevronUp
            className={`${isLg ? 'w-5 h-5' : isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
              hasVoted ? 'stroke-[2.5]' : 'stroke-2 group-hover:text-[#FF5F45] transition-colors'
            }`}
          />
        </motion.div>

        {/* Tabular Count with subtle rolling animation */}
        <span
          className={`font-semibold tabular-nums tracking-tight ${
            hasVoted ? 'text-white' : 'text-[#0E1A2B] group-hover:text-[#FF5F45] transition-colors'
          }`}
        >
          {count}
        </span>

        {showLabel && (
          <span className={`text-xs ml-0.5 ${hasVoted ? 'text-white/90' : 'text-[#7A8699]'}`}>
            {count === 1 ? 'upvote' : 'upvotes'}
          </span>
        )}
      </motion.button>
    </div>
  );
}
