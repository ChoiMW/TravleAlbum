export type PageType = 'cover' | 'intro' | 'single-photo' | 'collage' | 'outro' | 'essay';


export interface AlbumPageData {
  id: string;
  type: PageType;
  title?: string;
  subtitle?: string;
  text?: string;
  images: string[];
  date?: string;
  location?: string;
  companions?: string;
  coverTemplate?: 'minimal' | 'magazine' | 'diary';
  stats?: {
    totalMoments: number;
    totalPhotos: number;
    daysCount: number;
  };
}

