"use client";

import React from 'react';
import { AlbumPageData } from '@/types/album';

export default function EssayPage({ data }: { data: AlbumPageData }) {
  return (
    <div className="w-full h-full bg-[#FAF8F5] flex flex-col justify-between p-8 pt-18 pb-20 relative overflow-y-auto no-scrollbar">
      
      {/* Top Header / Meta Tag */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs text-gray-600 border border-gray-200/60 shadow-2xs">
          {data.location && <span>📍 {data.location}</span>}
          {data.location && data.date && <span className="text-gray-300">·</span>}
          {data.date && <span className="font-mono text-gray-500">{data.date}</span>}
        </div>

        {data.title && (
          <h2 className="text-xl font-bold text-gray-900 tracking-tight font-serif pt-2">
            {data.title}
          </h2>
        )}
      </div>

      {/* Center Reflection Content */}
      <div className="my-auto py-8 px-2 max-w-[340px] mx-auto text-center space-y-6">
        <div className="text-4xl text-[var(--seed-orange)] opacity-40 font-serif leading-none select-none">
          &ldquo;
        </div>

        <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-serif whitespace-pre-wrap">
          {data.text}
        </p>

        <div className="w-10 h-[1.5px] bg-[var(--seed-orange)]/40 mx-auto" />
      </div>

      {/* Bottom Subtle Signature */}
      <div className="text-center pt-4">
        <p className="text-xs text-gray-400 font-serif italic">
          Moments recorded in travel
        </p>
      </div>

    </div>
  );
}
