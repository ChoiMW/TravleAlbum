"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CoverData } from '@/types/cover';
import { TravelMoment } from '@/types/record';
import { AlbumPageData } from '@/types/album';

export type TemplateType = 'minimal' | 'magazine' | 'diary';

const defaultCover: CoverData = {
  title: "TOKYO SUMMER DAYS",
  subtitle: "더웠지만 모든 순간이 좋았던 여행",
  location: "Shinjuku · Ginza · Azabudai",
  date: "2026.08.03 — 2026.08.06",
  companions: "JINJU & MINSU",
  showCompanions: true,
  imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200"><rect fill="%23ddd" width="800" height="1200"/><text fill="%23999" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">Cover Photo Placeholder</text></svg>'
};

const defaultMoments: TravelMoment[] = [
  {
    id: 'm1',
    images: ['data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="%23ddd" width="800" height="600"/><text fill="%23999" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">Narita Airport</text></svg>'],
    text: '나리타 공항 도착! 훅 끼치는 여름 공기가 벌써 여행의 시작을 알린다.',
    mood: '✨',
    timestamp: '13:00',
    location: 'Narita Airport'
  },
  {
    id: 'm2',
    images: [
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect fill="%23eee" width="800" height="800"/><text fill="%23999" font-family="sans-serif" font-size="28" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">Ramen Shop</text></svg>',
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect fill="%23e4e4e4" width="800" height="800"/><text fill="%23999" font-family="sans-serif" font-size="28" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">Shinjuku Alley</text></svg>'
    ],
    text: '신주쿠 골목길에서 우연히 발견한 심야식당 감성의 작은 라멘집. 국물이 정말 깊었다.',
    mood: '😋',
    timestamp: '19:30',
    location: 'Shinjuku'
  }
];

interface TravelContextType {
  cover: CoverData;
  template: TemplateType;
  moments: TravelMoment[];
  setCover: React.Dispatch<React.SetStateAction<CoverData>>;
  setTemplate: (t: TemplateType) => void;
  addMoment: (moment: Omit<TravelMoment, 'id'>) => void;
  updateMoment: (id: string, updated: Partial<TravelMoment>) => void;
  deleteMoment: (id: string) => void;
  generateAlbumPages: () => AlbumPageData[];
  createShareUrl: () => string;
  resetToDefault: () => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

const STORAGE_KEY_COVER = 'travel_album_cover';
const STORAGE_KEY_TEMPLATE = 'travel_album_template';
const STORAGE_KEY_MOMENTS = 'travel_album_moments';

function getSharedPayload(): { cover?: CoverData; template?: TemplateType; moments?: TravelMoment[] } | null {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const shareParam = params.get('share');
      if (shareParam) {
        const jsonStr = decodeURIComponent(escape(atob(shareParam)));
        const parsed = JSON.parse(jsonStr);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // Ignore decode error
    }
  }
  return null;
}

