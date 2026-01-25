import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModuleListDto } from '../models/module-list.model';
import { ModulePreviewDto } from '../models/module-preview.model';
import { LessonDto } from '../models/lesson.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  private baseUrl = `${environment.apiUrl}/modules`;

  constructor(private http: HttpClient) {}

  getModules(): Observable<ModuleListDto[]> {
    return this.http.get<ModuleListDto[]>(this.baseUrl);
  }

  getModule(id: string): Observable<ModulePreviewDto> {
    return this.http.get<ModulePreviewDto>(`${this.baseUrl}/${id}`);
  }

  getLessons(moduleId: string): Observable<LessonDto[]> {
    return this.http.get<LessonDto[]>(`${this.baseUrl}/${moduleId}/lessons`);
  }

  getLessonHtml(contentUrl: string): Observable<string> {
    return this.http.get(contentUrl, { responseType: 'text' });
  }
}