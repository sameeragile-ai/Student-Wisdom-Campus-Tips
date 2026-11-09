import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SignatureLoaderProps {
  onComplete: () => void;
}

export function SignatureLoader({ onComplete }: SignatureLoaderProps) {
  const [stage, setStage] = useState<'drawing' | 'dropping' | 'text' | 'exit'>('drawing');

  useEffect(() => {
    // Stage 1: Jar outline draws (0ms to 400ms)
    const t1 = setTimeout(() => {
      setStage('dropping');
    }, 450);

    // Stage 2: Cards drop in (450ms to 950ms)
    const t2 = setTimeout(() => {
      setStage('text');
    }, 1000);

    // Stage 3: Wordmark & progress line (1000ms to 1600ms)
    const t3 = setTimeout(() => {
      setStage('exit');
    }, 1650);

    // Stage 4: Exit animation finishes, unveil app
    const t4 = setTimeout(() => {
      onComplete();
    }, 2050);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'exit' && (
        <motion.div
          key="signature-loader"
          initial={{ opacity: 1, y: 0 }}
          exit={{ y: '-100%', opacity: 0.95 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] select-none pointer-events-auto"
        >
          {/* Subtle noise grain */}
          <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />

          {/* Center jar animation container */}
          <div className="relative flex flex-col items-center">
            {/* SVG Canvas for Jar & Dropping Cards */}
            <div className="relative w-40 h-44 flex items-center justify-center">
              {/* Dropping Tip Cards into the Jar */}
              {stage !== 'drawing' && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                  {/* Card 1 */}
                  <motion.div
                    initial={{ y: -80, opacity: 0, rotate: -12, scale: 0.8 }}
                    animate={{ y: 22, opacity: 1, rotate: -6, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 18,
                      delay: 0.05,
                    }}
                    className="absolute w-12 h-7 rounded-md bg-[#FF6B4A] shadow-md border border-white/40 flex items-center justify-center"
                  >
                    <div className="w-6 h-1 rounded-full bg-white/80" />
                  </motion.div>

                  {/* Card 2 */}
                  <motion.div
                    initial={{ y: -80, opacity: 0, rotate: 14, scale: 0.8 }}
                    animate={{ y: 16, opacity: 1, rotate: 8, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 280,
                      damping: 17,
                      delay: 0.22,
                    }}
                    className="absolute w-14 h-8 rounded-md bg-[#0E8F8A] shadow-md border border-white/40 flex items-center justify-center"
                  >
                    <div className="w-7 h-1 rounded-full bg-white/80" />
                  </motion.div>

                  {/* Card 3 */}
                  <motion.div
                    initial={{ y: -80, opacity: 0, rotate: -2, scale: 0.8 }}
                    animate={{ y: 8, opacity: 1, rotate: 2, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 320,
                      damping: 19,
                      delay: 0.38,
                    }}
                    className="absolute w-11 h-6 rounded-md bg-[#F2A93B] shadow-md border border-white/40 flex items-center justify-center"
                  >
                    <div className="w-5 h-1 rounded-full bg-white/80" />
                  </motion.div>
                </div>
              )}

              {/* Jar SVG Outline Drawing */}
              <svg
                viewBox="0 0 120 130"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-32 h-36 relative z-10 drop-shadow-sm"
              >
                {/* Jar Lid Ring */}
                <motion.rect
                  x="30"
                  y="12"
                  width="60"
                  height="12"
                  rx="6"
                  stroke="#0E1A2B"
                  strokeWidth="3.5"
                  fill="#FAF7F2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />

                {/* Jar Neck */}
                <motion.path
                  d="M38 24 L38 32 M82 24 L82 32"
                  stroke="#0E1A2B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />

                {/* Jar Glass Body */}
                <motion.path
                  d="M38 32 C38 32, 18 36, 18 50 L24 108 C24 118, 40 120, 60 120 C80 120, 96 118, 96 108 L102 50 C102 36, 82 32, 82 32"
                  stroke="#0E1A2B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />

                {/* Subtle glass reflection sheen */}
                <motion.path
                  d="M28 54 L32 100"
                  stroke="#ECE6DC"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                />
              </svg>
            </div>

            {/* Wordmark and progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={stage === 'text' ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-4 flex flex-col items-center"
            >
              <h1 className="text-3xl font-bold tracking-tight text-[#0E1A2B] font-editorial">
                Tip<span className="text-sunrise">Jar</span>
              </h1>
              <p className="text-xs font-medium text-[#7A8699] mt-0.5 tracking-wide">
                Campus wisdom from students who've been there
              </p>

              {/* Progress Line */}
              <div className="w-28 h-1 bg-[#ECE6DC] rounded-full mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="h-full bg-sunrise rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
