import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SituationalService {

private baseUrl = `${environment.apiUrl}/situational-activities`;

  constructor(private http: HttpClient) {}

  // ============================
  // Get situational activity + questions
  // ============================
getActivityByModule(moduleId: string): Observable<any> {
  return this.http.get<any>(
    `${this.baseUrl}/by-module/${moduleId}`
  );
}


  // ============================
  // Submit situational answers
  // ============================
  submit(payload: {
    activityId: string;
    answers: {
      questionId: string;
      answerText: string;
    }[];
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/submit`,
      payload
    );
  }

  // ============================
  // Check if user already completed activity
  // Used by route guard
  // ============================
hasCompletedByModule(moduleId: string) {
  return this.http
    .get<{ completed: boolean }>(
      `${this.baseUrl}/by-module/${moduleId}/completed`
    )
    .pipe(map(res => res.completed));
}
}
