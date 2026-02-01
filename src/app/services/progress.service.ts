import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private readonly baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // -----------------------------
  // VIDEO PROGRESS
  // -----------------------------
  updateVideoProgress(
    videoId: string,
    watchedSeconds: number
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/video-progress`,
      {
        videoId,
        watchedSeconds
      }
    );
  }

  // -----------------------------
  // LESSON PROGRESS
  // -----------------------------
  updateLessonProgress(
    moduleId: string,
    lessonId: string,
    isCompleted: boolean,
    timeSpentSeconds: number
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/progress/lesson-progress`,
      {
        moduleId,
        lessonId,
        isCompleted,
        timeSpentSeconds
      }
    );
  }

  // -----------------------------
  // QUIZ ATTEMPT
  // -----------------------------
  submitQuizAttempt(
    moduleId: string,
    quizId: string,
    score: number,
    totalItems: number
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/progress/quiz-attempt`,
      {
        moduleId,
        quizId,
        score,
        totalItems
      }
    );
  }
}
