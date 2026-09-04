/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { AlbumPageData } from '@/types/album';

export default function PhotoPage({ data }: { data: AlbumPageData }) {
  return (
    <div className="w-full h-full bg-white flex flex-col pt-16 pb-20 justify-between">
      <div className="flex-1 px-4 flex flex-col justify-center my-auto">
        <div className="w-full rounded-2xl overflow-hidden shadow-xs bg-gray-100 max-h-[60vh] flex items-center justify-center">
          <img 
            src={data.images[0]} 
            alt="Travel Memory" 
            className="w-full h-auto max-h-[60vh] object-cover"
          />
        </div>
        
        <div className="mt-6 px-3 text-center">
          {data.title && (
            <h3 className="text-base font-bold text-gray-900 mb-1.5">{data.title}</h3>
          )}
          {data.text && (
            <p className="text-sm text-gray-600 leading-relaxed max-w-[320px] mx-auto whitespace-pre-wrap">{data.text}</p>
          )}
        </div>
      </div>

      {data.date && (
        <p className="text-[11px] text-gray-400 text-center font-mono pb-2">{data.date}</p>
      )}
    </div>
  );
}

