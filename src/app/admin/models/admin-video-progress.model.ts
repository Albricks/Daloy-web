export interface AdminVideoProgressDto {
  userId: string;
  fullName: string;
  email: string;

  learningModuleId: string;
  learningModuleTitle: string;

  videoId: string;
  videoTitle: string;
  videoOrder: number;

  watchedSeconds: number;
  totalSeconds: number;
  percentWatched: number;
  isCompleted: boolean;

  lastWatchedAt?: string;
}