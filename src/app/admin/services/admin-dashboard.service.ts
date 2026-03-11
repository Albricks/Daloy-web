import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { AdminKpi } from '../models/admin-kpi.model';
import { AdminUserList } from '../models/admin-user-list.model';
import { AdminUserOverallProgress } from '../models/admin-user-overall-progress.model';
import { AdminDashboardChartsDto } from '../models/admin-dashboard-charts.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // =====================================================
  // KPI OVERVIEW
  // =====================================================
  getKpis(): Observable<AdminKpi> {
    return this.http.get<AdminKpi>(
      `${this.baseUrl}/dashboard/kpis`
    );
  }

  // =====================================================
  // USER LIST (SEARCH BY FULL NAME)
  // =====================================================
  searchUsers(searchText?: string): Observable<AdminUserList[]> {
    let params = new HttpParams();

    if (searchText && searchText.trim().length > 0) {
      params = params.set('search', searchText.trim());
    }

    return this.http.get<AdminUserList[]>(
      `${this.baseUrl}/users`,
      { params }
    );
  }

  // =====================================================
  // USER OVERALL PROGRESS (DETAIL PANEL)
  // =====================================================
  getUserOverallProgress(
    userId: string
  ): Observable<AdminUserOverallProgress[]> {
    return this.http.get<AdminUserOverallProgress[]>(
      `${this.baseUrl}/users/${userId}/overall-progress`
    );
  }

  // =====================================================
  // DASHBOARD CHARTS
  // =====================================================
  getCharts(
    view: string,
    fromDate?: string,
    toDate?: string,
    moduleId?: string | null,
    lessonId?: string | null
  ): Observable<AdminDashboardChartsDto> {

    let params = new HttpParams().set('view', view);

    if (fromDate && toDate) {
      params = params
        .set('fromDate', fromDate)
        .set('toDate', toDate);
    }

    if (moduleId) {
      params = params.set('moduleId', moduleId);
    }

    if (lessonId) {
      params = params.set('lessonId', lessonId);
    }

    return this.http.get<AdminDashboardChartsDto>(
      `${this.baseUrl}/dashboard/charts`,
      { params }
    );
  }

  // =====================================================
  // MODULES
  // =====================================================
  getModules() {
    return this.http.get<any[]>(
      `${this.baseUrl}/modules`
    );
  }

getVideos() {
  return this.http.get<any[]>(
    `${this.baseUrl}/videos`
  );
}

}