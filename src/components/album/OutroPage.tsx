"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlbumPageData } from '@/types/album';

export default function OutroPage({ data, onRestart }: { data: AlbumPageData; onRestart?: () => void }) {
  const router = useRouter();

  return (
    <div className="w-full h-full bg-[#FAF9F6] flex flex-col p-7 justify-between relative overflow-y-auto no-scrollbar">
      
      {/* Decorative Top header */}
      <div className="pt-8 text-center">
        <p className="text-[var(--seed-orange)] font-bold text-xs tracking-widest uppercase mb-1">
          {data.subtitle || 'Epilogue'}
        </p>
        <h2 className="text-2xl font-serif text-gray-900 leading-snug font-bold">
          {data.title || '여행을 마무리하며'}
        </h2>
        <div className="w-8 h-0.5 bg-[var(--seed-orange)] mx-auto mt-3" />
      </div>

      {/* Center Reflection & Stats */}
      <div className="my-auto space-y-6 py-4">
        <div className="bg-white/90 p-5 rounded-2xl shadow-xs border border-gray-100 text-center space-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Memories Collected</p>
          
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-gray-50/80 p-3 rounded-xl">
              <span className="text-2xl font-black text-gray-900 block">
                {data.stats?.totalMoments ?? 0}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">기록된 순간</span>
            </div>
            <div className="bg-gray-50/80 p-3 rounded-xl">
              <span className="text-2xl font-black text-gray-900 block">
                {data.stats?.totalPhotos ?? 0}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">간직한 사진</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-gray-500 font-mono">
            {data.date}
          </div>
        </div>

        <div className="text-center px-2">
          <p className="text-sm text-gray-600 leading-relaxed italic font-serif">
            &ldquo;{data.text || '여행은 끝났지만 함께했던 추억은 언제나 우리 마음속에 남아 빛납니다.'}&rdquo;
          </p>
          {data.companions && (
            <p className="text-xs text-gray-400 mt-3 font-medium">
              with {data.companions}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pb-6 space-y-2.5">
        {onRestart && (
          <button
            onClick={onRestart}
            className="w-full py-3.5 bg-gray-900 text-white font-semibold rounded-xl text-xs hover:bg-gray-800 transition-colors"
          >
            처음부터 다시 보기
          </button>
        )}
        <button
          onClick={() => router.push('/record')}
          className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50 transition-colors"
        >
          여행 기록으로 돌아가기
        </button>
      </div>

    </div>
  );
}
