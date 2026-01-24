// models/video.model.ts
export type VideoStatus = 'not-started' | 'in-progress' | 'completed';

export interface Video {
  id: string;
  title: string;
  duration: string;          
  status: VideoStatus;
  thumbnailUrl: string;
  moduleId: number;
  order: number;
}
