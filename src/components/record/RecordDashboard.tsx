/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TravelMoment } from '@/types/record';
import { useTravelContext } from '@/context/TravelContext';
import { compressImage } from '@/utils/imageCompressor';
import ImagePresetModal from '@/components/common/ImagePresetModal';

const MOOD_EMOJIS = ['✨', '😋', '☕', '📸', '🌿', '🏖️', '🌆', '❤️', '😴', '🎉', '🏛️'];

export default function RecordDashboard() {
  const router = useRouter();
  const { cover, moments, addMoment, updateMoment, deleteMoment, demoAlbums, loadDemoAlbum } = useTravelContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  // Form state
  const [text, setText] = useState('');
  const [mood, setMood] = useState('✨');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setText('');
    setMood('✨');
    setLocation(cover.location ? cover.location.split(/[,·•-]/)[0].trim() : '');
    const now = new Date();
    setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setImages([]);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (moment: TravelMoment) => {
    setEditingId(moment.id);
    setText(moment.text);
    setMood(moment.mood || '✨');
    setLocation(moment.location || '');
    setTime(moment.timestamp || '');
    setImages([...moment.images]);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const compressedUrls = await Promise.all(
        files.map(async file => {
          try {
            return await compressImage(file, 1200, 1200, 0.78);
          } catch {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
          }
        })
      );
      setImages(prev => [...prev, ...compressedUrls]);
    }
  };


  const removeImageAt = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveMoment = () => {
    if (text.trim() === '' && images.length === 0) {
      setErrorMsg('사진을 추가하거나 짧은 메모를 남겨주세요.');
      return;
    }

    if (editingId) {
      updateMoment(editingId, {
        text: text.trim(),
        mood,
        location: location.trim() || undefined,
        timestamp: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        images
      });
    } else {
      addMoment({
        text: text.trim(),
        mood,
        location: location.trim() || undefined,
        timestamp: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        images
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-[100dvh] bg-gray-50 flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <header className="bg-white px-4 py-3 flex justify-between items-center shadow-xs z-10 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/')}
            className="p-1.5 -ml-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            title="표지 디자인 수정"
            aria-label="표지 디자인으로 돌아가기"
          >
            ←
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900 truncate max-w-[200px]">
              {cover.title || '여행 기록'}
            </h1>
            <p className="text-xs text-gray-500 truncate max-w-[200px]">
              {cover.date || '기록 중'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => router.push('/album')}
          className="px-4 py-2 bg-[var(--seed-orange)] hover:opacity-95 text-white text-xs sm:text-sm font-bold rounded-full shadow-sm transition-opacity flex items-center gap-1.5"
        >
          <span>앨범 만들기</span>
          <span>→</span>
        </button>
      </header>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-24 space-y-6 no-scrollbar">
        {/* Quick Demo Selector */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2.5 shadow-sm border border-gray-100 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0 pl-1">
            <span className="text-xs">✨</span>
            <span className="text-xs font-bold text-gray-700">데모 코스:</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {demoAlbums.map(demo => {
              const isCurrent = cover.title === demo.cover.title;
              return (
                <button
                  key={demo.id}
                  onClick={() => loadDemoAlbum(demo.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[var(--seed-orange)] text-white shadow-xs font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={demo.description}
                >
                  {demo.badge.includes('장기') ? '✈️ ' : '🏝️ '}{demo.name.replace(' 여행', '').replace(' 힐링 휴양', '').replace(' 낭만 배낭', '')}
                </button>
              );
            })}
          </div>
        </div>

        {moments.length === 0 ? (
          <div className="text-center text-gray-400 mt-24 px-4">
            <div className="text-4xl mb-3">📖</div>
            <p className="font-semibold text-gray-600">아직 기록된 순간이 없습니다.</p>
            <p className="text-xs text-gray-400 mt-1">하단 + 버튼을 눌러 여행의 첫 순간을 남겨보세요!</p>
            <button
              onClick={openAddModal}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-semibold"
            >
              첫 순간 기록하기
            </button>
          </div>
        ) : (
          moments.map((moment, index) => (
            <div key={moment.id} className="relative pl-6 group">
              {/* Timeline line */}
              {index !== moments.length - 1 && (
                <div className="absolute left-1.5 top-8 bottom-[-2rem] w-px bg-gray-200" />
              )}
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-3 h-3 bg-[var(--seed-orange)] rounded-full border-2 border-white shadow-sm" />

              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600">{moment.timestamp}</span>
                  {moment.location && (
                    <span className="text-xs text-gray-500">📍 {moment.location}</span>
                  )}
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => openEditModal(moment)}
                    className="text-xs text-gray-400 hover:text-gray-700 px-1.5 py-0.5 rounded transition-colors"
                  >
                    수정
                  </button>
                  <span className="text-gray-300 text-xs">·</span>
                  <button 
                    onClick={() => {
                      if (confirm('이 기록을 삭제하시겠습니까?')) {
                        deleteMoment(moment.id);
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 transition-shadow hover:shadow-sm">
                {moment.images.length > 0 && (
                  <div className={`grid gap-2 mb-3 ${moment.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {moment.images.map((img, i) => (
                      <img key={i} src={img} alt="moment" className="w-full h-32 object-cover rounded-xl bg-gray-100" />
                    ))}
                  </div>
                )}
                {moment.text && (
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{moment.text}</p>
                )}
                {moment.mood && (
                  <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-full text-xs text-gray-600 border border-gray-100">
                    <span>{moment.mood}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      {!isModalOpen && (
        <button 
          onClick={openAddModal}
          aria-label="새 순간 기록"
          className="absolute bottom-6 right-5 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform active:scale-95"
        >
          +
        </button>
      )}

      {/* Add / Edit Moment Bottom Sheet */}
      {isModalOpen && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end bg-black/40 animate-in fade-in">
          <div className="bg-white w-full rounded-t-3xl p-5 pt-3 shadow-xl animate-in slide-in-from-bottom-full max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
            
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900">
                {editingId ? '기록 수정하기' : '새로운 순간 기록'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 text-sm font-medium"
              >
                닫기
              </button>
            </div>

            {errorMsg && (
              <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Quick meta input (Location & Time) */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">장소</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="예: 신주쿠 골목길"
                  className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[var(--seed-orange)] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">시간</label>
                <input 
                  type="text" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="예: 14:30"
                  className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[var(--seed-orange)] focus:bg-white"
                />
              </div>
            </div>

            <label className="block text-[11px] font-semibold text-gray-500 mb-1">순간 메모</label>
            <textarea 
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="지금 어떤 감정이나 풍경을 마주하고 있나요?"
              className="w-full h-24 p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[var(--seed-orange)] focus:bg-white resize-none mb-3"
            />

            {images.length > 0 && (
              <div className="mb-3">
                <p className="text-[11px] font-semibold text-gray-500 mb-1.5">첨부된 사진 ({images.length}장)</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImageAt(i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 text-white rounded-full text-xs flex items-center justify-center hover:bg-black"
                        title="사진 삭제"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-gray-500 mb-1.5">기분 / 테마 이모지</p>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {MOOD_EMOJIS.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => setMood(emoji)}
                      className={`w-9 h-9 shrink-0 rounded-full text-lg flex items-center justify-center transition-transform ${
                        mood === emoji ? 'bg-amber-100 scale-110 shadow-xs border border-amber-300' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    onClick={() => setIsPresetModalOpen(true)}
                    className="px-3.5 py-2.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200/80 flex items-center gap-1.5 text-xs font-semibold text-[var(--seed-orange)] transition-colors cursor-pointer"
                    aria-label="기본 템플릿"
                  >
                    <span>🎨</span>
                    <span>기본 템플릿</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center gap-1.5 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                    aria-label="사진 추가"
                  >
                    <span>📷</span>
                    <span>사진 추가</span>
                  </button>
                </div>
                
                <button 
                  onClick={handleSaveMoment}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-full transition-colors cursor-pointer"
                >
                  {editingId ? '수정 완료' : '순간 저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Image Gallery Modal */}
      <ImagePresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelect={(selectedUrls) => {
          setImages(prev => [...prev, ...selectedUrls]);
          if (errorMsg) setErrorMsg('');
        }}
        mode="multiple"
        initialSelected={images}
        title="순간 기록 이미지 템플릿"
        description="순간에 추가할 감성적인 여행 사진을 선택해보세요 (여러 장 선택 가능)."
        onUploadClick={() => fileInputRef.current?.click()}
      />
    </div>
  );
}

