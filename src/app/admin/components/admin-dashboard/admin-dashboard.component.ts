import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

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
    loadingOverallProgress: false
  };

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
        grid: {
          color: '#e5e7eb'
        },
        ticks: {
          color: '#334155'
        }
      },
      y: {
        grid: {
          color: '#e5e7eb'
        },
        ticks: {
          color: '#334155',
          precision: 0
        }
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
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#334155'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#334155',
          precision: 0
        },
        grid: {
          color: '#e5e7eb'
        }
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
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#334155',
        font: { size: 12 }
      }
    }
  }
};

moduleDoughnutData: ChartConfiguration<'doughnut'>['data'] = {
  labels: [],
  datasets: []
};

moduleDoughnutType: 'doughnut' = 'doughnut';

moduleDoughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
  responsive: true,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#334155',
        font: { size: 12 }
      }
    }
  }
};

  constructor(
    private dashboardService: AdminDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadKpis();
    this.loadUsers();
    this.loadCharts();
  }

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

  loadCharts(): void {
    this.dashboardService.getCharts().subscribe({
      next: (charts: AdminDashboardChartsDto) => {
        this.videoDoughnutData = {
          labels: charts.videoCompletionDistribution.labels,
          datasets: [
            {
              data: charts.videoCompletionDistribution.values,
              backgroundColor: [
                '#dbeafe',
                '#bfdbfe',
                '#93c5fd',
                '#2563eb'
              ]
            }
          ]
        };

        this.moduleDoughnutData = {
          labels: charts.moduleCompletionDistribution.labels,
          datasets: [
            {
              data: charts.moduleCompletionDistribution.values,
              backgroundColor: [
                '#e0e7ff',
                '#c7d2fe',
                '#a5b4fc',
                '#4f46e5'
              ]
            }
          ]
        };
        
        this.activityChartData = {
          labels: charts.weeklyActiveLearners.labels,
          datasets: [
            {
              data: charts.weeklyActiveLearners.values,
              label: 'Active Learners',
              fill: true,
              tension: 0.4,
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              pointBackgroundColor: '#2563eb',
              pointBorderColor: '#ffffff',
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        };

        this.completionChartData = {
          labels: charts.moduleCompletionDistribution.labels,
          datasets: [
            {
              data: charts.moduleCompletionDistribution.values,
              label: 'Learners',
              backgroundColor: [
                '#dbeafe',
                '#bfdbfe',
                '#93c5fd',
                '#2563eb'
              ],
              borderRadius: 6
            }
          ]
        };

        this.cdr.detectChanges();
      }
    });
  }

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
