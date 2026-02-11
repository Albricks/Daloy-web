export interface AdminUserOverallProgress {
  userId: string;
  fullName: string;
  email: string;

  moduleId: string;
  moduleTitle: string;

  moduleStatus: number;
  moduleProgressPercent: number;
  moduleCompletedAt?: string | null;

  situationalCompleted: boolean;
  situationalCompletedAt?: string | null;

  quizPassed: boolean;
  lastQuizAttemptAt?: string | null;

  avgVideoPercentWatched?: number | null;
  allVideosCompleted: boolean;
}
