import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { AdminDashboardState } from '../../models/admin-dashboard-state.model';
import { AdminUserList } from '../../models/admin-user-list.model';
import { AdminDashboardChartsDto } from '../../models/admin-dashboard-charts.dto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  state: AdminDashboardState = {
    kpis: null,
    users: [],
    searchText: '',
    loadingUsers: false,
    selectedUserId: null,
    selectedUser: null,
    overallProgress: [],
    loadingOverallProgress: false,
    videoProgress: []
  };

  // ======================
  // FILTER STATE
  // ======================

  selectedModuleId: string | null = null;
  selectedLessonId: string | null = null;

  modules: any[] = [];
  lessons: any[] = [];

  // ======================
  // CHART VIEW STATE
  // ======================

  chartCache: Record<string, AdminDashboardChartsDto> = {};

  chartView: 'weekly' | 'monthly' | 'range' = 'weekly';
  chartTitle = 'Weekly Active Learners';

  fromDate?: string;
  toDate?: string;

  // ======================
  // LINE CHART
  // ======================

  activityChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  activityChartType: 'line' = 'line';

  activityChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#334155',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#334155' }
      },
      y: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#334155', precision: 0 }
      }
    }
  };

  // ======================
  // BAR CHART
  // ======================

  completionChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  completionChartType: 'bar' = 'bar';

  completionChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#334155' } },
      y: {
        beginAtZero: true,
        ticks: { color: '#334155', precision: 0 },
        grid: { color: '#e5e7eb' }
      }
    }
  };

  // ======================
  // DOUGHNUT CHARTS
  // ======================

  videoDoughnutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: []
  };

  videoDoughnutType: 'doughnut' = 'doughnut';

  videoDoughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '68%',
    plugins: { legend: { display: false } }
  };

  moduleDoughnutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: []
  };

  moduleDoughnutType: 'doughnut' = 'doughnut';

  moduleDoughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '68%',
    plugins: { legend: { display: false } }
  };

  constructor(
    private dashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadKpis();
    this.loadUsers();
    this.loadModules();
    this.loadVideos();   // videos loaded independently
    this.loadCharts();
  }

  // ======================
  // LOAD MODULES
  // ======================

  loadModules() {
    this.dashboardService.getModules().subscribe(res => {
      this.modules = res;
      this.cdr.detectChanges();
    });
  }

  // ======================
  // LOAD VIDEOS
  // ======================

  loadVideos() {
    this.dashboardService.getVideos().subscribe(res => {
      this.lessons = res;
      this.cdr.detectChanges();
    });
  }

onModuleChange(moduleId: string | null) {

  this.selectedModuleId = moduleId;

  // keep filters independent
  this.selectedLessonId = null;

  this.loadCharts();
}

onLessonChange(lessonId: string | null) {

  this.selectedLessonId = lessonId;

  // clear module filter
  this.selectedModuleId = null;

  this.loadCharts();
}

  // ======================
  // KPI DATA
  // ======================

  loadKpis(): void {
    this.dashboardService.getKpis().subscribe({
      next: res => {
        this.state.kpis = res;
        this.cdr.detectChanges();
      },
      error: () => {
        this.state.kpis = null;
        this.cdr.detectChanges();
      }
    });
  }

  // ======================
  // CHART DATA
  // ======================

