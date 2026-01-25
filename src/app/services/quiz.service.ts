import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ModuleQuizDto,
  SubmitQuizDto,
  QuizResultDto
} from '../models/quiz.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly baseUrl = `${environment.apiUrl}/modulequiz`;

  constructor(private http: HttpClient) {}

  // ============================
  // GET quiz by module
  // ============================
  getQuizByModule(moduleId: string): Observable<ModuleQuizDto> {
    return this.http.get<ModuleQuizDto>(
      `${this.baseUrl}/module/${moduleId}`
    );
  }

  // ============================
  // POST submit quiz
  // ============================
  submitQuiz(payload: SubmitQuizDto): Observable<QuizResultDto> {
    return this.http.post<QuizResultDto>(
      `${this.baseUrl}/submit`,
      payload
    );
  }
}