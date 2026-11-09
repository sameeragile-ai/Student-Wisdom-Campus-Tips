import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#ECE6DC] p-8 text-center shadow-lg relative overflow-hidden">
        {/* Playful Empty Jar SVG */}
        <div className="w-28 h-28 mx-auto mb-4 relative flex items-center justify-center">
          <svg
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            <rect x="25" y="10" width="50" height="10" rx="5" fill="#0E1A2B" />
            <path
              d="M32 20 L32 28 M68 20 L68 28"
              stroke="#0E1A2B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M32 28 C32 28, 14 32, 14 44 L20 100 C20 110, 36 112, 50 112 C64 112, 80 110, 80 100 L86 44 C86 32, 68 28, 68 28"
              stroke="#0E1A2B"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Playful question mark floating inside jar */}
            <text
              x="50"
              y="75"
              textAnchor="middle"
              fontSize="32"
              fontWeight="bold"
              fill="#FF5F45"
              fontFamily="Fraunces, serif"
            >
              ?
            </text>
          </svg>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#FF5F45]">
          Error 404
        </span>

        <h1 className="text-3xl font-bold font-editorial text-[#0E1A2B] mt-1 tracking-tight">
          This jar is empty!
        </h1>

        <p className="text-xs sm:text-sm text-[#7A8699] mt-2 leading-relaxed">
          The campus tip or page you were looking for doesn't exist, was relocated, or graduated last semester.
        </p>

        <div className="mt-6 pt-6 border-t border-[#ECE6DC] flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-sunrise text-white font-bold text-xs shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Campus Home</span>
          </Link>
          <Link
            to="/category/courses"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#ECE6DC] text-[#3B4A5E] font-bold text-xs hover:bg-[#FAF7F2] transition-colors"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
