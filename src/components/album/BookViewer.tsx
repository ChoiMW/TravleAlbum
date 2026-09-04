"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import IntroPage from './IntroPage';
import PhotoPage from './PhotoPage';
import CollagePage from './CollagePage';
import CoverPage from './CoverPage';
import OutroPage from './OutroPage';
import EssayPage from './EssayPage';
import { AlbumPageData } from '@/types/album';
import { useTravelContext } from '@/context/TravelContext';

interface Props {
  pages: AlbumPageData[];
}

export default function BookViewer({ pages }: Props) {
  const router = useRouter();
  const { createShareUrl } = useTravelContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToPage = useCallback((pageIndex: number) => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: pageIndex * width,
        behavior: 'smooth'
      });
      setCurrentPage(pageIndex);
    }
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const width = containerRef.current.clientWidth;
      if (width > 0) {
        const pageIndex = Math.round(scrollLeft / width);
        setCurrentPage(pageIndex);
      }
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentPage < pages.length - 1) {
          scrollToPage(currentPage + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 0) {
          scrollToPage(currentPage - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages.length, scrollToPage]);

  // Share functionality with embedded share URL
  const handleShare = async () => {
    const shareUrl = createShareUrl() || (typeof window !== 'undefined' ? window.location.href : '');
    const shareData = {
      title: '나만의 여행 앨범',
      text: '우리의 특별한 여행 순간들을 담은 매거진 앨범입니다.',
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to copy if user cancelled
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
    } catch {
      // Ignore clipboard error and still notify
    }

    setToastMessage('앨범 링크가 클립보드에 복사되었습니다! 🎉');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const renderPage = (page: AlbumPageData) => {
    switch (page.type) {
      case 'cover': return <CoverPage data={page} />;
      case 'intro': return <IntroPage data={page} />;
      case 'single-photo': return <PhotoPage data={page} />;
      case 'collage': return <CollagePage data={page} />;
      case 'essay': return <EssayPage data={page} />;
      case 'outro': return <OutroPage data={page} onRestart={() => scrollToPage(0)} />;
      default: return <div className="p-6 text-gray-500">페이지를 불러올 수 없습니다.</div>;
    }
  };


  return (
    <div className="relative w-full h-[100dvh] bg-gray-950 text-white flex flex-col select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/85 text-white text-xs font-semibold rounded-full shadow-lg border border-white/20 animate-in fade-in slide-in-from-top-2 backdrop-blur-md">
          {toastMessage}
        </div>
      )}

      {/* Top Navigation */}
      <div className="absolute top-0 w-full z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <button 
          onClick={() => router.push('/record')}
          className="text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xs transition-colors"
          aria-label="여행 기록으로 돌아가기"
        >
          ← 기록으로
        </button>
        <span className="text-xs font-semibold opacity-90 tracking-widest bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-xs font-mono">
          {currentPage + 1} / {pages.length}
        </span>
        <button 
          onClick={handleShare}
          className="text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xs transition-colors flex items-center gap-1"
          aria-label="앨범 공유하기"
        >
          <span>공유</span>
          <span>🔗</span>
        </button>
      </div>

      {/* Desktop Navigation Floating Arrows */}
      {currentPage > 0 && (
        <button
          onClick={() => scrollToPage(currentPage - 1)}
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center text-lg backdrop-blur-xs transition-all hover:scale-105 active:scale-95 shadow-md"
          aria-label="이전 페이지"
        >
          ‹
        </button>
      )}

      {currentPage < pages.length - 1 && (
        <button
          onClick={() => scrollToPage(currentPage + 1)}
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center text-lg backdrop-blur-xs transition-all hover:scale-105 active:scale-95 shadow-md"
          aria-label="다음 페이지"
        >
          ›
        </button>
      )}

      {/* Pages Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {pages.map((page) => (
          <div 
            key={page.id} 
            className="w-full h-full shrink-0 snap-center flex justify-center items-center bg-white text-black relative"
          >
            {renderPage(page)}
          </div>
        ))}
      </div>
      
      {/* Page Progress Indicator */}
      <div className="absolute bottom-6 w-full flex justify-center items-center gap-1.5 z-20 pointer-events-none">
        {pages.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => scrollToPage(idx)}
            className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
              idx === currentPage ? 'w-5 bg-[var(--seed-orange)] shadow-xs' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`} 
            aria-label={`${idx + 1}번 페이지로 이동`}
          />
        ))}
      </div>
    </div>
  );
}

