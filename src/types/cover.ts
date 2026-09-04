export interface CoverData {
  title: string;
  subtitle: string;
  location: string;
  date: string;
  companions: string;
  imageUrl: string;
  fontStyle?: 'sans' | 'serif' | 'mono';
  colorTone?: 'original' | 'warm' | 'cool' | 'bw';
  showCompanions?: boolean;
  showCharacter?: boolean;
}
