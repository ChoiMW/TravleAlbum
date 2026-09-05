"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MinimalEditorial from './MinimalEditorial';
import CityMagazine from './CityMagazine';
import EmotionDiary from './EmotionDiary';
import { useTravelContext, TemplateType } from '@/context/TravelContext';
import { compressImage } from '@/utils/imageCompressor';
import ImagePresetModal from '@/components/common/ImagePresetModal';

export default function CoverEditor() {
  const router = useRouter();
  const { cover, template, setCover, setTemplate, resetToDefault, demoAlbums, loadDemoAlbum } = useTravelContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Close editing on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsEditing(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const compressedDataUrl = await compressImage(file, 1200, 1200, 0.78);
        setCover(prev => ({ ...prev, imageUrl: compressedDataUrl }));
      } catch {
        // Fallback to plain reader if compression fails
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setCover(prev => ({ ...prev, imageUrl: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const renderTemplate = () => {
    switch (template) {
      case 'minimal': return <MinimalEditorial data={cover} />;
      case 'magazine': return <CityMagazine data={cover} />;
      case 'diary': return <EmotionDiary data={cover} />;
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 flex flex-col overflow-hidden">
      {/* Viewport for Cover with smooth scale adjustment */}
      <div 
        onClick={() => { if (isSheetCollapsed) setIsSheetCollapsed(false); }}
        className={`w-full h-full relative transition-all duration-300 ease-out ${
          isSheetCollapsed ? 'pb-12' : 'pb-64 sm:pb-56'
        }`}
      >
        <div className="w-full h-full relative overflow-hidden shadow-md">
          {renderTemplate()}
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleImageChange} 
      />

      {/* Editor Bottom Sheet / Control Panel */}
      <div 
        className={`w-full bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-5 z-20 absolute bottom-0 left-0 transition-transform duration-300 ease-out ${
          isSheetCollapsed ? 'translate-y-[calc(100%-48px)]' : 'translate-y-0'
        }`}
      >
        {/* Drag handle & collapse toggle */}
        <button
          onClick={() => setIsSheetCollapsed(prev => !prev)}
          className="w-full pb-3 flex flex-col items-center justify-center -mt-2 group cursor-pointer"
          title={isSheetCollapsed ? "패널 펼치기" : "표지 전체보기 (패널 접기)"}
          aria-label={isSheetCollapsed ? "패널 펼치기" : "패널 접기"}
        >
          <div className="w-12 h-1.5 bg-gray-300 group-hover:bg-gray-400 rounded-full transition-colors" />
          <span className="text-[10px] text-gray-400 mt-1 font-medium">
            {isSheetCollapsed ? "▲ 편집 패널 열기" : "▼ 표지 전체보기"}
          </span>
        </button>


        {!isEditing ? (
          <div className="space-y-4 pb-2">
            {/* Demo Travel Albums Selector */}
            <div className="bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-rose-50/80 border border-orange-200/70 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">✨</span>
                  <h4 className="text-xs font-bold text-gray-900">데모 여행 데이터 불러오기</h4>
                </div>
                <span className="text-[10px] font-semibold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full">
                  실제 사진/글 포함
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {demoAlbums.map(demo => {
                  const isCurrent = cover.title === demo.cover.title;
                  return (
                    <button
                      key={demo.id}
                      onClick={() => loadDemoAlbum(demo.id)}
                      className={`flex flex-col items-start p-2 rounded-xl transition-all text-left cursor-pointer border ${
                        isCurrent
                          ? 'bg-white border-[var(--seed-orange)] shadow-sm ring-1 ring-[var(--seed-orange)]'
                          : 'bg-white/80 border-orange-200/60 hover:bg-white hover:border-orange-300'
                      }`}
                      title={demo.description}
                    >
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mb-1 ${
                        demo.id === 'jeju' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                          : demo.id === 'europe' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/60' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      }`}>
                        {demo.badge}
                      </span>
                      <span className="text-xs font-bold text-gray-900 line-clamp-1 w-full">
                        {demo.name}
                      </span>
                      <span className="text-[10px] text-gray-500 line-clamp-1 w-full mt-0.5">
                        {demo.template === 'minimal' ? '미니멀' : demo.template === 'magazine' ? '매거진' : '다이어리'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <h3 className="text-sm font-bold text-gray-900">표지 디자인 선택</h3>
                <button 
                  onClick={resetToDefault} 
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  title="초기 샘플 데이터로 복원"
                >
                  기본값 복원
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {[
                  { id: 'minimal', label: '미니멀 에디토리얼' },
                  { id: 'magazine', label: '시티 매거진' },
                  { id: 'diary', label: '소프트 다이어리' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id as TemplateType)}
                    className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                      template === t.id 
                        ? 'bg-[var(--seed-orange)] text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                aria-label="상세 편집"
              >
                상세 편집
              </button>
              <button 
                type="button"
                onClick={() => setIsPresetModalOpen(true)}
                className="w-full py-3 bg-orange-50 hover:bg-orange-100 text-[var(--seed-orange)] border border-orange-200/80 font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                aria-label="기본 템플릿"
              >
                <span>🎨</span>
                <span>기본 템플릿</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                사진 변경
              </button>
            </div>
            <button 
              onClick={() => router.push('/record')}
              className="w-full py-4 bg-[var(--seed-orange)] hover:opacity-95 text-white font-bold rounded-xl shadow-sm transition-opacity"
            >
              이 표지로 확정하기
            </button>
          </div>
        ) : (
          <div className="space-y-4 pb-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">상세 편집</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-sm font-semibold text-[var(--seed-orange)] hover:underline"
              >
                완료
              </button>
            </div>
            
            <div className="space-y-4 max-h-[50vh] overflow-y-auto no-scrollbar pb-10 px-1">
              {/* Photo Change Controls in Drawer */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">표지 사진</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPresetModalOpen(true)}
                    className="flex-1 py-2.5 bg-orange-50 hover:bg-orange-100 text-[var(--seed-orange)] border border-orange-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>🎨</span>
                    <span>기본 템플릿 갤러리</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>📁</span>
                    <span>내 사진 업로드</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">여행 제목</label>
                <input 
                  type="text" 
                  value={cover.title}
                  onChange={(e) => setCover(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--seed-orange)] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">장소</label>
                <input 
                  type="text" 
                  value={cover.location}
                  onChange={(e) => setCover(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--seed-orange)] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">날짜</label>
                <input 
                  type="text" 
                  value={cover.date}
                  onChange={(e) => setCover(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--seed-orange)] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">한줄 문구 (부제)</label>
                <input 
                  type="text" 
                  value={cover.subtitle}
                  onChange={(e) => setCover(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--seed-orange)] focus:bg-white transition-colors"
                />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">동행자명 표시</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={cover.showCompanions !== false}
                    onChange={(e) => setCover(prev => ({ ...prev, showCompanions: e.target.checked }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--seed-orange)]"></div>
                </label>
              </div>
              {cover.showCompanions !== false && (
                <div>
                  <input 
                    type="text" 
                    value={cover.companions}
                    onChange={(e) => setCover(prev => ({ ...prev, companions: e.target.value }))}
                    placeholder="예: JINJU & MINSU"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--seed-orange)] focus:bg-white transition-colors mt-2"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preset Image Gallery Modal */}
      <ImagePresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelect={(urls) => {
          if (urls.length > 0) {
            setCover(prev => ({ ...prev, imageUrl: urls[0] }));
          }
        }}
        mode="single"
        initialSelected={cover.imageUrl ? [cover.imageUrl] : []}
        title="표지 기본 이미지 템플릿"
        description="앨범 표지에 어울리는 여행 사진 템플릿을 선택해보세요."
        onUploadClick={() => fileInputRef.current?.click()}
      />
    </div>
  );
}

