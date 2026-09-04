/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { CoverData } from '@/types/cover';

export default function MinimalEditorial({ data }: { data: CoverData }) {
  return (
    <div className="relative w-full h-[100dvh] bg-white flex flex-col">
      {/* Photo Section */}
      <div className="flex-1 p-6 pb-2">
        <div className="w-full h-full relative rounded-2xl overflow-hidden bg-gray-100">
          <img 
            src={data.imageUrl} 
            alt="Travel Cover" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6 pt-4 flex flex-col justify-between" style={{ minHeight: '35vh' }}>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-tight">
            {data.title.split(' ').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>
        </div>
        
        <div className="mt-8 flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-800">{data.location}</p>
            <p className="text-xs text-gray-500">{data.date}</p>
          </div>
          <div className="text-right space-y-1">
            {data.showCompanions !== false && (
              <p className="text-xs font-medium text-gray-800">{data.companions}</p>
            )}
            <p className="text-xs text-gray-500 italic">&ldquo;{data.subtitle}&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}

