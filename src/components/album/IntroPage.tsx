import React from 'react';
import { AlbumPageData } from '@/types/album';

export default function IntroPage({ data }: { data: AlbumPageData }) {
  return (
    <div className="w-full h-full bg-[#FAFAFA] flex flex-col p-8 justify-center relative">
      {/* Small Mascot placeholder in top right */}
      <div className="absolute top-16 right-8 text-4xl opacity-80">
        🐰
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[var(--seed-orange)] font-bold text-xs tracking-widest uppercase mb-2">
            Prologue
          </p>
          <h2 className="text-3xl font-serif text-gray-900 leading-snug">
            {data.title}
          </h2>
        </div>

        <div className="w-8 h-[1px] bg-gray-300" />

        <div className="space-y-1">
          <p className="text-sm text-gray-800 font-medium">📍 {data.location}</p>
          <p className="text-sm text-gray-500 font-medium">🗓 {data.date}</p>
        </div>

        <div className="pt-8">
          <p className="text-gray-600 leading-relaxed text-sm">
            {data.text}
          </p>
        </div>
      </div>
    </div>
  );
}
