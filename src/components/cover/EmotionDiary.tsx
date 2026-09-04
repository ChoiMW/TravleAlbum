/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { CoverData } from '@/types/cover';

export default function EmotionDiary({ data }: { data: CoverData }) {
  return (
    <div className="relative w-full h-[100dvh] bg-[#FDFBF7] flex flex-col items-center p-6">
      
      {/* Decorative top element */}
      <div className="w-full pt-8 pb-4 text-center">
        <p className="text-xs text-[#A89F91] tracking-widest uppercase mb-1">Our Memories</p>
        <div className="w-8 h-[1px] bg-[#D4CFC9] mx-auto"></div>
      </div>

      {/* Main Photo with polaroid-like frame */}
      <div className="w-full bg-white p-3 pb-12 shadow-sm rounded-sm mb-8 transform -rotate-1">
        <div className="w-full aspect-[4/5] relative bg-gray-100 overflow-hidden">
          <img 
            src={data.imageUrl} 
            alt="Travel Cover" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <p className="text-center mt-4 text-[#8A7F73] font-serif italic text-sm">
          {data.location}, {data.date.split('—')[0].trim()}
        </p>
      </div>

      {/* Typography & Content */}
      <div className="w-full text-center space-y-4">
        <h1 className="text-2xl font-serif text-[#4A433B] leading-relaxed">
          {data.title}
        </h1>
        
        <div className="px-4 py-3 bg-[#F4F1EA] rounded-xl inline-block">
          <p className="text-sm text-[#6B6358] font-medium">
            &ldquo;{data.subtitle}&rdquo;
          </p>
        </div>
        
        {data.showCompanions !== false && (
          <p className="text-xs text-[#9B9286] pt-4 font-medium tracking-wide">
            WITH {data.companions}
          </p>
        )}
      </div>
      
    </div>
  );
}

