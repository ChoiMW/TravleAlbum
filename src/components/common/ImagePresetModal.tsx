/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { PRESET_CATEGORIES, PRESET_IMAGES, PresetCategoryId, PresetImage } from '@/data/presetImages';

interface ImagePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedUrls: string[]) => void;
  mode?: 'single' | 'multiple';
  initialSelected?: string[];
  title?: string;
  description?: string;
  onUploadClick?: () => void;
}

export default function ImagePresetModal({
  isOpen,
  onClose,
  onSelect,
  mode = 'single',
  initialSelected = [],
  title = '기본 여행 이미지 템플릿',
  description = '앨범 테마에 맞는 감성적인 여행 사진을 바로 선택해보세요.',
  onUploadClick
}: ImagePresetModalProps) {
  const [activeCategory, setActiveCategory] = useState<PresetCategoryId>('all');
  const [selectedUrls, setSelectedUrls] = useState<string[]>(initialSelected);

  if (!isOpen) return null;

  const filteredImages = activeCategory === 'all'
    ? PRESET_IMAGES
    : PRESET_IMAGES.filter(img => img.category === activeCategory);

  const toggleSelect = (img: PresetImage) => {
    if (mode === 'single') {
      setSelectedUrls([img.imageUrl]);
    } else {
      setSelectedUrls(prev => 
        prev.includes(img.imageUrl)
          ? prev.filter(url => url !== img.imageUrl)
          : [...prev, img.imageUrl]
      );
    }
  };

  const handleApply = () => {
    if (selectedUrls.length > 0) {
      onSelect(selectedUrls);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-start justify-between shrink-0 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎨</span>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">{title}</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/70 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {PRESET_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  isActive
                    ? 'bg-[var(--seed-orange)] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 no-scrollbar">
          {filteredImages.map(img => {
            const isSelected = selectedUrls.includes(img.imageUrl);
            return (
              <div
                key={img.id}
                onClick={() => toggleSelect(img)}
                className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 flex flex-col bg-white ${
                  isSelected
                    ? 'border-[var(--seed-orange)] ring-2 ring-[var(--seed-orange)]/30 shadow-md scale-[1.01]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Category Pill */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-xs">
                    {img.categoryLabel}
                  </span>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--seed-orange)] text-white flex items-center justify-center text-xs font-bold shadow-md animate-in zoom-in-75">
                      ✓
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div className="p-2.5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{img.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">📍 {img.location}</p>
                  </div>
                  <p className="text-[9px] text-[var(--seed-orange)] font-medium mt-1.5 line-clamp-1">{img.tag}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3 shrink-0">
          <div>
            {onUploadClick && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onUploadClick();
                }}
                className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>📁</span>
                <span className="hidden sm:inline">내 기기에서</span>
                <span>직접 업로드</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={selectedUrls.length === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedUrls.length > 0
                  ? 'bg-[var(--seed-orange)] hover:opacity-95 shadow-sm'
                  : 'bg-gray-300 cursor-not-allowed opacity-60'
              }`}
            >
              <span>선택 적용</span>
              {selectedUrls.length > 0 && (
                <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                  {selectedUrls.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
