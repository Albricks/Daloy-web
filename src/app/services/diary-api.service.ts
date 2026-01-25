import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DiaryEntry } from '../models/diary.model';

export interface DiarySummary {
  totalBudget: number;
  totalSpent: number;
  totalSaved: number;
  entryCount: number;
}

@Injectable({ providedIn: 'root' })
export class DiaryApiService {

  private readonly baseUrl = environment.apiUrl + '/budget-diary';

  constructor(private http: HttpClient) {}

  // ============================
  // ENTRIES
  // ============================
  getAll(): Observable<DiaryEntry[]> {
    return this.http.get<DiaryEntry[]>(this.baseUrl);
  }

  upsert(entry: {
    entryDate: string;
    budget: number;
    spent: number;
    notes?: string;
  }): Observable<DiaryEntry> {
    return this.http.post<DiaryEntry>(this.baseUrl, entry);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ============================
  // SUMMARY
  // ============================
  getWeeklySummary(): Observable<DiarySummary> {
    return this.http.get<DiarySummary>(`${this.baseUrl}/summary/weekly`);
  }

  getMonthlySummary(): Observable<DiarySummary> {
    return this.http.get<DiarySummary>(`${this.baseUrl}/summary/monthly`);
  }

  // ============================
  // EXPORT
  // ============================
  exportCsv(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/csv`, {
      responseType: 'blob'
    });
  }
}