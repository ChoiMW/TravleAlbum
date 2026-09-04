"use client";

import BookViewer from '@/components/album/BookViewer';
import { useTravelContext } from '@/context/TravelContext';

export default function AlbumPage() {
  const { generateAlbumPages } = useTravelContext();
  const pages = generateAlbumPages();

  return (
    <div className="w-full h-full relative overflow-hidden bg-gray-950">
      <BookViewer pages={pages} />
    </div>
  );
}

