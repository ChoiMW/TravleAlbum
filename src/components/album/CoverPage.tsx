"use client";

import React from 'react';
import { AlbumPageData } from '@/types/album';
import MinimalEditorial from '@/components/cover/MinimalEditorial';
import CityMagazine from '@/components/cover/CityMagazine';
import EmotionDiary from '@/components/cover/EmotionDiary';
import { CoverData } from '@/types/cover';

export default function CoverPage({ data }: { data: AlbumPageData }) {
  const coverData: CoverData = {
    title: data.title || '',
    subtitle: data.subtitle || '',
    location: data.location || '',
    date: data.date || '',
    companions: data.companions || '',
    imageUrl: data.images[0] || '',
    showCompanions: Boolean(data.companions)
  };

  const template = data.coverTemplate || 'minimal';

  switch (template) {
    case 'magazine':
      return <CityMagazine data={coverData} />;
    case 'diary':
      return <EmotionDiary data={coverData} />;
    case 'minimal':
    default:
      return <MinimalEditorial data={coverData} />;
  }
}
