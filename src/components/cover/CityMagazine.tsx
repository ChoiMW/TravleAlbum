/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { CoverData } from '@/types/cover';

export default function CityMagazine({ data }: { data: CoverData }) {
  // Extract main city from location safely (handles commas, middle dots, hyphens, etc.)
  const rawCity = (data.location || '').split(/[,·•-]/)[0].trim();
  const mainCity = (rawCity || 'TRIP').toUpperCase();

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white">
      {/* Full Background Image with gradient overlay for text readability */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={data.imageUrl} 
          alt="Travel Cover" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      </div>
      
      {/* Content Section */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6">
        
        {/* Top: Subtitle & Date */}
        <div className="flex justify-between items-start pt-4">
          <p className="text-xs uppercase tracking-widest font-semibold opacity-90">{data.subtitle}</p>
          <p className="text-xs font-mono opacity-80">{data.date}</p>
        </div>

        {/* Center: Large City Name */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-2">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tighter uppercase opacity-95 drop-shadow-md break-words max-w-full leading-tight">
            {mainCity}
          </h1>
          <h2 className="text-lg sm:text-xl mt-3 font-light tracking-widest opacity-90 max-w-full break-words">
            {data.title}
          </h2>
        </div>


        {/* Bottom: Location Details & Companions */}
        <div className="border-t border-white/30 pt-4 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-bold tracking-wider">{data.location}</p>
            </div>
            <div>
              {data.showCompanions !== false && (
                <p className="text-xs font-light tracking-widest">WITH {data.companions}</p>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
