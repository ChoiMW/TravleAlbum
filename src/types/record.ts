export interface TravelMoment {
  id: string;
  images: string[];
  text: string;
  mood?: string;
  timestamp: string; // ISO or human readable
  location?: string;
}