export function TravelProvider({ children }: { children: ReactNode }) {
  const [cover, setCover] = useState<CoverData>(defaultCover);
  const [template, setTemplate] = useState<TemplateType>('minimal');
  const [moments, setMoments] = useState<TravelMoment[]>(defaultMoments);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sharedData = getSharedPayload();
    if (sharedData?.cover) {
      setCover(sharedData.cover);
    } else {
      try {
        const savedCover = localStorage.getItem(STORAGE_KEY_COVER);
        if (savedCover) setCover(JSON.parse(savedCover));
      } catch {}
    }

    if (sharedData?.template) {
      setTemplate(sharedData.template);
    } else {
      try {
        const savedTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE);
        if (savedTemplate) setTemplate(savedTemplate as TemplateType);
      } catch {}
    }

    if (sharedData?.moments) {
      setMoments(sharedData.moments);
    } else {
      try {
        const savedMoments = localStorage.getItem(STORAGE_KEY_MOMENTS);
        if (savedMoments) setMoments(JSON.parse(savedMoments));
      } catch {}
    }

    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes after initial load
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_COVER, JSON.stringify(cover));
      localStorage.setItem(STORAGE_KEY_TEMPLATE, template);
      localStorage.setItem(STORAGE_KEY_MOMENTS, JSON.stringify(moments));
    } catch {
      // Storage quota exceeded or disabled
    }
  }, [cover, template, moments, isLoaded]);

  const addMoment = (momentData: Omit<TravelMoment, 'id'>) => {
    const newMoment: TravelMoment = {
      ...momentData,
      id: Date.now().toString()
    };
    setMoments(prev => [...prev, newMoment]);
  };

  const updateMoment = (id: string, updated: Partial<TravelMoment>) => {
    setMoments(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
  };

  const deleteMoment = (id: string) => {
    setMoments(prev => prev.filter(m => m.id !== id));
  };

  const resetToDefault = () => {
    setCover(defaultCover);
    setTemplate('minimal');
    setMoments(defaultMoments);
    localStorage.removeItem(STORAGE_KEY_COVER);
    localStorage.removeItem(STORAGE_KEY_TEMPLATE);
    localStorage.removeItem(STORAGE_KEY_MOMENTS);
  };

  const createShareUrl = (): string => {
    if (typeof window === 'undefined') return '';
    try {
      const payload = {
        cover,
        template,
        moments
      };
      const jsonStr = JSON.stringify(payload);
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      const url = new URL('/album', window.location.origin);
      url.searchParams.set('share', encoded);
      return url.toString();
    } catch {
      return window.location.href;
    }
  };

  const generateAlbumPages = (): AlbumPageData[] => {
    const pages: AlbumPageData[] = [];

    // Page 1: Front Cover
    pages.push({
      id: 'page-cover',
      type: 'cover',
      title: cover.title,
      subtitle: cover.subtitle,
      location: cover.location,
      date: cover.date,
      companions: cover.companions,
      coverTemplate: template,
      images: [cover.imageUrl]
    });

    // Page 2: Prologue / Intro
    pages.push({
      id: 'page-intro',
      type: 'intro',
      title: cover.title,
      subtitle: cover.subtitle,
      location: cover.location,
      date: cover.date,
      companions: cover.companions,
      text: cover.subtitle 
        ? `${cover.subtitle}. 함께라서 더 특별했던 그날의 소중한 순간들을 이 작은 책에 담았습니다.`
        : '모든 골목이 새로웠고, 함께라서 더 빛났던 여행의 기록. 그날의 온도와 공기를 담았습니다.',
      images: []
    });

    // Moments Pages
    moments.forEach((m, idx) => {
      if (m.images.length > 1) {
        pages.push({
          id: `moment-${m.id || idx}`,
          type: 'collage',
          title: m.location ? `${m.location}에서의 기록` : `순간 ${idx + 1}`,
          text: `${m.mood ? m.mood + ' ' : ''}${m.text}`,
          images: m.images,
          date: m.timestamp,
          location: m.location
        });
      } else if (m.images.length === 1) {
        pages.push({
          id: `moment-${m.id || idx}`,
          type: 'single-photo',
          title: m.location ? m.location : undefined,
          text: `${m.mood ? m.mood + ' ' : ''}${m.text}`,
          images: m.images,
          date: m.timestamp,
          location: m.location
        });
      } else {
        // Text-only essay moment (no cover photo repetition!)
        pages.push({
          id: `moment-${m.id || idx}`,
          type: 'essay',
          title: m.location ? m.location : '여행의 한 조각',
          text: `${m.mood ? m.mood + '\n\n' : ''}${m.text}`,
          images: [],
          date: m.timestamp,
          location: m.location
        });
      }
    });

    // Final Page: Outro / Epilogue
    const totalPhotos = moments.reduce((sum, m) => sum + m.images.length, 0) + 1;
    pages.push({
      id: 'page-outro',
      type: 'outro',
      title: '기억의 마지막 장',
      subtitle: 'Epilogue',
      text: `${cover.title} 여행이 끝난 뒤에도 사진을 열어볼 때마다 설레던 그 순간으로 돌아갈 수 있기를 바랍니다.`,
      images: [],
      date: cover.date,
      location: cover.location,
      companions: cover.companions,
      stats: {
        totalMoments: moments.length,
        totalPhotos: totalPhotos,
        daysCount: Math.max(1, moments.length)
      }
    });

    return pages;
  };

  return (
    <TravelContext.Provider
      value={{
        cover,
        template,
        moments,
        setCover,
        setTemplate,
        addMoment,
        updateMoment,
        deleteMoment,
        generateAlbumPages,
        createShareUrl,
        resetToDefault
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravelContext() {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravelContext must be used within a TravelProvider');
  }
  return context;
}

