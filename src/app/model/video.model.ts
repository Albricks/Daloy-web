export interface Video {
  id: number;
  title: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'not-started';
  thumbnail: string;
}