loadCharts(): void {

  const moduleFilter = this.selectedLessonId ? null : this.selectedModuleId;
  const lessonFilter = this.selectedModuleId ? null : this.selectedLessonId;

  const cacheKey =
    `${this.chartView}_${this.fromDate ?? ''}_${this.toDate ?? ''}_${moduleFilter ?? ''}_${lessonFilter ?? ''}`;

  if (this.chartCache[cacheKey]) {
    this.renderCharts(this.chartCache[cacheKey]);
    return;
  }

  this.dashboardService
    .getCharts(
      this.chartView,
      this.fromDate,
      this.toDate,
      moduleFilter,
      lessonFilter
    )
    .subscribe({
      next: (charts: AdminDashboardChartsDto) => {

        this.chartCache[cacheKey] = charts;

        this.renderCharts(charts);
      }
    });
}
renderCharts(charts: AdminDashboardChartsDto) {

  const videoValues =
    charts.videoCompletionDistribution?.values?.length
      ? charts.videoCompletionDistribution.values
      : [0, 0, 0, 0];

  const moduleValues =
    charts.moduleCompletionDistribution?.values?.length
      ? charts.moduleCompletionDistribution.values
      : [0, 0, 0, 0];

  this.videoDoughnutData = {
    labels: charts.videoCompletionDistribution.labels ?? ['0–25%', '26–50%', '51–75%', '76–100%'],
    datasets: [{
      data: videoValues,
      backgroundColor: [
        '#dbeafe',
        '#bfdbfe',
        '#93c5fd',
        '#2563eb'
      ]
    }]
  };

  this.moduleDoughnutData = {
    labels: charts.moduleCompletionDistribution.labels ?? ['0–25%', '26–50%', '51–75%', '76–100%'],
    datasets: [{
      data: moduleValues,
      backgroundColor: [
        '#e0e7ff',
        '#c7d2fe',
        '#a5b4fc',
        '#4f46e5'
      ]
    }]
  };

  this.activityChartData = {
    labels: charts.weeklyActiveLearners.labels,
    datasets: [{
      data: charts.weeklyActiveLearners.values,
      label: 'Active Learners',
      fill: true,
      tension: 0.4,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.15)'
    }]
  };

  this.completionChartData = {
    labels: charts.averageQuizPercentage.labels,
    datasets: [{
      data: charts.averageQuizPercentage.values,
      label: 'Average Quiz Score (%)',
      backgroundColor: [
        '#dbeafe',
        '#bfdbfe',
        '#93c5fd',
        '#2563eb'
      ],
      borderRadius: 6
    }]
  };

  this.cdr.detectChanges();
}

  // ======================
  // CHART VIEW CHANGE
  // ======================

  changeChartView() {

    if (this.chartView === 'weekly') {
      this.chartTitle = 'Weekly Active Learners';
      this.fromDate = undefined;
      this.toDate = undefined;
    }

    if (this.chartView === 'monthly') {
      this.chartTitle = 'Monthly Active Learners';
      this.fromDate = undefined;
      this.toDate = undefined;
    }

    this.loadCharts();
  }

  applyRange() {
    if (!this.fromDate || !this.toDate) return;

    this.chartTitle = 'Active Learners (Custom Range)';
    this.chartView = 'range';

    this.loadCharts();
  }

  // ======================
  // USER LIST
  // ======================

  loadUsers(): void {

    this.state.loadingUsers = true;
    this.cdr.detectChanges();

    this.dashboardService.searchUsers(this.state.searchText).subscribe({

      next: users => {
        this.state.users = users;
        this.state.loadingUsers = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.state.users = [];
        this.state.loadingUsers = false;
        this.cdr.detectChanges();
      }

    });
  }

  onSearch(): void {
    this.loadUsers();
  }

  // ======================
  // USER DETAIL PANEL
  // ======================

  selectUser(user: AdminUserList): void {

    if (this.state.selectedUserId === user.userId) return;

    this.state.selectedUserId = user.userId;
    this.state.selectedUser = user;
    this.state.loadingOverallProgress = true;
    this.state.overallProgress = [];

    this.cdr.detectChanges();

    this.dashboardService
      .getUserOverallProgress(user.userId)
      .subscribe({

        next: progress => {
          this.state.overallProgress = progress;
          this.state.loadingOverallProgress = false;
          this.cdr.detectChanges();
        },

        error: () => {
          this.state.loadingOverallProgress = false;
          this.cdr.detectChanges();
        }

      });
  }

  clearSelection(): void {
    this.state.selectedUserId = null;
    this.state.selectedUser = null;
    this.state.overallProgress = [];
    this.cdr.detectChanges();
  }

}