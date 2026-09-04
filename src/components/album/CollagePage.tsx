/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { AlbumPageData } from '@/types/album';

export default function CollagePage({ data }: { data: AlbumPageData }) {
  const images = data.images || [];
  const count = images.length;
  const extraCount = count > 4 ? count - 3 : 0;

  const renderGrid = () => {
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-2.5 w-full my-auto">
          {images.slice(0, 2).map((img, idx) => (
            <div key={idx} className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-200 shadow-2xs">
              <img src={img} alt="Collage" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-2.5 w-full my-auto">
          <div className="col-span-2 w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-200 shadow-2xs">
            <img src={images[0]} alt="Featured collage" className="w-full h-full object-cover" />
          </div>
          {images.slice(1, 3).map((img, idx) => (
            <div key={idx} className="w-full aspect-square rounded-xl overflow-hidden bg-gray-200 shadow-2xs">
              <img src={img} alt="Collage" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );
    }

    // 4 or 5+ photos (2x2 grid)
    return (
      <div className="grid grid-cols-2 gap-2.5 w-full my-auto">
        {images.slice(0, 4).map((img, idx) => (
          <div key={idx} className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-200 shadow-2xs">
            <img src={img} alt="Collage" className="w-full h-full object-cover" />
            {idx === 3 && extraCount > 0 && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
                <span className="text-xl font-extrabold font-mono">+{extraCount}</span>
                <span className="text-[10px] font-medium opacity-85">더보기</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#F7F7F7] flex flex-col pt-16 pb-20 px-4 justify-between">
      {data.title && (
        <div className="pt-3 text-center">
          <h3 className="text-base font-bold text-gray-900">{data.title}</h3>
          {data.text && (
            <p className="text-xs text-gray-500 mt-1 max-w-[280px] mx-auto line-clamp-2">
              {data.text}
            </p>
          )}
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center py-2 px-1">
        {renderGrid()}
      </div>

      {data.date && (
        <p className="text-[11px] text-gray-400 text-center font-mono pb-2">{data.date}</p>
      )}
    </div>
  );
}


